const wasteComplaintCases = [
  {
    id: "WA-C001",
    time: "12/02 14:10",
    status: "查報受理",
    address: "新北市五股區OO路",
    lat: 25.0841,
    lng: 121.4387,
  },
  {
    id: "WA-C002",
    time: "12/02 11:38",
    status: "清運派工",
    address: "新北市樹林區XX街",
    lat: 24.9916,
    lng: 121.4242,
  },
  {
    id: "WA-C003",
    time: "12/01 16:25",
    status: "稽查中",
    address: "新北市土城區OO巷",
    lat: 24.9735,
    lng: 121.4442,
  },
];

const fireReportCases = [
  {
    id: "WA-F001",
    time: "12/02 11:00",
    fireType: "查看案件",
    address: "新北市汐止區XX路OO號△樓",
    lat: 25.0646,
    lng: 121.6623,
  },
  {
    id: "WA-F002",
    time: "12/02 10:42",
    fireType: "電線桿",
    address: "新北市中和區△△路OO巷",
    lat: 24.9998,
    lng: 121.4932,
  },
];

const nonRegBusinessCases = (window.EIMPSharedBusinessData && window.EIMPSharedBusinessData.nonRegBusinessCases) || [
  { id: "NB0001", controlNo: "NFB-0001", businessName: "新莊精密加工廠", unifiedNo: "80123456", industryName: "金屬加工業", address: "新北市新莊區△△路66號", lat: 25.0362, lng: 121.4549, areaId: "Xinzhuang" },
  { id: "NB0002", controlNo: "NFB-0002", businessName: "五股倉儲物流場", unifiedNo: "80234567", industryName: "倉儲物流業", address: "新北市五股區OO路88號", lat: 25.0841, lng: 121.4387, areaId: "Wugu" },
  { id: "NB0003", controlNo: "NFB-0003", businessName: "板橋食品包裝行", unifiedNo: "80345678", industryName: "食品包裝業", address: "新北市板橋區OO路120號", lat: 25.0132, lng: 121.4637, areaId: "Banqiao" },
  { id: "NB0004", controlNo: "NFB-0004", businessName: "三重印刷材料行", unifiedNo: "80456789", industryName: "印刷材料業", address: "新北市三重區XX路35號", lat: 25.0615, lng: 121.4881, areaId: "Sanchong" },
  { id: "NB0005", controlNo: "NFB-0005", businessName: "新店電子維修廠", unifiedNo: "80567890", industryName: "電子維修業", address: "新北市新店區OO街18號", lat: 24.9435, lng: 121.5580, areaId: "Xindian" },
  { id: "NB0006", controlNo: "NFB-0006", businessName: "淡水水產處理場", unifiedNo: "80678901", industryName: "水產處理業", address: "新北市淡水區中正路旁", lat: 25.1950, lng: 121.4520, areaId: "Tamsui" },
  { id: "NB0007", controlNo: "NFB-0007", businessName: "林口材料倉儲中心", unifiedNo: "80789012", industryName: "材料倉儲業", address: "新北市林口區文化北路旁", lat: 25.0920, lng: 121.3660, areaId: "Linkou" },
  { id: "NB0008", controlNo: "NFB-0008", businessName: "汐止機械保養廠", unifiedNo: "80890123", industryName: "機械保養業", address: "新北市汐止區大同路附近", lat: 25.0820, lng: 121.6400, areaId: "Xizhi" },
  { id: "NB0009", controlNo: "NFB-0009", businessName: "鶯歌陶瓷工作室", unifiedNo: "80901234", industryName: "陶瓷製品業", address: "新北市鶯歌區文化路附近", lat: 24.9549, lng: 121.3518, areaId: "Yingge" },
  { id: "NB0010", controlNo: "NFB-0010", businessName: "蘆洲金屬零件行", unifiedNo: "81012345", industryName: "金屬零件業", address: "新北市蘆洲區中山一路附近", lat: 25.0824, lng: 121.4694, areaId: "Luzhou" },
  { id: "NB0011", controlNo: "NFB-0011", businessName: "泰山塑膠射出廠", unifiedNo: "81123456", industryName: "塑膠製品業", address: "新北市泰山區明志路附近", lat: 25.0450, lng: 121.4160, areaId: "Taishan" },
  { id: "NB0012", controlNo: "NFB-0012", businessName: "八里車材整理場", unifiedNo: "81234567", industryName: "車材整理業", address: "新北市八里區龍米路附近", lat: 25.1650, lng: 121.3890, areaId: "Bali" }
];

