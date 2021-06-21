import { useState } from 'react'
import { gql, useMutation } from '@apollo/client'

import { CATEGORY_LIST_QUERY } from './CategoryList'

const CREATE_CATEGORY_MUTATION = gql`
  mutation CreateCategoryMutation($name: String!) {
    categoryCreateOne(record: { name: $name }) {
      recordId
    }
  }
`

export default function CreateCategory() {
  const [name, setName] = useState('')

  const [createCategory] = useMutation(CREATE_CATEGORY_MUTATION, {
    refetchQueries: [{ query: CATEGORY_LIST_QUERY }],
    variables: {
      name,
    },
    onCompleted: () => {
      alert('Category created successfully')
      setName('')
    },
  })

  return (
    <div>
      <h2>Create Category</h2>
      <input
        className="db mb2"
        type="text"
        placeholder="Category name"
        value={name}
        onChange={(e) => {
          setName(e.target.value)
        }}
      />
      <button onClick={createCategory}>Create Category</button>
    </div>
  )
}
