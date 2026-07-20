// 水主題：讓地圖 popup 行為比照空主題（單一 popup、重疊圖標選擇清單）。
function initWaterPopupBehavior(context, config) {
  const map = context?.map;
  const markerIndex = context?.markerIndex;
  if (!map || !markerIndex || !window.L) return;
  if (map.__eimpWaterPopupBehaviorReady) return;
  map.__eimpWaterPopupBehaviorReady = true;

  const openPopups = new Set();
  const clickableEntries = [];

  function closeAllPopups() {
    Array.from(openPopups).forEach((popup) => {
      try { popup.remove(); } catch (err) {}
    });
    openPopups.clear();
  }

  map.on("popupopen", (event) => {
    // autoClose:false 時仍只保留目前這一個 popup，避免同時疊多個視窗。
    Array.from(openPopups).forEach((popup) => {
      if (popup !== event.popup) {
        try { popup.remove(); } catch (err) {}
        openPopups.delete(popup);
      }
    });
    openPopups.add(event.popup);
  });

  map.on("popupclose", (event) => {
    openPopups.delete(event.popup);
  });

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function setActiveCaseRow(id) {
    document.querySelectorAll(".case-row").forEach((row) => {
      const rowId = row.dataset.caseId || row.dataset.id;
      row.classList.toggle("active", String(rowId) === String(id));
    });
  }

  function isMarkerVisible(marker) {
    return marker && typeof map.hasLayer === "function" && map.hasLayer(marker);
  }

  function getMarkerOverlapPixelTolerance() {
    if (window.innerWidth <= 576) return 28;
    if (window.innerWidth <= 768) return 24;
    return 20;
  }

  function findNearbyMarkers(latlng, pixelTolerance = getMarkerOverlapPixelTolerance()) {
    if (!latlng) return [];
    const originPoint = map.latLngToContainerPoint(latlng);

    const nearby = clickableEntries.filter((entry) => {
      if (!isMarkerVisible(entry.marker) || !entry.marker.getLatLng) return false;
      const markerPoint = map.latLngToContainerPoint(entry.marker.getLatLng());
      const dx = markerPoint.x - originPoint.x;
      const dy = markerPoint.y - originPoint.y;
      return Math.hypot(dx, dy) <= pixelTolerance;
    });

    const deduped = [];
    const seen = new Set();
    nearby.forEach((entry) => {
      const key = `${entry.layerKey}::${entry.item?.id || ""}`;
      if (seen.has(key)) return;
      seen.add(key);
      deduped.push(entry);
    });
    return deduped;
  }

  function buildOverlapPopupContent(items) {
    const html = items.map((entry, index) => `
      <button type="button" class="overlap-picker-item" data-overlap-index="${index}">
        <img src="${escapeHtml(entry.icon)}" alt="" />
        <span>${escapeHtml(entry.label)}</span>
      </button>
    `).join("");

    return `<div class="overlap-picker">${html}</div>`;
  }

  function getWaterOverlapLabel(layerConfig) {
    if (layerConfig?.key === "camera") return "水色異常";
    return layerConfig?.overlapLabel || layerConfig?.label || "圖層項目";
  }

  function openOverlapChooser(latlng, nearbyItems) {
    closeAllPopups();

    L.popup({
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
      container.querySelectorAll("[data-overlap-index]").forEach((button) => {
        button.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          const target = nearbyItems[Number(button.dataset.overlapIndex)];
          if (!target?.marker) return;
          activateMarkerEntry(target);
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
    if (entry.layerKey === "riverWaterStation") {
      config.selectStation?.(entry.item.stationKey || entry.item.name, { pan: false });
      map.panTo(markerLatLng);
      return;
    }
    setActiveCaseRow(entry.item?.id);
    map.setView(markerLatLng, map.getZoom(), { animate: false });
    entry.marker.openPopup();
  }

  (config.layers || []).forEach((layerConfig) => {
    if (layerConfig.key === "vehicle") return;

    (layerConfig.items || []).forEach((item) => {
      const marker = markerIndex.get(item.id);
      if (!marker) return;

      const entry = {
        marker,
        item,
        layerKey: layerConfig.key,
        label: getWaterOverlapLabel(layerConfig),
        icon: item.icon || layerConfig.icon || "images/marker.png",
      };
      clickableEntries.push(entry);

      // 移除 bindPopup 預設 click 行為，改由水主題專用邏輯控制開啟/關閉與重疊選單。
      marker.off("click");
      marker.on("click", (event) => {
        event.originalEvent?.stopPropagation();
        handleMarkerClickWithOverlap(entry);
      });
    });
  });

  config.onVehicleMarkerClick = ({ marker }) => {
    if (!marker?.getLatLng) return false;
    const markerLatLng = marker.getLatLng();
    const nearbyItems = findNearbyMarkers(markerLatLng);

    if (nearbyItems.length > 1) {
      map.setView(markerLatLng, map.getZoom(), { animate: false });
      openOverlapChooser(markerLatLng, nearbyItems);
      return true;
    }

    if (nearbyItems.length === 1) {
      activateMarkerEntry(nearbyItems[0]);
      return true;
    }

    return false;
  };

  map.on("click", () => {
    if (openPopups.size) closeAllPopups();
  });
}

const EIMPWaterTopicConfig = {
  caseListPanOnly: true,
  stationSelectionPanelSelector: ".water-station-panel",
  resetStationSelectionOnOutsideClick: true,
  stationLocations: {
    "忠孝碼頭": { lng: 121.5002090, lat: 25.0511440 },
    "華江碼頭": { lng: 121.4835090, lat: 25.0348980 },
    "新海橋": { lng: 121.4546200, lat: 25.0328661 },
    "瑞芳區大寮路69號旁": { lng: 121.7812513, lat: 25.0976086 },
    "中正碼頭": { lng: 121.5139290, lat: 25.0222490 },
    "北新橋": { lng: 121.5395300, lat: 24.9894000 },
    "成美長壽橋": { lng: 121.5809470, lat: 25.0531500 },
    "承德橋": { lng: 121.5210490, lat: 25.0779540 },
    "臺北橋": { lng: 121.5084480, lat: 25.0633490 },
  },
  "caseLists": [
    {
      "containerId": "airCasesContainer",
      "columns": [
        {
          "key": "time"
        },
        {
          "key": "status"
        },
        {
          "key": "address",
          "address": true
        }
      ],
      "items": [
        {
          "id": "W-C001",
          "time": "12/02 15:40",
          "status": "案件接收",
          "address": "新北市板橋區OO路",
          "lat": 25.0132,
          "lng": 121.4637
        },
        {
          "id": "W-C002",
          "time": "12/02 13:49",
          "status": "現場查察",
          "address": "新北市中和區XX路",
          "lat": 24.9998,
          "lng": 121.4932
        },
        {
          "id": "W-C003",
          "time": "12/02 11:20",
          "status": "稽查中",
          "address": "新北市新店區OO街",
          "lat": 24.9675,
          "lng": 121.5412
        },
        {
          "id": "W-C004",
          "time": "12/01 18:10",
          "status": "審核完成",
          "address": "新北市三重區XX路",
          "lat": 25.0615,
          "lng": 121.4881
        }
      ]
    },
    {
      "containerId": "fireCasesContainer",
      "columns": [
        {
          "key": "time"
        },
        {
          "key": "address",
          "address": true
        }
      ],
      "items": [
        {
          "id": "W-A001",
          "time": "12/02 10:33",
          "address": "淡水河忠孝碼頭附近",
          "lat": 25.0465,
          "lng": 121.5061
        },
        {
          "id": "W-A002",
          "time": "12/01 17:42",
          "address": "新店溪華江碼頭附近",
          "lat": 25.0343,
          "lng": 121.4935
        },
        {
          "id": "W-A003",
          "time": "12/01 09:18",
          "address": "大漢溪新海橋附近",
          "lat": 25.0289,
          "lng": 121.4578
        }
      ]
    }
  ],
  "layers": [
    {
      "key": "riverWaterStation",
      "label": "河川水質測站",
      "icon": "images/水測站.png",
      "disablePopup": true,
      "items": [
        { "id": "RWQ-001", "name": "中正碼頭", "stationKey": "中正碼頭", "lng": 121.5139290, "lat": 25.0222490 },
        { "id": "RWQ-002", "name": "北新橋", "stationKey": "北新橋", "lng": 121.5395300, "lat": 24.9894000 },
        { "id": "RWQ-003", "name": "成美長壽橋", "stationKey": "成美長壽橋", "lng": 121.5809470, "lat": 25.0531500 },
        { "id": "RWQ-004", "name": "忠孝", "stationKey": "忠孝碼頭", "lng": 121.5002090, "lat": 25.0511440 },
        { "id": "RWQ-005", "name": "承德橋", "stationKey": "承德橋", "lng": 121.5210490, "lat": 25.0779540 },
        { "id": "RWQ-006", "name": "華江", "stationKey": "華江碼頭", "lng": 121.4835090, "lat": 25.0348980 },
        { "id": "RWQ-007", "name": "新海橋", "stationKey": "新海橋", "lng": 121.4546200, "lat": 25.0328661 },
        { "id": "RWQ-008", "name": "瑞芳區大寮路69號旁", "stationKey": "瑞芳區大寮路69號旁", "lng": 121.7812513, "lat": 25.0976086 },
        { "id": "RWQ-009", "name": "臺北橋", "stationKey": "臺北橋", "lng": 121.5084480, "lat": 25.0633490 }
      ]
    },
    {
      "key": "airPollution",
      "label": "水污染陳情",
      "icon": "images/民眾陳情.png",
      "items": [
        {
          "id": "W-C001",
          "time": "12/02 15:40",
          "status": "案件接收",
          "address": "新北市板橋區OO路",
          "lat": 25.0132,
          "lng": 121.4637
        },
        {
          "id": "W-C002",
          "time": "12/02 13:49",
          "status": "現場查察",
          "address": "新北市中和區XX路",
          "lat": 24.9998,
          "lng": 121.4932
        },
        {
          "id": "W-C003",
          "time": "12/02 11:20",
          "status": "稽查中",
          "address": "新北市新店區OO街",
          "lat": 24.9675,
          "lng": 121.5412
        },
        {
          "id": "W-C004",
          "time": "12/01 18:10",
          "status": "審核完成",
          "address": "新北市三重區XX路",
          "lat": 25.0615,
          "lng": 121.4881
        }
      ],
      "popupFields": [
        {
          "label": "時間",
          "key": "time"
        },
        {
          "label": "狀態",
          "key": "status"
        },
        {
          "label": "地址",
          "key": "address"
        }
      ]
    },
    {
      "key": "camera",
      "label": "即時影像",
      "overlapLabel": "水色異常",
      "icon": "images/監視器辨識異常.png",
      "items": [
        {
          "id": "W-A001",
          "setupUnit": "稽查科",
          "cameraCode": "21821-1",
          "installAddress": "樹林區三龍街27號旁三龍二橋A",
          "isAbnormal": "是",
          "time": "12/02 10:33",
          "address": "樹林區三龍街27號旁三龍二橋A",
          "lat": 25.0465,
          "lng": 121.5061,
          "icon": "images/監視器辨識異常.png",
          "videoUrl": "https://example.com/live/W-A001",
          "resultImageUrl": "https://example.com/result/W-A001.jpg",
          rippleWarning: true,
        },
        {
          "id": "W-A002",
          "setupUnit": "稽查科",
          "cameraCode": "21821-2",
          "installAddress": "新店溪華江碼頭附近",
          "isAbnormal": "是",
          "time": "12/01 17:42",
          "address": "新店溪華江碼頭附近",
          "lat": 25.0343,
          "lng": 121.4935,
          "icon": "images/監視器辨識異常.png",
          "videoUrl": "https://example.com/live/W-A002",
          "resultImageUrl": "https://example.com/result/W-A002.jpg",
          rippleWarning: true,
        },
        {
          "id": "W-A003",
          "setupUnit": "稽查科",
          "cameraCode": "21821-3",
          "installAddress": "大漢溪新海橋附近",
          "isAbnormal": "是",
          "time": "12/01 09:18",
          "address": "大漢溪新海橋附近",
          "lat": 25.0289,
          "lng": 121.4578,
          "icon": "images/監視器辨識異常.png",
          "videoUrl": "https://example.com/live/W-A003",
          "resultImageUrl": "https://example.com/result/W-A003.jpg",
          rippleWarning: true,
        }
      ],
      "popupFields": [
        {
          "label": "設置單位：",
          "key": "setupUnit"
        },
        {
          "label": "編號：",
          "key": "cameraCode"
        },
        {
          "label": "設置地點：",
          "key": "installAddress"
        },
        {
          "label": "是否異常：",
          "key": "isAbnormal"
        }
      ]
    },
        {
      "key": "nonRegBusiness",
      "label": "非列管事業",
      "icon": "images/工廠許可.png",
      "items": window.EIMPSharedBusinessData.nonRegBusinessCases,
      "popupFields": [
        { "label": "名稱", "key": "businessName" },
        { "label": "管制編號", "key": "controlNo" },
        { "label": "行業別", "key": "industryName" },
        { "label": "地址", "key": "address" }
      ]
    },
    {
      "key": "regBusiness",
      "label": "列管事業",
      "icon": "images/工廠許可(列管).png",
      "items": window.EIMPSharedBusinessData.regBusinessCases,
      "popupFields": [
        { "label": "名稱", "key": "businessName" },
        { "label": "管制編號", "key": "controlNo" },
        { "label": "事業類型", "key": "industryName" },
        { "label": "列管類別", "key": "regulatedType" },
        { "label": "地址", "key": "address" }
      ]
    }
  ],
  "metricCards": {
    "windDirection": {
      "key": "ph"
    },
    "windSpeed": {
      "key": "temp"
    }
  },
  "stationData": {
    "忠孝碼頭": {
      "ph": "7.1",
      "temp": "26"
    },
    "華江碼頭": {
      "ph": "7.3",
      "temp": "25"
    },
    "新海橋": {
      "ph": "6.9",
      "temp": "26"
    },
    "中正碼頭": {
      "ph": "7.2",
      "temp": "25"
    },
    "北新橋": {
      "ph": "7.4",
      "temp": "24"
    },
    "成美長壽橋": {
      "ph": "7.0",
      "temp": "25"
    },
    "承德橋": {
      "ph": "7.2",
      "temp": "26"
    },
    "臺北橋": {
      "ph": "7.5",
      "temp": "26"
    }
  },
  "defaultStationData": {
    "ph": "7.1",
    "temp": "26"
  },
  onMapReady(context) {
    initWaterPopupBehavior(context, EIMPWaterTopicConfig);
  }
};

window.EIMPTopic.initTopicPage(EIMPWaterTopicConfig);
