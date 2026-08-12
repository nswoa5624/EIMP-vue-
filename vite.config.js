import { resolve } from "node:path";
import { defineConfig, loadEnv } from "vite";

const pages = ["index", "air", "water", "waste", "noise", "decision"];

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiKey = env.NTPC_GIS_API_KEY || "";
  const ntpcProxy = {
    target: "https://www.gis.ntpc.gov.tw",
    changeOrigin: true,
    secure: true,
    headers: { Referer: "http://211.21.98.79" },
    rewrite(path) {
      const requestUrl = new URL(path, "http://localhost");
      requestUrl.searchParams.set("Key", apiKey);
      return `/Func_Service/QueryFastLocAPI.aspx?${requestUrl.searchParams}`;
    },
  };

  return {
    server: { proxy: { "/api/ntpc-fast-location": ntpcProxy } },
    preview: { proxy: { "/api/ntpc-fast-location": ntpcProxy } },
    build: {
      rollupOptions: {
        input: Object.fromEntries(pages.map((page) => [page, resolve(`${page}.html`)])),
      },
    },
  };
});
