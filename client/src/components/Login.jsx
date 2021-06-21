import { useState, useContext } from 'react'
import { useHistory } from 'react-router'
import { gql, useMutation } from '@apollo/client'

import { AUTH_TOKEN } from '../constants'
import { UserContext } from './App'

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!) {
    signUp(email: $email, password: $password) {
      token
      user {
        _id
        role
      }
    }
  }
`

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        role
      }
    }
  }
`

function Login() {
  const history = useHistory()
  const [, setUser] = useContext(UserContext)

  const [formState, setFormState] = useState({
    login: true,
    email: '',
    password: '',
  })

  const [login] = useMutation(LOGIN_MUTATION, {
    variables: {
      email: formState.email,
      password: formState.password,
    },
    onCompleted: ({ login }) => {
      localStorage.setItem(AUTH_TOKEN, login.token)
      setUser(login.user)
      history.push('/')
    },
  })

  const [signup] = useMutation(SIGNUP_MUTATION, {
    variables: {
      email: formState.email,
      password: formState.password,
    },
    onCompleted: ({ signUp }) => {
      localStorage.setItem(AUTH_TOKEN, signUp.token)
      setUser(signUp.user)
      history.push('/')
    },
  })

  return (
    <div>
      <h1>{formState.login ? 'Login' : 'Sign Up'}</h1>
      <input
        className="db mb2"
        type="text"
        placeholder="Email"
        onChange={(e) =>
          setFormState({
            ...formState,
            email: e.target.value,
          })
        }
      />
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
      <button onClick={formState.login ? login : signup}>
        {formState.login ? 'Login' : 'Sign Up'}
      </button>
      <span
        className="pointer db"
        onClick={(e) =>
          setFormState({
            ...formState,
            login: !formState.login,
          })
        }
      >
        {formState.login
          ? 'Need to create an account?'
          : 'Already have an account?'}
      </span>
    </div>
  )
}

export default Login
