import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './db.js'
import authRoutes from './routes/authRoutes.js'
import exerciseRoutes from './routes/exerciseRoutes.js'
import workoutRoutes from './routes/workoutRoutes.js'

dotenv.config()
connectDB()

const app = express()

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/exercises', exerciseRoutes)
app.use('/api/workouts', workoutRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})