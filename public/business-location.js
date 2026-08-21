(function () {
  "use strict";

  const APP_BASE_URL = new URL("./", document.currentScript?.src || document.baseURI);
  const appUrl = (path) => new URL(String(path).replace(/^\/+/, ""), APP_BASE_URL).href;

  const DISTRICTS = [
    "板橋區", "中和區", "永和區", "新店區", "土城區", "新莊區", "三重區", "蘆洲區", "汐止區",
    "林口區", "泰山區", "五股區", "淡水區", "三芝區", "石門區", "八里區", "三峽區", "鶯歌區",
    "樹林區", "深坑區", "石碇區", "坪林區", "平溪區", "瑞芳區", "貢寮區", "金山區", "萬里區",
    "雙溪區", "烏來區",
  ];
  const REGULATED_TYPES = ["空", "水", "廢", "毒", "土污", "環藥", "管考"];
  const EMPTY_INDUSTRY = "系統內設空值";
  const ALL_INDUSTRIES = "全部行業別";
  const PRIORITY_INDUSTRIES = ["電鍍業", "金屬表面處理業", "染整業", "資源物回收處理業"];
  const OTHER_INDUSTRIES = [
    "其他機械器具批發業", "磚瓦、砂石、水泥及其製品批發業", "烘焙炊蒸食品製造業", "普通倉儲業",
    "未分類其他教育業", "餐館", "印刷業", "豬飼育業", "公用事業設施工程業", "鋁鑄造業",
    "黏土建築材料製造業", "塑膠原料製造業", "未分類其他非金屬礦物製品製造業", "其他電腦週邊設備製造業",
    "其他土木工程業", "金屬結構製造業", "量測、導航及控制設備製造業", "其他食品批發業",
    "其他金屬加工處理業", "建築物一般清潔服務業", "大專校院", "有害廢棄物清除業", "預拌混凝土製造業",
    "其他清潔服務業", "未分類其他紙製品製造業", "未分類其他組織", "未分類其他電子零組件製造業",
    "其他陶瓷製品製造業", "加油及加氣站", "其他木竹製品製造業", "塗料、染料及顏料製造業",
    "綠化服務業", "建物完工裝修工程業", "印刷輔助業", "不動產開發業", "電腦製造業", "醫院",
    "金屬建築組件製造業", "金屬模具製造業", "化粧品批發業", "未分類其他基本金屬製造業",
    "其他技術檢測及分析服務業", "未分類其他金屬製品製造業", "動物飼品製造業", "其他陸上運輸業",
    "建築工程業", "清潔用品批發業", "環境檢測服務業", "金屬刀具及手工具製造業", "西藥製造業",
    "未分類其他化學製品製造業", "其他醫療器材及用品製造業", "鐵路運輸業", "非有害廢棄物處理業",
    "電力供應業", "資料儲存媒體複製業", "非有害廢棄物清除業", "回收物料批發業", "化學原材料製造業",
    "屠宰業", "未分類其他食品製造業", "未分類其他非店面零售業", "砂、石採取及其他礦業", "洗衣業",
    "其他專門營造業", "居住型老人照顧服務業", "廢水及污水處理業", "被動電子元件製造業",
    "化粧品製造業", "其他電力設備及配備製造業", "其他紡織品製造業", "未分類其他專業、科學及技術服務業",
    "其他通訊傳播設備製造業", "短期住宿業", "化學原材料及其製品批發業", "電線及電纜製造業",
    "醫用生物製品製造業", "機電、電信及電路設備安裝業", "家用空調器具製造業", "汽車零件製造業",
    "整地、基礎及結構工程業", "清潔用品製造業", "有線電信業", "用水供應業", "診所", "照明器具製造業",
    "鍋爐、金屬貯槽及壓力容器製造業", "其他基本金屬鑄造業", "未分類其他專用機械設備製造業",
    "其他綜合商品零售業",
  ];
  const INDUSTRIES = [...PRIORITY_INDUSTRIES, EMPTY_INDUSTRY, ...OTHER_INDUSTRIES];
  const BUSINESSES = [
    { id: "EB001", name: "土城金屬工業有限公司", district: "土城區", address: "新北市土城區OO路100號", regulated: true, regulatedTypes: ["水", "毒"], detailTypes: ["water", "toxic", "CEMS", "CWMS"], industry: "電鍍業", waterQualityItems: [{ name: "水溫", value: "15～35", unit: "攝氏" }, { name: "pH值", value: "6～9", unit: "" }, { name: "生化需氧量", value: "220", unit: "mg/L" }, { name: "化學需氧量", value: "450", unit: "mg/L" }, { name: "懸浮固體", value: "280", unit: "mg/L" }, { name: "大腸桿菌群", value: "50000000", unit: "CFU/100mL" }, { name: "銅", value: "3.0", unit: "mg/L" }, { name: "鉻", value: "2.0", unit: "mg/L" }, { name: "鎳", value: "1.0", unit: "mg/L" }], lat: 24.9735, lng: 121.4442 },
    { id: "EB002", name: "中和花園社區", district: "中和區", address: "新北市中和區OO路200號", regulated: true, regulatedTypes: ["水"], detailTypes: ["water", "CWMS"], industry: "廢水及污水處理業", waterQualityItems: [{ name: "水溫", value: "20～25", unit: "攝氏" }, { name: "pH值", value: "6～9", unit: "" }, { name: "生化需氧量", value: "220", unit: "mg/L" }, { name: "化學需氧量", value: "450", unit: "mg/L" }, { name: "懸浮固體", value: "220", unit: "mg/L" }, { name: "大腸桿菌群", value: "10000000", unit: "CFU/100mL" }], lat: 25.0003, lng: 121.4930 },
    { id: "EB003", name: "樹林畜牧場", district: "樹林區", address: "新北市樹林區OO街25號", regulated: true, regulatedTypes: ["水", "廢"], detailTypes: ["water"], industry: "豬飼育業", waterQualityItems: [{ name: "水溫", value: "20～35", unit: "攝氏" }, { name: "pH值", value: "6～9", unit: "" }, { name: "生化需氧量", value: "5000", unit: "mg/L" }, { name: "化學需氧量", value: "12000", unit: "mg/L" }, { name: "懸浮固體", value: "9000", unit: "mg/L" }, { name: "銅", value: "3.0", unit: "mg/L" }, { name: "鋅", value: "5.0", unit: "mg/L" }], lat: 24.9898, lng: 121.4214 },
    { id: "EB004", name: "板橋食品包裝行", district: "板橋區", address: "新北市板橋區OO路120號", regulated: true, regulatedTypes: ["空"], industry: "烘焙炊蒸食品製造業", waterQualityItems: [], lat: 25.0132, lng: 121.4637 },
    { id: "EB005", name: "新莊精密加工廠", district: "新莊區", address: "新北市新莊區△△路66號", regulated: false, regulatedTypes: [], industry: "其他金屬加工處理業", waterQualityItems: [], lat: 25.0362, lng: 121.4549 },
    { id: "EB006", name: "新店電子維修廠", district: "新店區", address: "新北市新店區OO街18號", regulated: true, regulatedTypes: ["空"], industry: "其他電腦週邊設備製造業", waterQualityItems: [], lat: 24.9435, lng: 121.5580 },
    { id: "EB007", name: "泰山塑膠射出廠", district: "泰山區", address: "新北市泰山區明志路附近", regulated: false, regulatedTypes: [], industry: "塑膠原料製造業", waterQualityItems: [], lat: 25.0450, lng: 121.4160 },
    { id: "EB008", name: "五股倉儲物流場", district: "五股區", address: "新北市五股區OO路88號", regulated: false, regulatedTypes: [], industry: "普通倉儲業", waterQualityItems: [], lat: 25.0841, lng: 121.4387 },
    { id: "EB009", name: "汐止機械保養廠", district: "汐止區", address: "新北市汐止區大同路附近", regulated: false, regulatedTypes: [], industry: "", waterQualityItems: [], lat: 25.0820, lng: 121.6400 },
    { id: "EB010", name: "林口材料倉儲中心", district: "林口區", address: "新北市林口區文化北路旁", regulated: false, regulatedTypes: [], industry: "", waterQualityItems: [], lat: 25.0920, lng: 121.3660 },
  ];
  const WATER_ITEMS = Array.from(new Set(BUSINESSES.flatMap((business) => business.waterQualityItems.map((item) => item.name))));
  const ALL_WATER_ITEMS = "全部水質項目";
  const BUSINESS_DETAIL_LABELS = {
    water: "水許可證",
    toxic: "毒化物許可證",
    CEMS: "CEMS",
    CWMS: "CWMS",
  };
  const BUSINESS_DETAIL_VALUES = Object.values(BUSINESS_DETAIL_LABELS);
  const ALL_BUSINESS_DETAILS = "全部詳細資料";

  const state = {
    queryMode: "name",
    businessName: "",
    district: { enabled: false, values: new Set() },
    regulated: { enabled: false, statuses: new Set(), types: new Set(), matchMode: "any" },
    industry: { enabled: false, values: new Set() },
    water: { enabled: false, values: new Set(WATER_ITEMS) },
    detail: { enabled: false, values: new Set(), matchMode: "any" },
  };
  let currentModalKind = null;
  let modalWasEnabled = false;
  let resultMarker = null;

  function makeOption(value, label) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    return option;
  }

  function makeRow(labelText, control) {
    const row = document.createElement("div");
    row.className = "quick-locate-row";
    const label = document.createElement("div");
    label.className = "quick-locate-label";
    label.textContent = labelText;
    row.append(label, control);
    return row;
  }

  function makeSelect(id, options) {
    const select = document.createElement("select");
    select.id = id;
    select.className = "quick-locate-select";
    options.forEach(([value, label]) => select.appendChild(makeOption(value, label)));
    return select;
  }

  function getWaterQualityItems(item) {
    if (Array.isArray(item?.waterQualityItems)) return item.waterQualityItems;
    const matchedBusiness = BUSINESSES.find((business) => (
      business.name === item?.businessName
      || (Number(business.lat) === Number(item?.lat) && Number(business.lng) === Number(item?.lng))
    ));
    return matchedBusiness?.waterQualityItems || [];
  }

  function renderPermitWaterQualityItems(container, item) {
    if (!container) return;
    const items = getWaterQualityItems(item);
    if (!items.length) return;

    const formatName = (waterItem) => waterItem.unit ? `${waterItem.name}(${waterItem.unit})` : waterItem.name;
    const makeRow = (waterItem, layout, code = "") => {
      const row = document.createElement("div");
      row.className = "form-row";
      const values = code ? [code, formatName(waterItem), waterItem.value || "-"] : [formatName(waterItem), waterItem.value || "-"];
      values.forEach((value, index) => {
        const cell = document.createElement("div");
        if (layout === "flow") {
          cell.className = `form-cell${index === 1 ? "" : " center"}`;
        } else if (layout === "livestock") {
          cell.className = `form-cell ${index === 0 ? "label2" : "center"}`;
          cell.style.fontSize = "14px";
          if (index === 1) cell.style.flex = "2.1";
        } else {
          cell.className = "form-cell center";
          if (index === 1) cell.style.flex = "2.1";
        }
        cell.textContent = value;
        row.appendChild(cell);
      });
      return row;
    };
    const replaceRows = (startRow, stopWhen, rowFactory) => {
      if (!startRow?.parentElement) return;
      const parent = startRow.parentElement;
      let insertionPoint = startRow.nextElementSibling;
      while (insertionPoint && !stopWhen(insertionPoint)) {
        const next = insertionPoint.nextElementSibling;
        insertionPoint.remove();
        insertionPoint = next;
      }
      items.forEach((waterItem, index) => parent.insertBefore(rowFactory(waterItem, index), insertionPoint));
    };
    const rows = Array.from(container.querySelectorAll(".form-row"));
    const rowText = (row) => row.textContent.replace(/\s+/g, "").trim();

    const generalSection = rows.find((row) => row.classList.contains("form-row-header") && rowText(row).includes("三、原廢(污)水水量、水質資料"));
    if (generalSection) {
      let waterHeader = generalSection.nextElementSibling;
      while (waterHeader && !waterHeader.classList.contains("form-row-header")) {
        const cells = Array.from(waterHeader.children).map((cell) => cell.textContent.trim());
        if (cells[0] === "水質項目" && cells[1] === "數值") break;
        waterHeader = waterHeader.nextElementSibling;
      }
      replaceRows(waterHeader, (row) => row.classList.contains("form-row-header"), (waterItem) => makeRow(waterItem, "general"));
      return;
    }

    const livestockSection = rows.find((row) => row.classList.contains("form-row-header") && rowText(row).includes("五、原廢(污)水水質"));
    if (livestockSection) {
      replaceRows(livestockSection, (row) => row.classList.contains("form-row-header"), (waterItem) => makeRow(waterItem, "livestock"));
      return;
    }

    const flowHeaders = rows.filter((row) => {
      const cells = Array.from(row.children).map((cell) => cell.textContent.trim());
      return cells[0] === "水流編號" && cells[1] === "水質項目" && cells[2] === "濃度";
    });
    flowHeaders.forEach((flowHeader, flowIndex) => {
      const prefix = flowIndex === 0 ? "WTB" : "WTA";
      replaceRows(
        flowHeader,
        (row) => row.classList.contains("form-row-header") || /^\([二三四五六七八九十]+\)/.test(rowText(row)),
        (waterItem, index) => makeRow(waterItem, "flow", `${prefix}${String(index + 1).padStart(2, "0")}`),
      );
    });
  }

  window.EIMPBusinessWaterQuality = {
    ...(window.EIMPBusinessWaterQuality || {}),
    render: renderPermitWaterQualityItems,
  };

  function makeToggleRow(kind, labelText) {
    const fragment = document.createDocumentFragment();
    const row = document.createElement("div");
    row.className = "quick-locate-row business-locate-setting-row";
    const label = document.createElement("div");
    label.className = "quick-locate-label";
    label.textContent = labelText;
    const select = makeSelect(`businessLocate${kind}Toggle`, [["disabled", "停用"], ["enabled", "啟用"]]);
    select.dataset.filterKind = kind;
    const settingButton = document.createElement("button");
    settingButton.type = "button";
    settingButton.className = "business-locate-setting";
    settingButton.textContent = "設定";
    settingButton.disabled = true;
    settingButton.dataset.filterKind = kind;
    row.append(label, select, settingButton);
    fragment.append(row);

    select.addEventListener("change", () => {
      if (select.value === "enabled") {
        state[kind].enabled = true;
        syncControls();
      } else {
        resetFilter(kind);
        syncControls();
      }
    });
    settingButton.addEventListener("click", () => {
      if (settingButton.disabled) return;
      modalWasEnabled = true;
      openFilterModal(kind);
    });
    return fragment;
  }

  function renderBusinessFields(form) {
    form.replaceChildren();
    const queryMode = makeSelect("businessLocateQueryMode", [["name", "名稱查詢"], ["data", "資料查詢"]]);
    queryMode.value = state.queryMode;
    const fields = document.createElement("div");
    fields.id = "businessLocateQueryFields";

    const renderQueryFields = () => {
      fields.replaceChildren();
      if (state.queryMode === "name") {
        const nameInput = document.createElement("input");
        nameInput.id = "businessLocateName";
        nameInput.className = "quick-locate-input";
        nameInput.type = "search";
        nameInput.autocomplete = "off";
        nameInput.placeholder = "請輸入事業名稱";
        nameInput.value = state.businessName;
        nameInput.addEventListener("input", () => { state.businessName = nameInput.value; });
        nameInput.addEventListener("keydown", (event) => {
          if (event.key !== "Enter") return;
          event.preventDefault();
          document.getElementById("quickLocateGoBtn")?.click();
        });
        fields.append(makeRow("事業名稱", nameInput));
        return;
      }

      const county = document.createElement("input");
      county.id = "businessLocateCounty";
      county.className = "quick-locate-input readonly-input";
      county.value = "新北市";
      county.readOnly = true;
      fields.append(makeRow("縣市", county));
      fields.append(makeToggleRow("district", "行政區"));
      fields.append(makeToggleRow("regulated", "是否列管"));
      fields.append(makeToggleRow("industry", "行業別"));
      fields.append(makeToggleRow("water", "水質項目"));
      fields.append(makeToggleRow("detail", "詳細資料"));
      syncControls();
    };

    queryMode.addEventListener("change", () => {
      state.queryMode = queryMode.value;
      closeFilterModal();
      closeResultsPanel();
      renderQueryFields();
    });
    form.append(makeRow("查詢方式", queryMode), fields);
    renderQueryFields();
  }

  function createOverlay(mapPanel) {
    const overlay = document.createElement("div");
    overlay.id = "businessLocateOverlay";
    overlay.className = "business-locate-overlay";
    overlay.hidden = true;
    overlay.innerHTML = `
      <section class="business-locate-dialog" role="dialog" aria-modal="true" aria-labelledby="businessLocateDialogTitle">
        <header class="business-locate-dialog-header">
          <h2 class="business-locate-dialog-title" id="businessLocateDialogTitle"></h2>
        </header>
        <div class="business-locate-dialog-body" id="businessLocateDialogBody"></div>
        <footer class="business-locate-dialog-footer">
          <button type="button" class="business-locate-button" id="businessLocateCancel">取消</button>
          <button type="button" class="business-locate-button is-primary" id="businessLocateConfirm">確認</button>
        </footer>
      </section>`;
    mapPanel.appendChild(overlay);
    overlay.querySelector("#businessLocateCancel").addEventListener("click", cancelFilterModal);
    overlay.querySelector("#businessLocateConfirm").addEventListener("click", confirmFilterModal);
    return overlay;
  }

  function checkboxGrid(name, values, selected, wide) {
    const grid = document.createElement("div");
    grid.className = `business-locate-choice-grid${wide ? " is-wide" : ""}`;
    values.forEach((value) => {
      const label = document.createElement("label");
      label.className = "business-locate-choice";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.name = name;
      input.value = value;
      input.checked = selected.has(value);
      const text = document.createElement("span");
      text.textContent = value;
      label.append(input, text);
      grid.appendChild(label);
    });
    return grid;
  }

  function makeFilterScrollRegion(...children) {
    const region = document.createElement("div");
    region.className = "business-filter-scroll-region";
    region.append(...children);
    return region;
  }

  function makeMatchModeControl(name, selectedMode = "any") {
    const fieldset = document.createElement("fieldset");
    fieldset.className = "business-match-mode";
    const legend = document.createElement("legend");
    legend.textContent = "條件比對方式";
    fieldset.appendChild(legend);
    [
      ["any", "符合任一（OR）", "符合其中一項即可"],
      ["all", "符合全部（AND）", "必須同時具有所有勾選項目"],
    ].forEach(([value, labelText, description]) => {
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "radio";
      input.name = name;
      input.value = value;
      input.checked = selectedMode === value;
      const copy = document.createElement("span");
      const title = document.createElement("strong");
      title.textContent = labelText;
      const help = document.createElement("small");
      help.textContent = description;
      copy.append(title, help);
      label.append(input, copy);
      fieldset.appendChild(label);
    });
    return fieldset;
  }

  function makeFilterSearch(id, label) {
    const form = document.createElement("form");
    form.className = "business-filter-search-form";
    form.setAttribute("role", "search");
    const input = document.createElement("input");
    input.id = id;
    input.className = "business-industry-search";
    input.type = "search";
    input.placeholder = label;
    input.setAttribute("aria-label", label);
    const button = document.createElement("button");
    button.type = "submit";
    button.className = "business-filter-search-button";
    button.textContent = "查詢";
    form.append(input, button);
    return { form, input };
  }

  function openFilterModal(kind) {
    const overlay = document.getElementById("businessLocateOverlay");
    const title = document.getElementById("businessLocateDialogTitle");
    const body = document.getElementById("businessLocateDialogBody");
    const dialog = overlay?.querySelector(".business-locate-dialog");
    if (!overlay || !title || !body) return;
    currentModalKind = kind;
    dialog?.classList.toggle("is-fixed-filter-dialog", ["district", "industry", "water", "detail"].includes(kind));
    body.replaceChildren();

    const help = document.createElement("p");
    help.className = "business-locate-help";
    if (kind === "district") {
      title.textContent = "行政區設定";
      help.textContent = "請勾選要查詢的行政區，可複選；第一項可快速全選或全部取消。";
      const { form: searchForm, input: search } = makeFilterSearch("businessDistrictSearch", "搜尋行政區");
      const allDistrictsLabel = "全部行政區";
      const districtSelection = new Set(state.district.values);
      if (DISTRICTS.every((district) => districtSelection.has(district))) districtSelection.add(allDistrictsLabel);
      const districtGrid = checkboxGrid("businessDistrict", [allDistrictsLabel, ...DISTRICTS], districtSelection, true);
      const allDistrictsInput = districtGrid.querySelector(`input[value="${allDistrictsLabel}"]`);
      const districtInputs = Array.from(districtGrid.querySelectorAll("input")).filter((input) => input !== allDistrictsInput);
      const syncAllDistrictsState = () => {
        const checkedCount = districtInputs.filter((input) => input.checked).length;
        allDistrictsInput.checked = checkedCount === districtInputs.length;
        allDistrictsInput.indeterminate = checkedCount > 0 && checkedCount < districtInputs.length;
      };
      allDistrictsInput.addEventListener("change", () => {
        districtInputs.forEach((input) => { input.checked = allDistrictsInput.checked; });
        allDistrictsInput.indeterminate = false;
      });
      districtInputs.forEach((input) => input.addEventListener("change", syncAllDistrictsState));
      syncAllDistrictsState();
      const emptySearchResult = document.createElement("p");
      emptySearchResult.className = "business-industry-empty-search";
      emptySearchResult.textContent = "找不到符合的行政區。";
      emptySearchResult.hidden = true;
      searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const keyword = search.value.trim().toLocaleLowerCase("zh-Hant");
        let visibleCount = 0;
        districtGrid.querySelectorAll(".business-locate-choice").forEach((choice) => {
          const visible = !keyword || choice.textContent.toLocaleLowerCase("zh-Hant").includes(keyword);
          choice.hidden = !visible;
          if (visible) visibleCount += 1;
        });
        emptySearchResult.hidden = visibleCount !== 0;
      });
      body.append(help, searchForm, makeFilterScrollRegion(districtGrid, emptySearchResult));
    } else if (kind === "regulated") {
      title.textContent = "是否列管設定";
      help.textContent = "請勾選欲查詢事業列管種類。";
      body.appendChild(help);
      const statuses = checkboxGrid("businessRegulatedStatus", ["列管", "非列管"], new Set([
        ...(state.regulated.statuses.has("regulated") ? ["列管"] : []),
        ...(state.regulated.statuses.has("nonregulated") ? ["非列管"] : []),
      ]), false);
      statuses.querySelectorAll("input").forEach((input) => {
        input.dataset.statusValue = input.value === "列管" ? "regulated" : "nonregulated";
      });
      const statusTitle = document.createElement("h3");
      statusTitle.className = "business-locate-subsection-title";
      statusTitle.textContent = "列管狀態（可複選）";
      body.append(
        statusTitle,
        statuses,
      );
      const subsection = document.createElement("section");
      subsection.className = "business-locate-subsection";
      subsection.id = "businessRegulatedTypesSection";
      const subsectionTitle = document.createElement("h3");
      subsectionTitle.className = "business-locate-subsection-title";
      subsectionTitle.textContent = "列管種類（可複選）";
      subsection.append(
        subsectionTitle,
        makeMatchModeControl("businessRegulatedMatchMode", state.regulated.matchMode),
        checkboxGrid("businessRegulatedType", REGULATED_TYPES, state.regulated.types, true),
      );
      body.appendChild(subsection);
      const regulatedInput = body.querySelector('[data-status-value="regulated"]');
      const updateVisibility = () => { subsection.hidden = !regulatedInput.checked; };
      regulatedInput.addEventListener("change", updateVisibility);
      updateVisibility();
    } else if (kind === "industry") {
      title.textContent = "行業別設定";
      help.textContent = "請勾選欲查詢的事業行業別，可複選；第一項可快速全選或全部取消。";
      const { form: searchForm, input: search } = makeFilterSearch("businessIndustrySearch", "搜尋行業別");
      const industrySelection = new Set(state.industry.values);
      if (INDUSTRIES.every((industry) => industrySelection.has(industry))) industrySelection.add(ALL_INDUSTRIES);
      const industryGrid = checkboxGrid("businessIndustry", [ALL_INDUSTRIES, ...INDUSTRIES], industrySelection, false);
      const allIndustriesInput = industryGrid.querySelector(`input[value="${ALL_INDUSTRIES}"]`);
      const industryInputs = Array.from(industryGrid.querySelectorAll("input")).filter((input) => input !== allIndustriesInput);
      const syncAllIndustriesState = () => {
        const checkedCount = industryInputs.filter((input) => input.checked).length;
        allIndustriesInput.checked = checkedCount === industryInputs.length;
        allIndustriesInput.indeterminate = checkedCount > 0 && checkedCount < industryInputs.length;
      };
      allIndustriesInput.addEventListener("change", () => {
        industryInputs.forEach((input) => { input.checked = allIndustriesInput.checked; });
        allIndustriesInput.indeterminate = false;
      });
      industryInputs.forEach((input) => input.addEventListener("change", syncAllIndustriesState));
      syncAllIndustriesState();
      const emptySearchResult = document.createElement("p");
      emptySearchResult.className = "business-industry-empty-search";
      emptySearchResult.textContent = "找不到符合的行業別。";
      emptySearchResult.hidden = true;

      searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const keyword = search.value.trim().toLocaleLowerCase("zh-Hant");
        let visibleCount = 0;
        industryGrid.querySelectorAll(".business-locate-choice").forEach((choice) => {
          const visible = !keyword || choice.textContent.toLocaleLowerCase("zh-Hant").includes(keyword);
          choice.hidden = !visible;
          if (visible) visibleCount += 1;
        });
        emptySearchResult.hidden = visibleCount !== 0;
      });
      body.append(help, searchForm, makeFilterScrollRegion(industryGrid, emptySearchResult));
    } else if (kind === "water") {
      title.textContent = "水質項目設定";
      help.textContent = "請勾選欲查詢事業水汙染許可證水質項目";
      const { form: searchForm, input: search } = makeFilterSearch("businessWaterSearch", "搜尋水質項目");
      const waterSelection = new Set(state.water.values);
      if (WATER_ITEMS.every((item) => waterSelection.has(item))) waterSelection.add(ALL_WATER_ITEMS);
      const waterGrid = checkboxGrid("businessWaterItem", [ALL_WATER_ITEMS, ...WATER_ITEMS], waterSelection, true);
      const allWaterInput = waterGrid.querySelector(`input[value="${ALL_WATER_ITEMS}"]`);
      const waterInputs = Array.from(waterGrid.querySelectorAll("input")).filter((input) => input !== allWaterInput);
      const syncAllWaterState = () => {
        const checkedCount = waterInputs.filter((input) => input.checked).length;
        allWaterInput.checked = checkedCount === waterInputs.length;
        allWaterInput.indeterminate = checkedCount > 0 && checkedCount < waterInputs.length;
      };
      allWaterInput.addEventListener("change", () => {
        waterInputs.forEach((input) => { input.checked = allWaterInput.checked; });
        allWaterInput.indeterminate = false;
      });
      waterInputs.forEach((input) => input.addEventListener("change", syncAllWaterState));
      syncAllWaterState();
      const emptySearchResult = document.createElement("p");
      emptySearchResult.className = "business-industry-empty-search";
      emptySearchResult.textContent = "找不到符合的水質項目。";
      emptySearchResult.hidden = true;
      searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const keyword = search.value.trim().toLocaleLowerCase("zh-Hant");
        let visibleCount = 0;
        waterGrid.querySelectorAll(".business-locate-choice").forEach((choice) => {
          const visible = !keyword || choice.textContent.toLocaleLowerCase("zh-Hant").includes(keyword);
          choice.hidden = !visible;
          if (visible) visibleCount += 1;
        });
        emptySearchResult.hidden = visibleCount !== 0;
      });
      body.append(help, searchForm, makeFilterScrollRegion(waterGrid, emptySearchResult));
    } else {
      title.textContent = "詳細資料設定";
      help.textContent = "請勾選欲查詢的事業詳細資料類型，可複選；第一項可快速全選或全部取消。";
      const detailSelection = new Set(state.detail.values);
      if (BUSINESS_DETAIL_VALUES.every((value) => detailSelection.has(value))) detailSelection.add(ALL_BUSINESS_DETAILS);
      const detailGrid = checkboxGrid("businessDetailType", [ALL_BUSINESS_DETAILS, ...BUSINESS_DETAIL_VALUES], detailSelection, true);
      const allDetailsInput = detailGrid.querySelector(`input[value="${ALL_BUSINESS_DETAILS}"]`);
      const detailInputs = Array.from(detailGrid.querySelectorAll("input")).filter((input) => input !== allDetailsInput);
      const syncAllDetailsState = () => {
        const checkedCount = detailInputs.filter((input) => input.checked).length;
        allDetailsInput.checked = checkedCount === detailInputs.length;
        allDetailsInput.indeterminate = checkedCount > 0 && checkedCount < detailInputs.length;
      };
      allDetailsInput.addEventListener("change", () => {
        detailInputs.forEach((input) => { input.checked = allDetailsInput.checked; });
        allDetailsInput.indeterminate = false;
      });
      detailInputs.forEach((input) => input.addEventListener("change", syncAllDetailsState));
      syncAllDetailsState();
      body.append(
        help,
        makeMatchModeControl("businessDetailMatchMode", state.detail.matchMode),
        makeFilterScrollRegion(detailGrid),
      );
    }
    overlay.hidden = false;
    const initialFocus = kind === "district"
      ? body.querySelector("#businessDistrictSearch")
      : kind === "industry"
        ? body.querySelector("#businessIndustrySearch")
      : kind === "water"
        ? body.querySelector("#businessWaterSearch")
        : kind === "detail"
          ? body.querySelector('input[name="businessDetailType"]')
        : overlay.querySelector("#businessLocateCancel");
    initialFocus?.focus();
  }

  function selectedValues(selector, valueGetter) {
    return new Set(Array.from(document.querySelectorAll(selector)).filter((input) => input.checked).map(valueGetter));
  }

  function confirmFilterModal() {
    if (currentModalKind === "district") {
      state.district.values = selectedValues('input[name="businessDistrict"]', (input) => input.value);
      state.district.values.delete("全部行政區");
      state.district.enabled = true;
    } else if (currentModalKind === "regulated") {
      state.regulated.statuses = selectedValues('input[name="businessRegulatedStatus"]', (input) => input.dataset.statusValue);
      state.regulated.types = selectedValues('input[name="businessRegulatedType"]', (input) => input.value);
      state.regulated.matchMode = document.querySelector('input[name="businessRegulatedMatchMode"]:checked')?.value || "any";
      state.regulated.enabled = true;
    } else if (currentModalKind === "industry") {
      state.industry.values = selectedValues('input[name="businessIndustry"]', (input) => input.value);
      state.industry.values.delete(ALL_INDUSTRIES);
      state.industry.enabled = true;
    } else if (currentModalKind === "water") {
      state.water.values = selectedValues('input[name="businessWaterItem"]', (input) => input.value);
      state.water.values.delete(ALL_WATER_ITEMS);
      state.water.enabled = true;
    } else if (currentModalKind === "detail") {
      state.detail.values = selectedValues('input[name="businessDetailType"]', (input) => input.value);
      state.detail.values.delete(ALL_BUSINESS_DETAILS);
      state.detail.matchMode = document.querySelector('input[name="businessDetailMatchMode"]:checked')?.value || "any";
      state.detail.enabled = true;
    }
    closeFilterModal();
    syncControls();
  }

  function cancelFilterModal() {
    if (!modalWasEnabled && currentModalKind) resetFilter(currentModalKind);
    closeFilterModal();
    syncControls();
  }

  function closeFilterModal() {
    const overlay = document.getElementById("businessLocateOverlay");
    if (overlay) overlay.hidden = true;
    currentModalKind = null;
  }

  function resetFilter(kind) {
    state[kind].enabled = false;
    if (kind === "district") {
      state.district.values = new Set();
    } else if (kind === "regulated") {
      state.regulated.statuses.clear();
      state.regulated.types.clear();
      state.regulated.matchMode = "any";
    } else if (kind === "water") {
      state.water.values = new Set(WATER_ITEMS);
    } else if (kind === "detail") {
      state.detail.values.clear();
      state.detail.matchMode = "any";
    } else {
      state[kind].values.clear();
    }
  }

  function syncControls() {
    ["district", "regulated", "industry", "water", "detail"].forEach((kind) => {
      const select = document.getElementById(`businessLocate${kind}Toggle`);
      const setting = document.querySelector(`.business-locate-setting[data-filter-kind="${kind}"]`);
      if (!select) return;
      select.value = state[kind].enabled ? "enabled" : "disabled";
      if (setting) setting.disabled = !state[kind].enabled;
    });
  }

  function matchesSet(values, selected) {
    return selected.size === 0 || values.some((value) => selected.has(value));
  }

  function matchesWithMode(values, selected, matchMode) {
    if (selected.size === 0) return true;
    return matchMode === "all"
      ? Array.from(selected).every((value) => values.includes(value))
      : values.some((value) => selected.has(value));
  }

  function queryBusinesses() {
    if (state.queryMode === "name") {
      const keyword = state.businessName.trim().normalize("NFKC").toLocaleLowerCase("zh-Hant");
      if (!keyword) return [];
      return BUSINESSES.filter((business) => (
        business.name.normalize("NFKC").toLocaleLowerCase("zh-Hant").includes(keyword)
      ));
    }
    if (state.district.enabled && state.district.values.size === 0) return [];
    if (state.industry.enabled && state.industry.values.size === 0) return [];
    if (state.detail.enabled && state.detail.values.size === 0) return [];
    return BUSINESSES.filter((business) => {
      if (state.district.enabled && !state.district.values.has(business.district)) return false;
      if (state.regulated.enabled) {
        const status = business.regulated ? "regulated" : "nonregulated";
        if (!state.regulated.statuses.has(status)) return false;
        if (business.regulated && !matchesWithMode(business.regulatedTypes, state.regulated.types, state.regulated.matchMode)) return false;
      }
      const businessIndustry = business.industry.trim() || EMPTY_INDUSTRY;
      if (state.industry.enabled && state.industry.values.size && !state.industry.values.has(businessIndustry)) return false;
      const businessWaterItems = business.waterQualityItems.map((item) => item.name);
      if (state.water.enabled && (state.water.values.size === 0 || !matchesSet(businessWaterItems, state.water.values))) return false;
      const businessDetailItems = getBusinessDetailTypes(business).map((type) => BUSINESS_DETAIL_LABELS[type]);
      if (state.detail.enabled && !matchesWithMode(businessDetailItems, state.detail.values, state.detail.matchMode)) return false;
      return true;
    });
  }

  function createResultsPanel(mapPanel) {
    const backdrop = document.createElement("div");
    backdrop.id = "businessLocateResultsBackdrop";
    backdrop.className = "business-locate-results-backdrop";
    backdrop.hidden = true;
    backdrop.setAttribute("aria-hidden", "true");
    const panel = document.createElement("section");
    panel.id = "businessLocateResults";
    panel.className = "business-locate-results";
    panel.hidden = true;
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-labelledby", "businessLocateResultsTitle");
    panel.innerHTML = `
      <header class="business-locate-results-header">
        <h2 class="business-locate-results-title" id="businessLocateResultsTitle">事業定位查詢結果 <span class="business-locate-results-count" id="businessLocateResultsCount"></span></h2>
        <button type="button" class="business-locate-results-close" aria-label="收合查詢結果">×</button>
      </header>
      <div class="business-locate-results-body" id="businessLocateResultsBody"></div>`;
    panel.querySelector(".business-locate-results-close").addEventListener("click", closeResultsPanel);
    mapPanel.append(backdrop, panel);
    return panel;
  }

  function closeResultsPanel() {
    const panel = document.getElementById("businessLocateResults");
    const backdrop = document.getElementById("businessLocateResultsBackdrop");
    if (panel) panel.hidden = true;
    if (backdrop) backdrop.hidden = true;
  }

  function renderResults(items) {
    const panel = document.getElementById("businessLocateResults");
    const body = document.getElementById("businessLocateResultsBody");
    const count = document.getElementById("businessLocateResultsCount");
    if (!panel || !body || !count) return;
    count.textContent = `共 ${items.length} 筆`;
    body.replaceChildren();
    if (!items.length) {
      const empty = document.createElement("div");
      empty.className = "business-locate-empty";
      empty.textContent = "沒有符合目前篩選條件的事業。";
      body.appendChild(empty);
    } else {
      const table = document.createElement("table");
      table.className = "business-locate-table";
      table.innerHTML = "<thead><tr><th>事業</th><th>列管項目</th><th>行業別</th><th>水質項目</th><th>事業詳細資料</th><th>操作</th></tr></thead>";
      const tbody = document.createElement("tbody");
      items.forEach((business) => {
        const row = document.createElement("tr");
        const businessCell = document.createElement("td");
        const name = document.createElement("span");
        name.className = "business-locate-name";
        name.textContent = business.name;
        const address = document.createElement("span");
        address.className = "business-locate-address";
        address.textContent = business.address;
        businessCell.append(name, address);
        const regulatedCell = document.createElement("td");
        regulatedCell.textContent = business.regulated ? business.regulatedTypes.join("、") : "非列管";
        const industryCell = document.createElement("td");
        industryCell.textContent = business.industry || EMPTY_INDUSTRY;
        const waterCell = document.createElement("td");
        waterCell.textContent = business.waterQualityItems.map((item) => item.name).join("、") || "—";
        const detailCell = document.createElement("td");
        detailCell.className = "business-locate-detail-cell";
        const detailTypes = getBusinessDetailTypes(business);
        if (detailTypes.length) {
          detailTypes.forEach((detailType) => {
            const detailButton = document.createElement("button");
            detailButton.type = "button";
            detailButton.className = "business-locate-detail-button";
            detailButton.textContent = BUSINESS_DETAIL_LABELS[detailType];
            detailButton.addEventListener("click", () => locateBusiness(business, detailType));
            detailCell.appendChild(detailButton);
          });
        } else {
          detailCell.textContent = "—";
        }
        const actionCell = document.createElement("td");
        const locateButton = document.createElement("button");
        locateButton.type = "button";
        locateButton.className = "business-locate-pin-button";
        locateButton.textContent = "定位";
        locateButton.addEventListener("click", () => locateBusiness(business));
        actionCell.appendChild(locateButton);
        row.append(businessCell, regulatedCell, industryCell, waterCell, detailCell, actionCell);
        tbody.appendChild(row);
      });
      table.appendChild(tbody);
      body.appendChild(table);
    }
    const backdrop = document.getElementById("businessLocateResultsBackdrop");
    if (backdrop) backdrop.hidden = false;
    panel.hidden = false;
    panel.querySelector(".business-locate-results-close")?.focus();
  }

  function getBusinessDetailTypes(business) {
    if (Array.isArray(business?.detailTypes)) {
      return business.detailTypes.filter((type) => BUSINESS_DETAIL_LABELS[type]);
    }
    const regulatedTypes = Array.isArray(business?.regulatedTypes) ? business.regulatedTypes : [];
    return [regulatedTypes.includes("水") ? "water" : null, regulatedTypes.includes("毒") ? "toxic" : null].filter(Boolean);
  }

  function locateBusiness(business, detailType = null) {
    const map = window.EIMPMap;
    if (!map || !window.L) return;
    if (resultMarker) resultMarker.remove();
    const iconUrl = appUrl(business.regulated ? "images/工廠許可(列管).png" : "images/工廠許可.png");
    const businessIcon = L.divIcon({
      className: "business-locate-marker-icon",
      html: `<span class="business-locate-marker-ring"><img src="${iconUrl}" alt="" /></span>`,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -28],
    });
    resultMarker = L.marker([business.lat, business.lng], { icon: businessIcon }).addTo(map);
    const highlightedMarker = resultMarker;
    highlightedMarker.once("popupclose", () => {
      highlightedMarker.remove();
      if (resultMarker === highlightedMarker) resultMarker = null;
    });
    const locateItem = toBusinessPopupItem(business);
    const popupItem = window.EIMPBusinessPopupBridge?.resolveItem?.(locateItem) || locateItem;
    const popupType = business.regulated ? "regBusiness" : "nonRegBusiness";
    const popup = window.EIMPBusinessPopupBridge?.buildPopupContent?.(popupItem, popupType) || business.name;
    map.setView([business.lat, business.lng], 17);
    highlightedMarker.bindPopup(popup, {
      maxWidth: 360,
      minWidth: 260,
      className: "custom-case-popup",
      closeButton: true,
      autoClose: false,
      closeOnClick: false,
      keepBusinessDetailOpen: Boolean(detailType),
    });
    if (detailType) window.EIMPBusinessPopupBridge?.openDetail?.(popupItem, detailType);
    highlightedMarker.openPopup();
    closeResultsPanel();
    document.getElementById("quickLocateWrapper")?.classList.remove("open");
  }

  function toBusinessPopupItem(business) {
    return {
      id: business.id,
      businessName: business.name,
      controlNo: business.controlNo || `${business.regulated ? "F" : "NFB"}-${business.id.replace(/\D/g, "").padStart(4, "0")}`,
      unifiedNo: business.unifiedNo || "-",
      industrialParkName: business.industrialParkName || "-",
      industryName: business.industry,
      regulatedType: business.regulated ? business.regulatedTypes.join("、") : "非列管",
      regulatedTypes: business.regulatedTypes,
      detailTypes: getBusinessDetailTypes(business),
      inspectManageNo: business.inspectManageNo || "-",
      tempManageNo: business.tempManageNo || "-",
      factoryLicenseNo: business.factoryLicenseNo || "-",
      address: business.address,
      lat: business.lat,
      lng: business.lng,
      waterItems: business.waterQualityItems.map((item) => item.name),
      waterQualityItems: business.waterQualityItems,
    };
  }

  function clearBusinessQuery() {
    state.businessName = "";
    const nameInput = document.getElementById("businessLocateName");
    if (nameInput) nameInput.value = "";
    ["district", "regulated", "industry", "water", "detail"].forEach(resetFilter);
    syncControls();
    closeFilterModal();
    closeResultsPanel();
    if (resultMarker) resultMarker.remove();
    resultMarker = null;
  }

  function initBusinessLocation() {
    const typeSelect = document.getElementById("locateTypeSelect");
    const form = document.getElementById("quickLocateFormContainer");
    const goButton = document.getElementById("quickLocateGoBtn");
    const clearButton = document.getElementById("quickLocateClearBtn");
    const wrapper = document.getElementById("quickLocateWrapper");
    const mapPanel = document.querySelector(".map-panel");
    if (!typeSelect || !form || !goButton || !clearButton || !wrapper || !mapPanel) return;

    if (!typeSelect.querySelector('option[value="business"]')) typeSelect.appendChild(makeOption("business", "事業定位"));
    createOverlay(mapPanel);
    createResultsPanel(mapPanel);

    typeSelect.addEventListener("change", () => {
      const isBusiness = typeSelect.value === "business";
      wrapper.classList.toggle("business-locate-active", isBusiness);
      goButton.textContent = isBusiness ? "查詢" : "定位";
      clearButton.textContent = isBusiness ? "清除查詢" : "清除定位";
      if (isBusiness) {
        state.queryMode = "name";
        state.businessName = "";
        renderBusinessFields(form);
      }
      else {
        closeFilterModal();
        closeResultsPanel();
      }
    });

    goButton.addEventListener("click", (event) => {
      if (typeSelect.value !== "business") return;
      event.preventDefault();
      event.stopImmediatePropagation();
      renderResults(queryBusinesses());
    }, true);

    clearButton.addEventListener("click", (event) => {
      if (typeSelect.value !== "business") return;
      event.preventDefault();
      event.stopImmediatePropagation();
      clearBusinessQuery();
    }, true);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !document.getElementById("businessLocateOverlay").hidden) cancelFilterModal();
    });

    document.addEventListener("click", (event) => {
      const target = event.target instanceof Element ? event.target : event.target?.parentElement;
      const trigger = target?.closest(".business-detail-trigger");
      if (!trigger) return;
      const business = BUSINESSES.find((item) => String(item.id) === String(trigger.dataset.itemId));
      if (!business || typeof window.EIMPBusinessPopupBridge?.openDetail !== "function") return;
      event.preventDefault();
      event.stopPropagation();
      window.EIMPBusinessPopupBridge.openDetail(toBusinessPopupItem(business));
    }, true);
  }

  document.addEventListener("DOMContentLoaded", initBusinessLocation);
})();
