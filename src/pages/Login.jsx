
import { useState } from 'react'
import {
  Link,
  useNavigate,
  useLocation,
} from 'react-router-dom'

import { useAuth } from '../context/AuthContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import {
  api,
  getApiErrorMessage,
} from '../services/api.js'

import { translations } from '../locales/index.js'
import Header from '../components/Header.jsx'
import '../App.css'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()

  // Язык сайта
  const { language } = useLanguage()
  const t =
    translations[language]?.login ||
    translations.RU.login

  // Авторизация
  const {
    login,
    logout,
    isAuthenticated,
    currentUser,
  } = useAuth()

  // Страница, которую студент хотел открыть
  const requestedPath = location.state?.from

  // Разрешаем возвращаться только на
  // известные защищённые маршруты.
  const destination =
    typeof requestedPath === 'string' &&
    /^\/(?:booking|my-bookings)(?:[?#]|$)/.test(requestedPath)
      ? requestedPath
      : '/booking'

  // Поля формы
  const [form, setForm] = useState({
    username: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // ==========================================
  // 1. ИЗМЕНЕНИЕ ПОЛЕЙ
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))

    setError('')
  }

  // ==========================================
  // 2. ВХОД ЧЕРЕЗ DJANGO API
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (loading) return

    setLoading(true)
    setError('')

    try {
      const username = form.username.trim()

      // Запрашиваем JWT-токен
      const data = await api.login(
        username,
        form.password
      )

      if (!data?.access) {
        throw new Error(t.tokenError)
      }

      // Сохраняем авторизацию
      login(data.access, username)

      // Очищаем поля
      setForm({
        username: '',
        password: '',
      })

      // Возвращаем студента на нужную страницу
      navigate(destination, {
        replace: true,
      })

    } catch (err) {
      console.error('Ошибка авторизации:', err)

      setError(
        err.message === t.tokenError
          ? t.tokenError
          : getApiErrorMessage(
              err,
              t.loginError
            )
      )

    } finally {
      setLoading(false)
    }
  }

  // ==========================================
  // 3. ИНТЕРФЕЙС
  // ==========================================

  return (
    <div className="site-wrapper">

      <Header />

      <main
        className="section-container"
        style={{
          paddingTop: '80px',
          paddingBottom: '100px',
        }}
      >

        {/* ЗАГОЛОВОК */}
        <div className="section-heading">
          <span className="section-kicker">
            ONLINE RECORD
          </span>

          <h2>{t.title}</h2>
          <p>{t.description}</p>
        </div>

        <div
          className="feature-card"
          style={{
            maxWidth: '520px',
            margin: '0 auto',
          }}
        >

          {isAuthenticated ? (

            /* СТУДЕНТ УЖЕ ВОШЁЛ */
            <div>
              <h3>{t.success}</h3>

              <p
                style={{
                  margin: '16px 0 24px',
                }}
              >
                {t.loggedInAs}{' '}
                <strong>{currentUser}</strong>
              </p>

              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  flexWrap: 'wrap',
                }}
              >

                <Link
                  to={destination}
                  className="button button-primary"
                >
                  {t.goToBooking}
                </Link>

                <button
                  type="button"
                  className="button button-secondary"
                  onClick={logout}
                  style={{
                    cursor: 'pointer',
                  }}
                >
                  {t.logout}
                </button>

              </div>
            </div>

          ) : (

            /* ФОРМА АВТОРИЗАЦИИ */
            <form onSubmit={handleSubmit}>

              <div
                style={{
                  display: 'grid',
                  gap: '20px',
                }}
              >

                {/* ЛОГИН */}
                <label
                  style={{
                    display: 'grid',
                    gap: '8px',
                  }}
                >
                  <span>{t.username} *</span>

                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    autoComplete="username"
                    placeholder={t.usernamePlaceholder}
                    required
                  />
                </label>

                {/* ПАРОЛЬ */}
                <label
                  style={{
                    display: 'grid',
                    gap: '8px',
                  }}
                >
                  <span>{t.password} *</span>

                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    placeholder={t.passwordPlaceholder}
                    required
                  />
                </label>

              </div>

              {/* ОШИБКА */}
              {error && (
                <p
                  role="alert"
                  style={{
                    color: '#d51f32',
                    marginTop: '18px',
                    overflowWrap: 'anywhere',
                  }}
                >
                  {error}
                </p>
              )}

              {/* КНОПКА ВХОДА */}
              <button
                className="button button-primary"
                type="submit"
                disabled={loading}
                style={{
                  marginTop: '25px',
                  border: 0,
                  cursor: loading
                    ? 'wait'
                    : 'pointer',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading
                  ? t.loading
                  : t.login}
              </button>

              {/* РЕГИСТРАЦИЯ */}
              <p
                style={{
                  marginTop: '22px',
                }}
              >
                {t.noAccount}{' '}

                <Link to="/register">
                  {t.register}
                </Link>
              </p>

            </form>
          )}

        </div>
      </main>

      {/* ПОДВАЛ */}
      <footer className="site-footer">

        <Link
          to="/"
          className="footer-brand"
        >
          <span>ONLINE RECORD</span>
        </Link>

        <p>
          © {new Date().getFullYear()} Online Record.
          {' '}{t.rights}
        </p>

        <span className="footer-year">
          NOMAD COLLEGE
        </span>

      </footer>
    </div>
  )
}

export default Login
