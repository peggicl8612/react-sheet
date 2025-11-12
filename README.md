react-sheet/
├── frontend/ # React 前端應用
│ ├── src/
│ │ ├── components/
│ │ │ ├── FormGenerator.tsx # 表單生成器主元件
│ │ │ └── FormGenerator.css # 元件樣式
│ │ ├── App.tsx # 應用主元件
│ │ ├── App.css # 應用樣式
│ │ └── main.tsx # 應用入口
│ ├── package.json
│ └── vite.config.ts # Vite 設定
│
├── backend/ # Node.js 後端 API
│ ├── src/
│ │ ├── index.ts # 伺服器入口
│ │ ├── config/
│ │ │ └── googleAuth.ts # Google OAuth 設定
│ │ └── routes/
│ │ ├── auth.ts # 認證路由
│ │ └── form.ts # 表單建立路由
│ ├── package.json
│ └── .env # 環境變數（需設定）
│
└── README.md
