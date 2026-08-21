document.addEventListener("DOMContentLoaded", () => {
  // ====== 1. 地圖初始化 ======
  const map = L.map("mapContainer", { zoomControl: true }).setView(
    [25.009220444300375, 121.46480408095688],
    12
  );
  window.EIMPMap = map;

  // ✅ 追蹤所有「目前開著」的 popup（autoClose:false 時會同時存在多個）
  const openPopups = new Set();

  map.on("popupopen", (e) => {
    openPopups.add(e.popup);
  });

  map.on("popupclose", (e) => {
    openPopups.delete(e.popup);
  });

  // ✅ 關掉所有已開 popup（真正保證清乾淨）
  function closeAllPopups() {
    if (openPopups.size === 0) return;

    openPopups.forEach((p) => {
      try {
        p.remove();
      } catch (err) {}
    });
    openPopups.clear();
  }

  function hasAnyPopupOpen() {
    return openPopups.size > 0;
  }

  // --- 底圖 ---
  // 電子地圖：沿用 OSM
  const baseVector = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 19,
      attribution: "© OpenStreetMap contributors",
    }
  );

  // 正射影像圖：國土測繪中心 WMTS（PHOTO2 / EPSG:3857）
  const baseOrtho = L.tileLayer(
    "https://wmts.nlsc.gov.tw/wmts/PHOTO2/default/EPSG:3857/{z}/{y}/{x}",
    {
      maxZoom: 19,
      attribution: "© 內政部國土測繪中心",
      crossOrigin: true,
    }
  ).addTo(map);

  // ====== 1-1. Marker Icon 設定 ======
  function escapeMarkerAttr(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function createNormalMarkerIcon(iconUrl) {
    return L.icon({
      iconUrl,
      iconSize: [26, 26],
      iconAnchor: [13, 26],
      popupAnchor: [0, -24],
    });
  }


  function normalizeVehicleHeading(deg) {
    return ((deg % 360) + 360) % 360;
  }

  function snapVehicleHeadingTo8Direction(deg) {
    const normalized = normalizeVehicleHeading(deg);
    return (Math.round(normalized / 45) * 45) % 360;
  }

  function getVehicleHeading(item) {
    const raw = item?.heading ?? item?.direction ?? item?.bearing;
    const heading = Number(raw);
    if (!Number.isFinite(heading)) return null;
    return snapVehicleHeadingTo8Direction(heading);
  }

  function isVehicleMoving(item) {
    const status = String(item?.status || item?.movingStatus || "").trim().toLowerCase();
    if (status === "stopped" || status === "stop" || status === "停車" || status === "停止" || status === "靜止") return false;
    return getVehicleHeading(item) !== null;
  }

  function createVehicleMarkerIcon(item) {
    const heading = getVehicleHeading(item);
    const arrowHtml = isVehicleMoving(item)
      ? `<span class="vehicle-marker__arrow-wrap" style="--vehicle-heading: ${heading}deg"><span class="vehicle-marker__arrow vehicle-marker__arrow--gray"></span></span>`
      : "";
    return L.divIcon({
      className: "eimp-vehicle-div-icon",
      html: `<div class="vehicle-marker">${arrowHtml}<img src="images/car.png" class="vehicle-marker__img" alt="" /></div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 29],
      tooltipAnchor: [0, -31],
    });
  }

  function bindVehiclePlateLabel(marker, item) {
    const plateNo = String(item?.plateNo || item?.plate || item?.licensePlate || "-");
    marker.bindTooltip(escapeMarkerAttr(plateNo), {
      direction: "top",
      offset: [0, 10],
      className: "vehicle-plate-label",
      opacity: 1,
      permanent: false,
      sticky: false,
    });
    marker.on("click", (event) => {
      if (event?.originalEvent && window.L?.DomEvent) {
        L.DomEvent.stop(event.originalEvent);
      }

      const markerLatLng = marker.getLatLng();
      const nearbyItems = findNearbyMarkers(markerLatLng);

      // 車輛維持視覺最上層；若下方有案件/事業圖層，點擊時轉交給原本的重疊 popup 邏輯。
      if (nearbyItems.length > 1) {
        map.setView(markerLatLng, map.getZoom(), { animate: false });
        openOverlapChooser(markerLatLng, nearbyItems);
        return;
      }

      if (nearbyItems.length === 1) {
        handleMarkerClickWithOverlap(nearbyItems[0]);
        return;
      }

      marker.openTooltip();
    });
  }

  const airCaseIcon = createNormalMarkerIcon("images/民眾陳情.png");
  const fireCaseIcon = createNormalMarkerIcon("images/火災報案.png");
  const regBusinessIcon = createNormalMarkerIcon("images/工廠許可(列管).png");
  const nonRegBusinessIcon = createNormalMarkerIcon("images/工廠許可.png");

  const normalCaseIconMap = {
    air: airCaseIcon,
    fire: fireCaseIcon,
    regBusiness: regBusinessIcon,
    nonRegBusiness: nonRegBusinessIcon,
  };

  const caseIconUrlMap = {
    air: "images/民眾陳情.png",
    fire: "images/火災報案.png",
    regBusiness: "images/工廠許可(列管).png",
    nonRegBusiness: "images/工廠許可.png",
  };

  const warningCaseIconCache = new Map();

  function createWarningMarkerIcon(iconUrl, type = "default") {
    const warningClass = type === "fire" ? "warning-marker--fire" : "warning-marker--default";
    const cacheKey = `${iconUrl}::${warningClass}`;
    if (warningCaseIconCache.has(cacheKey)) return warningCaseIconCache.get(cacheKey);

    const icon = L.divIcon({
      className: `eimp-warning-div-icon ${warningClass}`,
      html: `<div class="warning-marker"><img src="${escapeMarkerAttr(iconUrl)}" class="marker-img" alt="" /></div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 31],
      popupAnchor: [0, -29],
    });

    warningCaseIconCache.set(cacheKey, icon);
    return icon;
  }

  function shouldUseWarningRipple(item, type) {
  return item?.rippleWarning === true;
}

  function getCaseMarkerIcon(type, item) {
    if (!shouldUseWarningRipple(item, type)) return normalCaseIconMap[type] || fireCaseIcon;
    return createWarningMarkerIcon(caseIconUrlMap[type] || "images/marker.png", type);
  }

  const locationIcon = L.icon({
    iconUrl: "images/marker.png",
    iconSize: [28, 28],
    iconAnchor: [14, 28],
  });


  // ====== 1-2. 風場圖層 ======
  let windLayer = null;
  let windDataCache = null;
  const WIND_DATA_URL = "../out/wind.json";

  async function loadWindData() {
    if (windDataCache) return windDataCache;

    const res = await fetch(WIND_DATA_URL, { cache: "no-cache" });
    if (!res.ok) {
      throw new Error(`風場資料讀取失敗：${res.status} ${res.statusText}`);
    }

    windDataCache = await res.json();
    return windDataCache;
  }

  function createWindLayer(windData) {
    return L.velocityLayer({
      data: windData,
      displayValues: true,
      lineWidth: 1,
      velocityScale: 0.015,
      particleMultiplier: 1 / 2000,
      particleAge: 50,
      colorScale: [
        "#FFFFFF"
      ],
      displayOptions: {
        velocityType: "Wind",
        position: "bottomleft",
        showCardinal: true,
        emptyString: "No wind data"
      },
      maxVelocity: 15
    });
  }

  async function toggleWindLayer(show) {
    if (!show) {
      if (windLayer && map.hasLayer(windLayer)) {
        map.removeLayer(windLayer);
      }
      return;
    }

    if (!L.velocityLayer) {
      console.error("leaflet-velocity 未載入");
      alert("風場套件未載入，請確認 HTML 是否有引入 leaflet-velocity。");
      return;
    }

    try {
      if (!windLayer) {
        const windData = await loadWindData();
        windLayer = createWindLayer(windData);
      }

      if (!map.hasLayer(windLayer)) {
        windLayer.addTo(map);
      }
    } catch (err) {
      console.error(err);
      alert("風場資料載入失敗，請確認 wind2.json 路徑是否正確。");
      const windToggle = document.querySelector('.layer-toggle[data-layer="windField"]');
      if (windToggle) windToggle.checked = false;
    }
  }


  // ====== 2. 模擬相關變數 / DOM ======
  let currentLatLng = null;
  let locationMarker = null;
  let locationLocked = false;
  let lastSimPopupInfo = null;
  let dispersionLayer = null;
  let trajectoryLayer = null;
  let dispersionBaseRadius = 2000;

  const modalBackdrop = document.getElementById("modalBackdrop");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const btnCancel = document.getElementById("btnCancel");
  const btnRun = document.getElementById("btnRun");
  const coordLabel = document.getElementById("coordLabel");
  const modeOptions = document.querySelectorAll(".mode-option");

  const stackHeightInput = document.getElementById("stackHeightInput");
  const emissionLevelSelect = document.getElementById("emissionLevelSelect");

  // ✅ 改：事件時間 -> 小時前
  const eventHoursAgoInput = document.getElementById("eventHoursAgoInput");

  const emissionDurationInput = document.getElementById("emissionDurationInput");
  const backwardHoursInput = document.getElementById("backwardHoursInput");

  const simLayerBar = document.getElementById("simLayerBar");
  const simTimeSelect = document.getElementById("simTimeSelect");
  const closeSimLayerBtn = document.getElementById("closeSimLayerBtn");
  const playSimBtn = document.getElementById("playSimBtn");
  const simNowTime = document.getElementById("simNowTime");

  const dispersionSection = document.getElementById("dispersionSection");
  const trajectorySection = document.getElementById("trajectorySection");

  // ====== 2-1. 事業詳細資料儀表板 DOM ======
  const businessDetailPanel = document.getElementById("businessDetailPanel");
  const businessDetailCloseBtn = document.getElementById("businessDetailCloseBtn");
  const businessPermitTypeSelect = document.getElementById("businessPermitTypeSelect");
  const businessWaterAccordion = document.getElementById("businessWaterAccordion");
  const businessWaterTemplateGeneral = document.getElementById("businessWaterTemplateGeneral");
  const businessWaterTemplateLivestock = document.getElementById("businessWaterTemplateLivestock");
  const businessWaterTemplateCommunity = document.getElementById("businessWaterTemplateCommunity");
  const businessToxicAccordion = document.getElementById("businessToxicAccordion");
  const businessCEMSAccordion = document.getElementById("businessCEMSAccordion");
  const businessCWMSAccordion = document.getElementById("businessCWMSAccordion");
  let currentBusinessDetailItem = null;

  const businessPermitBody = businessDetailPanel?.querySelector(".permit-body");
  [businessToxicAccordion, businessCEMSAccordion, businessCWMSAccordion].forEach((panel) => {
    if (panel && businessPermitBody && panel.parentElement !== businessPermitBody) {
      businessPermitBody.appendChild(panel);
    }
  });

  const businessCemsData = {
    SOx: {
      standard: "80",
      unit: "ppm",
      stacks: [
        { tag: "P001", cls: "tag-red", value: "92", text: "主要排放煙道即時監測資料" },
        { tag: "P002", cls: "tag-green", value: "58", text: "備援煙道即時監測資料" },
        { tag: "P003", cls: "tag-gray", value: "--", text: "設備維護中" },
      ],
    },
    NOx: {
      standard: "180",
      unit: "ppm",
      stacks: [
        { tag: "P001", cls: "tag-green", value: "146", text: "主要排放煙道即時監測資料" },
        { tag: "P002", cls: "tag-green", value: "120", text: "備援煙道即時監測資料" },
        { tag: "P003", cls: "tag-gray", value: "--", text: "設備維護中" },
      ],
    },
    PM: {
      standard: "30",
      unit: "mg/Nm³",
      stacks: [
        { tag: "P001", cls: "tag-green", value: "18", text: "主要排放煙道即時監測資料" },
        { tag: "P002", cls: "tag-red", value: "34", text: "備援煙道即時監測資料" },
        { tag: "P003", cls: "tag-gray", value: "--", text: "設備維護中" },
      ],
    },
  };

  const businessCwmsData = {
    PH: {
      standard: "6-9",
      unit: "",
      stacks: [
        { tag: "W001", cls: "tag-green", value: "7.1", unit: "", text: "放流水監測井即時資料" },
        { tag: "W002", cls: "tag-green", value: "7.4", unit: "", text: "處理設施出口即時資料" },
        { tag: "W003", cls: "tag-gray", value: "--", unit: "", text: "設備維護中" },
      ],
    },
    COD: {
      standard: "160",
      unit: "mg/L",
      stacks: [
        { tag: "W001", cls: "tag-green", value: "108", unit: "mg/L", text: "放流水監測井即時資料" },
        { tag: "W002", cls: "tag-green", value: "132", unit: "mg/L", text: "處理設施出口即時資料" },
        { tag: "W003", cls: "tag-gray", value: "--", unit: "mg/L", text: "設備維護中" },
      ],
    },
    SS: {
      standard: "30",
      unit: "mg/L",
      stacks: [
        { tag: "W001", cls: "tag-red", value: "42", unit: "mg/L", text: "放流水監測井即時資料" },
        { tag: "W002", cls: "tag-green", value: "24", unit: "mg/L", text: "處理設施出口即時資料" },
        { tag: "W003", cls: "tag-gray", value: "--", unit: "mg/L", text: "設備維護中" },
      ],
    },
  };

  function setText(field, value) {
    window.EIMPUI.setField(field, value, businessDetailPanel || document);
  }

  function switchBusinessAccordion(type) {
    if (!businessWaterAccordion || !businessToxicAccordion || !businessCEMSAccordion || !businessCWMSAccordion) return;
    businessWaterAccordion.classList.add("hidden");
    businessToxicAccordion.classList.add("hidden");
    businessCEMSAccordion.classList.add("hidden");
    businessCWMSAccordion.classList.add("hidden");

    if (type === "water") businessWaterAccordion.classList.remove("hidden");
    if (type === "toxic") businessToxicAccordion.classList.remove("hidden");
    if (type === "CEMS") businessCEMSAccordion.classList.remove("hidden");
    if (type === "CWMS") businessCWMSAccordion.classList.remove("hidden");
  }

  function configureBusinessPermitTypes(item) {
    const permits = getBusinessPermitAvailability(item);
    if (businessPermitTypeSelect) {
      [["CEMS", "CEMS"], ["CWMS", "CWMS"]].forEach(([value, label]) => {
        if (businessPermitTypeSelect.querySelector(`option[value="${value}"]`)) return;
        const option = document.createElement("option");
        option.value = value;
        option.textContent = label;
        businessPermitTypeSelect.appendChild(option);
      });
      const waterOption = businessPermitTypeSelect.querySelector('option[value="water"]');
      const toxicOption = businessPermitTypeSelect.querySelector('option[value="toxic"]');
      const cemsOption = businessPermitTypeSelect.querySelector('option[value="CEMS"]');
      const cwmsOption = businessPermitTypeSelect.querySelector('option[value="CWMS"]');
      if (waterOption) {
        waterOption.hidden = !permits.hasWater;
        waterOption.disabled = !permits.hasWater;
      }
      if (toxicOption) {
        toxicOption.hidden = !permits.hasToxic;
        toxicOption.disabled = !permits.hasToxic;
      }
      if (cemsOption) {
        cemsOption.hidden = !permits.hasCEMS;
        cemsOption.disabled = !permits.hasCEMS;
      }
      if (cwmsOption) {
        cwmsOption.hidden = !permits.hasCWMS;
        cwmsOption.disabled = !permits.hasCWMS;
      }
    }
    return permits;
  }

  function renderBusinessCems(key) {
    const data = businessCemsData[key];
    if (!data) return;

    setText("businessCemsPollutantName", key);
    setText("businessCemsStandardValue", data.standard);

    const stackList = document.getElementById("businessCemsStackList");
    if (!stackList) return;

    stackList.innerHTML = data.stacks.map((stack) => `
      <div class="cems-stack-row">
        <div class="cems-stack-tag ${stack.cls}">${stack.tag}</div>
        <div class="cems-stack-info">
          <div class="cems-stack-title">監測值 <span class="cems-stack-value">${stack.value}</span>${data.unit ? ` <span class="cems-stack-unit">${data.unit}</span>` : ""}</div>
          <div class="cems-stack-text">${stack.text}</div>
        </div>
      </div>
    `).join("");
  }

  function renderBusinessCwms(key) {
    const data = businessCwmsData[key];
    if (!data) return;

    setText("businessCwmsPollutantName", key);
    setText("businessCwmsStandardValue", data.standard);
    setText("businessCwmsUnit", data.unit);

    const stackList = document.getElementById("businessCwmsStackList");
    if (!stackList) return;

    stackList.innerHTML = data.stacks.map((stack) => `
      <div class="cems-stack-row">
        <div class="cems-stack-tag ${stack.cls}">${stack.tag}</div>
        <div class="cems-stack-info">
          <div class="cems-stack-title">監測值 <span class="cems-stack-value">${stack.value}</span>${stack.unit ? ` <span class="cems-stack-unit">${stack.unit}</span>` : ""}</div>
          <div class="cems-stack-text">${stack.text}</div>
        </div>
      </div>
    `).join("");
  }

  function inferWaterBusinessLayoutType(item) {
    const text = `${item.businessName || ""} ${item.businessCategory || ""} ${item.industryName || ""}`;

    if (/畜牧|牧場/.test(text)) return "livestock";
    if (/社區|大樓|住宅|公寓|集合住宅/.test(text)) return "community";
    return "general";
  }

  function getWaterBusinessTemplate(type) {
    if (type === "livestock") return businessWaterTemplateLivestock;
    if (type === "community") return businessWaterTemplateCommunity;
    return businessWaterTemplateGeneral;
  }

  function renderWaterBusinessLayout(item) {
    if (!businessWaterAccordion) return;
    const layoutType = inferWaterBusinessLayoutType(item);
    const template = getWaterBusinessTemplate(layoutType);
    businessWaterAccordion.innerHTML = template ? template.innerHTML : "";
    window.EIMPBusinessWaterQuality?.render?.(businessWaterAccordion, item);
  }

  function populateBusinessDetail(item) {
    if (!item) return;
    setText("businessDetailTitle", item.businessName || "列管事業詳細資料");
    setText("businessName", item.businessName || "-");
    setText("businessLabel", item.businesslabel || "-");
    setText("otherBusinessName", item.otherbusinessName || "-");
    setText("leaderName", item.leadername || "-");
    setText("waterPermitNo", item.waterpermitNo || "-");
    setText("toxicPermitNo", item.toxicpermitNo || "-");
    setText("permitTime", item.permittime || "-");
    setText("toxicPermitTime", item.toxicpermittime || "-");
    setText("stockNo", item.stockno || "-");
    setText("applyTime", item.applytime || "-");
    setText("applyCount", item.applycount || "-");
    setText("permitCount", item.permitcount || "-");
    setText("manageName", item.managename || "-");
    setText("manageTel", item.managetel || "-");
    setText("controlNo", item.controlNo || "-");
    setText("controlNo2", item.controlNo || "-");
    setText("otherControlNo", item.othercontrolNo || "-");
    setText("unifiedNo", item.unifiedNo || "-");
    setText("unifiedNo2", item.unifiedNo || "-");
    setText("address", item.address || "-");
    setText("address2", item.address || "-");
    setText("manageAddress", item.manageaddress || "-");
    setText("industrialPark", item.industrialParkName || "-");
    setText("industryName", item.industryName || "-");
    setText("regulatedType", item.regulatedType || "-");
    setText("inspectManageNo", item.unifiedNo || "-");
    setText("tempManageNo", item.tempManageNo || "-");
    setText("factoryLicenseNo", item.factoryLicenseNo || "-");
    setText("lat", item.lat != null ? Number(item.lat).toFixed(6) : "-");
    setText("lng", item.lng != null ? Number(item.lng).toFixed(6) : "-");

    setText("waterBusinessName", item.businessName || "-");
    setText("waterControlNo", item.controlNo || "-");
    setText("waterAddress", item.address || "-");
    setText("waterRegType", item.regulatedType || "-");
    setText("landNo", item.landNo || "-");
    setText("gateTwdX", item.gateTwdX || "-");
    setText("gateTwdY", item.gateTwdY || "-");
    setText("outletCode", item.outletCode || "D01");
    setText("outletCodeWgs", item.outletCode || "D01");
    setText("outletTwdX", item.outletTwdX || "-");
    setText("outletTwdY", item.outletTwdY || "-");
    setText("outletLat", item.outletLat != null ? Number(item.outletLat).toFixed(6) : "-");
    setText("outletLng", item.outletLng != null ? Number(item.outletLng).toFixed(6) : "-");
    setText("businessCategory", item.businessCategory || item.businesstype || "-");
    setText("waterApplyType", item.waterApplyType || "簡易排放許可文件");
    setText("waterOutletCode", item.outletCode || "D01");
    setText("waterApprovedFlow", item.waterApprovedFlow || "24.000");
    setText("detailotherLincenseNo", item.otherLincenseNo || "-");
    setText("toxicBusinessName", item.businessName || "-");
    setText("toxicControlNo", item.controlNo || "-");
    setText("toxicUnifiedNo", item.unifiedNo || "-");
    setText("toxicAddress", item.address || "-");
    setText("toxicIndustryName", item.industryName || "-");
    setText("toxicRegulatedType", item.regulatedType || "-");
    setText("toxicOperatorName", item.businessName || "-");
    setText("toxicInspectManageNo", item.inspectManageNo || "-");
    setText("toxicTempManageNo", item.tempManageNo || "-");
    setText("toxicChemicalNo", item.toxicChemicalNo || "098-01");
    setText("toxicChemicalName", item.toxicChemicalName || "二甲基甲醯胺");
    setText("toxicFactoryLicenseNo", item.factoryLicenseNo || "-");
    setText("toxicIndustrialPark", item.industrialParkName || "-");
  }

  function openBusinessDetailPanel(item, requestedType = null) {
    if (!businessDetailPanel || !item) return;
    const permits = configureBusinessPermitTypes(item);
    if (!permits.hasWater && !permits.hasToxic && !permits.hasCEMS && !permits.hasCWMS) return;
    currentBusinessDetailItem = item;
    if (permits.hasWater) renderWaterBusinessLayout(item);
    populateBusinessDetail(item);
    const availableTypes = [
      permits.hasWater && "water",
      permits.hasToxic && "toxic",
      permits.hasCEMS && "CEMS",
      permits.hasCWMS && "CWMS",
    ].filter(Boolean);
    const initialPermitType = availableTypes.includes(requestedType) ? requestedType : availableTypes[0];
    if (businessPermitTypeSelect) businessPermitTypeSelect.value = initialPermitType;
    switchBusinessAccordion(initialPermitType);
    businessDetailPanel.classList.add("is-open");
    businessDetailPanel.setAttribute("aria-hidden", "false");
    renderBusinessCems("SOx");
    renderBusinessCwms("PH");
  }

  function closeBusinessDetailPanel() {
    if (!businessDetailPanel) return;
    businessDetailPanel.classList.remove("is-open");
    businessDetailPanel.setAttribute("aria-hidden", "true");
    currentBusinessDetailItem = null;
  }


  // ====== 3. 案件資料 ======
  const airCases = [
    {
      id: "12345678",
      time: "12/02 15:40",
      status: "案件接收(手持)",
      address: "新北市板橋區OO路",
      lat: 25.0132,
      lng: 121.4637,
      areaId: "Banqiao",
    },
    {
      id: "23456789",
      time: "12/02 13:49",
      status: "案件稽查中",
      address: "新北市中和區XX路XX樓",
      lat: 24.9998,
      lng: 121.4932,
      areaId: "Zhonghe",
    },
    {
      id: "34567890",
      time: "12/02 13:22",
      status: "案件稽查中",
      address: "新北市蘆洲區XX路",
      lat: 25.0865,
      lng: 121.4803,
      areaId: "Luzhou",
    },
    {
      id: "45678901",
      time: "12/02 12:19",
      status: "案件審核完成",
      address: "新北市中和區XX路OO樓",
      lat: 24.9975,
      lng: 121.5051,
      areaId: "Zhonghe",
    },
  ];

  const fireCases = [
    {
      id: "亂碼-1",
      time: "12/02 13:42",
      fireType: "石化廠",
      address: "新北市中和區△△路OO巷",
      lat: 24.9998,
      lng: 121.4682,
      areaId: "Zhonghe",
      rippleWarning: true,
    },
    {
      id: "亂碼-2",
      time: "12/02 11:00",
      fireType: "查看案件",
      address: "新北市汐止區XX路OO號△樓",
      lat: 25.0646,
      lng: 121.6623,
      areaId: "Xizhi",
    },
    {
      id: "亂碼-3",
      time: "12/01 22:30",
      fireType: "集合住宅",
      address: "新北市樹林區XX路OO社區",
      lat: 24.9916,
      lng: 121.4242,
      areaId: "Shulin",
    },
    {
      id: "亂碼-4",
      time: "12/01 18:19",
      fireType: "平地",
      address: "新北市瑞芳區OO路",
      lat: 25.1320,
      lng: 121.7750,
      areaId: "Ruifang",
    },
  ];


  const FIRE_DISPATCH_TEAM_NAMES = {
    "一分隊": "第一稽查分隊",
    "二分隊": "第二稽查分隊",
    "三分隊": "第三稽查分隊",
    "四分隊": "第四稽查分隊",
    "五分隊": "第五稽查分隊",
    "六、七分隊": "第六、七稽查分隊",
  };

  // 火災調度用車機資料：每一筆對應圖片中的一列「所屬轄區（改派）」規則。
  // 車機被派出執行火災任務時，responsibleAreas 由 designatedTeamCodes 接手。
  const vehicleCases = [
    {
      id: "VH-011",
      plateNo: "A11-0001",
      lat: 25.0062,
      lng: 121.4692,
      heading: 120,
      status: "moving",
      teamCode: "一分隊",
      responsibleAreas: ["板橋區", "土城區", "三峽區"],
      designatedTeamCodes: ["二分隊"],
    },
    {
      id: "VH-021",
      plateNo: "B21-2001",
      lat: 24.9875,
      lng: 121.4961,
      heading: null,
      status: "stopped",
      teamCode: "二分隊",
      responsibleAreas: ["中和區", "永和區"],
      designatedTeamCodes: ["一分隊"],
    },
    {
      id: "VH-022",
      plateNo: "B22-2002",
      lat: 24.9675,
      lng: 121.5412,
      heading: 45,
      status: "moving",
      teamCode: "二分隊",
      responsibleAreas: ["新店區", "深坑區", "石碇區", "烏來區", "坪林區"],
      designatedTeamCodes: ["三分隊"],
    },
    {
      id: "VH-031",
      plateNo: "C31-3001",
      lat: 25.1086,
      lng: 121.8074,
      heading: 270,
      status: "moving",
      teamCode: "三分隊",
      responsibleAreas: ["雙溪區", "平溪區", "貢寮區", "瑞芳區"],
      designatedTeamCodes: ["三分隊"],
    },
    {
      id: "VH-032",
      plateNo: "C32-3002",
      lat: 25.0646,
      lng: 121.6623,
      heading: 315,
      status: "moving",
      teamCode: "三分隊",
      responsibleAreas: ["汐止區", "金山區", "萬里區"],
      designatedTeamCodes: ["六、七分隊"],
    },
    {
      id: "VH-041",
      plateNo: "D41-4001",
      lat: 25.079,
      lng: 121.474,
      heading: 0,
      status: "moving",
      teamCode: "四分隊",
      responsibleAreas: ["蘆洲區", "五股區", "三重區"],
      designatedTeamCodes: ["六、七分隊"],
    },
    {
      id: "VH-051",
      plateNo: "E51-5001",
      lat: 25.02,
      lng: 121.43,
      heading: 180,
      status: "moving",
      teamCode: "五分隊",
      responsibleAreas: ["新莊區", "樹林區", "鶯歌區"],
      designatedTeamCodes: ["一分隊"],
    },
    {
      id: "VH-061",
      plateNo: "F61-6001",
      lat: 25.1743,
      lng: 121.4356,
      heading: 90,
      status: "moving",
      teamCode: "六、七分隊",
      responsibleAreas: ["淡水區", "三芝區", "石門區"],
      designatedTeamCodes: ["四分隊"],
    },
    {
      id: "VH-062",
      plateNo: "F62-6002",
      lat: 25.1492,
      lng: 121.4066,
      heading: 135,
      status: "moving",
      teamCode: "六、七分隊",
      responsibleAreas: ["八里區"],
      designatedTeamCodes: ["四分隊"],
    },
    {
      id: "VH-071",
      plateNo: "G71-7001",
      lat: 25.0796,
      lng: 121.3889,
      heading: null,
      status: "stopped",
      teamCode: "六、七分隊",
      responsibleAreas: ["林口區"],
      designatedTeamCodes: ["四分隊"],
    },
    {
      id: "VH-072",
      plateNo: "G72-7002",
      lat: 25.0586,
      lng: 121.4321,
      heading: null,
      status: "stopped",
      teamCode: "六、七分隊",
      responsibleAreas: ["泰山區"],
      designatedTeamCodes: ["五分隊"],
    },
  ];

  const regBusinessCases = [
    {
      id: "RB0001",
      controlNo: "F1234567",
      businessName: "土城金屬工業有限公司",
      othercontrolNo: "F9876543",
      otherbusinessName: "金屬實業有限公司",
      unifiedNo: "12345678",
      industrialParkName: "土城工業區",
      industryName: "電鍍業",
      regulatedType: "水、毒",
      waterpermitNo:"新北市環水許字 第12345-678號",
      toxicpermitNo:"新北市毒許字第000031號",
      otherLincenseNo:"新北市環水許字第04123-04號",
      permittime:"自113年02月02日起至117年10月31日止",
      toxicpermittime:"自2021-09-14起至2027-01-08止",
      applytime:"113年01月31日",
      inspectManageNo: "202603310001",
      tempManageNo: "A2026033100001",
      factoryLicenseNo: "99-123456-78",
      address: "新北市土城區OO路100號",
      businesstype: "金屬加工業",
      waterBusinessType: "general",
      lat: 24.9735,
      lng: 121.4442,
      areaId: "Tucheng",
      businesslabel:"一般事業",
    },
    /*{
      id: "RB0002",
      controlNo: "F2345678",
      businessName: "新北測試列管事業二廠",
      unifiedNo: "23456789",
      industrialParkName: "中和工業區",
      industryName: "塑膠製品製造業",
      regulatedType: "水、空",
      waterpermitNo:"新北市環水許字 第12345-679號",
      otherLincenseNo:"農水桃園字第1138225600號",
      inspectManageNo: "202603310002",
      tempManageNo: "A2026033100002",
      factoryLicenseNo: "99-613640-00",
      address: "新北市中和區XX路88號",
      businesstype: "塑膠製造業",
      waterBusinessType: "general",
      lat: 24.9991,
      lng: 121.4862,
      areaId: "Zhonghe",
    },
    {
      id: "RB0003",
      controlNo: "F3456789",
      businessName: "新北測試列管事業三廠",
      unifiedNo: "34567890",
      industrialParkName: "新莊工業區",
      industryName: "化學材料製造業",
      regulatedType: "毒",
      waterpermitNo:"新北市環水許字 第12345-789號",
      otherLincenseNo:"農水桃園字第1138225600號",
      inspectManageNo: "202603310003",
      tempManageNo: "A2026033100003",
      factoryLicenseNo: "FAC-001260",
      address: "新北市新莊區△△路66號",
      businesstype: "西藥製造業",
      waterBusinessType: "community",
      lat: 25.0362,
      lng: 121.4549,
      areaId: "Xinzhuang",
    },*/
    {
      id: "RB0004",
      controlNo: "F4567890",
      controlNo2: "F4567890",
      businessName: "樹林畜牧場",
      leadername:"林OO",
      waterpermitNo:"新北市環水許字 第12345-890號",
      permittime:"自107年10月08日起至112年10月07日止",
      applytime:"114年1月1日",
      applycount:"100",
      permitcount:"100",
      stockno:"農飼養登記第300000001號",
      unifiedNo: "45678901",
      industrialParkName: "-",
      industryName: "豬飼育業",
      regulatedType: "水、廢",
      otherLincenseNo:"農水桃園字第1138225600號",
      inspectManageNo: "202603310004",
      tempManageNo: "A2026033100004",
      factoryLicenseNo: "12345678",
      address: "新北市樹林區OO街25號",
      businesstype: "畜牧業",
      waterBusinessType: "livestock",
      lat: 24.9898,
      lng: 121.4214,
      areaId: "Shulin",
      businesslabel:"畜牧業",
    },
    {
      id: "RB0005",
      controlNo: "F23456789",
      businessName: "中和花園社區",
      waterpermitNo:"新北市環水許字 第23456-901號",
      permittime:"自113年01月01日起至116年12月31日止",
      applytime:"112年12月31日",
      unifiedNo: "56789012",
      managename:"中和花園社區管理委員會",
      managetel:"02-22234567",
      industrialParkName: "-",
      industryName: "廢水及污水處理業",
      regulatedType: "水",
      waterpermitNo:"新北市環水許字 第12345-678號",
      otherLincenseNo:"農水桃園字第1138225600號",
      inspectManageNo: "202603310005",
      tempManageNo: "A2026033100005",
      factoryLicenseNo: "COM-001261",
      address: "新北市中和區OO路200號",
      manageaddress: "新北市中和區OO路200號",
      businesstype: "社區",
      lat: 25.0003,
      lng: 121.4930,
      areaId: "Zhonghe",
      businesslabel:"社區地下水",
    },
    {
      id: "RB0006",
      controlNo: "F8034567",
      businessName: "板橋食品包裝行",
      unifiedNo: "80345678",
      industrialParkName: "-",
      industryName: "烘焙炊蒸食品製造業",
      regulated: true,
      regulatedType: "空",
      regulatedTypes: ["空"],
      address: "新北市板橋區OO路120號",
      businesstype: "一般事業",
      lat: 25.0132,
      lng: 121.4637,
      areaId: "Banqiao",
      businesslabel: "一般事業",
    },
    {
      id: "RB0007",
      controlNo: "F8056789",
      businessName: "新店電子維修廠",
      unifiedNo: "80567890",
      industrialParkName: "-",
      industryName: "其他電腦週邊設備製造業",
      regulated: true,
      regulatedType: "空",
      regulatedTypes: ["空"],
      address: "新北市新店區OO街18號",
      businesstype: "一般事業",
      lat: 24.9435,
      lng: 121.5580,
      areaId: "Xindian",
      businesslabel: "一般事業",
    },
  ];

  const nonRegBusinessCases = [
  { id: "NB0001", controlNo: "NFB-0001", businessName: "新莊精密加工廠", unifiedNo: "80123456", industryName: "其他金屬加工處理業", address: "新北市新莊區△△路66號", lat: 25.0362, lng: 121.4549, areaId: "Xinzhuang" },
  { id: "NB0002", controlNo: "NFB-0002", businessName: "五股倉儲物流場", unifiedNo: "80234567", industryName: "普通倉儲業", address: "新北市五股區OO路88號", lat: 25.0841, lng: 121.4387, areaId: "Wugu" },
  { id: "NB0004", controlNo: "NFB-0004", businessName: "三重印刷材料行", unifiedNo: "80456789", industryName: "印刷業", address: "新北市三重區XX路35號", lat: 25.0615, lng: 121.4881, areaId: "Sanchong" },
  { id: "NB0006", controlNo: "NFB-0006", businessName: "淡水水產處理場", unifiedNo: "80678901", industryName: "未分類其他食品製造業", address: "新北市淡水區中正路旁", lat: 25.1950, lng: 121.4520, areaId: "Tamsui" },
  { id: "NB0007", controlNo: "NFB-0007", businessName: "林口材料倉儲中心", unifiedNo: "80789012", industryName: "", address: "新北市林口區文化北路旁", lat: 25.0920, lng: 121.3660, areaId: "Linkou" },
  { id: "NB0008", controlNo: "NFB-0008", businessName: "汐止機械保養廠", unifiedNo: "80890123", industryName: "", address: "新北市汐止區大同路附近", lat: 25.0820, lng: 121.6400, areaId: "Xizhi" },
  { id: "NB0009", controlNo: "NFB-0009", businessName: "鶯歌陶瓷工作室", unifiedNo: "80901234", industryName: "其他陶瓷製品製造業", address: "新北市鶯歌區文化路附近", lat: 24.9549, lng: 121.3518, areaId: "Yingge" },
  { id: "NB0010", controlNo: "NFB-0010", businessName: "蘆洲金屬零件行", unifiedNo: "81012345", industryName: "未分類其他金屬製品製造業", address: "新北市蘆洲區中山一路附近", lat: 25.0824, lng: 121.4694, areaId: "Luzhou" },
  { id: "NB0011", controlNo: "NFB-0011", businessName: "泰山塑膠射出廠", unifiedNo: "81123456", industryName: "塑膠原料製造業", address: "新北市泰山區明志路附近", lat: 25.0450, lng: 121.4160, areaId: "Taishan" },
  { id: "NB0012", controlNo: "NFB-0012", businessName: "八里車材整理場", unifiedNo: "81234567", industryName: "汽車零件製造業", address: "新北市八里區龍米路附近", lat: 25.1650, lng: 121.3890, areaId: "Bali" }
];

  // 提供環域分析直接使用地圖既有的案件與事業圖層資料。
  window.EIMPAnalysisSourceLayers = [
    { key: "air", label: "空污陳情", icon: "images/民眾陳情.png", items: airCases },
    { key: "fire", label: "火災", icon: "images/火災報案.png", items: fireCases },
    { key: "regBusiness", label: "列管事業", icon: "images/工廠許可(列管).png", items: regBusinessCases },
    { key: "nonRegBusiness", label: "非列管事業", icon: "images/工廠許可.png", items: nonRegBusinessCases },
  ];

  // ====== 4. 行政區 Polygon 狀態 ======
  const areaLayers = {};
  const areaMeta = {};
  const selectedAreas = new Set();
  let selectionMode = false;

  // ====== 4-1. 帳號 / 權限 ======
  const accountInput = document.getElementById("accountInput");
  const companyInput = document.getElementById("companyInput");
  const nameInput = document.getElementById("nameInput");
  const jobTitleInput = document.getElementById("jobTitleInput");
  const phoneInput = document.getElementById("phoneInput");
  const emailInput = document.getElementById("emailInput");
  const switchAccountBtn = document.getElementById("switchAccountBtn");
  const sideMenuUserName = document.getElementById("sideMenuUserName");
  const districtFilterSection = document.getElementById("districtFilterSection");
  const accountManageMenuBtn = document.getElementById("accountManageMenuBtn");
  const decisionMenuBtn = document.getElementById("decisionMenuBtn");
  const accountManageListPage = document.getElementById("accountManageListPage");
  const accountManageDetailPage = document.getElementById("accountManageDetailPage");
  const accountManageTableBody = document.getElementById("accountManageTableBody");
  const accountManageSearchInput = document.getElementById("accountManageSearchInput");
  const accountManageSearchBtn = document.getElementById("accountManageSearchBtn");
  const accountManageAddBtn = document.getElementById("accountManageAddBtn");
  const accountDetailBackBtn = document.getElementById("accountDetailBackBtn");
  const accountDetailSaveBtn = document.getElementById("accountDetailSaveBtn");
  const manageAccountInput = document.getElementById("manageAccountInput");
  const manageCompanyInput = document.getElementById("manageCompanyInput");
  const manageNameInput = document.getElementById("manageNameInput");
  const manageJobInput = document.getElementById("manageJobInput");
  const managePhoneInput = document.getElementById("managePhoneInput");
  const manageEmailInput = document.getElementById("manageEmailInput");
  const manageAdminCheckbox = document.getElementById("manageAdminCheckbox");
  const manageEnabledCheckbox = document.getElementById("manageEnabledCheckbox");

  const accounts = {
    default: {
      key: "default",
      account: "HQhost",
      company: "第一稽查分隊",
      name: "林OO",
      jobTitle: "分隊長",
      phone: "12345678",
      email: "NTPCEPD@ntpc.gov.tw",
      restrictAirToArea: null,
      showAllFireCases: false,
      hideDistrictFilter: false,
      canManageAccounts: true,
      isSupervisor: true,
      canUseDecision: true,
    },
    zhongheCleaner: {
      key: "zhongheCleaner",
      account: "Cleaner",
      company: "第一稽查分隊",
      name: "王XX",
      jobTitle: "隊員",
      phone: "12345678",
      email: "zhonghe@clean.gov.tw",
      restrictAirToArea: "Zhonghe",
      showAllFireCases: true,
      hideDistrictFilter: true,
      canManageAccounts: false,
      isSupervisor: false,
      canUseDecision: false,
    },
  };

  let currentAccountKey = "default";
  let currentManagedAccountId = null;

  const squadAccounts = [
    {
      id: 1,
      account: "Account01",
      unit: "第一稽查分隊",
      name: "新北市環保局測試一",
      jobTitle: "稽查員",
      phone: "(02)2953-2111",
      email: "ntpc01@ntpc.gov.tw",
      isAdmin: false,
      enabled: true,
      loginLogs: [
        { time: "2026-03-24 08:15:21", ip: "10.10.1.21", result: "登入成功" },
        { time: "2026-03-23 13:48:06", ip: "10.10.1.21", result: "登入成功" },
        { time: "2026-03-22 09:03:54", ip: "10.10.1.21", result: "密碼錯誤" },
      ],
    },
    {
      id: 2,
      account: "Account02",
      unit: "第一稽查分隊",
      name: "新北市環保局測試二",
      jobTitle: "稽查員",
      phone: "(02)2953-2112",
      email: "ntpc02@ntpc.gov.tw",
      isAdmin: false,
      enabled: true,
      loginLogs: [
        { time: "2026-03-24 07:56:40", ip: "10.10.1.22", result: "登入成功" },
        { time: "2026-03-23 17:22:19", ip: "10.10.1.22", result: "登入成功" },
        { time: "2026-03-21 11:15:02", ip: "10.10.1.22", result: "登入成功" },
      ],
    },
    {
      id: 3,
      account: "Account03",
      unit: "第一稽查分隊",
      name: "新北市環保局測試三",
      jobTitle: "稽查員",
      phone: "(02)2953-2113",
      email: "ntpc03@ntpc.gov.tw",
      isAdmin: false,
      enabled: true,
      loginLogs: [
        { time: "2026-03-24 09:30:11", ip: "10.10.1.23", result: "登入成功" },
        { time: "2026-03-23 18:42:35", ip: "10.10.1.23", result: "帳號鎖定前失敗" },
        { time: "2026-03-23 18:45:02", ip: "10.10.1.23", result: "登入成功" },
      ],
    },
    {
      id: 4,
      account: "Account04",
      unit: "第一稽查分隊",
      name: "新北市環保局測試四",
      jobTitle: "稽查員",
      phone: "(02)2953-2114",
      email: "ntpc04@ntpc.gov.tw",
      isAdmin: false,
      enabled: true,
      loginLogs: [
        { time: "2026-03-24 10:12:44", ip: "10.10.1.24", result: "登入成功" },
        { time: "2026-03-22 08:40:51", ip: "10.10.1.24", result: "登入成功" },
        { time: "2026-03-20 14:28:16", ip: "10.10.1.24", result: "登入成功" },
      ],
    },
    {
      id: 5,
      account: "Account05",
      unit: "第一稽查分隊",
      name: "新北市環保局測試五",
      jobTitle: "稽查員",
      phone: "(02)2953-2115",
      email: "ntpc05@ntpc.gov.tw",
      isAdmin: false,
      enabled: true,
      loginLogs: [
        { time: "2026-03-24 08:02:27", ip: "10.10.1.25", result: "登入成功" },
        { time: "2026-03-24 08:01:58", ip: "10.10.1.25", result: "驗證碼錯誤" },
        { time: "2026-03-23 16:09:47", ip: "10.10.1.25", result: "登入成功" },
      ],
    },
    {
      id: 6,
      account: "Account06",
      unit: "第一稽查分隊",
      name: "新北市環保局測試六",
      jobTitle: "稽查員",
      phone: "(02)2953-2111",
      email: "ntpc06@ntpc.gov.tw",
      isAdmin: false,
      enabled: true,
      loginLogs: [
        { time: "2026-03-24 11:04:32", ip: "10.10.1.26", result: "登入成功" },
        { time: "2026-03-23 09:44:19", ip: "10.10.1.26", result: "登入成功" },
        { time: "2026-03-21 07:58:03", ip: "10.10.1.26", result: "登入成功" },
      ],
    },
    {
      id: 7,
      account: "Account07",
      unit: "第一稽查分隊",
      name: "新北市環保局測試七",
      jobTitle: "稽查員",
      phone: "(02)2953-2117",
      email: "ntpc07@ntpc.gov.tw",
      isAdmin: false,
      enabled: true,
      loginLogs: [
        { time: "2026-03-24 12:18:12", ip: "10.10.1.27", result: "登入成功" },
        { time: "2026-03-22 12:56:25", ip: "10.10.1.27", result: "登入成功" },
        { time: "2026-03-20 19:33:48", ip: "10.10.1.27", result: "密碼錯誤" },
      ],
    },
    {
      id: 8,
      account: "Account08",
      unit: "第一稽查分隊",
      name: "新北市環保局測試八",
      jobTitle: "稽查員",
      phone: "(02)2953-2118",
      email: "ntpc08@ntpc.gov.tw",
      isAdmin: false,
      enabled: true,
      loginLogs: [
        { time: "2026-03-24 08:47:55", ip: "10.10.1.28", result: "登入成功" },
        { time: "2026-03-23 10:21:13", ip: "10.10.1.28", result: "登入成功" },
        { time: "2026-03-22 15:07:29", ip: "10.10.1.28", result: "登入成功" },
      ],
    },
  ];

  function getCurrentAccountConfig() {
    return accounts[currentAccountKey] || accounts.default;
  }

  function canCurrentAccountUseDecision() {
    const accountConfig = getCurrentAccountConfig();
    return !!accountConfig.canUseDecision && accountConfig.name === "林OO" && !!accountConfig.isSupervisor;
  }


  function canCurrentAccountSeeVehicleLayer() {
    const accountConfig = getCurrentAccountConfig();
    return !!accountConfig.isSupervisor || String(accountConfig.jobTitle || "").includes("分隊長");
  }

  function isDistrictFilterLocked() {
    return !!getCurrentAccountConfig().hideDistrictFilter;
  }

  function isLayerOptionsLocked() {
    return currentAccountKey === "zhongheCleaner";
  }

  function hideAllAreaLayers() {
    Object.keys(areaLayers).forEach((id) => {
      const layer = areaLayers[id];
      if (layer && map.hasLayer(layer)) {
        map.removeLayer(layer);
      }
    });
  }

  // ====== 5. Marker & 左側列表 ======
  const markerLayer = L.layerGroup().addTo(map);
  const favoriteLayer = L.layerGroup().addTo(map);
  const markerMap = {};
  const clickableMarkers = [];
  const layerVisibility = {
    airPollution: true,
    fireReport: true,
    nonRegBusiness: true,
    regBusiness: true,
    vehicle: true,
    favorites: false,
    windField: false,
  };
  const FAVORITES_STORAGE_KEY = "eimp-air-favorites";
  const favorites = new Set(JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) || "[]"));
  let suppressFavoriteSave = false;
  let activeId = null;

  function buildFavoriteKey(type, itemId) {
    return `${type}::${itemId}`;
  }

  function saveFavorites() {
    if (suppressFavoriteSave) return;
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(Array.from(favorites)));
  }

  function isFavorite(type, itemId) {
    return favorites.has(buildFavoriteKey(type, itemId));
  }

  function toggleFavorite(type, itemId) {
    const key = buildFavoriteKey(type, itemId);
    if (favorites.has(key)) favorites.delete(key);
    else favorites.add(key);
    saveFavorites();
    refreshDataView();
  }

  function getFavoriteButtonHtml(item, type) {
    const active = isFavorite(type, item.id);
    return `<button type="button" class="popup-favorite-btn ${active ? 'is-favorite' : ''}" data-item-type="${type}" data-item-id="${item.id}" title="${active ? '取消收藏' : '加入收藏'}" aria-label="${active ? '取消收藏' : '加入收藏'}">★</button>`;
  }

  function findFavoriteItemByKey(key) {
    const [type, itemId] = String(key || '').split('::');
    if (!type || !itemId) return null;
    const item = [...airCases, ...fireCases, ...nonRegBusinessCases, ...regBusinessCases].find((entry) => String(entry.id) === itemId);
    if (!item) return null;
    return { type, item };
  }

  const airContainer = document.getElementById("airCasesContainer");
  const fireContainer = document.getElementById("fireCasesContainer");


  function getMarkerTypeLabel(type) {
    if (type === "air") return "空污陳情";
    if (type === "fire") return "火災案件";
    if (type === "nonRegBusiness") return "非列管事業";
    if (type === "regBusiness") return "列管事業";
    return "圖層項目";
  }

  function getMarkerOverlapPixelTolerance() {
    if (window.innerWidth <= 576) return 28;
    if (window.innerWidth <= 768) return 24;
    return 20;
  }

  function findNearbyMarkers(latlng, pixelTolerance = getMarkerOverlapPixelTolerance()) {
    if (!map || !latlng) return [];

    const originPoint = map.latLngToContainerPoint(latlng);

    const nearby = clickableMarkers.filter((entry) => {
      if (!entry.marker || !entry.marker.getLatLng) return false;

      const p = entry.marker.getLatLng();
      const markerPoint = map.latLngToContainerPoint(p);
      const dx = markerPoint.x - originPoint.x;
      const dy = markerPoint.y - originPoint.y;

      return Math.hypot(dx, dy) <= pixelTolerance;
    });

    const deduped = [];
    const indexMap = new Map();

    nearby.forEach((entry) => {
      const uniqueKey = `${entry.type}::${entry.item?.id || ''}`;
      const existedIdx = indexMap.get(uniqueKey);

      if (existedIdx === undefined) {
        indexMap.set(uniqueKey, deduped.length);
        deduped.push(entry);
        return;
      }

      const existed = deduped[existedIdx];
      if (existed?.source === "favorite" && entry?.source !== "favorite") {
        deduped[existedIdx] = entry;
      }
    });

    return deduped;
  }

  function buildOverlapPopupContent(items) {
    const html = items.map((entry, idx) => {
      let icon = "images/火災報案.png";
      if (entry.type === "air") icon = "images/民眾陳情.png";
      if (entry.type === "regBusiness") icon = "images/工廠許可(列管).png";
      if (entry.type === "nonRegBusiness") icon = "images/工廠許可.png";
      const title = getMarkerTypeLabel(entry.type);

      return `
        <button
          type="button"
          class="overlap-picker-item"
          data-overlap-index="${idx}"
          style="
            width: 100%;
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 7px 10px;
            border: 1px solid #d4d4d4;
            border-radius: 10px;
            background: #fff;
            cursor: pointer;
            margin-bottom: 6px;
            color: #2f3b52;
            text-align: left;
          "
        >
          <img src="${icon}" style="width:18px;height:18px;" />
          <span style="display:block;min-width:0;font-weight:700;line-height:1.2;">${title}</span>
        </button>
      `;
    }).join("");

    return `
      <div class="overlap-picker" style="min-width: 180px; max-width: 220px;">
        ${html}
      </div>
    `;
  }

  function openOverlapChooser(latlng, nearbyItems) {
    closeAllPopups();

    const popup = L.popup({
      maxWidth: 320,
      minWidth: 200,
      className: "custom-overlap-popup",
      autoClose: false,
      closeOnClick: false,
      closeButton: true,
    })
      .setLatLng(latlng)
      .setContent(buildOverlapPopupContent(nearbyItems))
      .openOn(map);

    setTimeout(() => {
      const container = document.querySelector(".custom-overlap-popup");
      if (!container) return;

      container.querySelectorAll("[data-overlap-index]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = Number(btn.dataset.overlapIndex);
          const target = nearbyItems[idx];
          if (!target || !target.marker) return;

          closeAllPopups();

          if (target.item && target.item.id) {
            setActiveId(target.item.id, { skipMapFocus: true, skipPopupOpen: true });
          }

          const targetLatLng = target.marker.getLatLng();
          removeLocationMarkerIfUnlockedAndExists();
          updateSimulationCoord(targetLatLng);
          map.setView(targetLatLng, map.getZoom(), { animate: false });
          target.marker.openPopup();
        });
      });
    }, 0);
  }

  function handleMarkerClickWithOverlap(entry) {
    const markerLatLng = entry.marker.getLatLng();
    const nearbyItems = findNearbyMarkers(markerLatLng);
    openOverlapChooser(markerLatLng, nearbyItems.length ? nearbyItems : [entry]);
  }

  function activateMarkerEntry(entry) {
    const markerLatLng = entry.marker.getLatLng();
    closeAllPopups();
    if (entry.item?.id) {
      setActiveId(entry.item.id, { skipMapFocus: true, skipPopupOpen: true });
    }
    removeLocationMarkerIfUnlockedAndExists();
    updateSimulationCoord(markerLatLng);
    map.setView(markerLatLng, map.getZoom(), { animate: false });
    entry.marker.openPopup();
  }

  function casePassAreaFilter(item, type = "air") {
    const accountConfig = getCurrentAccountConfig();

    if (type === "air" && accountConfig.restrictAirToArea) {
      return item.areaId === accountConfig.restrictAirToArea;
    }

    if (type === "fire" && accountConfig.showAllFireCases) {
      return true;
    }

    if (!selectedAreas.size) return true;
    if (!item.areaId) return false;
    return selectedAreas.has(item.areaId);
  }

  // ====== 6. 模擬位置工具函式 ======
  function updateSimulationCoord(latlng) {
    currentLatLng = L.latLng(latlng);
    if (coordLabel) {
      coordLabel.textContent =
        "緯度：" +
        currentLatLng.lat.toFixed(5) +
        "，經度：" +
        currentLatLng.lng.toFixed(5);
    }
  }

  function removeLocationMarkerIfUnlockedAndExists(force = false) {
    if (force && locationMarker) {
      map.removeLayer(locationMarker);
      locationMarker = null;
      currentLatLng = null;
      lastSimPopupInfo = null;
      window.EIMPLocationTools?.clearLocation();
    }
  }

  // 設定 / 移動「定位 marker」
  function setSimulationLocation(latlng, info) {
    if (locationLocked) return;

    closeAllPopups();

    currentLatLng = latlng;

    if (locationMarker) {
      locationMarker.setLatLng(latlng);
    } else {
      locationMarker = L.marker(latlng, {
        icon: locationIcon,
        opacity: 0.95,
      }).addTo(map);
    }

    if (coordLabel) {
      coordLabel.textContent =
        `緯度：${latlng.lat.toFixed(5)}，經度：${latlng.lng.toFixed(5)}`;
    }

    lastSimPopupInfo = info || null;
    window.EIMPLocationTools?.setLocation({ lat: latlng.lat, lng: latlng.lng, ...(info || {}) });
    bindLocationPopup(info);
    locationMarker.openPopup();
  }

  function bindLocationPopup(info) {
    if (!locationMarker) return;

    const latlng = locationMarker.getLatLng();
    const details = { lat: latlng.lat, lng: latlng.lng, ...(info || lastSimPopupInfo || {}) };
    const html = window.EIMPLocationTools?.buildPopupContent(details) || "定位資訊";

    locationMarker.unbindPopup();
    locationMarker.bindPopup(html, {
      maxWidth: 300,
      minWidth: 271,
      className: "custom-case-popup custom-location-popup",
      closeButton: true,
      autoClose: false,
      closeOnClick: false,
    });
  }

  // 快速定位 popup
  function openLocationPopup(info) {
    if (!locationMarker) return;
    const latlng = locationMarker.getLatLng();
    currentLatLng = latlng;
    if (coordLabel) coordLabel.textContent = `緯度：${latlng.lat.toFixed(5)}，經度：${latlng.lng.toFixed(5)}`;
    bindLocationPopup(info);
    locationMarker.openPopup();
  }

  // ====== 6-1. 案件 popup 內容 ======
  function getAirCasePopupContent(item) {
    const rows = [
      ["案件編號", item.caseNo || item.id || "-"],
      ["陳情時間", item.reportTime || item.time || "-"],
      ["污染類別(主項)", item.pollutionMain || "-"],
      ["污染類別(細項)", item.pollutionSub || "-"],
      ["行業別(主項)", item.industryMain || "-"],
      ["行業別(細項)", item.industrySub || "-"],
      ["地址", item.address || "-"],
      ["陳情內容", item.complaintText || "-"],
      ["處理單位", item.handleUnit || "-"],
      ["車組長", item.teamLeader || "-"],
      ["案件狀態", item.status || "-"],
    ];

    const gridHtml = rows
      .map(([k, v]) => {
        const isMultiline = k === "陳情內容";
        return `
          <div class="case-popup__k">${k}</div>
          <div class="case-popup__v ${isMultiline ? "case-popup__v--multiline" : ""}">${v}</div>
        `;
      })
      .join("");

    return `
      <div class="case-popup">
        ${getFavoriteButtonHtml(item, "air")}
        <div class="case-popup__body">
          <div class="case-popup__grid">${gridHtml}</div>
        </div>
        <div class="case-popup__footer">
          <button class="popup-btn-open">開啟 模擬圖層</button>
        </div>
      </div>
    `;
  }

  const FIRE_DISPATCH_DISTRICTS = [
    "板橋區", "三重區", "中和區", "永和區", "新莊區", "新店區", "樹林區", "鶯歌區", "三峽區", "淡水區",
    "汐止區", "瑞芳區", "土城區", "蘆洲區", "五股區", "泰山區", "林口區", "深坑區", "石碇區", "坪林區",
    "三芝區", "石門區", "八里區", "平溪區", "雙溪區", "貢寮區", "金山區", "萬里區", "烏來區",
  ];

  const FIRE_AREA_ID_TO_DISTRICT = {
    Banqiao: "板橋區", Sanchong: "三重區", Zhonghe: "中和區", Yonghe: "永和區", Xinzhuang: "新莊區",
    Xindian: "新店區", Shulin: "樹林區", Yingge: "鶯歌區", Sanxia: "三峽區", Tamsui: "淡水區",
    Xizhi: "汐止區", Ruifang: "瑞芳區", Tucheng: "土城區", Luzhou: "蘆洲區", Wugu: "五股區",
    Taishan: "泰山區", Linkou: "林口區", Shenkeng: "深坑區", Shiding: "石碇區", Pinglin: "坪林區",
    Sanzhi: "三芝區", Shimen: "石門區", Bali: "八里區", Pingxi: "平溪區", Shuangxi: "雙溪區",
    Gongliao: "貢寮區", Jinshan: "金山區", Wanli: "萬里區", Wulai: "烏來區",
  };

  function getFireCaseDistrict(item) {
    const byAreaId = FIRE_AREA_ID_TO_DISTRICT[item?.areaId];
    if (byAreaId) return byAreaId;
    const address = String(item?.address || "");
    return FIRE_DISPATCH_DISTRICTS.find((district) => address.includes(district)) || "";
  }

  function getFireVehicleById(vehicleId) {
    return vehicleCases.find((vehicle) => String(vehicle.id) === String(vehicleId));
  }

  function getFireCoverageVehicle(district) {
    return vehicleCases.find((vehicle) => vehicle.responsibleAreas?.includes(district)) || null;
  }

  function getFireTeamVehicles(teamCode) {
    return vehicleCases.filter((vehicle) => vehicle.teamCode === teamCode);
  }

  function getFireTeamName(teamCode) {
    return FIRE_DISPATCH_TEAM_NAMES[teamCode] || teamCode || "未設定分隊";
  }

  function getFireDistanceKm(caseItem, vehicle) {
    const lat1 = Number(caseItem?.lat);
    const lng1 = Number(caseItem?.lng);
    const lat2 = Number(vehicle?.lat);
    const lng2 = Number(vehicle?.lng);
    if (![lat1, lng1, lat2, lng2].every(Number.isFinite)) return Number.POSITIVE_INFINITY;

    const toRad = (degree) => (degree * Math.PI) / 180;
    const earthRadiusKm = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2
      + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function getNearestFireVehicles(caseItem, limit = 3) {
    return vehicleCases
      .map((vehicle) => ({ vehicle, distanceKm: getFireDistanceKm(caseItem, vehicle) }))
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, limit);
  }

  function buildNearestVehicleOptions(caseItem, selectedVehicleId = "") {
    const nearest = getNearestFireVehicles(caseItem, 3);
    return nearest.map(({ vehicle, distanceKm }, index) => {
      const selected = String(selectedVehicleId || nearest[0]?.vehicle.id) === String(vehicle.id) ? " selected" : "";
      const distanceText = Number.isFinite(distanceKm) ? `${distanceKm.toFixed(1)} 公里` : "距離未知";
      return `<option value="${escapeMarkerAttr(vehicle.id)}"${selected}>${escapeMarkerAttr(vehicle.plateNo)} (${escapeMarkerAttr(vehicle.teamCode)})・${distanceText}${index === 0 ? "" : ""}</option>`;
    }).join("");
  }

  function getFireDivisionRule(district) {
    const coverageVehicle = getFireCoverageVehicle(district);
    if (!coverageVehicle) {
      return {
        coverageVehicle: null,
        originalTeamCode: "",
        selectableTeamCodes: [],
      };
    }

    const selectableTeamCodes = [
      coverageVehicle.teamCode,
      ...(coverageVehicle.designatedTeamCodes || []),
    ].filter((teamCode, index, list) => teamCode && list.indexOf(teamCode) === index);

    return {
      coverageVehicle,
      originalTeamCode: coverageVehicle.teamCode,
      selectableTeamCodes,
    };
  }

  function getNearestFireTeamVehicles(caseItem, teamCode) {
    return getFireTeamVehicles(teamCode)
      .map((vehicle) => ({ vehicle, distanceKm: getFireDistanceKm(caseItem, vehicle) }))
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }

  function buildFireDivisionTeamOptions(district, selectedTeamCode = "") {
    const { originalTeamCode, selectableTeamCodes } = getFireDivisionRule(district);
    if (!selectableTeamCodes.length) return '<option value="">查無對應分隊</option>';

    const preferredTeamCode = selectableTeamCodes.includes(selectedTeamCode)
      ? selectedTeamCode
      : originalTeamCode;

    return selectableTeamCodes.map((teamCode) => {
      const selected = teamCode === preferredTeamCode ? " selected" : "";
      return `<option value="${escapeMarkerAttr(teamCode)}"${selected}>${escapeMarkerAttr(getFireTeamName(teamCode))}</option>`;
    }).join("");
  }

  function buildDivisionVehicleOptions(caseItem, teamCode, selectedVehicleId = "") {
    if (!teamCode) return '<option value="">請先選擇指定分隊</option>';

    const candidates = getNearestFireTeamVehicles(caseItem, teamCode);
    if (!candidates.length) return '<option value="">該分隊目前沒有可用車機</option>';

    const preferredId = selectedVehicleId && candidates.some(({ vehicle }) => String(vehicle.id) === String(selectedVehicleId))
      ? selectedVehicleId
      : candidates[0].vehicle.id;

    return candidates.map(({ vehicle, distanceKm }, index) => {
      const selected = String(vehicle.id) === String(preferredId) ? " selected" : "";
      const distanceText = Number.isFinite(distanceKm) ? `${distanceKm.toFixed(1)} 公里` : "距離未知";
      const nearestText = index === 0 ? "" : "";
      return `<option value="${escapeMarkerAttr(vehicle.id)}"${selected}>${escapeMarkerAttr(vehicle.plateNo)} (${escapeMarkerAttr(vehicle.teamCode)})・${distanceText}${nearestText}</option>`;
    }).join("");
  }

  function getFireDispatchSummary(method, vehicle) {
    if (!vehicle) return "臨時任務指派(火災)：尚未選擇指派對象";
    if (method === "division") return `轄區分隊指派：${vehicle.teamCode}`;
    return `車機指派：${vehicle.plateNo}(${vehicle.teamCode})`;
  }

  function getFireReassignmentText(vehicle) {
    if (!vehicle) return "轄區改派：尚未選擇車機。";
    const areas = vehicle.responsibleAreas?.length ? vehicle.responsibleAreas.join("、") : "未設定轄區";
    const designated = vehicle.designatedTeamCodes?.length ? vehicle.designatedTeamCodes.join("、") : "原分隊";
    return `案件指派：該案件由${vehicle.teamCode}車機${vehicle.plateNo}前往。 \n執行任務期間${vehicle.teamCode}「${areas}」案件由${designated}負責。`;
  }

  function getFireCaseFromPopup(popup) {
    const fireCaseId = popup?.dataset?.fireCaseId;
    return fireCases.find((item) => String(item.id) === String(fireCaseId))
      || window.EIMPAnalysisPopupItems?.get?.(String(fireCaseId))
      || null;
  }

  function getFireDispatchVehicleFromPopup(popup) {
    if (!popup) return null;
    const method = popup.querySelector(".fire-dispatch-method")?.value || "vehicle";
    const selector = method === "division"
      ? popup.querySelector(".fire-dispatch-division-vehicle")
      : popup.querySelector(".fire-dispatch-vehicle");
    return getFireVehicleById(selector?.value);
  }

  function updateFireDispatchPopup(popup, options = {}) {
    if (!popup) return;
    const methodSelect = popup.querySelector(".fire-dispatch-method");
    const method = methodSelect?.value || "vehicle";
    const vehiclePanel = popup.querySelector('[data-fire-dispatch-panel="vehicle"]');
    const divisionPanel = popup.querySelector('[data-fire-dispatch-panel="division"]');
    if (vehiclePanel) vehiclePanel.hidden = method !== "vehicle";
    if (divisionPanel) divisionPanel.hidden = method !== "division";

    if (method === "division") {
      const caseItem = getFireCaseFromPopup(popup);
      const district = getFireCaseDistrict(caseItem);
      const teamSelect = popup.querySelector(".fire-dispatch-team");
      const vehicleSelect = popup.querySelector(".fire-dispatch-division-vehicle");
      const { coverageVehicle, originalTeamCode, selectableTeamCodes } = getFireDivisionRule(district);
      const selectedTeamCode = selectableTeamCodes.includes(teamSelect?.value)
        ? teamSelect.value
        : originalTeamCode;

      if (teamSelect && teamSelect.value !== selectedTeamCode) {
        teamSelect.value = selectedTeamCode;
      }

      if (vehicleSelect && options.rebuildDivisionVehicles) {
        vehicleSelect.innerHTML = buildDivisionVehicleOptions(caseItem, selectedTeamCode);
      }

      const unitText = popup.querySelector(".fire-dispatch-selected-unit");
      if (unitText) {
        unitText.textContent = coverageVehicle
          ? `原處理單位：${getFireTeamName(originalTeamCode)}。`
          : `案件轄區：${district || "無法判斷"}；查無對應的處理單位。`;
      }
    }

    const vehicle = getFireDispatchVehicleFromPopup(popup);
    const summary = getFireDispatchSummary(method, vehicle);
    const reassignment = getFireReassignmentText(vehicle);
    const summaryEl = popup.querySelector(".fire-dispatch-summary-text");
    const reassignmentEl = popup.querySelector(".fire-dispatch-reassignment-text");
    const statusEl = popup.querySelector(".fire-dispatch-confirm-status");
    if (summaryEl) summaryEl.textContent = summary;
    if (reassignmentEl) reassignmentEl.textContent = reassignment;
    if (statusEl) statusEl.textContent = "";
  }

  function getFireCasePopupContent(item) {
    const rows = [
      ["報案時間", item.time || "-"],
      ["火災類型", item.fireType || "-"],
      ["報案地點", item.address || "-"],
    ];

    const gridHtml = rows
      .map(([k, v]) => `
        <div class="case-popup__k">${k}</div>
        <div class="case-popup__v">${v}</div>
      `)
      .join("");

    const caseDistrict = getFireCaseDistrict(item);
    const coverageVehicle = getFireCoverageVehicle(caseDistrict);
    const initialDivisionTeamCode = coverageVehicle?.teamCode || "";
    const nearestVehicle = getNearestFireVehicles(item, 1)[0]?.vehicle || null;
    const initialSummary = getFireDispatchSummary("vehicle", nearestVehicle);
    const initialReassignment = getFireReassignmentText(nearestVehicle);
    return `
      <div class="case-popup fire-case-popup" data-active-tab="info" data-fire-case-id="${escapeMarkerAttr(item.id)}">
        <div class="case-popup-tabs" role="tablist" aria-label="火災報案功能頁籤">
          <button type="button" class="case-popup-tab active" data-tab="info">案件資訊</button>
          <button type="button" class="case-popup-tab" data-tab="dispatch">臨時轄區調度</button>
        </div>

        ${getFavoriteButtonHtml(item, "fire")}

        <div class="case-popup__body fire-tab-content active" data-tab-panel="info">
          <div class="case-popup__grid">${gridHtml}</div>
        </div>

        <div class="case-popup__body fire-tab-content" data-tab-panel="dispatch">
          <div class="fire-dispatch-box">

            <div class="fire-dispatch-row">
              <label for="fire-dispatch-method-${escapeMarkerAttr(item.id)}">指派方式</label>
              <select id="fire-dispatch-method-${escapeMarkerAttr(item.id)}" class="fire-dispatch-select fire-dispatch-method">
                <option value="vehicle" selected>車機指派</option>
                <option value="division">分隊指派</option>
              </select>
            </div>

            <div class="fire-dispatch-mode-panel" data-fire-dispatch-panel="vehicle">
              <div class="fire-dispatch-row">
                <label for="fire-dispatch-vehicle-${escapeMarkerAttr(item.id)}">鄰近車機（依距離排序）</label>
                <select id="fire-dispatch-vehicle-${escapeMarkerAttr(item.id)}" class="fire-dispatch-select fire-dispatch-vehicle">
                  ${buildNearestVehicleOptions(item)}
                </select>
              </div>
            </div>

            <div class="fire-dispatch-mode-panel" data-fire-dispatch-panel="division" hidden>
              <div class="fire-dispatch-row">
                <label for="fire-dispatch-team-${escapeMarkerAttr(item.id)}">指定分隊</label>
                <select id="fire-dispatch-team-${escapeMarkerAttr(item.id)}" class="fire-dispatch-select fire-dispatch-team">
                  ${buildFireDivisionTeamOptions(caseDistrict, initialDivisionTeamCode)}
                </select>
                <div class="fire-dispatch-selected-unit">${coverageVehicle
                  ? `原處理單位：${escapeMarkerAttr(getFireTeamName(initialDivisionTeamCode))}。`
                  : `案件轄區：${escapeMarkerAttr(caseDistrict || "無法判斷")}；查無對應的處理單位。`}</div>
              </div>
              <div class="fire-dispatch-row">
                <label for="fire-dispatch-division-vehicle-${escapeMarkerAttr(item.id)}">分隊車機（依距離排序）</label>
                <select id="fire-dispatch-division-vehicle-${escapeMarkerAttr(item.id)}" class="fire-dispatch-select fire-dispatch-division-vehicle">
                  ${buildDivisionVehicleOptions(item, initialDivisionTeamCode)}
                </select>
              </div>
            </div>

            <div class="fire-dispatch-result">
              <div class="fire-dispatch-summary-text">${escapeMarkerAttr(initialSummary)}</div>
              <div class="fire-dispatch-reassignment-text">${escapeMarkerAttr(initialReassignment)}</div>
            </div>

            <button type="button" class="fire-dispatch-btn">確認指派</button>
            <div class="fire-dispatch-confirm-status" aria-live="polite"></div>
          </div>
        </div>

        <div class="case-popup__footer">
          <button class="popup-btn-open">開啟 模擬圖層</button>
        </div>
      </div>
    `;
  }

  function getBusinessPermitAvailability(item) {
    const regulatedTypes = Array.isArray(item?.regulatedTypes)
      ? item.regulatedTypes
      : String(item?.regulatedType || "").split(/[、,，/／\s]+/).filter(Boolean);
    const detailTypes = Array.isArray(item?.detailTypes) ? item.detailTypes : [];
    return {
      hasWater: detailTypes.includes("water") || regulatedTypes.includes("水") || Boolean(item?.waterPermitNo || item?.waterpermitNo),
      hasToxic: detailTypes.includes("toxic") || regulatedTypes.includes("毒") || Boolean(item?.toxicPermitNo || item?.toxicpermitNo),
      hasCEMS: detailTypes.includes("CEMS") || regulatedTypes.includes("CEMS") || item?.hasCEMS === true,
      hasCWMS: detailTypes.includes("CWMS") || regulatedTypes.includes("CWMS") || item?.hasCWMS === true,
    };
  }

  function resolveBusinessItem(item) {
    if (!item) return item;
    const sourceItem = [...regBusinessCases, ...nonRegBusinessCases].find((entry) => (
      entry.businessName === item.businessName
      || (entry.address && item.address && entry.address === item.address)
      || (Number(entry.lat) === Number(item.lat) && Number(entry.lng) === Number(item.lng))
    ));
    if (!sourceItem) return item;
    return {
      ...item,
      ...sourceItem,
      detailTypes: item.detailTypes || sourceItem.detailTypes,
      regulatedTypes: item.regulatedTypes || sourceItem.regulatedTypes,
      waterQualityItems: item.waterQualityItems || sourceItem.waterQualityItems,
    };
  }

  function getBusinessDetailLinkHtml(item, itemType) {
    const permits = getBusinessPermitAvailability(item);
    if (!permits.hasWater && !permits.hasToxic && !permits.hasCEMS && !permits.hasCWMS) return "";
    return `<div class="case-popup__link-row"><button type="button" class="popup-plain-text-btn business-detail-trigger" data-item-type="${itemType}" data-item-id="${item.id}">事業詳細資料</button></div>`;
  }

  function getRegBusinessPopupContent(item) {
    const rows = [
      ["管制編號", item.controlNo || "-"],
      ["事業名稱", item.businessName || "-"],
      ["統一編號", item.unifiedNo || "-"],
      ["工業區名稱", item.industrialParkName || "-"],
      ["行業別名稱", item.industryName || "-"],
      ["是否列管(種類)", item.regulatedType || "-"],
      ["稽查管編(12碼)", item.inspectManageNo || "-"],
      ["臨時管編(13碼)", item.tempManageNo || "-"],
      ["工廠證號", item.factoryLicenseNo || "-"],
      ["實際廠(場)址", item.address || "-"],
    ];

    const gridHtml = rows
      .map(([k, v]) => {
        const isMultiline = k === "實際廠(場)址" || k === "事業名稱";
        return `
          <div class="case-popup__k">${k}</div>
          <div class="case-popup__v ${isMultiline ? "case-popup__v--multiline" : ""}">${v}</div>
        `;
      })
      .join("");

    return `
      <div class="case-popup">
        ${getFavoriteButtonHtml(item, "regBusiness")}
        <div class="case-popup__body">
          <div class="case-popup__grid">${gridHtml}</div>
        </div>
        ${getBusinessDetailLinkHtml(item, "regBusiness")}
      </div>
    `;
  }


  function getNonRegBusinessPopupContent(item) {
    const rows = [
      ["管制編號", item.controlNo || "-"],
      ["事業名稱", item.businessName || "-"],
      ["統一編號", item.unifiedNo || "-"],
      ["工業區名稱", item.industrialParkName || "-"],
      ["行業別名稱", item.industryName || "-"],
      ["是否列管(種類)", item.regulatedType || "-"],
      ["稽查管編(12碼)", item.inspectManageNo || "-"],
      ["臨時管編(13碼)", item.tempManageNo || "-"],
      ["工廠證號", item.factoryLicenseNo || "-"],
      ["實際廠(場)址", item.address || "-"],
    ];

    const gridHtml = rows
      .map(([k, v]) => {
        const isMultiline = k === "實際廠(場)址" || k === "事業名稱";
        return `
          <div class="case-popup__k">${k}</div>
          <div class="case-popup__v ${isMultiline ? "case-popup__v--multiline" : ""}">${v}</div>
        `;
      })
      .join("");

    return `
      <div class="case-popup">
        ${getFavoriteButtonHtml(item, "nonRegBusiness")}
        <div class="case-popup__body">
          <div class="case-popup__grid">${gridHtml}</div>
        </div>
        ${getBusinessDetailLinkHtml(item, "nonRegBusiness")}
      </div>
    `;
  }

  function getCasePopupContent(item, type) {
    if (type === "air") return getAirCasePopupContent(item);
    if (type === "fire") return getFireCasePopupContent(item);
    if (type === "nonRegBusiness") return getNonRegBusinessPopupContent(item);
    if (type === "regBusiness") return getRegBusinessPopupContent(item);
    return getAirCasePopupContent(item);
  }

  window.EIMPBusinessPopupBridge = {
    buildPopupContent(item, type) {
      return getCasePopupContent(resolveBusinessItem(item), type);
    },
    resolveItem: resolveBusinessItem,
    openDetail(item, detailType) {
      openBusinessDetailPanel(resolveBusinessItem(item), detailType);
    },
  };

  window.EIMPAnalysisPopupBridge = {
    buildPopupContent(item, type) {
      return getCasePopupContent(item, type);
    },
    getMarkerIcon(item, type) {
      return getCaseMarkerIcon(type, item);
    },
    getPopupOptions(item, type) {
      if (type === "fire") return { maxWidth: 390, minWidth: 300, className: "custom-case-popup custom-fire-case-popup", closeButton: true, autoClose: false, closeOnClick: false };
      return { maxWidth: 360, minWidth: 260, className: "custom-case-popup", closeButton: true, autoClose: false, closeOnClick: false };
    },
    beforeOpen(marker) {
      closeAllPopups();
      const latlng = marker.getLatLng();
      currentLatLng = latlng;
      if (coordLabel) coordLabel.textContent = `緯度：${latlng.lat.toFixed(5)}，經度：${latlng.lng.toFixed(5)}`;
    },
  };

  // ====== 7. 左側列表渲染 ======
  function renderAirList(items) {
    airContainer.innerHTML = "";
    items.forEach((item) => {
      const row = document.createElement("div");
      row.className = "panel-body-row case-row";
      row.dataset.id = item.id;
      row.innerHTML = `
        <span class="panel-body-text">${item.time}</span>
        <span class="panel-body-text">${item.status}</span>
        <span class="panel-body-address-text">${item.address}</span>
      `;
      if (item.id === activeId) row.classList.add("active");

      row.addEventListener("click", () => {
        focusCaseFromDashboard(item.id, "airPollution");
      });

      airContainer.appendChild(row);
      const hr = document.createElement("hr");
      hr.style.borderColor = "#497782";
      airContainer.appendChild(hr);
    });
  }

  function renderFireList(items) {
    fireContainer.innerHTML = "";
    items.forEach((item) => {
      const row = document.createElement("div");
      row.className = "panel-body-row case-row";
      row.dataset.id = item.id;
      row.innerHTML = `
        <span class="panel-body-text">${item.time}</span>
        <span class="panel-body-text">${item.fireType}</span>
        <span class="panel-body-address-text">${item.address}</span>
      `;
      if (item.id === activeId) row.classList.add("active");

      row.addEventListener("click", () => {
        focusCaseFromDashboard(item.id, "fireReport");
      });

      fireContainer.appendChild(row);
      const hr = document.createElement("hr");
      hr.style.borderColor = "#497782";
      fireContainer.appendChild(hr);
    });
  }

  function setActiveId(id, options = {}) {
    const { skipMapFocus = false, skipPopupOpen = false } = options;

    activeId = id;

    document.querySelectorAll(".case-row").forEach((el) => {
      el.classList.toggle("active", el.dataset.id === id);
    });

    const marker = markerMap[id];
    if (marker && !skipMapFocus) {
      const latlng = marker.getLatLng();
      map.setView(latlng, map.getZoom(), { animate: false });

      if (!skipPopupOpen) {
        marker.openPopup();
      }
    }

    const activeRow = document.querySelector(`.case-row[data-id="${id}"]`);
    if (activeRow) {
      activeRow.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  function focusCaseFromDashboard(id, layerName) {
    ensureLayerVisible(layerName);

    requestAnimationFrame(() => {
      const marker = markerMap[id];
      if (!marker) return;

      closeAllPopups();
      setActiveId(id, { skipMapFocus: true, skipPopupOpen: true });

      const latlng = marker.getLatLng();
      removeLocationMarkerIfUnlockedAndExists();
      updateSimulationCoord(latlng);
      map.setView(latlng, map.getZoom(), { animate: false });
      marker.openPopup();
    });
  }

  function getLayerToggleInput(layerName) {
    return document.querySelector(`.layer-toggle[data-layer="${layerName}"]`);
  }

  function syncLayerVisibilityFromUI() {
    const airToggle = getLayerToggleInput("airPollution");
    const fireToggle = getLayerToggleInput("fireReport");
    const nonRegBusinessToggle = getLayerToggleInput("nonRegBusiness");
    const regBusinessToggle = getLayerToggleInput("regBusiness");
    const vehicleToggle = getLayerToggleInput("vehicle");
    const favoriteToggle = getLayerToggleInput("favorites");
    const windToggle = getLayerToggleInput("windField");

    if (airToggle) layerVisibility.airPollution = airToggle.checked;
    if (fireToggle) layerVisibility.fireReport = fireToggle.checked;
    if (nonRegBusinessToggle) layerVisibility.nonRegBusiness = nonRegBusinessToggle.checked;
    if (regBusinessToggle) layerVisibility.regBusiness = regBusinessToggle.checked;
    if (vehicleToggle) layerVisibility.vehicle = vehicleToggle.checked;
    if (favoriteToggle) layerVisibility.favorites = favoriteToggle.checked;
    if (windToggle) layerVisibility.windField = windToggle.checked;
  }

  function applyLayerVisibility() {
    closeAllPopups();
    refreshDataView();
    toggleWindLayer(layerVisibility.windField);
  }

  function setLayerToggleState(layerName, checked) {
    const input = getLayerToggleInput(layerName);
    if (input) input.checked = checked;
    if (Object.prototype.hasOwnProperty.call(layerVisibility, layerName)) {
      layerVisibility[layerName] = checked;
    }
    applyLayerVisibility();
  }

  function ensureLayerVisible(layerName) {
    if (layerVisibility[layerName]) return;
    setLayerToggleState(layerName, true);
  }

  // ====== 8. 重新整理案件 + Marker ======
  function renderFavoriteLayer() {
    favoriteLayer.clearLayers();
    if (!layerVisibility.favorites) return;

    Array.from(favorites).forEach((key) => {
      const resolved = findFavoriteItemByKey(key);
      if (!resolved) return;

      const { type, item } = resolved;
      if (type === "air" && !casePassAreaFilter(item, "air")) return;
      if (type === "fire" && !casePassAreaFilter(item, "fire")) return;
      if (type === "nonRegBusiness" && !casePassAreaFilter(item, "nonRegBusiness")) return;
      if (type === "regBusiness" && !casePassAreaFilter(item, "regBusiness")) return;

      const icon = getCaseMarkerIcon(type, item);
      const marker = L.marker([item.lat, item.lng], { icon, zIndexOffset: 1000 }).addTo(favoriteLayer);

      marker.bindPopup(getCasePopupContent(item, type), {
        maxWidth: type === "fire" ? 390 : 320,
        minWidth: type === "fire" ? 300 : 240,
        className: type === "fire" ? "custom-case-popup custom-fire-case-popup" : "custom-case-popup",
        closeButton: true,
        autoClose: false,
        closeOnClick: false,
      });

      const entry = { marker, item, type, source: "favorite" };
      clickableMarkers.push(entry);
      marker.off("click");
      marker.on("click", () => {
        handleMarkerClickWithOverlap(entry);
      });
    });
  }

  function refreshDataView() {
    markerLayer.clearLayers();
    favoriteLayer.clearLayers();
    clickableMarkers.length = 0;
    Object.keys(markerMap).forEach((id) => delete markerMap[id]);

    const visibleAir = [];
    const visibleFire = [];

    airCases.forEach((item) => {
      if (!casePassAreaFilter(item, "air")) return;
      visibleAir.push(item);

      if (!layerVisibility.airPollution) return;

      const marker = L.marker([item.lat, item.lng], { icon: getCaseMarkerIcon("air", item) }).addTo(markerLayer);

      marker.bindPopup(getCasePopupContent(item, "air"), {
        maxWidth: 320,
        minWidth: 240,
        className: "custom-case-popup",
        closeButton: true,
        autoClose: false,
        closeOnClick: false,
      });

      const entry = { marker, item, type: "air", source: "main" };
      clickableMarkers.push(entry);
      marker.off("click");
      marker.on("click", () => {
        handleMarkerClickWithOverlap(entry);
      });

      markerMap[item.id] = marker;
    });

    fireCases.forEach((item) => {
      if (!casePassAreaFilter(item, "fire")) return;
      visibleFire.push(item);

      if (!layerVisibility.fireReport) return;

      const marker = L.marker([item.lat, item.lng], { icon: getCaseMarkerIcon("fire", item) }).addTo(markerLayer);

      marker.bindPopup(getCasePopupContent(item, "fire"), {
        maxWidth: 390,
        minWidth: 300,
        className: "custom-case-popup custom-fire-case-popup",
        closeButton: true,
        autoClose: false,
        closeOnClick: false,
      });

      const entry = { marker, item, type: "fire", source: "main" };
      clickableMarkers.push(entry);
      marker.off("click");
      marker.on("click", () => {
        handleMarkerClickWithOverlap(entry);
      });

      markerMap[item.id] = marker;
    });

    nonRegBusinessCases.forEach((item) => {
      if (!casePassAreaFilter(item, "nonRegBusiness")) return;
      if (!layerVisibility.nonRegBusiness) return;

      const marker = L.marker([item.lat, item.lng], { icon: getCaseMarkerIcon("nonRegBusiness", item) }).addTo(markerLayer);

      marker.bindPopup(getCasePopupContent(item, "nonRegBusiness"), {
        maxWidth: 360,
        minWidth: 260,
        className: "custom-case-popup",
        closeButton: true,
        autoClose: false,
        closeOnClick: false,
      });

      const entry = { marker, item, type: "nonRegBusiness", source: "main" };
      clickableMarkers.push(entry);
      marker.off("click");
      marker.on("click", () => {
        handleMarkerClickWithOverlap(entry);
      });

      markerMap[item.id] = marker;
    });

    regBusinessCases.forEach((item) => {
      if (!casePassAreaFilter(item, "regBusiness")) return;
      if (!layerVisibility.regBusiness) return;

      const marker = L.marker([item.lat, item.lng], { icon: getCaseMarkerIcon("regBusiness", item) }).addTo(markerLayer);

      marker.bindPopup(getCasePopupContent(item, "regBusiness"), {
        maxWidth: 360,
        minWidth: 260,
        className: "custom-case-popup",
        closeButton: true,
        autoClose: false,
        closeOnClick: false,
      });

      const entry = { marker, item, type: "regBusiness", source: "main" };
      clickableMarkers.push(entry);
      marker.off("click");
      marker.on("click", () => {
        handleMarkerClickWithOverlap(entry);
      });

      markerMap[item.id] = marker;
    });

    if (canCurrentAccountSeeVehicleLayer() && layerVisibility.vehicle) {
      vehicleCases.forEach((item) => {
        const marker = L.marker([item.lat, item.lng], { icon: createVehicleMarkerIcon(item), zIndexOffset: 5000 }).addTo(markerLayer);
        bindVehiclePlateLabel(marker, item);
        markerMap[item.id] = marker;
      });
    }

    renderFavoriteLayer();
    renderAirList(visibleAir);
    renderFireList(visibleFire);
  }

  syncLayerVisibilityFromUI();
  refreshDataView();

  // ====== 9. 行政區 Polygon ======
  const districts = [
    { url: "area-filter/三峽區.json", areaId: "Sanxia", areaName: "三峽區" },
    { url: "area-filter/三芝區.json", areaId: "Sanzhi", areaName: "三芝區" },
    { url: "area-filter/三重區.json", areaId: "Sanchong", areaName: "三重區" },
    { url: "area-filter/中和區.json", areaId: "Zhonghe", areaName: "中和區" },
    { url: "area-filter/五股區.json", areaId: "Wugu", areaName: "五股區" },
    { url: "area-filter/八里區.json", areaId: "Bali", areaName: "八里區" },
    { url: "area-filter/土城區.json", areaId: "Tucheng", areaName: "土城區" },
    { url: "area-filter/坪林區.json", areaId: "Pinglin", areaName: "坪林區" },
    { url: "area-filter/平溪區.json", areaId: "Pingxi", areaName: "平溪區" },
    { url: "area-filter/新店區.json", areaId: "Xindian", areaName: "新店區" },
    { url: "area-filter/新莊區.json", areaId: "Xinzhuang", areaName: "新莊區" },
    { url: "area-filter/板橋區.json", areaId: "Banqiao", areaName: "板橋區" },
    { url: "area-filter/林口區.json", areaId: "Linkou", areaName: "林口區" },
    { url: "area-filter/樹林區.json", areaId: "Shulin", areaName: "樹林區" },
    { url: "area-filter/永和區.json", areaId: "Yonghe", areaName: "永和區" },
    { url: "area-filter/汐止區.json", areaId: "Xizhi", areaName: "汐止區" },
    { url: "area-filter/泰山區.json", areaId: "Taishan", areaName: "泰山區" },
    { url: "area-filter/淡水區.json", areaId: "Tamsui", areaName: "淡水區" },
    { url: "area-filter/深坑區.json", areaId: "Shenkeng", areaName: "深坑區" },
    { url: "area-filter/烏來區.json", areaId: "Wulai", areaName: "烏來區" },
    { url: "area-filter/瑞芳區.json", areaId: "Ruifang", areaName: "瑞芳區" },
    { url: "area-filter/石碇區.json", areaId: "Shiding", areaName: "石碇區" },
    { url: "area-filter/石門區.json", areaId: "Shimen", areaName: "石門區" },
    { url: "area-filter/萬里區.json", areaId: "Wanli", areaName: "萬里區" },
    { url: "area-filter/蘆洲區.json", areaId: "Luzhou", areaName: "蘆洲區" },
    { url: "area-filter/貢寮區.json", areaId: "Gongliao", areaName: "貢寮區" },
    { url: "area-filter/金山區.json", areaId: "Jinshan", areaName: "金山區" },
    { url: "area-filter/雙溪區.json", areaId: "Shuangxi", areaName: "雙溪區" },
    { url: "area-filter/鶯歌區.json", areaId: "Yingge", areaName: "鶯歌區" },
  ];

  function getAreaStyle(id) {
    const isSelected = selectedAreas.has(id);
    return {
      color: isSelected ? "#00d1ff" : "#4f6bff",
      weight: isSelected ? 3 : 1.5,
      fillColor: isSelected ? "#00d1ff" : "#4f6bff",
      fillOpacity: isSelected ? 0.35 : 0.18,
    };
  }

  function loadDistrictFromSimpleJson({ url, areaId, areaName }) {
    areaMeta[areaId] = { name: areaName };

    fetch(url)
      .then((r) => r.json())
      .then((rawCoords) => {
        const latlngs = rawCoords.map((p) => [p[0], p[1]]);
        const polygon = L.polygon(latlngs, getAreaStyle(areaId));
        polygon.areaId = areaId;
        polygon.areaName = areaName;

        polygon.on("click", function () {
          if (!selectionMode) return;
          toggleAreaSelection(areaId);
        });

        areaLayers[areaId] = polygon;
      })
      .catch((err) => {
        console.error("載入行政區失敗：", areaName, err);
      });
  }

  districts.forEach(loadDistrictFromSimpleJson);

  // ====== 10. checkbox ======
  function buildAreaCheckboxList() {
    const groupEl = document.getElementById("districtCheckboxGroup");
    if (!groupEl) return;
    groupEl.innerHTML = "";

    const allLabel = document.createElement("label");
    allLabel.className = "checkbox-item checkbox-item--all";
    allLabel.htmlFor = "district-all";

    const allCheckbox = document.createElement("input");
    allCheckbox.type = "checkbox";
    allCheckbox.id = "district-all";

    const allSpan = document.createElement("span");
    allSpan.textContent = "全部勾選";

    allLabel.appendChild(allCheckbox);
    allLabel.appendChild(allSpan);
    groupEl.appendChild(allLabel);

    districts.forEach((d) => {
      const label = document.createElement("label");
      label.className = "checkbox-item";
      label.htmlFor = "chk-" + d.areaId;

      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.id = "chk-" + d.areaId;
      cb.className = "district-checkbox";
      cb.dataset.areaId = d.areaId;
      cb.checked = selectedAreas.has(d.areaId);

      const span = document.createElement("span");
      span.textContent = d.areaName;

      label.appendChild(cb);
      label.appendChild(span);
      groupEl.appendChild(label);

      cb.addEventListener("change", () => toggleAreaSelection(d.areaId));
    });

    allCheckbox.addEventListener("change", () => {
      if (allCheckbox.checked) {
        districts.forEach((d) => selectedAreas.add(d.areaId));
      } else {
        selectedAreas.clear();
      }
      Object.keys(areaLayers).forEach((id) => areaLayers[id].setStyle(getAreaStyle(id)));
      updateSelectedList();
      refreshDataView();
      syncCheckboxesFromSelection();
    });

    syncCheckboxesFromSelection();
  }

  function syncCheckboxesFromSelection() {
    const itemCheckboxes = document.querySelectorAll("#districtCheckboxGroup .district-checkbox");
    itemCheckboxes.forEach((cb) => {
      cb.checked = selectedAreas.has(cb.dataset.areaId);
    });

    const allCheckbox = document.getElementById("district-all");
    if (!allCheckbox) return;

    if (selectedAreas.size === 0) {
      allCheckbox.checked = false;
      allCheckbox.indeterminate = false;
    } else if (selectedAreas.size === districts.length) {
      allCheckbox.checked = true;
      allCheckbox.indeterminate = false;
    } else {
      allCheckbox.checked = false;
      allCheckbox.indeterminate = true;
    }
  }

  function updateSelectedList() {
    const el = document.getElementById("selectedListContent");
    if (!el) return;

    if (isDistrictFilterLocked()) {
      el.textContent = "此帳號不可使用行政區篩選";
      el.classList.add("selected-list-empty");
      return;
    }

    if (!selectedAreas.size) {
      el.textContent = "未選取（顯示全部點位、無行政區外框）";
      el.classList.add("selected-list-empty");
      return;
    }

    const names = Array.from(selectedAreas).map((id) => areaMeta[id]?.name || id);
    el.textContent = names.join("、");
    el.classList.remove("selected-list-empty");
  }

  function updateAreaVisibilityAfterApply() {
    if (isDistrictFilterLocked()) {
      hideAllAreaLayers();
      return;
    }

    Object.keys(areaLayers).forEach((id) => {
      const layer = areaLayers[id];
      if (selectedAreas.has(id)) {
        if (!map.hasLayer(layer)) map.addLayer(layer);
        layer.setStyle(getAreaStyle(id));
      } else {
        if (map.hasLayer(layer)) map.removeLayer(layer);
      }
    });
  }

  function toggleAreaSelection(id) {
    if (isDistrictFilterLocked()) return;

    if (selectedAreas.has(id)) selectedAreas.delete(id);
    else selectedAreas.add(id);

    if (areaLayers[id]) areaLayers[id].setStyle(getAreaStyle(id));

    updateSelectedList();
    refreshDataView();
    syncCheckboxesFromSelection();

    if (!selectionMode) updateAreaVisibilityAfterApply();
  }

  buildAreaCheckboxList();
  updateSelectedList();
  updateAreaVisibilityAfterApply();

  function setSelectionMode(enabled) {
    if (isDistrictFilterLocked()) {
      selectionMode = false;
      hideAllAreaLayers();
      return;
    }

    selectionMode = enabled;
    if (enabled) {
      Object.keys(areaLayers).forEach((id) => {
        const layer = areaLayers[id];
        if (!map.hasLayer(layer)) layer.addTo(map);
        layer.setStyle(getAreaStyle(id));
      });
    } else {
      updateAreaVisibilityAfterApply();
    }
  }

  // ====== 11. 地圖選項 UI ======
  const mapOptionsWrapper = document.getElementById("mapOptionsWrapper");
  const mapOptionsTab = document.getElementById("mapOptionsTab");
  const sectionHeaders = document.querySelectorAll(".map-option-header");
  const layerToggles = document.querySelectorAll(".layer-toggle");
  const clearLayersBtn = document.getElementById("clearLayersBtn");
  const clearDistrictBtn = document.getElementById("clearDistrictBtn");
  const districtDoneBtn = document.getElementById("districtDoneBtn");
  const basemapSelect = document.getElementById("basemapSelect");
  const layerOptionsHeader = document.querySelector('.map-option-header[data-target="layerOptionsBody"]');
  const layerOptionsBody = document.getElementById("layerOptionsBody");
  const layerOptionsToggleIcon = layerOptionsHeader?.querySelector(".map-option-toggle-icon");

  function syncLayerOptionsLockState() {
    if (!layerOptionsHeader || !layerOptionsBody) return;

    if (isLayerOptionsLocked()) {
      layerOptionsHeader.classList.add("is-locked");
      layerOptionsBody.classList.add("active");
      if (layerOptionsToggleIcon) layerOptionsToggleIcon.textContent = "";
      return;
    }

    layerOptionsHeader.classList.remove("is-locked");
    if (layerOptionsToggleIcon && !layerOptionsBody.classList.contains("active")) {
      layerOptionsToggleIcon.textContent = "+";
    }
  }

  mapOptionsTab?.addEventListener("click", () => {
    const isOpen = mapOptionsWrapper.classList.contains("open");
    if (isOpen) {
      mapOptionsWrapper.classList.remove("open");
      setSelectionMode(false);
    } else {
      mapOptionsWrapper.classList.add("open");
      const districtBody = document.getElementById("districtFilterBody");
      if (districtBody && districtBody.classList.contains("active")) setSelectionMode(true);
    }
  });

  sectionHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      const targetId = header.getAttribute("data-target");
      if (targetId === "districtFilterBody" && isDistrictFilterLocked()) return;
      if (targetId === "layerOptionsBody" && isLayerOptionsLocked()) return;

      const targetBody = document.getElementById(targetId);
      const bodies = document.querySelectorAll(".map-option-body");
      const toggleIcons = document.querySelectorAll(".map-option-toggle-icon");
      const wasActive = targetBody.classList.contains("active");

      bodies.forEach((b) => {
        if (isLayerOptionsLocked() && b.id === "layerOptionsBody") return;
        b.classList.remove("active");
      });

      toggleIcons.forEach((icon) => {
        const parentHeader = icon.closest(".map-option-header");
        const parentTargetId = parentHeader?.getAttribute("data-target");
        if (isLayerOptionsLocked() && parentTargetId === "layerOptionsBody") return;
        icon.textContent = "+";
      });

      if (!wasActive) {
        targetBody.classList.add("active");
        const targetIcon = header.querySelector(".map-option-toggle-icon");
        if (targetIcon) targetIcon.textContent = "-";
      }

      if (isLayerOptionsLocked() && layerOptionsBody) {
        layerOptionsBody.classList.add("active");
        if (layerOptionsToggleIcon) layerOptionsToggleIcon.textContent = "";
      }

      if (targetId === "districtFilterBody" && !wasActive) setSelectionMode(true);
      else setSelectionMode(false);
    });
  });

  clearLayersBtn?.addEventListener("click", () => {
    layerToggles.forEach((input) => {
      input.checked = false;
      if (Object.prototype.hasOwnProperty.call(layerVisibility, input.dataset.layer)) {
        layerVisibility[input.dataset.layer] = false;
      }
    });
    applyLayerVisibility();
  });

  clearDistrictBtn?.addEventListener("click", () => {
    if (isDistrictFilterLocked()) return;

    selectedAreas.clear();
    updateSelectedList();
    refreshDataView();
    syncCheckboxesFromSelection();
    if (selectionMode) {
      Object.keys(areaLayers).forEach((id) => {
        areaLayers[id].setStyle(getAreaStyle(id));
        if (!map.hasLayer(areaLayers[id])) map.addLayer(areaLayers[id]);
      });
    } else {
      updateAreaVisibilityAfterApply();
    }
  });

  districtDoneBtn?.addEventListener("click", () => {
    mapOptionsWrapper.classList.remove("open");
    setSelectionMode(false);
  });

  function switchBasemap(type) {
    if (type === "orthophoto") {
      if (map.hasLayer(baseVector)) map.removeLayer(baseVector);
      if (!map.hasLayer(baseOrtho)) baseOrtho.addTo(map);
      return;
    }

    if (map.hasLayer(baseOrtho)) map.removeLayer(baseOrtho);
    if (!map.hasLayer(baseVector)) baseVector.addTo(map);
  }

  basemapSelect?.addEventListener("change", () => {
    switchBasemap(basemapSelect.value);
  });

  // 初始值同步
  if (basemapSelect) {
    switchBasemap(basemapSelect.value);
  }


  layerToggles.forEach((input) => {
    input.addEventListener("change", () => {
      const layerName = input.dataset.layer;

      if (Object.prototype.hasOwnProperty.call(layerVisibility, layerName)) {
        layerVisibility[layerName] = input.checked;
      }

      if (layerName === "airPollution" || layerName === "fireReport" || layerName === "nonRegBusiness" || layerName === "regBusiness" || layerName === "vehicle" || layerName === "favorites") {
        closeAllPopups();
        refreshDataView();
        return;
      }

      if (layerName === "windField") {
        toggleWindLayer(input.checked);
      }
    });
  });

  function buildLoginLogText(accountItem) {
    const lines = [
      "EIMP 帳號登入紀錄",
      `帳號：${accountItem.account || "-"}`,
      `姓名：${accountItem.name || "-"}`,
      `所屬單位：${accountItem.unit || "-"}`,
      "",
      "時間	IP	結果",
    ];

    const logLines = (accountItem.loginLogs || []).map((logItem) => {
      return `${logItem.time || "-"}	${logItem.ip || "-"}	${logItem.result || "-"}`;
    });

    if (!logLines.length) {
      logLines.push("目前無登入紀錄");
    }

    return [...lines, ...logLines].join("");
  }

  function downloadAccountLoginLog(accountId) {
    const accountItem = squadAccounts.find((item) => String(item.id) === String(accountId));
    if (!accountItem) return;

    const fileContent = buildLoginLogText(accountItem);
    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const safeAccount = String(accountItem.account || "account").replace(/[^a-zA-Z0-9_-]/g, "_");

    link.href = blobUrl;
    link.download = `${safeAccount}_login_log.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 0);
  }

  function renderAccountManageTable(keyword = "") {
    if (!accountManageTableBody) return;

    const normalizedKeyword = (keyword || "").trim().toLowerCase();
    const filteredAccounts = squadAccounts.filter((item) => {
      if (!normalizedKeyword) return true;
      return [item.account, item.unit, item.name].some((value) =>
        String(value || "").toLowerCase().includes(normalizedKeyword)
      );
    });

    accountManageTableBody.innerHTML = filteredAccounts.map((item, index) => {
      return `
      <tr>
        <td>${index + 1}</td>
        <td>${item.account}</td>
        <td>${item.unit}</td>
        <td>${item.name}</td>
        <td>
          <button type="button" class="account-manage-log-btn" data-account-id="${item.id}">下載</button>
        </td>
        <td><button type="button" class="account-manage-row-btn" data-account-id="${item.id}">管理</button></td>
      </tr>
    `;
    }).join("");
  }

  function fillAccountDetail(accountItem) {
    if (!accountItem) return;
    currentManagedAccountId = accountItem.id;
    if (manageAccountInput) manageAccountInput.value = accountItem.account;
    if (manageCompanyInput) manageCompanyInput.value = accountItem.unit;
    if (manageNameInput) manageNameInput.value = accountItem.name;
    if (manageJobInput) manageJobInput.value = accountItem.jobTitle;
    if (managePhoneInput) managePhoneInput.value = accountItem.phone;
    if (manageEmailInput) manageEmailInput.value = accountItem.email;
    if (manageAdminCheckbox) manageAdminCheckbox.checked = !!accountItem.isAdmin;
    if (manageEnabledCheckbox) manageEnabledCheckbox.checked = !!accountItem.enabled;
  }

  function showAccountPage(pageName) {
    const showProfile = pageName === "profile";
    const showList = pageName === "accountList";
    const showDetail = pageName === "accountDetail";

    const profilePage = document.querySelector('.profile-drawer-content > .profile-drawer-page:not(.account-manage-page)');
    if (profilePage) profilePage.hidden = !showProfile;
    if (accountManageListPage) accountManageListPage.hidden = !showList;
    if (accountManageDetailPage) accountManageDetailPage.hidden = !showDetail;
  }

  function openAccountManagementPanel() {
    if (!getCurrentAccountConfig().canManageAccounts) return;
    renderAccountManageTable(accountManageSearchInput?.value || "");
    showAccountPage("accountList");
    body.classList.add("profile-open");
    profileDrawerPanel?.setAttribute("aria-hidden", "false");
    setMenuActiveButton(accountManageMenuBtn);
  }

  function openAccountDetail(accountId) {
    const accountItem = squadAccounts.find((item) => String(item.id) === String(accountId));
    if (!accountItem) return;
    fillAccountDetail(accountItem);
    showAccountPage("accountDetail");
    body.classList.add("profile-open");
    profileDrawerPanel?.setAttribute("aria-hidden", "false");
    setMenuActiveButton(accountManageMenuBtn);
  }


  function applyVehicleLayerPermission() {
    const vehicleToggle = document.querySelector('.layer-toggle[data-layer="vehicle"]');
    const vehicleRow = vehicleToggle?.closest(".vehicle-layer-row") || document.querySelector('[data-supervisor-only-layer="vehicle"]');
    if (!vehicleToggle || !vehicleRow) return;
    const allowed = canCurrentAccountSeeVehicleLayer();
    vehicleRow.hidden = !allowed;
    vehicleToggle.disabled = !allowed;
    if (!allowed) {
      vehicleToggle.checked = false;
      layerVisibility.vehicle = false;
      return;
    }
    vehicleToggle.checked = true;
    layerVisibility.vehicle = true;
  }

  function applyAccountView() {
    const accountConfig = getCurrentAccountConfig();

    selectedAreas.clear();
    activeId = null;
    updateSelectedList();
    syncCheckboxesFromSelection();
    hideAllAreaLayers();
    setSelectionMode(false);

    if (districtFilterSection) {
      districtFilterSection.style.display = accountConfig.hideDistrictFilter ? "none" : "";
    }

    if (decisionMenuBtn) {
      decisionMenuBtn.style.display = canCurrentAccountUseDecision() ? "block" : "none";
    }

    const districtBody = document.getElementById("districtFilterBody");
    if (districtBody) {
      districtBody.classList.remove("active");
    }

    const districtToggleIcon = document.querySelector('.map-option-header[data-target="districtFilterBody"] .map-option-toggle-icon');
    if (districtToggleIcon) districtToggleIcon.textContent = "+";

    applyVehicleLayerPermission();
    syncLayerOptionsLockState();

    refreshDataView();

    if (!accountConfig.canManageAccounts) {
      const listHidden = accountManageListPage?.hidden !== false;
      const detailHidden = accountManageDetailPage?.hidden !== false;
      if (!listHidden || !detailHidden) {
        showAccountPage("profile");
        setMenuActiveButton(profileMenuBtn);
      }
    }
  }

  window.addEventListener("eimp:account-changed", (event) => {
    currentAccountKey = event.detail?.account?.key || "default";
    applyAccountView();
  });

  applyAccountView();

  // ====== 12. 快速定位 UI ======
  const quickLocateWrapper = document.getElementById("quickLocateWrapper");
  const quickLocateTab = document.getElementById("quickLocateTab");
  const locateTypeSelect = document.getElementById("locateTypeSelect");
  const quickLocateFormContainer = document.getElementById("quickLocateFormContainer");
  const quickLocateClearBtn = document.getElementById("quickLocateClearBtn");
  const quickLocateGoBtn = document.getElementById("quickLocateGoBtn");

  const quickLocateLayer = L.layerGroup().addTo(map);

  const newTaipeiDistricts = [
    "板橋區","中和區","永和區","新店區","土城區","新莊區","三重區","蘆洲區","汐止區",
    "林口區","泰山區","五股區","淡水區","三芝區","石門區","八里區","三峽區","鶯歌區",
    "樹林區","深坑區","石碇區","坪林區","平溪區","瑞芳區","貢寮區","金山區","萬里區",
    "雙溪區","烏來區",
  ];

  function createRow(labelText, fieldEl) {
    const row = document.createElement("div");
    row.className = "quick-locate-row";

    const label = document.createElement("div");
    label.className = "quick-locate-label";
    label.textContent = labelText;

    row.appendChild(label);
    row.appendChild(fieldEl);
    return row;
  }

  function createLockedCityRow() {
    const cityInput = document.createElement("input");
    cityInput.id = "qlCounty";
    cityInput.className = "quick-locate-input readonly-input";
    cityInput.value = "新北市";
    cityInput.readOnly = true;
    return createRow("縣市", cityInput);
  }

  function createDistrictSelect(id) {
    const sel = document.createElement("select");
    sel.id = id;
    sel.className = "quick-locate-select";

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "請選擇";
    sel.appendChild(placeholder);

    newTaipeiDistricts.forEach((d) => {
      const opt = document.createElement("option");
      opt.value = d;
      opt.textContent = d;
      sel.appendChild(opt);
    });
    return sel;
  }

  function createSimpleSelect(id, options) {
    const sel = document.createElement("select");
    sel.id = id;
    sel.className = "quick-locate-select";
    options.forEach((txt) => {
      const opt = document.createElement("option");
      opt.value = txt;
      opt.textContent = txt;
      sel.appendChild(opt);
    });
    return sel;
  }

  function createNumberInput(id, placeholder) {
    const input = document.createElement("input");
    input.id = id;
    input.type = "number";
    input.className = "quick-locate-input";
    input.placeholder = placeholder || "";
    return input;
  }

  function createTextInput(id, placeholder) {
    const input = document.createElement("input");
    input.id = id;
    input.type = "text";
    input.className = "quick-locate-input";
    input.placeholder = placeholder || "";
    return input;
  }

  function renderQuickLocateFields(type) {
    if (!quickLocateFormContainer) return;
    quickLocateFormContainer.innerHTML = "";

    if (type === "address" || type === "cadastre" || type === "road" || type === "streetlight") {
      quickLocateFormContainer.appendChild(createLockedCityRow());
    }

    if (type === "cadastre") {
      const distSel = createDistrictSelect("cadDistrictSelect");
      quickLocateFormContainer.appendChild(createRow("行政區", distSel));

      const sectionSel = createSimpleSelect("cadSectionSelect", ["請選擇"]);
      quickLocateFormContainer.appendChild(createRow("地段", sectionSel));

      const motherInput = createNumberInput("cadMotherNoInput", "母號");
      quickLocateFormContainer.appendChild(createRow("地號母號", motherInput));

      const subInput = createNumberInput("cadSubNoInput", "子號");
      quickLocateFormContainer.appendChild(createRow("地號子號", subInput));
      window.EIMPNTPCAddressLocation?.bindLandSectionSelect();
    } else if (type === "address") {
      const distSel2 = createDistrictSelect("addrDistrictSelect");
      quickLocateFormContainer.appendChild(createRow("行政區", distSel2));
      quickLocateFormContainer.appendChild(createRow("地址", createTextInput("addrAddressInput", "例：三民路1段1巷38弄1號")));
    } else if (type === "coord") {
      const lngInput = createNumberInput("coordLngInput", "請輸入經度");
      const latInput = createNumberInput("coordLatInput", "請輸入緯度");
      quickLocateFormContainer.appendChild(createRow("經度", lngInput));
      quickLocateFormContainer.appendChild(createRow("緯度", latInput));
    } else if (type === "road") {
      const distSel3 = createDistrictSelect("roadDistrictSelect");
      quickLocateFormContainer.appendChild(createRow("行政區", distSel3));

      const sectionSel2 = createSimpleSelect("roadSectionSelect", ["請選擇","一段","二段","三段"]);
      quickLocateFormContainer.appendChild(createRow("段", sectionSel2));

      const laneSel = createSimpleSelect("roadLaneSelect", ["請選擇","1巷","2巷","3巷"]);
      quickLocateFormContainer.appendChild(createRow("巷", laneSel));

      const alleySel = createSimpleSelect("roadAlleySelect", ["請選擇","1弄","2弄","3弄"]);
      quickLocateFormContainer.appendChild(createRow("弄", alleySel));
    } else if (type === "streetlight") {
      const lampDistSel = createDistrictSelect("streetlightDistrictSelect");
      quickLocateFormContainer.appendChild(createRow("行政區", lampDistSel));

      const lampInput = createNumberInput("streetlightNumberInput", "請輸入路燈編號");
      quickLocateFormContainer.appendChild(createRow("路燈編號", lampInput));
    }
  }

  quickLocateTab?.addEventListener("click", () => {
    quickLocateWrapper.classList.toggle("open");
  });

  locateTypeSelect?.addEventListener("change", () => {
    renderQuickLocateFields(locateTypeSelect.value);
  });

  renderQuickLocateFields(locateTypeSelect?.value || "address");

  function clearQuickLocateInputs() {
    if (!quickLocateFormContainer) return;
    const inputs = quickLocateFormContainer.querySelectorAll("input, select");
    inputs.forEach((el) => {
      if (el.tagName.toLowerCase() === "select") el.selectedIndex = 0;
      else if (!el.classList.contains("readonly-input")) el.value = "";
    });
    quickLocateLayer.clearLayers();
    removeLocationMarkerIfUnlockedAndExists(true);
    closeAllPopups();
  }

  quickLocateClearBtn?.addEventListener("click", clearQuickLocateInputs);

  quickLocateGoBtn?.addEventListener("click", async () => {
    const type = locateTypeSelect.value;

    if (type === "cadastre") {
      const service = window.EIMPNTPCAddressLocation;
      if (!service) return alert("新北市地籍定位模組載入失敗。");
      if (locationLocked) return alert("定位已鎖定，請先點鎖頭解鎖後再重新定位。");
      const params = service.getCadastreValues();
      quickLocateGoBtn.disabled = true;
      try {
        const { lat, lng } = await service.locateLandNumber(params);
        closeAllPopups();
        setSimulationLocation(L.latLng(lat, lng), {
          town: params.town,
          landSection: params.landSection,
          landNumber: `${params.landNumberMom}-${params.landNumberSon || "0"}`,
        });
        map.setView([lat, lng], 17, { animate: false });
      } catch (error) {
        alert(error.message || "地籍定位失敗，請稍後再試。");
      } finally {
        quickLocateGoBtn.disabled = false;
      }
      return;
    }

    if (type === "address") {
      const service = window.EIMPNTPCAddressLocation;
      if (!service) return alert("新北市地址定位模組載入失敗。");
      if (locationLocked) return alert("定位已鎖定，請先點鎖頭解鎖後再重新定位。");
      const params = service.getFormValues();
      quickLocateGoBtn.disabled = true;
      try {
        const { lat, lng } = await service.locateAddress(params);
        closeAllPopups();
        setSimulationLocation(L.latLng(lat, lng), {
          town: params.town,
          address: service.formatAddress(params),
        });
        map.setView([lat, lng], 17, { animate: false });
      } catch (error) {
        alert(error.message || "地址定位失敗，請稍後再試。");
      } finally {
        quickLocateGoBtn.disabled = false;
      }
      return;
    }

    if (type === "coord") {
      const lngStr = document.getElementById("coordLngInput")?.value || "";
      const latStr = document.getElementById("coordLatInput")?.value || "";
      if (!lngStr.trim() || !latStr.trim()) {
        alert("請輸入經度與緯度。");
        return;
      }

      const lng = parseFloat(lngStr);
      const lat = parseFloat(latStr);

      if (isNaN(lat) || isNaN(lng) || lat < 20 || lat > 26 || lng < 120 || lng > 122.5) {
        alert("經緯度超出台灣範圍或格式錯誤，請再次確認。");
        return;
      }

      closeAllPopups();

      if (locationLocked) {
        alert("定位已鎖定，請先點鎖頭解鎖後再重新定位。");
        return;
      }

      setSimulationLocation(L.latLng(lat, lng));

      map.setView([lat, lng], map.getZoom(), { animate: false });
    } else {
      alert("此定位方式尚未串接服務（目前示範用）。");
    }
  });

  // ====== 13. 模擬流程：地圖點擊 ======
  map.on("click", (event) => {
    if (selectionMode) return;
    if (event.originalEvent?.target?.closest?.(".leaflet-marker-icon")) return;

    if (hasAnyPopupOpen()) {
      closeAllPopups();
      return;
    }

  });

  function showModal() {
    const mapPanel = modalBackdrop?.parentElement;
    if (modalBackdrop && mapPanel) {
      modalBackdrop.style.left = `${mapPanel.scrollLeft}px`;
      modalBackdrop.style.top = `${mapPanel.scrollTop}px`;
      modalBackdrop.style.right = "auto";
      modalBackdrop.style.bottom = "auto";
      modalBackdrop.style.width = `${mapPanel.clientWidth}px`;
      modalBackdrop.style.height = `${mapPanel.clientHeight}px`;
    }
    modalBackdrop?.classList.add("show");
  }
  function hideModal() {
    modalBackdrop?.classList.remove("show");
  }
  document.addEventListener("eimp:open-simulation-analysis", () => {
    if (currentLatLng) showModal();
    else alert("無法獲取模擬位置座標，請重試。");
  });

  function clearSimulationLayers() {
    if (dispersionLayer && map.hasLayer(dispersionLayer)) map.removeLayer(dispersionLayer);
    if (trajectoryLayer && map.hasLayer(trajectoryLayer)) map.removeLayer(trajectoryLayer);
    dispersionLayer = null;
    trajectoryLayer = null;
  }

  function getSelectedMode() {
    const checked = document.querySelector('input[name="simMode"]:checked');
    return checked ? checked.value : "dispersion";
  }

  function updateModeParamVisibility(mode) {
    if (!dispersionSection || !trajectorySection) return;
    if (mode === "dispersion") {
      dispersionSection.classList.add("active");
      trajectorySection.classList.remove("active");
    } else {
      dispersionSection.classList.remove("active");
      trajectorySection.classList.add("active");
    }
  }

  function showSimLayerBar(mode) {
    if (!simLayerBar) return;
    simLayerBar.classList.add("active");

    if (mode === "trajectory") {
      if (simTimeSelect) simTimeSelect.style.display = "none";
      if (playSimBtn) playSimBtn.style.display = "none";
      stopSimPlayback();
      return;
    }

    if (simTimeSelect) simTimeSelect.style.display = "inline-block";
    if (playSimBtn) playSimBtn.style.display = "inline-flex";
    if (simTimeSelect) simTimeSelect.value = "now";
    setPlayButtonUI(false);
  }

  function hideSimLayerBar() {
    if (!simLayerBar) return;
    simLayerBar.classList.remove("active");
    stopSimPlayback();
  }

  function getRadiusByTimeValue(val) {
    switch (val) {
      case "1h": return dispersionBaseRadius * 1.2;
      case "2h": return dispersionBaseRadius * 1.4;
      case "3h": return dispersionBaseRadius * 1.6;
      case "4h": return dispersionBaseRadius * 1.7;
      case "5h": return dispersionBaseRadius * 1.75;
      case "6h": return dispersionBaseRadius * 2.1;
      case "7h": return dispersionBaseRadius * 2.13;
      case "8h": return dispersionBaseRadius * 2.12;
      case "9h": return dispersionBaseRadius * 1.6;
      case "10h": return dispersionBaseRadius * 1.56;
      case "now":
      default: return dispersionBaseRadius;
    }
  }

  // ✅ 擴散輪播：播放/暫停
  let simPlayTimer = null;
  let isSimPlaying = false;
  const simTimeOrder = ["now","1h","2h","3h","4h","5h","6h","7h","8h","9h","10h"];

  function setPlayButtonUI(playing) {
    if (!playSimBtn) return;
    playSimBtn.textContent = playing ? "⏸ 暫停" : "▶ 播放";
  }

  function stopSimPlayback() {
    if (simPlayTimer) {
      clearInterval(simPlayTimer);
      simPlayTimer = null;
    }
    isSimPlaying = false;
    setPlayButtonUI(false);
  }

  function startSimPlayback() {
    if (!simTimeSelect) return;
    if (!dispersionLayer) return;

    stopSimPlayback();
    isSimPlaying = true;
    setPlayButtonUI(true);

    simPlayTimer = setInterval(() => {
      if (!dispersionLayer) {
        stopSimPlayback();
        return;
      }

      const cur = simTimeSelect.value || "now";
      const idx = simTimeOrder.indexOf(cur);
      const next = simTimeOrder[(idx + 1 + simTimeOrder.length) % simTimeOrder.length];

      simTimeSelect.value = next;
      const radius = getRadiusByTimeValue(next);
      dispersionLayer.setRadius(radius);
    }, 900);
  }

  if (playSimBtn) {
    playSimBtn.addEventListener("click", () => {
      if (!dispersionLayer) return;
      if (isSimPlaying) stopSimPlayback();
      else startSimPlayback();
    });
  }

  function runDispersion() {
    clearSimulationLayers();
    if (!currentLatLng) return;

    let radius = dispersionBaseRadius;
    if (simTimeSelect) radius = getRadiusByTimeValue(simTimeSelect.value);

    dispersionLayer = L.circle(currentLatLng, {
      radius: radius,
      color: "#ff4b4b",
      weight: 1.5,
      fillColor: "#ff7575",
      fillOpacity: 0.35,
    }).addTo(map);

    showSimLayerBar("dispersion");
  }

  function runTrajectory() {
    clearSimulationLayers();
    if (!currentLatLng) return;

    const base = currentLatLng;
    const path = [
      base,
      [base.lat + 0.05, base.lng - 0.05],
      [base.lat + 0.1, base.lng - 0.08],
    ];
    trajectoryLayer = L.polyline(path, {
      color: "#0077ff",
      weight: 3,
      dashArray: "4,6",
    }).addTo(map);

    showSimLayerBar("trajectory");
  }

  modalCloseBtn?.addEventListener("click", hideModal);
  btnCancel?.addEventListener("click", hideModal);
  modalBackdrop?.addEventListener("click", (event) => {
    if (event.target === modalBackdrop) hideModal();
  });

  // ✅ 開始模擬：事件時間改成小時
  btnRun?.addEventListener("click", () => {
    if (!currentLatLng) {
      alert("請先在地圖上選擇模擬位置（點地圖或點擊案件 / 圖標）。");
      return;
    }

    const mode = getSelectedMode();

    if (mode === "dispersion") {
      const emissionHours = parseFloat(emissionDurationInput.value);
      const hoursAgo = parseFloat(eventHoursAgoInput?.value);

      if (isNaN(hoursAgo) || hoursAgo < 0) {
        alert("事件時間需為 0 或正數（小時前）");
        return;
      }
      if (!emissionHours || emissionHours <= 0) {
        alert("排放時間需大於 0 小時");
        return;
      }

      runDispersion();
    } else {
      const backwardH = parseFloat(backwardHoursInput.value);
      if (!backwardH || backwardH <= 0) {
        alert("後推時間需大於 0 小時");
        return;
      }

      runTrajectory();
    }

    hideModal();
    map.closePopup();
  });

  modeOptions.forEach((opt) => {
    opt.addEventListener("click", () => {
      modeOptions.forEach((o) => o.classList.remove("active"));
      opt.classList.add("active");
      const input = opt.querySelector('input[type="radio"]');
      if (input) input.checked = true;
      updateModeParamVisibility(opt.dataset.mode);
    });
  });

  simTimeSelect?.addEventListener("change", () => {
    if (!dispersionLayer) return;
    dispersionLayer.setRadius(getRadiusByTimeValue(simTimeSelect.value));
  });

  closeSimLayerBtn?.addEventListener("click", () => {
    clearSimulationLayers();
    hideSimLayerBar();
  });

  // ====== 14. Popup / 事業詳細資料事件 ======
  businessPermitTypeSelect?.addEventListener("change", function () {
    if (this.value === "water" && currentBusinessDetailItem) {
      renderWaterBusinessLayout(currentBusinessDetailItem);
      populateBusinessDetail(currentBusinessDetailItem);
    }
    switchBusinessAccordion(this.value);
  });

  businessDetailCloseBtn?.addEventListener("click", closeBusinessDetailPanel);

  businessDetailPanel?.addEventListener("click", (e) => {
    const accordionHeader = e.target.closest(".accordion-header");
    if (accordionHeader) {
      const accordionItem = accordionHeader.closest(".accordion-item");
      const accordionWrapper = accordionHeader.closest(".accordion-wrapper");

      if (accordionItem && accordionWrapper) {
        const items = accordionWrapper.querySelectorAll(".accordion-item");
        const isActive = accordionItem.classList.contains("active");

        items.forEach((item) => {
          item.classList.remove("active");
        });

        if (!isActive) {
          accordionItem.classList.add("active");
        }
      }
      return;
    }

    const cemsBtn = e.target.closest(".business-cems-btn");
    if (cemsBtn) {
      businessDetailPanel.querySelectorAll(".business-cems-btn").forEach((btn) => btn.classList.remove("active"));
      cemsBtn.classList.add("active");
      renderBusinessCems(cemsBtn.dataset.key);
      return;
    }

    const cwmsBtn = e.target.closest(".business-cwms-btn");
    if (cwmsBtn) {
      businessDetailPanel.querySelectorAll(".business-cwms-btn").forEach((btn) => btn.classList.remove("active"));
      cwmsBtn.classList.add("active");
      renderBusinessCwms(cwmsBtn.dataset.key);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeBusinessDetailPanel();
  });

  map.getContainer().addEventListener("change", (e) => {
    const target = e.target;
    const popup = target.closest?.(".fire-case-popup");
    if (!popup) return;

    if (target.classList.contains("fire-dispatch-method")) {
      e.stopPropagation();
      updateFireDispatchPopup(popup);
      return;
    }

    if (target.classList.contains("fire-dispatch-team")) {
      e.stopPropagation();
      updateFireDispatchPopup(popup, { rebuildDivisionVehicles: true });
      return;
    }

    if (target.classList.contains("fire-dispatch-vehicle") || target.classList.contains("fire-dispatch-division-vehicle")) {
      e.stopPropagation();
      updateFireDispatchPopup(popup);
    }
  });

  map.getContainer().addEventListener("click", (e) => {
    const target = e.target;

    const dispatchButton = target.closest?.(".fire-dispatch-btn");
    if (dispatchButton) {
      e.preventDefault();
      e.stopPropagation();
      const popup = dispatchButton.closest(".fire-case-popup");
      if (!popup) return;
      updateFireDispatchPopup(popup);
      const summary = popup.querySelector(".fire-dispatch-summary-text")?.textContent || "尚未選擇指派對象";
      const reassignment = popup.querySelector(".fire-dispatch-reassignment-text")?.textContent || "";
      const statusEl = popup.querySelector(".fire-dispatch-confirm-status");
      if (statusEl) statusEl.textContent = "已確認此筆調度設定（示意資料，尚未送出後端）。";
      alert(`${summary}\n${reassignment}`);
      return;
    }

    const fireTabBtn = target.closest(".case-popup-tab");
    if (fireTabBtn) {
      e.preventDefault();
      e.stopPropagation();

      const popup = fireTabBtn.closest(".fire-case-popup");
      if (!popup) return;

      const tabName = fireTabBtn.dataset.tab;

      popup.querySelectorAll(".case-popup-tab").forEach((btn) => {
        btn.classList.toggle("active", btn === fireTabBtn);
      });

      popup.querySelectorAll(".fire-tab-content").forEach((panel) => {
        panel.classList.toggle("active", panel.dataset.tabPanel === tabName);
      });

      popup.dataset.activeTab = tabName;
      popup.classList.toggle("is-dispatch-tab", tabName === "dispatch");

      return;
    }

    if (target.classList && target.classList.contains("popup-btn-open")) {
      e.stopPropagation();
      if (currentLatLng) showModal();
      else alert("無法獲取模擬位置座標，請重試。");
      return;
    }

    if (target.classList && target.classList.contains("business-detail-trigger")) {
      e.preventDefault();
      e.stopPropagation();
      const item = [...regBusinessCases, ...nonRegBusinessCases].find((entry) => String(entry.id) === String(target.dataset.itemId));
      if (item) openBusinessDetailPanel(item);
      return;
    }

    if (target.classList && target.classList.contains("popup-favorite-btn")) {
      e.preventDefault();
      e.stopPropagation();
      toggleFavorite(target.dataset.itemType, target.dataset.itemId);
      return;
    }

    if (target.classList && target.classList.contains("popup-lock-icon")) {
      e.stopPropagation();

      const img = target;
      const locked = img.dataset.locked === "true";

      if (!locked) {
        locationLocked = true;
        img.src = "images/lock.png";
        img.dataset.locked = "true";
      } else {
        locationLocked = false;
        img.src = "images/unlock.png";
        img.dataset.locked = "false";
      }
    }
  });

  // ====== 右側現在時間 ======
  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function updateNowTimeText() {
    if (!simNowTime) return;

    const d = new Date();
    const y = d.getFullYear();
    const m = pad2(d.getMonth() + 1);
    const day = pad2(d.getDate());
    const hh = pad2(d.getHours());
    const mm = pad2(d.getMinutes());

    simNowTime.textContent = `${y}/${m}/${day}  ${hh}:${mm}`;
  }

  updateNowTimeText();
  setInterval(updateNowTimeText, 1000);

  // 漢堡選單與帳號抽屜統一由 side-menu-common.js 管理。
  const body = document.body;
  const sideMenu = window.EIMPSideMenu;
  const profileMenuBtn = document.getElementById("profileMenuBtn");
  const profileDrawerPanel = document.getElementById("profileDrawerPanel");

  function setMenuActiveButton(targetBtn) {
    sideMenu?.setActive(targetBtn);
  }

});
