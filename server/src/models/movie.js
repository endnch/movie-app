import mongoose from 'mongoose'

const MovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  actorsIds: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Actor',
    required: true,
  },
})

const Movie = mongoose.model('Movie', MovieSchema)

export default Movie
