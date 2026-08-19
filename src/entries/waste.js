import bodyHtml from "../legacy-pages/waste.html?raw";
import { createLegacyPage } from "../legacy/createLegacyPage.js";
import "../business-location.css";

createLegacyPage({
  bodyHtml,
  scripts: ["/ui-common.js", "/ntpc-address-location.js", "/location-tools.js", "/topic-common.js", "/waste.js", "/business-location.js", "/water-color-notification.js"],
});
