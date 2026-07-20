import bodyHtml from "../legacy-pages/waste.html?raw";
import { createLegacyPage } from "../legacy/createLegacyPage.js";

createLegacyPage({
  bodyHtml,
  scripts: ["/ui-common.js","/topic-common.js","/waste.js"],
});
