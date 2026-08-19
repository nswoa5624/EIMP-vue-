(function initWaterColorNotificationModule() {
  "use strict";

  const SCHEDULE_KEY = "eimp:water-color-notification:schedule";
  const ACTIVE_KEY = "eimp:water-color-notification:active";
  const NOTIFICATION_TAG = "eimp-water-color-alert";
  const DEMO_DELAY_MS = 5000;
  const originalTitle = document.title;
  let scheduledTimer = 0;
  let countdownTimer = 0;
  let titleTimer = 0;
  let titleFrame = 0;

  function parseStoredValue(key) {
    try { return JSON.parse(localStorage.getItem(key) || "null"); } catch (error) { return null; }
  }

  function isWaterPage() {
    return document.body.classList.contains("topic-water");
  }

  function getAlertRow(eventId) {
    return isWaterPage() ? document.querySelector(`.case-row[data-case-id="${eventId}"]`) : null;
  }

  function restoreTitle() {
    window.clearInterval(titleTimer);
    titleTimer = 0;
    titleFrame = 0;
    document.title = originalTitle;
  }

  function startTitleAlert(eventData) {
    if (isWaterPage() && !document.hidden) {
      restoreTitle();
      return;
    }
    if (titleTimer) return;

    const frames = [
      `🔴 1 件水色異常｜${eventData.time}`,
      `【待處理】${eventData.address}`,
    ];
    document.title = frames[0];
    titleTimer = window.setInterval(() => {
      titleFrame = (titleFrame + 1) % frames.length;
      document.title = frames[titleFrame];
    }, 900);
  }

  async function registerNotificationWorker() {
    if (!("serviceWorker" in navigator)) return null;
    try {
      return await navigator.serviceWorker.register("/water-notification-sw.js", { scope: "/" });
    } catch (error) {
      console.warn("水色辨識通知 Service Worker 註冊失敗", error);
      return null;
    }
  }

  async function requestNotificationPermission() {
    if (!("Notification" in window)) return "unsupported";
    if (Notification.permission !== "default") return Notification.permission;
    try { return await Notification.requestPermission(); } catch (error) { return "denied"; }
  }

  function setTestButtonState(state, seconds) {
    const button = document.getElementById("waterNotificationTestBtn");
    const label = button?.querySelector("[data-water-notification-label]");
    if (!button || !label) return;

    button.classList.toggle("is-counting", state === "counting");
    button.disabled = state === "requesting" || state === "counting";
    if (state === "requesting") label.textContent = "開啟中…";
    else if (state === "counting") label.textContent = `${seconds} 秒後通知`;
    else if (state === "denied") label.textContent = "通知未授權";
    else label.textContent = "測試通知";
  }

  function applyActiveAlert(eventData) {
    if (!eventData?.eventId) return;
    getAlertRow(eventData.eventId)?.classList.add("is-water-alert-flashing");
    window.dispatchEvent(new CustomEvent("eimp:pet-urgent-alert", { detail: eventData }));
    startTitleAlert(eventData);
  }

  async function showWindowsNotification(eventData) {
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    const registration = await registerNotificationWorker();
    if (!registration) return;
    await registration.showNotification("重要通知｜水色辨識異常", {
      body: `${eventData.time}\n${eventData.address}\n偵測到水色異常，請點擊查看地圖。`,
      icon: "/images/監視器辨識異常.png",
      badge: "/images/監視器辨識異常.png",
      image: "/images/water-alert-map.svg",
      tag: NOTIFICATION_TAG,
      renotify: true,
      requireInteraction: true,
      actions: [{ action: "view-map", title: "查看地圖" }],
      data: { eventId: eventData.eventId, url: `/water.html?waterAlert=${encodeURIComponent(eventData.eventId)}` },
    });
  }

  async function claimAndShowNotification(eventData) {
    const claim = async () => {
      const latest = parseStoredValue(SCHEDULE_KEY);
      if (!latest || latest.id !== eventData.id || latest.notifiedAt) return;
      latest.notifiedAt = Date.now();
      localStorage.setItem(SCHEDULE_KEY, JSON.stringify(latest));
      if (eventData.isDemo || document.hidden || !isWaterPage()) await showWindowsNotification(eventData);
    };

    if (navigator.locks?.request) {
      await navigator.locks.request("eimp-water-color-notification", claim);
    } else {
      await claim();
    }
  }

  function fireScheduledAlert(eventData) {
    window.clearTimeout(scheduledTimer);
    window.clearInterval(countdownTimer);
    setTestButtonState("idle");
    localStorage.setItem(ACTIVE_KEY, JSON.stringify(eventData));
    applyActiveAlert(eventData);
    claimAndShowNotification(eventData);
  }

  function armStoredSchedule(eventData) {
    window.clearTimeout(scheduledTimer);
    window.clearInterval(countdownTimer);
    if (!eventData?.triggerAt) return;

    const updateCountdown = () => {
      const remaining = Math.max(0, Math.ceil((eventData.triggerAt - Date.now()) / 1000));
      if (isWaterPage()) setTestButtonState("counting", remaining);
    };
    const remainingMs = eventData.triggerAt - Date.now();
    if (remainingMs <= 0) {
      if (!eventData.notifiedAt) fireScheduledAlert(eventData);
      return;
    }
    updateCountdown();
    countdownTimer = window.setInterval(updateCountdown, 250);
    scheduledTimer = window.setTimeout(() => fireScheduledAlert(eventData), remainingMs);
  }

  function clearAlertPresentation(eventId) {
    if (eventId) getAlertRow(eventId)?.classList.remove("is-water-alert-flashing");
    else document.querySelectorAll(".case-row.is-water-alert-flashing").forEach((row) => row.classList.remove("is-water-alert-flashing"));
    window.dispatchEvent(new CustomEvent("eimp:pet-urgent-alert-clear", { detail: { eventId } }));
    restoreTitle();
  }

  function acknowledgeAlert(eventId) {
    const active = parseStoredValue(ACTIVE_KEY);
    if (active?.eventId && active.eventId !== eventId) return;
    localStorage.removeItem(ACTIVE_KEY);
    clearAlertPresentation(eventId);
    navigator.serviceWorker?.getRegistration?.().then((registration) => {
      (navigator.serviceWorker.controller || registration?.active)?.postMessage({ type: "EIMP_CLOSE_WATER_ALERT" });
    });
  }

  function focusAlertOnMap(eventId, { acknowledge = false } = {}) {
    let attempts = 0;
    const findAndFocus = () => {
      const row = getAlertRow(eventId);
      if (!row && attempts++ < 30) {
        window.setTimeout(findAndFocus, 150);
        return;
      }
      if (!row) return;
      row.classList.add("is-water-alert-flashing");
      row.scrollIntoView({ behavior: "smooth", block: "center" });
      row.click();
      if (acknowledge) window.setTimeout(() => acknowledgeAlert(eventId), 800);
    };
    findAndFocus();
  }

  async function scheduleDemoAlert() {
    setTestButtonState("requesting");
    await registerNotificationWorker();
    const permission = await requestNotificationPermission();
    const eventData = {
      id: `water-demo-${Date.now()}`,
      eventId: "W-A001",
      time: "12/02 10:33",
      address: "淡水河忠孝碼頭附近",
      triggerAt: Date.now() + DEMO_DELAY_MS,
      permission,
      isDemo: true,
    };
    localStorage.removeItem(ACTIVE_KEY);
    clearAlertPresentation();
    localStorage.setItem(SCHEDULE_KEY, JSON.stringify(eventData));
    setTestButtonState(permission === "denied" ? "denied" : "counting", 5);
    armStoredSchedule(eventData);
  }

  function bindWaterPageControls() {
    const button = document.getElementById("waterNotificationTestBtn");
    if (!button || button.dataset.ready === "true") return;
    button.dataset.ready = "true";
    button.addEventListener("click", scheduleDemoAlert);

    document.getElementById("fireCasesContainer")?.addEventListener("click", (event) => {
      const row = event.target.closest(".case-row[data-case-id]");
      if (row) acknowledgeAlert(row.dataset.caseId);
    });

    const active = parseStoredValue(ACTIVE_KEY);
    if (active) applyActiveAlert(active);

    const eventIdFromUrl = new URLSearchParams(location.search).get("waterAlert");
    if (eventIdFromUrl) focusAlertOnMap(eventIdFromUrl, { acknowledge: true });
  }

  window.addEventListener("eimp:water-alert-focus", (event) => {
    const eventId = event.detail?.eventId || "W-A001";
    if (isWaterPage()) {
      focusAlertOnMap(eventId, { acknowledge: true });
      return;
    }
    location.href = `/water.html?waterAlert=${encodeURIComponent(eventId)}`;
  });

  document.addEventListener("visibilitychange", () => {
    const active = parseStoredValue(ACTIVE_KEY);
    if (!active) return restoreTitle();
    if (isWaterPage() && !document.hidden) restoreTitle();
    else startTitleAlert(active);
  });

  window.addEventListener("storage", (event) => {
    if (event.key === SCHEDULE_KEY && event.newValue) armStoredSchedule(parseStoredValue(SCHEDULE_KEY));
    if (event.key === ACTIVE_KEY) {
      const active = parseStoredValue(ACTIVE_KEY);
      if (active) applyActiveAlert(active);
      else clearAlertPresentation();
    }
  });

  navigator.serviceWorker?.addEventListener("message", (event) => {
    if (event.data?.type === "EIMP_FOCUS_WATER_ALERT") {
      focusAlertOnMap(event.data.eventId || "W-A001", { acknowledge: true });
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    bindWaterPageControls();
    registerNotificationWorker();
    armStoredSchedule(parseStoredValue(SCHEDULE_KEY));
    applyActiveAlert(parseStoredValue(ACTIVE_KEY));
  });
})();
