import express from 'express'
import { searchExercises, getExercise } from '../controller/exerciseController.js'

const router = express.Router()

router.get('/', searchExercises)
router.get('/:id', getExercise)

export default router