import { google } from 'googleapis'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config()

// Token 儲存路徑
const TOKEN_PATH = path.join(process.cwd(), 'token.json')

// Google OAuth2 設定
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
)

// 載入已儲存的 token
export function loadSavedToken() {
    try {
        // 檢查 token 是否存在
        if (fs.existsSync(TOKEN_PATH)) { 
            const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'))
            oauth2Client.setCredentials(token)
            return token
        }
    } catch (error) {
        console.error('Error loading token:', error)
    }
    return null
}

// 儲存 token
export function saveToken(token: any) {
    try {
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(token))
        oauth2Client.setCredentials(token)
    } catch (error) {
        console.error('Error saving token:', error)
    }
}

// 取得認證 URL
export function getAuthUrl() {
    const scopes = [
        'https://www.googleapis.com/auth/forms',
        'https://www.googleapis.com/auth/drive.file'
    ]
    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent'
    })
}

// 使用 code 取得 token
export async function getTokenFromCode(code: string) {
    try {
        const { tokens } = await oauth2Client.getToken(code)
        saveToken(tokens)
    } catch (error) {
        console.error('Error getting token from code:', error)
        throw error
    }
}

// 檢查是否已認證
export function isAuthenticated() {
    const token = loadSavedToken()
    return token && token.access_token
}


 

// 建立 Google form 函數
export async function createGoogleForm({ title, description, questions }: any) {
    try {
        // 載入 token
        const token = loadSavedToken()

        if (!token || !token.access_token) {
            throw new Error('請先進行 Google OAuth 認證')
        }

        // 確保 token 有效
        oauth2Client.setCredentials(token)

        // 若 token 過期，嘗試刷新
        if (token.expiry_date && token.expiry_date <= Date.now()) {
            try {
                const { credentials } = await oauth2Client.refreshAccessToken()
                saveToken(credentials)
                oauth2Client.setCredentials(credentials)
            } catch (error) {
                throw new Error('Token 過期，請重新認證')
            }
        }
    
  
      const forms = google.forms({
        version: 'v1',
        auth: oauth2Client
      })
  
      // 建立新表單
      const formResponse = await forms.forms.create({
        requestBody: {
          info: {
            title: title,
           }
        }
      })
  
        const formId = formResponse.data.formId
        
 // 如果有 description，使用 batchUpdate 更新表單描述
 if (description && description.trim() !== '') {
    await forms.forms.batchUpdate({
        formId: formId as string,
        requestBody: {
            requests: [{
                updateFormInfo: {
                    info: {
                        description: description
                    },
                    updateMask: 'description'
                }
            }]
        }
    })
}

  
      // 新增問題到表單（批次處理）
      if (questions && questions.length > 0) {
          const requests = questions.map((question, index) => {
              const questionItem = getQuestionItem(
                  question.type,
                  question.options,
                  question.required !== undefined ? question.required : false
              )
              
              return {
                  createItem: {
                      item: {
                          title: question.text,
                          questionItem: questionItem
                      },
                      location: {
                          index: index
                      }
                  }
              }
          })

          await forms.forms.batchUpdate({
              formId: formId as string,
              requestBody: {
                  requests: requests
              }
          })
      }
  
      // 回傳表單連結
      return `https://docs.google.com/forms/d/${formId}/viewform`
    } catch (error: any) {
      console.error('Error in createGoogleForm:', error)
      throw new Error(`無法建立表單: ${error.message || '未知錯誤'}`)
    }
}
 
function getQuestionItem(type: string, options?: string[], required?: boolean) {
    switch (type) {
        case 'text':
            return {
                question: {
                    required: required,
                    textQuestion: {}
                }
            }
       
        case 'multipleChoice':
            // 過濾掉空字串，確保至少有一個選項
            const radioOptions = options && options.length > 0
                ? options.filter(opt => opt && opt.trim() !== '')
                : []
            
            console.log('Radio options processed:', radioOptions)
            
            // 確保至少有一個選項
            if (radioOptions.length === 0) {
                console.warn('No valid radio options, using defaults')
            }
            
            return {
                question: {
                    required: required,
                    choiceQuestion: {
                        type: 'RADIO',  // 注意：這裡是 RADIO，不是 MULTIPLE_CHOICE
                        options: radioOptions.length > 0
                            ? radioOptions.map(opt => ({ value: opt.trim() }))
                            : [{ value: '選項 1' }, { value: '選項 2' }]
                    }
                }
            }
        case 'checkbox':
            // 過濾掉空字串，確保至少有一個選項
            const checkboxOptions = options && options.length > 0
                ? options.filter(opt => opt && opt.trim() !== '')
                : []
            
            console.log('Checkbox options processed:', checkboxOptions)
            
            // 確保至少有一個選項
            if (checkboxOptions.length === 0) {
                console.warn('No valid checkbox options, using defaults')
            }
            
            return {
                question: {
                    required: required,
                    choiceQuestion: {
                        type: 'CHECKBOX',
                        options: checkboxOptions.length > 0
                            ? checkboxOptions.map(opt => ({ value: opt.trim() }))
                            : [{ value: '選項 1' }, { value: '選項 2' }]
                    }
                }
            }
        case 'date': 
            return {
                question: {
                    required: required,
                    dateQuestion: {
                        includeTime: false,
                        // 包含年月日
                        includeYear: true,
                     }
                }
            }
        
       
        default: 
            return {
                question: {
                    required: required,
                    textQuestion: {}
                }
            }
    }
}
  