const regBusinessCases = (window.EIMPSharedBusinessData && window.EIMPSharedBusinessData.regBusinessCases) || [
  {
    id: "RB0001",
    controlNo: "F1234567",
    businessName: "土城金屬工業有限公司",
    othercontrolNo: "F9876543",
    otherbusinessName: "金屬實業有限公司",
    unifiedNo: "12345678",
    industrialParkName: "土城工業區",
    industryName: "電鍍業",
    regulatedType: "水",
    waterpermitNo: "新北市環水許字 第12345-678號",
    toxicpermitNo: "新北市毒許字第000031號",
    otherLincenseNo: "新北市環水許字第04123-04號",
    permittime: "自113年02月02日起至117年10月31日止",
    toxicpermittime: "自2021-09-14起至2027-01-08止",
    applytime: "113年01月31日",
    inspectManageNo: "202603310001",
    tempManageNo: "A2026033100001",
    factoryLicenseNo: "99-123456-78",
    address: "新北市土城區OO路100號",
    businesstype: "金屬加工業",
    waterBusinessType: "general",
    lat: 24.9735,
    lng: 121.4442,
    areaId: "Tucheng",
    businesslabel: "一般事業"
  },
  {
    id: "RB0004",
    controlNo: "F4567890",
    controlNo2: "F4567890",
    businessName: "樹林畜牧場",
    leadername: "林OO",
    waterpermitNo: "新北市環水許字 第12345-890號",
    permittime: "自107年10月08日起至112年10月07日止",
    applytime: "114年1月1日",
    applycount: "100",
    permitcount: "100",
    stockno: "農飼養登記第300000001號",
    unifiedNo: "45678901",
    industrialParkName: "-",
    industryName: "畜牧業",
    regulatedType: "廢",
    otherLincenseNo: "農水桃園字第1138225600號",
    inspectManageNo: "202603310004",
    tempManageNo: "A2026033100004",
    factoryLicenseNo: "12345678",
    address: "新北市樹林區OO街25號",
    businesstype: "畜牧業",
    waterBusinessType: "livestock",
    lat: 24.9898,
    lng: 121.4214,
    areaId: "Shulin",
    businesslabel: "畜牧業"
  },
  {
    id: "RB0005",
    controlNo: "F23456789",
    businessName: "中和花園社區",
    waterpermitNo: "新北市環水許字 第23456-901號",
    permittime: "自113年01月01日起至116年12月31日止",
    applytime: "112年12月31日",
    unifiedNo: "56789012",
    managename: "中和花園社區管理委員會",
    managetel: "02-22234567",
    industrialParkName: "-",
    industryName: "社區污水下水道系統",
    regulatedType: "水",
    otherLincenseNo: "農水桃園字第1138225600號",
    inspectManageNo: "202603310005",
    tempManageNo: "A202603310005",
    factoryLicenseNo: "COM-001261",
    address: "新北市中和區OO路200號",
    manageaddress: "新北市中和區OO路200號",
    businesstype: "社區",
    waterBusinessType: "community",
    lat: 24.9951,
    lng: 121.4966,
    areaId: "Zhonghe",
    businesslabel: "社區地下水"
  }
];

const illegalDumpingSites = [
  {
    id: "WD-001",
    title: "允泰企業社（車號 AXL6907）",
    controlUnit: "科列管",
    name: "允泰企業社（車號 AXL6907）",
    coordX: "296593.35",
    coordY: "2769254.06",
    startDate: "2022/11/10",
    lat: 25.02845,
    lng: 121.56632,
    progress: [
      "未棄置，無需清除",
      "移送日期：111年11月23日",
      "判決結果：尚未判決",
      "判決日期：-",
      "行政處分：-",
    ],
    quantities: [
      { time: "2022/11/10", area: "約5-10m²" },
    ],
  },
  {
    id: "WD-002",
    title: "林口產業道路非法棄置點",
    controlUnit: "第三稽查分隊",
    name: "林口產業道路非法棄置點",
    coordX: "285136.42",
    coordY: "2774338.19",
    startDate: "2023/03/18",
    lat: 25.0778,
    lng: 121.3883,
    progress: [
      "現場查報受理",
      "已派工清除前置作業",
      "待確認廢棄物來源",
      "行政處分：調查中",
    ],
    quantities: [
      { time: "2023/03/18", area: "約18m²" },
      { time: "2023/03/25", area: "約12m²" },
    ],
  },
  {
    id: "WD-003",
    title: "樹林山坡地棄置點",
    controlUnit: "第二稽查分隊",
    name: "樹林山坡地棄置點",
    coordX: "291824.80",
    coordY: "2764875.33",
    startDate: "2023/08/06",
    lat: 24.9916,
    lng: 121.4242,
    progress: [
      "已完成初勘",
      "移請權責單位協助清運",
      "清除進度：部分完成",
      "複查日期：待排程",
    ],
    quantities: [
      { time: "2023/08/06", area: "約30m²" },
      { time: "2023/08/20", area: "約16m²" },
      { time: "2023/09/03", area: "約8m²" },
    ],
  },
];


const cameraNtpcRoadSites = [
  {
    id: "CAM-NTPC-R001",
    name: "稽查科(路) - 五股非法棄置熱點",
    status: "連線正常",
    address: "新北市五股區成泰路周邊",
    lat: 25.0849,
    lng: 121.4381,
  },
  {
    id: "CAM-NTPC-R002",
    name: "稽查科(路) - 林口產業道路",
    status: "連線正常",
    address: "新北市林口區產業道路",
    lat: 25.0785,
    lng: 121.3892,
  },
];

const cameraNtpcWaterSites = [
  {
    id: "CAM-NTPC-W001",
    name: "稽查科(水) - 淡水河巡查點",
    status: "連線正常",
    address: "新北市三重區環河北路周邊",
    lat: 25.0642,
    lng: 121.4918,
  },
  {
    id: "CAM-NTPC-W002",
    name: "稽查科(水) - 大漢溪巡查點",
    status: "連線正常",
    address: "新北市樹林區大漢溪周邊",
    lat: 24.9927,
    lng: 121.4216,
  },
];

