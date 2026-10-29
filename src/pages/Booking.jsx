
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { useAuth } from '../context/AuthContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import Header from '../components/Header.jsx'

import '../App.css'

const API_URL = 'http://127.0.0.1:8001'

// ==========================================
// 1. ПЕРЕВОДЫ СТРАНИЦЫ
// ==========================================

const translations = {
  RU: {
    title: 'Запись на приём',
    description:
      'Выбери вопрос, дату и удобное время посещения NOMAD College.',
    myBookings: 'Мои записи →',
    loginRequired: 'Необходима авторизация',
    loginDescription:
      'Чтобы записаться на приём, сначала войди в свой аккаунт.',
    login: 'Войти →',
    student: 'Студент',
    question: 'Выбери вопрос',
    chooseQuestion: 'Выбери вопрос',
    questionFallback: 'Вопрос №',
    date: 'Дата посещения',
    loadingQuestions: 'Загружаем вопросы...',
    loadingSlots: 'Загружаем свободное время...',
    slotsTitle: 'Свободное время',
    chooseQuestionFirst: 'Сначала выбери вопрос.',
    noSlots: 'На выбранную дату свободного времени нет.',
    duration: 'Продолжительность приёма',
    minutes: 'минут',
    confirm: 'Подтвердить запись',
    submitting: 'Создаём запись...',
    success: 'Запись успешно создана!',
    bookingId: 'Номер записи',
    bookingCode: 'Код записи',
    viewBookings: 'Посмотреть мои записи →',
    missingAuth: 'Сначала войди в свой аккаунт.',
    missingFields:
      'Выбери вопрос, дату и свободное время.',
    invalidSlot: 'Выбранное время больше недоступно.',
    authExpired:
      'Срок действия авторизации истёк. Войди заново.',
    questionsError: 'Не удалось загрузить вопросы.',
    slotsError: 'Не удалось получить свободное время.',
    bookingError: 'Не удалось создать запись.',
    invalidResponse: 'Неверный формат ответа сервера.',
    rights: 'Все права защищены.',
  },

  KG: {
    title: 'Кабыл алууга жазылуу',
    description:
      'NOMAD College үчүн суроону, күндү жана ыңгайлуу убакытты танда.',
    myBookings: 'Менин жазылууларым →',
    loginRequired: 'Аккаунтка кирүү керек',
    loginDescription:
      'Кабыл алууга жазылуу үчүн адегенде аккаунтуңа кир.',
    login: 'Кирүү →',
    student: 'Студент',
    question: 'Суроону танда',
    chooseQuestion: 'Суроону танда',
    questionFallback: 'Суроо №',
    date: 'Кабыл алуу күнү',
    loadingQuestions: 'Суроолор жүктөлүүдө...',
    loadingSlots: 'Бош убакыттар жүктөлүүдө...',
    slotsTitle: 'Бош убакыттар',
    chooseQuestionFirst: 'Адегенде суроону танда.',
    noSlots: 'Тандалган күнгө бош убакыт жок.',
    duration: 'Кабыл алуунун узактыгы',
    minutes: 'мүнөт',
    confirm: 'Жазылууну ырастоо',
    submitting: 'Жазылуу түзүлүүдө...',
    success: 'Жазылуу ийгиликтүү түзүлдү!',
    bookingId: 'Жазылуунун номери',
    bookingCode: 'Жазылуу коду',
    viewBookings: 'Менин жазылууларымды көрүү →',
    missingAuth: 'Адегенде аккаунтуңа кир.',
    missingFields: 'Суроону, күндү жана бош убакытты танда.',
    invalidSlot: 'Тандалган убакыт жеткиликсиз болуп калды.',
    authExpired:
      'Авторизациянын мөөнөтү бүттү. Кайра кир.',
    questionsError: 'Суроолор жүктөлгөн жок.',
    slotsError: 'Бош убакыттарды алуу мүмкүн болгон жок.',
    bookingError: 'Жазылуу түзүлгөн жок.',
    invalidResponse: 'Сервердин жообунун форматы туура эмес.',
    rights: 'Бардык укуктар корголгон.',
  },

  EN: {
    title: 'Book an appointment',
    description:
      'Choose a question, date, and convenient appointment time at NOMAD College.',
    myBookings: 'My bookings →',
    loginRequired: 'Sign in required',
    loginDescription:
      'Please sign in to your account before booking an appointment.',
    login: 'Sign in →',
    student: 'Student',
    question: 'Choose a question',
    chooseQuestion: 'Select a question',
    questionFallback: 'Question #',
    date: 'Appointment date',
    loadingQuestions: 'Loading questions...',
    loadingSlots: 'Loading available times...',
    slotsTitle: 'Available times',
    chooseQuestionFirst: 'Select a question first.',
    noSlots: 'No available times for the selected date.',
    duration: 'Appointment duration',
    minutes: 'minutes',
    confirm: 'Confirm booking',
    submitting: 'Creating booking...',
    success: 'Booking created successfully!',
    bookingId: 'Booking number',
    bookingCode: 'Booking code',
    viewBookings: 'View my bookings →',
    missingAuth: 'Please sign in first.',
    missingFields:
      'Choose a question, date, and available time.',
    invalidSlot: 'The selected time is no longer available.',
    authExpired: 'Your session has expired. Sign in again.',
    questionsError: 'Could not load questions.',
    slotsError: 'Could not load available times.',
    bookingError: 'Could not create the booking.',
    invalidResponse: 'Invalid server response format.',
    rights: 'All rights reserved.',
  },
}

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

