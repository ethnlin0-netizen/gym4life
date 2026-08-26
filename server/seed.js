import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Exercise from './models/Exercise.js'

dotenv.config()
const exercises = [
    { name: 'Bench Press', musclesWorked: ['chest', 'triceps', 'deltoids', 'abs'], description: 'A popular compound exercise performed with a barbell that targets the chest and triceps.' },
    { name: 'Back Squat', musclesWorked: ['quadriceps', 'gluteal', 'hamstring'], description: 'An effective compound exercise that targets the legs and core.' },
    { name: 'Deadlift', musclesWorked: ['gluteal', 'hamstring', 'quadriceps', 'abs', 'obliques', 'lower-back', 'trapezius', 'forearm'], description: 'A powerful compound exercise that targets the entire posterior chain.' },
    { name: 'Push Up', musclesWorked: ['chest', 'triceps', 'deltoids', 'abs'], description: 'A classic bodyweight exercise that targets the upper body and can be done anywhere.' },
    { name: 'Pull Up', musclesWorked: ['lower-back', 'upper-back', 'biceps', 'forearm', 'abs', 'obliques'], description: 'A classic bodyweight exercise that targets muscles in your arms and back.' }
]

const seed = async () => {
    await mongoose.connect(process.env.MONGO_URI)
    await Exercise.deleteMany()
    await Exercise.insertMany(exercises)
    console.log('Exercises seeded successfully')
    await mongoose.disconnect()
}

seed()