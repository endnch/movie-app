import mongoose from 'mongoose'

import User from 'models/user'
import Category from 'models/category'
import Movie from 'models/movie'
import Actor from 'models/actor'

import { ROLES } from 'constants'

;(async () => {
  await mongoose.connect('mongodb://localhost/movie-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })

  await User.deleteMany({})
  await Category.deleteMany({})
  await Movie.deleteMany({})
  await Actor.deleteMany({})

  await User.create({
    email: 'admin@admin.com',
    password: 'password',
    role: ROLES.ADMIN,
  })

  // ACTORS

  const bradPitt = await Actor.create({
    name: 'Brad Pitt',
  })

  const edwardNorton = await Actor.create({
    name: 'Edward Norton',
  })

  const keanuReeves = await Actor.create({
    name: 'Keanu Reeves',
  })

  const laurenceFishburne = await Actor.create({
    name: 'Laurence Fishburne',
  })

  const johnnyDepp = await Actor.create({
    name: 'Johnny Depp',
  })

  const orlandoBloom = await Actor.create({
    name: 'Orlando Bloom',
  })

  const elijahWood = await Actor.create({
    name: 'Elijah Wood',
  })

  const ianMcKellen = await Actor.create({
    name: 'Ian McKellen',
  })

  const joaquinPhoenix = await Actor.create({
    name: 'Joaquin Phoenix',
  })

  const anthonyHopkins = await Actor.create({
    name: 'Anthony Hopkins',
  })

  const robertDeNiro = await Actor.create({
    name: 'Robert De Niro',
  })

  const joePesci = await Actor.create({
    name: 'Joe Pesci',
  })

  const macaulayCulkin = await Actor.create({
    name: 'Macaulay Culkin',
  })

  const christianBale = await Actor.create({
    name: 'Christian Bale',
  })

  const morganFreeman = await Actor.create({
    name: 'Morgan Freeman',
  })

  const tomHardy = await Actor.create({
    name: 'Tom Hardy',
  })

  const jimCarrey = await Actor.create({
    name: 'Jim Carrey',
  })

  const adamSandler = await Actor.create({
    name: 'Adam Sandler',
  })

  const markHamill = await Actor.create({
    name: 'Mark Hamill',
  })

  const harrisonFord = await Actor.create({
    name: 'Harrison Ford',
  })

  // CATEGORIES

  const dramaCategory = await Category.create({
    name: 'Drama',
  })

  const actionCategory = await Category.create({
    name: 'Action',
  })

  const comedyCategory = await Category.create({
    name: 'Comedy',
  })

  const adventureCategory = await Category.create({
    name: 'Adventure',
  })

  const crimeCategory = await Category.create({
    name: 'Crime',
  })

  // MOVIES

  await Movie.create({
    title: 'Pirates of the Caribbean',
    categoryId: adventureCategory,
    actorsIds: [johnnyDepp._id, orlandoBloom._id],
  })

  await Movie.create({
    title: 'The Matrix',
    categoryId: actionCategory,
    actorsIds: [keanuReeves._id, laurenceFishburne._id],
  })

  await Movie.create({
    title: 'The Lord of the Rings',
    categoryId: adventureCategory,
    actorsIds: [elijahWood._id, orlandoBloom._id, ianMcKellen],
  })

  await Movie.create({
    title: 'Joker',
    categoryId: dramaCategory,
    actorsIds: [joaquinPhoenix._id],
  })

  await Movie.create({
    title: 'Fight Club',
    categoryId: actionCategory,
    actorsIds: [bradPitt._id, edwardNorton._id],
  })

  await Movie.create({
    title: 'The Incredible Hulk',
    categoryId: actionCategory,
    actorsIds: [edwardNorton._id],
  })

  await Movie.create({
    title: 'American History X',
    categoryId: dramaCategory,
    actorsIds: [edwardNorton._id],
  })

  await Movie.create({
    title: 'The King of Comedy',
    categoryId: comedyCategory,
    actorsIds: [robertDeNiro._id],
  })

  await Movie.create({
    title: 'Taxi Driver',
    categoryId: dramaCategory,
    actorsIds: [robertDeNiro._id],
  })

  await Movie.create({
    title: 'Goodfellas',
    categoryId: crimeCategory,
    actorsIds: [robertDeNiro._id, joePesci._id],
  })

  await Movie.create({
    title: 'Casino',
    categoryId: crimeCategory,
    actorsIds: [robertDeNiro._id, joePesci._id],
  })

  await Movie.create({
    title: 'Home Alone',
    categoryId: comedyCategory,
    actorsIds: [macaulayCulkin._id, joePesci._id],
  })

  await Movie.create({
    title: 'The Silence of the Lambs',
    categoryId: crimeCategory,
    actorsIds: [anthonyHopkins._id],
  })

  await Movie.create({
    title: 'The Dark Knight',
    categoryId: actionCategory,
    actorsIds: [christianBale._id, morganFreeman._id],
  })

  await Movie.create({
    title: 'The Dark Knight Rises',
    categoryId: actionCategory,
    actorsIds: [christianBale._id, morganFreeman._id, tomHardy._id],
  })

  await Movie.create({
    title: 'American Psycho',
    categoryId: crimeCategory,
    actorsIds: [christianBale._id],
  })

  await Movie.create({
    title: 'Shawshank Redemption',
    categoryId: dramaCategory,
    actorsIds: [morganFreeman._id],
  })

  await Movie.create({
    title: 'Venom',
    categoryId: actionCategory,
    actorsIds: [tomHardy._id],
  })

  await Movie.create({
    title: 'The Mask',
    categoryId: actionCategory,
    actorsIds: [jimCarrey._id],
  })

  await Movie.create({
    title: 'Ace Ventura',
    categoryId: actionCategory,
    actorsIds: [jimCarrey._id],
  })

  await Movie.create({
    title: 'Bruce Almighty',
    categoryId: actionCategory,
    actorsIds: [jimCarrey._id],
  })

  await Movie.create({
    title: 'Liar Liar',
    categoryId: actionCategory,
    actorsIds: [jimCarrey._id],
  })

  await Movie.create({
    title: 'Yes Man',
    categoryId: actionCategory,
    actorsIds: [jimCarrey._id],
  })

  await Movie.create({
    title: 'Star Wars',
    categoryId: adventureCategory,
    actorsIds: [markHamill._id, harrisonFord._id],
  })

  await Movie.create({
    title: 'Indiana Jones',
    categoryId: adventureCategory,
    actorsIds: [markHamill._id, harrisonFord._id],
  })

  await Movie.create({
    title: 'Click',
    categoryId: comedyCategory,
    actorsIds: [adamSandler._id],
  })

  await Movie.create({
    title: 'The Waterboy',
    categoryId: comedyCategory,
    actorsIds: [adamSandler._id],
  })

  mongoose.connection.close()
})()
