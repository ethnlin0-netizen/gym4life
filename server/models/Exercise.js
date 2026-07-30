import mongoose from 'mongoose'
//library model
const exerciseSchema = new mongoose.Schema({
    name: String,
    musclesWorked: [String],
    description : String
})

export default mongoose.model('Exercise', exerciseSchema)
