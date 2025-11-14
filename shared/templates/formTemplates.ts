export interface FormTemplate {
    id: string
    name: string
    title: string
    description: string
    questions: Array<{
        text: string,
        type: 'text' | 'multipleChoice' | 'checkbox',
        options?: string[],
        required?: boolean
    }>
}

export const FORM_TEMPLATES: FormTemplate[] = [
    {

        id: 'empty-form',
        name: '空白表單',
        title: '',
        description: '',
        questions: [
            {
                text: '',
                type: 'text',
                options: [],
             }
        ]
    },
    {
        id: 'customer-satisfaction',
        name: '客戶滿意度調查表',
        title: '客戶滿意度調查表',
        description: '感謝您使用我們的服務，請協助填寫此問卷以協助我們改進服務品質。',
        questions: [
            {
                 text: '請輸入您的姓名',
                type: 'text',
                options: [],
                required: true
             },
            {
                text: '您對我們的服務滿意度為何？',
                type: 'multipleChoice',
                options: ['非常滿意', '滿意', '普通', '不滿意', '非常不滿意'],
                required: true

            },
            {
                text: '您認為我們的服務有哪些需要改進的地方？',
                type: 'checkbox',
                options: ['回應速度', '服務態度', '專業知識', '其他'],
                required: true

            },
            {
                text: '其他意見或建議',
                type: 'text',
                options: [],
                required: false

            }
        ]
    },
    {
        id: 'product-feedback',
        name: '產品意見表',
        title: '產品意見表',
        description: '感謝您使用我們的產品，請協助填寫此問卷以協助我們改進產品品質。',
        questions: [
            {
                text: '請輸入您的姓名',
                type: 'text',
                options: [],
                required: true

            },
            {
                text: '您對我們的產品滿意度為何？',
                type: 'multipleChoice',
                options: ['非常滿意', '滿意', '普通', '不滿意', '非常不滿意'],
                required: true

            },
            {
                text: '您認為我們的產品有哪些需要改進的地方？',
                type: 'checkbox',
                options: ['外觀設計', '功能性', '使用體驗', '其他'],
                required: true

            },
            {
                text: '其他意見或建議',
                type: 'text',
                options: [],
                required: false
             }
        ]
    }
]

// 根據 ID 獲取模板
export function getTemplateById(templateId: string): FormTemplate | undefined {
    return FORM_TEMPLATES.find(template => template.id === templateId)  
}

// 獲取預設模板
export function getDefaultTemplate(): FormTemplate {
    return FORM_TEMPLATES.find(template => template.id === 'product-feedback') || FORM_TEMPLATES[0]
}