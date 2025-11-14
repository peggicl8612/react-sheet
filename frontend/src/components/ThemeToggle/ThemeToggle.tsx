import { useState, useEffect } from 'react'
import './ThemeToggle.css'

interface ThemeToggleProps {
    onThemeChange?: (theme: 'light' | 'dark') => void
    initialTheme?: 'light' | 'dark'
}

export function ThemeToggle({ onThemeChange, initialTheme = 'light' }: ThemeToggleProps) {
    const [theme, setTheme] = useState<'light' | 'dark'>(initialTheme)

    useEffect(() => {
        // 從 localStorage 讀取保存的主題
        const savedTheme = localStorage.getItem('formTheme') as 'light' | 'dark' | null
        if (savedTheme) {
            setTheme(savedTheme)
            onThemeChange?.(savedTheme)
        } else {
            onThemeChange?.(initialTheme)
        }
        
        // 應用主題到 document
        document.documentElement.setAttribute('data-theme', savedTheme || initialTheme)
    }, [])

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
        localStorage.setItem('formTheme', newTheme)
        onThemeChange?.(newTheme)
        
        // 應用主題到 document
        document.documentElement.setAttribute('data-theme', newTheme)
    }

    return (
        <div className="theme-toggle-container">
            <button
                type="button"
                className={`theme-toggle ${theme}`}
                onClick={toggleTheme}
                aria-label={`切換到${theme === 'light' ? '深色' : '淺色'}模式`}
            >
                <div className="theme-toggle-track">
                    {/* 淺色模式：雲朵圖案背景 */}
                    <div className="theme-background light-background">
                        <div className="clouds">
                            <div className="cloud cloud-1"></div>
                            <div className="cloud cloud-2"></div>
                            <div className="cloud cloud-3"></div>
                            <div className="cloud cloud-4"></div>
                        </div>
                    </div>
                    
                    {/* 深色模式：星星和月亮 */}
                    <div className="theme-background dark-background">
                        <div className="stars-container">
                            <div className="star star-1">✦</div>
                            <div className="star star-2">✦</div>
                            <div className="star star-3">✦</div>
                            <div className="star star-4">✦</div>
                            <div className="star star-5">✦</div>
                        </div>
                        <div className="moon">
                            <div className="moon-crater crater-1"></div>
                            <div className="moon-crater crater-2"></div>
                            <div className="moon-crater crater-3"></div>
                        </div>
                    </div>
                    
                    {/* 切換按鈕的圓形滑塊 */}
                    <div className="theme-toggle-thumb"></div>
                </div>
            </button>
        </div>
    )
}
