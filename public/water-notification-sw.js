const WATER_NOTIFICATION_TAG = "eimp-water-color-alert";
const APP_BASE_URL = new URL("./", self.location.href);
const appUrl = (path) => new URL(String(path).replace(/^\/+/, ""), APP_BASE_URL).href;

function normalizePushPayload(event) {
  const fallback = {
    title: "重要通知｜水色辨識異常",
    body: "偵測到水色異常，請點擊查看地圖。",
    eventId: "W-A001",
    url: appUrl("water.html?waterAlert=W-A001"),
  };
  if (!event.data) return fallback;
  try { return { ...fallback, ...event.data.json() }; } catch (error) {
    return { ...fallback, body: event.data.text() || fallback.body };
  }
}

self.addEventListener("push", (event) => {
  const payload = normalizePushPayload(event);
  event.waitUntil(Promise.all([
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: payload.icon || appUrl("images/監視器辨識異常.png"),
      badge: payload.badge || appUrl("images/監視器辨識異常.png"),
      tag: WATER_NOTIFICATION_TAG,
      renotify: true,
      timestamp: payload.timestamp || Date.now(),
      data: { eventId: payload.eventId, url: payload.url },
    }),
    self.registration.setAppBadge?.(payload.badgeCount || 1),
  ]));
});

self.addEventListener("notificationclick", (event) => {
  const targetUrl = new URL(event.notification.data?.url || "water.html", APP_BASE_URL).href;
  const eventId = event.notification.data?.eventId || "W-A001";
  event.notification.close();

  event.waitUntil((async () => {
    await self.registration.clearAppBadge?.();
    const windowClients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    const waterClient = windowClients.find((client) => {
      try { return new URL(client.url).pathname.endsWith("/water.html"); } catch (error) { return false; }
    });

    if (waterClient) {
      await waterClient.focus();
      waterClient.postMessage({ type: "EIMP_FOCUS_WATER_ALERT", eventId });
      return;
    }

    const appClient = windowClients[0];
    if (appClient && "navigate" in appClient) {
      const navigatedClient = await appClient.navigate(targetUrl);
      await navigatedClient?.focus();
      return;
    }

    await self.clients.openWindow(targetUrl);
  })());
});

self.addEventListener("message", (event) => {
  if (event.data?.type !== "EIMP_CLOSE_WATER_ALERT") return;
  event.waitUntil(self.registration.getNotifications({ tag: WATER_NOTIFICATION_TAG }).then((notifications) => {
    notifications.forEach((notification) => notification.close());
  }));
});
