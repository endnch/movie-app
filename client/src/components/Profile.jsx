import { useState } from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'
import { Link } from 'react-router-dom'

import { MOVIE_QUERY } from './Movie'

const USER_UPDATE_MUTATION = gql`
  mutation UserUpdateMutation($email: String, $password: String) {
    userUpdate(email: $email, password: $password) {
      email
      password
    }
  }
`

export const USER_GET_INFO_QUERY = gql`
  query UserGetInfoQuery {
    userGetInfo {
      email
      favoriteMovies {
        _id
        title
      }
    }
  }
`

const REMOVE_FROM_FAVORITES_MUTATION = gql`
  mutation RemoveFromFavorites($movieId: MongoID!) {
    userRemoveFromFavorites(movieId: $movieId) {
      email
    }
  }
`

export default function Profile() {
  const [formState, setFormState] = useState({
    email: '',
    password: '',
  })

  const [userUpdate] = useMutation(USER_UPDATE_MUTATION, {
    variables: {
      email: formState.email,
      password: formState.password,
    },
    onCompleted: () => {
      alert('User updated successfully')
    },
  })

  const [removeFromFavorites] = useMutation(REMOVE_FROM_FAVORITES_MUTATION, {
    onCompleted: () => {
      alert('Removed from favorites')
    },
  })

  const { loading, data } = useQuery(USER_GET_INFO_QUERY, {
    onCompleted: (data) => {
      setFormState({
        email: data.userGetInfo.email,
        password: data.userGetInfo.password,
      })
    },
  })

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <div>
      <h1>Favorite Movies</h1>
      {data.userGetInfo.favoriteMovies.map((movie) => (
        <div key={movie._id}>
          <Link className="mr1" to={'/movie/' + movie._id}>
            {movie.title}
          </Link>
          <button
            onClick={() =>
              removeFromFavorites({
                variables: { movieId: movie._id },
                refetchQueries: [
                  { query: USER_GET_INFO_QUERY },
                  { query: MOVIE_QUERY, variables: { id: movie._id } },
                ],
              })
            }
          >
            Remove from favorites
          </button>
        </div>
      ))}
      <h1>Settings</h1>
      <span>Change email:</span>
      <input
        className="db mb2"
        type="text"
        placeholder="Email"
        value={formState.email}
        onChange={(e) =>
          setFormState({
            ...formState,
            email: e.target.value,
          })
        }
      />
      <span>Change password:</span>
      <input
        className="db mb2"
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setFormState({
            ...formState,
            password: e.target.value,
          })
        }
      />
      <button onClick={userUpdate}>Update Info</button>
    </div>
  )
}
