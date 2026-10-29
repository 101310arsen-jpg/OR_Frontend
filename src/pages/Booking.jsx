
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { useAuth } from '../context/AuthContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import {
  api,
  ApiError,
  getApiErrorMessage,
} from '../services/api.js'

import Header from '../components/Header.jsx'
import '../App.css'

// ==========================================
// 1. ПЕРЕВОДЫ СТРАНИЦЫ
// ==========================================

const translations = {
  RU: {
    title: 'Мои записи',
    description:
      'Просматривай свои записи и управляй посещениями NOMAD College.',
    loginRequired: 'Необходима авторизация',
    loginDescription:
      'Чтобы посмотреть свои записи, сначала войди в аккаунт.',
    login: 'Войти →',
    student: 'Студент',
    refresh: 'Обновить',
    loading: 'Загружаем твои записи...',
    noBookings: 'У тебя пока нет записей',
    noBookingsDescription:
      'Выбери вопрос, дату и удобное время, чтобы записаться на приём.',
    book: 'Записаться →',
    bookAgain: 'Записаться ещё →',
    bookingNumber: 'Запись №',
    appointment: 'Приём',
    date: 'Дата посещения',
    time: 'Время приёма',
    duration: 'Продолжительность',
    minutes: 'минут',
    code: 'Код записи',
    question: 'Вопрос',
    cancel: 'Отменить запись',
    cancelling: 'Отменяем запись...',
    cancelConfirm:
      'Ты действительно хочешь отменить запись №',
    cancelSuccessStart: 'Запись №',
    cancelSuccessEnd: 'успешно отменена.',
    loadError: 'Не удалось загрузить записи.',
    cancelError: 'Не удалось отменить запись.',
    authExpired:
      'Срок действия авторизации истёк. Войди заново.',
    rights: 'Все права защищены.',
    statuses: {
      active: 'Активна',
      booked: 'Забронирована',
      cancelled: 'Отменена',
      done: 'Завершена',
      unknown: 'Неизвестно',
    },
  },

  KG: {
    title: 'Менин жазылууларым',
    description:
      'NOMAD College кабыл алуусуна жазылууларыңды көр жана башкар.',
    loginRequired: 'Аккаунтка кирүү керек',
    loginDescription:
      'Жазылууларыңды көрүү үчүн адегенде аккаунтуңа кир.',
    login: 'Кирүү →',
    student: 'Студент',
    refresh: 'Жаңыртуу',
    loading: 'Жазылууларың жүктөлүүдө...',
    noBookings: 'Азырынча жазылууларың жок',
    noBookingsDescription:
      'Кабыл алууга жазылуу үчүн суроону, күндү жана ыңгайлуу убакытты танда.',
    book: 'Жазылуу →',
    bookAgain: 'Кайра жазылуу →',
    bookingNumber: 'Жазылуу №',
    appointment: 'Кабыл алуу',
    date: 'Кабыл алуу күнү',
    time: 'Кабыл алуу убактысы',
    duration: 'Узактыгы',
    minutes: 'мүнөт',
    code: 'Жазылуу коду',
    question: 'Суроо',
    cancel: 'Жазылууну жокко чыгаруу',
    cancelling: 'Жазылуу жокко чыгарылууда...',
    cancelConfirm: 'Чын эле №',
    cancelConfirmEnd:
      'жазылууну жокко чыгаргың келеби?',
    cancelSuccessStart: '№',
    cancelSuccessEnd: 'жазылуу жокко чыгарылды.',
    loadError: 'Жазылуулар жүктөлгөн жок.',
    cancelError:
      'Жазылууну жокко чыгаруу мүмкүн болгон жок.',
    authExpired:
      'Авторизациянын мөөнөтү бүттү. Кайра кир.',
    rights: 'Бардык укуктар корголгон.',
    statuses: {
      active: 'Активдүү',
      booked: 'Брондолгон',
      cancelled: 'Жокко чыгарылган',
      done: 'Аяктаган',
      unknown: 'Белгисиз',
    },
  },

  EN: {
    title: 'My bookings',
    description:
      'View your appointments and manage your visits to NOMAD College.',
    loginRequired: 'Sign in required',
    loginDescription:
      'Please sign in to see your bookings.',
    login: 'Sign in →',
    student: 'Student',
    refresh: 'Refresh',
    loading: 'Loading your bookings...',
    noBookings: 'You have no bookings yet',
    noBookingsDescription:
      'Choose a question, date, and convenient time to book an appointment.',
    book: 'Book now →',
    bookAgain: 'Book another appointment →',
    bookingNumber: 'Booking #',
    appointment: 'Appointment',
    date: 'Appointment date',
    time: 'Appointment time',
    duration: 'Duration',
    minutes: 'minutes',
    code: 'Booking code',
    question: 'Question',
    cancel: 'Cancel booking',
    cancelling: 'Cancelling booking...',
    cancelConfirm:
      'Are you sure you want to cancel booking #',
    cancelSuccessStart: 'Booking #',
    cancelSuccessEnd:
      'has been cancelled successfully.',
    loadError: 'Could not load your bookings.',
    cancelError: 'Could not cancel the booking.',
    authExpired:
      'Your session has expired. Please sign in again.',
    rights: 'All rights reserved.',
    statuses: {
      active: 'Active',
      booked: 'Booked',
      cancelled: 'Cancelled',
      done: 'Completed',
      unknown: 'Unknown',
    },
  },
}

