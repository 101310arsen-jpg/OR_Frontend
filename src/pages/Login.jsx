
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import '../App.css'

const API_URL = 'http://127.0.0.1:8001'

function Login() {
  const navigate = useNavigate()

  const {
    login,
    logout,
    isAuthenticated,
    currentUser,
  } = useAuth()

  const [form, setForm] = useState({
    username: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Обновление полей формы
  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))

    setError('')
  }

  // Авторизация через Django API
  const handleSubmit = async (event) => {
    event.preventDefault()

    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        `${API_URL}/api/auth/token/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            username: form.username.trim(),
            password: form.password,
          }),
        }
      )

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(
          typeof data?.detail === 'string'
            ? data.detail
            : 'Не удалось войти. Проверь логин и пароль.'
        )
      }

      if (!data?.access) {
        throw new Error(
          'Сервер не вернул access-токен.'
        )
      }

      // Сохраняем авторизацию в AuthContext
      login(data.access, form.username.trim())

      // Очищаем поля после входа
      setForm({
        username: '',
        password: '',
      })

      // Перенаправляем на страницу записи
      navigate('/booking')

    } catch (err) {
      console.error('Ошибка авторизации:', err)

      setError(
        err.message || 'Произошла ошибка при входе.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="site-wrapper">

      {/* ШАПКА САЙТА */}
      <header className="site-header">

        <Link
          to="/"
          className="brand"
          aria-label="Online Record"
        >
          <img
            className="college-logo"
            src="/nomad.webp"
            alt="Nomad College"
          />

          <span className="brand-text">
            <strong>ONLINE</strong>
            <span>RECORD</span>
          </span>
        </Link>

        <div className="header-actions">
          <Link
            to="/"
            className="header-button"
          >
            На главную
          </Link>
        </div>
      </header>

      {/* ОСНОВНОЕ СОДЕРЖИМОЕ */}
      <main
        className="section-container"
        style={{
          paddingTop: '80px',
          paddingBottom: '100px',
        }}
      >

        <div className="section-heading">
          <span className="section-kicker">
            ONLINE RECORD
          </span>

          <h2>Вход в аккаунт</h2>

          <p>
            Войди в аккаунт, чтобы записаться
            на приём в NOMAD College.
          </p>
        </div>

        <div
          className="feature-card"
          style={{
            maxWidth: '520px',
            margin: '0 auto',
          }}
        >

          {isAuthenticated ? (

            // ПОЛЬЗОВАТЕЛЬ УЖЕ АВТОРИЗОВАН
            <div>
              <h3>Вход выполнен успешно!</h3>

              <p style={{ margin: '16px 0 24px' }}>
                Ты вошёл как:{' '}
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
                  to="/booking"
                  className="button button-primary"
                >
                  Перейти к записи →
                </Link>

                <button
                  type="button"
                  className="button button-secondary"
                  onClick={logout}
                  style={{
                    cursor: 'pointer',
                  }}
                >
                  Выйти
                </button>

              </div>
            </div>

          ) : (

            // ФОРМА ВХОДА
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
                  <span>Логин *</span>

                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    autoComplete="username"
                    placeholder="Введите логин"
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
                  <span>Пароль *</span>

                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    placeholder="Введите пароль"
                    required
                  />
                </label>

              </div>

              {/* СООБЩЕНИЕ ОБ ОШИБКЕ */}
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
                  cursor: loading ? 'wait' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading
                  ? 'Выполняется вход...'
                  : 'Войти'}
              </button>

              {/* ПЕРЕХОД К РЕГИСТРАЦИИ */}
              <p style={{ marginTop: '22px' }}>
                Нет аккаунта?{' '}
                <Link to="/register">
                  Зарегистрироваться
                </Link>
              </p>

            </form>

          )}
        </div>
      </main>

      {/* ПОДВАЛ */}
      <footer className="site-footer">

        <Link to="/" className="footer-brand">
          <span>ONLINE RECORD</span>
        </Link>

        <p>
          © {new Date().getFullYear()} Online Record.
          Все права защищены.
        </p>

        <span className="footer-year">
          NOMAD COLLEGE
        </span>

      </footer>

    </div>
  )
}

export default Login
