import { resolve } from "node:path";
import { defineConfig } from "vite";

const pages = ["index", "air", "water", "waste", "noise", "decision"];

export default defineConfig({
  build: {
    rollupOptions: {
      input: Object.fromEntries(pages.map((page) => [page, resolve(`${page}.html`)])),
    },
  },
});
