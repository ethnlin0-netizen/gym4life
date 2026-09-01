import express from 'express'
import { createWorkout, getAllWorkouts, getActiveWorkout, getThisWorkout, addExercise, editExercise, deleteExercise, deleteWorkout, editWorkout } from '../controller/workoutController.js'
import authMiddleware from '../middleware/authMiddleware.js'
const router = express.Router()

//needs auth middleware because workouts are user specific
router.post('/', authMiddleware, createWorkout)
router.get('/', authMiddleware, getAllWorkouts)
router.get('/active', authMiddleware, getActiveWorkout)
router.get('/:id', authMiddleware, getThisWorkout)
router.post('/:id/exercises', authMiddleware, addExercise)
router.put('/:id/exercises/:exerciseId', authMiddleware, editExercise)
router.delete('/:id/exercises/:exerciseId', authMiddleware, deleteExercise)
router.delete('/:id', authMiddleware, deleteWorkout)
router.put('/:id', authMiddleware, editWorkout)

export default router