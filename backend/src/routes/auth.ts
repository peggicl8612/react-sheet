import express from 'express'
import { getAuthUrl, getTokenFromCode, isAuthenticated } from '../config/googleAuth'

const router = express.Router()

// 取得認證 URL
router.get('/google', (req: any, res: any) => {
    try {
        const authUrl = getAuthUrl()
        res.json({ authUrl })
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
})

// OAuth 回調處理
router.get('/google/callback', async (req: any, res: any) => {
    try {
        const { code } = req.query
        
        if (!code) {
            return res.status(400).json({ error: '缺少授權碼' })
        }

        await getTokenFromCode(code as string)
        
        // 重導向到前端，顯示成功訊息
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
        res.redirect(`${frontendUrl}?auth=success`)
    } catch (error: any) {
        console.error('OAuth callback error:', error)
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
        res.redirect(`${frontendUrl}?auth=error&message=${encodeURIComponent(error.message)}`)
    }
})

// 檢查認證狀態
router.get('/status', (req: any, res: any) => {
    try {
        const authenticated = isAuthenticated()
        res.json({ authenticated })
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
})

export default router