const cameraNtpcCleanupSites = [
  {
    id: "CAM-NTPC-C001",
    name: "清維科 - 清運路線一號",
    status: "連線正常",
    address: "新北市樹林區中正路周邊",
    lat: 24.9908,
    lng: 121.4221,
  },
  {
    id: "CAM-NTPC-C002",
    name: "清維科 - 清運路線二號",
    status: "維護中",
    address: "新北市土城區中央路周邊",
    lat: 24.9744,
    lng: 121.4457,
  },
];

const cameraNtpcAirSites = [
  {
    id: "CAM-NTPC-A001",
    name: "空品科 - 空品監控點 A",
    status: "連線正常",
    address: "新北市新莊區化成路周邊",
    lat: 25.0368,
    lng: 121.4557,
  },
];

const cameraMoeaWraSites = [
  {
    id: "CAM-MOEA-WRA001",
    name: "水利署 - 河川監視器",
    status: "連線正常",
    address: "新北市板橋區大漢溪右岸",
    lat: 25.0114,
    lng: 121.4563,
  },
];

const cameraMotcThbSites = [
  {
    id: "CAM-MOTC-THB001",
    name: "公路局 - 省道路口監視器",
    status: "連線正常",
    address: "新北市中和區中山路周邊",
    lat: 24.9996,
    lng: 121.4939,
  },
];

const cameraMotcFreewaySites = [
  {
    id: "CAM-MOTC-FWY001",
    name: "高速公路局 - 交流道監視器",
    status: "連線正常",
    address: "新北市汐止區國道周邊",
    lat: 25.0646,
    lng: 121.6623,
  },
];

let currentIllegalDumpingSite = illegalDumpingSites[0];
let wasteMapContext = null;

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? "-";
}

function renderWasteDashboard(item) {
  if (!item) return;
  currentIllegalDumpingSite = item;

  setText("wasteControlUnit", item.controlUnit);
  setText("wasteSiteName", item.name);
  setText("wasteCoordX", item.coordX);
  setText("wasteCoordY", item.coordY);
  setText("wasteStartDate", item.startDate);

  const progressList = document.getElementById("wasteProgressList");
  if (progressList) {
    progressList.innerHTML = (item.progress || [])
      .map((text) => `<li>${text}</li>`)
      .join("");
  }

  const quantityRows = document.getElementById("wasteQuantityRows");
  if (quantityRows) {
    quantityRows.innerHTML = (item.quantities || [])
      .map((row) => `
        <div class="waste-quantity-row">
          <span>${row.time}</span>
          <span>${row.area}</span>
        </div>
      `)
      .join("");
  }
}

function locateCurrentIllegalDumpingSite() {
  if (!wasteMapContext || !currentIllegalDumpingSite) return;
  const marker = wasteMapContext.markerIndex.get(currentIllegalDumpingSite.id);
  if (!marker) return;
  const latLng = marker.getLatLng();
  wasteMapContext.map.setView(latLng, 16);
  marker.openPopup();
}

function bindWasteDashboardLocate() {
  const panel = document.getElementById("wasteDumpInfoPanel");
  if (!panel) return;
  panel.addEventListener("click", locateCurrentIllegalDumpingSite);
  panel.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      locateCurrentIllegalDumpingSite();
    }
  });
}


function setLayerVisible(group, map, visible) {
  if (!group || !map) return;
  if (visible) {
    if (!map.hasLayer(group)) group.addTo(map);
  } else if (map.hasLayer(group)) {
    map.removeLayer(group);
  }
}

function syncCameraParentToggle() {
  const parentToggle = document.getElementById("cameraAllToggle");
  if (!parentToggle) return;
  const subToggles = Array.from(document.querySelectorAll(".camera-sub-toggle"));

  const setCameraMenuButtonState = (isOpen) => {
    if (!menuBtn) return;
    const icon = menuBtn.querySelector(".camera-layer-menu-icon");
    const text = menuBtn.querySelector(".camera-layer-menu-text");

    menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    menuBtn.classList.toggle("is-open", isOpen);
    menuBtn.setAttribute("aria-label", isOpen ? "收合監視器圖層選單" : "展開監視器圖層選單");

    if (icon) icon.textContent = isOpen ? "−" : "+";
    if (text) text.textContent = isOpen ? "收合" : "展開";

    if (!icon && !text) {
      menuBtn.textContent = isOpen ? "收合" : "展開";
    }
  };

  parentToggle.checked = subToggles.length > 0 && subToggles.some((toggle) => toggle.checked);
}

