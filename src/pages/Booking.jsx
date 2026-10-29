
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
// 2. РАБОТА С ДАТОЙ
// ==========================================

// Дата в формате YYYY-MM-DD
function getLocalDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

// По умолчанию — завтрашний день
function getTomorrow() {
  const date = new Date()
  date.setDate(date.getDate() + 1)

  return getLocalDate(date)
}

// ==========================================
// 3. СООБЩЕНИЯ ОБ ОШИБКАХ DJANGO
// ==========================================

// ==========================================
// 4. ОСНОВНОЙ КОМПОНЕНТ
// ==========================================

function Booking() {
  const { language } = useLanguage()
  const t = translations[language]?.booking || translations.RU.booking

  const {
    accessToken,
    isAuthenticated,
    currentUser,
  } = useAuth()

  // Список вопросов
  const [questions, setQuestions] = useState([])
  const [questionsLoading, setQuestionsLoading] = useState(true)
  const [questionsError, setQuestionsError] = useState('')

  // Выбор студента
  const [questionId, setQuestionId] = useState('')
  const [date, setDate] = useState(getTomorrow)
  const [time, setTime] = useState('')

  // Доступные интервалы времени
  const [slots, setSlots] = useState([])
  const [duration, setDuration] = useState(null)
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [slotsError, setSlotsError] = useState('')

  // Создание записи
  const [submitting, setSubmitting] = useState(false)
  const [bookingResult, setBookingResult] = useState(null)
  const [bookingError, setBookingError] = useState('')

  // Счётчик обновления времени
  const [refreshCounter, setRefreshCounter] = useState(0)

  // ==========================================
  // 5. ЗАГРУЗКА ВОПРОСОВ ИЗ DJANGO
  // ==========================================

  useEffect(() => {
    const controller = new AbortController()

    async function loadQuestions() {
      setQuestionsLoading(true)
      setQuestionsError('')

      try {
        const data = await api.getQuestions(controller.signal)

        const items = Array.isArray(data)
          ? data
          : data?.results ?? data?.value ?? []

        if (!controller.signal.aborted) {
          setQuestions(items)
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Questions error:', error)
          setQuestionsError('LOAD_ERROR')
        }
      } finally {
        if (!controller.signal.aborted) {
          setQuestionsLoading(false)
        }
      }
    }

    loadQuestions()

    return () => controller.abort()
  }, [])

  // ==========================================
  // 6. ЗАГРУЗКА СВОБОДНОГО ВРЕМЕНИ
  // ==========================================

  useEffect(() => {
    setSlots([])
    setTime('')
    setDuration(null)
    setSlotsError('')

    if (!accessToken || !questionId || !date) {
      setSlotsLoading(false)
      return
    }

    const controller = new AbortController()

    async function loadSlots() {
      setSlotsLoading(true)

      try {
        const data = await api.getBookingSlots({
          question: questionId,
          date,
          token: accessToken,
          signal: controller.signal,
        })

        if (!Array.isArray(data?.slots)) {
          throw new Error('INVALID_RESPONSE')
        }

        if (!controller.signal.aborted) {
          setSlots(data.slots)
          setDuration(
            Number(data.duration) || null
          )
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Slots error:', error)
          if (error instanceof ApiError && error.status === 401) {
            setSlotsError('AUTH_EXPIRED')
          } else if (error.message === 'INVALID_RESPONSE') {
            setSlotsError('INVALID_RESPONSE')
          } else {
            setSlotsError(getApiErrorMessage(error, 'SLOTS_ERROR'))
          }
        }
      } finally {
        if (!controller.signal.aborted) {
          setSlotsLoading(false)
        }
      }
    }

    loadSlots()

    return () => controller.abort()
  }, [
    accessToken,
    questionId,
    date,
    refreshCounter,
  ])

  // ==========================================
  // 7. СОЗДАНИЕ ЗАПИСИ
  // ==========================================

  const handleBooking = async (event) => {
    event.preventDefault()

    if (submitting) return

    setBookingError('')
    setBookingResult(null)

    if (!accessToken) {
      setBookingError('MISSING_AUTH')
      return
    }

    if (!questionId || !date || !time || !duration) {
      setBookingError('MISSING_FIELDS')
      return
    }

    if (!slots.includes(time)) {
      setBookingError('INVALID_SLOT')
      return
    }

    setSubmitting(true)

    try {
      const data = await api.createBooking({
        question: Number(questionId),
        date,
        time: time.length === 5 ? `${time}:00` : time,
        duration,
        token: accessToken,
      })

      // Сохраняем успешный результат
      setBookingResult(data ?? {})
      setTime('')

      // Перезагружаем доступное время
      setRefreshCounter(
        (previous) => previous + 1
      )
    } catch (error) {
      console.error('Booking error:', error)
      if (error instanceof ApiError && error.status === 401) {
        setBookingError('AUTH_EXPIRED')
      } else {
        setBookingError(getApiErrorMessage(error, 'BOOKING_ERROR'))
      }
    } finally {
      setSubmitting(false)
    }
  }

  // Перевод ошибок, созданных самим Frontend
  function translateError(code, fallback) {
    const errorCodes = {
      AUTH_EXPIRED: t.authExpired,
      LOAD_ERROR: t.questionsError,
      SLOTS_ERROR: t.slotsError,
      BOOKING_ERROR: t.bookingError,
      INVALID_RESPONSE: t.invalidResponse,
      MISSING_AUTH: t.missingAuth,
      MISSING_FIELDS: t.missingFields,
      INVALID_SLOT: t.invalidSlot,
    }

    return errorCodes[code] || fallback || code
  }

  const fieldStyle = {
    display: 'grid',
    gap: '8px',
  }

  // ==========================================
  // 8. ИНТЕРФЕЙС СТРАНИЦЫ
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

        {/* МОИ ЗАПИСИ */}
        {isAuthenticated && (
          <div
            style={{
              textAlign: 'center',
              marginBottom: '32px',
            }}
          >
            <Link
              to="/my-bookings"
              className="button button-secondary"
            >
              {t.myBookings}
            </Link>
          </div>
        )}

        <div
          className="feature-card"
          style={{
            maxWidth: '780px',
            margin: '0 auto',
          }}
        >

          {/* НЕ АВТОРИЗОВАН */}
          {!isAuthenticated ? (
            <div>
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

            /* ФОРМА ЗАПИСИ */
            <form onSubmit={handleBooking}>

              {/* СТУДЕНТ */}
              <p style={{ marginBottom: '25px' }}>
                {t.student}:{' '}
                <strong>{currentUser}</strong>
              </p>

              {/* ВОПРОС И ДАТА */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '20px',
                }}
              >

                {/* ВОПРОС */}
                <label style={fieldStyle}>
                  <span>{t.question} *</span>

                  <select
                    value={questionId}
                    onChange={(event) => {
                      setQuestionId(event.target.value)
                      setBookingError('')
                      setBookingResult(null)
                    }}
                    required
                    disabled={questionsLoading}
                  >
                    <option value="">
                      {t.chooseQuestion}
                    </option>

                    {questions.map((question) => (
                      <option
                        key={question.id}
                        value={question.id}
                      >
                        {question.text ??
                          question.title ??
                          `${t.questionFallback}${question.id}`}
                      </option>
                    ))}
                  </select>
                </label>

                {/* ДАТА */}
                <label style={fieldStyle}>
                  <span>{t.date} *</span>

                  <input
                    type="date"
                    value={date}
                    min={getLocalDate(new Date())}
                    onChange={(event) => {
                      setDate(event.target.value)
                      setBookingError('')
                      setBookingResult(null)
                    }}
                    required
                  />
                </label>

              </div>

              {/* СОСТОЯНИЕ ЗАГРУЗКИ ВОПРОСОВ */}
              {questionsLoading && (
                <p style={{ marginTop: '16px' }}>
                  {t.loadingQuestions}
                </p>
              )}

              {questionsError && (
                <p
                  role="alert"
                  style={{
                    color: '#d51f32',
                    marginTop: '16px',
                  }}
                >
                  {t.questionsError}
                </p>
              )}

              {/* СВОБОДНОЕ ВРЕМЯ */}
              <div style={{ marginTop: '30px' }}>
                <h3>{t.slotsTitle}</h3>

                {!questionId && (
                  <p style={{ marginTop: '12px' }}>
                    {t.chooseQuestionFirst}
                  </p>
                )}

                {slotsLoading && (
                  <p style={{ marginTop: '12px' }}>
                    {t.loadingSlots}
                  </p>
                )}

                {slotsError && (
                  <p
                    role="alert"
                    style={{
                      color: '#d51f32',
                      marginTop: '12px',
                    }}
                  >
                    {translateError(slotsError)}
                  </p>
                )}

                {!slotsLoading &&
                  !slotsError &&
                  questionId &&
                  slots.length === 0 && (
                    <p style={{ marginTop: '12px' }}>
                      {t.noSlots}
                    </p>
                  )}

                {duration && (
                  <p style={{ marginTop: '12px' }}>
                    {t.duration}:{' '}
                    <strong>
                      {duration} {t.minutes}
                    </strong>
                  </p>
                )}

                {/* КНОПКИ ВРЕМЕНИ */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'repeat(auto-fill, minmax(85px, 1fr))',
                    gap: '10px',
                    marginTop: '20px',
                  }}
                >
                  {slots.map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => {
                        setTime(slot)
                        setBookingError('')
                        setBookingResult(null)
                      }}
                      aria-pressed={time === slot}
                      style={{
                        padding: '12px 8px',
                        borderRadius: '10px',
                        border:
                          time === slot
                            ? '2px solid #d51f32'
                            : '1px solid #ddd',
                        background:
                          time === slot
                            ? '#d51f32'
                            : '#f5f5f5',
                        color:
                          time === slot
                            ? '#fff'
                            : '#222',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      {slot}
                    </button>
                  ))}
                </div>

              </div>

              {/* ОШИБКА ЗАПИСИ */}
              {bookingError && (
                <p
                  role="alert"
                  style={{
                    color: '#d51f32',
                    marginTop: '22px',
                    overflowWrap: 'anywhere',
                  }}
                >
                  {translateError(bookingError)}
                </p>
              )}

              {/* УСПЕШНАЯ ЗАПИСЬ */}
              {bookingResult && (
                <div
                  role="status"
                  style={{
                    background: '#eef8f0',
                    color: '#167a3f',
                    padding: '18px',
                    borderRadius: '10px',
                    marginTop: '25px',
                  }}
                >
                  <h3>{t.success}</h3>

                  {bookingResult.id != null && (
                    <p>
                      {t.bookingId}:{' '}
                      <strong>
                        {bookingResult.id}
                      </strong>
                    </p>
                  )}

                  {bookingResult.code && (
                    <p>
                      {t.bookingCode}:{' '}
                      <strong>
                        {bookingResult.code}
                      </strong>
                    </p>
                  )}

                  <div style={{ marginTop: '20px' }}>
                    <Link
                      to="/my-bookings"
                      className="button button-primary"
                    >
                      {t.viewBookings}
                    </Link>
                  </div>
                </div>
              )}

              {/* КНОПКА ПОДТВЕРЖДЕНИЯ */}
              <button
                type="submit"
                className="button button-primary"
                disabled={
                  submitting ||
                  slotsLoading ||
                  !questionId ||
                  !time ||
                  !duration
                }
                style={{
                  border: 0,
                  marginTop: '28px',
                  cursor: submitting
                    ? 'wait'
                    : 'pointer',
                }}
              >
                {submitting
                  ? t.submitting
                  : t.confirm}
              </button>

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

export default Booking
