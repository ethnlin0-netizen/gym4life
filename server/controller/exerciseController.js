import Exercise from '../models/Exercise.js'

//GET /api/exercises - for the search and browse exercise list
export const searchExercises = async (req, res) => {
    try {
        const allExercises = await Exercise.find() //array of all exercises from database
        res.status(200).json(allExercises) //sends the array to frontend
    } catch(error) {
        res.status(500).json({ message: error.message })
    }
    //frontend handles search filtering
}

export const getExercise = async (req, res) => {
    try {
        const thisExercise = await Exercise.findById(req.params.id)
        if(!thisExercise) {
            return res.status(404).json({ message: 'Exercise not found'})
        }
        res.status(200).json(thisExercise)
    } catch(error) {
        res.status(500).json({ message: error.message })
    }
}

export default { searchExercises, getExercise }