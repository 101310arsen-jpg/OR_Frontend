
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext.jsx'
import Header from '../components/Header.jsx'
import '../App.css'

const API_URL = 'http://127.0.0.1:8001'

// Переводы страницы регистрации
const translations = {
  RU: {
    title: 'Регистрация',
    description:
      'Создай аккаунт для онлайн-записи в NOMAD College.',
    username: 'Логин',
    password: 'Пароль',
    firstName: 'Имя',
    lastName: 'Фамилия',
    phone: 'Номер телефона',
    direction: 'Направление обучения',
    course: 'Курс',
    courseLabel: 'курс',
    usernamePlaceholder: 'Придумай логин',
    passwordPlaceholder: 'Не менее 8 символов',
    firstNamePlaceholder: 'Введи имя',
    lastNamePlaceholder: 'Введи фамилию',
    phonePlaceholder: 'Введи номер телефона',
    register: 'Зарегистрироваться',
    registering: 'Регистрируем...',
    alreadyAccount: 'Уже есть аккаунт?',
    login: 'Войти',
    registerError: 'Ошибка регистрации',
    unknownError: 'Не удалось зарегистрироваться',
    rights: 'Все права защищены.',
  },

  KG: {
    title: 'Катталуу',
    description:
      'NOMAD College онлайн жазылуусу үчүн аккаунт түз.',
    username: 'Логин',
    password: 'Сырсөз',
    firstName: 'Аты',
    lastName: 'Фамилиясы',
    phone: 'Телефон номери',
    direction: 'Окуу багыты',
    course: 'Курс',
    courseLabel: 'курс',
    usernamePlaceholder: 'Логин ойлоп тап',
    passwordPlaceholder: 'Кеминде 8 белги',
    firstNamePlaceholder: 'Атыңды киргиз',
    lastNamePlaceholder: 'Фамилияңды киргиз',
    phonePlaceholder: 'Телефон номериңди киргиз',
    register: 'Катталуу',
    registering: 'Катталууда...',
    alreadyAccount: 'Аккаунтуң барбы?',
    login: 'Кирүү',
    registerError: 'Катталууда ката кетти',
    unknownError: 'Катталуу мүмкүн болгон жок',
    rights: 'Бардык укуктар корголгон.',
  },

  EN: {
    title: 'Create an account',
    description:
      'Create an account to book appointments at NOMAD College.',
    username: 'Username',
    password: 'Password',
    firstName: 'First name',
    lastName: 'Last name',
    phone: 'Phone number',
    direction: 'Study program',
    course: 'Year of study',
    courseLabel: 'Year',
    usernamePlaceholder: 'Choose a username',
    passwordPlaceholder: 'At least 8 characters',
    firstNamePlaceholder: 'Enter first name',
    lastNamePlaceholder: 'Enter last name',
    phonePlaceholder: 'Enter phone number',
    register: 'Register',
    registering: 'Registering...',
    alreadyAccount: 'Already have an account?',
    login: 'Sign in',
    registerError: 'Registration error',
    unknownError: 'Registration failed',
    rights: 'All rights reserved.',
  },
}

// Преобразование ошибки Django в текст
function getErrorMessage(data, fallback) {
  if (typeof data?.detail === 'string') {
    return data.detail
  }

  if (data && typeof data === 'object') {
    const messages = Object.entries(data).map(
      ([field, value]) => {
        const message = Array.isArray(value)
          ? value.join(', ')
          : String(value)

        return `${field}: ${message}`
      }
    )

    return messages.join(' | ') || fallback
  }

  return fallback
}

