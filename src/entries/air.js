import bodyHtml from "../legacy-pages/air.html?raw";
import { createLegacyPage } from "../legacy/createLegacyPage.js";

createLegacyPage({
  bodyHtml,
  scripts: ["/ui-common.js","/air.js"],
});
