import bodyHtml from "../legacy-pages/air.html?raw";
import { createLegacyPage } from "../legacy/createLegacyPage.js";
import "../business-location.css";

createLegacyPage({
  bodyHtml,
  scripts: ["/ui-common.js", "/side-menu-common.js", "/ntpc-address-location.js", "/location-tools.js", "/air.js", "/business-location.js", "/water-color-notification.js"],
});