function initWasteCameraLayerControls(context) {
  const { map, groups } = context || {};
  const menuBtn = document.getElementById("cameraLayerMenuBtn");
  const closeBtn = document.getElementById("cameraLayerCloseBtn");
  const subpanel = document.getElementById("cameraLayerSubpanel");
  const parentToggle = document.getElementById("cameraAllToggle");
  const subToggles = Array.from(document.querySelectorAll(".camera-sub-toggle"));

  const setCameraMenuButtonState = (isOpen) => {
    if (!menuBtn) return;
    const icon = menuBtn.querySelector(".camera-layer-menu-icon");
    const text = menuBtn.querySelector(".camera-layer-menu-text");

    menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    menuBtn.classList.toggle("is-open", isOpen);
    menuBtn.setAttribute("aria-label", isOpen ? "收合監視器圖層選單" : "展開監視器圖層選單");

    if (icon) icon.textContent = isOpen ? "−" : "+";
    if (text) text.textContent = isOpen ? "收合" : "展開";

    if (!icon && !text) {
      menuBtn.textContent = isOpen ? "收合" : "展開";
    }
  };


  const openPanel = () => {
    const mapOptionsWrapper = document.getElementById("mapOptionsWrapper");
    const layerOptionsBody = document.getElementById("layerOptionsBody");
    if (!subpanel || !menuBtn) return;
    if (!mapOptionsWrapper?.classList.contains("open")) return;
    if (layerOptionsBody && !layerOptionsBody.classList.contains("active")) return;

    subpanel.classList.add("is-open");
    subpanel.setAttribute("aria-hidden", "false");
    setCameraMenuButtonState(true);
  };

  const closePanel = () => {
    if (!subpanel || !menuBtn) return;
    subpanel.classList.remove("is-open");
    subpanel.setAttribute("aria-hidden", "true");
    setCameraMenuButtonState(false);
  };

  menuBtn?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (subpanel?.classList.contains("is-open")) closePanel();
    else openPanel();
  });

  closeBtn?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    closePanel();
  });

  initWasteCameraAccordions();

  subToggles.forEach((toggle) => {
    const group = groups?.[toggle.dataset.layer];
    toggle.checked = !!group && map.hasLayer(group);
    toggle.addEventListener("change", () => {
      setLayerVisible(group, map, toggle.checked);
      syncCameraParentToggle();
    });
  });

  parentToggle?.addEventListener("change", () => {
    subToggles.forEach((toggle) => {
      const group = groups?.[toggle.dataset.layer];
      toggle.checked = parentToggle.checked;
      setLayerVisible(group, map, parentToggle.checked);
    });
    syncCameraParentToggle();
  });

  document.getElementById("clearLayersBtn")?.addEventListener("click", () => {
    document.querySelectorAll(".layer-toggle").forEach((toggle) => {
      const group = groups?.[toggle.dataset.layer];
      toggle.checked = false;
      setLayerVisible(group, map, false);
    });
    subToggles.forEach((toggle) => {
      const group = groups?.[toggle.dataset.layer];
      toggle.checked = false;
      setLayerVisible(group, map, false);
    });
    syncCameraParentToggle();
    closePanel();
  });

  initWastePanelInterlocks(closePanel);
  syncCameraParentToggle();
}

function initWasteCameraAccordions() {
  const accordions = Array.from(document.querySelectorAll(".camera-accordion"));

  const closeAccordion = (accordion) => {
    accordion.classList.remove("is-open");
    const header = accordion.querySelector(".camera-accordion-header");
    const icon = accordion.querySelector(".camera-accordion-icon");
    header?.setAttribute("aria-expanded", "false");
    if (icon) icon.textContent = "+";
  };

  const openAccordion = (accordion) => {
    accordions.forEach((item) => {
      if (item !== accordion) closeAccordion(item);
    });
    accordion.classList.add("is-open");
    const header = accordion.querySelector(".camera-accordion-header");
    const icon = accordion.querySelector(".camera-accordion-icon");
    header?.setAttribute("aria-expanded", "true");
    if (icon) icon.textContent = "−";
  };

  accordions.forEach((accordion) => {
    const header = accordion.querySelector(".camera-accordion-header");
    header?.addEventListener("click", () => {
      if (accordion.classList.contains("is-open")) {
        closeAccordion(accordion);
        return;
      }
      openAccordion(accordion);
    });
  });
}

function initWastePanelInterlocks(closeCameraPanel) {
  const mapOptionsTab = document.getElementById("mapOptionsTab");
  const mapOptionsWrapper = document.getElementById("mapOptionsWrapper");
  const quickLocateTab = document.getElementById("quickLocateTab");
  const quickLocateWrapper = document.getElementById("quickLocateWrapper");
  const layerHeader = document.querySelector('.map-option-header[data-target="layerOptionsBody"]');
  const districtHeader = document.querySelector('.map-option-header[data-target="districtFilterBody"]');
  const layerOptionsBody = document.getElementById("layerOptionsBody");
  const districtFilterBody = document.getElementById("districtFilterBody");

  const setSectionActive = (body, active) => {
    if (!body) return;
    body.classList.toggle("active", active);
    const header = document.querySelector(`.map-option-header[data-target="${body.id}"]`);
    const icon = header?.querySelector(".map-option-toggle-icon");
    if (icon) icon.textContent = active ? "−" : "+";
  };

  mapOptionsTab?.addEventListener("click", () => {
    if (mapOptionsWrapper?.classList.contains("open")) {
      quickLocateWrapper?.classList.remove("open");
    } else {
      closeCameraPanel?.();
    }
  });

  quickLocateTab?.addEventListener("click", () => {
    if (quickLocateWrapper?.classList.contains("open")) {
      mapOptionsWrapper?.classList.remove("open");
      closeCameraPanel?.();
    }
  });

  layerHeader?.addEventListener("click", () => {
    const layerIsOpen = !!layerOptionsBody?.classList.contains("active");
    if (layerIsOpen) {
      setSectionActive(districtFilterBody, false);
    } else {
      closeCameraPanel?.();
    }
  });

  districtHeader?.addEventListener("click", () => {
    const districtIsOpen = !!districtFilterBody?.classList.contains("active");
    if (districtIsOpen) {
      setSectionActive(layerOptionsBody, false);
      closeCameraPanel?.();
    }
  });
}

