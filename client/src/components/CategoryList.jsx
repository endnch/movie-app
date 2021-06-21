import { gql, useQuery } from '@apollo/client'

export const CATEGORY_LIST_QUERY = gql`
  query CategoryListQuery {
    categoryMany {
      _id
      name
    }
  }
`

export default function MovieList() {
  const { loading, data } = useQuery(CATEGORY_LIST_QUERY)

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <div>
      <h1>Category List</h1>
      <ul>
        {data.categoryMany.map((category) => (
          <li className="db" key={category._id}>
            {category.name}
          </li>
        ))}
      </ul>
    </div>
  )
}
