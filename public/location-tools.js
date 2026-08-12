(function () {
  "use strict";

  const TOPIC_OPTIONS = {
    air: ["火災", "空污陳情", "事業"],
    water: ["水污陳情", "事業"],
    waste: ["非法棄置點", "事業"],
    noise: ["噪音陳情", "事業"],
  };

  const ANALYSIS_DATA = {
    air: [
      { id: "EA-F001", type: "火災", nativeLayerKey: "fire", name: "板橋區倉庫火警", time: "12/02 13:42", fireType: "倉庫火警", status: "處理中", address: "新北市板橋區三民路一段周邊", lat: 25.0106, lng: 121.4543, icon: "images/火災報案.png", popupKind: "fire" },
      { id: "EA-A001", type: "空污陳情", nativeLayerKey: "air", name: "板橋區異味陳情", caseNo: "EA-A001", time: "12/02 15:40", reportTime: "12/02 15:40", pollutionMain: "異味污染物", pollutionSub: "其他異味", complaintText: "民眾反映周邊有明顯異味。", handleUnit: "空氣品質維護科", teamLeader: "第一稽查分隊", status: "案件稽查中", address: "新北市板橋區三民路一段", lat: 25.0132, lng: 121.4595, icon: "images/民眾陳情.png", popupKind: "complaint" },
      { id: "EA-B001", type: "事業", nativeLayerKey: "regBusiness", name: "新北環保科技股份有限公司", businessName: "新北環保科技股份有限公司", controlNo: "F1234567", unifiedNo: "12345678", industrialParkName: "板橋產業園區", industryName: "金屬製品製造業", regulatedType: "列管事業", inspectManageNo: "2026000001", tempManageNo: "-", factoryLicenseNo: "99-123456-78", address: "新北市板橋區中山路二段", lat: 25.0118, lng: 121.4529, icon: "images/工廠許可(列管).png", popupKind: "business" },
    ],
    water: [
      { id: "EW-W001", type: "水污陳情", nativeLayerKey: "airPollution", name: "新店溪排水異常陳情", title: "新店溪排水異常陳情", time: "12/02 13:49", status: "採樣檢驗中", address: "新北市中和區橋和路周邊", lat: 24.9998, lng: 121.4932, icon: "images/民眾陳情.png", popupKind: "complaint" },
      { id: "EW-B001", type: "事業", nativeLayerKey: "regBusiness", name: "中和水資源企業有限公司", businessName: "中和水資源企業有限公司", controlNo: "F2345678", unifiedNo: "23456789", industrialParkName: "-", industryName: "污水處理業", regulatedType: "列管事業", address: "新北市中和區中山路二段", lat: 25.0003, lng: 121.4930, icon: "images/工廠許可(列管).png", popupKind: "business" },
    ],
    waste: [
      { id: "ED-D001", type: "非法棄置點", nativeLayerKey: "illegalDumping", name: "五股產業道路棄置點", title: "五股產業道路棄置點", controlUnit: "第三稽查分隊", coordX: "297381.24", coordY: "2775632.18", startDate: "2025/03/18", status: "列管中", address: "新北市五股區成泰路周邊", lat: 25.0849, lng: 121.4381, icon: "images/marker.png", popupKind: "dumping" },
      { id: "ED-B001", type: "事業", nativeLayerKey: "regBusiness", name: "五股資源回收有限公司", businessName: "五股資源回收有限公司", controlNo: "F4567890", unifiedNo: "45678901", industrialParkName: "五股產業園區", industryName: "廢棄物清除處理業", regulatedType: "列管事業", address: "新北市五股區五權路", lat: 25.0835, lng: 121.4368, icon: "images/工廠許可(列管).png", popupKind: "business" },
    ],
    noise: [
      { id: "EN-N001", type: "噪音陳情", nativeLayerKey: "airPollution", name: "板橋區施工噪音陳情", title: "板橋區施工噪音陳情", time: "12/02 15:22", status: "案件稽查中", address: "新北市板橋區三民路一段", lat: 25.0132, lng: 121.4637, icon: "images/民眾陳情.png", popupKind: "complaint" },
      { id: "EN-B001", type: "事業", nativeLayerKey: "regBusiness", name: "板橋精密工業有限公司", businessName: "板橋精密工業有限公司", controlNo: "F5678901", unifiedNo: "56789012", industrialParkName: "-", industryName: "機械設備製造業", regulatedType: "列管事業", address: "新北市板橋區中山路二段", lat: 25.0117, lng: 121.4592, icon: "images/工廠許可(列管).png", popupKind: "business" },
    ],
  };

  let currentLocation = null;
  let analysisLayer = null;
  let analysisResultLayer = null;
  const analysisResultMarkers = new Map();
  let lastAnalysisResults = [];
  let hasAnalysisRun = false;
  window.EIMPAnalysisPopupItems = window.EIMPAnalysisPopupItems || new Map();

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function setLocation(details) {
    currentLocation = { ...details, lat: Number(details.lat), lng: Number(details.lng) };
    window.EIMPCurrentLocation = currentLocation;
  }

  function getLocation() {
    return currentLocation;
  }

  function buildPopupContent(details) {
    const rows = [
      ["經度", `${Number(details.lng).toFixed(6)}° E`],
      ["緯度", `${Number(details.lat).toFixed(6)}° N`],
    ];
    if (details.address) rows.push(["地址", details.address]);
    if (details.town) rows.push(["行政區", details.town]);
    if (details.landSection) rows.push(["地段", details.landSection]);
    if (details.landNumber) rows.push(["地號", details.landNumber]);
    return `<div class="case-popup location-case-popup">
      <div class="case-popup__body"><div class="case-popup__grid">${rows.map(([label, value]) => (
        `<div class="case-popup__k">${escapeHtml(label)}</div><div class="case-popup__v">${escapeHtml(value)}</div>`
      )).join("")}</div></div>
      <div class="case-popup__footer location-popup-actions">
        <button type="button" data-open-analysis-tools>開啟 分析工具</button>
      </div>
    </div>`;
  }

  function getTopic() {
    const page = location.pathname.split("/").pop()?.replace(/\.html$/i, "") || "air";
    return TOPIC_OPTIONS[page] ? page : "air";
  }

  function closeDialog() {
    document.getElementById("environmentAnalysisOverlay")?.classList.remove("show");
  }

  function closeResultsPanel() {
    const panel = document.getElementById("environmentAnalysisResults");
    const backdrop = document.getElementById("environmentAnalysisResultsBackdrop");
    if (panel) panel.hidden = true;
    if (backdrop) backdrop.hidden = true;
  }

  function clearAnalysis() {
    const map = window.EIMPMap;
    if (analysisLayer && map) map.removeLayer(analysisLayer);
    if (analysisResultLayer && map) map.removeLayer(analysisResultLayer);
    analysisLayer = null;
    analysisResultLayer = null;
    analysisResultMarkers.clear();
    lastAnalysisResults = [];
    hasAnalysisRun = false;
    window.EIMPAnalysisPopupItems.clear();
    closeResultsPanel();
    document.getElementById("environmentAnalysisResult")?.replaceChildren();
  }

  function clearLocation() {
    currentLocation = null;
    window.EIMPCurrentLocation = null;
    clearAnalysis();
  }

  function setEnvironmentPanelVisible(visible) {
    const overlay = document.getElementById("environmentAnalysisOverlay");
    overlay?.querySelectorAll("[data-environment-panel]").forEach((element) => {
      element.hidden = !visible;
    });
  }

  function positionOverlay(overlay) {
    const mapPanel = overlay?.parentElement;
    if (!overlay || !mapPanel) return;
    overlay.style.left = `${mapPanel.scrollLeft}px`;
    overlay.style.top = `${mapPanel.scrollTop}px`;
    overlay.style.right = "auto";
    overlay.style.bottom = "auto";
    overlay.style.width = `${mapPanel.clientWidth}px`;
    overlay.style.height = `${mapPanel.clientHeight}px`;
  }

  function openDialog(selectedTool = "") {
    if (!currentLocation) {
      alert("請先使用快速定位功能取得位置，再開啟分析工具。");
      return;
    }
    closeResultsPanel();
    const overlay = document.getElementById("environmentAnalysisOverlay");
    if (!overlay) return;
    positionOverlay(overlay);
    const select = overlay.querySelector("#analysisToolSelect");
    if (select) select.value = selectedTool;
    setEnvironmentPanelVisible(selectedTool === "environment");
    overlay.classList.add("show");
    select?.focus();
  }

  function getDistanceMeters(lat1, lng1, lat2, lng2) {
    if (window.EIMPMap?.distance) {
      return window.EIMPMap.distance([lat1, lng1], [lat2, lng2]);
    }
    const toRadians = (value) => (value * Math.PI) / 180;
    const earthRadius = 6371000;
    const deltaLat = toRadians(lat2 - lat1);
    const deltaLng = toRadians(lng2 - lng1);
    const a = Math.sin(deltaLat / 2) ** 2
      + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(deltaLng / 2) ** 2;
    return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function getAnalysisData() {
    const topic = getTopic();
    const layerTypeMap = {
      air: { air: "空污陳情", fire: "火災", regBusiness: "事業", nonRegBusiness: "事業" },
      water: { airPollution: "水污陳情", regBusiness: "事業", nonRegBusiness: "事業" },
      waste: { illegalDumping: "非法棄置點", regBusiness: "事業", nonRegBusiness: "事業" },
      noise: { airPollution: "噪音陳情", regBusiness: "事業", nonRegBusiness: "事業" },
    };
    const nativeItems = (window.EIMPAnalysisSourceLayers || []).flatMap((layer) => {
      const type = layerTypeMap[topic]?.[layer.key];
      if (!type) return [];
      return (layer.items || [])
        .filter((item) => Number.isFinite(Number(item.lat)) && Number.isFinite(Number(item.lng)))
        .map((item) => ({
          ...item,
          type,
          nativeLayerKey: layer.key,
          name: item.name || item.businessName || item.title || item.fireType || layer.label,
          regulatedType: item.regulatedType || (layer.key === "nonRegBusiness" ? "非列管" : undefined),
          icon: item.icon || layer.icon || "images/marker.png",
          popupKind: layer.key === "fire" ? "fire"
            : (layer.key === "regBusiness" || layer.key === "nonRegBusiness" ? "business"
              : (layer.key === "illegalDumping" ? "dumping" : "complaint")),
        }));
    });
    const uniqueItems = new Map();
    [...(ANALYSIS_DATA[topic] || []), ...nativeItems].forEach((item) => {
      uniqueItems.set(`${item.nativeLayerKey || item.type}:${item.id}`, item);
    });
    return Array.from(uniqueItems.values());
  }

  function buildAnalysisResults(selected, radius) {
    return getAnalysisData()
      .filter((item) => selected.includes(item.type))
      .map((item) => ({
        ...item,
        distance: Math.round(getDistanceMeters(currentLocation.lat, currentLocation.lng, item.lat, item.lng)),
      }))
      .filter((item) => item.distance <= radius)
      .sort((a, b) => a.distance - b.distance);
  }

  function bindLocationPopupDismiss() {
    const map = window.EIMPMap;
    if (!map || map._eimpLocationPopupDismissBound) return;
    map._eimpLocationPopupDismissBound = true;
    map.on("click", (event) => {
      const target = event.originalEvent?.target;
      if (target?.closest?.(".leaflet-popup")) return;
      map.eachLayer((layer) => {
        const popup = layer.getPopup?.();
        const popupClass = String(popup?.options?.className || "");
        if (!popupClass.split(/\s+/).includes("custom-location-popup") || !layer.isPopupOpen?.()) return;
        const markerElement = layer.getElement?.() || layer._icon;
        if (target && markerElement && (target === markerElement || markerElement.contains?.(target))) return;
        layer.closePopup();
      });
    });
  }

  function buildResultPopup(item) {
    const nativePopup = item.nativeLayerKey
      ? window.EIMPAnalysisPopupBridge?.buildPopupContent?.(item, item.nativeLayerKey)
      : null;
    if (nativePopup) return nativePopup;
    const rowsByKind = {
      fire: [["時間", item.time], ["火災類型", item.fireType], ["狀態", item.status], ["地址", item.address]],
      complaint: [["時間", item.time], ["狀態", item.status], ["地址", item.address]],
      business: [["管制編號", item.controlNo], ["事業名稱", item.name], ["行業別", item.industryName], ["列管類型", item.regulatedType], ["地址", item.address]],
      construction: [["工程名稱", item.name], ["許可編號", item.permitNo], ["承造廠商", item.contractor], ["狀態", item.status], ["地址", item.address]],
      dumping: [["列管單位", item.controlUnit], ["名稱", item.name], ["列管日期", item.startDate], ["狀態", item.status], ["地址", item.address]],
    };
    const rows = [...(rowsByKind[item.popupKind] || [["資料名稱", item.name], ["地址", item.address]]), ["距離", `${item.distance.toLocaleString()} 公尺`]];
    return `<div class="case-popup"><div class="case-popup__body"><div class="case-popup__grid">${rows.map(([label, value]) => (
      `<div class="case-popup__k">${escapeHtml(label)}</div><div class="case-popup__v">${escapeHtml(value)}</div>`
    )).join("")}</div></div></div>`;
  }

  function getAnalysisOverlapLabel(item) {
    const labels = {
      air: "空污陳情",
      fire: "火災案件",
      airPollution: item.type || "陳情案件",
      regBusiness: "列管事業",
      nonRegBusiness: "非列管事業",
      illegalDumping: "非法棄置點",
    };
    return labels[item.nativeLayerKey] || item.type || "圖層項目";
  }

  function openAnalysisResultPopup(item) {
    const map = window.EIMPMap;
    const marker = analysisResultMarkers.get(item.id);
    if (!map || !marker) return;
    window.EIMPAnalysisPopupBridge?.beforeOpen?.(marker, item, item.nativeLayerKey);
    marker.openPopup();
  }

  function findOverlappingAnalysisItems(latlng) {
    const map = window.EIMPMap;
    if (!map || !latlng) return [];
    const tolerance = window.innerWidth <= 576 ? 28 : (window.innerWidth <= 768 ? 24 : 20);
    const origin = map.latLngToContainerPoint(latlng);
    const seen = new Set();
    return lastAnalysisResults.filter((item) => {
      const marker = analysisResultMarkers.get(item.id);
      if (!marker || !analysisResultLayer?.hasLayer(marker)) return false;
      const point = map.latLngToContainerPoint(marker.getLatLng());
      if (Math.hypot(point.x - origin.x, point.y - origin.y) > tolerance) return false;
      const key = `${item.nativeLayerKey || item.type}:${item.id}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function openAnalysisOverlapChooser(latlng, items) {
    const map = window.EIMPMap;
    if (!map || !window.L || !items.length) return;
    if (items.length === 1) {
      openAnalysisResultPopup(items[0]);
      return;
    }
    map.closePopup();
    const content = items.map((item, index) => (
      `<button type="button" class="overlap-picker-item" data-analysis-overlap-index="${index}">
        <img src="${escapeHtml(item.icon || "images/marker.png")}" alt="" />
        <span>${escapeHtml(getAnalysisOverlapLabel(item))}</span>
      </button>`
    )).join("");
    const chooser = L.popup({
      maxWidth: 320,
      minWidth: 200,
      className: "custom-overlap-popup",
      autoClose: false,
      closeOnClick: false,
      closeButton: true,
    }).setLatLng(latlng).setContent(`<div class="overlap-picker">${content}</div>`).openOn(map);
    setTimeout(() => {
      const container = chooser.getElement?.();
      container?.querySelectorAll("[data-analysis-overlap-index]").forEach((button) => {
        button.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          const item = items[Number(button.dataset.analysisOverlapIndex)];
          if (!item) return;
          map.closePopup(chooser);
          openAnalysisResultPopup(item);
        });
      });
    }, 0);
  }

  function locateAnalysisResult(item) {
    const map = window.EIMPMap;
    if (!map || !window.L) return;
    const marker = analysisResultMarkers.get(item.id);
    if (!marker) return;
    map.setView([item.lat, item.lng], 17);
    openAnalysisResultPopup(item);
    closeResultsPanel();
  }

  function renderAnalysisResultMarkers(items) {
    const map = window.EIMPMap;
    if (!map || !window.L) return;
    if (analysisResultLayer) map.removeLayer(analysisResultLayer);
    analysisResultLayer = L.layerGroup().addTo(map);
    analysisResultMarkers.clear();
    window.EIMPAnalysisPopupItems.clear();
    items.forEach((item) => {
      window.EIMPAnalysisPopupItems.set(String(item.id), item);
      const icon = window.EIMPAnalysisPopupBridge?.getMarkerIcon?.(item, item.nativeLayerKey)
        || L.icon({ iconUrl: item.icon, iconSize: [26, 26], iconAnchor: [13, 26], popupAnchor: [0, -24] });
      const marker = L.marker([item.lat, item.lng], {
        icon,
        zIndexOffset: 1500,
        title: `${item.type}：${item.name}`,
      }).addTo(analysisResultLayer);
      const popupOptions = window.EIMPAnalysisPopupBridge?.getPopupOptions?.(item, item.nativeLayerKey)
        || { maxWidth: 360, minWidth: 270, className: "custom-case-popup", closeButton: true, autoClose: false, closeOnClick: false };
      marker.bindPopup(buildResultPopup(item), popupOptions);
      marker.off("click");
      marker.on("click", (event) => {
        if (event?.originalEvent && window.L?.DomEvent) L.DomEvent.stop(event.originalEvent);
        openAnalysisOverlapChooser(marker.getLatLng(), findOverlappingAnalysisItems(marker.getLatLng()));
      });
      analysisResultMarkers.set(item.id, marker);
    });
  }

  function showResultsPanel() {
    if (!hasAnalysisRun) return false;
    closeDialog();
    const panel = document.getElementById("environmentAnalysisResults");
    const backdrop = document.getElementById("environmentAnalysisResultsBackdrop");
    const body = document.getElementById("environmentAnalysisResultsBody");
    const count = document.getElementById("environmentAnalysisResultsCount");
    if (!panel || !backdrop || !body || !count) return false;
    const mapPanel = panel.parentElement;
    if (mapPanel) {
      backdrop.style.left = `${mapPanel.scrollLeft}px`;
      backdrop.style.top = `${mapPanel.scrollTop}px`;
      backdrop.style.right = "auto";
      backdrop.style.bottom = "auto";
      backdrop.style.width = `${mapPanel.clientWidth}px`;
      backdrop.style.height = `${mapPanel.clientHeight}px`;
      panel.style.left = `${mapPanel.scrollLeft + mapPanel.clientWidth / 2}px`;
      panel.style.top = `${mapPanel.scrollTop + mapPanel.clientHeight / 2}px`;
    }
    count.textContent = `共 ${lastAnalysisResults.length} 筆`;
    body.innerHTML = lastAnalysisResults.length ? `<table class="business-locate-table environment-analysis-results-table">
      <thead><tr><th>資料名稱</th><th>資料類型</th><th>距離</th><th>位置</th><th>操作</th></tr></thead><tbody>${lastAnalysisResults.map((item, index) => (
        `<tr><td><span class="business-locate-name">${escapeHtml(item.name)}</span></td><td>${escapeHtml(item.type)}</td><td>${item.distance.toLocaleString()} 公尺</td><td><span class="business-locate-address">${escapeHtml(item.address)}</span></td><td><button type="button" class="business-locate-pin-button" data-analysis-result-index="${index}">定位</button></td></tr>`
      )).join("")}</tbody></table>` : '<div class="business-locate-empty">查無符合分析範圍與資料類型的結果。</div>';
    backdrop.hidden = false;
    panel.hidden = false;
    panel.querySelector(".environment-analysis-results-close")?.focus();
    return true;
  }

  function openAnalysisEntry() {
    if (hasAnalysisRun) showResultsPanel();
    else openDialog();
  }

  function runAnalysis() {
    if (!currentLocation || !window.EIMPMap || !window.L) return;
    const selected = Array.from(document.querySelectorAll('input[name="environmentAnalysisData"]:checked')).map((input) => input.value);
    if (!selected.length) {
      alert("請至少選擇一項欲查詢的資料。");
      return;
    }
    const radius = Number(document.getElementById("environmentAnalysisRadius")?.value || 500);
    clearAnalysis();
    window.EIMPMap.closePopup();
    window.EIMPMap.invalidateSize({ pan: false });
    const center = L.latLng(currentLocation.lat, currentLocation.lng);
    analysisLayer = L.circle(center, {
      radius,
      color: "#63e0cf",
      weight: 3,
      opacity: 0.95,
      fillColor: "#63e0cf",
      fillOpacity: 0.12,
      interactive: false,
      className: "environment-analysis-range-shape",
    }).addTo(window.EIMPMap);
    analysisLayer.bringToFront();
    lastAnalysisResults = buildAnalysisResults(selected, radius);
    renderAnalysisResultMarkers(lastAnalysisResults);
    window.EIMPMap.fitBounds(analysisLayer.getBounds(), { padding: [44, 44], maxZoom: 17, animate: false });
    analysisLayer.setLatLng(center).setRadius(radius).bringToFront();
    hasAnalysisRun = true;
    closeDialog();
    showResultsPanel();
  }

  function createResultsPanel(mapPanel) {
    const backdrop = document.createElement("div");
    backdrop.id = "environmentAnalysisResultsBackdrop";
    backdrop.className = "business-locate-results-backdrop environment-analysis-results-backdrop";
    backdrop.hidden = true;
    const panel = document.createElement("section");
    panel.id = "environmentAnalysisResults";
    panel.className = "business-locate-results environment-analysis-results";
    panel.hidden = true;
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-labelledby", "environmentAnalysisResultsTitle");
    panel.innerHTML = `<header class="business-locate-results-header">
      <h2 class="business-locate-results-title" id="environmentAnalysisResultsTitle">環域分析查詢結果 <span class="business-locate-results-count" id="environmentAnalysisResultsCount"></span></h2>
      <button type="button" class="business-locate-results-close environment-analysis-results-close" aria-label="關閉查詢結果">×</button>
    </header><div class="business-locate-results-body" id="environmentAnalysisResultsBody"></div>
    <footer class="environment-analysis-results-footer"><button type="button" class="business-locate-button environment-analysis-results-back">返回</button></footer>`;
    mapPanel.append(backdrop, panel);
    backdrop.addEventListener("click", closeResultsPanel);
    panel.querySelector(".environment-analysis-results-close").addEventListener("click", closeResultsPanel);
    panel.querySelector(".environment-analysis-results-back").addEventListener("click", () => {
      closeResultsPanel();
      openDialog("environment");
    });
    panel.addEventListener("click", (event) => {
      const button = event.target.closest("[data-analysis-result-index]");
      if (!button) return;
      const item = lastAnalysisResults[Number(button.dataset.analysisResultIndex)];
      if (item) locateAnalysisResult(item);
    });
  }

  function createAnalysisDialog() {
    if (document.getElementById("environmentAnalysisOverlay")) return;
    const topic = getTopic();
    const mapPanel = document.querySelector(".map-panel");
    if (!mapPanel) return;
    const overlay = document.createElement("div");
    overlay.id = "environmentAnalysisOverlay";
    overlay.className = "modal-backdrop environment-analysis-overlay";
    overlay.innerHTML = `<section class="modal environment-analysis-dialog" role="dialog" aria-modal="true" aria-labelledby="environmentAnalysisTitle">
      <header class="modal-header"><div class="modal-title" id="environmentAnalysisTitle">分析工具</div><button type="button" class="modal-close environment-analysis-close" aria-label="關閉">×</button></header>
      <div class="analysis-tool-switch"><label class="param-group"><div class="param-label">分析功能</div><select class="param-select" id="analysisToolSelect"><option value="">請選擇</option>${topic === "air" ? '<option value="simulation">模擬分析</option>' : ""}<option value="environment">環域分析</option></select></label></div>
      <div class="coord-label" data-environment-panel hidden>以目前定位點為中心，選擇分析半徑與欲查詢資料。</div>
      <div class="section-title" data-environment-panel hidden>分析範圍</div>
      <div class="param-grid environment-analysis-range" data-environment-panel hidden><label class="param-group"><div class="param-label">分析半徑</div><select class="param-select" id="environmentAnalysisRadius"><option value="100">100 公尺</option><option value="300">300 公尺</option><option value="500" selected>500 公尺</option><option value="1000">1 公里</option><option value="2000">2 公里</option><option value="5000">5 公里</option></select></label></div>
      <div class="section-title" data-environment-panel hidden>欲查詢資料</div>
      <div class="mode-row environment-analysis-options" data-environment-panel hidden>${TOPIC_OPTIONS[topic].map((item) => `<label class="mode-option active"><input type="checkbox" name="environmentAnalysisData" value="${escapeHtml(item)}" checked><div><div class="mode-name">${escapeHtml(item)}</div></div></label>`).join("")}</div>
      <footer class="modal-footer environment-analysis-footer" data-environment-panel hidden><div class="footer-hint"></div><div class="footer-buttons"><button type="button" class="btn environment-analysis-clear">清除分析</button><button type="button" class="btn environment-analysis-cancel">取消</button><button type="button" class="btn btn-primary environment-analysis-run">開始分析</button></div></footer>
    </section>`;
    mapPanel.appendChild(overlay);
    createResultsPanel(mapPanel);

    overlay.querySelector(".environment-analysis-close").addEventListener("click", closeDialog);
    overlay.querySelector(".environment-analysis-cancel").addEventListener("click", closeDialog);
    overlay.querySelector(".environment-analysis-clear").addEventListener("click", clearAnalysis);
    overlay.querySelector(".environment-analysis-run").addEventListener("click", runAnalysis);
    overlay.querySelector("#analysisToolSelect").addEventListener("change", (event) => {
      if (event.target.value === "simulation") {
        closeDialog();
        document.dispatchEvent(new CustomEvent("eimp:open-simulation-analysis"));
        return;
      }
      setEnvironmentPanelVisible(event.target.value === "environment");
    });
    overlay.addEventListener("click", (event) => { if (event.target === overlay) closeDialog(); });
    overlay.querySelectorAll('input[name="environmentAnalysisData"]').forEach((input) => {
      input.addEventListener("change", () => input.closest(".mode-option")?.classList.toggle("active", input.checked));
    });

    if (topic === "air") {
      const simulationModal = document.querySelector("#modalBackdrop .modal");
      const simulationHeader = simulationModal?.querySelector(".modal-header");
      if (simulationModal && simulationHeader && !simulationModal.querySelector("#simulationAnalysisToolSelect")) {
        const switcher = document.createElement("div");
        switcher.className = "analysis-tool-switch";
        switcher.innerHTML = '<label class="param-group"><div class="param-label">分析功能</div><select class="param-select" id="simulationAnalysisToolSelect"><option value="simulation">模擬分析</option><option value="environment">環域分析</option></select></label>';
        simulationHeader.insertAdjacentElement("afterend", switcher);
        switcher.querySelector("select").addEventListener("change", (event) => {
          if (event.target.value !== "environment") return;
          document.getElementById("modalBackdrop")?.classList.remove("show");
          openDialog("environment");
          event.target.value = "simulation";
        });
      }
    }
  }

  window.EIMPLocationTools = { setLocation, clearLocation, getLocation, buildPopupContent, openAnalysis: openAnalysisEntry };
  document.addEventListener("click", (event) => {
    if (!event.target.closest?.("[data-open-analysis-tools]")) return;
    event.preventDefault();
    event.stopPropagation();
    openAnalysisEntry();
  });
  document.addEventListener("DOMContentLoaded", () => setTimeout(() => {
    createAnalysisDialog();
    bindLocationPopupDismiss();
  }, 0));
})();
