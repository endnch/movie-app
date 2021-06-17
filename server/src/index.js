import { ApolloServer } from 'apollo-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from 'constants'
import schema from 'schema'

mongoose.connect('mongodb://localhost/movie-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
})

const server = new ApolloServer({
  schema,
  context: ({ req }) => {
    if (!req.headers.authorization) {
      return
    }
    const token = req.headers.authorization.replace('Bearer ', '')

    try {
      const user = jwt.verify(token, JWT_SECRET)
      return { user }
    } catch {
      return
    }
  },
})

server.listen().then(({ url }) => console.log(`Server is running on ${url}`))
