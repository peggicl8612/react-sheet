import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import formsRouter from './routes/form'
import authRouter from './routes/auth'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}))

app.use(express.json())

// 路由
app.use('/api/forms', formsRouter)
app.use('/auth', authRouter)

app.get('/api/health', (req: any, res: any) => {
    res.json({status: 'ok', message: 'Server is running'})
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