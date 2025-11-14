import express from 'express'
import { emailLogModel } from '../models/EmailLog'

const router = express.Router()

// 查詢所有寄送紀錄（支援分頁）
router.get('/logs', async (req: any, res: any) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 50
    
    const result = await emailLogModel.findAll(page, limit)
    res.json({ success: true, ...result })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// 根據訂單 ID 查詢
router.get('/logs/order/:orderId', async (req: any, res: any) => {
  try {
    const logs = await emailLogModel.findByOrderId(req.params.orderId)
    res.json({ success: true, data: logs })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// 根據郵件地址查詢
router.get('/logs/email/:email', async (req: any, res: any) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 50
    
    const result = await emailLogModel.findByEmail(req.params.email, page, limit)
    res.json({ success: true, ...result })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// 根據狀態查詢
router.get('/logs/status/:status', async (req: any, res: any) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 50
    const status = req.params.status as 'success' | 'failed'
    
    if (status !== 'success' && status !== 'failed') {
      return res.status(400).json({ error: '無效的狀態值' })
    }
    
    const result = await emailLogModel.findByStatus(status, page, limit)
    res.json({ success: true, ...result })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// 取得統計資訊
router.get('/logs/stats', async (req: any, res: any) => {
  try {
    const stats = await emailLogModel.getStats()
    res.json({ success: true, data: stats })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export default router