function Register() {
  const navigate = useNavigate()

  const { language } = useLanguage()
  const t = translations[language] || translations.RU

  // Данные формы
  const [form, setForm] = useState({
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    direction: 'it',
    course: '1',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Обновляем поля формы
  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))

    setError('')
  }

  // Отправляем регистрацию в Django
  const handleSubmit = async (event) => {
    event.preventDefault()

    if (loading) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        `${API_URL}/api/register/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            username: form.username.trim(),
            password: form.password,
            first_name: form.first_name.trim(),
            last_name: form.last_name.trim(),
            phone: form.phone.trim(),
            direction: form.direction,
            course: Number(form.course),
          }),
        }
      )

      const data = await response.json().catch(
        () => null
      )

      if (!response.ok) {
        throw new Error(
          getErrorMessage(data, t.registerError)
        )
      }

      // После регистрации переходим ко входу
      navigate('/login')
    } catch (err) {
      console.error('Ошибка регистрации:', err)

      setError(
        err.message || t.unknownError
      )
    } finally {
      setLoading(false)
    }
  }

  const fieldStyle = {
    display: 'grid',
    gap: '8px',
  }

  return (
    <div className="site-wrapper">

      {/* ОБЩАЯ ШАПКА */}
      <Header />

      {/* ОСНОВНАЯ СТРАНИЦА */}
      <main
        className="section-container"
        style={{
          paddingTop: '70px',
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

        {/* ФОРМА РЕГИСТРАЦИИ */}
        <form
          className="feature-card"
          onSubmit={handleSubmit}
          style={{
            maxWidth: '720px',
            margin: '0 auto',
          }}
        >

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '18px',
            }}
          >

            {/* ЛОГИН */}
            <label style={fieldStyle}>
              <span>{t.username} *</span>

              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
                placeholder={t.usernamePlaceholder}
                minLength={3}
                maxLength={150}
                required
              />
            </label>

            {/* ПАРОЛЬ */}
            <label style={fieldStyle}>
              <span>{t.password} *</span>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                placeholder={t.passwordPlaceholder}
                minLength={8}
                required
              />
            </label>

            {/* ИМЯ */}
            <label style={fieldStyle}>
              <span>{t.firstName} *</span>

              <input
                type="text"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                autoComplete="given-name"
                placeholder={t.firstNamePlaceholder}
                required
              />
            </label>

            {/* ФАМИЛИЯ */}
            <label style={fieldStyle}>
              <span>{t.lastName} *</span>

              <input
                type="text"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                autoComplete="family-name"
                placeholder={t.lastNamePlaceholder}
                required
              />
            </label>

            {/* НОМЕР ТЕЛЕФОНА */}
            <label style={fieldStyle}>
              <span>{t.phone} *</span>

              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                autoComplete="tel"
                placeholder={t.phonePlaceholder}
                required
              />
            </label>

            {/* НАПРАВЛЕНИЕ */}
            <label style={fieldStyle}>
              <span>{t.direction} *</span>

              <select
                name="direction"
                value={form.direction}
                onChange={handleChange}
                required
              >
                <option value="it">
                  IT
                </option>
              </select>
            </label>

            {/* КУРС */}
            <label style={fieldStyle}>
              <span>{t.course} *</span>

              <select
                name="course"
                value={form.course}
                onChange={handleChange}
                required
              >
                {[1, 2, 3, 4].map((course) => (
                  <option
                    key={course}
                    value={String(course)}
                  >
                    {language === 'EN'
                      ? `${t.courseLabel} ${course}`
                      : `${course} ${t.courseLabel}`}
                  </option>
                ))}
              </select>
            </label>

          </div>

          {/* ОШИБКА */}
          {error && (
            <p
              role="alert"
              style={{
                color: '#d51f32',
                marginTop: '20px',
                overflowWrap: 'anywhere',
              }}
            >
              {error}
            </p>
          )}

          {/* КНОПКА РЕГИСТРАЦИИ */}
          <button
            type="submit"
            className="button button-primary"
            disabled={loading}
            style={{
              border: 0,
              marginTop: '25px',
              cursor: loading
                ? 'wait'
                : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading
              ? t.registering
              : t.register}
          </button>

          {/* ССЫЛКА НА ВХОД */}
          <p style={{ marginTop: '20px' }}>
            {t.alreadyAccount}{' '}

            <Link to="/login">
              {t.login}
            </Link>
          </p>

        </form>

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

export default Register
