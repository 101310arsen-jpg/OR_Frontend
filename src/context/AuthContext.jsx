
import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState('')
  const [currentUser, setCurrentUser] = useState('')

  const login = (token, username) => {
    setAccessToken(token)
    setCurrentUser(username)
  }

  const logout = () => {
    setAccessToken('')
    setCurrentUser('')
  }

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        currentUser,
        isAuthenticated: Boolean(accessToken),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider')
  }

  return context
}
