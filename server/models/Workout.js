import mongoose from 'mongoose'

const workoutSchema = new mongoose.Schema()({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    //embedding: the sets, reps, and weight live inside the workout, so you pass the schema directly
    exercises: [workoutExerciseShema],
    date: {type: Date, default: Date.now}}, {timestamps: true
})

export default mongoose.model('Workout', workoutSchema);