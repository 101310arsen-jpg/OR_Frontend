
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

const AuthContext = createContext(null)

const STORAGE_KEY = 'online_record_session'

// Проверяем срок действия JWT-токена
function getTokenExpiration(token) {
  try {
    const payload = JSON.parse(
      atob(token.split('.')[1])
    )

    return typeof payload.exp === 'number'
      ? payload.exp * 1000
      : 0
  } catch {
    return 0
  }
}

// Читаем сохранённую авторизацию
function getSavedSession() {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY)

    if (!saved) return null

    const session = JSON.parse(saved)

    if (
      !session.accessToken ||
      !session.currentUser ||
      getTokenExpiration(session.accessToken) <= Date.now()
    ) {
      sessionStorage.removeItem(STORAGE_KEY)
      return null
    }

    return session
  } catch {
    sessionStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(getSavedSession)

  const accessToken = session?.accessToken || ''
  const currentUser = session?.currentUser || ''

  const logout = () => {
    sessionStorage.removeItem(STORAGE_KEY)
    setSession(null)
  }

  const login = (token, username) => {
    if (getTokenExpiration(token) <= Date.now()) {
      throw new Error('Получен недействительный токен.')
    }

    const newSession = {
      accessToken: token,
      currentUser: username,
    }

    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(newSession)
    )

    setSession(newSession)
  }

  // Автоматически завершаем сессию после истечения токена
  useEffect(() => {
    if (!accessToken) return

    const expiration = getTokenExpiration(accessToken)
    const remaining = expiration - Date.now()

    if (remaining <= 0) {
      logout()
      return
    }

    const timer = setTimeout(() => {
      logout()
    }, remaining)

    return () => clearTimeout(timer)
  }, [accessToken])

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
    throw new Error(
      'useAuth должен использоваться внутри AuthProvider'
    )
  }

  return context
}
