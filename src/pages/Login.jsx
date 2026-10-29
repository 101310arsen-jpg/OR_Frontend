
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { api, getApiErrorMessage } from '../services/api.js'

import Header from '../components/Header.jsx'
import '../App.css'

// Переводы страницы входа
const translations = {
  RU: {
    title: 'Вход в аккаунт',
    description:
      'Войди в аккаунт, чтобы записаться на приём в NOMAD College.',
    username: 'Логин',
    password: 'Пароль',
    usernamePlaceholder: 'Введите логин',
    passwordPlaceholder: 'Введите пароль',
    login: 'Войти',
    loading: 'Выполняется вход...',
    noAccount: 'Нет аккаунта?',
    register: 'Зарегистрироваться',
    success: 'Вход выполнен успешно!',
    loggedInAs: 'Ты вошёл как:',
    goToBooking: 'Перейти к записи →',
    logout: 'Выйти',
    loginError:
      'Не удалось войти. Проверь логин и пароль.',
    tokenError:
      'Сервер не вернул access-токен.',
    unknownError:
      'Произошла ошибка при входе.',
    rights: 'Все права защищены.',
  },

  KG: {
    title: 'Аккаунтка кирүү',
    description:
      'NOMAD College кабыл алуусуна жазылуу үчүн аккаунтуңа кир.',
    username: 'Логин',
    password: 'Сырсөз',
    usernamePlaceholder: 'Логинди киргиз',
    passwordPlaceholder: 'Сырсөздү киргиз',
    login: 'Кирүү',
    loading: 'Кирүү аткарылууда...',
    noAccount: 'Аккаунтуң жокпу?',
    register: 'Катталуу',
    success: 'Ийгиликтүү кирдиң!',
    loggedInAs: 'Сенин аккаунтуң:',
    goToBooking: 'Жазылууга өтүү →',
    logout: 'Чыгуу',
    loginError:
      'Кирүү мүмкүн болгон жок. Логинди жана сырсөздү текшер.',
    tokenError:
      'Сервер access-токен кайтарган жок.',
    unknownError:
      'Кирүү учурунда ката кетти.',
    rights: 'Бардык укуктар корголгон.',
  },

  EN: {
    title: 'Sign in to your account',
    description:
      'Sign in to book an appointment at NOMAD College.',
    username: 'Username',
    password: 'Password',
    usernamePlaceholder: 'Enter username',
    passwordPlaceholder: 'Enter password',
    login: 'Sign in',
    loading: 'Signing in...',
    noAccount: "Don't have an account?",
    register: 'Register',
    success: 'Signed in successfully!',
    loggedInAs: 'Signed in as:',
    goToBooking: 'Go to booking →',
    logout: 'Log out',
    loginError:
      'Unable to sign in. Check your username and password.',
    tokenError:
      'The server did not return an access token.',
    unknownError:
      'An error occurred while signing in.',
    rights: 'All rights reserved.',
  },
}

function Login() {
  const navigate = useNavigate()

  const { language } = useLanguage()
  const t = translations[language] || translations.RU

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

  // Изменение полей формы
  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))

    setError('')
  }

  // ======================================
  // АВТОРИЗАЦИЯ ЧЕРЕЗ ЕДИНЫЙ API-СЕРВИС
  // ======================================

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (loading) return

    setLoading(true)
    setError('')

    try {
      // Отправляем запрос через api.js
      const data = await api.login(
        form.username.trim(),
        form.password
      )

      // Проверяем, вернул ли Django JWT
      if (!data?.access) {
        throw new Error(t.tokenError)
      }

      // Сохраняем авторизацию в AuthContext
      login(
        data.access,
        form.username.trim()
      )

      // Очищаем форму
      setForm({
        username: '',
        password: '',
      })

      // Открываем страницу записи
      navigate('/booking')

    } catch (err) {
      console.error('Ошибка авторизации:', err)

      setError(
        err.message === t.tokenError
          ? t.tokenError
          : getApiErrorMessage(err, t.loginError)
      )

    } finally {
      setLoading(false)
    }
  }

  // ======================================
  // ИНТЕРФЕЙС
  // ======================================

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

            // Уже авторизован
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
                  to="/booking"
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

            // Форма авторизации
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
