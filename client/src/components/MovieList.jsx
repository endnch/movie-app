import { gql, useQuery } from '@apollo/client'
import { Link } from 'react-router-dom'

const MOVIE_LIST_QUERY = gql`
  query MovieListQuery {
    movieMany {
      _id
      title
    }
  }
`

export default function MovieList() {
  const { loading, data } = useQuery(MOVIE_LIST_QUERY)

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <div>
      <h1>Movie List</h1>
      <ul>
        {data.movieMany.map((movie) => (
          <Link className="db" to={'/movie/' + movie._id} key={movie._id}>
            {movie.title}
          </Link>
        ))}
      </ul>
    </div>
  )
}
