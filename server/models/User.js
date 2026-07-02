import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    login: {type: String, required: true},
    password: {type: String, required: true},
    date: {type: Date, default: Date.now()},
    workouts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workout' }]
    });

export default mongoose.model('User', userSchema);