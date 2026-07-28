import mongoose from 'mongoose'

const setSchema = new mongoose.Schema({
    weight: Number,
    reps: Number
})

const workoutExerciseSchema = new mongoose.Schema({
    exercise: {type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true},
    sets: [setSchema]
})

const workoutSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    //embedding: the sets, reps, and weight live inside the workout, so you pass the schema directly
    exercises: [workoutExerciseSchema],
    name: String,
    notes: String,
    status: {type: String, enum: ['active', 'completed'], default: 'active'},
    date: {type: Date, default: Date.now}}, {timestamps: true
})

export default mongoose.model('Workout', workoutSchema) 