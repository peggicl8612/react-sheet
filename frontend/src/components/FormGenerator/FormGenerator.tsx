import { useEffect, useState } from 'react'
import axios from 'axios'
import './FormGenerator.css'
import { FollowerPointerCard } from '../FollowingPointer'
import pawIcon from '../../assets/icon/paw.png'
import {FORM_TEMPLATES} from '../../../../shared/templates/formTemplates'
import { ThemeToggle } from '../ThemeToggle/ThemeToggle'
 
interface Question {
  id: number
  text: string
  type: string
    options?: string[]
    required?: boolean
 }

 
function FormGenerator() {
    const [formTitle, setFormTitle] = useState('')
    const [formDescription, setFormDescription] = useState('')
    const [questions, setQuestions] = useState<Question[]>([
        { id: 1, text: '', type: 'text', options: [] }
    ])
    const [loading, setLoading] = useState(false)
    const [formLink, setFormLink] = useState('')
    const [error, setError] = useState('')
    const [formTheme, setFormTheme] = useState<'light' | 'dark'>('light')

    const addQuestion = () => {
        setQuestions([
            ...questions,
            { id: Date.now(), text: '', type: 'text', options: [] }
        ])
    }

    // 新增管理選項的函數
    const addOption = (questionId: number) => {
        setQuestions(questions.map(q => 
            q.id === questionId 
                ? { ...q, options: [...(q.options || []), ''] }
                : q
        ))
    }

    // 刪除選項
    const removeOption = (questionId: number, optionIndex: number) => {
        setQuestions(questions.map(q => 
            q.id === questionId 
                ? { 
                    ...q, 
                    options: q.options?.filter((_, i) => i !== optionIndex) || []
                }
                : q
        ))
    }

    // 更新選項
    const updateOption = (questionId: number, optionIndex: number, value: string) => {
        setQuestions(questions.map(q => 
            q.id === questionId 
                ? {
                    ...q,
                    options: q.options?.map((opt, i) => 
                        i === optionIndex ? value : opt
                    ) || []
                }
                : q
        ))
    }

    // 刪除問題
    const removeQuestion = (id: number) => {
        setQuestions(questions.filter(q => q.id !== id))
    }

     // 修改 updateQuestion，當類型改變時初始化 options
     const updateQuestion = (id: number, field: string, value: string) => {
        setQuestions(questions.map(q => {
            if (q.id === id) {
                const updated = { ...q, [field]: value }
                // 如果改為單選或複選，初始化選項
                if (field === 'type' && (value === 'multipleChoice' || value === 'checkbox')) {
                    updated.options = ['', '']
                } else if (field === 'type' && value !== 'multipleChoice' && value !== 'checkbox') {
                    updated.options = undefined
                }
                return updated
            }
            return q
        }))
    }

    // 提交表單
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setFormLink('')

        try {
            // 過濾問題並確保選項正確傳遞
            const filteredQuestions = questions
                .filter(q => q.text.trim() !== '')
                .map(q => ({
                    text: q.text,
                    type: q.type,
                    required: q.required !== undefined ? q.required : false,
                    options: (q.type === 'multipleChoice' || q.type === 'checkbox') 
                        ? (q.options || []).filter(opt => opt && opt.trim() !== '')
                        : undefined
                }))

            // 除錯：記錄要提交的資料
            console.log('Submitting form data:', {
                title: formTitle,
                description: formDescription,
                questions: filteredQuestions
            })

            const formData = {
                title: formTitle,
                description: formDescription,
                questions: filteredQuestions
            }

            const response = await axios.post('/api/forms/create', formData)
            setFormLink(response.data.formUrl)
        } catch (err: any) {
            setError(err.response?.data?.error || '建立表單時發生錯誤')
            console.error('Error:', err)
        } finally {
            setLoading(false)
        }
    }

    // 選擇模板
    const [selectedTemplate, setSelectedTemplate] = useState<string>('empty-form')

    // 載入模板
    const loadTemplate = (templateId: string) => {
        const template = FORM_TEMPLATES.find(t => t.id === templateId)
        if (template) {
            setFormTitle(template.title)
            setFormDescription(template.description)
            // 為每個問題生成唯一 ID
            setQuestions(
                template.questions.map((q, index: any) => ({
                id: Date.now() + index,
                ...q,
                }))
            )
            setSelectedTemplate(templateId)
        }
    } 
    
    // 認證狀態
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [checkingAuth, setCheckingAuth] = useState(true)

    useEffect(() => {
        checkAuthStatus()

        const urlParams = new URLSearchParams(window.location.search)
        if (urlParams.get('auth') === 'success') {
            checkAuthStatus()
            window.history.replaceState({}, '', window.location.pathname)
        }
    }, [])

    const checkAuthStatus = async () => {
        try {
            const response = await axios.get('/auth/status')
            setIsAuthenticated(response.data.authenticated)
        } catch (error) {
            setIsAuthenticated(false)
        } finally {
            setCheckingAuth(false)
        }
    }

    const handleGoogleAuth = async () => {
        try {
            const response = await axios.get('/auth/google')
            window.location.href = response.data.authUrl
        } catch (error: any) {
            setError('無法取得認證連結: ' + (error.message || '未知錯誤'))
        }
    }

    const handleThemeChange = (theme: 'light' | 'dark') => {
        setFormTheme(theme)
        // 應用主題到整個表單容器
        const formElement = document.querySelector('.form-generator')
        if (formElement) {
            formElement.setAttribute('data-theme', theme)
        }
    }
    
    if (checkingAuth) {
        return <div className="form-generator">檢查認證狀態中...</div>
    }
    
    if (!isAuthenticated) {
        return (
            <div className="form-generator">
                <div className="auth-prompt">
                    <h2>需要 Google 認證</h2>
                    <p>請先連結您的 Google 帳號以建立表單</p>
                    <button onClick={handleGoogleAuth} className="btn-google-auth">
                          使用 Google 帳號登入
                    </button>
                    {error && (
                        <div className="error-message" style={{ marginTop: '20px' }}>
                            {error}
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <FollowerPointerCard 
            className="w-full" 
            iconImage={pawIcon}
            iconSize={32}
        >
             <div className="form-generator" data-theme={formTheme}>
                        {/* 主題切換按鈕 */}
                        <div className="theme-toggle-wrapper">
                            <ThemeToggle 
                                onThemeChange={handleThemeChange}
                                initialTheme={formTheme}
                            />
                        </div>
                        <form onSubmit={handleSubmit} className="generator-form">
                            <div className="template-section">
                            <label>
                                     <select
                                        value={selectedTemplate}
                                        onChange={(e) => loadTemplate(e.target.value)}
                                        className="form-select"
                                    >
                                        {FORM_TEMPLATES.map(template => (
                                            <option key={template.id} value={template.id}>{ template.name}</option>
                                        ))}
                                    </select>
                                </label>
                                </div>
                            <div className="form-section">
                            
                                <label>
                                    <div className="form-section-title">表單標題 *</div>
                                    <input
                                        type="text"
                                        value={formTitle}
                                        onChange={(e) => setFormTitle(e.target.value)}
                                        placeholder="例如：客戶滿意度調查"
                                        required
                                        className='form-input'
                                    />
                                </label>
                            </div>

                            <div className="form-section">
                                <label>
                                    <div className='form-section-title'>表單說明</div>
                                    <textarea
                                        value={formDescription}
                                        onChange={(e) => setFormDescription(e.target.value)}
                                        placeholder="請填寫此表單..."
                                        rows={3}
                                        className='form-input'
                                    />
                                </label>
                            </div>

                            <div className="questions-section">
                                <div className="section-header">
                                    <button type="button" onClick={addQuestion} className="btn-add">
                                        + 新增問題
                                    </button>
                                </div>

                                {questions.map((question, index) => (
                                    <div key={question.id} className="question-item">
                                        <div className="question-header">
                                            <span className="question-number">問題 {index + 1}</span>
                                            {questions.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeQuestion(question.id)}
                                                    className="btn-remove"
                                                >
                                                刪除
                                                </button>
                                            )}
                                        </div>
                                        <input
                                            type="text"
                                            value={question.text}
                                            onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
                                            placeholder="輸入問題內容..."
                                            className="question-input"
                                        />
                                        <select
                                            value={question.type}
                                            onChange={(e) => updateQuestion(question.id, 'type', e.target.value)}
                                            className="question-type"
                                        >
                                            <option value="text">簡答</option>
                                            <option value="multipleChoice">單選</option>
                                            <option value="checkbox">複選</option>
                                            <option value="date">日期</option>
                                         </select>

                                        {/* 選項輸入區域 */}
                                        {(question.type === 'multipleChoice' || question.type === 'checkbox') && (
                                            <div className="options-section">
                                                <label className="options-label">選項：</label>
                                                {question.options?.map((option, optIndex) => (
                                                    <div key={optIndex} className="option-item">
                                                        <input
                                                            type="text"
                                                            value={option}
                                                            onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                                                            placeholder={`選項 ${optIndex + 1}`}
                                                            className="option-input"
                                                        />
                                                        {question.options && question.options.length > 2 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeOption(question.id, optIndex)}
                                                                className="btn-remove-option"
                                                            >
                                                                x
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    onClick={() => addOption(question.id)}
                                                    className="btn-add-option"
                                                >
                                                    + 新增選項
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="submit-section">
                            <button type="submit" disabled={loading} className="btn-submit">
                                {loading ? '建立中...' : '建立 Google 表單'}
                            </button>
                                </div>
                            {error && (
                                <div className="error-message">
                                    {error}
                                </div>
                            )}

                            {formLink && (
                                <div className="success-message">
                                    <h3>表單建立成功！</h3>
                                    <p>您的表單連結：</p>
                                    <a href={formLink} target="_blank" rel="noopener noreferrer" className="form-link">
                                        {formLink}
                            </a>
                            <div style={{ marginTop: '15px', padding: '15px', background: '#f0f7ff', borderRadius: '6px', border: '1px solid #b3d9ff' }}>
            <p style={{ margin: '0 0 10px 0', fontWeight: '600', color: '#0066cc' }}>需要新增檔案上傳功能？</p>
            <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#333' }}>
                由於 Google Forms API 限制，檔案上傳問題需要手動新增：
            </p>
            <ol style={{ margin: '0 0 10px 0', paddingLeft: '20px', fontSize: '14px', color: '#333' }}>
 
            </ol>
                <a 
                    href={formLink.replace('/viewform', '/edit')} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                        display: 'inline-block',
                        padding: '8px 16px',
                        background: '#0066cc',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '600'
                    }}
                >
                    編輯表單
                </a>
        </div>
                                    <button
                                        type="button"
                                        onClick={() => navigator.clipboard.writeText(formLink)}
                                        className="btn-copy"
                                    >
                                        複製連結
                                    </button>
                                </div>
                            )}
                        </form>
            </div>
        </FollowerPointerCard>
      )
     
}

export default FormGenerator