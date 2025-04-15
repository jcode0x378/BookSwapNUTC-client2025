# BookSwapNUTC 客戶端

## 專案簡介

BookSwapNUTC 是一個為 NUTC 學生設計的二手教科書交換平台。該平台旨在幫助學生買賣或交換不再需要的教科書，減少浪費並為學生節省開支。

本倉庫包含 BookSwapNUTC 的前端/客戶端程式碼，使用 Vue、TypeScript 和 Vite 構建。

## 技術棧

- **前端框架**：Vue.js
- **開發語言**：TypeScript
- **構建工具**：Vite
- **樣式**：CSS/SCSS
- **狀態管理**：Vuex/Pinia
- **路由**：Vue Router

## 功能特點

- 用戶註冊和登入系統
- 書籍列表瀏覽與搜尋
- 發佈二手書籍信息
- 個人帳戶管理
- 書籍交易記錄
- 響應式設計，支援行動裝置和桌面端

## 開始使用

### 前提條件

- Node.js (版本 14.0.0 或更高)
- npm 或 yarn

### 安裝步驟

1. 克隆倉庫

```bash
git clone https://github.com/yourusername/BookSwapNUTC-Client.git
cd BookSwapNUTC-Client
```

2. 安裝依賴

```bash
npm install
# 或使用yarn
yarn install
```

3. 配置環境變數
   在專案根目錄創建`.env`檔案，並設置必要的環境變數：

```
VITE_API_URL=http://localhost:3000/api
```

4. 啟動開發伺服器

```bash
npm run dev
# 或使用yarn
yarn dev
```

5. 構建生產版本

```bash
npm run build
# 或使用yarn
yarn build
```

## 專案結構

```
BookSwapNUTC-Client/
├── public/             # 靜態資源
├── src/                # 源代碼
│   ├── assets/         # 圖片、字體等資源
│   ├── components/     # 可復用的組件
│   ├── store/          # Vuex/Pinia 狀態管理
│   ├── composables/    # Vue 組合式函數
│   ├── views/          # 頁面視圖
│   ├── services/       # API服務
│   ├── types/          # TypeScript類型定義
│   ├── utils/          # 工具函數
│   ├── App.vue         # 應用入口組件
│   └── main.ts         # 應用入口檔案
├── index.html          # HTML模板
├── tsconfig.json       # TypeScript配置
├── vite.config.js      # Vite配置
└── README.md           # 專案文檔
```

## 部署

專案構建後，`dist`目錄中的檔案可以部署到任何靜態檔案伺服器上。

## 貢獻指南

1. Fork 本倉庫
2. 創建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 將您的更改推送到分支 (`git push origin feature/amazing-feature`)
5. 開啟一個 Pull Request

## 相關專案

- [BookSwapNUTC-Server](https://github.com/yourusername/BookSwapNUTC-Server) - 後端伺服器

## 許可證

本專案採用 MIT 許可證 - 詳見 LICENSE 檔案

## 聯絡方式

專案負責人 - [您的姓名](mailto:your.email@example.com)

專案連結: [https://github.com/yourusername/BookSwapNUTC-Client](https://github.com/yourusername/BookSwapNUTC-Client)
