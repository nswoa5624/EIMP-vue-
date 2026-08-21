(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const accounts = {
    hqDirector: {
      key: "hqDirector",
      account: "HQleader",
      company: "科本部",
      name: "陳OO",
      jobTitle: "科本部長官",
      phone: "(02)2953-2101",
      email: "hq-director@ntpc.gov.tw",
      canManageAccounts: true,
      canChangeAccountStatus: true,
      canDownloadLogs: true,
      canSetPermissions: true,
      canUseDecision: true,
      isSupervisor: true,
      managedAccountId: 1,
      preserveSystemPermissions: true,
      requiresAssignedPermissions: true,
    },
    hqOfficer: {
      key: "hqOfficer",
      account: "HQhost",
      company: "科本部",
      name: "林OO",
      jobTitle: "承辦人",
      phone: "12345678",
      email: "NTPCEPD@ntpc.gov.tw",
      canManageAccounts: true,
      canChangeAccountStatus: true,
      canDownloadLogs: true,
      canSetPermissions: true,
      canUseDecision: true,
      isSupervisor: true,
      managedAccountId: 2,
      preserveSystemPermissions: true,
      fixedFullPermissions: true,
    },
    squadLeader: {
      key: "squadLeader", account: "SQleader", company: "第一稽查分隊", name: "張OO", jobTitle: "分隊長",
      phone: "(02)2953-2113", email: "squad-leader@ntpc.gov.tw", canManageAccounts: false, canChangeAccountStatus: false,
      canUseDecision: false, isSupervisor: true, managedAccountId: 3,
    },
    squadMember: {
      key: "squadMember", account: "SQmem", company: "第一稽查分隊", name: "李OO", jobTitle: "分隊員",
      phone: "(02)2953-2114", email: "squad-member@ntpc.gov.tw", canManageAccounts: false, canChangeAccountStatus: false,
      canUseDecision: false, isSupervisor: false, managedAccountId: 4,
    },
    squadSpecialist: {
      key: "squadSpecialist", account: "SQSub", company: "第一稽查分隊", name: "吳OO", jobTitle: "專員",
      phone: "(02)2953-2115", email: "squad-specialist@ntpc.gov.tw", canManageAccounts: false, canChangeAccountStatus: false,
      canUseDecision: false, isSupervisor: false, managedAccountId: 5,
    },
    waterConservation: {
      key: "waterConservation", account: "Water", company: "水保科", name: "黃OO", jobTitle: "承辦人",
      phone: "(02)2953-2116", email: "water-conservation@ntpc.gov.tw", canManageAccounts: false, canChangeAccountStatus: false,
      canUseDecision: false, isSupervisor: false, managedAccountId: 6,
    },
    zhongheCleaner: {
      key: "zhongheCleaner",
      account: "Cleaner",
      company: "中和區清潔隊",
      name: "王OO",
      jobTitle: "清潔隊員",
      phone: "12345678",
      email: "zhonghe@clean.gov.tw",
      canManageAccounts: false,
      canChangeAccountStatus: false,
      canUseDecision: false,
      isSupervisor: false,
      managedAccountId: 7,
    },
    contractor: {
      key: "contractor", account: "Eritest", company: "委辦廠商", name: "廠商OO", jobTitle: "專案人員",
      phone: "(02)2361-1999", email: "vendor@example.com", canManageAccounts: false, canChangeAccountStatus: false,
      canUseDecision: false, isSupervisor: false, managedAccountId: 8,
    },
  };

  const accountIdentityOrder = ["hqDirector", "hqOfficer", "squadLeader", "squadMember", "squadSpecialist", "waterConservation", "zhongheCleaner", "contractor"];
  const accountIdentityLabels = {
    hqDirector: "科本部長官",
    hqOfficer: "科本部承辦（林OO）",
    squadLeader: "稽查分隊長",
    squadMember: "稽查分隊員",
    squadSpecialist: "稽查分隊專員",
    waterConservation: "水保科",
    zhongheCleaner: "清潔隊（王OO）",
    contractor: "委辦廠商",
  };

  const accountUnits = [
    "科本部",
    "第一稽查分隊",
    "第二稽查分隊",
    "第三稽查分隊",
    "第四稽查分隊",
    "第五稽查分隊",
    "第六稽查分隊",
    "第七稽查分隊",
    "水保科",
    "中和區清潔隊",
    "委辦廠商",
  ];
  const viewDistricts = [
    ["Sanxia", "三峽區"], ["Sanzhi", "三芝區"], ["Sanchong", "三重區"], ["Zhonghe", "中和區"],
    ["Wugu", "五股區"], ["Bali", "八里區"], ["Tucheng", "土城區"], ["Pinglin", "坪林區"],
    ["Pingxi", "平溪區"], ["Xindian", "新店區"], ["Xinzhuang", "新莊區"], ["Banqiao", "板橋區"],
    ["Linkou", "林口區"], ["Shulin", "樹林區"], ["Yonghe", "永和區"], ["Xizhi", "汐止區"],
    ["Taishan", "泰山區"], ["Tamsui", "淡水區"], ["Shenkeng", "深坑區"], ["Wulai", "烏來區"],
    ["Ruifang", "瑞芳區"], ["Shiding", "石碇區"], ["Shimen", "石門區"], ["Wanli", "萬里區"],
    ["Luzhou", "蘆洲區"], ["Gongliao", "貢寮區"], ["Jinshan", "金山區"], ["Shuangxi", "雙溪區"],
    ["Yingge", "鶯歌區"],
  ];
  const viewLayers = [
    ["air:airSensor", "空氣｜空品感測器"], ["air:airPollution", "空氣｜空氣污染陳情"], ["air:fireReport", "空氣｜火災報案"],
    ["air:construction", "空氣｜營建工程"], ["air:nonRegBusiness", "空氣｜非列管事業"], ["air:regBusiness", "空氣｜列管事業"],
    ["air:vehicle", "空氣｜稽查車輛"], ["air:favorites", "空氣｜已儲存圖標"], ["air:windField", "空氣｜風場模擬"],
    ["water:riverWaterStation", "水質｜河川水質測站"], ["water:rainpipe", "水質｜雨水系統"], ["water:dirtpipe", "水質｜污水系統"],
    ["water:airPollution", "水質｜水污染陳情"], ["water:camera", "水質｜即時影像"], ["water:favorites", "水質｜已儲存圖標"],
    ["water:nonRegBusiness", "水質｜非列管事業"], ["water:regBusiness", "水質｜列管事業"], ["water:vehicle", "水質｜車輛"],
    ["waste:illegalDumping", "廢棄物｜非法棄置點資料"], ["waste:nonRegBusiness", "廢棄物｜非列管事業"], ["waste:regBusiness", "廢棄物｜列管事業"],
    ["waste:vehicle", "廢棄物｜車輛"], ["waste:camera", "廢棄物｜即時影像"], ["waste:cameraNtpcRoad", "廢棄物｜稽查科（路）影像"],
    ["waste:cameraNtpcWater", "廢棄物｜稽查科（水）影像"], ["waste:cameraNtpcCleanup", "廢棄物｜清維科影像"],
    ["waste:cameraNtpcAir", "廢棄物｜空品科影像"], ["waste:cameraMoeaWra", "廢棄物｜水利署影像"],
    ["waste:cameraMotcThb", "廢棄物｜公路局影像"], ["waste:cameraMotcFreeway", "廢棄物｜高速公路局影像"],
    ["noise:airSensor", "噪音｜空品感測器"], ["noise:airPollution", "噪音｜噪音陳情"], ["noise:fireReport", "噪音｜異味陳情"],
    ["noise:construction", "噪音｜營建工程"], ["noise:nonRegBusiness", "噪音｜即時影像"], ["noise:regBusiness", "噪音｜列管事業"],
    ["noise:vehicle", "噪音｜車輛"], ["noise:windField", "噪音｜聲音熱區"],
  ];
  const viewLayerTopics = [
    ["air", "空"],
    ["water", "水"],
    ["waste", "廢"],
    ["noise", "噪"],
  ];
  const hqOfficerPermissionId = "built-in-hq-officer";
  const hqOfficerPermissionFeature = {
    label: "承辦權限",
    permissions: ["account-view", "log-download", "permission-settings", "account-status"],
    allowedUnits: [...accountUnits],
    enabled: true,
  };

  const additionalAccountGroups = [
    { code: "S2", unit: "第二稽查分隊", names: ["陳OO", "黃OO", "張OO"], jobs: ["分隊長", "稽查員", "稽查員"] },
    { code: "S3", unit: "第三稽查分隊", names: ["李OO", "吳OO", "許OO"], jobs: ["分隊長", "稽查員", "稽查員"] },
    { code: "S4", unit: "第四稽查分隊", names: ["周OO", "鄭OO", "蔡OO"], jobs: ["分隊長", "稽查員", "稽查員"] },
    { code: "S5", unit: "第五稽查分隊", names: ["楊OO", "郭OO", "何OO"], jobs: ["分隊長", "稽查員", "稽查員"] },
    { code: "S6", unit: "第六稽查分隊", names: ["羅OO", "宋OO", "謝OO"], jobs: ["分隊長", "稽查員", "稽查員"] },
    { code: "S7", unit: "第七稽查分隊", names: ["唐OO", "潘OO", "曾OO"], jobs: ["分隊長", "稽查員", "稽查員"] },
    { code: "HQ", unit: "科本部", names: ["趙OO", "林XX", "蘇OO"], jobs: ["科長", "技士", "約僱人員"] },
  ];

  const managedAccounts = [
    ...Array.from({ length: 8 }, (_, index) => {
    const number = index + 1;
    const identity = accounts[accountIdentityOrder[index]];
    return {
      id: number,
      account: identity.account,
      unit: identity.company,
      name: identity.name,
      jobTitle: identity.jobTitle,
      phone: identity.phone,
      email: identity.email,
      enabled: true,
      accountFeatures: {},
      viewFeatures: {},
      selectedAccountFeature: "",
      selectedViewFeature: "",
      loginLogs: [
        { time: `2026-03-24 08:${String(10 + number).padStart(2, "0")}:21`, ip: `10.10.1.${20 + number}`, result: "登入成功" },
        { time: `2026-03-23 13:${String(40 + number).padStart(2, "0")}:06`, ip: `10.10.1.${20 + number}`, result: "登入成功" },
      ],
    };
    }),
    ...additionalAccountGroups.flatMap((group, groupIndex) => group.names.map((name, accountIndex) => {
      const id = 9 + groupIndex * 3 + accountIndex;
      const sequence = String(accountIndex + 1).padStart(2, "0");
      return {
        id,
        account: `${group.code}-${sequence}`,
        unit: group.unit,
        name,
        jobTitle: group.jobs[accountIndex],
        phone: `(02)2953-${2200 + id}`,
        email: `${group.code.toLowerCase()}${sequence}@ntpc.gov.tw`,
        enabled: accountIndex !== 2,
        accountFeatures: {},
        viewFeatures: {},
        selectedAccountFeature: "",
        selectedViewFeature: "",
        loginLogs: [
          { time: `2026-03-24 09:${String(10 + id).padStart(2, "0")}:12`, ip: `10.10.${groupIndex + 2}.${30 + accountIndex}`, result: "登入成功" },
          { time: `2026-03-22 16:${String(20 + accountIndex).padStart(2, "0")}:35`, ip: `10.10.${groupIndex + 2}.${30 + accountIndex}`, result: accountIndex === 2 ? "帳號停用" : "登入成功" },
        ],
      };
    })),
  ];

  const managedAccountStorageKey = "eimp-managed-accounts";
  try {
    const savedAccounts = JSON.parse(localStorage.getItem(managedAccountStorageKey) || "[]");
    savedAccounts.forEach((saved) => {
      const target = managedAccounts.find((item) => item.id === saved.id);
      if (!target) return;
      ["unit", "name", "jobTitle", "phone", "email", "enabled", "accountFeatures", "viewFeatures", "selectedAccountFeature", "selectedViewFeature"].forEach((key) => {
        if (target.id <= 8 && ["unit", "name", "jobTitle", "phone", "email"].includes(key)) return;
        if (Object.prototype.hasOwnProperty.call(saved, key)) target[key] = saved[key];
      });
    });
  } catch (error) {
    console.warn("無法讀取帳號管理暫存資料", error);
  }

  managedAccounts.forEach((item) => {
    Object.values(item.accountFeatures || {}).forEach((feature) => {
      if (!feature) return;
      if (!feature.ownerAccount) feature.ownerAccount = accounts.hqOfficer.account;
      if (Array.isArray(feature.permissions) && feature.permissions.includes("account-management")) {
        feature.permissions = [...new Set(feature.permissions.map((permission) => permission === "account-management" ? "account-view" : permission))];
      }
    });
    Object.values(item.viewFeatures || {}).forEach((feature) => {
      if (feature && !feature.ownerAccount) feature.ownerAccount = accounts.hqOfficer.account;
    });
  });

  const currentAccountStorageKey = "eimp-current-simulated-account";
  let currentAccountKey = "hqOfficer";
  try {
    const savedAccountKey = localStorage.getItem(currentAccountStorageKey);
    if (savedAccountKey && accounts[savedAccountKey]) currentAccountKey = savedAccountKey;
  } catch (error) {
    console.warn("無法讀取模擬帳號暫存資料", error);
  }
  let currentManagedAccountId = null;
  let accountFeatureDraft = {};
  let editingAccountFeatureId = null;
  let viewFeatureDraft = {};
  let editingViewFeatureId = null;
  let currentAccountPage = 1;
  let currentAccountKeyword = "";
  const accountPageSize = 8;
  let initialized = false;

  function getCurrentAccount() {
    const account = accounts[currentAccountKey] || accounts.hqOfficer;
    if (!account.managedAccountId) return account;
    const managedAccount = managedAccounts.find((item) => item.id === account.managedAccountId);
    const storedAccountFeature = managedAccount?.accountFeatures?.[managedAccount.selectedAccountFeature];
    const selectedFeature = account.fixedFullPermissions
      ? hqOfficerPermissionFeature
      : (storedAccountFeature?.enabled === false ? null : storedAccountFeature);
    const permissions = selectedFeature?.permissions || [];
    const useSystemPermissions = account.fixedFullPermissions
      || (account.preserveSystemPermissions && !account.requiresAssignedPermissions && !selectedFeature);
    const legacyUnits = [
      ...(selectedFeature?.queryUnits || []),
      ...(selectedFeature?.permissionUnits || []),
      ...(selectedFeature?.statusUnits || []),
      ...(selectedFeature?.restrictedUnit ? [selectedFeature.restrictedUnit] : []),
    ];
    const allowedUnits = Array.isArray(selectedFeature?.allowedUnits)
      ? selectedFeature.allowedUnits
      : [...new Set(legacyUnits)];
    const canViewAccounts = permissions.includes("account-view");
    const hasPermissionSettings = permissions.includes("permission-settings");
    const storedViewFeature = managedAccount?.viewFeatures?.[managedAccount.selectedViewFeature];
    const hasViewPermission = account.fixedFullPermissions || (!!storedViewFeature && storedViewFeature.enabled !== false);
    const selectedViewFeature = account.fixedFullPermissions
      ? (storedViewFeature || null)
      : (hasViewPermission ? storedViewFeature : { districts: [], layers: [] });
    return {
      ...account,
      canViewAccounts: useSystemPermissions ? true : canViewAccounts,
      canManageAccounts: useSystemPermissions ? account.canManageAccounts : canViewAccounts && hasPermissionSettings,
      canChangeAccountStatus: useSystemPermissions ? account.canChangeAccountStatus : canViewAccounts && permissions.includes("account-status"),
      canDownloadLogs: useSystemPermissions ? true : canViewAccounts && permissions.includes("log-download"),
      canSetPermissions: useSystemPermissions ? true : canViewAccounts && hasPermissionSettings,
      canAccessAccountManagement: useSystemPermissions ? true : canViewAccounts,
      accountAllowedUnits: useSystemPermissions ? [] : allowedUnits,
      enabled: managedAccount?.enabled !== false,
      selectedAccountFeature: account.fixedFullPermissions ? hqOfficerPermissionId : (managedAccount?.selectedAccountFeature || ""),
      selectedViewFeature: managedAccount?.selectedViewFeature || "",
      viewPermission: selectedViewFeature || null,
      hasViewPermission,
    };
  }

  function unitScopeAllows(units, unit) {
    return !Array.isArray(units) || units.length === 0 || units.includes(unit);
  }

  function getTargetAccountAccess(account, item) {
    const unitAllowed = unitScopeAllows(account.accountAllowedUnits, item.unit);
    const canView = account.canViewAccounts && unitAllowed;
    const canSetPermissions = account.canSetPermissions && unitAllowed;
    const canChangeStatus = account.canChangeAccountStatus && unitAllowed;
    const canDownloadLogs = account.canDownloadLogs && unitAllowed;
    return {
      canSetPermissions,
      canManage: canSetPermissions,
      canChangeStatus,
      canOpenDetail: canView,
      canDownloadLogs,
      canAppearInList: canView,
    };
  }

  function hasFixedFullPermissions(item) {
    return item?.id === accounts.hqOfficer.managedAccountId;
  }

  function isHqOfficerOnlyFeature(featureId, feature) {
    return featureId === hqOfficerPermissionId || feature?.label === hqOfficerPermissionFeature.label;
  }

  function isFeatureOwnedByAccount(feature, account = getCurrentAccount()) {
    return feature?.ownerAccount === account.account;
  }

  function ensurePermissionEnabledCheckbox(selectId, checkboxId, labelText) {
    if ($(checkboxId)) return $(checkboxId);
    const row = $(selectId)?.closest(".account-detail-setting-row");
    const settingButton = row?.querySelector(".account-detail-setting-btn");
    if (!row || !settingButton) return null;
    const label = document.createElement("label");
    label.className = "account-detail-permission-enabled";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = checkboxId;
    const text = document.createElement("span");
    text.textContent = labelText;
    label.append(checkbox, text);
    row.insertBefore(label, settingButton);
    return checkbox;
  }

  function saveManagedAccounts() {
    try {
      localStorage.setItem(managedAccountStorageKey, JSON.stringify(managedAccounts));
    } catch (error) {
      console.warn("無法儲存帳號管理暫存資料", error);
    }
  }

  function initializeAccountIdentitySelect() {
    const select = $("switchAccountSelect");
    if (!select) return;
    select.replaceChildren();
    accountIdentityOrder.forEach((key) => {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = accountIdentityLabels[key];
      select.appendChild(option);
    });
    select.value = currentAccountKey;
  }

  function setActive(target) {
    document.querySelectorAll(".side-menu-item").forEach((item) => {
      item.classList.toggle("is-active", item === target);
    });
  }

  function open() {
    document.body.classList.add("menu-open");
    $("hamburgerBtn")?.setAttribute("aria-expanded", "true");
    $("sideMenuDrawer")?.setAttribute("aria-hidden", "false");
    $("sideMenuOverlay")?.setAttribute("aria-hidden", "false");
  }

  function close() {
    document.body.classList.remove("menu-open");
    const hamburger = $("hamburgerBtn");
    hamburger?.setAttribute("aria-expanded", "false");
    hamburger?.style.removeProperty("display");
    hamburger?.style.removeProperty("visibility");
    hamburger?.style.removeProperty("opacity");
    hamburger?.style.removeProperty("pointer-events");
    $("sideMenuDrawer")?.setAttribute("aria-hidden", "true");
    $("sideMenuOverlay")?.setAttribute("aria-hidden", "true");
  }

  function closeIfMobile() {
    if (window.innerWidth <= 900) close();
  }

  function showAccountPage(pageName) {
    const profilePage = document.querySelector('.profile-drawer-content > .profile-drawer-page:not(.account-manage-page)');
    if (profilePage) profilePage.hidden = pageName !== "profile";
    if ($("accountManageListPage")) $("accountManageListPage").hidden = pageName !== "accountList";
    if ($("accountManageDetailPage")) $("accountManageDetailPage").hidden = pageName !== "accountDetail";
  }

  function openProfile() {
    showAccountPage("profile");
    document.body.classList.add("profile-open");
    $("profileDrawerPanel")?.setAttribute("aria-hidden", "false");
    setActive($("profileMenuBtn"));
  }

  function closeProfile() {
    document.body.classList.remove("profile-open");
    $("profileDrawerPanel")?.setAttribute("aria-hidden", "true");
    setActive(null);
  }

  function applyCurrentViewPermission() {
    const permission = getCurrentAccount().viewPermission;
    const topic = document.body?.dataset?.topic
      || Array.from(document.body?.classList || []).find((className) => className.startsWith("topic-") && className !== "topic-page")?.replace("topic-", "")
      || "";
    const allowedLayers = new Set(permission?.layers || []);
    const allowedDistricts = new Set(permission?.districts || []);
    document.querySelectorAll('input[data-layer]').forEach((input) => {
      const available = !permission || allowedLayers.has(`${topic}:${input.dataset.layer}`);
      const container = input.closest(".layer-row, .camera-layer-option");
      container?.classList.toggle("view-permission-hidden", !available);
      if (!available && input.checked) {
        input.checked = false;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });

    const districtGroup = $("districtCheckboxGroup");
    districtGroup?.querySelectorAll(".district-checkbox").forEach((input) => {
      const available = !permission || allowedDistricts.has(input.dataset.areaId);
      input.closest("label")?.classList.toggle("view-permission-hidden", !available);
      const shouldBeChecked = !!permission && available;
      if (input.checked !== shouldBeChecked) input.click();
    });
    const allDistrictCheckbox = $("district-all");
    allDistrictCheckbox?.closest("label")?.classList.toggle("view-permission-hidden", !!permission);
  }

  function applyAccount() {
    const account = getCurrentAccount();
    if ($("switchAccountSelect")) $("switchAccountSelect").value = currentAccountKey;
    const values = {
      accountInput: account.account,
      companyInput: account.company,
      nameInput: account.name,
      jobTitleInput: account.jobTitle,
      phoneInput: account.phone,
      emailInput: account.email,
    };
    Object.entries(values).forEach(([id, value]) => {
      if ($(id)) $(id).value = value;
    });
    if ($("sideMenuUserName")) $("sideMenuUserName").textContent = account.name;
    const canOpenAccountManagement = account.canAccessAccountManagement;
    if ($("accountManageMenuBtn")) $("accountManageMenuBtn").style.display = canOpenAccountManagement ? "block" : "none";
    if ($("accountManageAddBtn")) $("accountManageAddBtn").style.display = account.canManageAccounts ? "" : "none";
    if (!canOpenAccountManagement && ($("accountManageListPage")?.hidden === false || $("accountManageDetailPage")?.hidden === false)) {
      openProfile();
    } else if (canOpenAccountManagement && $("accountManageListPage")?.hidden === false) {
      currentAccountPage = 1;
      renderAccountTable($("accountManageSearchInput")?.value || "");
    } else if (canOpenAccountManagement && $("accountManageDetailPage")?.hidden === false) {
      const currentItem = managedAccounts.find((item) => item.id === currentManagedAccountId);
      if (!currentItem || !getTargetAccountAccess(account, currentItem).canOpenDetail) {
        currentAccountPage = 1;
        renderAccountTable($("accountManageSearchInput")?.value || "");
        showAccountPage("accountList");
      } else {
        fillAccountDetail(currentItem);
      }
    }
    window.dispatchEvent(new CustomEvent("eimp:account-changed", { detail: { account } }));
    window.setTimeout(applyCurrentViewPermission, 0);
    window.setTimeout(applyCurrentViewPermission, 400);
  }

  function renderAccountTable(keyword = currentAccountKeyword) {
    const tbody = $("accountManageTableBody");
    if (!tbody) return;
    currentAccountKeyword = String(keyword || "");
    const query = currentAccountKeyword.trim().toLowerCase();
    const currentAccount = getCurrentAccount();
    const rows = managedAccounts.filter((item) => {
      if (!getTargetAccountAccess(currentAccount, item).canAppearInList) return false;
      return !query || [item.account, item.unit, item.name]
        .some((value) => value.toLowerCase().includes(query));
    });
    const totalPages = Math.max(1, Math.ceil(rows.length / accountPageSize));
    currentAccountPage = Math.min(Math.max(1, currentAccountPage), totalPages);
    const startIndex = (currentAccountPage - 1) * accountPageSize;
    const pageRows = rows.slice(startIndex, startIndex + accountPageSize);
    const table = tbody.closest("table");
    const showLogColumn = currentAccount.canDownloadLogs;
    const showManagementColumn = currentAccount.canSetPermissions || currentAccount.canChangeAccountStatus;
    table?.classList.toggle("is-log-column-hidden", !showLogColumn);
    table?.classList.toggle("is-management-column-hidden", !showManagementColumn);
    const logHeader = table?.querySelector("thead th:nth-child(5)");
    if (logHeader) logHeader.hidden = !showLogColumn;
    const managementHeader = table?.querySelector("thead th:last-child");
    if (managementHeader) managementHeader.hidden = !showManagementColumn;
    tbody.innerHTML = pageRows.map((item, index) => {
      const access = getTargetAccountAccess(currentAccount, item);
      const detailButtonLabel = access.canSetPermissions || access.canChangeStatus ? "管理" : "查看";
      return `
        <tr>
          <td>${startIndex + index + 1}</td><td title="${item.account}">${item.account}</td><td>${item.unit}</td><td>${item.name}</td>
          ${showLogColumn ? `<td>${access.canDownloadLogs ? `<button type="button" class="account-manage-log-btn" data-account-id="${item.id}">下載</button>` : "－"}</td>` : ""}
          ${showManagementColumn ? `<td>${access.canOpenDetail ? `<button type="button" class="account-manage-row-btn" data-account-id="${item.id}">${detailButtonLabel}</button>` : "－"}</td>` : ""}
        </tr>`;
    }).join("");

    const pageIndex = document.querySelector(".account-manage-page-index");
    const pageArrows = document.querySelectorAll(".account-manage-page-arrow");
    if (pageIndex) pageIndex.textContent = `${currentAccountPage} / ${totalPages}`;
    if (pageArrows[0]) pageArrows[0].disabled = currentAccountPage <= 1;
    if (pageArrows[1]) pageArrows[1].disabled = currentAccountPage >= totalPages;
  }

  function fillAccountDetail(item) {
    currentManagedAccountId = item.id;
    const values = {
      manageAccountInput: item.account,
      manageCompanyInput: item.unit,
      manageNameInput: item.name,
      manageJobInput: item.jobTitle,
      managePhoneInput: item.phone,
      manageEmailInput: item.email,
    };
    Object.entries(values).forEach(([id, value]) => { if ($(id)) $(id).value = value; });
    const currentAccount = getCurrentAccount();
    const access = getTargetAccountAccess(currentAccount, item);
    const isOwnAccount = currentAccount.account === item.account;
    ["manageCompanyInput", "manageNameInput", "manageJobInput", "managePhoneInput", "manageEmailInput"].forEach((id) => {
      if ($(id)) $(id).readOnly = !access.canManage;
    });
    if ($("manageEnabledCheckbox")) {
      $("manageEnabledCheckbox").checked = item.enabled;
      $("manageEnabledCheckbox").disabled = hasFixedFullPermissions(item) || isOwnAccount || !access.canChangeStatus;
      $("manageEnabledCheckbox").title = "";
    }
    const isFixedPermissionAccount = hasFixedFullPermissions(item);
    const selectedAccountFeature = item.accountFeatures?.[item.selectedAccountFeature];
    const grantableAccountFeatures = selectedAccountFeature && isFeatureOwnedByAccount(selectedAccountFeature, currentAccount)
      ? { [item.selectedAccountFeature]: { ...selectedAccountFeature, label: "已設定" } }
      : {};
    if (isFixedPermissionAccount) {
      renderFeatureSelect("accountFeatureSelect", { [hqOfficerPermissionId]: hqOfficerPermissionFeature }, hqOfficerPermissionId);
    } else {
      renderFeatureSelect("accountFeatureSelect", grantableAccountFeatures, item.selectedAccountFeature);
    }
    const selectedViewFeature = item.viewFeatures?.[item.selectedViewFeature];
    const grantableViewFeatures = selectedViewFeature && isFeatureOwnedByAccount(selectedViewFeature, currentAccount)
      ? { [item.selectedViewFeature]: { ...selectedViewFeature, label: "已設定" } }
      : {};
    renderFeatureSelect("viewFeatureSelect", grantableViewFeatures, item.selectedViewFeature);
    const accountPermissionRow = $("accountFeatureSelect")?.closest(".account-detail-setting-row");
    if (accountPermissionRow) accountPermissionRow.hidden = false;
    if ($("accountFeatureSettingBtn")) $("accountFeatureSettingBtn").hidden = false;
    const accountPermissionEnabled = isFixedPermissionAccount || (!!selectedAccountFeature && selectedAccountFeature.enabled !== false);
    const viewPermissionEnabled = isFixedPermissionAccount || (!!selectedViewFeature && selectedViewFeature.enabled !== false);
    const accountEnabledCheckbox = ensurePermissionEnabledCheckbox("accountFeatureSelect", "accountPermissionEnabledCheckbox", "啟用");
    const viewEnabledCheckbox = ensurePermissionEnabledCheckbox("viewFeatureSelect", "viewPermissionEnabledCheckbox", "啟用");
    [[accountEnabledCheckbox, accountPermissionEnabled], [viewEnabledCheckbox, viewPermissionEnabled]].forEach(([checkbox, checked]) => {
      if (!checkbox) return;
      checkbox.checked = checked;
      checkbox.disabled = isFixedPermissionAccount || !access.canSetPermissions || isOwnAccount;
    });
    if (!isFixedPermissionAccount && (!access.canSetPermissions || isOwnAccount)) {
      ["accountFeatureSelect", "viewFeatureSelect"].forEach((id) => {
        const select = $(id);
        if (!select) return;
        select.replaceChildren();
        const unavailableOption = document.createElement("option");
        unavailableOption.value = "";
        unavailableOption.textContent = "無法設定";
        select.appendChild(unavailableOption);
      });
    }
    ["accountFeatureSelect", "viewFeatureSelect", "accountFeatureSettingBtn", "viewFeatureSettingBtn"].forEach((id) => {
      const control = $(id);
      if (!control) return;
      control.disabled = control.tagName === "SELECT" || isFixedPermissionAccount || !access.canSetPermissions || isOwnAccount;
      control.title = isFixedPermissionAccount ? "" : (isOwnAccount ? "本人不可變更自己的權限" : (!access.canSetPermissions ? "沒有此單位的權限設定權限" : ""));
    });
    const permissionCard = document.querySelector(".account-detail-permission-card");
    if (permissionCard) permissionCard.hidden = !access.canSetPermissions && !access.canChangeStatus;
    if ($("accountDetailSaveBtn")) $("accountDetailSaveBtn").hidden = !access.canManage && !access.canChangeStatus;
  }

  function getFeatureOptions(features) {
    if (Array.isArray(features)) {
      return features
        .filter((feature) => typeof feature === "string" || feature?.enabled !== false)
        .map((feature) => typeof feature === "string"
          ? { value: feature, label: feature }
          : { value: String(feature.value ?? feature.id ?? feature.label ?? ""), label: String(feature.label ?? feature.name ?? feature.value ?? "") })
        .filter((feature) => feature.value && feature.label);
    }
    return Object.entries(features || {}).flatMap(([key, value]) => {
      if (!value) return [];
      if (typeof value === "object" && value.enabled === false) return [];
      return [{
        value: key,
        label: typeof value === "string" ? value : String(value?.label ?? value?.name ?? key),
      }];
    });
  }

  function renderFeatureSelect(selectId, features, selectedValue = "") {
    const select = $(selectId);
    if (!select) return;
    const options = getFeatureOptions(features);
    select.replaceChildren();
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = options.length ? "請選擇" : "尚未設定";
    select.appendChild(placeholder);
    options.forEach((feature) => {
      const option = document.createElement("option");
      option.value = feature.value;
      option.textContent = feature.label;
      select.appendChild(option);
    });
    select.value = options.some((feature) => feature.value === selectedValue) ? selectedValue : "";
    select.disabled = options.length === 0;
  }

  function createPermissionDialogs() {
    if (!$("accountFeatureDialog")) {
      document.body.insertAdjacentHTML("beforeend", `
        <section class="permission-setting-modal" id="accountFeatureDialog" aria-hidden="true" hidden>
          <div class="permission-setting-backdrop" id="accountFeatureBackdrop"></div>
          <div class="permission-setting-dialog" role="dialog" aria-modal="true" aria-labelledby="accountFeatureDialogTitle">
            <header class="permission-setting-header">
              <h2 id="accountFeatureDialogTitle">帳號權限設定</h2>
              <button type="button" class="permission-setting-close" id="accountFeatureCloseBtn" aria-label="關閉帳號權限設定">×</button>
            </header>
            <div class="permission-setting-content" id="accountFeatureDialogContent">
              <div class="account-permission-list-view" id="accountPermissionListView">
                <div class="account-permission-toolbar">
                  <button type="button" class="account-permission-add-btn" id="accountPermissionAddBtn">＋ 新增</button>
                </div>
                <div class="account-permission-empty" id="accountPermissionEmpty">尚未新增帳號權限</div>
                <div class="account-permission-list" id="accountPermissionList"></div>
              </div>
              <div class="account-permission-editor" id="accountPermissionEditor" hidden>
                <div class="account-permission-field">
                  <label for="accountPermissionNameInput">權限名稱</label>
                  <input type="text" id="accountPermissionNameInput" maxlength="40" placeholder="請輸入權限名稱" />
                </div>
                <fieldset class="account-permission-options">
                  <label><input type="checkbox" id="accountPermissionViewAccounts" /> 帳號檢視</label>
                  <label><input type="checkbox" id="accountPermissionDownloadLogs" /> Log 下載</label>
                  <label><input type="checkbox" id="accountPermissionSetPermissions" /> 權限設定</label>
                  <label id="accountPermissionChangeStatusLabel"><input type="checkbox" id="accountPermissionChangeStatus" /> 啟用／停用帳號</label>
                  <div class="account-permission-unit-group" id="accountPermissionUnits">
                    <span>可使用單位</span>
                    <div class="account-permission-unit-options">
                      <label class="permission-select-all"><input type="checkbox" id="accountPermissionAllUnits" /> 全部勾選</label>
                      ${accountUnits.map((unit) => `<label><input type="checkbox" value="${unit}" /> ${unit}</label>`).join("")}
                    </div>
                  </div>
                </fieldset>
                <div class="account-permission-editor-actions">
                  <button type="button" class="account-permission-editor-cancel" id="accountPermissionEditorCancelBtn">取消</button>
                  <button type="button" class="account-permission-editor-complete" id="accountPermissionEditorCompleteBtn">完成</button>
                </div>
              </div>
            </div>
            <footer class="permission-setting-actions">
              <button type="button" class="permission-setting-cancel" id="accountFeatureCancelBtn">取消</button>
              <button type="button" class="permission-setting-confirm" id="accountFeatureConfirmBtn">確定</button>
            </footer>
          </div>
        </section>`);
    }

    if (!$("viewFeatureDialog")) {
      document.body.insertAdjacentHTML("beforeend", `
        <section class="permission-setting-modal" id="viewFeatureDialog" aria-hidden="true" hidden>
          <div class="permission-setting-backdrop" id="viewFeatureBackdrop"></div>
          <div class="permission-setting-dialog" role="dialog" aria-modal="true" aria-labelledby="viewFeatureDialogTitle">
            <header class="permission-setting-header">
              <h2 id="viewFeatureDialogTitle">閱覽權限設定</h2>
              <button type="button" class="permission-setting-close" id="viewFeatureCloseBtn" aria-label="關閉閱覽權限設定">×</button>
            </header>
            <div class="permission-setting-content" id="viewFeatureDialogContent">
              <div class="account-permission-list-view" id="viewPermissionListView">
                <div class="account-permission-toolbar">
                  <button type="button" class="account-permission-add-btn" id="viewPermissionAddBtn">＋ 新增</button>
                </div>
                <div class="account-permission-empty" id="viewPermissionEmpty">尚未新增閱覽權限</div>
                <div class="account-permission-list" id="viewPermissionList"></div>
              </div>
              <div class="account-permission-editor" id="viewPermissionEditor" hidden>
                <div class="account-permission-field">
                  <label for="viewPermissionNameInput">權限名稱</label>
                  <input type="text" id="viewPermissionNameInput" maxlength="40" placeholder="請輸入權限名稱" />
                </div>
                <fieldset class="account-permission-options view-permission-options">
                  <div class="view-permission-group">
                    <strong>行政區</strong>
                    <div class="view-permission-checkbox-grid" id="viewPermissionDistricts">
                      <label class="permission-select-all"><input type="checkbox" id="viewPermissionAllDistricts" /> 全部勾選</label>
                      ${viewDistricts.map(([value, label]) => `<label><input type="checkbox" value="${value}" /> ${label}</label>`).join("")}
                    </div>
                  </div>
                  <div class="view-permission-group">
                    <strong>圖層</strong>
                    <div class="view-permission-layer-groups" id="viewPermissionLayers">
                      ${viewLayerTopics.map(([topic, topicLabel]) => `
                        <section class="view-permission-topic" data-view-topic="${topic}">
                          <strong>${topicLabel}</strong>
                          <div class="view-permission-checkbox-grid">
                            ${viewLayers
                              .filter(([value]) => value.startsWith(`${topic}:`))
                              .map(([value, label]) => `<label><input type="checkbox" value="${value}" /> ${label.replace(/^[^｜]+｜/, "")}</label>`)
                              .join("")}
                          </div>
                        </section>`).join("")}
                    </div>
                  </div>
                </fieldset>
                <div class="account-permission-editor-actions">
                  <button type="button" class="account-permission-editor-cancel" id="viewPermissionEditorCancelBtn">取消</button>
                  <button type="button" class="account-permission-editor-complete" id="viewPermissionEditorCompleteBtn">完成</button>
                </div>
              </div>
            </div>
            <footer class="permission-setting-actions">
              <button type="button" class="permission-setting-cancel" id="viewFeatureCancelBtn">取消</button>
              <button type="button" class="permission-setting-confirm" id="viewFeatureConfirmBtn">確定</button>
            </footer>
          </div>
        </section>`);
    }
  }

  function openAccountFeatureDialog() {
    const dialog = $("accountFeatureDialog");
    if (!dialog || currentManagedAccountId === null) return;
    const item = managedAccounts.find((account) => account.id === currentManagedAccountId);
    const currentAccount = getCurrentAccount();
    if (!item || hasFixedFullPermissions(item) || !getTargetAccountAccess(currentAccount, item).canSetPermissions || currentAccount.account === item.account) return;
    const selectedFeature = item.accountFeatures?.[item.selectedAccountFeature];
    const selectedFeatureId = selectedFeature && isFeatureOwnedByAccount(selectedFeature, currentAccount) ? item.selectedAccountFeature : null;
    accountFeatureDraft = selectedFeatureId ? { [selectedFeatureId]: JSON.parse(JSON.stringify(selectedFeature)) } : {};
    showAccountPermissionEditor(selectedFeatureId);
    if ($("accountPermissionNameInput")) $("accountPermissionNameInput").value = "帳號權限";
    dialog.hidden = false;
    dialog.setAttribute("aria-hidden", "false");
    document.body.classList.add("permission-dialog-open");
    $("accountFeatureCloseBtn")?.focus();
  }

  function closeAccountFeatureDialog() {
    const dialog = $("accountFeatureDialog");
    if (!dialog) return;
    dialog.hidden = true;
    dialog.setAttribute("aria-hidden", "true");
    document.body.classList.remove("permission-dialog-open");
    accountFeatureDraft = {};
    editingAccountFeatureId = null;
    $("accountFeatureSettingBtn")?.focus();
  }

  function confirmAccountFeatureDialog() {
    const currentItem = managedAccounts.find((account) => account.id === currentManagedAccountId);
    const currentAccount = getCurrentAccount();
    if (!currentItem || !getTargetAccountAccess(currentAccount, currentItem).canSetPermissions) return;
    completeAccountPermissionEditor();
    if ($("accountPermissionEditor")?.hidden === false) return;
    const [featureEntry] = Object.entries(accountFeatureDraft);
    if (!featureEntry) return;
    const [featureId, feature] = featureEntry;
    const otherFeatures = Object.fromEntries(Object.entries(currentItem.accountFeatures || {})
      .filter(([, currentFeature]) => !isFeatureOwnedByAccount(currentFeature, currentAccount)));
    currentItem.accountFeatures = { ...otherFeatures, [featureId]: feature };
    currentItem.selectedAccountFeature = featureId;
    fillAccountDetail(currentItem);
    saveManagedAccounts();
    closeAccountFeatureDialog();
  }

  function showAccountPermissionList() {
    if ($("accountPermissionListView")) $("accountPermissionListView").hidden = false;
    if ($("accountPermissionEditor")) $("accountPermissionEditor").hidden = true;
  }

  function setPermissionUnitGroup(groupId, enabled, selectedUnits = [], selectAllWhenEmpty = false) {
    const group = $(groupId);
    if (!group) return;
    group.hidden = !enabled;
    const values = enabled && selectAllWhenEmpty && selectedUnits.length === 0 ? accountUnits : selectedUnits;
    group.querySelectorAll('input[type="checkbox"][value]').forEach((checkbox) => {
      checkbox.checked = values.includes(checkbox.value);
    });
  }

  function getPermissionUnitGroupValues(groupId) {
    return Array.from($(groupId)?.querySelectorAll('input[type="checkbox"][value]:checked') || []).map((checkbox) => checkbox.value);
  }

  function syncPermissionSelectAll(allCheckboxId, groupId) {
    const allCheckbox = $(allCheckboxId);
    const checkboxes = Array.from($(groupId)?.querySelectorAll('input[type="checkbox"][value]:not(:disabled)') || []);
    if (!allCheckbox) return;
    const checkedCount = checkboxes.filter((checkbox) => checkbox.checked).length;
    allCheckbox.checked = checkboxes.length > 0 && checkedCount === checkboxes.length;
    allCheckbox.indeterminate = checkedCount > 0 && checkedCount < checkboxes.length;
  }

  function togglePermissionSelectAll(allCheckboxId, groupId) {
    const allCheckbox = $(allCheckboxId);
    if (!allCheckbox) return;
    $(groupId)?.querySelectorAll('input[type="checkbox"][value]:not(:disabled)').forEach((checkbox) => {
      checkbox.checked = allCheckbox.checked;
    });
    allCheckbox.indeterminate = false;
  }

  function getDelegatableAccountUnits() {
    const currentAccount = getCurrentAccount();
    return new Set(currentAccount.accountAllowedUnits?.length ? currentAccount.accountAllowedUnits : accountUnits);
  }

  function updateAccountPermissionDependentControls(canViewAccounts, clearValues = false) {
    ["accountPermissionDownloadLogs", "accountPermissionSetPermissions"].forEach((id) => {
      const checkbox = $(id);
      if (!checkbox) return;
      checkbox.disabled = !canViewAccounts;
      if (!canViewAccounts && clearValues) checkbox.checked = false;
    });
    const statusCheckbox = $("accountPermissionChangeStatus");
    if (statusCheckbox) {
      statusCheckbox.disabled = !canViewAccounts || !getCurrentAccount().preserveSystemPermissions;
      if (!canViewAccounts && clearValues) statusCheckbox.checked = false;
    }
    $("accountPermissionUnits")?.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
      if (!canViewAccounts) {
        checkbox.disabled = true;
        if (clearValues) checkbox.checked = false;
        return;
      }
      if (checkbox.hasAttribute("value")) checkbox.disabled = checkbox.closest("label")?.hidden || false;
      else checkbox.disabled = false;
    });
    if (!canViewAccounts) {
      const allUnits = $("accountPermissionAllUnits");
      if (allUnits) allUnits.indeterminate = false;
    }
  }

  function showAccountPermissionEditor(featureId = null) {
    const feature = featureId ? accountFeatureDraft[featureId] : null;
    if (!getCurrentAccount().canSetPermissions) return;
    if (isHqOfficerOnlyFeature(featureId, feature)) return;
    if (feature?.permissions?.includes("account-status") && !getCurrentAccount().preserveSystemPermissions) return;
    editingAccountFeatureId = featureId;
    const featurePermissions = feature?.permissions || [];
    const canViewAccounts = featurePermissions.includes("account-view");
    const hasPermissionSettings = featurePermissions.includes("permission-settings");
    const hasAccountStatus = featurePermissions.includes("account-status");
    if ($("accountPermissionNameInput")) $("accountPermissionNameInput").value = feature?.label || "";
    if ($("accountPermissionViewAccounts")) $("accountPermissionViewAccounts").checked = canViewAccounts;
    if ($("accountPermissionDownloadLogs")) $("accountPermissionDownloadLogs").checked = feature?.permissions?.includes("log-download") || false;
    if ($("accountPermissionSetPermissions")) $("accountPermissionSetPermissions").checked = hasPermissionSettings;
    if ($("accountPermissionChangeStatus")) {
      const canGrantAccountStatus = !!getCurrentAccount().preserveSystemPermissions;
      $("accountPermissionChangeStatus").checked = canGrantAccountStatus && hasAccountStatus;
      $("accountPermissionChangeStatus").disabled = !canGrantAccountStatus;
      $("accountPermissionChangeStatusLabel").hidden = !canGrantAccountStatus;
    }
    const legacyUnits = [
      ...(feature?.queryUnits || []),
      ...(feature?.permissionUnits || []),
      ...(feature?.statusUnits || []),
      ...(feature?.restrictedUnit ? [feature.restrictedUnit] : []),
    ];
    const allowedUnits = Array.isArray(feature?.allowedUnits) ? feature.allowedUnits : [...new Set(legacyUnits)];
    setPermissionUnitGroup("accountPermissionUnits", true, allowedUnits, !!feature);
    const delegatableUnits = getDelegatableAccountUnits();
    $("accountPermissionUnits")?.querySelectorAll('input[type="checkbox"][value]').forEach((checkbox) => {
      const available = delegatableUnits.has(checkbox.value);
      checkbox.closest("label").hidden = !available;
      checkbox.disabled = !available;
      if (!available) checkbox.checked = false;
    });
    syncPermissionSelectAll("accountPermissionAllUnits", "accountPermissionUnits");
    updateAccountPermissionDependentControls(canViewAccounts, !canViewAccounts);
    if ($("accountPermissionListView")) $("accountPermissionListView").hidden = true;
    if ($("accountPermissionEditor")) $("accountPermissionEditor").hidden = false;
    $("accountPermissionNameInput")?.focus();
  }

  function renderAccountPermissionList() {
    const list = $("accountPermissionList");
    const empty = $("accountPermissionEmpty");
    if (!list || !empty) return;
    list.replaceChildren();
    const canGrantAccountStatus = !!getCurrentAccount().preserveSystemPermissions;
    const entries = Object.entries(accountFeatureDraft).filter(([featureId, feature]) => {
      if (isHqOfficerOnlyFeature(featureId, feature)) return false;
      return canGrantAccountStatus || !feature.permissions?.includes("account-status");
    });
    empty.hidden = entries.length > 0;
    entries.forEach(([featureId, feature]) => {
      const row = document.createElement("div");
      row.className = "account-permission-list-item";
      row.dataset.featureId = featureId;

      const info = document.createElement("div");
      info.className = "account-permission-list-info";
      const name = document.createElement("strong");
      name.textContent = feature.label || featureId;
      const permissions = document.createElement("span");
      const permissionLabels = [];
      if (feature.permissions?.includes("account-view")) permissionLabels.push("帳號檢視");
      if (feature.permissions?.includes("log-download")) permissionLabels.push("Log 下載");
      if (feature.permissions?.includes("permission-settings")) permissionLabels.push("權限設定");
      if (feature.permissions?.includes("account-status")) permissionLabels.push("啟用／停用帳號");
      permissions.textContent = permissionLabels.length ? permissionLabels.join("、") : "未勾選功能";
      info.append(name, permissions);

      const actions = document.createElement("div");
      actions.className = "account-permission-list-actions";
      const editButton = document.createElement("button");
      editButton.type = "button";
      editButton.className = "account-permission-edit-btn";
      editButton.textContent = "編輯";
      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "account-permission-delete-btn";
      deleteButton.textContent = "刪除";
      actions.append(editButton, deleteButton);
      row.append(info, actions);
      list.appendChild(row);
    });
  }

  function completeAccountPermissionEditor() {
    if (!getCurrentAccount().canSetPermissions) return;
    const nameInput = $("accountPermissionNameInput");
    const label = nameInput?.value.trim() || "";
    if (!label) {
      alert("請輸入權限名稱。");
      nameInput?.focus();
      return;
    }
    if (label === hqOfficerPermissionFeature.label) {
      alert("「承辦權限」為系統內建權限名稱，不能新增或編輯。");
      nameInput?.focus();
      return;
    }
    const duplicated = Object.entries(accountFeatureDraft).some(([id, feature]) => id !== editingAccountFeatureId && feature.label === label);
    if (duplicated) {
      alert("權限名稱不可重複。");
      nameInput?.focus();
      return;
    }
    const ownerKey = getCurrentAccount().account.replace(/[^a-z0-9_-]/gi, "-");
    const featureId = editingAccountFeatureId || `account-permission-${ownerKey}-${Date.now()}`;
    const permissions = [];
    const canViewAccounts = $("accountPermissionViewAccounts")?.checked;
    const hasLogDownload = canViewAccounts && $("accountPermissionDownloadLogs")?.checked;
    const hasPermissionSettings = canViewAccounts && $("accountPermissionSetPermissions")?.checked;
    const hasAccountStatus = canViewAccounts && getCurrentAccount().preserveSystemPermissions && $("accountPermissionChangeStatus")?.checked;
    const hasAnyFunction = canViewAccounts;
    const delegatableUnits = getDelegatableAccountUnits();
    const allowedUnits = hasAnyFunction
      ? getPermissionUnitGroupValues("accountPermissionUnits").filter((unit) => delegatableUnits.has(unit))
      : [];
    if (hasAnyFunction && allowedUnits.length === 0) {
      alert("請至少勾選一個可使用單位。");
      return;
    }
    if (canViewAccounts) permissions.push("account-view");
    if (hasLogDownload) permissions.push("log-download");
    if (hasPermissionSettings) permissions.push("permission-settings");
    if (hasAccountStatus) permissions.push("account-status");
    accountFeatureDraft[featureId] = { label, permissions, allowedUnits, ownerAccount: getCurrentAccount().account, enabled: canViewAccounts };
    editingAccountFeatureId = null;
    showAccountPermissionList();
    renderAccountPermissionList();
  }

  function openViewFeatureDialog() {
    const dialog = $("viewFeatureDialog");
    if (!dialog || currentManagedAccountId === null) return;
    const item = managedAccounts.find((account) => account.id === currentManagedAccountId);
    const currentAccount = getCurrentAccount();
    if (!item || hasFixedFullPermissions(item) || !getTargetAccountAccess(currentAccount, item).canSetPermissions || currentAccount.account === item.account) return;
    const selectedFeature = item.viewFeatures?.[item.selectedViewFeature];
    const selectedFeatureId = selectedFeature && isFeatureOwnedByAccount(selectedFeature, currentAccount) ? item.selectedViewFeature : null;
    viewFeatureDraft = selectedFeatureId ? { [selectedFeatureId]: JSON.parse(JSON.stringify(selectedFeature)) } : {};
    showViewPermissionEditor(selectedFeatureId);
    if ($("viewPermissionNameInput")) $("viewPermissionNameInput").value = "閱覽權限";
    dialog.hidden = false;
    dialog.setAttribute("aria-hidden", "false");
    document.body.classList.add("permission-dialog-open");
    $("viewFeatureCloseBtn")?.focus();
  }

  function closeViewFeatureDialog() {
    const dialog = $("viewFeatureDialog");
    if (!dialog) return;
    dialog.hidden = true;
    dialog.setAttribute("aria-hidden", "true");
    document.body.classList.remove("permission-dialog-open");
    viewFeatureDraft = {};
    editingViewFeatureId = null;
    $("viewFeatureSettingBtn")?.focus();
  }

  function confirmViewFeatureDialog() {
    const item = managedAccounts.find((account) => account.id === currentManagedAccountId);
    const currentAccount = getCurrentAccount();
    if (!item || hasFixedFullPermissions(item) || !getTargetAccountAccess(currentAccount, item).canSetPermissions) return;
    completeViewPermissionEditor();
    if ($("viewPermissionEditor")?.hidden === false) return;
    const [featureEntry] = Object.entries(viewFeatureDraft);
    if (!featureEntry) return;
    const [featureId, feature] = featureEntry;
    const otherFeatures = Object.fromEntries(Object.entries(item.viewFeatures || {})
      .filter(([, currentFeature]) => !isFeatureOwnedByAccount(currentFeature, currentAccount)));
    item.viewFeatures = { ...otherFeatures, [featureId]: feature };
    item.selectedViewFeature = featureId;
    fillAccountDetail(item);
    saveManagedAccounts();
    closeViewFeatureDialog();
  }

  function showViewPermissionList() {
    if ($("viewPermissionListView")) $("viewPermissionListView").hidden = false;
    if ($("viewPermissionEditor")) $("viewPermissionEditor").hidden = true;
  }

  function getDelegatableViewValues(kind) {
    const permission = getCurrentAccount().viewPermission;
    if (!permission) return new Set((kind === "layers" ? viewLayers : viewDistricts).map(([value]) => value));
    return new Set(Array.isArray(permission[kind]) ? permission[kind] : []);
  }

  function showViewPermissionEditor(featureId = null) {
    const feature = featureId ? viewFeatureDraft[featureId] : null;
    if (!getCurrentAccount().canSetPermissions) return;
    editingViewFeatureId = featureId;
    if ($("viewPermissionNameInput")) $("viewPermissionNameInput").value = feature?.label || "";
    [["viewPermissionDistricts", "districts"], ["viewPermissionLayers", "layers"]].forEach(([groupId, kind]) => {
      const allowedValues = getDelegatableViewValues(kind);
      const selectedValues = new Set(feature?.[kind] || []);
      $(groupId)?.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
        if (!checkbox.hasAttribute("value")) return;
        const available = allowedValues.has(checkbox.value);
        checkbox.closest("label").hidden = !available;
        checkbox.disabled = !available;
        checkbox.checked = available && selectedValues.has(checkbox.value);
      });
    });
    $("viewPermissionLayers")?.querySelectorAll(".view-permission-topic").forEach((section) => {
      section.hidden = !Array.from(section.querySelectorAll("label")).some((label) => !label.hidden);
    });
    syncPermissionSelectAll("viewPermissionAllDistricts", "viewPermissionDistricts");
    if ($("viewPermissionListView")) $("viewPermissionListView").hidden = true;
    if ($("viewPermissionEditor")) $("viewPermissionEditor").hidden = false;
    $("viewPermissionNameInput")?.focus();
  }

  function renderViewPermissionList() {
    const list = $("viewPermissionList");
    const empty = $("viewPermissionEmpty");
    if (!list || !empty) return;
    list.replaceChildren();
    const entries = Object.entries(viewFeatureDraft);
    empty.hidden = entries.length > 0;
    entries.forEach(([featureId, feature]) => {
      const row = document.createElement("div");
      row.className = "account-permission-list-item";
      row.dataset.featureId = featureId;
      const info = document.createElement("div");
      info.className = "account-permission-list-info";
      const name = document.createElement("strong");
      name.textContent = feature.label || featureId;
      const summary = document.createElement("span");
      summary.textContent = `${feature.districts?.length || 0} 個行政區、${feature.layers?.length || 0} 個圖層`;
      info.append(name, summary);
      const actions = document.createElement("div");
      actions.className = "account-permission-list-actions";
      actions.innerHTML = '<button type="button" class="account-permission-edit-btn">編輯</button><button type="button" class="account-permission-delete-btn">刪除</button>';
      row.append(info, actions);
      list.appendChild(row);
    });
  }

  function completeViewPermissionEditor() {
    const nameInput = $("viewPermissionNameInput");
    const label = nameInput?.value.trim() || "";
    if (!label) {
      alert("請輸入閱覽權限名稱。");
      nameInput?.focus();
      return;
    }
    const duplicated = Object.entries(viewFeatureDraft).some(([id, feature]) => id !== editingViewFeatureId && feature.label === label);
    if (duplicated) {
      alert("閱覽權限名稱不可重複。");
      return;
    }
    const districts = getPermissionUnitGroupValues("viewPermissionDistricts");
    const layers = getPermissionUnitGroupValues("viewPermissionLayers");
    if (!districts.length || !layers.length) {
      alert("請至少勾選一個行政區及一個圖層。");
      return;
    }
    const ownerKey = getCurrentAccount().account.replace(/[^a-z0-9_-]/gi, "-");
    const featureId = editingViewFeatureId || `view-permission-${ownerKey}-${Date.now()}`;
    viewFeatureDraft[featureId] = { label, districts, layers, ownerAccount: getCurrentAccount().account, enabled: true };
    editingViewFeatureId = null;
    showViewPermissionList();
    renderViewPermissionList();
  }

  function saveManagedAccount() {
    const item = managedAccounts.find((account) => account.id === currentManagedAccountId);
    if (!item) return;
    const currentAccount = getCurrentAccount();
    const access = getTargetAccountAccess(currentAccount, item);
    const fields = [
      ["manageCompanyInput", "申請單位"],
      ["manageNameInput", "申請人姓名"],
      ["manageJobInput", "職稱"],
      ["managePhoneInput", "連絡電話"],
      ["manageEmailInput", "E-mail"],
    ];
    if (access.canManage) {
      for (const [id, label] of fields) {
        const input = $(id);
        if (!input?.value.trim()) {
          alert(`請填寫${label}。`);
          input?.focus();
          return;
        }
      }
      if (!$("manageEmailInput").checkValidity()) {
        alert("請輸入正確的 E-mail 格式。");
        $("manageEmailInput").focus();
        return;
      }
      Object.assign(item, {
        unit: $("manageCompanyInput").value.trim(),
        name: $("manageNameInput").value.trim(),
        jobTitle: $("manageJobInput").value.trim(),
        phone: $("managePhoneInput").value.trim(),
        email: $("manageEmailInput").value.trim(),
      });
    }
    if (access.canChangeStatus && !hasFixedFullPermissions(item) && currentAccount.account !== item.account) {
      item.enabled = $("manageEnabledCheckbox").checked;
    }
    saveManagedAccounts();
    renderAccountTable($("accountManageSearchInput")?.value || "");
    alert("帳號資料已儲存。");
  }

  function openAccountManagement() {
    const account = getCurrentAccount();
    if (!account.canAccessAccountManagement) return;
    currentAccountPage = 1;
    renderAccountTable($("accountManageSearchInput")?.value || "");
    showAccountPage("accountList");
    document.body.classList.add("profile-open");
    $("profileDrawerPanel")?.setAttribute("aria-hidden", "false");
    setActive($("accountManageMenuBtn"));
  }

  function downloadLoginLog(accountId) {
    const currentAccount = getCurrentAccount();
    if (!currentAccount.canDownloadLogs) return;
    const item = managedAccounts.find((account) => String(account.id) === String(accountId));
    if (!item || !getTargetAccountAccess(currentAccount, item).canDownloadLogs) return;
    const rows = [["時間", "IP", "結果"], ...item.loginLogs.map((log) => [log.time, log.ip, log.result])];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${item.account}_login_logs.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function init() {
    if (initialized || !$("hamburgerBtn")) return;
    initialized = true;
    createPermissionDialogs();
    initializeAccountIdentitySelect();

    $("hamburgerBtn").addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      document.body.classList.contains("menu-open") ? close() : open();
    });
    $("hamburgerBtn").addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      document.body.classList.contains("menu-open") ? close() : open();
    });
    $("sideMenuOverlay")?.addEventListener("click", () => { closeProfile(); close(); });
    $("profileMenuBtn")?.addEventListener("click", (event) => {
      event.preventDefault(); event.stopPropagation(); openProfile(); closeIfMobile();
    });
    $("accountManageMenuBtn")?.addEventListener("click", (event) => {
      event.preventDefault(); event.stopPropagation(); openAccountManagement(); closeIfMobile();
    });
    $("logoutMenuBtn")?.addEventListener("click", (event) => {
      event.preventDefault(); event.stopPropagation(); closeProfile();
    });
    $("profileCloseBtn")?.addEventListener("click", (event) => {
      event.preventDefault(); event.stopPropagation(); closeProfile();
    });
    $("profileCloseMask")?.addEventListener("click", () => { closeProfile(); close(); });
    document.querySelectorAll(".password-toggle-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const input = $(button.getAttribute("data-target"));
        if (input) input.type = input.type === "password" ? "text" : "password";
      });
    });
    $("switchAccountSelect")?.addEventListener("change", (event) => {
      currentAccountKey = accounts[event.currentTarget.value] ? event.currentTarget.value : "hqOfficer";
      try {
        localStorage.setItem(currentAccountStorageKey, currentAccountKey);
      } catch (error) {
        console.warn("無法儲存模擬帳號暫存資料", error);
      }
      applyAccount();
    });
    $("accountManageSearchBtn")?.addEventListener("click", () => {
      currentAccountPage = 1;
      renderAccountTable($("accountManageSearchInput")?.value || "");
    });
    $("accountManageSearchInput")?.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      currentAccountPage = 1;
      renderAccountTable(event.currentTarget.value);
    });
    document.querySelectorAll(".account-manage-page-arrow").forEach((button, index) => {
      button.addEventListener("click", () => {
        currentAccountPage += index === 0 ? -1 : 1;
        renderAccountTable();
      });
    });
    $("accountManageAddBtn")?.addEventListener("click", () => alert("目前先提供第一稽查分隊帳號檢視功能，新增帳號功能尚未串接。"));
    $("accountManageTableBody")?.addEventListener("click", (event) => {
      const logButton = event.target.closest(".account-manage-log-btn");
      if (logButton) return downloadLoginLog(logButton.dataset.accountId);
      const manageButton = event.target.closest(".account-manage-row-btn");
      const item = manageButton && managedAccounts.find((account) => String(account.id) === String(manageButton.dataset.accountId));
      const account = getCurrentAccount();
      if (!item || !getTargetAccountAccess(account, item).canOpenDetail) return;
      fillAccountDetail(item); showAccountPage("accountDetail"); setActive($("accountManageMenuBtn"));
    });
    $("accountDetailBackBtn")?.addEventListener("click", () => { showAccountPage("accountList"); setActive($("accountManageMenuBtn")); });
    $("accountDetailSaveBtn")?.addEventListener("click", saveManagedAccount);
    document.addEventListener("change", (event) => {
      if (event.target.id !== "accountPermissionEnabledCheckbox" && event.target.id !== "viewPermissionEnabledCheckbox") return;
      const item = managedAccounts.find((account) => account.id === currentManagedAccountId);
      const currentAccount = getCurrentAccount();
      if (!item || hasFixedFullPermissions(item) || currentAccount.account === item.account || !getTargetAccountAccess(currentAccount, item).canSetPermissions) {
        if (event.target) event.target.checked = hasFixedFullPermissions(item);
        return;
      }
      const isAccountPermission = event.target.id === "accountPermissionEnabledCheckbox";
      const featureKey = isAccountPermission ? "accountFeatures" : "viewFeatures";
      const selectedKey = isAccountPermission ? "selectedAccountFeature" : "selectedViewFeature";
      const feature = item[featureKey]?.[item[selectedKey]];
      const accountFeatureNeedsSetup = isAccountPermission && feature && !feature.permissions?.includes("account-view");
      if ((!feature || accountFeatureNeedsSetup) && event.target.checked) {
        event.target.checked = false;
        isAccountPermission ? openAccountFeatureDialog() : openViewFeatureDialog();
        return;
      }
      if (!feature) return;
      feature.enabled = event.target.checked;
      saveManagedAccounts();
      fillAccountDetail(item);
    });

    $("accountFeatureSettingBtn")?.addEventListener("click", openAccountFeatureDialog);
    $("accountFeatureCloseBtn")?.addEventListener("click", closeAccountFeatureDialog);
    $("accountFeatureCancelBtn")?.addEventListener("click", closeAccountFeatureDialog);
    $("accountFeatureBackdrop")?.addEventListener("click", closeAccountFeatureDialog);
    $("accountFeatureConfirmBtn")?.addEventListener("click", confirmAccountFeatureDialog);
    $("accountPermissionAddBtn")?.addEventListener("click", () => showAccountPermissionEditor());
    $("accountPermissionEditorCancelBtn")?.addEventListener("click", () => {
      editingAccountFeatureId = null;
      showAccountPermissionList();
    });
    $("accountPermissionEditorCompleteBtn")?.addEventListener("click", completeAccountPermissionEditor);
    $("accountPermissionViewAccounts")?.addEventListener("change", (event) => {
      updateAccountPermissionDependentControls(event.currentTarget.checked, !event.currentTarget.checked);
      if (event.currentTarget.checked) syncPermissionSelectAll("accountPermissionAllUnits", "accountPermissionUnits");
    });
    $("accountPermissionAllUnits")?.addEventListener("change", () => togglePermissionSelectAll("accountPermissionAllUnits", "accountPermissionUnits"));
    $("accountPermissionUnits")?.addEventListener("change", (event) => {
      if (event.target.id !== "accountPermissionAllUnits") syncPermissionSelectAll("accountPermissionAllUnits", "accountPermissionUnits");
    });
    $("accountPermissionNameInput")?.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      completeAccountPermissionEditor();
    });
    $("accountPermissionList")?.addEventListener("click", (event) => {
      const row = event.target.closest(".account-permission-list-item");
      const featureId = row?.dataset.featureId;
      if (!featureId) return;
      if (event.target.closest(".account-permission-edit-btn")) {
        showAccountPermissionEditor(featureId);
        return;
      }
      if (event.target.closest(".account-permission-delete-btn")) {
        if (accountFeatureDraft[featureId]?.permissions?.includes("account-status") && !getCurrentAccount().preserveSystemPermissions) return;
        const featureName = accountFeatureDraft[featureId]?.label || "此權限";
        if (!confirm(`確定刪除「${featureName}」嗎？`)) return;
        delete accountFeatureDraft[featureId];
        renderAccountPermissionList();
      }
    });

    $("viewFeatureSettingBtn")?.addEventListener("click", openViewFeatureDialog);
    $("viewFeatureCloseBtn")?.addEventListener("click", closeViewFeatureDialog);
    $("viewFeatureCancelBtn")?.addEventListener("click", closeViewFeatureDialog);
    $("viewFeatureBackdrop")?.addEventListener("click", closeViewFeatureDialog);
    $("viewFeatureConfirmBtn")?.addEventListener("click", confirmViewFeatureDialog);
    $("viewPermissionAddBtn")?.addEventListener("click", () => showViewPermissionEditor());
    $("viewPermissionEditorCancelBtn")?.addEventListener("click", () => {
      editingViewFeatureId = null;
      showViewPermissionList();
    });
    $("viewPermissionEditorCompleteBtn")?.addEventListener("click", completeViewPermissionEditor);
    $("viewPermissionAllDistricts")?.addEventListener("change", () => togglePermissionSelectAll("viewPermissionAllDistricts", "viewPermissionDistricts"));
    $("viewPermissionDistricts")?.addEventListener("change", (event) => {
      if (event.target.id !== "viewPermissionAllDistricts") syncPermissionSelectAll("viewPermissionAllDistricts", "viewPermissionDistricts");
    });
    $("viewPermissionList")?.addEventListener("click", (event) => {
      const row = event.target.closest(".account-permission-list-item");
      const featureId = row?.dataset.featureId;
      if (!featureId) return;
      if (event.target.closest(".account-permission-edit-btn")) return showViewPermissionEditor(featureId);
      if (event.target.closest(".account-permission-delete-btn")) {
        const featureName = viewFeatureDraft[featureId]?.label || "此閱覽權限";
        if (!confirm(`確定刪除「${featureName}」嗎？`)) return;
        delete viewFeatureDraft[featureId];
        renderViewPermissionList();
      }
    });

    $("accountFeatureSelect")?.addEventListener("change", (event) => {
      const item = managedAccounts.find((account) => account.id === currentManagedAccountId);
      if (!item) return;
      const account = getCurrentAccount();
      const selectedFeature = item.accountFeatures?.[event.currentTarget.value];
      if (hasFixedFullPermissions(item) || isHqOfficerOnlyFeature(event.currentTarget.value, selectedFeature) || !getTargetAccountAccess(account, item).canSetPermissions || account.account === item.account || (!account.preserveSystemPermissions && selectedFeature?.permissions?.includes("account-status"))) {
        fillAccountDetail(item);
        event.currentTarget.disabled = true;
        return;
      }
      item.selectedAccountFeature = event.currentTarget.value;
      saveManagedAccounts();
    });
    $("viewFeatureSelect")?.addEventListener("change", (event) => {
      const item = managedAccounts.find((account) => account.id === currentManagedAccountId);
      if (!item) return;
      const account = getCurrentAccount();
      const selectedFeature = item.viewFeatures?.[event.currentTarget.value];
      const allowedLayers = getDelegatableViewValues("layers");
      const allowedDistricts = getDelegatableViewValues("districts");
      const exceedsOwnViewPermission = selectedFeature && ([...(selectedFeature.layers || [])].some((value) => !allowedLayers.has(value))
        || [...(selectedFeature.districts || [])].some((value) => !allowedDistricts.has(value)));
      if (!getTargetAccountAccess(account, item).canSetPermissions || account.account === item.account
        || (selectedFeature && !isFeatureOwnedByAccount(selectedFeature, account)) || exceedsOwnViewPermission) {
        fillAccountDetail(item);
        event.currentTarget.disabled = true;
        return;
      }
      item.selectedViewFeature = event.currentTarget.value;
      saveManagedAccounts();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      if (!$("accountFeatureDialog")?.hidden) closeAccountFeatureDialog();
      else if (!$("viewFeatureDialog")?.hidden) closeViewFeatureDialog();
      else if (document.body.classList.contains("profile-open")) closeProfile();
      else if (document.body.classList.contains("menu-open")) close();
    });

    applyAccount();
  }

  window.EIMPSideMenu = { init, open, close, closeIfMobile, openProfile, closeProfile, setActive, getCurrentAccount };
  document.addEventListener("DOMContentLoaded", init);
})();
