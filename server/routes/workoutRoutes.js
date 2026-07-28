import express from 'express'
import { createWorkout, getAllWorkouts, getThisWorkout, addExercise, editExercise, deleteExercise, deleteWorkout } from '../controller/workoutController'

const router = express.Router()

router.post('/workouts')

export default router