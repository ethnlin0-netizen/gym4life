import mongoose from 'mongoose'
//instance model
const workoutExerciseSchema = new mongoose.Schema()({
    exercise: {type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true},
    weight: Number,
    sets: Number,
    reps: Number
})

export default mongoose.model('WorkoutExercise', workoutExerciseSchema)