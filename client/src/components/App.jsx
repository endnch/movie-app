import { useState, createContext } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { gql, useQuery } from '@apollo/client'

import Login from './Login'
import Actor from './Actor'
import Movie from './Movie'
import ActorList from './ActorList'
import MovieList from './MovieList'
import CategoryList from './CategoryList'
import Profile from './Profile'
import Header from './Header'
import AdminPanel from './AdminPanel'

export const UserContext = createContext()

export const USER_GET_INFO_QUERY = gql`
  query UserGetInfoQuery {
    userGetInfo {
      _id
      role
    }
  }
`

function App() {
  const [user, setUser] = useState({})

  useQuery(USER_GET_INFO_QUERY, {
    onCompleted: (data) => {
      setUser(data.userGetInfo)
    },
  })

  return (
    <UserContext.Provider value={[user, setUser]}>
      <div>
        <Header />
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/movielist" />} />
          <Route exact path="/login" render={() => <Login />} />
          <Route exact path="/actor/:id" component={Actor} />
          <Route exact path="/movie/:id" component={Movie} />
          <Route exact path="/actorlist" component={ActorList} />
          <Route exact path="/movielist" component={MovieList} />
          <Route exact path="/categorylist" component={CategoryList} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/adminpanel" component={AdminPanel} />
        </Switch>
      </div>
    </UserContext.Provider>
  )
}

export default App
