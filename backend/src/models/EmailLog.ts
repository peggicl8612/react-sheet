import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IEmailLog extends Document { 
    order_id: string;
    recipient_email: string;
    form_url?: string;
    status: 'success' | 'failed';
    error_message?: string;
    created_at: Date;
 }


const EmailLogSchema: Schema = new Schema({
    order_id: {
        type: String,
        required: true,
        index: true,
     },
    recipient_email: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    form_url: {
        type: String,
        required: false,
        default: '',
    },
    status: {
        type: String,
        enum: ['success', 'failed'],
        required: true,
        index: true,
    },
    error_message: {
        type: String,
        default: null,
    },
    created_at: {
        type: Date,
        default: Date.now,
        index: true,
    }
}, {
    timestamps: true,
    collection: 'email_logs'
})

EmailLogSchema.index({ order_id: 1, created_at: -1 })
EmailLogSchema.index({ recipient_email: 1, created_at: -1 })

// 匯出模型
const EmailLog: Model<IEmailLog> = mongoose.model<IEmailLog>('EmailLog', EmailLogSchema)
export default EmailLog

export const emailLogModel = {
    // 建立寄送紀錄（使用 upsert，如果已存在就更新）
    create: async (logData: {
        order_id: string
        recipient_email: string
        form_url: string
        status: 'success' | 'failed'
        error_message?: string
    }) => {
        // 使用 findOneAndUpdate 搭配 upsert，如果已存在就更新，不存在就新增
        const log = await EmailLog.findOneAndUpdate(
            { order_id: logData.order_id },
            {
                $set: {
                    recipient_email: logData.recipient_email,
                    form_url: logData.form_url,
                    status: logData.status,
                    error_message: logData.error_message,
                    updatedAt: new Date()
                }
            },
            {
                upsert: true,  // 如果不存在就新增
                new: true,     // 返回更新後的文檔
                setDefaultsOnInsert: true  // 新增時設置預設值
            }
        )
        return log
    },

    // 查詢寄送紀錄
    findAll: async (page: number = 1, limit: number = 50) => { 
        // 計算跳過的筆記
        const skip = (page - 1) * limit
        const logs = await EmailLog.find()
            .sort({ created_at: -1 })
            .skip(skip)
            .limit(limit)
            .lean()
        
        const total = await EmailLog.countDocuments()

        return {
            data: logs,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            }
        }
    },

    // 根據訂單 ID 查詢
  findByOrderId: async (orderId: string) => {
    return await EmailLog.find({ order_id: orderId })
      .sort({ created_at: -1 })
      .lean()
  },

  // 根據郵件地址查詢
  findByEmail: async (email: string, page: number = 1, limit: number = 50) => {
    const skip = (page - 1) * limit
    const logs = await EmailLog.find({ recipient_email: email })
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
    
    const total = await EmailLog.countDocuments({ recipient_email: email })
    
    return {
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  },

  // 根據狀態查詢
  findByStatus: async (status: 'success' | 'failed', page: number = 1, limit: number = 50) => {
    const skip = (page - 1) * limit
    const logs = await EmailLog.find({ status })
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
    
    const total = await EmailLog.countDocuments({ status })
    
    return {
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  },

  // 統計資訊
  getStats: async () => {
    const total = await EmailLog.countDocuments()
    const success = await EmailLog.countDocuments({ status: 'success' })
    const failed = await EmailLog.countDocuments({ status: 'failed' })
    
    return {
      total,
      success,
      failed,
      successRate: total > 0 ? ((success / total) * 100).toFixed(2) + '%' : '0%'
    }
  }
}

