import bodyHtml from "../legacy-pages/waste.html?raw";
import { createLegacyPage } from "../legacy/createLegacyPage.js";
import "../business-location.css";

createLegacyPage({
  bodyHtml,
  scripts: ["/ui-common.js", "/topic-common.js", "/waste.js", "/business-location.js"],
});
