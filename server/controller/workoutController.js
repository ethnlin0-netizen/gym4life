import Workout from '../models/Workout.js'
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
        //only return workouts for the logged in user
        const allWorkouts = await Workout.find({ user: req.user.id }).sort({ date: -1 })
        return res.status(200).json(allWorkouts)
    } catch(error) {
        res.status(500).json({ message: error.message })
    }
}

export const getThisWorkout = async (req, res) => {
    try {
        const thisWorkout = await Workout.findById(req.params.id).populate('exercises.exercise')
        if(!thisWorkout) {
            return res.status(404).json({ message: 'Workout not found' })
        }
        if(thisWorkout.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' })
        }
        res.status(200).json(thisWorkout)
    } catch(error) {
        res.status(500).json({ message: error.message })
    }
}

export const addExercise = async (req, res) => {
    try {
        const { id, exerciseId, sets } = req.body
        //follows the reference to the actual exercise object to access muscles targeted, name, description
        const thisWorkout = await Workout.findById(id).populate('exercises.exercise') //
        if(!thisWorkout) {
            return res.status(404).json({ message: 'Workout not found' })
        }
        if(thisWorkout.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' })
        }
        thisWorkout.exercises.push({ exercise: exerciseId, sets })
        await thisWorkout.save()
        res.status(201).json(thisWorkout)
    } catch(error) {
        res.status(500).json({ message: error.message })
    }
}

export const editExercise = async (req, res) => {
    try {
        const { id, exerciseId } = req.params
        const { sets } = req.body
        const thisWorkout = await Workout.findById(id) //populate unnecessary for editing
        if(!thisWorkout) {
            return res.status(404).json({ message: 'Workout not found ' })
        }
        if(thisWorkout.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' })
        }
        const thisExercise = thisWorkout.exercises.id(exerciseId) //this was correct!
        if(!thisExercise) {
            return res.status(404).json({ message: 'Exercise not found' })
        }
        thisExercise.sets = sets
        await thisWorkout.save()
        res.status(200).json(thisWorkout)
    } catch(error) {
        res.status(500).json({ message: error.message })
    }
}

export const deleteExercise = async (req, res) => {
    try {
        const { id, exerciseId } = req.params
        const thisWorkout = await Workout.findById(id)
        if(!thisWorkout) {
            return res.status(404).json({ message: 'Workout not found ' })
        }
        if(thisWorkout.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' })
        }
        const thisExercise = thisWorkout.exercises.id(exerciseId)
        if(!thisExercise) {
            return res.status(404).json({ message: 'Exercise not found' })
        }
        thisWorkout.exercises.pull(exerciseId)
        await thisWorkout.save()
        res.status(200).json(thisWorkout)   
    } catch(error) {
        res.status(500).json({ message: error.message })
    }
}

export const deleteWorkout = async (req, res) => {
    try {
        const { id } = req.params
        const thisWorkout = await Workout.findById(id)
        if(!thisWorkout) {
            return res.status(404).json({ message: 'Workout not found' })
        }
        if(thisWorkout.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' })
        }
        await thisWorkout.deleteOne()
        res.status(200).json({ message: 'Workout successfully deleted '})
    } catch(error) {
        res.status(500).json({ message: error.message })
    }
}

//save workout, change name, add notes, end workout
export const editWorkout = async (req, res) => {
    try{
        const { name, notes, status } = req.body
        const { id } = req.params
        const thisWorkout = await Workout.findById(id)
        if(!thisWorkout) {
            return res.status(404).json({ message: 'Workout not found' })
        }
        if(thisWorkout.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' })
        }
        thisWorkout.name = name || thisWorkout.name
        thisWorkout.notes = notes || thisWorkout.notes
        thisWorkout.status = status || thisWorkout.status
        await thisWorkout.save()
        res.status(200).json(thisWorkout)
    } catch(error) {
        res.status(500).json({ message: error.message })
    }
}

export default { createWorkout, getAllWorkouts, getThisWorkout, addExercise, editExercise, deleteExercise, deleteWorkout, editWorkout }