function getError(data, fallback) {
  if (typeof data?.detail === 'string') {
    return data.detail
  }

  if (data && typeof data === 'object') {
    const messages = Object.entries(data).map(
      ([key, value]) => {
        const text = Array.isArray(value)
          ? value.join(', ')
          : String(value)

        return `${key}: ${text}`
      }
    )

    return messages.join(' | ') || fallback
  }

  return fallback
}

// ==========================================
// 4. ОСНОВНОЙ КОМПОНЕНТ
// ==========================================

function Booking() {
  const { language } = useLanguage()
  const t = translations[language] || translations.RU

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
        const response = await fetch(
          `${API_URL}/api/questions/`,
          {
            signal: controller.signal,
          }
        )

        if (!response.ok) {
          throw new Error('Failed to load questions')
        }

        const data = await response.json()

        const items = Array.isArray(data)
          ? data
          : data?.results ?? data?.value ?? []

        if (!controller.signal.aborted) {
          setQuestions(items)
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Questions error:', error)
          setQuestionsError('load_failed')
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

      const params = new URLSearchParams({
        question: questionId,
        date: date,
      })

      try {
        const response = await fetch(
          `${API_URL}/api/booking/slots/?${params.toString()}`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            signal: controller.signal,
          }
        )

        const data = await response.json().catch(
          () => null
        )

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('AUTH_EXPIRED')
          }

          throw new Error(
            getError(data, 'SLOTS_ERROR')
          )
        }

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
          setSlotsError(error.message)
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
      const response = await fetch(
        `${API_URL}/api/booking/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            question: Number(questionId),
            date: date,
            time:
              time.length === 5
                ? `${time}:00`
                : time,
            duration: duration,
          }),
        }
      )

      const data = await response.json().catch(
        () => null
      )

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('AUTH_EXPIRED')
        }

        throw new Error(
          getError(data, 'BOOKING_ERROR')
        )
      }

      // Сохраняем успешный результат
      setBookingResult(data ?? {})
      setTime('')

      // Перезагружаем доступное время
      setRefreshCounter(
        (previous) => previous + 1
      )
    } catch (error) {
      console.error('Booking error:', error)
      setBookingError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  // Перевод ошибок, созданных самим Frontend
  function translateError(code, fallback) {
    const errorCodes = {
      AUTH_EXPIRED: t.authExpired,
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
