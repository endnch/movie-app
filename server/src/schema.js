import { schemaComposer } from 'graphql-compose'
import { composeMongoose } from 'graphql-compose-mongoose'
import jwt from 'jsonwebtoken'
import sgMail from '@sendgrid/mail'

import {
  ROLES,
  JWT_SECRET,
  SENDGRID_API_KEY,
  SENDGRID_FROM_EMAIL,
} from 'constants'

import User from 'models/user'
import Category from 'models/category'
import Movie from 'models/movie'
import Actor from 'models/actor'

sgMail.setApiKey(SENDGRID_API_KEY)

const UserTC = composeMongoose(User, {})
const MovieTC = composeMongoose(Movie, {})
const CategoryTC = composeMongoose(Category, {})
const ActorTC = composeMongoose(Actor, {})

MovieTC.addRelation('category', {
  resolver: CategoryTC.mongooseResolvers.findById,
  prepareArgs: {
    _id: (source) => source.categoryId,
  },
  projection: { categoryId: true },
})

MovieTC.addRelation('actors', {
  resolver: ActorTC.mongooseResolvers.findMany,
  prepareArgs: {
    filter: (source) => ({
      _operators: {
        _id: {
          in: source.actorsIds,
        },
      },
    }),
  },
  projection: { actorsIds: true },
})

MovieTC.addRelation('haveFavorited', {
  resolver: UserTC.mongooseResolvers.findMany,
  prepareArgs: {
    filter: (source) => ({
      favoriteMoviesIds: source._id,
    }),
  },
  // projection: { _id: true },
})

CategoryTC.addRelation('movies', {
  resolver: MovieTC.mongooseResolvers.findMany,
  prepareArgs: {
    filter: (source) => ({ categoryId: source._id }),
  },
  // projection: { _id: true },
})

UserTC.addRelation('favoriteMovies', {
  resolver: MovieTC.mongooseResolvers.findMany,
  prepareArgs: {
    filter: (source) => ({
      _operators: {
        _id: {
          in: source.favoriteMoviesIds,
        },
      },
    }),
  },
  projection: { favoriteMoviesIds: true },
})

ActorTC.addRelation('movies', {
  resolver: MovieTC.mongooseResolvers.findMany,
  prepareArgs: {
    filter: (source) => ({
      actorsIds: source._id,
    }),
  },
  // projection: { _id: true },
})

// MIDDLEWARE

function isAuthenticated(next, source, args, context, info) {
  if (!context.user) {
    throw new Error('Unauthorized')
  }

  return next(source, args, context, info)
}

function isOwner(next, source, args, context, info) {
  if (context.user.role === ROLES.ADMIN) {
    return next(source, args, context, info)
  }

  if (args._id !== context.user.id) {
    throw new Error('Unauthorized')
  }

  return next(source, args, context, info)
}

function haveRole(role) {
  return function (next, source, args, context, info) {
    if (context.user.role !== role) {
      throw new Error('Unauthorized')
    }

    return next(source, args, context, info)
  }
}

// USER

schemaComposer.Query.addFields({
  userById: UserTC.mongooseResolvers
    .findById()
    .withMiddlewares([isAuthenticated, isOwner]),
  userMany: UserTC.mongooseResolvers
    .findMany()
    .withMiddlewares([isAuthenticated, haveRole(ROLES.ADMIN)]),
})

UserTC.addResolver({
  name: 'addToFavorites',
  type: UserTC,
  args: { movieId: 'MongoID!' },
  description: 'Add a movie to favorites',
  resolve: async ({ args, context }) => {
    const user = await User.updateOne(
      { _id: context.user.id },
      { $addToSet: { favoriteMoviesIds: args.movieId } }
    )
    if (!user) return null
    return User.findOne({ _id: context.user.id })
  },
})

UserTC.addResolver({
  name: 'removeFromFavorites',
  type: UserTC,
  args: { movieId: 'MongoID!' },
  description: 'Remove a movie from favorites',
  resolve: async ({ args, context }) => {
    const user = await User.updateOne(
      { _id: context.user.id },
      { $pull: { favoriteMoviesIds: args.movieId } }
    )
    if (!user) return null
    return User.findOne({ _id: context.user.id })
  },
})

UserTC.addResolver({
  name: 'update',
  type: UserTC,
  args: { email: 'String', password: 'String' },
  description: 'Update a user',
  resolve: async ({ args, context }) => {
    const { email, password } = await User.findOne({ _id: context.user.id })

    const user = await User.updateOne(
      { _id: context.user.id },
      { email: args.email || email, password: args.password || password }
    )

    if (!user) {
      return null
    }

    return User.findOne({ _id: context.user.id })
  },
})

schemaComposer.Mutation.addFields({
  userAddToFavorites: UserTC.getResolver('addToFavorites').withMiddlewares([
    isAuthenticated,
  ]),
  userRemoveFromFavorites: UserTC.getResolver(
    'removeFromFavorites'
  ).withMiddlewares([isAuthenticated]),
  userUpdate: UserTC.getResolver('update').withMiddlewares([isAuthenticated]),
})

// CATEGORY

schemaComposer.Query.addFields({
  categoryById: CategoryTC.mongooseResolvers.findById(),
  categoryMany: CategoryTC.mongooseResolvers.findMany(),
})

schemaComposer.Mutation.addFields({
  categoryCreateOne: CategoryTC.mongooseResolvers
    .createOne()
    .withMiddlewares([isAuthenticated, haveRole(ROLES.ADMIN)]),
})

// MOVIE

schemaComposer.Query.addFields({
  movieById: MovieTC.mongooseResolvers.findById(),
  movieMany: MovieTC.mongooseResolvers.findMany(),
})

schemaComposer.Mutation.addFields({
  movieCreateOne: MovieTC.mongooseResolvers
    .createOne()
    .withMiddlewares([isAuthenticated, haveRole(ROLES.ADMIN)]),
})

// ACTOR

schemaComposer.Query.addFields({
  actorById: ActorTC.mongooseResolvers.findById(),
})

schemaComposer.Mutation.addFields({
  actorCreateOne: ActorTC.mongooseResolvers
    .createOne()
    .withMiddlewares([isAuthenticated, haveRole(ROLES.ADMIN)]),
})

// SIGN UP

const AuthPayloadTC = schemaComposer.createObjectTC({
  name: 'AuthPayload',
  fields: {
    token: 'String!',
    user: {
      type: UserTC,
      required: true,
    },
  },
})

schemaComposer.Mutation.addFields({
  signUp: {
    type: AuthPayloadTC,
    args: { email: 'String!', password: 'String!' },
    description: 'Sign up for the app',
    resolve: async (source, args) => {
      const user = await User.create({
        email: args.email,
        password: args.password,
        role: ROLES.USER,
      })

      await sgMail.send({
        to: user.email,
        from: SENDGRID_FROM_EMAIL,
        subject: 'Welcome',
        text: 'Welcome to movie-app',
      })

      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET)
      return {
        user,
        token,
      }
    },
  },
})

// LOGIN

schemaComposer.Mutation.addFields({
  login: {
    type: AuthPayloadTC,
    args: { email: 'String!', password: 'String!' },
    description: 'Login into the app',
    resolve: async (source, args) => {
      const user = await User.findOne({
        email: args.email,
      })

      if (!user) {
        throw new Error('No such user found')
      }

      if (user.password !== args.password) {
        throw new Error('Invalid password')
      }

      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET)

      return {
        user,
        token,
      }
    },
  },
})

export default schemaComposer.buildSchema()
