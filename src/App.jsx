
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'

import { AuthProvider } from './context/AuthContext.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'

import ProtectedRoute from './components/ProtectedRoute.jsx'

import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Booking from './pages/Booking.jsx'
import MyBookings from './pages/MyBookings.jsx'

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>

            {/* ГЛАВНАЯ */}
            <Route
              path="/"
              element={<Home />}
            />

            {/* ВХОД */}
            <Route
              path="/login"
              element={<Login />}
            />

            {/* РЕГИСТРАЦИЯ */}
            <Route
              path="/register"
              element={<Register />}
            />

            {/* ЗАПИСЬ ДОСТУПНА ДЛЯ ПРОСМОТРА ВСЕМ */}
            <Route
              path="/booking"
              element={<Booking />}
            />

            {/* МОИ ЗАПИСИ — ТОЛЬКО ПОСЛЕ ВХОДА */}
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />

          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  )
}

export default App