function initWasteDistrictFilter(context) {
  const { groups, map } = context || {};
  const groupEl = document.getElementById("districtCheckboxGroup");
  const selectedEl = document.getElementById("selectedListContent");
  const clearBtn = document.getElementById("clearDistrictBtn");
  const doneBtn = document.getElementById("districtDoneBtn");
  const mapOptionsWrapper = document.getElementById("mapOptionsWrapper");
  const districtBody = document.getElementById("districtFilterBody");
  const districtHeader = document.querySelector('.map-option-header[data-target="districtFilterBody"]');
  if (!groupEl || !groups || !map || !window.L) return;

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

  const areaLayers = {};
  const areaMeta = {};
  const selectedAreas = new Set();
  let selectionMode = false;

  const districtNameToId = Object.fromEntries(districts.map((item) => [item.areaName, item.areaId]));

  const markerCache = {};
  Object.entries(groups).forEach(([layerKey, group]) => {
    markerCache[layerKey] = group.getLayers().map((marker) => {
      const popup = marker.getPopup?.();
      const popupText = String(popup?.getContent?.() || popup?._content || "");
      const districtName = districts.find((district) => popupText.includes(district.areaName))?.areaName || "";
      return {
        marker,
        areaId: districtName ? districtNameToId[districtName] : "",
      };
    });
  });

  const getAreaStyle = (id) => {
    const isSelected = selectedAreas.has(id);
    return {
      color: isSelected ? "#00d1ff" : "#4f6bff",
      weight: isSelected ? 3 : 1.5,
      fillColor: isSelected ? "#00d1ff" : "#4f6bff",
      fillOpacity: isSelected ? 0.35 : 0.18,
    };
  };

  const updateSelectedList = () => {
    if (!selectedEl) return;

    if (!selectedAreas.size) {
      selectedEl.textContent = "未選取（顯示全部點位、無行政區外框）";
      selectedEl.classList.add("selected-list-empty");
      return;
    }

    const names = Array.from(selectedAreas).map((id) => areaMeta[id]?.name || id);
    selectedEl.textContent = names.join("、");
    selectedEl.classList.remove("selected-list-empty");
  };

  const syncCheckboxesFromSelection = () => {
    const itemCheckboxes = groupEl.querySelectorAll(".district-checkbox");
    itemCheckboxes.forEach((checkbox) => {
      checkbox.checked = selectedAreas.has(checkbox.dataset.areaId);
    });

    const allCheckbox = document.getElementById("district-all");
    if (!allCheckbox) return;

    if (!selectedAreas.size) {
      allCheckbox.checked = false;
      allCheckbox.indeterminate = false;
    } else if (selectedAreas.size === districts.length) {
      allCheckbox.checked = true;
      allCheckbox.indeterminate = false;
    } else {
      allCheckbox.checked = false;
      allCheckbox.indeterminate = true;
    }
  };

  const markerPassAreaFilter = (entry) => {
    if (!selectedAreas.size) return true;
    return entry.areaId && selectedAreas.has(entry.areaId);
  };

  const applyMarkerAreaFilter = () => {
    Object.entries(groups).forEach(([layerKey, group]) => {
      const entries = markerCache[layerKey] || [];
      entries.forEach((entry) => {
        const shouldShow = markerPassAreaFilter(entry);
        const exists = group.hasLayer(entry.marker);
        if (shouldShow && !exists) group.addLayer(entry.marker);
        if (!shouldShow && exists) group.removeLayer(entry.marker);
      });
    });
  };

  const updateAreaVisibilityAfterApply = () => {
    Object.keys(areaLayers).forEach((id) => {
      const layer = areaLayers[id];
      if (selectedAreas.has(id)) {
        if (!map.hasLayer(layer)) map.addLayer(layer);
        layer.setStyle(getAreaStyle(id));
      } else if (map.hasLayer(layer)) {
        map.removeLayer(layer);
      }
    });
  };

  const refresh = () => {
    Object.keys(areaLayers).forEach((id) => {
      areaLayers[id].setStyle(getAreaStyle(id));
    });
    updateSelectedList();
    syncCheckboxesFromSelection();
    applyMarkerAreaFilter();
    if (!selectionMode) updateAreaVisibilityAfterApply();
  };

  const toggleAreaSelection = (id) => {
    if (selectedAreas.has(id)) selectedAreas.delete(id);
    else selectedAreas.add(id);
    refresh();
  };

  const setSelectionMode = (enabled) => {
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
  };

  const loadDistrictFromSimpleJson = ({ url, areaId, areaName }) => {
    areaMeta[areaId] = { name: areaName };

    fetch(url)
      .then((response) => response.json())
      .then((rawCoords) => {
        const latlngs = rawCoords.map((point) => [point[0], point[1]]);
        const polygon = L.polygon(latlngs, getAreaStyle(areaId));
        polygon.areaId = areaId;
        polygon.areaName = areaName;

        polygon.on("click", () => {
          if (!selectionMode) return;
          toggleAreaSelection(areaId);
        });

        areaLayers[areaId] = polygon;
        if (selectionMode || selectedAreas.has(areaId)) {
          polygon.addTo(map);
        }
      })
      .catch((error) => {
        console.error("載入行政區失敗：", areaName, error);
      });
  };

  const buildAreaCheckboxList = () => {
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

    districts.forEach((district) => {
      const label = document.createElement("label");
      label.className = "checkbox-item";
      label.htmlFor = "chk-" + district.areaId;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = "chk-" + district.areaId;
      checkbox.className = "district-checkbox";
      checkbox.dataset.areaId = district.areaId;
      checkbox.checked = selectedAreas.has(district.areaId);

      const span = document.createElement("span");
      span.textContent = district.areaName;

      label.appendChild(checkbox);
      label.appendChild(span);
      groupEl.appendChild(label);

      checkbox.addEventListener("change", () => toggleAreaSelection(district.areaId));
    });

    allCheckbox.addEventListener("change", () => {
      selectedAreas.clear();
      if (allCheckbox.checked) {
        districts.forEach((district) => selectedAreas.add(district.areaId));
      }
      refresh();
      if (selectionMode) {
        Object.keys(areaLayers).forEach((id) => {
          const layer = areaLayers[id];
          if (!map.hasLayer(layer)) layer.addTo(map);
          layer.setStyle(getAreaStyle(id));
        });
      }
    });

    syncCheckboxesFromSelection();
  };

  districts.forEach(loadDistrictFromSimpleJson);
  buildAreaCheckboxList();
  updateSelectedList();
  updateAreaVisibilityAfterApply();

  clearBtn?.addEventListener("click", () => {
    selectedAreas.clear();
    refresh();
    if (selectionMode) {
      Object.keys(areaLayers).forEach((id) => {
        const layer = areaLayers[id];
        if (!map.hasLayer(layer)) layer.addTo(map);
        layer.setStyle(getAreaStyle(id));
      });
    }
  });

  doneBtn?.addEventListener("click", () => {
    mapOptionsWrapper?.classList.remove("open");
    setSelectionMode(false);
  });

  districtHeader?.addEventListener("click", () => {
    setTimeout(() => {
      setSelectionMode(!!districtBody?.classList.contains("active"));
    }, 0);
  });

  document.querySelector('.map-option-header[data-target="layerOptionsBody"]')?.addEventListener("click", () => {
    setTimeout(() => {
      if (!districtBody?.classList.contains("active")) setSelectionMode(false);
    }, 0);
  });

  document.getElementById("mapOptionsTab")?.addEventListener("click", () => {
    setTimeout(() => {
      if (!mapOptionsWrapper?.classList.contains("open")) setSelectionMode(false);
    }, 0);
  });

  document.querySelectorAll(".layer-toggle, .camera-sub-toggle").forEach((toggle) => {
    toggle.addEventListener("change", () => {
      setTimeout(applyMarkerAreaFilter, 0);
    });
  });

  window.wasteSetDistrictSelectionMode = setSelectionMode;
}



