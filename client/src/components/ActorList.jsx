import { gql, useQuery } from '@apollo/client'
import { Link } from 'react-router-dom'

const ACTOR_LIST_QUERY = gql`
  query ActorListQuery {
    actorMany {
      _id
      name
    }
  }
`

export default function ActorList() {
  const { loading, data } = useQuery(ACTOR_LIST_QUERY)

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <div>
      <h1>Actor List</h1>
      <ul>
        {data.actorMany.map((actor) => (
          <Link className="db" to={'/actor/' + actor._id} key={actor._id}>
            {actor.name}
          </Link>
        ))}
      </ul>
    </div>
  )
}
