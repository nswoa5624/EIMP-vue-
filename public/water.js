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
  resetStationSelectionOnOutsideClick: false,
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
      "ph": "6.81",
      "temp": "30.4",
      "ec": "345.61",
      "do": "3.47"
    },
    "華江碼頭": {
      "ph": "7.3",
      "temp": "29.8",
      "ec": "332.48",
      "do": "4.12"
    },
    "新海橋": {
      "ph": "6.9",
      "temp": "29.5",
      "ec": "361.20",
      "do": "3.86"
    },
    "中正碼頭": {
      "ph": "7.2",
      "temp": "30.1",
      "ec": "318.75",
      "do": "4.03"
    },
    "北新橋": {
      "ph": "7.4",
      "temp": "28.9",
      "ec": "297.42",
      "do": "4.38"
    },
    "成美長壽橋": {
      "ph": "7.0",
      "temp": "30.2",
      "ec": "373.66",
      "do": "3.72"
    },
    "承德橋": {
      "ph": "7.2",
      "temp": "29.7",
      "ec": "325.18",
      "do": "4.21"
    },
    "臺北橋": {
      "ph": "7.5",
      "temp": "30.0",
      "ec": "349.83",
      "do": "3.95"
    }
  },
  "defaultStationData": {
    "ph": "7.1",
    "temp": "26",
    "ec": "--",
    "do": "--"
  },
  onMapReady(context) {
    initWaterPopupBehavior(context, EIMPWaterTopicConfig);
  }
};

window.EIMPTopic.initTopicPage(EIMPWaterTopicConfig);

