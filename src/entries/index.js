import { createApp, h } from "vue";

createApp({ render: () => h("div") }).mount("#app");
window.location.replace(new URL("air.html", new URL(import.meta.env.BASE_URL, document.baseURI)));
