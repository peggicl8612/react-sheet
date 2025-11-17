export interface FormValidationError { 
    type: 'duplicate_options' | 'empty_options' | 'empty_question' | 'empty_title' | 'insufficient_options' | 'empty_option'
    questionIndex: number
    questionText?: string
    message: string
}

// 驗證結果
export interface FormValidationResult {
    isValid: boolean
    errors: FormValidationError[]
}

// 問題類型定義
interface Question {
    id: number
    text: string
    type: string
    options?: string[]
    required?: boolean
}

/* 驗證表單資料 */
export function validateForm(
    questions: Question[],
    formTitle: string,
): FormValidationResult {
    const errors: FormValidationError[] = []

    // 驗證標題
    if (!formTitle || formTitle.trim() === '') { 
        errors.push({
            type: 'empty_question',
            questionIndex: 0,
            message: '表單標題為必填項目'
        })
    }

    // 過濾空問題
    const validQuestions = questions.filter(q => q.text.trim() !== '')

    // 驗證每個問題
    validQuestions.forEach((question, index) => {
        const questionNumber = index + 1


        if (question.type === 'multipleChoice' || question.type === 'checkbox') { 
            // 檢查是否有選項（僅對需要選項的問題類型進行驗證）
            const options = question.options || []
            
            // 過濾掉空白選項後再檢查
            const validOptions = options.filter(opt => opt && opt.trim() !== '')
            
            if (validOptions.length < 2) {
                errors.push({
                    type: 'insufficient_options',
                    questionIndex: questionNumber,
                    questionText: question.text,
                    message: `問題 ${questionNumber} 需要至少兩個選項`
                })
            } else {
                // 檢查選項是否重複
                const optionMap = new Map<string, number>()
                const duplicates: string[] = []
                
                validOptions.forEach((option: string, optIndex: number) => {
                    const trimmedOption = option.trim().toLowerCase()
                    if (optionMap.has(trimmedOption)) {
                        if (!duplicates.includes(option)) {
                            duplicates.push(option)
                        }
                    } else {
                        optionMap.set(trimmedOption, optIndex)
                    }
                })

                if (duplicates.length > 0) {
                    errors.push({
                        type: 'duplicate_options',
                        questionIndex: questionNumber,
                        questionText: question.text,
                        message: `問題 ${questionNumber} 的選項重複`
                    })
                }
            }
        }
        
    })

    return {
        isValid: errors.length === 0,
        errors
    }
}

export function formatValidationErrors(errors: FormValidationError[]): string {
    if (errors.length === 0) {
        return ''
    }

    if (errors.length === 1) {
        return errors[0].message
    }

    // 多個錯誤時，用列表格式顯示
    return `${errors.map(err => `- ${err.message}`).join('\n')}`
}