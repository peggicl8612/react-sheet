import express from 'express'
import { createGoogleForm } from '../config/googleAuth'

const router = express.Router()

// 建立 Google form
router.post('/create', async (req: any, res: any) => {
    try {
        const { title, description, questions } = req.body
        
        if (!title || !questions || questions.length === 0) {
            return res.status(400).json({
                error: '標題和至少一個問題是必需的'
            })
        }

        const formUrl = await createGoogleForm({
            title,
            description: description || '',
            questions
        })

        res.json({
            success: true,
            formUrl
        })
    } catch (error: any) {
        console.error('Error creating form:', error)
        res.status(500).json({
            error: '建立表單失敗',
            message: error.message || '未知錯誤'
        })
    }
})

export default router
