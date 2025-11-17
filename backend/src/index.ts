import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDatabase } from './config/database'
import formsRouter from './routes/form'
import authRouter from './routes/auth'
import ordersRouter from './routes/orders'
import emailLogRouter from './routes/emailLog'

dotenv.config()


const app = express()
const PORT = process.env.PORT || 3001

// 連接 MongoDB 資料庫
connectDatabase()

// CORS 設定：支援多個前端網域
// 標準化 URL（移除尾部斜線和協議後的斜線）
const normalizeOrigin = (url: string | undefined): string | undefined => {
    if (!url) return undefined
    return url.replace(/\/+$/, '') // 移除所有尾部斜線
}

const allowedOrigins = [
    'http://localhost:5173', // 開發環境
    normalizeOrigin(process.env.FRONTEND_URL), // 生產環境（從環境變數讀取）
].filter(Boolean) as string[] // 移除 undefined 值

app.use(cors({
    origin: (origin, callback) => {
        // 允許沒有 origin 的請求（例如 Postman、curl）
        if (!origin) return callback(null, true)
        
        // 標準化 origin（移除尾部斜線）
        const normalizedOrigin = normalizeOrigin(origin)
        
        // 檢查是否在允許的網域列表中（使用標準化後的 URL 比較）
        if (normalizedOrigin && allowedOrigins.includes(normalizedOrigin)) {
            // 返回標準化後的 origin（沒有尾部斜線）
            callback(null, normalizedOrigin)
        } else {
            // 如果設定了 FRONTEND_URL，也允許該網域的所有子網域（Vercel preview）
            const frontendUrl = normalizeOrigin(process.env.FRONTEND_URL)
            if (frontendUrl && normalizedOrigin && normalizedOrigin.startsWith(frontendUrl)) {
                callback(null, normalizedOrigin)
            } else {
                console.log('CORS blocked:', { origin, normalizedOrigin, allowedOrigins, frontendUrl })
                callback(new Error('Not allowed by CORS'))
            }
        }
    },
    credentials: true
}))

app.use(express.json())

// 路由
app.use('/api/forms', formsRouter)
app.use('/auth', authRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/emailLog', emailLogRouter)
app.get('/api/health', (req: any, res: any) => {
    res.json({status: 'ok', message: 'Server is running', database: 'connected'})
})

// 錯誤處理
app.use((err: any, req: any, res: any, next: any) => {
    console.error('Error:', err)
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})