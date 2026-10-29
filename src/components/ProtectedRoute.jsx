
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

// Компонент для защиты страниц
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  // Если студент не авторизован,
  // перенаправляем его на страницу входа.
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from:
            location.pathname +
            location.search +
            location.hash,
        }}
      />
    )
  }

  // Если студент авторизован,
  // открываем защищённую страницу.
  return children
}

export default ProtectedRoute
