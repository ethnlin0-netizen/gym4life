import mongoose from 'mongoose'
//library model
const exerciseSchema = new mongoose.Schema()({
    ExerciseName: String,
    musclesTargeted: [String],
    description : String
})

export default mongoose.model('Exercise', exerciseSchema)
