
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useLanguage } from '../context/LanguageContext.jsx'
import { api, getApiErrorMessage } from '../services/api.js'

import { translations } from '../locales/index.js'
import Header from '../components/Header.jsx'
import '../App.css'

// ==========================================
// 1. ПЕРЕВОДЫ СТРАНИЦЫ
// ==========================================



// ==========================================
// 2. ОСНОВНОЙ КОМПОНЕНТ
// ==========================================

function Register() {
  const navigate = useNavigate()

  const { language } = useLanguage()
  const t = translations[language]?.register || translations.RU.register

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

  // ==========================================
  // 3. ИЗМЕНЕНИЕ ПОЛЕЙ ФОРМЫ
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
  // 4. РЕГИСТРАЦИЯ ЧЕРЕЗ API-СЕРВИС
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (loading) return

    setLoading(true)
    setError('')

    try {
      // Подготавливаем данные студента
      const studentData = {
        username: form.username.trim(),
        password: form.password,
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        phone: form.phone.trim(),
        direction: form.direction,
        course: Number(form.course),
      }

      // Отправляем данные в Django через api.js
      await api.register(studentData)

      // Регистрация успешна — открываем вход
      navigate('/login')

    } catch (err) {
      console.error('Ошибка регистрации:', err)

      setError(
        getApiErrorMessage(
          err,
          t.unknownError
        )
      )

    } finally {
      setLoading(false)
    }
  }

  const fieldStyle = {
    display: 'grid',
    gap: '8px',
  }

  // ==========================================
  // 5. ИНТЕРФЕЙС СТРАНИЦЫ
  // ==========================================

  return (
    <div className="site-wrapper">

      {/* ОБЩАЯ ШАПКА */}
      <Header />

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

            {/* ТЕЛЕФОН */}
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

            {/* НАПРАВЛЕНИЕ ОБУЧЕНИЯ */}
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

          {/* ОШИБКА РЕГИСТРАЦИИ */}
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