function initWasteQuickLocate(context) {
  const { map } = context || {};
  if (!map || !window.L) return;

  const wrapper = document.getElementById("quickLocateWrapper");
  let typeSelect = document.getElementById("locateTypeSelect");
  const formContainer = document.getElementById("quickLocateFormContainer");
  let clearBtn = document.getElementById("quickLocateClearBtn");
  let goBtn = document.getElementById("quickLocateGoBtn");
  if (!typeSelect || !formContainer || !clearBtn || !goBtn) return;

  /* 共用 topic-common.js 會先綁一組簡版快速定位事件。
     這裡複製節點，移除舊監聽，改成空主題同版快速定位。 */
  const replaceControl = (el) => {
    const clone = el.cloneNode(true);
    el.parentNode.replaceChild(clone, el);
    return clone;
  };

  typeSelect = replaceControl(typeSelect);
  clearBtn = replaceControl(clearBtn);
  goBtn = replaceControl(goBtn);

  const quickLocateLayer = L.layerGroup().addTo(map);
  let quickLocateMarker = null;
  const locationPopupOptions = { className: "custom-case-popup custom-location-popup", minWidth: 240, maxWidth: 320 };

  const newTaipeiDistricts = [
    "板橋區", "中和區", "永和區", "新店區", "土城區", "新莊區", "三重區", "蘆洲區", "汐止區",
    "林口區", "泰山區", "五股區", "淡水區", "三芝區", "石門區", "八里區", "三峽區", "鶯歌區",
    "樹林區", "深坑區", "石碇區", "坪林區", "平溪區", "瑞芳區", "貢寮區", "金山區", "萬里區",
    "雙溪區", "烏來區",
  ];

  const createRow = (labelText, fieldEl) => {
    const row = document.createElement("div");
    row.className = "quick-locate-row";

    const label = document.createElement("div");
    label.className = "quick-locate-label";
    label.textContent = labelText;

    row.appendChild(label);
    row.appendChild(fieldEl);
    return row;
  };

  const createLockedCityRow = () => {
    const cityInput = document.createElement("input");
    cityInput.id = "qlCounty";
    cityInput.className = "quick-locate-input readonly-input";
    cityInput.value = "新北市";
    cityInput.readOnly = true;
    return createRow("縣市", cityInput);
  };

  const createDistrictSelect = (id) => {
    const sel = document.createElement("select");
    sel.id = id;
    sel.className = "quick-locate-select";

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "請選擇";
    sel.appendChild(placeholder);

    newTaipeiDistricts.forEach((district) => {
      const opt = document.createElement("option");
      opt.value = district;
      opt.textContent = district;
      sel.appendChild(opt);
    });

    return sel;
  };

  const createSimpleSelect = (id, options) => {
    const sel = document.createElement("select");
    sel.id = id;
    sel.className = "quick-locate-select";

    options.forEach((text) => {
      const opt = document.createElement("option");
      opt.value = text;
      opt.textContent = text;
      sel.appendChild(opt);
    });

    return sel;
  };

  const createNumberInput = (id, placeholder) => {
    const input = document.createElement("input");
    input.id = id;
    input.type = "number";
    input.className = "quick-locate-input";
    input.placeholder = placeholder || "";
    return input;
  };

  const createTextInput = (id, placeholder) => {
    const input = document.createElement("input");
    input.id = id;
    input.type = "text";
    input.className = "quick-locate-input";
    input.placeholder = placeholder || "";
    return input;
  };

  const renderQuickLocateFields = (type) => {
    formContainer.innerHTML = "";

    if (type === "address" || type === "cadastre" || type === "road" || type === "streetlight") {
      formContainer.appendChild(createLockedCityRow());
    }

    if (type === "cadastre") {
      formContainer.appendChild(createRow("行政區", createDistrictSelect("cadDistrictSelect")));
      const sectionSelect = createSimpleSelect("cadSectionSelect", ["請選擇"]);
      formContainer.appendChild(createRow("地段", sectionSelect));
      formContainer.appendChild(createRow("地號母號", createNumberInput("cadMotherNoInput", "母號")));
      formContainer.appendChild(createRow("地號子號", createNumberInput("cadSubNoInput", "子號")));
      window.EIMPNTPCAddressLocation?.bindLandSectionSelect();
    } else if (type === "address") {
      formContainer.appendChild(createRow("行政區", createDistrictSelect("addrDistrictSelect")));
      formContainer.appendChild(createRow("地址", createTextInput("addrAddressInput", "例：三民路1段1巷38弄1號")));
    } else if (type === "coord") {
      formContainer.appendChild(createRow("經度", createNumberInput("coordLngInput", "請輸入經度")));
      formContainer.appendChild(createRow("緯度", createNumberInput("coordLatInput", "請輸入緯度")));
    } else if (type === "road") {
      formContainer.appendChild(createRow("行政區", createDistrictSelect("roadDistrictSelect")));
      formContainer.appendChild(createRow("段", createSimpleSelect("roadSectionSelect", ["請選擇", "一段", "二段", "三段"])));
      formContainer.appendChild(createRow("巷", createSimpleSelect("roadLaneSelect", ["請選擇", "1巷", "2巷", "3巷"])));
      formContainer.appendChild(createRow("弄", createSimpleSelect("roadAlleySelect", ["請選擇", "1弄", "2弄", "3弄"])));
    } else if (type === "streetlight") {
      formContainer.appendChild(createRow("行政區", createDistrictSelect("streetlightDistrictSelect")));
      formContainer.appendChild(createRow("路燈編號", createNumberInput("streetlightNumberInput", "請輸入路燈編號")));
    }
  };

  const clearQuickLocateInputs = () => {
    const inputs = formContainer.querySelectorAll("input, select");
    inputs.forEach((el) => {
      if (el.tagName.toLowerCase() === "select") el.selectedIndex = 0;
      else if (!el.classList.contains("readonly-input")) el.value = "";
    });

    quickLocateLayer.clearLayers();
    if (quickLocateMarker) {
      map.removeLayer(quickLocateMarker);
      quickLocateMarker = null;
    }
    window.EIMPLocationTools?.clearLocation();
    map.closePopup();
  };

  typeSelect.addEventListener("change", () => {
    renderQuickLocateFields(typeSelect.value);
  });

  clearBtn.addEventListener("click", clearQuickLocateInputs);

  goBtn.addEventListener("click", async () => {
    const type = typeSelect.value;

    if (type === "cadastre") {
      const service = window.EIMPNTPCAddressLocation;
      if (!service) return alert("新北市地籍定位模組載入失敗。");
      const params = service.getCadastreValues();
      goBtn.disabled = true;
      try {
        const { lat, lng } = await service.locateLandNumber(params);
        if (quickLocateMarker) map.removeLayer(quickLocateMarker);
        const details = { lat, lng, town: params.town, landSection: params.landSection, landNumber: `${params.landNumberMom}-${params.landNumberSon || "0"}` };
        window.EIMPLocationTools?.setLocation(details);
        quickLocateMarker = L.marker([lat, lng]).addTo(map).bindPopup(window.EIMPLocationTools?.buildPopupContent(details) || "地籍定位", locationPopupOptions).openPopup();
        map.setView([lat, lng], 17, { animate: false });
      } catch (error) {
        alert(error.message || "地籍定位失敗，請稍後再試。");
      } finally {
        goBtn.disabled = false;
      }
      return;
    }

    if (type === "address") {
      const service = window.EIMPNTPCAddressLocation;
      if (!service) return alert("新北市地址定位模組載入失敗。");
      const params = service.getFormValues();
      goBtn.disabled = true;
      try {
        const { lat, lng } = await service.locateAddress(params);
        if (quickLocateMarker) map.removeLayer(quickLocateMarker);
        const details = { lat, lng, town: params.town, address: service.formatAddress(params) };
        window.EIMPLocationTools?.setLocation(details);
        quickLocateMarker = L.marker([lat, lng]).addTo(map).bindPopup(window.EIMPLocationTools?.buildPopupContent(details) || details.address, locationPopupOptions).openPopup();
        map.setView([lat, lng], 17, { animate: false });
      } catch (error) {
        alert(error.message || "地址定位失敗，請稍後再試。");
      } finally {
        goBtn.disabled = false;
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

      if (Number.isNaN(lat) || Number.isNaN(lng) || lat < 20 || lat > 26 || lng < 120 || lng > 122.5) {
        alert("經緯度超出台灣範圍或格式錯誤，請再次確認。");
        return;
      }

      if (quickLocateMarker) map.removeLayer(quickLocateMarker);
      const details = { lat, lng };
      window.EIMPLocationTools?.setLocation(details);
      quickLocateMarker = L.marker([lat, lng])
        .addTo(map)
        .bindPopup(window.EIMPLocationTools?.buildPopupContent(details) || "快速定位", locationPopupOptions)
        .openPopup();

      map.setView([lat, lng], map.getZoom(), { animate: false });
      return;
    }

    alert("此定位方式尚未串接服務（目前示範用）。");
  });

  renderQuickLocateFields(typeSelect.value || "address");
}


window.EIMPTopic.initTopicPage({
  caseLists: [
    {
      containerId: "airCasesContainer",
      columns: [
        { key: "time" },
        { key: "status" },
        { key: "address", address: true },
      ],
      items: wasteComplaintCases,
    },
    {
      containerId: "fireCasesContainer",
      columns: [
        { key: "time" },
        { key: "fireType" },
        { key: "address", address: true },
      ],
      items: fireReportCases,
    },
  ],
  layers: [
    {
      key: "illegalDumping",
      label: "非法棄置點資料",
      icon: "images/marker.png",
      items: illegalDumpingSites,
      popupFields: [
        { label: "列管單位", key: "controlUnit" },
        { label: "名稱", key: "name" },
        { label: "X座標", key: "coordX" },
        { label: "Y座標", key: "coordY" },
        { label: "列管開始日", key: "startDate" },
      ],
    },
    {
      key: "nonRegBusiness",
      label: "非列管事業",
      icon: "images/工廠許可.png",
      items: nonRegBusinessCases,
      popupFields: [
        { label: "名稱", key: "businessName" },
        { label: "管制編號", key: "controlNo" },
        { label: "地址", key: "address" },
      ],
    },
    {
      key: "regBusiness",
      label: "列管事業",
      icon: "images/工廠許可(列管).png",
      items: regBusinessCases,
      popupFields: [
        { label: "名稱", key: "businessName" },
        { label: "管制編號", key: "controlNo" },
        { label: "事業類型", key: "industryName" },
        { label: "列管類別", key: "regulatedType" },
        { label: "地址", key: "address" },
      ],
    },
    {
      key: "cameraNtpcRoad",
      label: "新北市環保局-稽查科(路)",
      icon: "images/監視器.png",
      items: cameraNtpcRoadSites,
      defaultVisible: true,
      popupFields: [
        { label: "狀態", key: "status" },
        { label: "地址", key: "address" },
      ],
    },
    {
      key: "cameraNtpcWater",
      label: "新北市環保局-稽查科(水)",
      icon: "images/監視器.png",
      items: cameraNtpcWaterSites,
      defaultVisible: false,
      popupFields: [
        { label: "狀態", key: "status" },
        { label: "地址", key: "address" },
      ],
    },
    {
      key: "cameraNtpcCleanup",
      label: "新北市環保局-清維科",
      icon: "images/監視器.png",
      items: cameraNtpcCleanupSites,
      defaultVisible: true,
      popupFields: [
        { label: "狀態", key: "status" },
        { label: "地址", key: "address" },
      ],
    },
    {
      key: "cameraNtpcAir",
      label: "新北市環保局-空品科",
      icon: "images/監視器.png",
      items: cameraNtpcAirSites,
      defaultVisible: false,
      popupFields: [
        { label: "狀態", key: "status" },
        { label: "地址", key: "address" },
      ],
    },
    {
      key: "cameraMoeaWra",
      label: "經濟部-水利署",
      icon: "images/監視器.png",
      items: cameraMoeaWraSites,
      defaultVisible: false,
      popupFields: [
        { label: "狀態", key: "status" },
        { label: "地址", key: "address" },
      ],
    },
    {
      key: "cameraMotcThb",
      label: "交通部-公路局",
      icon: "images/監視器.png",
      items: cameraMotcThbSites,
      defaultVisible: false,
      popupFields: [
        { label: "狀態", key: "status" },
        { label: "地址", key: "address" },
      ],
    },
    {
      key: "cameraMotcFreeway",
      label: "交通部-高速公路局",
      icon: "images/監視器.png",
      items: cameraMotcFreewaySites,
      defaultVisible: false,
      popupFields: [
        { label: "狀態", key: "status" },
        { label: "地址", key: "address" },
      ],
    },
  ],
  onMarkerClick({ layerKey, item }) {
    if (layerKey === "illegalDumping") {
      renderWasteDashboard(item);
    }
  },
  onMapReady(context) {
    wasteMapContext = context;
    renderWasteDashboard(currentIllegalDumpingSite);
    bindWasteDashboardLocate();
    initWasteCameraLayerControls(context);
    initWasteDistrictFilter(context);
    setTimeout(() => initWasteQuickLocate(context), 0);
  },
});
