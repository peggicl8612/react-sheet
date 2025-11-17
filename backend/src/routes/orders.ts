import express from 'express'
import { handleOrderCompleted, OrderCompletedEvent } from '../services/orderServices'

const router = express.Router()

// 訂單完成事件 API
router.post('/completed', async (req: any, res: any) => {
    try {
        const { orderId, customerEmail, customerName } = req.body

        if (!orderId || !customerEmail) {
            return res.status(400).json({
                error: 'orderId 和 customerEmail 是必需的',
            })
        }

        const event: OrderCompletedEvent = {
            orderId,
            customerEmail,
            customerName,
         }

        const result = await handleOrderCompleted(event)

        res.json({
            success: true,
            data: result,
        })
    } catch (error: any) {
        console.error('Order completed error:', error)
        res.status(500).json({
            error: '處理訂單完成事件失敗',
            message: error.message || '未知錯誤',
        })
    }
})

export default router

