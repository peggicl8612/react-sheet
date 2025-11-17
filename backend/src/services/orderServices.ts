import { createGoogleForm } from '../config/googleAuth'
import { emailService } from './emailServe'
import { emailLogModel } from '../models/EmailLog'
import {getDefaultTemplate, getTemplateById} from '../templates/formTemplates.js'

export interface OrderCompletedEvent {
    orderId: string
    customerEmail: string
    customerName?: string
     templateId?: string // 可指定模板 ID
}

const getFormTemplate = (orderId: string, customerName?: string, templateId?: string) => {
    const template = templateId
        ? getTemplateById(templateId)
        : getDefaultTemplate()
    
    if (!template) {
        throw new Error(`模板${templateId}不存在`)
    }

    // 動態替換變數
    const title = template.title.replace('{orderId', orderId) || `訂單 ${orderId} 產品調查意見表`
    let description = template.description.replace('{customerName', customerName || '客戶'.replace('{orderId', orderId))
    
    if (!customerName) {
        description = description.replace(/親愛的\s*客戶[，,]\s*/g, '')
    }

    return {
        title,
        description,
        questions: template.questions,
    }
}

// 處理訂單完成事件
export const handleOrderCompleted = async (event: OrderCompletedEvent) => {
    const { orderId, customerEmail, customerName } = event

    try {
        // 步驟 1: 建立 Google 表單
        console.log(`[訂單完成] 開始為訂單 ${orderId} 建立表單...`)

        const formTemplate = getFormTemplate(orderId, customerName)
        const formUrl = await createGoogleForm(formTemplate)

        console.log(`[訂單完成] 表單建立成功: ${formUrl}`)

        // 步驟 2: 準備郵件內容
        const emailSubject = `訂單 ${orderId} 產品意見調查表單`
        const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { padding: 20px; background-color: #f9f9f9; border-radius: 0 0 5px 5px; }
          .button { display: inline-block; padding: 12px 24px; background-color: #4CAF50; 
                   color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>感謝您的訂購！</h1>
          </div>
          <div class="content">
            <p>親愛的 ${customerName || '客戶'}，</p>
            <p>感謝您完成訂單 <strong>${orderId}</strong>！</p>
            <p>為了持續改進我們的產品品質，誠摯邀請您填寫產品意見調查表單。您的寶貴意見對我們非常重要！</p>
            <div style="text-align: center;">
              <a href="${formUrl}" class="button">填寫產品意見調查</a>
            </div>
            <p>或複製以下連結到瀏覽器開啟：</p>
            <p style="word-break: break-all; color: #4CAF50; background: #f0f0f0; padding: 10px; border-radius: 3px;">${formUrl}</p>
            <p style="margin-top: 20px;">期待您的回饋！</p>
          </div>
          <div class="footer">
            <p>此郵件由系統自動發送，請勿回覆。</p>
          </div>
        </div>
      </body>
      </html>
    `

        // 步驟 3: 寄送郵件
        console.log(`[訂單完成] 開始寄送郵件給 ${customerEmail}...`)

        await emailService.sendFormLink({
            to: customerEmail,
            subject: emailSubject,
            html: emailHtml,
        })

        console.log(`[訂單完成] 郵件寄送成功`)

        // 步驟 4: 記錄到資料庫
        await emailLogModel.create({
            order_id: orderId,
            recipient_email: customerEmail,
            form_url: formUrl,
            status: 'success',
        })

  
        return {
            success: true,
            formUrl,
            message: '表單建立並郵件寄送成功',
        }
    } catch (error: any) {
        console.error(`[訂單完成] 處理失敗:`, error)

        // 記錄失敗到資料庫（使用 upsert，如果已存在就更新）
        try {
            await emailLogModel.create({
                order_id: orderId,
                recipient_email: customerEmail,
                form_url: '',
                status: 'failed',
                error_message: error.message,
            })
            console.log(`[訂單完成] 失敗記錄已儲存到 MongoDB`)
        } catch (dbError: any) {
            console.error('記錄失敗資訊到資料庫時發生錯誤:', dbError)
         }

        throw error
    }
}