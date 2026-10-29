import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { setServers } from 'node:dns'

dotenv.config()

const connectDB = async () => {
try {
    setServers(['1.1.1.1', '8.8.8.8'])
    await mongoose.connect(process.env.MONGO_URI)
    console.log('MongoDB connected')
} catch (error) {
    console.error(error)
    process.exit(1)
    }
}

export default connectDB