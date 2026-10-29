
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { useAuth } from '../context/AuthContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { api, ApiError, getApiErrorMessage } from '../services/api.js'
import { translations } from '../locales/index.js'
import Header from '../components/Header.jsx'

import '../App.css'



// ==========================================
// 1. ПЕРЕВОДЫ СТРАНИЦЫ
// ==========================================



// ==========================================
// 2. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ==========================================

// Форматируем дату в зависимости от языка
function formatDate(value, language) {
  if (!value) return '—'

  const date = new Date(`${value}T00:00:00`)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  const locales = {
    RU: 'ru-RU',
    KG: 'ky-KG',
    EN: 'en-US',
  }

  return date.toLocaleDateString(
    locales[language] || 'ru-RU',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  )
}

// Переводим статус записи
function getStatusLabel(status, t) {
  return (
    t.statuses[status] ||
    status ||
    t.statuses.unknown
  )
}

// ==========================================
// 3. ОСНОВНОЙ КОМПОНЕНТ
// ==========================================

function MyBookings() {
  const { language } = useLanguage()
  const t = translations[language]?.myBookings || translations.RU.myBookings

  const {
    accessToken,
    isAuthenticated,
    currentUser,
  } = useAuth()

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancelledBookingId, setCancelledBookingId] = useState(null)
  const [cancellingId, setCancellingId] = useState(null)
  const [refreshCounter, setRefreshCounter] = useState(0)

  // ==========================================
  // 4. ЗАГРУЖАЕМ ЗАПИСИ ИЗ DJANGO
  // ==========================================

  useEffect(() => {
    if (!accessToken) {
      setBookings([])
      setLoading(false)
      setError('')
      setCancelledBookingId(null)
      return
    }
    const controller = new AbortController()
    async function loadBookings() {
      setLoading(true)
      setError('')
      try {
        const data = await api.getMyBookings(accessToken, controller.signal)
        const items = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
            ? data.results
            : data?.id != null ? [data] : []
        if (!controller.signal.aborted) setBookings(items)
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error('Error loading bookings:', err)
          setError(err instanceof ApiError && err.status === 401
            ? 'AUTH_EXPIRED'
            : getApiErrorMessage(err, 'LOAD_ERROR'))
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    loadBookings()
    return () => controller.abort()
  }, [accessToken, refreshCounter])

  // ==========================================
  // 5. ОТМЕНА ЗАПИСИ
  // ==========================================

  const handleCancel = async (booking) => {
    if (!booking?.id || !accessToken || cancellingId !== null || booking.status !== 'active') return

    const confirmationText = language === 'KG'
      ? `${t.cancelConfirm}${booking.id} ${t.cancelConfirmEnd}`
      : `${t.cancelConfirm}${booking.id}?`
    if (!window.confirm(confirmationText)) return

    setCancellingId(booking.id)
    setError('')
    setCancelledBookingId(null)
    try {
      await api.cancelBooking(booking.id, accessToken)
      setCancelledBookingId(booking.id)
      setRefreshCounter(previous => previous + 1)
    } catch (err) {
      console.error('Error cancelling booking:', err)
      setError(err instanceof ApiError && err.status === 401
        ? 'AUTH_EXPIRED'
        : getApiErrorMessage(err, 'CANCEL_ERROR'))
    } finally {
      setCancellingId(null)
    }
  }

  // ==========================================
  // 6. ОБНОВЛЯЕМ СПИСОК
  // ==========================================

  const reloadBookings = () => {
    setCancelledBookingId(null)
    setRefreshCounter(
      (previous) => previous + 1
    )
  }

  // Перевод ошибок интерфейса
  const translateError = (code) => {
    const errors = {
      AUTH_EXPIRED: t.authExpired,
      LOAD_ERROR: t.loadError,
      CANCEL_ERROR: t.cancelError,
    }

    return errors[code] || code || t.unknownError
  }

  // ==========================================
  // 7. ИНТЕРФЕЙС
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

        {/* НЕ АВТОРИЗОВАН */}
        {!isAuthenticated ? (
          <div
            className="feature-card"
            style={{
              maxWidth: '680px',
              margin: '0 auto',
            }}
          >
            <h3>{t.loginRequired}</h3>

            <p style={{ margin: '18px 0 25px' }}>
              {t.loginDescription}
            </p>

            <Link
              to="/login"
              className="button button-primary"
            >
              {t.login}
            </Link>
          </div>
        ) : (
          <div
            style={{
              maxWidth: '900px',
              margin: '0 auto',
            }}
          >

            {/* ПАНЕЛЬ СТУДЕНТА */}
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
                  <p>{t.student}</p>

                  <h3 style={{ marginTop: '5px' }}>
                    {currentUser}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={reloadBookings}
                  disabled={loading}
                  className="button button-secondary"
                  style={{
                    cursor: 'pointer',
                  }}
                >
                  {t.refresh}
                </button>
              </div>
            </div>

            {/* ЗАГРУЗКА */}
            {loading && (
              <p style={{ textAlign: 'center' }}>
                {t.loading}
              </p>
            )}

            {/* ОШИБКИ */}
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
                {translateError(error)}
              </div>
            )}

            {/* УСПЕШНАЯ ОТМЕНА */}
            {cancelledBookingId !== null && (
              <div role="status" style={{
                padding: '16px',
                marginBottom: '20px',
                background: '#eef8f0',
                color: '#167a3f',
                borderRadius: '10px',
              }}>
                {t.cancelSuccessStart}{cancelledBookingId}{' '}{t.cancelSuccessEnd}
              </div>
            )}

            {/* СПИСОК ПУСТ */}
            {!loading &&
              !error &&
              bookings.length === 0 && (
                <div
                  className="feature-card"
                  style={{
                    textAlign: 'center',
                  }}
                >
                  <h3>{t.noBookings}</h3>

                  <p style={{ margin: '16px 0 25px' }}>
                    {t.noBookingsDescription}
                  </p>

                  <Link
                    to="/booking"
                    className="button button-primary"
                  >
                    {t.book}
                  </Link>
                </div>
              )}

            {/* ВСЕ ЗАПИСИ СТУДЕНТА */}
            {!loading && bookings.length > 0 && (
              <div
                style={{
                  display: 'grid',
                  gap: '20px',
                }}
              >
                {bookings.map((booking) => {
                  // Backend разрешает отмену активных записей
                  const canCancel =
                    booking.status === 'active'

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
                            {t.bookingNumber}
                            {booking.id}
                          </span>

                          <h3 style={{ marginTop: '8px' }}>
                            {booking.official || t.appointment}
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
                          {getStatusLabel(
                            booking.status,
                            t
                          )}
                        </span>
                      </div>

                      {/* ДЕТАЛИ ЗАПИСИ */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns:
                            'repeat(auto-fit, minmax(180px, 1fr))',
                          gap: '20px',
                        }}
                      >

                        {/* ДАТА */}
                        <div>
                          <p>{t.date}</p>
                          <strong>
                            {formatDate(
                              booking.date,
                              language
                            )}
                          </strong>
                        </div>

                        {/* ВРЕМЯ */}
                        <div>
                          <p>{t.time}</p>
                          <strong>
                            {booking.time || '—'}
                            {booking.end_time
                              ? ` – ${booking.end_time}`
                              : ''}
                          </strong>
                        </div>

                        {/* ПРОДОЛЖИТЕЛЬНОСТЬ */}
                        <div>
                          <p>{t.duration}</p>
                          <strong>
                            {booking.duration ?? '—'}{' '}
                            {t.minutes}
                          </strong>
                        </div>

                        {/* КОД */}
                        <div>
                          <p>{t.code}</p>
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
                          <p>{t.question}</p>

                          <strong>
                            {booking.question_text}
                          </strong>
                        </div>
                      )}

                      {/* ОТМЕНА */}
                      {canCancel && (
                        <div style={{ marginTop: '28px' }}>
                          <button
                            type="button"
                            onClick={() =>
                              handleCancel(booking)
                            }
                            disabled={cancellingId !== null}
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
                              ? t.cancelling
                              : t.cancel}
                          </button>
                        </div>
                      )}
                    </article>
                  )
                })}
              </div>
            )}

            {/* СОЗДАТЬ ДРУГУЮ ЗАПИСЬ */}
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
                  {t.bookAgain}
                </Link>
              </div>
            )}

          </div>
        )}
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

export default MyBookings
