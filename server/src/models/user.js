import mongoose from 'mongoose'

import { ROLES } from 'constants'

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: [ROLES.USER, ROLES.ADMIN],
    required: true,
  },
  favoriteMoviesIds: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
      },
    ],
  },
})

const User = mongoose.model('User', UserSchema)

export default User
