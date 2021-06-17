import mongoose from 'mongoose'

const ActorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
})

const Actor = mongoose.model('Actor', ActorSchema)

export default Actor
