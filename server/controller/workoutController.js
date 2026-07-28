import Workout from '../models/Workout.js'
import workoutExercise from '../models/Workout.js'
import Exercise from '../models/Exercise.js'

export const createWorkout = async (req, res) => {
    try {
        const { name } = req.body
        const newWorkout = await Workout.create({
            user: req.user.id,
            name
            //status and date have defaults so they don't need to be passed
            //exercise is an empty array by default and comments is an empty string
        })

        res.status(201).json(newWorkout)
    } catch(error) {
        res.status(500).json({ message: error.message })
    }
}

export const getAllWorkouts = async (req, res) => {
    try {
        const allWorkouts = await Workout.find()
        return res.status(200).json(allWorkouts)
    } catch(error) {
        res.status(500).json({ message: error.message })
    }
}

export const getThisWorkout = async (req, res) => {
    try {
        const thisWorkout = await Workout.findById(req.params.id)
        if(!thisWorkout) {
            res.status(404).json({ message: 'Workout not found' })
        }
        res.status(200).json(thisWorkout)
    } catch(error) {
        res.status(500).json({ message: error.message })
    }
}

export const addExercise = async (req, res) => {
    try {
        const {exerciseId, weight, sets, reps } = req.body
        //follows the reference to the actual exercise object to access muscles targeted, name, description
        const thisWorkout = await Workout.findById(req.params.id).populate('exercises.exercise')
        if(!thisWorkout) {
            return res.status(404).json({ message: 'Workout not found' })
        }
        thisWorkout.exercises.push({ exercise: exerciseId, weight, sets, reps })
        await thisWorkout.save()
        res.status(201).json(thisWorkout)
    } catch(error) {
        res.status(500).json({ message: error.message })
    }
}

