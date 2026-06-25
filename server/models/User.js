import mongoose from 'mongoose'

const userSchema = new mongoose.Schema()({
    FirstName: {type: String, required: true},
    LastName: {type: String, required: true},
    Email: {type: String, required: true},
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    workouts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workout' }]
}, { timestamps: true })

export default mongoose.model('User', userSchema)