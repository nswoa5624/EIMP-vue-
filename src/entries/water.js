import bodyHtml from "../legacy-pages/water.html?raw";
import { createLegacyPage } from "../legacy/createLegacyPage.js";

createLegacyPage({
  bodyHtml,
  scripts: ["/ui-common.js","/topic-common.js","/water.js"],
});
