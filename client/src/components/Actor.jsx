import { gql, useQuery } from '@apollo/client'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'

const ACTOR_QUERY = gql`
  query ActorQuery($id: MongoID!) {
    actorById(_id: $id) {
      name
      movies {
        _id
        title
      }
    }
  }
`

export default function Actor() {
  const { id } = useParams()

  const { loading, data } = useQuery(ACTOR_QUERY, { variables: { id } })

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <div>
      <h1>{data.actorById.name}</h1>
      <h2>Movies:</h2>
      <ul>
        {data.actorById.movies.map((movie) => (
          <Link className="db" to={'/movie/' + movie._id} key={movie._id}>
            {movie.title}
          </Link>
        ))}
      </ul>
    </div>
  )
}
