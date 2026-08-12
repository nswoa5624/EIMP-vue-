# EIMP Vue 版本

本專案已由原生 HTML/CSS/JavaScript 調整為 Vue 3 + Vite 多頁式專案，保留既有的版面、頁面網址與互動功能。

## 頁面

- `air.html`：空氣主題
- `water.html`：水主題
- `waste.html`：廢棄物主題
- `noise.html`：噪音主題
- `decision.html`：決策頁面
- `index.html`：自動導向空氣主題

## 專案結構

- `src/entries/`：各頁面的 Vue 進入點
- `src/legacy-pages/`：保留原版 DOM 結構的頁面內容
- `src/legacy/createLegacyPage.js`：Vue 掛載與既有功能模組載入器
- `public/`：圖片、地圖資料、PDF 與既有功能模組
- `vite.config.js`：Vite 多頁式建置設定

## 本機啟動

請先安裝 Node.js，再於專案目錄執行：

```bash
pnpm install
pnpm dev
```

終端機會顯示本機網址，通常是 `http://localhost:5173/`。

正式建置：

```bash
pnpm build
```

輸出會放在 `dist/`，此目錄不納入 Git。

## 新北市地址定位 API

複製 `.env.example` 為 `.env`，並填入新北市 GIS 核發的系統授權資訊：

```dotenv
NTPC_GIS_API_KEY=你的系統授權資訊
```

開發與本機預覽時，Vite 會透過 `/api/ntpc-fast-location` 代理呼叫新北市 GIS，並由伺服器端加入 `Referer: http://211.21.98.79`，授權資訊不會送進前端程式碼。正式部署靜態檔案時，Web Server 也必須將同一路徑反向代理至 `https://www.gis.ntpc.gov.tw/Func_Service/QueryFastLocAPI.aspx`，並加入相同的 `Referer` 與 `Key`。

## Git 分支

- `main`：轉換前的原始靜態版本
- `feature/vue-migration`：Vue 3 + Vite 版本

切換版本：

```bash
git switch main
git switch feature/vue-migration
```

## 推送到 GitHub 練習

先在 GitHub 建立一個空白 repository，不要勾選自動建立 README，然後執行：

```bash
git remote add origin https://github.com/你的帳號/你的儲存庫.git
git push -u origin main
git push -u origin feature/vue-migration
```

接著可在 GitHub 上由 `feature/vue-migration` 對 `main` 建立 Pull Request，練習檢視變更與合併。

若已經有 `origin`，請用以下指令確認，不要重複新增：

```bash
git remote -v
```
