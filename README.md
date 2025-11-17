# Google Forms 自動生成系統

一個全端應用程式，用於自動建立 Google Forms 表單，支援手動建立和訂單完成後自動化流程。

## 🌐 線上版本

- **前端應用**：https://react-sheet-wvmz.vercel.app/
- **後端 API**：https://peggy-google-form-generator.onrender.com

> 💡 **提示**：線上版本已部署並可直接使用，無需本地安裝即可體驗完整功能！

## 📋 專案簡介

本專案提供了一個完整的 Google Forms 自動生成解決方案，包含：

- **前端介面**：直觀的表單建立工具，支援多種問題類型和模板
- **後端 API**：處理 Google OAuth 認證、表單建立、郵件發送等功能
- **自動化流程**：訂單完成後自動建立表單並發送郵件給客戶
- **日誌追蹤**：完整的郵件發送記錄和查詢功能

## Commit Message Style

```
feat: 新增新功能
fix: 修復問題/BUG
style: 代碼風格相關無影響運行結果的
perf: 優化/性能提升
refactor: 重構
revert: 撤銷修改
test: 測試相關
docs: 文檔/注釋
chore: 依賴更新/腳手架配置修改等
workflow: 工作流改進
ci: 持續集成
types: 類型定義文件更改
wip: 開發中
```

## ✨ 主要功能

### 前端功能

- Google OAuth 認證整合
- 視覺化表單建立介面
- 多種問題類型支援（簡答、單選、複選、日期）
- 表單模板系統（空白表單、客戶滿意度調查、產品意見表）
- 明暗主題切換
- 即時表單預覽和連結生成

### 後端功能

- Google Forms API 整合
- OAuth 2.0 認證與 Token 管理
- 批次處理表單問題（優化效能）
- Gmail SMTP 郵件發送
- MongoDB 資料庫整合
- 郵件日誌記錄與查詢
- 訂單完成自動化流程

## 🛠 技術棧

### 前端

- **框架**: React 19 + TypeScript
- **建置工具**: Vite 7
- **樣式**: Tailwind CSS 4
- **動畫**: Framer Motion
- **HTTP 客戶端**: Axios

### 後端

- **框架**: Node.js + Express 5
- **語言**: TypeScript
- **資料庫**: MongoDB (Mongoose)
- **認證**: Google OAuth 2.0
- **API**: Google Forms API v1
- **郵件**: Nodemailer (Gmail SMTP)

## 📁 專案結構

```
react-sheet/
├── frontend/                 # React 前端應用
│   ├── src/
│   │   ├── components/       # React 元件
│   │   │   ├── FormGenerator/    # 表單生成器
│   │   │   ├── ThemeToggle/      # 主題切換
│   │   │   └── FollowingPointer/ # 互動效果
│   │   ├── App.tsx          # 主應用元件
│   │   └── main.tsx         # 應用入口
│   ├── package.json
│   └── vite.config.ts       # Vite 設定
│
├── backend/                 # Node.js 後端 API
│   ├── src/
│   │   ├── config/          # 設定檔
│   │   │   ├── googleAuth.ts    # Google OAuth 設定
│   │   │   └── database.ts      # MongoDB 連線
│   │   ├── routes/          # API 路由
│   │   │   ├── auth.ts          # 認證路由
│   │   │   ├── form.ts          # 表單建立路由
│   │   │   ├── orders.ts        # 訂單路由
│   │   │   └── emailLog.ts      # 郵件日誌路由
│   │   ├── services/        # 業務邏輯
│   │   │   ├── orderServices.ts # 訂單服務
│   │   │   └── emailServe.ts    # 郵件服務
│   │   ├── models/          # 資料模型
│   │   │   └── EmailLog.ts      # 郵件日誌模型
│   │   └── index.ts         # 伺服器入口
│   ├── package.json
│   └── .env                 # 環境變數（需自行建立）
│
└── shared/                  # 共享資源
    └── templates/           # 表單模板
        └── formTemplates.ts
```

## 🚀 快速開始

### 方式一：使用線上版本（推薦）

