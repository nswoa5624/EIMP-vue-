import bodyHtml from "../legacy-pages/noise.html?raw";
import { createLegacyPage } from "../legacy/createLegacyPage.js";
import "../business-location.css";

createLegacyPage({
  bodyHtml,
  scripts: ["/ui-common.js", "/topic-common.js", "/noise.js", "/business-location.js"],
});