function initWaterQualityTrendPanel(config) {
  const panel = document.getElementById("waterQualityMonitorPanel");
  const content = document.getElementById("waterQualityContent");
  const empty = document.getElementById("waterQualityEmpty");
  const stationName = document.getElementById("waterQualityStationName");
  const footer = document.getElementById("waterQualityFooter");
  const chartTitle = document.getElementById("waterQualityChartTitle");
  const latest = document.getElementById("waterQualityLatest");
  const latestUnit = document.getElementById("waterQualityLatestUnit");
  const chartLine = document.getElementById("waterQualityChartLine");
  const chartArea = document.getElementById("waterQualityChartArea");
  const chartPoints = document.getElementById("waterQualityChartPoints");
  const yLabels = document.getElementById("waterQualityYLabels");
  const chart = document.getElementById("waterQualityChart");
  const chartHitArea = document.getElementById("waterQualityChartHitArea");
  const chartInspector = document.getElementById("waterQualityChartInspector");
  const inspectorLine = document.getElementById("waterQualityInspectorLine");
  const inspectorPoint = document.getElementById("waterQualityInspectorPoint");
  const inspectorTooltip = document.getElementById("waterQualityInspectorTooltip");
  const inspectorBox = document.getElementById("waterQualityInspectorBox");
  const inspectorTime = document.getElementById("waterQualityInspectorTime");
  const inspectorValue = document.getElementById("waterQualityInspectorValue");
  const metricButtons = Array.from(document.querySelectorAll("[data-water-metric]"));
  if (!panel || !content || !chartLine || !chartArea || !chartPoints || !yLabels || !chart || !chartHitArea || !chartInspector) return;

  const metricConfig = {
    ph: { name: "酸鹼度（pH）趨勢", unit: " pH", decimals: 2, offsets: [-0.07, 0.01, -0.04, 0.10, 0.07, 0.14, 0.05, 0] },
    temp: { name: "水溫（WTEMP）趨勢", unit: " °C", decimals: 1, offsets: [-1.3, -1.8, -2.2, -2.4, -1.5, -0.3, 0.4, 0] },
    ec: { name: "導電度（EC）趨勢", unit: " μS", decimals: 2, offsets: [-13.6, -7.6, -4.6, 4.4, 9.4, 3.4, -2.6, 0] },
    do: { name: "水中溶氧（DO）趨勢", unit: " mg/L", decimals: 2, offsets: [0.63, 0.35, 0.18, -0.09, -0.35, -0.21, 0.04, 0] },
  };

  const svgNamespace = "http://www.w3.org/2000/svg";
  const chartTimes = ["08/06 15:00", "08/06 18:00", "08/06 21:00", "08/07 00:00", "08/07 03:00", "08/07 06:00", "08/07 09:00", "08/07 15:00"];
  let selectedStation = "";
  let selectedMetric = "ph";
  let renderedCoordinates = [];
  let renderedValues = [];
  let longPressTimer = 0;
  let inspectorActive = false;
  let pointerStart = null;

  function getMetricValue(station, metric) {
    const rawValue = config.stationData?.[station]?.[metric];
    const value = Number(rawValue);
    return Number.isFinite(value) ? value : null;
  }

  function buildSeries(station, metric) {
    const current = getMetricValue(station, metric);
    if (current === null) return [];
    return metricConfig[metric].offsets.map((offset) => Number((current + offset).toFixed(metricConfig[metric].decimals)));
  }

  function renderChart() {
    const metric = metricConfig[selectedMetric];
    const values = buildSeries(selectedStation, selectedMetric);
    if (!metric || !values.length) return;

    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = Math.max((max - min) * 0.35, selectedMetric === "ec" ? 4 : 0.2);
    const low = min - padding;
    const high = max + padding;
    const left = 38;
    const right = 322;
    const top = 14;
    const bottom = 144;
    const coordinates = values.map((value, index) => ({
      value,
      x: left + (index * (right - left)) / (values.length - 1),
      y: bottom - ((value - low) / (high - low)) * (bottom - top),
    }));
    const path = coordinates.map((point, index) => `${index ? "L" : "M"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");

    chartLine.setAttribute("d", path);
    chartArea.setAttribute("d", `${path} L ${right} ${bottom} L ${left} ${bottom} Z`);
    renderedCoordinates = coordinates;
    renderedValues = values;
    chartInspector.hidden = true;
    inspectorActive = false;
    chartPoints.replaceChildren();
    coordinates.forEach((point, index) => {
      const circle = document.createElementNS(svgNamespace, "circle");
      circle.setAttribute("class", "water-quality-chart-point");
      circle.setAttribute("cx", point.x.toFixed(1));
      circle.setAttribute("cy", point.y.toFixed(1));
      circle.setAttribute("r", index === coordinates.length - 1 ? "4.5" : "3");
      const title = document.createElementNS(svgNamespace, "title");
      title.textContent = `${point.value}${metric.unit}`;
      circle.appendChild(title);
      chartPoints.appendChild(circle);
    });

    yLabels.replaceChildren();
    [high, high - (high - low) / 3, high - ((high - low) * 2) / 3, low].forEach((value, index) => {
      const text = document.createElementNS(svgNamespace, "text");
      text.setAttribute("x", "32");
      text.setAttribute("y", String(18 + index * 43.3));
      text.setAttribute("text-anchor", "end");
      text.textContent = value.toFixed(selectedMetric === "temp" || selectedMetric === "ec" ? 1 : 2);
      yLabels.appendChild(text);
    });

    chartTitle.textContent = metric.name;
    latest.textContent = config.stationData[selectedStation][selectedMetric];
    latestUnit.textContent = metric.unit;
  }

  function getChartPointFromEvent(event) {
    const rect = chart.getBoundingClientRect();
    const svgX = ((event.clientX - rect.left) / rect.width) * 330;
    const clampedX = Math.max(38, Math.min(322, svgX));
    const index = Math.max(0, Math.min(renderedCoordinates.length - 1, Math.round(((clampedX - 38) / (322 - 38)) * (renderedCoordinates.length - 1))));
    return { index, point: renderedCoordinates[index] };
  }

  function updateInspector(event) {
    if (!renderedCoordinates.length) return;
    const { index, point } = getChartPointFromEvent(event);
    const metric = metricConfig[selectedMetric];
    const tooltipWidth = 94;
    const tooltipX = point.x > 218 ? point.x - tooltipWidth - 7 : point.x + 7;
    const tooltipY = Math.max(16, Math.min(104, point.y - 18));

    inspectorLine.setAttribute("x1", point.x.toFixed(1));
    inspectorLine.setAttribute("x2", point.x.toFixed(1));
    inspectorPoint.setAttribute("cx", point.x.toFixed(1));
    inspectorPoint.setAttribute("cy", point.y.toFixed(1));
    inspectorTooltip.setAttribute("transform", `translate(${tooltipX - 44} ${tooltipY - 18})`);
    inspectorBox.setAttribute("x", "44");
    inspectorBox.setAttribute("y", "18");
    inspectorTime.setAttribute("x", "52");
    inspectorTime.setAttribute("y", "32");
    inspectorValue.setAttribute("x", "52");
    inspectorValue.setAttribute("y", "46");
    inspectorTime.textContent = chartTimes[index];
    inspectorValue.textContent = `${renderedValues[index]}${metric.unit}`;
    chartInspector.hidden = false;
  }

  function clearLongPress() {
    window.clearTimeout(longPressTimer);
    longPressTimer = 0;
  }

  function endInspector(event) {
    clearLongPress();
    if (inspectorActive && event?.pointerId !== undefined && chartHitArea.hasPointerCapture(event.pointerId)) {
      chartHitArea.releasePointerCapture(event.pointerId);
    }
    inspectorActive = false;
    pointerStart = null;
    chartInspector.hidden = true;
  }

  chartHitArea.addEventListener("pointerdown", (event) => {
    clearLongPress();
    pointerStart = { x: event.clientX, y: event.clientY };
    longPressTimer = window.setTimeout(() => {
      inspectorActive = true;
      chartHitArea.setPointerCapture(event.pointerId);
      updateInspector(event);
    }, 280);
  });

  chartHitArea.addEventListener("pointermove", (event) => {
    if (inspectorActive) {
      event.preventDefault();
      updateInspector(event);
      return;
    }
    if (pointerStart && Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) > 8) {
      clearLongPress();
      pointerStart = null;
    }
  });

  chartHitArea.addEventListener("pointerup", endInspector);
  chartHitArea.addEventListener("pointercancel", endInspector);
  chartHitArea.addEventListener("lostpointercapture", () => {
    inspectorActive = false;
    chartInspector.hidden = true;
  });

  function selectMetric(metric) {
    if (!metricConfig[metric]) return;
    selectedMetric = metric;
    metricButtons.forEach((button) => {
      const isActive = button.dataset.waterMetric === metric;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
    renderChart();
  }

  function showStation(station) {
    if (!config.stationData?.[station]) return;
    selectedStation = station;
    panel.classList.add("has-data");
    content.hidden = false;
    empty.hidden = true;
    stationName.hidden = false;
    footer.hidden = false;
    stationName.textContent = station;

    Object.keys(metricConfig).forEach((metric) => {
      const valueElement = panel.querySelector(`[data-water-value="${metric}"]`);
      if (valueElement) valueElement.textContent = config.stationData[station][metric] ?? "--";
    });
    selectMetric(selectedMetric);
  }

  function resetPanel() {
    selectedStation = "";
    selectedMetric = "ph";
    endInspector();
    panel.classList.remove("has-data");
    content.hidden = true;
    empty.hidden = false;
    stationName.hidden = true;
    footer.hidden = true;
    document.querySelectorAll(".waqi-station-btn").forEach((button) => button.classList.remove("active"));
    document.querySelector(config.stationSelectionPanelSelector)?.classList.remove("has-station-selection");
    metricButtons.forEach((button) => {
      const isDefault = button.dataset.waterMetric === "ph";
      button.classList.toggle("is-active", isDefault);
      button.setAttribute("aria-pressed", String(isDefault));
    });
  }

  metricButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      selectMetric(button.dataset.waterMetric);
    });
  });

  document.querySelectorAll(".waqi-station-btn").forEach((button) => {
    button.addEventListener("click", () => showStation(button.dataset.station || button.textContent.trim()));
  });

  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : event.target?.parentElement;
    if (!selectedStation || target?.closest("#waterQualityMonitorPanel, .waqi-station-btn")) return;
    resetPanel();
  });

  const commonSelectStation = config.selectStation;
  if (typeof commonSelectStation === "function") {
    config.selectStation = function selectStationWithTrend(station, options) {
      commonSelectStation(station, options);
      showStation(station);
    };
  }
}

document.addEventListener("DOMContentLoaded", () => initWaterQualityTrendPanel(EIMPWaterTopicConfig));
