(function () {
  "use strict";

  const API_PATH = "/api/ntpc-fast-location";

  function readValue(source, names) {
    const wanted = new Set(names.map((name) => name.toLowerCase()));
    for (const [key, value] of Object.entries(source || {})) {
      if (wanted.has(key.toLowerCase()) && value !== "" && value != null) return value;
    }
    return undefined;
  }

  function collectXmlValues(documentNode) {
    const values = {};
    documentNode.querySelectorAll("*").forEach((element) => {
      if (element.children.length === 0 && element.textContent.trim()) {
        values[element.tagName] = element.textContent.trim();
      }
      Array.from(element.attributes).forEach((attribute) => {
        values[attribute.name] = attribute.value;
      });
    });
    return values;
  }

  function twd97ToWgs84(x, y) {
    const a = 6378137.0;
    const b = 6356752.314245;
    const long0 = 121 * Math.PI / 180;
    const k0 = 0.9999;
    const dx = 250000;
    const dy = 0;
    const e = Math.sqrt(1 - (b * b) / (a * a));
    const xAdjusted = x - dx;
    const yAdjusted = y - dy;
    const m = yAdjusted / k0;
    const mu = m / (a * (1 - e ** 2 / 4 - 3 * e ** 4 / 64 - 5 * e ** 6 / 256));
    const e1 = (1 - Math.sqrt(1 - e ** 2)) / (1 + Math.sqrt(1 - e ** 2));
    const j1 = 3 * e1 / 2 - 27 * e1 ** 3 / 32;
    const j2 = 21 * e1 ** 2 / 16 - 55 * e1 ** 4 / 32;
    const j3 = 151 * e1 ** 3 / 96;
    const j4 = 1097 * e1 ** 4 / 512;
    const fp = mu + j1 * Math.sin(2 * mu) + j2 * Math.sin(4 * mu) + j3 * Math.sin(6 * mu) + j4 * Math.sin(8 * mu);
    const e2 = e ** 2 / (1 - e ** 2);
    const c1 = e2 * Math.cos(fp) ** 2;
    const t1 = Math.tan(fp) ** 2;
    const r1 = a * (1 - e ** 2) / (1 - e ** 2 * Math.sin(fp) ** 2) ** 1.5;
    const n1 = a / Math.sqrt(1 - e ** 2 * Math.sin(fp) ** 2);
    const d = xAdjusted / (n1 * k0);
    const lat = fp - (n1 * Math.tan(fp) / r1) * (
      d ** 2 / 2
      - (5 + 3 * t1 + 10 * c1 - 4 * c1 ** 2 - 9 * e2) * d ** 4 / 24
      + (61 + 90 * t1 + 298 * c1 + 45 * t1 ** 2 - 252 * e2 - 3 * c1 ** 2) * d ** 6 / 720
    );
    const lng = long0 + (
      d
      - (1 + 2 * t1 + c1) * d ** 3 / 6
      + (5 - 2 * c1 + 28 * t1 - 3 * c1 ** 2 + 8 * e2 + 24 * t1 ** 2) * d ** 5 / 120
    ) / Math.cos(fp);
    return { lat: lat * 180 / Math.PI, lng: lng * 180 / Math.PI };
  }

  function normalizeCoordinates(values) {
    let lng = Number(readValue(values, ["lng", "lon", "longitude", "x", "x97", "twd97x"]));
    let lat = Number(readValue(values, ["lat", "latitude", "y", "y97", "twd97y"]));

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      const coordinateText = readValue(values, ["location", "coordinate", "coordinates", "xy"]);
      const matches = String(coordinateText || "").match(/-?\d+(?:\.\d+)?/g) || [];
      if (matches.length >= 2) [lng, lat] = matches.slice(0, 2).map(Number);
    }

    if (lng > 10000 && lat > 10000) ({ lat, lng } = twd97ToWgs84(lng, lat));
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < 20 || lat > 27 || lng < 119 || lng > 123) {
      throw new Error("定位服務未回傳可辨識的新北市座標。");
    }
    return { lat, lng };
  }

  function parseResponse(text, contentType) {
    if (contentType.includes("json") || /^[\s]*[\[{]/.test(text)) {
      const data = JSON.parse(text);
      const values = Array.isArray(data) ? data[0] : data;
      const error = readValue(values, ["error", "message", "errormessage"]);
      if (error) throw new Error(String(error));
      return normalizeCoordinates(values);
    }

    const xml = new DOMParser().parseFromString(text, "application/xml");
    if (xml.querySelector("parsererror")) throw new Error("定位服務回傳格式錯誤。");
    const errorElement = xml.querySelector("Error, error");
    const errorMessage = errorElement?.getAttribute("Data") || errorElement?.textContent.trim();
    if (errorMessage) throw new Error(errorMessage);
    return normalizeCoordinates(collectXmlValues(xml));
  }

  function getApiError(xml) {
    const errorElement = xml.querySelector("Error, error");
    return errorElement?.getAttribute("Data") || errorElement?.textContent.trim() || "";
  }

  async function requestApi(params) {
    const response = await fetch(`${API_PATH}?${new URLSearchParams(params)}`, {
      headers: { Accept: "application/xml, application/json" },
    });
    const text = await response.text();
    if (!response.ok) throw new Error(`定位服務連線失敗（HTTP ${response.status}）。`);
    return { text, contentType: response.headers.get("content-type") || "" };
  }

  function collectSectionNames(value, result) {
    if (Array.isArray(value)) {
      value.forEach((item) => collectSectionNames(item, result));
      return;
    }
    if (value && typeof value === "object") {
      Object.values(value).forEach((item) => collectSectionNames(item, result));
      return;
    }
    String(value || "").split(/[,;|、\r\n]+/).forEach((part) => {
      const name = part.trim();
      if (/段$/.test(name) && !/getLandSection/i.test(name)) result.add(name);
    });
  }

  function parseLandSections(text, contentType) {
    const sections = new Set();
    if (contentType.includes("json") || /^[\s]*[\[{]/.test(text)) {
      const data = JSON.parse(text);
      const error = readValue(data, ["error", "message", "errormessage"]);
      if (error) throw new Error(String(error));
      collectSectionNames(data, sections);
    } else {
      const xml = new DOMParser().parseFromString(text, "application/xml");
      if (xml.querySelector("parsererror")) throw new Error("地段服務回傳格式錯誤。");
      const error = getApiError(xml);
      if (error) throw new Error(error);
      xml.querySelectorAll("*").forEach((element) => {
        if (element.children.length === 0) collectSectionNames(element.textContent, sections);
        Array.from(element.attributes).forEach((attribute) => collectSectionNames(attribute.value, sections));
      });
    }
    if (!sections.size) throw new Error("查無該行政區的地段資料。");
    return Array.from(sections).sort((left, right) => left.localeCompare(right, "zh-Hant"));
  }

  async function getLandSections(town) {
    if (!town?.trim()) return [];
    const { text, contentType } = await requestApi({ Cmd: "getLandSection", town: town.trim() });
    return parseLandSections(text, contentType);
  }

  async function locateLandNumber(params) {
    if (!params.town) throw new Error("請選擇行政區。");
    if (!params.landSection) throw new Error("請選擇地段。");
    if (!params.landNumberMom) throw new Error("請填寫地號母號。");
    if (!/^\d+$/.test(params.landNumberMom) || (params.landNumberSon && !/^\d+$/.test(params.landNumberSon))) {
      throw new Error("地號僅能輸入數字。");
    }
    const { text, contentType } = await requestApi({
      Cmd: "getLandNumberLoc",
      town: params.town,
      landSection: params.landSection,
      landNumberMom: params.landNumberMom.padStart(4, "0"),
      landNumberSon: (params.landNumberSon || "0").padStart(4, "0"),
    });
    return parseResponse(text, contentType);
  }

  function getCadastreValues() {
    return {
      town: document.getElementById("cadDistrictSelect")?.value || "",
      landSection: document.getElementById("cadSectionSelect")?.value || "",
      landNumberMom: document.getElementById("cadMotherNoInput")?.value.trim() || "",
      landNumberSon: document.getElementById("cadSubNoInput")?.value.trim() || "",
    };
  }

  function bindLandSectionSelect() {
    const districtSelect = document.getElementById("cadDistrictSelect");
    const sectionSelect = document.getElementById("cadSectionSelect");
    if (!districtSelect || !sectionSelect) return;
    let requestId = 0;
    const setPlaceholder = () => {
      sectionSelect.replaceChildren(new Option("請選擇", ""));
      sectionSelect.disabled = false;
    };
    setPlaceholder();
    districtSelect.addEventListener("change", async () => {
      const currentRequest = ++requestId;
      setPlaceholder();
      if (!districtSelect.value) return;
      try {
        const sections = await getLandSections(districtSelect.value);
        if (currentRequest !== requestId) return;
        setPlaceholder();
        sections.forEach((section) => sectionSelect.appendChild(new Option(section, section)));
      } catch (error) {
        if (currentRequest !== requestId) return;
        setPlaceholder();
        alert(error.message || "地段資料載入失敗，請稍後再試。");
      }
    });
  }

  async function locateAddress(params) {
    if (!params.town) throw new Error("請選擇行政區。");
    if (!params.addressInput) throw new Error("請填寫地址。");
    if (!params.addressNum) throw new Error("地址須包含門牌號碼，例如：三民路1段1號。");
    if (!params.addressRoad) throw new Error("請填寫完整地址。");

    const query = new URLSearchParams({
      Cmd: "getAddressLoc",
      town: params.town.trim(),
      addressRoad: params.addressRoad.trim(),
      addressNum: params.addressNum.trim(),
    });
    if (params.addressLane?.trim()) query.set("addressLane", params.addressLane.trim());
    if (params.addressLong?.trim()) query.set("addressLong", params.addressLong.trim());

    const { text, contentType } = await requestApi(Object.fromEntries(query));
    return parseResponse(text, contentType);
  }

  function getFormValues() {
    const town = document.getElementById("addrDistrictSelect")?.value || "";
    let address = document.getElementById("addrAddressInput")?.value.trim() || "";
    address = address.replace(/^新北市/, "");
    if (town && address.startsWith(town)) address = address.slice(town.length);

    const takeEndingPart = (pattern) => {
      const matched = address.match(pattern);
      if (!matched) return "";
      address = address.slice(0, -matched[1].length);
      return matched[1];
    };
    const addressNum = takeEndingPart(/([0-9０-９]+(?:之[0-9０-９]+)?號(?:之[0-9０-９]+)?)$/);
    const addressLong = takeEndingPart(/([0-9０-９]+(?:之[0-9０-９]+)?弄)$/);
    const addressLane = takeEndingPart(/([0-9０-９]+(?:之[0-9０-９]+)?巷)$/);

    return {
      town,
      addressInput: document.getElementById("addrAddressInput")?.value.trim() || "",
      addressRoad: address,
      addressLane,
      addressLong,
      addressNum,
    };
  }

  function formatAddress(params) {
    return `新北市${params.town}${params.addressRoad}${params.addressLane || ""}${params.addressLong || ""}${params.addressNum}`;
  }

  window.EIMPNTPCAddressLocation = {
    locateAddress,
    getFormValues,
    formatAddress,
    getLandSections,
    locateLandNumber,
    getCadastreValues,
    bindLandSectionSelect,
  };
})();
