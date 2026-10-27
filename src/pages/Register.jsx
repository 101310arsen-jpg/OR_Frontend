
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../App.css'

const API_URL = 'http://127.0.0.1:8001'

function Register() {
  const navigate = useNavigate()

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

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))

    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/api/register/`, {
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
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        const message =
          data?.detail ||
          Object.entries(data || {})
            .map(([field, value]) =>
              `${field}: ${Array.isArray(value) ? value.join(', ') : value}`
            )
            .join(' | ')

        throw new Error(message || 'Ошибка регистрации')
      }

      navigate('/login')
    } catch (err) {
      setError(err.message || 'Не удалось зарегистрироваться')
    } finally {
      setLoading(false)
    }
  }

  const fieldStyle = {
    display: 'grid',
    gap: '7px',
  }

  return (
    <div className="site-wrapper">
      <header className="site-header">
        <Link to="/" className="brand">
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
          <Link to="/" className="header-button">
            На главную
          </Link>
        </div>
      </header>

      <main
        className="section-container"
        style={{
          paddingTop: '70px',
          paddingBottom: '100px',
        }}
      >
        <div className="section-heading">
          <span className="section-kicker">
            ONLINE RECORD
          </span>

          <h2>Регистрация</h2>

          <p>
            Создай аккаунт для онлайн-записи
            в NOMAD College.
          </p>
        </div>

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
            <label style={fieldStyle}>
              <span>Логин *</span>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
                minLength={3}
                maxLength={150}
                required
              />
            </label>

            <label style={fieldStyle}>
              <span>Пароль *</span>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                minLength={8}
                required
              />
            </label>

            <label style={fieldStyle}>
              <span>Имя *</span>
              <input
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                autoComplete="given-name"
                required
              />
            </label>

            <label style={fieldStyle}>
              <span>Фамилия *</span>
              <input
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                autoComplete="family-name"
                required
              />
            </label>

            <label style={fieldStyle}>
              <span>Номер телефона *</span>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                autoComplete="tel"
                required
              />
            </label>

            <label style={fieldStyle}>
              <span>Направление обучения *</span>
              <select
                name="direction"
                value={form.direction}
                onChange={handleChange}
                required
              >
                <option value="it">IT</option>
              </select>
            </label>

            <label style={fieldStyle}>
              <span>Курс *</span>
              <select
                name="course"
                value={form.course}
                onChange={handleChange}
                required
              >
                <option value="1">1 курс</option>
                <option value="2">2 курс</option>
                <option value="3">3 курс</option>
                <option value="4">4 курс</option>
              </select>
            </label>
          </div>

          {error && (
            <p
              role="alert"
              style={{
                marginTop: '20px',
                color: '#d51f32',
                overflowWrap: 'anywhere',
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="button button-primary"
            disabled={loading}
            style={{
              border: 0,
              marginTop: '25px',
              cursor: loading ? 'wait' : 'pointer',
            }}
          >
            {loading
              ? 'Регистрируем...'
              : 'Зарегистрироваться'}
          </button>

          <p style={{ marginTop: '20px' }}>
            Уже есть аккаунт?{' '}
            <Link to="/login">Войти</Link>
          </p>
        </form>
      </main>
    </div>
  )
}

export default Register