直接訪問 [https://react-sheet-wvmz.vercel.app/](https://react-sheet-wvmz.vercel.app/) 即可使用，無需安裝！

### 方式二：本地開發

#### 前置需求

- Node.js 18+
- MongoDB 資料庫
- Google Cloud Platform 專案（用於 OAuth）
- Gmail 應用程式密碼（用於郵件發送）

### 1. 安裝依賴

```bash
# 安裝後端依賴
cd backend
npm install

# 安裝前端依賴
cd ../frontend
npm install
```

### 2. 環境變數設定

在 `backend/` 目錄下建立 `.env` 檔案：

```env
# 伺服器設定
PORT=3001
FRONTEND_URL=http://localhost:5173

# MongoDB 連線
MONGODB_URI=mongodb://localhost:27017/react-sheet

# Google OAuth 設定
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3001/auth/google/callback

# Gmail SMTP 設定
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_app_password
```

### 3. Google Cloud Platform 設定

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 建立新專案或選擇現有專案
3. 啟用 **Google Forms API** 和 **Google Drive API**
4. 建立 OAuth 2.0 憑證
5. 設定授權重新導向 URI：`http://localhost:3001/auth/google/callback`
6. 下載憑證 JSON 檔案，放置於 `backend/client-secret.json`

### 4. 啟動應用

```bash
# 終端機 1：啟動後端伺服器
cd backend
npm run dev

# 終端機 2：啟動前端開發伺服器
cd frontend
npm run dev
```

應用程式將在以下位置運行：

- 前端：http://localhost:5173
- 後端：http://localhost:3001

## 📡 API 端點

### 認證相關

- `GET /auth/google` - 取得 Google OAuth 認證 URL
- `GET /auth/google/callback` - OAuth 回調處理
- `GET /auth/status` - 檢查認證狀態

### 表單相關

- `POST /api/forms/create` - 建立 Google 表單
  ```json
  {
    "title": "表單標題",
    "description": "表單說明",
    "questions": [
      {
        "text": "問題內容",
        "type": "text|multipleChoice|checkbox|date",
        "required": true,
        "options": ["選項1", "選項2"] // 僅單選/複選需要
      }
    ]
  }
  ```

### 訂單相關

- `POST /api/orders/completed` - 處理訂單完成事件
  ```json
  {
    "orderId": "ORDER123",
    "customerEmail": "customer@example.com",
    "customerName": "客戶名稱",
    "orderDetails": {},
    "templateId": "product-feedback" // 可選
  }
  ```

### 郵件日誌相關

- `GET /api/emailLog/logs` - 查詢所有郵件紀錄（支援分頁）
  - Query: `?page=1&limit=50`
- `GET /api/emailLog/logs/order/:orderId` - 根據訂單 ID 查詢
- `GET /api/emailLog/logs/email/:email` - 根據郵件地址查詢
- `GET /api/emailLog/logs/status/:status` - 根據狀態查詢（success/failed）
- `GET /api/emailLog/logs/stats` - 取得統計資訊

### 健康檢查

- `GET /api/health` - 伺服器健康狀態

## 💡 使用說明

### 手動建立表單

1. 開啟前端應用（http://localhost:5173）
2. 點擊「使用 Google 帳號登入」進行認證
3. 選擇表單模板或使用空白表單
4. 填寫表單標題和說明
5. 新增問題並設定類型：
   - **簡答**：文字輸入
   - **單選**：單選選項（需新增選項）
   - **複選**：多選選項（需新增選項）
   - **日期**：日期選擇器
6. 點擊「建立 Google 表單」
7. 取得表單連結並可複製分享

### 自動化流程（訂單完成）

當訂單完成時，系統會自動：

1. 根據模板建立 Google 表單
2. 準備 HTML 郵件內容
3. 透過 Gmail SMTP 發送郵件給客戶
4. 記錄到 MongoDB 資料庫

範例 API 呼叫：

```bash
curl -X POST http://localhost:3001/api/orders/completed \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "ORDER123",
    "customerEmail": "customer@example.com",
    "customerName": "張三"
  }'
```

## 🔧 技術細節

### 批次處理優化

專案使用 Google Forms API 的 `batchUpdate` 方法進行批次處理，將所有問題合併到一次 API 呼叫中：

**優勢：**

- ✅ **效能提升**：減少 API 呼叫次數（從 N 次減少到 1 次）
- ✅ **原子性**：所有操作要麼全部成功，要麼全部失敗
- ✅ **降低延遲**：減少網路往返時間
- ✅ **避免速率限制**：減少觸發 Google API 速率限制的風險

### Token 管理

- OAuth Token 儲存在 `backend/token.json`
- 自動檢測 Token 過期並刷新
- 支援離線存取（offline access）

### 表單模板系統

模板定義在 `shared/templates/formTemplates.ts`，包含：

- 空白表單
- 客戶滿意度調查表
- 產品意見表

可輕鬆擴充新模板。

## 📝 開發說明

### 後端開發

```bash
cd backend
npm run dev  # 開發模式（自動重載）
npm start    # 生產模式
```

### 前端開發

```bash
cd frontend
npm run dev    # 開發伺服器
npm run build  # 建置生產版本
npm run preview # 預覽生產版本
```

## 🚢 部署說明

### 前端部署（Vercel）

1. 將專案推送到 GitHub
2. 在 [Vercel](https://vercel.com) 匯入專案
3. 設定 Root Directory 為 `frontend`
4. 新增環境變數：
   - `VITE_API_URL` = `https://peggy-google-form-generator.onrender.com`
5. 部署完成

### 後端部署（Render）

1. 在 [Render](https://render.com) 建立新的 Web Service
2. 連接 GitHub 儲存庫
3. 設定：
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Root Directory: `backend`
4. 新增環境變數：
   - `FRONTEND_URL` = `https://react-sheet-wvmz.vercel.app`
   - `GOOGLE_REDIRECT_URI` = `https://peggy-google-form-generator.onrender.com/auth/google/callback`
   - `GOOGLE_CLIENT_ID` = 你的 Google Client ID
   - `GOOGLE_CLIENT_SECRET` = 你的 Google Client Secret
   - `MONGODB_URI` = 你的 MongoDB 連線字串
   - `GMAIL_USER` = 你的 Gmail 帳號
   - `GMAIL_APP_PASSWORD` = 你的 Gmail 應用程式密碼
5. 上傳 `backend/client-secret.json` 到 Render（透過環境變數或 Secrets）
6. 在 Google Cloud Console 新增 Redirect URI：`https://peggy-google-form-generator.onrender.com/auth/google/callback`

## 🔒 安全性注意事項

- ⚠️ 不要將 `.env` 檔案提交到版本控制
- ⚠️ `token.json` 和 `client-secret.json` 應加入 `.gitignore`
- ⚠️ 生產環境請使用 HTTPS
- ⚠️ 妥善保管 Gmail 應用程式密碼

## 📄 授權

ISC License

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📞 聯絡方式

如有問題或建議，請開啟 Issue。

---

**注意**：本專案需要有效的 Google Cloud Platform 專案和 MongoDB 資料庫才能正常運行。
