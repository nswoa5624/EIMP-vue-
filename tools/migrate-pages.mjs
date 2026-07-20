import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const pageScripts = {
  air: ["ui-common.js", "air.js"],
  water: ["ui-common.js", "topic-common.js", "water.js"],
  waste: ["ui-common.js", "topic-common.js", "waste.js"],
  noise: ["ui-common.js", "topic-common.js", "noise.js"],
  decision: ["ui-common.js", "topic-common.js", "decision.js"],
};

mkdirSync(resolve("src", "legacy-pages"), { recursive: true });
mkdirSync(resolve("src", "entries"), { recursive: true });

for (const [page, scripts] of Object.entries(pageScripts)) {
  const source = readFileSync(resolve(`${page}.html`), "utf8");
  const head = source.match(/<head>([\s\S]*?)<\/head>/i)?.[1] ?? "";
  const bodyMatch = source.match(/<body([^>]*)>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) throw new Error(`${page}.html 找不到 body`);

  const bodyClass = bodyMatch[1].match(/class=["']([^"']*)["']/i)?.[1] ?? "";
  const bodyHtml = bodyMatch[2].replace(/\s*<script\b[^>]*>[\s\S]*?<\/script>\s*/gi, "\n").trim();
  writeFileSync(resolve("src", "legacy-pages", `${page}.html`), `${bodyHtml}\n`);

  const externalScripts = [...source.matchAll(/<script\b[^>]*src=["'](https?:\/\/[^"']+)["'][^>]*><\/script>/gi)]
    .map((match) => `  <script src="${match[1]}"></script>`)
    .join("\n");
  const cleanHead = head.replace(/\s*<script\b[^>]*>[\s\S]*?<\/script>\s*/gi, "\n").trim();

  const html = `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
${cleanHead}
  <link rel="stylesheet" href="/src/vue-host.css" />
</head>
<body class="${bodyClass}">
  <div id="app"></div>
${externalScripts}
  <script type="module" src="/src/entries/${page}.js"></script>
</body>
</html>
`;
  writeFileSync(resolve(`${page}.html`), html);

  const entry = `import bodyHtml from "../legacy-pages/${page}.html?raw";
import { createLegacyPage } from "../legacy/createLegacyPage.js";

createLegacyPage({
  bodyHtml,
  scripts: ${JSON.stringify(scripts.map((script) => `/${script}`))},
});
`;
  writeFileSync(resolve("src", "entries", `${page}.js`), entry);
}

writeFileSync(
  resolve("index.html"),
  `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>EIMP</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/entries/index.js"></script>
</body>
</html>
`,
);

writeFileSync(
  resolve("src", "entries", "index.js"),
  `import { createApp, h } from "vue";

createApp({ render: () => h("div") }).mount("#app");
window.location.replace("/air.html");
`,
);
