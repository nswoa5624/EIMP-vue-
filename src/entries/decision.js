import bodyHtml from "../legacy-pages/decision.html?raw";
import { createLegacyPage } from "../legacy/createLegacyPage.js";

createLegacyPage({
  bodyHtml,
  scripts: ["/ui-common.js","/topic-common.js","/decision.js"],
});
