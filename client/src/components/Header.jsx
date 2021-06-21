import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router'

import { AUTH_TOKEN, ROLES } from '../constants'
import { UserContext } from './App'

export default function Header() {
  const authToken = localStorage.getItem(AUTH_TOKEN)
  const history = useHistory()
  const [user, setUser] = useContext(UserContext)

  return (
    <div>
      <Link className="pr1" to="/movielist">
        Movie List
      </Link>
      <Link className="pr1" to="/actorlist">
        Actor List
      </Link>
      <Link className="pr1" to="/categorylist">
        Category List
      </Link>
      {authToken && (
        <Link className="pr1" to="/profile">
          Profile
        </Link>
      )}
      {user.role === ROLES.Admin && (
        <Link className="pr1" to="/adminpanel">
          Admin Panel
        </Link>
      )}
      {authToken && (
        <button
          onClick={() => {
            localStorage.removeItem(AUTH_TOKEN)
            setUser({})
            history.push('/')
          }}
        >
          Logout
        </button>
      )}
      {!authToken && (
        <button onClick={() => history.push('/login')}>Login</button>
      )}
    </div>
  )
}
