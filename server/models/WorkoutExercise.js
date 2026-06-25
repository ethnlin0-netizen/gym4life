import mongoose from 'mongoose'
//instance model
const workoutExerciseSchema = new mongoose.Schema()({
    exercise: {type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true},
    Weight: Number,
    Sets: Number,
    Reps: Number,
    Notes: String,
})

export default mongoose.model('WorkoutExercise', workoutExerciseSchema)