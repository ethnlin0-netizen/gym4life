import mongoose from 'mongoose'
//library model
const exerciseSchema = new mongoose.Schema({
    name: String,
    musclesWorked: [String],
    primaryMuscles: { type: [String], default: [] },
    secondaryMuscles: { type: [String], default: [] },
    description : String
})

export default mongoose.model('Exercise', exerciseSchema)
