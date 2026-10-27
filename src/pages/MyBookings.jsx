
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import '../App.css'

const API_URL = 'http://127.0.0.1:8001'

function getErrorMessage(data, fallback) {
  if (typeof data?.detail === 'string') {
    return data.detail
  }

  if (data && typeof data === 'object') {
    const messages = Object.entries(data).map(([key, value]) => {
      const text = Array.isArray(value)
        ? value.join(', ')
        : String(value)

      return `${key}: ${text}`
    })

    return messages.join(' | ') || fallback
  }

  return fallback
}

function formatDate(value) {
  if (!value) return '—'

  const date = new Date(`${value}T00:00:00`)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function getStatusLabel(status) {
  const statuses = {
    active: 'Активна',
    booked: 'Забронирована',
    cancelled: 'Отменена',
    done: 'Завершена',
  }

  return statuses[status] || status || 'Неизвестно'
}

function MyBookings() {
  const {
    accessToken,
    isAuthenticated,
    currentUser,
  } = useAuth()

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [cancellingId, setCancellingId] = useState(null)
  const [refreshCounter, setRefreshCounter] = useState(0)

  // Загружаем записи пользователя
  useEffect(() => {
    if (!accessToken) {
      setBookings([])
      setLoading(false)
      return
    }

    const controller = new AbortController()

    async function loadBookings() {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(
          `${API_URL}/api/booking/my/`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            signal: controller.signal,
          }
        )

        const data = await response.json().catch(() => null)

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error(
              'Срок действия авторизации истёк. Войди заново.'
            )
          }

          throw new Error(
            getErrorMessage(
              data,
              'Не удалось загрузить записи.'
            )
          )
        }

        // Поддержка списка и пагинированного ответа
        const items = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
            ? data.results
            : data?.id != null
              ? [data]
              : []

        if (!controller.signal.aborted) {
          setBookings(items)
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Ошибка получения записей:', err)
          setError(err.message || 'Произошла ошибка.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadBookings()

    return () => controller.abort()
  }, [accessToken, refreshCounter])

  // Отмена записи
  const handleCancel = async (booking) => {
    if (!booking?.id || !accessToken) return

    const confirmed = window.confirm(
      `Ты действительно хочешь отменить запись №${booking.id}?`
    )

    if (!confirmed) return

    setCancellingId(booking.id)
    setError('')
    setSuccessMessage('')

    try {
      const response = await fetch(
        `${API_URL}/api/booking/${booking.id}/cancel/`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(
          getErrorMessage(data, 'Не удалось отменить запись.')
        )
      }

      setSuccessMessage(
        `Запись №${booking.id} успешно отменена.`
      )

      // Получаем обновлённый список из Django
      setRefreshCounter((previous) => previous + 1)
    } catch (err) {
      console.error('Ошибка отмены записи:', err)
      setError(err.message || 'Не удалось отменить запись.')
    } finally {
      setCancellingId(null)
    }
  }

  const reloadBookings = () => {
    setSuccessMessage('')
    setRefreshCounter((previous) => previous + 1)
  }

  return (
    <div className="site-wrapper">

      {/* ШАПКА */}
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
          <Link to="/booking" className="header-button">
            Записаться
          </Link>
        </div>
      </header>

      {/* ОСНОВНАЯ СТРАНИЦА */}
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

          <h2>Мои записи</h2>

          <p>
            Просматривай свои записи и управляй
            посещениями NOMAD College.
          </p>
        </div>

        {/* НЕ АВТОРИЗОВАН */}
        {!isAuthenticated ? (
          <div
            className="feature-card"
            style={{
              maxWidth: '680px',
              margin: '0 auto',
            }}
          >
            <h3>Необходима авторизация</h3>

            <p style={{ margin: '18px 0 25px' }}>
              Чтобы посмотреть свои записи,
              сначала войди в аккаунт.
            </p>

            <Link
              to="/login"
              className="button button-primary"
            >
              Войти →
            </Link>
          </div>
        ) : (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>

            {/* ПАНЕЛЬ ПОЛЬЗОВАТЕЛЯ */}
            <div
              className="feature-card"
              style={{
                marginBottom: '25px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px',
                }}
              >
                <div>
                  <p>Студент</p>

                  <h3 style={{ marginTop: '5px' }}>
                    {currentUser}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={reloadBookings}
                  disabled={loading}
                  className="button button-secondary"
                  style={{ cursor: 'pointer' }}
                >
                  Обновить
                </button>
              </div>
            </div>

            {/* ЗАГРУЗКА */}
            {loading && (
              <p style={{ textAlign: 'center' }}>
                Загружаем твои записи...
              </p>
            )}

            {/* ОШИБКА */}
            {error && (
              <div
                role="alert"
                style={{
                  padding: '16px',
                  marginBottom: '20px',
                  background: '#fff1f1',
                  color: '#d51f32',
                  borderRadius: '10px',
                  overflowWrap: 'anywhere',
                }}
              >
                {error}
              </div>
            )}

            {/* УСПЕШНАЯ ОТМЕНА */}
            {successMessage && (
              <div
                role="status"
                style={{
                  padding: '16px',
                  marginBottom: '20px',
                  background: '#eef8f0',
                  color: '#167a3f',
                  borderRadius: '10px',
                }}
              >
                {successMessage}
              </div>
            )}

            {/* ПУСТОЙ СПИСОК */}
            {!loading && !error && bookings.length === 0 && (
              <div
                className="feature-card"
                style={{ textAlign: 'center' }}
              >
                <h3>У тебя пока нет записей</h3>

                <p style={{ margin: '16px 0 25px' }}>
                  Выбери вопрос, дату и удобное время,
                  чтобы записаться на приём.
                </p>

                <Link
                  to="/booking"
                  className="button button-primary"
                >
                  Записаться →
                </Link>
              </div>
            )}

            {/* СПИСОК ЗАПИСЕЙ */}
            {!loading && bookings.length > 0 && (
              <div
                style={{
                  display: 'grid',
                  gap: '20px',
                }}
              >
                {bookings.map((booking) => {
                  const canCancel =
                    booking.status === 'active' ||
                    booking.status === 'booked'

                  const isCancelling =
                    cancellingId === booking.id

                  return (
                    <article
                      className="feature-card"
                      key={booking.id}
                    >
                      {/* НАЗВАНИЕ И СТАТУС */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          flexWrap: 'wrap',
                          gap: '12px',
                          marginBottom: '22px',
                        }}
                      >
                        <div>
                          <span className="section-kicker">
                            ЗАПИСЬ №{booking.id}
                          </span>

                          <h3 style={{ marginTop: '8px' }}>
                            {booking.official || 'Приём'}
                          </h3>
                        </div>

                        <span
                          style={{
                            padding: '8px 14px',
                            borderRadius: '20px',
                            fontSize: '14px',
                            fontWeight: '600',
                            background:
                              booking.status === 'cancelled'
                                ? '#f1f1f1'
                                : '#eef8f0',
                            color:
                              booking.status === 'cancelled'
                                ? '#666'
                                : '#167a3f',
                          }}
                        >
                          {getStatusLabel(booking.status)}
                        </span>
                      </div>

                      {/* ИНФОРМАЦИЯ О ЗАПИСИ */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns:
                            'repeat(auto-fit, minmax(180px, 1fr))',
                          gap: '20px',
                        }}
                      >
                        <div>
                          <p>Дата посещения</p>
                          <strong>
                            {formatDate(booking.date)}
                          </strong>
                        </div>

                        <div>
                          <p>Время приёма</p>
                          <strong>
                            {booking.time || '—'}
                            {booking.end_time
                              ? ` – ${booking.end_time}`
                              : ''}
                          </strong>
                        </div>

                        <div>
                          <p>Продолжительность</p>
                          <strong>
                            {booking.duration ?? '—'} минут
                          </strong>
                        </div>

                        <div>
                          <p>Код записи</p>
                          <strong
                            style={{
                              color: '#d51f32',
                              letterSpacing: '1px',
                            }}
                          >
                            {booking.code || '—'}
                          </strong>
                        </div>
                      </div>

                      {/* ВОПРОС */}
                      {booking.question_text && (
                        <div style={{ marginTop: '24px' }}>
                          <p>Вопрос</p>

                          <strong>
                            {booking.question_text}
                          </strong>
                        </div>
                      )}

                      {/* КНОПКА ОТМЕНЫ */}
                      {canCancel && (
                        <div style={{ marginTop: '28px' }}>
                          <button
                            type="button"
                            onClick={() => handleCancel(booking)}
                            disabled={isCancelling}
                            style={{
                              padding: '13px 22px',
                              border: '1px solid #d51f32',
                              borderRadius: '10px',
                              background: '#fff',
                              color: '#d51f32',
                              fontSize: '15px',
                              fontWeight: '600',
                              cursor: isCancelling
                                ? 'wait'
                                : 'pointer',
                            }}
                          >
                            {isCancelling
                              ? 'Отменяем запись...'
                              : 'Отменить запись'}
                          </button>
                        </div>
                      )}
                    </article>
                  )
                })}
              </div>
            )}

            {/* НОВАЯ ЗАПИСЬ */}
            {!loading && bookings.length > 0 && (
              <div
                style={{
                  marginTop: '30px',
                  textAlign: 'center',
                }}
              >
                <Link
                  to="/booking"
                  className="button button-primary"
                >
                  Записаться ещё →
                </Link>
              </div>
            )}

          </div>
        )}
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

export default MyBookings
