import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/react-sheet'

export const connectDatabase = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB')
    } catch (error) {
        console.error('Error connecting to MongoDB:', error)
        process.exit(1)
    }
}
// 監聽連接事件
mongoose.connection.on('connected', () => {
    console.log('MongoDB connected')
})

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err)
})

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected')
})

// 中斷連接
process.on('SIGINT', async () => {
    await mongoose.connection.close()
    process.exit(0)
})