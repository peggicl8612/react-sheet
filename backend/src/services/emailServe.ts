import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

// 建立 Gmail SMTP transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER || process.env.EMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASSWORD,
    },
})

export interface EmailOptions {
    to: string
    subject: string
    html: string
}

export const emailService = {
    // 寄送表單連結郵件
    sendFormLink: async (options: EmailOptions) => {
        try {
            const mailOptions = {
                from: process.env.GMAIL_USER || process.env.EMAIL_USER,
                to: options.to,
                subject: options.subject,
                html: options.html,
            }

            const info = await transporter.sendMail(mailOptions)
            return {
                success: true,
                messageId: info.messageId,
            }
        } catch (error: any) {
            console.error('Email send error:', error)
            throw new Error(`寄送郵件失敗: ${error.message}`)
        }
    },

    // 驗證郵件設定
    verify: async () => {
        try {
            await transporter.verify()
            return { success: true, message: '郵件服務設定正確' }
        } catch (error: any) {
            return { success: false, message: error.message }
        }
    },
}