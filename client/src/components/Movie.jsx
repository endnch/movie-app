import { useContext } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'

import { USER_GET_INFO_QUERY } from './Profile'
import { UserContext } from './App'

export const MOVIE_QUERY = gql`
  query MovieQuery($id: MongoID!) {
    movieById(_id: $id) {
      title
      actors {
        _id
        name
      }
      haveFavorited {
        _id
        email
      }
    }
  }
`

const ADD_TO_FAVORITES_MUTATION = gql`
  mutation AddToFavoritesQuery($movieId: MongoID!) {
    userAddToFavorites(movieId: $movieId) {
      email
    }
  }
`

export default function Movie() {
  const { id } = useParams()
  const [user] = useContext(UserContext)

  const [addToFavorites] = useMutation(ADD_TO_FAVORITES_MUTATION, {
    variables: { movieId: id },
    refetchQueries: [
      { query: USER_GET_INFO_QUERY },
      { query: MOVIE_QUERY, variables: { id } },
    ],
    onCompleted: () => {
      alert('Added to favorites!')
    },
  })

  const { loading, data } = useQuery(MOVIE_QUERY, { variables: { id } })

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <div>
      <h1>{data.movieById.title}</h1>
      {user && <button onClick={addToFavorites}>Add To Favorites</button>}
      <h2>Actors:</h2>
      <ul>
        {data.movieById.actors.map((actor) => (
          <Link className="db" to={'/actor/' + actor._id} key={actor._id}>
            {actor.name}
          </Link>
        ))}
      </ul>
      <h2>Users who have favorited this movie:</h2>
      <ul>
        {data.movieById.haveFavorited.map((user) => (
          <li key={user._id}>{user.email}</li>
        ))}
      </ul>
    </div>
  )
}
