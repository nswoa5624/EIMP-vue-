(function () {

  window.EIMPSharedBusinessData = window.EIMPSharedBusinessData || {
    // 由空主題複製的列管事業示範資料，供水、噪、廢等主題共用。
    regBusinessCases: [
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
    industryName: "豬飼育業",
    regulatedType: "水、廢",
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
    industryName: "廢水及污水處理業",
    regulatedType: "水",
    otherLincenseNo: "農水桃園字第1138225600號",
    inspectManageNo: "202603310005",
    tempManageNo: "A202603310005",
    factoryLicenseNo: "COM-001261",
    address: "新北市中和區OO路200號",
    manageaddress: "新北市中和區OO路200號",
    businesstype: "社區",
    waterBusinessType: "community",
    lat: 25.0003,
    lng: 121.4930,
    areaId: "Zhonghe",
    businesslabel: "社區地下水"
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
    businesslabel: "一般事業"
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
    businesslabel: "一般事業"
  }
],
    // 新增非列管事業圖層示範資料。
    nonRegBusinessCases: [
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
]
  };

  window.EIMPSharedVehicleData = window.EIMPSharedVehicleData || [
    { id: "VH-011", plateNo: "A11-0001", lat: 25.0062, lng: 121.4692, heading: 120, status: "moving", teamCode: "一分隊", responsibleAreas: ["板橋區", "土城區", "三峽區"], designatedTeamCodes: ["二分隊"] },
    { id: "VH-021", plateNo: "B21-2001", lat: 24.9875, lng: 121.4961, heading: null, status: "stopped", teamCode: "二分隊", responsibleAreas: ["中和區", "永和區"], designatedTeamCodes: ["一分隊"] },
    { id: "VH-022", plateNo: "B22-2002", lat: 24.9675, lng: 121.5412, heading: 45, status: "moving", teamCode: "二分隊", responsibleAreas: ["新店區", "深坑區", "石碇區", "烏來區", "坪林區"], designatedTeamCodes: ["三分隊"] },
    { id: "VH-031", plateNo: "C31-3001", lat: 25.1086, lng: 121.8074, heading: 270, status: "moving", teamCode: "三分隊", responsibleAreas: ["雙溪區", "平溪區", "貢寮區", "瑞芳區"], designatedTeamCodes: ["三分隊"] },
    { id: "VH-032", plateNo: "C32-3002", lat: 25.0646, lng: 121.6623, heading: 315, status: "moving", teamCode: "三分隊", responsibleAreas: ["汐止區", "金山區", "萬里區"], designatedTeamCodes: ["六、七分隊"] },
    { id: "VH-041", plateNo: "D41-4001", lat: 25.0790, lng: 121.4740, heading: 0, status: "moving", teamCode: "四分隊", responsibleAreas: ["蘆洲區", "五股區", "三重區"], designatedTeamCodes: ["六、七分隊"] },
    { id: "VH-051", plateNo: "E51-5001", lat: 25.0200, lng: 121.4300, heading: 180, status: "moving", teamCode: "五分隊", responsibleAreas: ["新莊區", "樹林區", "鶯歌區"], designatedTeamCodes: ["一分隊"] },
    { id: "VH-061", plateNo: "F61-6001", lat: 25.1743, lng: 121.4356, heading: 90, status: "moving", teamCode: "六、七分隊", responsibleAreas: ["淡水區", "三芝區", "石門區"], designatedTeamCodes: ["四分隊"] },
    { id: "VH-062", plateNo: "F62-6002", lat: 25.1492, lng: 121.4066, heading: 135, status: "moving", teamCode: "六、七分隊", responsibleAreas: ["八里區"], designatedTeamCodes: ["四分隊"] },
    { id: "VH-071", plateNo: "G71-7001", lat: 25.0796, lng: 121.3889, heading: null, status: "stopped", teamCode: "六、七分隊", responsibleAreas: ["林口區"], designatedTeamCodes: ["四分隊"] },
    { id: "VH-072", plateNo: "G72-7002", lat: 25.0586, lng: 121.4321, heading: null, status: "stopped", teamCode: "六、七分隊", responsibleAreas: ["泰山區"], designatedTeamCodes: ["五分隊"] },
  ];


  "use strict";

  const DEFAULT_CENTER = [25.009220444300375, 121.46480408095688];
  const DEFAULT_ZOOM = 12;

  function $(id) {
    return document.getElementById(id);
  }

  function safeText(value, fallback = "-") {
    return value === undefined || value === null || value === "" ? fallback : String(value);
  }

  function escapeHtml(value, fallback = "-") {
    return safeText(value, fallback)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function escapeAttr(value, fallback = "") {
    return escapeHtml(value, fallback);
  }


  function getBusinessFavoriteStorageKey() {
    const topic = document.body?.dataset?.topic || "topic";
    return `eimp-${topic}-business-favorites`;
  }

  function loadBusinessFavorites() {
    try {
      return new Set(JSON.parse(localStorage.getItem(getBusinessFavoriteStorageKey()) || "[]"));
    } catch (error) {
      console.warn("讀取事業收藏失敗：", error);
      return new Set();
    }
  }

  function saveBusinessFavorites(favorites) {
    localStorage.setItem(getBusinessFavoriteStorageKey(), JSON.stringify(Array.from(favorites)));
  }

  function buildBusinessFavoriteKey(type, itemId) {
    return `${type}::${itemId}`;
  }

  function getBusinessFavoriteButtonHtml(item, type) {
    const favorites = loadBusinessFavorites();
    const active = favorites.has(buildBusinessFavoriteKey(type, item.id));
    return `<button type="button" class="popup-favorite-btn ${active ? "is-favorite" : ""}" data-item-type="${escapeAttr(type)}" data-item-id="${escapeAttr(item.id)}" title="${active ? "取消收藏" : "加入收藏"}" aria-label="${active ? "取消收藏" : "加入收藏"}">★</button>`;
  }

  function bindSharedBusinessFavoriteHandler() {
    if (document.documentElement.dataset.eimpBusinessFavoriteBound === "true") return;
    document.documentElement.dataset.eimpBusinessFavoriteBound = "true";
    document.addEventListener("click", (event) => {
      const button = event.target.closest?.(".popup-favorite-btn");
      if (!button || document.body.classList.contains("topic-air")) return;
      event.preventDefault();
      event.stopPropagation();
      const favorites = loadBusinessFavorites();
      const key = buildBusinessFavoriteKey(button.dataset.itemType, button.dataset.itemId);
      const willFavorite = !favorites.has(key);
      if (willFavorite) favorites.add(key);
      else favorites.delete(key);
      saveBusinessFavorites(favorites);
      button.classList.toggle("is-favorite", willFavorite);
      button.title = willFavorite ? "取消收藏" : "加入收藏";
      button.setAttribute("aria-label", button.title);
    }, true);
  }

  function initDrawer() {
    const hamburgerBtn = $("hamburgerBtn");
    const overlay = $("sideMenuOverlay");
    const drawer = $("sideMenuDrawer");
    if (!hamburgerBtn || !overlay || !drawer) return;

    const open = () => {
      document.body.classList.add("menu-open");
      hamburgerBtn.setAttribute("aria-expanded", "true");
      overlay.setAttribute("aria-hidden", "false");
      drawer.setAttribute("aria-hidden", "false");
    };
    const close = () => {
      document.body.classList.remove("menu-open");
      hamburgerBtn.setAttribute("aria-expanded", "false");
      overlay.setAttribute("aria-hidden", "true");
      drawer.setAttribute("aria-hidden", "true");
    };

    hamburgerBtn.addEventListener("click", open);
    hamburgerBtn.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open();
      }
    });
    overlay.addEventListener("click", close);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });
  }

  function setMenuActiveButton(targetBtn) {
    document.querySelectorAll(".side-menu-item").forEach((item) => {
      item.classList.toggle("is-active", item === targetBtn);
    });
  }

  function closeSideMenu() {
    const hamburgerBtn = $("hamburgerBtn");
    const overlay = $("sideMenuOverlay");
    const drawer = $("sideMenuDrawer");
    document.body.classList.remove("menu-open");
    hamburgerBtn?.setAttribute("aria-expanded", "false");
    overlay?.setAttribute("aria-hidden", "true");
    drawer?.setAttribute("aria-hidden", "true");
  }

  function closeSideMenuIfMobile() {
    if (window.matchMedia("(max-width: 800px)").matches) {
      closeSideMenu();
    }
  }

  function showAccountPage(pageName) {
    const profilePage = document.querySelector('.profile-drawer-content > .profile-drawer-page:not(.account-manage-page)');
    const listPage = $("accountManageListPage");
    const detailPage = $("accountManageDetailPage");

    if (profilePage) profilePage.hidden = pageName !== "profile";
    if (listPage) listPage.hidden = pageName !== "accountList";
    if (detailPage) detailPage.hidden = pageName !== "accountDetail";
  }

  function openProfilePanel() {
    const panel = $("profileDrawerPanel");
    showAccountPage("profile");
    document.body.classList.add("profile-open");
    panel?.setAttribute("aria-hidden", "false");
    setMenuActiveButton($("profileMenuBtn"));
  }

  function closeProfilePanel() {
    const panel = $("profileDrawerPanel");
    document.body.classList.remove("profile-open");
    panel?.setAttribute("aria-hidden", "true");
    setMenuActiveButton(null);
  }

  function initProfileDrawer() {
    const openBtn = $("profileMenuBtn");
    const closeBtn = $("profileCloseBtn");
    const closeMask = $("profileCloseMask");

    openBtn?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      openProfilePanel();
      closeSideMenuIfMobile();
    });
    closeBtn?.addEventListener("click", closeProfilePanel);
    closeMask?.addEventListener("click", () => {
      closeProfilePanel();
      closeSideMenu();
    });

    document.querySelectorAll(".password-toggle-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const input = $(btn.getAttribute("data-target"));
        if (!input) return;
        input.type = input.type === "password" ? "text" : "password";
      });
    });
  }

  function getCurrentDisplayUser() {
    const name = $("sideMenuUserName")?.textContent?.trim() || "";
    const jobTitle = $("jobTitleInput")?.value?.trim() || "";
    return { name, jobTitle };
  }

  function canCurrentUserUseDecision() {
    const user = getCurrentDisplayUser();
    // 目前原型以林OO代表主管職帳號；若之後接後端登入，可改由 API 回傳 canUseDecision 判斷。
    return user.name === "林OO";
  }

  function initDecisionMenuAccess() {
    const decisionBtn = $("decisionMenuBtn");
    if (!decisionBtn) return;

    if (canCurrentUserUseDecision()) {
      decisionBtn.style.display = "block";
    } else {
      decisionBtn.style.display = "none";
    }

    decisionBtn.addEventListener("click", (event) => {
      if (!canCurrentUserUseDecision()) {
        event.preventDefault();
        alert("此功能限主管職林OO使用。");
      }
    });
  }

  function guardDecisionPage() {
    if (document.body?.dataset?.topic !== "decision") return;
    if (canCurrentUserUseDecision()) return;
    document.body.classList.add("decision-unauthorized");
    const decisionBtn = $("decisionMenuBtn");
    if (decisionBtn) decisionBtn.style.display = "none";
  }

  const sharedAccounts = {
    default: {
      key: "default",
      account: "EIMPtest",
      company: "第一稽查分隊",
      name: "林OO",
      jobTitle: "分隊長",
      phone: "12345678",
      email: "NTPCEPD@ntpc.gov.tw",
      canManageAccounts: true,
      canUseDecision: true,
      isSupervisor: true,
    },
    zhongheCleaner: {
      key: "zhongheCleaner",
      account: "ZhongheCleaner",
      company: "中和清潔隊",
      name: "王XX",
      jobTitle: "清潔隊員",
      phone: "12345678",
      email: "zhonghe@clean.gov.tw",
      canManageAccounts: false,
      canUseDecision: false,
      isSupervisor: false,
    },
  };

  const sharedSquadAccounts = [
    { id: 1, account: "Account01", unit: "第一稽查分隊", name: "新北市環保局測試一", jobTitle: "稽查員", phone: "(02)2953-2111", email: "ntpc01@ntpc.gov.tw", isAdmin: false, enabled: true, loginLogs: [
      { time: "2026-03-24 08:15:21", ip: "10.10.1.21", result: "登入成功" },
      { time: "2026-03-23 13:48:06", ip: "10.10.1.21", result: "登入成功" },
      { time: "2026-03-22 09:03:54", ip: "10.10.1.21", result: "密碼錯誤" },
    ] },
    { id: 2, account: "Account02", unit: "第一稽查分隊", name: "新北市環保局測試二", jobTitle: "稽查員", phone: "(02)2953-2112", email: "ntpc02@ntpc.gov.tw", isAdmin: false, enabled: true, loginLogs: [
      { time: "2026-03-24 07:56:40", ip: "10.10.1.22", result: "登入成功" },
      { time: "2026-03-23 17:22:19", ip: "10.10.1.22", result: "登入成功" },
    ] },
    { id: 3, account: "Account03", unit: "第一稽查分隊", name: "新北市環保局測試三", jobTitle: "稽查員", phone: "(02)2953-2113", email: "ntpc03@ntpc.gov.tw", isAdmin: false, enabled: true, loginLogs: [
      { time: "2026-03-24 09:30:11", ip: "10.10.1.23", result: "登入成功" },
      { time: "2026-03-23 18:42:35", ip: "10.10.1.23", result: "帳號鎖定前失敗" },
    ] },
    { id: 4, account: "Account04", unit: "第一稽查分隊", name: "新北市環保局測試四", jobTitle: "稽查員", phone: "(02)2953-2114", email: "ntpc04@ntpc.gov.tw", isAdmin: false, enabled: true, loginLogs: [
      { time: "2026-03-24 10:12:44", ip: "10.10.1.24", result: "登入成功" },
    ] },
    { id: 5, account: "Account05", unit: "第一稽查分隊", name: "新北市環保局測試五", jobTitle: "稽查員", phone: "(02)2953-2115", email: "ntpc05@ntpc.gov.tw", isAdmin: false, enabled: true, loginLogs: [
      { time: "2026-03-24 08:02:27", ip: "10.10.1.25", result: "登入成功" },
      { time: "2026-03-24 08:01:58", ip: "10.10.1.25", result: "驗證碼錯誤" },
    ] },
  ];

  let sharedCurrentAccountKey = "default";

  function getSharedCurrentAccount() {
    return sharedAccounts[sharedCurrentAccountKey] || sharedAccounts.default;
  }

  function applySharedAccountView() {
    const account = getSharedCurrentAccount();
    const setters = {
      accountInput: account.account,
      companyInput: account.company,
      nameInput: account.name,
      jobTitleInput: account.jobTitle,
      phoneInput: account.phone,
      emailInput: account.email,
    };

    Object.entries(setters).forEach(([id, value]) => {
      const el = $(id);
      if (el) el.value = value;
    });

    const sideName = $("sideMenuUserName");
    if (sideName) sideName.textContent = account.name;

    const accountManageBtn = $("accountManageMenuBtn");
    if (accountManageBtn) accountManageBtn.style.display = account.canManageAccounts ? "block" : "none";

    const decisionBtn = $("decisionMenuBtn");
    if (decisionBtn) decisionBtn.style.display = account.canUseDecision ? "block" : "none";

    if (!account.canManageAccounts) {
      const listOpen = $("accountManageListPage")?.hidden === false;
      const detailOpen = $("accountManageDetailPage")?.hidden === false;
      if (listOpen || detailOpen) openProfilePanel();
    }

    if (document.body?.dataset?.topic === "decision") {
      document.body.classList.toggle("decision-unauthorized", !account.canUseDecision);
    }

    window.dispatchEvent(new CustomEvent("eimp:account-changed", { detail: { account } }));
  }

  function renderSharedAccountManageTable(keyword = "") {
    const tbody = $("accountManageTableBody");
    if (!tbody) return;
    const normalizedKeyword = String(keyword || "").trim().toLowerCase();
    const rows = sharedSquadAccounts.filter((item) => {
      if (!normalizedKeyword) return true;
      return [item.account, item.unit, item.name].some((value) => String(value || "").toLowerCase().includes(normalizedKeyword));
    });

    tbody.innerHTML = rows.map((item, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${item.account}</td>
        <td>${item.unit}</td>
        <td>${item.name}</td>
        <td><button type="button" class="account-manage-log-btn" data-account-id="${item.id}">下載</button></td>
        <td><button type="button" class="account-manage-row-btn" data-account-id="${item.id}">管理</button></td>
      </tr>
    `).join("");
  }

  function fillSharedAccountDetail(item) {
    if (!item) return;
    const values = {
      manageAccountInput: item.account,
      manageCompanyInput: item.unit,
      manageNameInput: item.name,
      manageJobInput: item.jobTitle,
      managePhoneInput: item.phone,
      manageEmailInput: item.email,
    };
    Object.entries(values).forEach(([id, value]) => {
      const el = $(id);
      if (el) el.value = value || "";
    });
    const admin = $("manageAdminCheckbox");
    const enabled = $("manageEnabledCheckbox");
    if (admin) admin.checked = !!item.isAdmin;
    if (enabled) enabled.checked = !!item.enabled;
  }

  function openSharedAccountManagementPanel() {
    const account = getSharedCurrentAccount();
    if (!account.canManageAccounts) return;
    renderSharedAccountManageTable($("accountManageSearchInput")?.value || "");
    showAccountPage("accountList");
    document.body.classList.add("profile-open");
    $("profileDrawerPanel")?.setAttribute("aria-hidden", "false");
    setMenuActiveButton($("accountManageMenuBtn"));
  }

  function openSharedAccountDetail(accountId) {
    const item = sharedSquadAccounts.find((row) => String(row.id) === String(accountId));
    if (!item) return;
    fillSharedAccountDetail(item);
    showAccountPage("accountDetail");
    document.body.classList.add("profile-open");
    $("profileDrawerPanel")?.setAttribute("aria-hidden", "false");
    setMenuActiveButton($("accountManageMenuBtn"));
  }

  function downloadSharedAccountLoginLog(accountId) {
    const item = sharedSquadAccounts.find((row) => String(row.id) === String(accountId));
    if (!item) return;
    const rows = [["時間", "IP", "結果"], ...(item.loginLogs || []).map((log) => [log.time, log.ip, log.result])];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${item.account}_login_logs.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function initSharedAccountManagement() {
    const accountManageBtn = $("accountManageMenuBtn");
    const switchAccountBtn = $("switchAccountBtn");
    const searchBtn = $("accountManageSearchBtn");
    const searchInput = $("accountManageSearchInput");
    const addBtn = $("accountManageAddBtn");
    const tableBody = $("accountManageTableBody");
    const backBtn = $("accountDetailBackBtn");
    const saveBtn = $("accountDetailSaveBtn");

    applySharedAccountView();

    switchAccountBtn?.addEventListener("click", () => {
      sharedCurrentAccountKey = sharedCurrentAccountKey === "default" ? "zhongheCleaner" : "default";
      applySharedAccountView();
    });

    accountManageBtn?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      openSharedAccountManagementPanel();
      closeSideMenuIfMobile();
    });

    searchBtn?.addEventListener("click", () => renderSharedAccountManageTable(searchInput?.value || ""));
    searchInput?.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      renderSharedAccountManageTable(searchInput.value || "");
    });
    addBtn?.addEventListener("click", () => alert("目前先提供第一稽查分隊帳號檢視功能，新增帳號功能尚未串接。"));
    tableBody?.addEventListener("click", (event) => {
      const logBtn = event.target.closest(".account-manage-log-btn");
      if (logBtn) {
        downloadSharedAccountLoginLog(logBtn.dataset.accountId);
        return;
      }
      const manageBtn = event.target.closest(".account-manage-row-btn");
      if (manageBtn) openSharedAccountDetail(manageBtn.dataset.accountId);
    });
    backBtn?.addEventListener("click", () => {
      showAccountPage("accountList");
      setMenuActiveButton(accountManageBtn);
    });
    saveBtn?.addEventListener("click", () => alert("目前為示意畫面，帳號資料尚未串接實際儲存。已保留版面與流程供後續接後端使用。"));
  }

  function initAccordionHeaders() {
    document.querySelectorAll(".map-option-header").forEach((header) => {
      const targetId = header.getAttribute("data-target");
      const body = targetId ? $(targetId) : null;
      const icon = header.querySelector(".map-option-toggle-icon");
      if (!body) return;

      header.addEventListener("click", () => {
        body.classList.toggle("active");
        if (icon) icon.textContent = body.classList.contains("active") ? "−" : "+";
      });
    });
  }

  function initSlidePanels() {
    const pairs = [
      ["mapOptionsTab", "mapOptionsWrapper"],
      ["quickLocateTab", "quickLocateWrapper"],
    ];

    pairs.forEach(([buttonId, wrapperId]) => {
      const button = $(buttonId);
      const wrapper = $(wrapperId);
      if (!button || !wrapper) return;
      button.addEventListener("click", () => wrapper.classList.toggle("open"));
    });
  }

  function initStationButtons(config, map) {
    const cards = config.metricCards || {};
    const stationData = config.stationData || {};
    const stationLocations = config.stationLocations || {};
    const stationButtons = document.querySelectorAll(".aqi-station-btn, .waqi-station-btn");
    const selectionPanel = config.stationSelectionPanelSelector
      ? document.querySelector(config.stationSelectionPanelSelector)
      : null;

    function update(station) {
      const data = stationData[station] || config.defaultStationData || {};
      Object.entries(cards).forEach(([targetId, card]) => {
        const el = $(targetId);
        if (!el) return;
        el.textContent = safeText(data[card.key], card.fallback || "-");
      });
    }

    function selectStation(station, { pan = true } = {}) {
      stationButtons.forEach((button) => {
        const buttonStation = button.dataset.station || button.textContent.trim();
        button.classList.toggle("active", buttonStation === station);
      });
      selectionPanel?.classList.add("has-station-selection");
      update(station);

      const location = stationLocations[station];
      if (pan && map && Number.isFinite(Number(location?.lat)) && Number.isFinite(Number(location?.lng))) {
        map.closePopup();
        map.panTo([Number(location.lat), Number(location.lng)]);
      }
    }

    config.selectStation = selectStation;

    stationButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const station = button.dataset.station || button.textContent.trim();
        selectStation(station);
      });
    });

    if (config.resetStationSelectionOnOutsideClick) {
      document.addEventListener("click", (event) => {
        if (event.target.closest(".aqi-station-btn, .waqi-station-btn")) return;
        stationButtons.forEach((button) => button.classList.remove("active"));
        selectionPanel?.classList.remove("has-station-selection");
      });
    }

    const active = document.querySelector(".aqi-station-btn.active, .waqi-station-btn.active") || document.querySelector(".aqi-station-btn, .waqi-station-btn");
    if (active) update(active.dataset.station || active.textContent.trim());
  }

  function initQuickLocate(map) {
    const typeSelect = $("locateTypeSelect");
    const form = $("quickLocateFormContainer");
    const goBtn = $("quickLocateGoBtn");
    const clearBtn = $("quickLocateClearBtn");
    let marker = null;
    const locationPopupOptions = { className: "custom-case-popup custom-location-popup", minWidth: 240, maxWidth: 320 };
    if (!typeSelect || !form) return;

    const districts = ["板橋區", "中和區", "永和區", "新店區", "土城區", "新莊區", "三重區", "蘆洲區", "汐止區", "林口區", "泰山區", "五股區", "淡水區", "三芝區", "石門區", "八里區", "三峽區", "鶯歌區", "樹林區", "深坑區", "石碇區", "坪林區", "平溪區", "瑞芳區", "貢寮區", "金山區", "萬里區", "雙溪區", "烏來區"];
    const addressTemplate = `
      <div class="quick-locate-row"><div class="quick-locate-label">縣市</div><input class="quick-locate-input readonly-input" value="新北市" readonly /></div>
      <div class="quick-locate-row"><label class="quick-locate-label" for="addrDistrictSelect">行政區</label><select class="quick-locate-select" id="addrDistrictSelect" required><option value="">請選擇</option>${districts.map((district) => `<option value="${district}">${district}</option>`).join("")}</select></div>
      <div class="quick-locate-row"><label class="quick-locate-label" for="addrAddressInput">地址</label><input class="quick-locate-input" id="addrAddressInput" placeholder="例：三民路1段1巷38弄1號" required /></div>`;
    const templates = {
      address: addressTemplate,
      cadastre: `
        <div class="quick-locate-row"><div class="quick-locate-label">縣市</div><input class="quick-locate-input readonly-input" value="新北市" readonly /></div>
        <div class="quick-locate-row"><label class="quick-locate-label" for="cadDistrictSelect">行政區</label><select class="quick-locate-select" id="cadDistrictSelect"><option value="">請選擇</option>${districts.map((district) => `<option value="${district}">${district}</option>`).join("")}</select></div>
        <div class="quick-locate-row"><label class="quick-locate-label" for="cadSectionSelect">地段</label><select class="quick-locate-select" id="cadSectionSelect"><option value="">請選擇</option></select></div>
        <div class="quick-locate-row"><label class="quick-locate-label" for="cadMotherNoInput">地號母號</label><input class="quick-locate-input" id="cadMotherNoInput" inputmode="numeric" placeholder="例：6" /></div>
        <div class="quick-locate-row"><label class="quick-locate-label" for="cadSubNoInput">地號子號</label><input class="quick-locate-input" id="cadSubNoInput" inputmode="numeric" placeholder="例：0（選填）" /></div>`,
      coord: '<div class="quick-locate-row"><div class="quick-locate-label">緯度</div><input class="quick-locate-input" id="locateLatInput" placeholder="25.0092" /></div><div class="quick-locate-row"><div class="quick-locate-label">經度</div><input class="quick-locate-input" id="locateLngInput" placeholder="121.4648" /></div>',
      road: '<div class="quick-locate-row"><div class="quick-locate-label">道路</div><input class="quick-locate-input" placeholder="例：連城路" /></div>',
      streetlight: '<div class="quick-locate-row"><div class="quick-locate-label">路燈號</div><input class="quick-locate-input" placeholder="請輸入路燈編號" /></div>',
    };

    function render() {
      form.innerHTML = templates[typeSelect.value] || templates.address;
      if (typeSelect.value === "cadastre") window.EIMPNTPCAddressLocation?.bindLandSectionSelect();
    }

    typeSelect.addEventListener("change", render);
    render();

    goBtn?.addEventListener("click", async () => {
      if (typeSelect.value === "cadastre") {
        const service = window.EIMPNTPCAddressLocation;
        if (!service) return alert("新北市地籍定位模組載入失敗。");
        const params = service.getCadastreValues();
        goBtn.disabled = true;
        try {
          const { lat, lng } = await service.locateLandNumber(params);
          if (marker) marker.remove();
          const details = { lat, lng, town: params.town, landSection: params.landSection, landNumber: `${params.landNumberMom}-${params.landNumberSon || "0"}` };
          window.EIMPLocationTools?.setLocation(details);
          marker = L.marker([lat, lng]).addTo(map).bindPopup(window.EIMPLocationTools?.buildPopupContent(details) || "地籍定位", locationPopupOptions).openPopup();
          map.setView([lat, lng], 17);
        } catch (error) {
          alert(error.message || "地籍定位失敗，請稍後再試。");
        } finally {
          goBtn.disabled = false;
        }
        return;
      }
      if (typeSelect.value === "address") {
        const service = window.EIMPNTPCAddressLocation;
        if (!service) return alert("新北市地址定位模組載入失敗。");
        const params = service.getFormValues();
        goBtn.disabled = true;
        try {
          const { lat, lng } = await service.locateAddress(params);
          if (marker) marker.remove();
          const details = { lat, lng, town: params.town, address: service.formatAddress(params) };
          window.EIMPLocationTools?.setLocation(details);
          marker = L.marker([lat, lng]).addTo(map).bindPopup(window.EIMPLocationTools?.buildPopupContent(details) || details.address, locationPopupOptions).openPopup();
          map.setView([lat, lng], 17);
        } catch (error) {
          alert(error.message || "地址定位失敗，請稍後再試。");
        } finally {
          goBtn.disabled = false;
        }
        return;
      }
      let lat = Number($("locateLatInput")?.value);
      let lng = Number($("locateLngInput")?.value);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        lat = DEFAULT_CENTER[0];
        lng = DEFAULT_CENTER[1];
      }
      if (marker) marker.remove();
      const details = { lat, lng };
      window.EIMPLocationTools?.setLocation(details);
      marker = L.marker([lat, lng]).addTo(map).bindPopup(window.EIMPLocationTools?.buildPopupContent(details) || "快速定位", locationPopupOptions).openPopup();
      map.setView([lat, lng], 16);
    });

    clearBtn?.addEventListener("click", () => {
      if (marker) marker.remove();
      marker = null;
      window.EIMPLocationTools?.clearLocation();
    });
  }

  function createIcon(iconUrl) {
    return L.icon({
      iconUrl,
      iconSize: [26, 26],
      iconAnchor: [13, 26],
      popupAnchor: [0, -24],
    });
  }

  const warningIconCache = new Map();

  function getWarningClass(iconUrl, layerConfig) {
    const text = `${safeText(iconUrl, "")} ${safeText(layerConfig?.key, "")} ${safeText(layerConfig?.label, "")}`;
    if (text.includes("監視") || text.toLowerCase().includes("camera")) return "warning-marker--camera";
    if (text.includes("火災") || text.toLowerCase().includes("fire")) return "warning-marker--fire";
    return "warning-marker--default";
  }

  function createWarningIcon(iconUrl, layerConfig) {
    const warningClass = getWarningClass(iconUrl, layerConfig);
    const cacheKey = `${iconUrl}::${warningClass}`;
    if (warningIconCache.has(cacheKey)) return warningIconCache.get(cacheKey);

    const icon = L.divIcon({
      className: `eimp-warning-div-icon ${warningClass}`,
      html: `<div class="warning-marker"><img src="${escapeAttr(iconUrl)}" class="marker-img" alt="" /></div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 31],
      popupAnchor: [0, -29],
    });

    warningIconCache.set(cacheKey, icon);
    return icon;
  }

  function shouldUseWarningRipple(item, layerConfig, iconUrl) {
  return item?.rippleWarning === true;
}


  function canCurrentUserSeeVehicleLayer() {
    const account = getSharedCurrentAccount();
    const jobTitle = safeText(account?.jobTitle, "");
    return !!account?.isSupervisor || jobTitle.includes("分隊長");
  }

  function shouldAppendSharedVehicleLayer() {
    const topic = document.body?.dataset?.topic || "";
    return topic === "water" || topic === "waste" || topic === "noise";
  }

  function appendVehicleLayerConfig(config) {
    if (!config || !shouldAppendSharedVehicleLayer()) return;
    const layers = Array.isArray(config.layers) ? config.layers : [];
    if (layers.some((layer) => layer?.key === "vehicle")) return;
    layers.push({
      key: "vehicle",
      label: "車輛",
      icon: "images/car.png",
      items: window.EIMPSharedVehicleData || [],
      defaultVisible: canCurrentUserSeeVehicleLayer(),
      supervisorOnly: true,
    });
    config.layers = layers;
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
    const status = safeText(item?.status || item?.movingStatus, "").trim().toLowerCase();
    if (status === "stopped" || status === "stop" || status === "停車" || status === "停止" || status === "靜止") return false;
    return getVehicleHeading(item) !== null;
  }

  function createVehicleIcon(item, layerConfig) {
    const iconUrl = item?.icon || layerConfig?.icon || "images/car.png";
    const heading = getVehicleHeading(item);
    const arrowHtml = isVehicleMoving(item)
      ? `<span class="vehicle-marker__arrow-wrap" style="--vehicle-heading: ${heading}deg"><span class="vehicle-marker__arrow vehicle-marker__arrow--gray"></span></span>`
      : "";
    return L.divIcon({
      className: "eimp-vehicle-div-icon",
      html: `<div class="vehicle-marker">${arrowHtml}<img src="${escapeAttr(iconUrl)}" class="vehicle-marker__img" alt="" /></div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 29],
      tooltipAnchor: [0, -31],
    });
  }

  function bindVehiclePlateLabel(marker, item) {
    const plateNo = safeText(item?.plateNo || item?.plate || item?.licensePlate, "-");
    marker.bindTooltip(escapeHtml(plateNo), {
      direction: "top",
      offset: [0, 10],
      className: "vehicle-plate-label",
      opacity: 1,
      permanent: false,
      sticky: false,
    });
    marker.on("click", () => marker.openTooltip());
  }

  function createMarkerIcon(item, layerConfig) {
    if (layerConfig?.key === "vehicle") return createVehicleIcon(item, layerConfig);
    const iconUrl = item?.icon || layerConfig?.icon || "images/marker.png";
    return shouldUseWarningRipple(item, layerConfig, iconUrl)
      ? createWarningIcon(iconUrl, layerConfig)
      : createIcon(iconUrl);
  }

  function renderCaseList(containerId, items, rowConfig, onClick) {
    const container = $(containerId);
    if (!container) return;
    container.innerHTML = "";

    items.forEach((item) => {
      const row = document.createElement("div");
      row.className = "panel-body-row case-row";
      row.dataset.caseId = item.id;
      row.innerHTML = rowConfig.columns.map((column) => {
        const baseClass = column.address ? "panel-body-address-text" : "panel-body-text";
        const cls = [baseClass, column.className].filter(Boolean).join(" ");
        const rawValue = item[column.key];
        const value = Array.isArray(rawValue) ? rawValue.join("、") : safeText(rawValue);
        const title = column.ellipsis ? ` title="${escapeAttr(value)}"` : "";
        const content = column.ellipsis
          ? `<span class="case-cell-ellipsis-value">${escapeHtml(value)}</span>`
          : escapeHtml(value);
        return `<span class="${cls}"${title}>${content}</span>`;
      }).join("");
      row.addEventListener("click", () => onClick?.(item, row));
      container.appendChild(row);
    });
  }

  const NEW_TAIPEI_DISTRICTS = [
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

  function initDistrictFilter({ map, groups, markerEntries }) {
    // 廢主題有自己的行政區與監視器子圖層整合邏輯，避免重複綁定。
    if (document.body.classList.contains("topic-waste")) return;

    const groupEl = $("districtCheckboxGroup");
    const selectedEl = $("selectedListContent");
    const clearBtn = $("clearDistrictBtn");
    const doneBtn = $("districtDoneBtn");
    const mapOptionsWrapper = $("mapOptionsWrapper");
    const districtBody = $("districtFilterBody");
    const districtHeader = document.querySelector('.map-option-header[data-target="districtFilterBody"]');
    const layerHeader = document.querySelector('.map-option-header[data-target="layerOptionsBody"]');
    const mapOptionsTab = $("mapOptionsTab");

    if (!groupEl || !map || !groups || !Array.isArray(markerEntries) || !window.L) return;
    if (groupEl.dataset.eimpDistrictReady === "true") return;
    groupEl.dataset.eimpDistrictReady = "true";

    const districts = NEW_TAIPEI_DISTRICTS;
    const districtIdSet = new Set(districts.map((district) => district.areaId));
    const districtNameToId = Object.fromEntries(districts.map((district) => [district.areaName, district.areaId]));
    const areaLayers = new Map();
    const polygonCoordinates = new Map();
    const selectedAreas = new Set();
    let selectionMode = false;

    function inferAreaIdFromText(item) {
      if (item?.areaId && districtIdSet.has(String(item.areaId))) return String(item.areaId);

      const searchableText = [
        item?.district,
        item?.areaName,
        item?.address,
        item?.location,
        item?.title,
        item?.name,
        item?.businessName,
      ].filter(Boolean).join(" ");

      const matchedDistrict = districts.find((district) => searchableText.includes(district.areaName));
      return matchedDistrict ? districtNameToId[matchedDistrict.areaName] : "";
    }

    // 射線法判斷點是否落於行政區 polygon；座標格式為 [lat, lng]。
    function pointInPolygon(lat, lng, coordinates) {
      let inside = false;
      for (let i = 0, j = coordinates.length - 1; i < coordinates.length; j = i++) {
        const yi = Number(coordinates[i][0]);
        const xi = Number(coordinates[i][1]);
        const yj = Number(coordinates[j][0]);
        const xj = Number(coordinates[j][1]);
        const intersects = ((yi > lat) !== (yj > lat))
          && (lng < ((xj - xi) * (lat - yi)) / ((yj - yi) || Number.EPSILON) + xi);
        if (intersects) inside = !inside;
      }
      return inside;
    }

    const filterEntries = markerEntries.map((entry) => ({
      ...entry,
      areaId: inferAreaIdFromText(entry.item),
    }));

    function assignCoordinateAreas(targetAreaId = "") {
      filterEntries.forEach((entry) => {
        if (entry.areaId) return;
        const latLng = entry.marker?.getLatLng?.();
        if (!latLng) return;

        const candidates = targetAreaId
          ? [[targetAreaId, polygonCoordinates.get(targetAreaId)]]
          : Array.from(polygonCoordinates.entries());

        const match = candidates.find(([, coordinates]) =>
          Array.isArray(coordinates) && coordinates.length >= 3
          && pointInPolygon(Number(latLng.lat), Number(latLng.lng), coordinates)
        );
        if (match) entry.areaId = match[0];
      });
    }

    function getAreaStyle(areaId) {
      const isSelected = selectedAreas.has(areaId);
      return {
        color: isSelected ? "#00d1ff" : "#4f6bff",
        weight: isSelected ? 3 : 1.5,
        fillColor: isSelected ? "#00d1ff" : "#4f6bff",
        fillOpacity: isSelected ? 0.35 : 0.18,
      };
    }

    function updateSelectedList() {
      if (!selectedEl) return;
      if (!selectedAreas.size) {
        selectedEl.textContent = "未選取（顯示全部點位、無行政區外框）";
        selectedEl.classList.add("selected-list-empty");
        return;
      }

      const names = districts
        .filter((district) => selectedAreas.has(district.areaId))
        .map((district) => district.areaName);
      selectedEl.textContent = names.join("、");
      selectedEl.classList.remove("selected-list-empty");
    }

    function syncCheckboxes() {
      groupEl.querySelectorAll(".district-checkbox").forEach((checkbox) => {
        checkbox.checked = selectedAreas.has(checkbox.dataset.areaId);
      });

      const allCheckbox = $("district-all");
      if (!allCheckbox) return;
      allCheckbox.checked = selectedAreas.size === districts.length;
      allCheckbox.indeterminate = selectedAreas.size > 0 && selectedAreas.size < districts.length;
    }

    function applyMarkerAreaFilter() {
      filterEntries.forEach((entry) => {
        const group = groups[entry.layerKey];
        if (!group || !entry.marker) return;
        const shouldShow = !selectedAreas.size || (entry.areaId && selectedAreas.has(entry.areaId));
        const exists = group.hasLayer(entry.marker);
        if (shouldShow && !exists) group.addLayer(entry.marker);
        if (!shouldShow && exists) group.removeLayer(entry.marker);
      });
    }

    function updateAreaVisibility() {
      areaLayers.forEach((layer, areaId) => {
        const shouldShow = selectionMode || selectedAreas.has(areaId);
        if (shouldShow && !map.hasLayer(layer)) layer.addTo(map);
        if (!shouldShow && map.hasLayer(layer)) map.removeLayer(layer);
        layer.setStyle(getAreaStyle(areaId));
      });
    }

    function refresh() {
      updateSelectedList();
      syncCheckboxes();
      applyMarkerAreaFilter();
      updateAreaVisibility();
    }

    function toggleAreaSelection(areaId) {
      if (selectedAreas.has(areaId)) selectedAreas.delete(areaId);
      else selectedAreas.add(areaId);
      refresh();
    }

    function setSelectionMode(enabled) {
      selectionMode = Boolean(enabled);
      updateAreaVisibility();
    }

    function loadDistrict({ url, areaId, areaName }) {
      fetch(url)
        .then((response) => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return response.json();
        })
        .then((rawCoordinates) => {
          if (!Array.isArray(rawCoordinates) || rawCoordinates.length < 3) {
            throw new Error("行政區座標格式不正確");
          }

          const coordinates = rawCoordinates
            .map((point) => [Number(point[0]), Number(point[1])])
            .filter((point) => Number.isFinite(point[0]) && Number.isFinite(point[1]));
          polygonCoordinates.set(areaId, coordinates);

          const polygon = L.polygon(coordinates, getAreaStyle(areaId));
          polygon.areaId = areaId;
          polygon.areaName = areaName;
          polygon.on("click", () => {
            if (selectionMode) toggleAreaSelection(areaId);
          });

          areaLayers.set(areaId, polygon);
          assignCoordinateAreas(areaId);
          applyMarkerAreaFilter();
          updateAreaVisibility();
        })
        .catch((error) => {
          console.error("載入行政區失敗：", areaName, error);
        });
    }

    function buildCheckboxList() {
      groupEl.innerHTML = "";

      const allLabel = document.createElement("label");
      allLabel.className = "checkbox-item checkbox-item--all";
      allLabel.htmlFor = "district-all";

      const allCheckbox = document.createElement("input");
      allCheckbox.type = "checkbox";
      allCheckbox.id = "district-all";

      const allSpan = document.createElement("span");
      allSpan.textContent = "全部勾選";
      allLabel.append(allCheckbox, allSpan);
      groupEl.appendChild(allLabel);

      districts.forEach((district) => {
        const label = document.createElement("label");
        label.className = "checkbox-item";
        label.htmlFor = `chk-${district.areaId}`;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `chk-${district.areaId}`;
        checkbox.className = "district-checkbox";
        checkbox.dataset.areaId = district.areaId;

        const span = document.createElement("span");
        span.textContent = district.areaName;
        label.append(checkbox, span);
        groupEl.appendChild(label);

        checkbox.addEventListener("change", () => toggleAreaSelection(district.areaId));
      });

      allCheckbox.addEventListener("change", () => {
        selectedAreas.clear();
        if (allCheckbox.checked) districts.forEach((district) => selectedAreas.add(district.areaId));
        refresh();
      });
      syncCheckboxes();
    }

    buildCheckboxList();
    districts.forEach(loadDistrict);
    refresh();

    clearBtn?.addEventListener("click", () => {
      selectedAreas.clear();
      refresh();
    });

    doneBtn?.addEventListener("click", () => {
      mapOptionsWrapper?.classList.remove("open");
      setSelectionMode(false);
    });

    districtHeader?.addEventListener("click", () => {
      setTimeout(() => setSelectionMode(Boolean(districtBody?.classList.contains("active"))), 0);
    });

    layerHeader?.addEventListener("click", () => {
      setTimeout(() => {
        if (!districtBody?.classList.contains("active")) setSelectionMode(false);
      }, 0);
    });

    mapOptionsTab?.addEventListener("click", () => {
      setTimeout(() => {
        if (!mapOptionsWrapper?.classList.contains("open")) setSelectionMode(false);
      }, 0);
    });

    document.querySelectorAll(".layer-toggle").forEach((toggle) => {
      toggle.addEventListener("change", () => setTimeout(applyMarkerAreaFilter, 0));
    });
  }

  function initMap(config) {
    appendVehicleLayerConfig(config);
    window.EIMPAnalysisSourceLayers = (config.layers || []).map((layer) => ({
      key: layer.key,
      label: layer.label,
      icon: layer.icon,
      items: layer.items || [],
    }));
    const mapEl = $("mapContainer");
    if (!mapEl || !window.L) return null;

    const map = L.map("mapContainer", { zoomControl: true }).setView(config.mapCenter || DEFAULT_CENTER, config.mapZoom || DEFAULT_ZOOM);
    window.EIMPMap = map;
    const openTopicPopups = new Set();

    function closeAllTopicPopups(exceptPopup = null) {
      Array.from(openTopicPopups).forEach((popup) => {
        if (popup !== exceptPopup) popup.remove();
      });
      if (!exceptPopup) openTopicPopups.clear();
    }

    function closeBusinessDetailOverlay() {
      const panel = $("businessDetailPanel");
      if (!panel?.classList.contains("is-open")) return;
      panel.classList.remove("is-open");
      panel.setAttribute("aria-hidden", "true");
    }

    map.on("popupopen", (event) => {
      if (!event.popup?.options?.keepBusinessDetailOpen) closeBusinessDetailOverlay();
      closeAllTopicPopups(event.popup);
      openTopicPopups.add(event.popup);
    });
    map.on("popupclose", (event) => openTopicPopups.delete(event.popup));
    map.on("click", () => {
      closeAllTopicPopups();
      closeBusinessDetailOverlay();
    });
    const baseVector = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap contributors",
    });
    const baseOrtho = L.tileLayer("https://wmts.nlsc.gov.tw/wmts/PHOTO2/default/EPSG:3857/{z}/{y}/{x}", {
      maxZoom: 19,
      attribution: "© 內政部國土測繪中心",
      crossOrigin: true,
    }).addTo(map);

    $("basemapSelect")?.addEventListener("change", (event) => {
      if (event.target.value === "vector") {
        if (map.hasLayer(baseOrtho)) map.removeLayer(baseOrtho);
        if (!map.hasLayer(baseVector)) baseVector.addTo(map);
      } else {
        if (map.hasLayer(baseVector)) map.removeLayer(baseVector);
        if (!map.hasLayer(baseOrtho)) baseOrtho.addTo(map);
      }
    });

    const groups = {};
    const markerIndex = new Map();
    const markerEntries = [];

    function getTopicMarkerOverlapPixelTolerance() {
      if (window.innerWidth <= 576) return 28;
      if (window.innerWidth <= 768) return 24;
      return 20;
    }

    function isTopicMarkerVisible(marker) {
      return marker && typeof map.hasLayer === "function" && map.hasLayer(marker);
    }

    function findNearbyNonVehicleMarkerEntries(latlng, pixelTolerance = getTopicMarkerOverlapPixelTolerance()) {
      if (!latlng) return [];
      const originPoint = map.latLngToContainerPoint(latlng);

      return markerEntries
        .filter((entry) => entry.layerKey !== "vehicle" && isTopicMarkerVisible(entry.marker) && entry.marker?.getLatLng)
        .map((entry) => {
          const markerPoint = map.latLngToContainerPoint(entry.marker.getLatLng());
          const dx = markerPoint.x - originPoint.x;
          const dy = markerPoint.y - originPoint.y;
          return { ...entry, distance: Math.hypot(dx, dy) };
        })
        .filter((entry) => entry.distance <= pixelTolerance)
        .sort((a, b) => a.distance - b.distance);
    }

    function activateTopicMarkerEntry(entry) {
      if (!entry?.marker) return;
      const targetLatLng = entry.marker.getLatLng();
      closeAllTopicPopups();
      map.setView(targetLatLng, map.getZoom(), { animate: false });

      if (typeof config.onMarkerClick === "function") {
        config.onMarkerClick({
          layerKey: entry.layerKey,
          layerConfig: entry.layerConfig,
          item: entry.item,
          marker: entry.marker,
          map,
          groups,
          markerIndex,
        });
      }

      if (entry.layerConfig?.disablePopup !== true) {
        entry.marker.openPopup();
      }
    }

    function openTopicMarkerChooser(latlng, entries) {
      closeBusinessDetailOverlay();
      closeAllTopicPopups();
      const content = entries.map((entry, index) => {
        const iconUrl = entry.item?.icon || entry.layerConfig?.icon || "images/marker.png";
        const itemLabel = entry.layerConfig?.overlapLabel || entry.layerConfig?.label || "圖層項目";
        return `<button type="button" class="overlap-picker-item" data-overlap-index="${index}"><img src="${escapeAttr(iconUrl)}" alt="" /><span>${escapeHtml(itemLabel)}</span></button>`;
      }).join("");

      L.popup({
        maxWidth: 320,
        minWidth: 200,
        className: "custom-overlap-popup",
        autoClose: false,
        closeOnClick: false,
        closeButton: true,
      })
        .setLatLng(latlng)
        .setContent(`<div class="overlap-picker">${content}</div>`)
        .openOn(map);

      setTimeout(() => {
        const container = document.querySelector(".custom-overlap-popup");
        if (!container) return;
        container.querySelectorAll("[data-overlap-index]").forEach((button) => {
          button.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            const target = entries[Number(button.dataset.overlapIndex)];
            if (target) activateTopicMarkerEntry(target);
          });
        });
      }, 0);
    }

    function delegateVehicleClickToUnderlyingLayer(marker, event) {
      if (event?.originalEvent && window.L?.DomEvent) {
        L.DomEvent.stop(event.originalEvent);
      }

      if (typeof config.onVehicleMarkerClick === "function") {
        const handled = config.onVehicleMarkerClick({ marker, map, groups, markerIndex, markerEntries });
        if (handled === true) return true;
      }

      const nearbyEntries = findNearbyNonVehicleMarkerEntries(marker.getLatLng());
      if (!nearbyEntries.length) return false;
      activateTopicMarkerEntry(nearbyEntries[0]);
      return true;
    }

    function isAbnormalCameraItem(item) {
      const abnormalValue = safeText(item.isAbnormal ?? item.abnormal ?? item.status, "").trim();
      return item.isAbnormal === true || abnormalValue === "是" || abnormalValue === "異常" || abnormalValue.toLowerCase() === "true";
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
      const sourceItem = (config.layers || [])
        .filter((layer) => layer.key === "regBusiness" || layer.key === "nonRegBusiness")
        .flatMap((layer) => layer.items || [])
        .find((entry) => (
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

    function buildBusinessCasePopup(item, layerKey) {
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

      const gridHtml = rows.map(([key, value]) => {
        const isMultiline = key === "實際廠(場)址" || key === "事業名稱";
        return `<div class="case-popup__k">${escapeHtml(key)}</div><div class="case-popup__v ${isMultiline ? "case-popup__v--multiline" : ""}">${escapeHtml(value)}</div>`;
      }).join("");

      const permits = getBusinessPermitAvailability(item);
      const detailLink = permits.hasWater || permits.hasToxic || permits.hasCEMS || permits.hasCWMS
        ? `<div class="case-popup__link-row"><button type="button" class="popup-plain-text-btn business-detail-trigger" data-item-type="${escapeAttr(layerKey)}" data-item-id="${escapeAttr(item.id)}">事業詳細資料</button></div>`
        : "";
      const favoriteButton = getBusinessFavoriteButtonHtml(item, layerKey);

      return `<div class="case-popup">${favoriteButton}<div class="case-popup__body"><div class="case-popup__grid">${gridHtml}</div></div>${detailLink}</div>`;
    }

    function buildLayerPopup(layerConfig, item) {
      const videoUrl = safeText(item.videoUrl, "").trim();
      const resultUrl = safeText(item.resultImageUrl || item.resultUrl || item.recognitionUrl, "").trim();
      const title = escapeHtml(item.title || item.businessName || item.name || item.address || layerConfig.label);
      const popupRows = (layerConfig.popupFields || []).map((field) =>
        `<div class="topic-popup-row"><span>${escapeHtml(field.label)}</span><b>${escapeHtml(item[field.key])}</b></div>`
      ).join("");
      const videoHtml = videoUrl
        ? `<div class="topic-popup-video-section"><iframe class="topic-popup-video" src="${escapeAttr(videoUrl)}" loading="lazy" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`
        : "";

      if (layerConfig.key === "regBusiness" || layerConfig.key === "nonRegBusiness") {
        return buildBusinessCasePopup(item, layerConfig.key);
      }

      if (layerConfig.key === "camera") {
        const resultHtml = isAbnormalCameraItem(item) && resultUrl
          ? `<div class="topic-popup-row topic-popup-result-row"><span>辨識結果：</span><b><a class="topic-popup-result-link" href="${escapeAttr(resultUrl)}" target="_blank" rel="noopener noreferrer">另開視窗</a></b></div>`
          : "";

        return `<div class="topic-popup topic-popup-camera${videoUrl ? " topic-popup--media" : ""}">${videoHtml}${popupRows}${resultHtml}</div>`;
      }

      return `<div class="topic-popup${videoUrl ? " topic-popup--media" : ""}"><div class="topic-popup-title">${title}</div>${videoHtml}${popupRows}</div>`;
    }

    window.EIMPBusinessPopupBridge = {
      ...(window.EIMPBusinessPopupBridge || {}),
      buildPopupContent(item, type) {
        return buildBusinessCasePopup(resolveBusinessItem(item), type);
      },
      resolveItem: resolveBusinessItem,
    };

    window.EIMPAnalysisPopupBridge = {
      buildPopupContent(item, layerKey) {
        const layerConfig = (config.layers || []).find((layer) => layer.key === layerKey);
        return layerConfig ? buildLayerPopup(layerConfig, item) : null;
      },
      getMarkerIcon(item, layerKey) {
        const layerConfig = (config.layers || []).find((layer) => layer.key === layerKey);
        return layerConfig ? createMarkerIcon(item, layerConfig) : null;
      },
      getPopupOptions(item, layerKey) {
        if (layerKey === "regBusiness" || layerKey === "nonRegBusiness") {
          return { maxWidth: 360, minWidth: 260, className: "custom-case-popup", closeButton: true, autoClose: false, closeOnClick: false };
        }
        return item.videoUrl ? { maxWidth: 360, minWidth: 220 } : { closeButton: true, autoClose: false, closeOnClick: false };
      },
      beforeOpen() {
        closeAllTopicPopups();
      },
    };

    (config.layers || []).forEach((layerConfig) => {
      const group = L.layerGroup();
      groups[layerConfig.key] = group;

      (layerConfig.items || []).forEach((item) => {
        if (!Number.isFinite(Number(item.lat)) || !Number.isFinite(Number(item.lng))) return;
        const icon = createMarkerIcon(item, layerConfig);
        const marker = L.marker([Number(item.lat), Number(item.lng)], {
          icon,
          zIndexOffset: layerConfig.key === "vehicle" ? 5000 : 0,
        });
        const markerEntry = { marker, item, layerConfig, layerKey: layerConfig.key };
        if (layerConfig.key === "vehicle") {
          bindVehiclePlateLabel(marker, item);
        } else if (layerConfig.disablePopup !== true) {
          const popupOptions = (layerConfig.key === "regBusiness" || layerConfig.key === "nonRegBusiness")
            ? { maxWidth: 360, minWidth: 260, className: "custom-case-popup", closeButton: true, autoClose: false, closeOnClick: false }
            : (item.videoUrl ? { maxWidth: 360, minWidth: 220 } : undefined);
          marker.bindPopup(buildLayerPopup(layerConfig, item), popupOptions);
        }
        if (layerConfig.key === "vehicle") {
          marker.on("click", (event) => {
            if (!delegateVehicleClickToUnderlyingLayer(marker, event)) marker.openTooltip();
          });
        } else {
          marker.off("click");
          marker.on("click", (event) => {
            if (event?.originalEvent && window.L?.DomEvent) {
              L.DomEvent.stop(event.originalEvent);
            }
            const nearbyEntries = findNearbyNonVehicleMarkerEntries(marker.getLatLng());
            openTopicMarkerChooser(marker.getLatLng(), nearbyEntries.length ? nearbyEntries : [markerEntry]);
          });
        }
        marker.addTo(group);
        markerIndex.set(item.id, marker);
        markerEntries.push(markerEntry);
      });

      const enabled = layerConfig.defaultVisible !== false;
      if (enabled) group.addTo(map);
    });

    document.querySelectorAll(".layer-toggle").forEach((toggle) => {
      const key = toggle.dataset.layer;
      const group = groups[key];
      if (!group) return;
      toggle.checked = map.hasLayer(group);
      toggle.addEventListener("change", () => {
        closeBusinessDetailOverlay();
        closeAllTopicPopups();
        if (toggle.checked) group.addTo(map);
        else map.removeLayer(group);
      });
    });

    function applyVehicleLayerPermission() {
      const group = groups.vehicle;
      const toggle = document.querySelector('.layer-toggle[data-layer="vehicle"]');
      const row = toggle?.closest(".vehicle-layer-row") || document.querySelector('[data-supervisor-only-layer="vehicle"]');
      if (!group || !toggle || !row) return;
      const allowed = canCurrentUserSeeVehicleLayer();
      row.hidden = !allowed;
      toggle.disabled = !allowed;
      if (!allowed) {
        toggle.checked = false;
        if (map.hasLayer(group)) map.removeLayer(group);
        return;
      }
      if (!map.hasLayer(group)) group.addTo(map);
      toggle.checked = true;
    }

    applyVehicleLayerPermission();
    window.addEventListener("eimp:account-changed", applyVehicleLayerPermission);

    initDistrictFilter({ map, groups, markerEntries });

    const allCaseItems = new Map();
    (config.caseLists || []).forEach((listConfig) => {
      (listConfig.items || []).forEach((item) => allCaseItems.set(item.id, item));
      renderCaseList(listConfig.containerId, listConfig.items || [], listConfig, (item, row) => {
        document.querySelectorAll(".case-row.active").forEach((el) => el.classList.remove("active"));
        row.classList.add("active");
        const marker = markerIndex.get(item.id);
        if (marker) {
          closeAllTopicPopups();
          const latLng = marker.getLatLng();
          if (config.caseListPanOnly) {
            map.panTo(latLng);
          } else {
            map.setView(latLng, 15);
          }
          marker.openPopup();
        }
      });
    });



    function initBusinessDetailPanel(config) {
      const businessDetailPanel = $("businessDetailPanel");
      if (!businessDetailPanel || businessDetailPanel.dataset.eimpBusinessReady === "true") return;
      businessDetailPanel.dataset.eimpBusinessReady = "true";

      const businessDetailCloseBtn = $("businessDetailCloseBtn");
      const businessPermitTypeSelect = $("businessPermitTypeSelect");
      const businessWaterAccordion = $("businessWaterAccordion");
      const businessWaterTemplateGeneral = $("businessWaterTemplateGeneral");
      const businessWaterTemplateLivestock = $("businessWaterTemplateLivestock");
      const businessWaterTemplateCommunity = $("businessWaterTemplateCommunity");
      const businessToxicAccordion = $("businessToxicAccordion");
      const businessCEMSAccordion = $("businessCEMSAccordion");
      const businessCWMSAccordion = $("businessCWMSAccordion");
      let currentBusinessDetailItem = null;

      const businessPermitBody = businessDetailPanel.querySelector(".permit-body");
      [businessToxicAccordion, businessCEMSAccordion, businessCWMSAccordion].forEach((panel) => {
        if (panel && businessPermitBody && panel.parentElement !== businessPermitBody) {
          businessPermitBody.appendChild(panel);
        }
      });

      const businessItems = [];
      (config.layers || []).forEach((layer) => {
        if (layer.key === "regBusiness" || layer.key === "nonRegBusiness") {
          (layer.items || []).forEach((item) => businessItems.push(item));
        }
      });

      const setBusinessText = (field, value) => {
        window.EIMPUI.setField(field, value, businessDetailPanel);
      };

      const switchBusinessAccordion = (type) => {
        [businessWaterAccordion, businessToxicAccordion, businessCEMSAccordion, businessCWMSAccordion].forEach((panel) => panel?.classList.add("hidden"));
        if (type === "water") businessWaterAccordion?.classList.remove("hidden");
        if (type === "toxic") businessToxicAccordion?.classList.remove("hidden");
        if (type === "CEMS") businessCEMSAccordion?.classList.remove("hidden");
        if (type === "CWMS") businessCWMSAccordion?.classList.remove("hidden");
      };

      const configureBusinessPermitTypes = (item) => {
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
      };

      const inferWaterBusinessLayoutType = (item) => {
        const text = `${item.businessName || ""} ${item.businessCategory || ""} ${item.industryName || ""}`;
        if (/畜牧|牧場/.test(text)) return "livestock";
        if (/社區|大樓|住宅|公寓|集合住宅/.test(text)) return "community";
        return "general";
      };

      const getWaterBusinessTemplate = (type) => {
        if (type === "livestock") return businessWaterTemplateLivestock;
        if (type === "community") return businessWaterTemplateCommunity;
        return businessWaterTemplateGeneral;
      };

      const renderWaterBusinessLayout = (item) => {
        if (!businessWaterAccordion) return;
        const template = getWaterBusinessTemplate(inferWaterBusinessLayoutType(item));
        businessWaterAccordion.innerHTML = template ? template.innerHTML : "";
        window.EIMPBusinessWaterQuality?.render?.(businessWaterAccordion, item);
      };

      const renderBusinessCems = (key) => {
        setBusinessText("businessCemsPollutantName", key || "SOx");
        setBusinessText("businessCemsStandardValue", key === "NOx" ? "180" : key === "PM" ? "30" : "80");
        const stackList = $("businessCemsStackList");
        if (stackList) {
          stackList.innerHTML = `
            <div class="cems-stack-row"><div class="cems-stack-tag tag-green">P001</div><div class="cems-stack-info"><div class="cems-stack-title">監測值 <span class="cems-stack-value">58</span> <span class="cems-stack-unit">ppm</span></div><div class="cems-stack-text">主要排放煙道即時監測資料</div></div></div>
            <div class="cems-stack-row"><div class="cems-stack-tag tag-gray">P002</div><div class="cems-stack-info"><div class="cems-stack-title">監測值 <span class="cems-stack-value">--</span></div><div class="cems-stack-text">設備維護中</div></div></div>`;
        }
      };

      const renderBusinessCwms = (key) => {
        setBusinessText("businessCwmsPollutantName", key || "PH");
        setBusinessText("businessCwmsStandardValue", key === "COD" ? "160" : key === "SS" ? "30" : "6-9");
        setBusinessText("businessCwmsUnit", key === "PH" ? "" : "mg/L");
        const stackList = $("businessCwmsStackList");
        if (stackList) {
          stackList.innerHTML = `
            <div class="cems-stack-row"><div class="cems-stack-tag tag-green">W001</div><div class="cems-stack-info"><div class="cems-stack-title">監測值 <span class="cems-stack-value">7.1</span></div><div class="cems-stack-text">放流水監測井即時資料</div></div></div>
            <div class="cems-stack-row"><div class="cems-stack-tag tag-green">W002</div><div class="cems-stack-info"><div class="cems-stack-title">監測值 <span class="cems-stack-value">132</span> <span class="cems-stack-unit">mg/L</span></div><div class="cems-stack-text">處理設施出口即時資料</div></div></div>`;
        }
      };

      const populateBusinessDetail = (item) => {
        if (!item) return;
        const waterPermitNo = item.waterpermitNo || item.waterPermitNo || "水許可字第000000號";
        const toxicPermitNo = item.toxicpermitNo || item.toxicPermitNo || "毒許字第000000號";
        const unifiedNo = item.unifiedNo || item.taxId || "-";
        const outletLat = item.outletLat ?? item.lat;
        const outletLng = item.outletLng ?? item.lng;
        const permitTime = item.permittime || item.permitTime || "112/01/01";

        setBusinessText("businessDetailTitle", item.businessName || "列管事業詳細資料");
        setBusinessText("businessName", item.businessName || "-");
        setBusinessText("businessLabel", item.businesslabel || item.businessCategory || item.industryName || "-");
        setBusinessText("otherBusinessName", item.otherbusinessName || item.businessName || "-");
        setBusinessText("leaderName", item.leadername || item.ownerName || "-");
        setBusinessText("waterPermitNo", waterPermitNo);
        setBusinessText("waterPermitNo2", waterPermitNo);
        setBusinessText("toxicPermitNo", toxicPermitNo);
        setBusinessText("permitTime", permitTime);
        setBusinessText("toxicPermitTime", item.toxicpermittime || permitTime);
        setBusinessText("stockNo", item.stockno || "-");
        setBusinessText("applyTime", item.applytime || permitTime);
        setBusinessText("applyCount", item.applycount || "1");
        setBusinessText("permitCount", item.permitcount || "1");
        setBusinessText("manageName", item.managename || item.businessName || "-");
        setBusinessText("manageTel", item.managetel || "-");
        setBusinessText("controlNo", item.controlNo || "-");
        setBusinessText("controlNo2", item.controlNo || "-");
        setBusinessText("otherControlNo", item.othercontrolNo || item.controlNo || "-");
        setBusinessText("unifiedNo", unifiedNo);
        setBusinessText("unifiedNo2", unifiedNo);
        setBusinessText("address", item.address || "-");
        setBusinessText("address2", item.address || "-");
        setBusinessText("manageAddress", item.manageaddress || item.address || "-");
        setBusinessText("industrialPark", item.industrialParkName || "-");
        setBusinessText("industryName", item.industryName || "-");
        setBusinessText("regulatedType", item.regulatedType || "-");
        setBusinessText("inspectManageNo", item.inspectManageNo || unifiedNo);
        setBusinessText("tempManageNo", item.tempManageNo || "-");
        setBusinessText("factoryLicenseNo", item.factoryLicenseNo || "-");
        setBusinessText("lat", item.lat != null ? Number(item.lat).toFixed(6) : "-");
        setBusinessText("lng", item.lng != null ? Number(item.lng).toFixed(6) : "-");

        setBusinessText("waterBusinessName", item.businessName || "-");
        setBusinessText("waterControlNo", item.controlNo || "-");
        setBusinessText("waterAddress", item.address || "-");
        setBusinessText("waterRegType", item.regulatedType || "-");
        setBusinessText("landNo", item.landNo || "-");
        setBusinessText("gateTwdX", item.gateTwdX || "-");
        setBusinessText("gateTwdY", item.gateTwdY || "-");
        setBusinessText("outletCode", item.outletCode || "D01");
        setBusinessText("outletCodeWgs", item.outletCode || "D01");
        setBusinessText("outletTwdX", item.outletTwdX || item.coordX || "-");
        setBusinessText("outletTwdY", item.outletTwdY || item.coordY || "-");
        setBusinessText("outletLat", outletLat != null ? Number(outletLat).toFixed(6) : "-");
        setBusinessText("outletLng", outletLng != null ? Number(outletLng).toFixed(6) : "-");
        setBusinessText("businessCategory", item.businessCategory || item.businesstype || "-");
        setBusinessText("waterApplyType", item.waterApplyType || "簡易排放許可文件");
        setBusinessText("waterOutletCode", item.outletCode || "D01");
        setBusinessText("waterApprovedFlow", item.waterApprovedFlow || "24.000");
        setBusinessText("detailotherLincenseNo", item.otherLincenseNo || "-");

        setBusinessText("toxicBusinessName", item.businessName || "-");
        setBusinessText("toxicControlNo", item.controlNo || "-");
        setBusinessText("toxicUnifiedNo", unifiedNo);
        setBusinessText("toxicAddress", item.address || "-");
        setBusinessText("toxicIndustryName", item.industryName || "-");
        setBusinessText("toxicRegulatedType", item.regulatedType || "-");
        setBusinessText("toxicOperatorName", item.businessName || "-");
        setBusinessText("toxicInspectManageNo", item.inspectManageNo || "-");
        setBusinessText("toxicTempManageNo", item.tempManageNo || "-");
        setBusinessText("toxicChemicalNo", item.toxicChemicalNo || "098-01");
        setBusinessText("toxicChemicalName", item.toxicChemicalName || "二甲基甲醯胺");
        setBusinessText("toxicFactoryLicenseNo", item.factoryLicenseNo || "-");
        setBusinessText("toxicIndustrialPark", item.industrialParkName || "-");
      };

      const openBusinessDetailPanel = (item, requestedType = null) => {
        if (!item) return;
        item = resolveBusinessItem(item);
        const permits = configureBusinessPermitTypes(item);
        if (!permits.hasWater && !permits.hasToxic && !permits.hasCEMS && !permits.hasCWMS) return;
        closeAllTopicPopups();
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
      };

      window.EIMPBusinessPopupBridge = {
        ...(window.EIMPBusinessPopupBridge || {}),
        openDetail: openBusinessDetailPanel,
      };

      const closeBusinessDetailPanel = () => {
        businessDetailPanel.classList.remove("is-open");
        businessDetailPanel.setAttribute("aria-hidden", "true");
        currentBusinessDetailItem = null;
      };

      businessPermitTypeSelect?.addEventListener("change", function () {
        if (this.value === "water" && currentBusinessDetailItem) {
          renderWaterBusinessLayout(currentBusinessDetailItem);
          populateBusinessDetail(currentBusinessDetailItem);
        }
        switchBusinessAccordion(this.value);
      });
      businessDetailCloseBtn?.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        closeBusinessDetailPanel();
      });

      businessDetailPanel.addEventListener("click", (event) => {
        const accordionHeader = event.target.closest(".accordion-header");
        if (accordionHeader) {
          const accordionItem = accordionHeader.closest(".accordion-item");
          const accordionWrapper = accordionHeader.closest(".accordion-wrapper");
          if (accordionItem && accordionWrapper) {
            const items = accordionWrapper.querySelectorAll(".accordion-item");
            const isActive = accordionItem.classList.contains("active");
            items.forEach((item) => item.classList.remove("active"));
            if (!isActive) accordionItem.classList.add("active");
          }
          return;
        }
        const cemsBtn = event.target.closest(".business-cems-btn");
        if (cemsBtn) {
          businessDetailPanel.querySelectorAll(".business-cems-btn").forEach((btn) => btn.classList.remove("active"));
          cemsBtn.classList.add("active");
          renderBusinessCems(cemsBtn.dataset.key);
          return;
        }
        const cwmsBtn = event.target.closest(".business-cwms-btn");
        if (cwmsBtn) {
          businessDetailPanel.querySelectorAll(".business-cwms-btn").forEach((btn) => btn.classList.remove("active"));
          cwmsBtn.classList.add("active");
          renderBusinessCwms(cwmsBtn.dataset.key);
        }
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeBusinessDetailPanel();
      });

      document.addEventListener("click", (event) => {
        const eventTarget = event.target instanceof Element ? event.target : event.target?.parentElement;
        const trigger = eventTarget?.closest(".business-detail-trigger");
        if (!trigger) return;
        event.preventDefault();
        event.stopPropagation();
        const item = businessItems.find((entry) => String(entry.id) === String(trigger.dataset.itemId));
        if (item) openBusinessDetailPanel(item);
      }, true);
    }

    initBusinessDetailPanel(config || {});

    if (typeof config.onMapReady === "function") {
      config.onMapReady({ map, groups, markerIndex });
    }

    initQuickLocate(map);
    setTimeout(() => map.invalidateSize(), 100);
    return map;
  }

  function initFixedClock() {
    const clock = $("simNowTime");
    if (!clock) return;
    const pad2 = (value) => String(value).padStart(2, "0");
    const update = () => {
      const now = new Date();
      clock.textContent = `${now.getFullYear()}/${pad2(now.getMonth() + 1)}/${pad2(now.getDate())}  ${pad2(now.getHours())}:${pad2(now.getMinutes())}`;
    };
    update();
    window.setInterval(update, 30 * 1000);
  }

  function initTopicPage(config) {
    document.addEventListener("DOMContentLoaded", () => {
      bindSharedBusinessFavoriteHandler();
      initFixedClock();
      initDrawer();
      initProfileDrawer();
      initDecisionMenuAccess();
      initSharedAccountManagement();
      guardDecisionPage();
      initAccordionHeaders();
      initSlidePanels();
      const map = initMap(config || {});
      initStationButtons(config || {}, map);
    });
  }

  window.EIMPBusinessFavorites = {
    isFavorite(item, type) {
      return loadBusinessFavorites().has(buildBusinessFavoriteKey(type, item?.id));
    },
    toggle(item, type) {
      const favorites = loadBusinessFavorites();
      const key = buildBusinessFavoriteKey(type, item?.id);
      if (favorites.has(key)) favorites.delete(key);
      else favorites.add(key);
      saveBusinessFavorites(favorites);
      return favorites.has(key);
    },
    buttonHtml: getBusinessFavoriteButtonHtml,
  };

  window.EIMPTopic = { initTopicPage };
})();
