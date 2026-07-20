import bodyHtml from "../legacy-pages/noise.html?raw";
import { createLegacyPage } from "../legacy/createLegacyPage.js";

createLegacyPage({
  bodyHtml,
  scripts: ["/ui-common.js","/topic-common.js","/noise.js"],
});
