const WATER_NOTIFICATION_TAG = "eimp-water-color-alert";

self.addEventListener("notificationclick", (event) => {
  const targetUrl = new URL(event.notification.data?.url || "/water.html", self.location.origin).href;
  const eventId = event.notification.data?.eventId || "W-A001";
  event.notification.close();

  event.waitUntil((async () => {
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
