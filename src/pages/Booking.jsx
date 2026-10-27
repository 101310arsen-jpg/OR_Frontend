
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import '../App.css'

const API_URL = 'http://127.0.0.1:8001'

// Получаем дату в формате YYYY-MM-DD
function getLocalDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

// По умолчанию выбираем завтрашний день
function getTomorrow() {
  const date = new Date()
  date.setDate(date.getDate() + 1)

  return getLocalDate(date)
}

// Читаем сообщения об ошибках Django
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

function Booking() {
  const {
    accessToken,
    isAuthenticated,
    currentUser,
  } = useAuth()

  // Список вопросов
  const [questions, setQuestions] = useState([])
  const [questionsLoading, setQuestionsLoading] = useState(true)
  const [questionsError, setQuestionsError] = useState('')

  // Выбранные данные
  const [questionId, setQuestionId] = useState('')
  const [date, setDate] = useState(getTomorrow)
  const [time, setTime] = useState('')

  // Свободное время
  const [slots, setSlots] = useState([])
  const [duration, setDuration] = useState(null)
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [slotsError, setSlotsError] = useState('')

  // Создание записи
  const [submitting, setSubmitting] = useState(false)
  const [bookingResult, setBookingResult] = useState(null)
  const [bookingError, setBookingError] = useState('')

  const [refreshCounter, setRefreshCounter] = useState(0)

  // =====================================
  // 1. ПОЛУЧАЕМ ВОПРОСЫ ИЗ DJANGO
  // =====================================

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
          throw new Error(
            'Не удалось загрузить вопросы.'
          )
        }

        const data = await response.json()

        const items = Array.isArray(data)
          ? data
          : data?.results ?? data?.value ?? []

        setQuestions(items)
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error(error)
          setQuestionsError(error.message)
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

  // =====================================
  // 2. ПОЛУЧАЕМ СВОБОДНОЕ ВРЕМЯ
  // =====================================

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
            throw new Error(
              'Срок действия авторизации истёк. Войди заново.'
            )
          }

          throw new Error(
            getError(
              data,
              'Не удалось получить свободное время.'
            )
          )
        }

        if (!Array.isArray(data?.slots)) {
          throw new Error(
            'Неверный формат ответа сервера.'
          )
        }

        if (!controller.signal.aborted) {
          setSlots(data.slots)
          setDuration(
            Number(data.duration) || null
          )
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error(error)
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

  // =====================================
  // 3. СОЗДАЁМ ЗАПИСЬ
  // =====================================

  const handleBooking = async (event) => {
    event.preventDefault()

    setBookingError('')
    setBookingResult(null)

    if (!accessToken) {
      setBookingError(
        'Сначала войди в свой аккаунт.'
      )
      return
    }

    if (!questionId || !date || !time || !duration) {
      setBookingError(
        'Выбери вопрос, дату и свободное время.'
      )
      return
    }

    if (!slots.includes(time)) {
      setBookingError(
        'Выбранное время больше недоступно.'
      )
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
          throw new Error(
            'Срок действия авторизации истёк. Войди заново.'
          )
        }

        throw new Error(
          getError(
            data,
            'Не удалось создать запись.'
          )
        )
      }

      // Запись создана
      setBookingResult(data ?? {})
      setTime('')

      // Обновляем свободные слоты
      setRefreshCounter(
        (previous) => previous + 1
      )
    } catch (error) {
      console.error(
        'Ошибка создания записи:',
        error
      )

      setBookingError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const fieldStyle = {
    display: 'grid',
    gap: '8px',
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

          {/* ДОПОЛНИТЕЛЬНЫЙ ПЕРЕХОД */}
          {isAuthenticated && (
            <Link
              to="/my-bookings"
              className="header-button"
            >
              Мои записи
            </Link>
          )}

          <Link
            to="/"
            className="header-button"
          >
            На главную
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

        {/* ЗАГОЛОВОК */}
        <div className="section-heading">
          <span className="section-kicker">
            ONLINE RECORD
          </span>

          <h2>Запись на приём</h2>

          <p>
            Выбери вопрос, дату и удобное время
            посещения NOMAD College.
          </p>
        </div>

        {/* =====================================
            КНОПКА "МОИ ЗАПИСИ"
            НАХОДИТСЯ ПОД ЗАГОЛОВКОМ
           ===================================== */}

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
              Мои записи →
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

          {/* ЕСЛИ ПОЛЬЗОВАТЕЛЬ НЕ ВОШЁЛ */}
          {!isAuthenticated ? (

            <div>
              <h3>
                Необходима авторизация
              </h3>

              <p
                style={{
                  margin: '18px 0 25px',
                }}
              >
                Чтобы записаться на приём,
                сначала войди в свой аккаунт.
              </p>

              <Link
                to="/login"
                className="button button-primary"
              >
                Войти →
              </Link>
            </div>

          ) : (

            /* ФОРМА ЗАПИСИ */
            <form onSubmit={handleBooking}>

              {/* ИНФОРМАЦИЯ О СТУДЕНТЕ */}
              <p
                style={{
                  marginBottom: '25px',
                }}
              >
                Студент:{' '}
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

                {/* ВЫБОР ВОПРОСА */}
                <label style={fieldStyle}>
                  <span>
                    Выбери вопрос *
                  </span>

                  <select
                    value={questionId}
                    onChange={(event) => {
                      setQuestionId(
                        event.target.value
                      )
                      setBookingError('')
                      setBookingResult(null)
                    }}
                    required
                    disabled={questionsLoading}
                  >

                    <option value="">
                      Выбери вопрос
                    </option>

                    {questions.map((question) => (
                      <option
                        key={question.id}
                        value={question.id}
                      >
                        {question.text ??
                          question.title ??
                          `Вопрос №${question.id}`}
                      </option>
                    ))}
                  </select>
                </label>

                {/* ВЫБОР ДАТЫ */}
                <label style={fieldStyle}>
                  <span>
                    Дата посещения *
                  </span>

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

              {/* ЗАГРУЗКА ВОПРОСОВ */}
              {questionsLoading && (
                <p
                  style={{
                    marginTop: '16px',
                  }}
                >
                  Загружаем вопросы...
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
                  {questionsError}
                </p>
              )}

              {/* СВОБОДНОЕ ВРЕМЯ */}
              <div
                style={{
                  marginTop: '30px',
                }}
              >

                <h3>
                  Свободное время
                </h3>

                {!questionId && (
                  <p
                    style={{
                      marginTop: '12px',
                    }}
                  >
                    Сначала выбери вопрос.
                  </p>
                )}

                {slotsLoading && (
                  <p
                    style={{
                      marginTop: '12px',
                    }}
                  >
                    Загружаем свободное время...
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
                    {slotsError}
                  </p>
                )}

                {!slotsLoading &&
                  !slotsError &&
                  questionId &&
                  slots.length === 0 && (
                    <p
                      style={{
                        marginTop: '12px',
                      }}
                    >
                      На выбранную дату
                      свободного времени нет.
                    </p>
                  )}

                {duration && (
                  <p
                    style={{
                      marginTop: '12px',
                    }}
                  >
                    Продолжительность приёма:{' '}
                    <strong>
                      {duration} минут
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
                  }}
                >
                  {bookingError}
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
                  <h3>
                    Запись успешно создана!
                  </h3>

                  {bookingResult.id != null && (
                    <p>
                      Номер записи:{' '}
                      <strong>
                        {bookingResult.id}
                      </strong>
                    </p>
                  )}

                  {bookingResult.code && (
                    <p>
                      Код записи:{' '}
                      <strong>
                        {bookingResult.code}
                      </strong>
                    </p>
                  )}

                  {/* ПЕРЕХОД К МОИМ ЗАПИСЯМ */}
                  <div
                    style={{
                      marginTop: '20px',
                    }}
                  >
                    <Link
                      to="/my-bookings"
                      className="button button-primary"
                    >
                      Посмотреть мои записи →
                    </Link>
                  </div>
                </div>
              )}

              {/* ПОДТВЕРЖДЕНИЕ */}
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
                  ? 'Создаём запись...'
                  : 'Подтвердить запись'}
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
          <span>
            ONLINE RECORD
          </span>
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

export default Booking
