import { createApp, h, nextTick } from "vue";
import PetitionPetAssistant from "../components/PetitionPetAssistant.js";
import "../components/petition-pet-assistant.css";

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`無法載入既有功能模組：${src}`));
    document.body.appendChild(script);
  });
}

export function createLegacyPage({ bodyHtml, scripts = [] }) {
  const app = createApp({
    name: "LegacyCompatiblePage",
    render() {
      return h("div", { class: "vue-page-shell" }, [
        h("div", {
          class: "vue-page-host",
          innerHTML: bodyHtml,
        }),
        h(PetitionPetAssistant),
      ]);
    },
    async mounted() {
      await nextTick();

      for (const script of scripts) {
        await loadScript(script);
      }

      // 若原生事件已發生，補送一次給動態載入、依賴此事件的既有模組。
      if (document.readyState !== "loading") {
        document.dispatchEvent(new Event("DOMContentLoaded"));
      }
    },
  });

  app.config.errorHandler = (error) => {
    console.error("EIMP Vue 頁面初始化失敗", error);
  };

  app.mount("#app");
}