// ==========================================
// 2. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ==========================================

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
  const t = translations[language] || translations.RU

  const {
    accessToken,
    isAuthenticated,
    currentUser,
  } = useAuth()

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [cancelledBookingId, setCancelledBookingId] =
    useState(null)

  const [cancellingId, setCancellingId] = useState(null)
  const [refreshCounter, setRefreshCounter] = useState(0)

  // ==========================================
  // 4. ПОЛУЧАЕМ ЗАПИСИ ЧЕРЕЗ API-СЕРВИС
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
        // Запрашиваем список через api.js
        const data = await api.getMyBookings(
          accessToken,
          controller.signal
        )

        // Поддерживаем список и пагинацию
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
        if (!controller.signal.aborted) {
          console.error(
            'Ошибка загрузки записей:',
            err
          )

          if (err instanceof ApiError &&
              err.status === 401) {
            setError('AUTH_EXPIRED')
          } else {
            setError(
              getApiErrorMessage(err, 'LOAD_ERROR')
            )
          }
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

  // ==========================================
  // 5. ОТМЕНА ЗАПИСИ ЧЕРЕЗ API-СЕРВИС
  // ==========================================

  const handleCancel = async (booking) => {
    if (
      !booking?.id ||
      !accessToken ||
      cancellingId !== null ||
      booking.status !== 'active'
    ) {
      return
    }

    // Подтверждение отмены
    const confirmationText =
      language === 'KG'
        ? `${t.cancelConfirm}${booking.id} ${t.cancelConfirmEnd}`
        : `${t.cancelConfirm}${booking.id}?`

    if (!window.confirm(confirmationText)) {
      return
    }

    setCancellingId(booking.id)
    setError('')
    setCancelledBookingId(null)

    try {
      // Запрос отмены через единый API
      await api.cancelBooking(
        booking.id,
        accessToken
      )

      // Сохраняем ID отменённой записи
      setCancelledBookingId(booking.id)

      // Обновляем список из Django
      setRefreshCounter(
        (previous) => previous + 1
      )

    } catch (err) {
      console.error(
        'Ошибка отмены записи:',
        err
      )

      if (err instanceof ApiError &&
          err.status === 401) {
        setError('AUTH_EXPIRED')
      } else {
        setError(
          getApiErrorMessage(err, 'CANCEL_ERROR')
        )
      }

    } finally {
      setCancellingId(null)
    }
  }

  // ==========================================
  // 6. РУЧНОЕ ОБНОВЛЕНИЕ СПИСКА
  // ==========================================

  const reloadBookings = () => {
    setCancelledBookingId(null)
    setRefreshCounter(
      (previous) => previous + 1
    )
  }

  // ==========================================
  // 7. ПЕРЕВОД ОШИБОК
  // ==========================================

  function translateError(code) {
    const errors = {
      AUTH_EXPIRED: t.authExpired,
      LOAD_ERROR: t.loadError,
      CANCEL_ERROR: t.cancelError,
    }

    return errors[code] || code
  }

  // ==========================================
  // 8. ИНТЕРФЕЙС
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

        {!isAuthenticated ? (

          /* НЕ АВТОРИЗОВАН */
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

          /* СОДЕРЖИМОЕ СТРАНИЦЫ */
          <div
            style={{
              maxWidth: '900px',
              margin: '0 auto',
            }}
          >

            {/* ПАНЕЛЬ СТУДЕНТА */}
            <div
              className="feature-card"
              style={{ marginBottom: '25px' }}
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
                  disabled={loading || cancellingId !== null}
                  className="button button-secondary"
                  style={{ cursor: 'pointer' }}
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
                {translateError(error)}
              </div>
            )}

            {/* УСПЕШНАЯ ОТМЕНА */}
            {cancelledBookingId !== null && (
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
                {t.cancelSuccessStart}
                {cancelledBookingId}{' '}
                {t.cancelSuccessEnd}
              </div>
            )}

            {/* НЕТ ЗАПИСЕЙ */}
            {!loading &&
              !error &&
              bookings.length === 0 && (
                <div
                  className="feature-card"
                  style={{ textAlign: 'center' }}
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

            {/* СПИСОК ЗАПИСЕЙ */}
            {!loading &&
              bookings.length > 0 && (
                <div
                  style={{
                    display: 'grid',
                    gap: '20px',
                  }}
                >
                  {bookings.map((booking) => {
                    const canCancel =
                      booking.status === 'active'

                    const isCancelling =
                      cancellingId === booking.id

                    const isCancelled =
                      booking.status === 'cancelled'

                    return (
                      <article
                        className="feature-card"
                        key={booking.id}
                      >

                        {/* ЗАГОЛОВОК И СТАТУС */}
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
                              {booking.official ||
                                t.appointment}
                            </h3>
                          </div>

                          <span
                            style={{
                              padding: '8px 14px',
                              borderRadius: '20px',
                              fontSize: '14px',
                              fontWeight: '600',
                              background: isCancelled
                                ? '#f1f1f1'
                                : '#eef8f0',
                              color: isCancelled
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

                          {/* КОД ЗАПИСИ */}
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

                        {/* ОТМЕНА АКТИВНОЙ ЗАПИСИ */}
                        {canCancel && (
                          <div style={{ marginTop: '28px' }}>
                            <button
                              type="button"
                              onClick={() =>
                                handleCancel(booking)
                              }
                              disabled={
                                cancellingId !== null ||
                                loading
                              }
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

            {/* СОЗДАТЬ ЕЩЁ ОДНУ ЗАПИСЬ */}
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
