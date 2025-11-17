// API 基礎 URL 設定
// 在開發環境中，Vite proxy 會處理相對路徑
// 在生產環境中，使用環境變數 VITE_API_URL
import axios from 'axios'

const getApiBaseUrl = (): string => {
  // 如果設定了環境變數，使用環境變數
  const apiUrl = import.meta.env.VITE_API_URL
  
  if (apiUrl) {
    // 移除尾部的斜線（如果有的話）
    return apiUrl.replace(/\/$/, '')
  }
  
  // 開發環境使用相對路徑（Vite proxy 會處理）
  // 生產環境如果沒有設定 VITE_API_URL，會使用相對路徑
  // 這需要後端和前端在同一個網域，或後端設定正確的 CORS
  return ''
}

export const API_BASE_URL = getApiBaseUrl()

// 建立 axios 實例
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, // 跨域請求通常不需要 credentials
  headers: {
    'Content-Type': 'application/json',
  },
})

