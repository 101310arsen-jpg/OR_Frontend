
import { useEffect, useState } from 'react'
import '../App.css'

const API_URL = 'http://127.0.0.1:8001'

const translations = {
  RU: {
    home: 'Главная',
    about: 'О проекте',
    how: 'Как это работает',
    questions: 'Вопросы',
    login: 'Войти',
    eyebrow: 'ОНЛАЙН-ЗАПИСЬ В NOMAD COLLEGE',
    title1: 'Запишись на приём',
    title2: 'без очередей',
    description: 'Выбирай нужную услугу, удобное время и записывайся онлайн — быстро и просто.',
    book: 'Записаться',
    learn: 'Узнать больше',
    note: 'ПРОСТО • БЫСТРО • УДОБНО',
    photoLabel: 'NOMAD COLLEGE',
    photoTitle: 'Твоё будущее начинается здесь',
    advantages: 'НАШИ ПРЕИМУЩЕСТВА',
    featuresTitle: 'Запись стала проще',
    featuresDescription: 'Всё необходимое для удобной записи в одном месте.',
    feature1: 'Экономия времени',
    feature1Text: 'Записывайся онлайн и не трать время на ожидание в очередях.',
    feature2: 'Удобное расписание',
    feature2Text: 'Выбирай доступные дату и время для посещения.',
    feature3: 'Всё в одном месте',
    feature3Text: 'Находи нужную информацию и управляй своими записями.',
    howTitle: 'Как это работает?',
    howDescription: 'Три простых шага — и ты готов к приёму.',
    step1: 'Выбери услугу',
    step1Text: 'Найди нужный вопрос или услугу.',
    step2: 'Выбери время',
    step2Text: 'Посмотри доступные даты и время.',
    step3: 'Подтверди запись',
    step3Text: 'Получи информацию о своей записи.',
    questionsKicker: 'БАЗА ЗНАНИЙ',
    questionsTitle: 'Популярные вопросы',
    questionsDescription: 'Вопросы, добавленные администрацией колледжа.',
    loading: 'Загружаем вопросы...',
    empty: 'Пока вопросов нет.',
    error: 'Не удалось загрузить вопросы. Проверь, запущен ли сервер.',
    category: 'Категория',
    level: 'Отдел',
    ctaTitle: 'Готов записаться?',
    ctaDescription: 'Создай аккаунт, чтобы продолжить.',
    ctaButton: 'Открыть API',
    footer: 'Все права защищены.',
    registerTitle: 'Создать аккаунт',
    registerDescription: 'Заполни данные, чтобы зарегистрироваться в Online Record.',
    username: 'Логин',
    password: 'Пароль',
    firstName: 'Имя',
    lastName: 'Фамилия',
    phone: 'Номер телефона',
    direction: 'Направление обучения',
    course: 'Курс',
    registerButton: 'Зарегистрироваться',
    registering: 'Регистрируем...',
    directionIT: 'IT',
    success: 'Регистрация прошла успешно! Теперь можешь войти в аккаунт.',
    registrationError: 'Не удалось зарегистрироваться. Проверь данные и попробуй снова.',
    required: 'Заполни все обязательные поля.',
    loginTitle: 'Вход в аккаунт',
    loginDescription: 'Введи логин и пароль, указанные при регистрации.',
    loginButton: 'Войти',
    loggingIn: 'Входим...',
    loginSuccess: 'Вход выполнен успешно!',
    loginError: 'Не удалось войти. Проверь логин и пароль.',
    logout: 'Выйти',
    loggedInAs: 'Ты вошёл как',
  },

  KG: {
    home: 'Башкы бет',
    about: 'Долбоор жөнүндө',
    how: 'Кантип иштейт',
    questions: 'Суроолор',
    login: 'Кирүү',
    eyebrow: 'NOMAD COLLEGE ОНЛАЙН ЖАЗЫЛУУ',
    title1: 'Кабыл алууга жазыл',
    title2: 'кезексиз',
    description: 'Керектүү кызматты жана ыңгайлуу убакытты тандап, онлайн жазыл.',
    book: 'Жазылуу',
    learn: 'Көбүрөөк билүү',
    note: 'ЖӨНӨКӨЙ • ТЕЗ • ЫҢГАЙЛУУ',
    photoLabel: 'NOMAD COLLEGE',
    photoTitle: 'Келечегиң ушул жерден башталат',
    advantages: 'БИЗДИН АРТЫКЧЫЛЫКТАР',
    featuresTitle: 'Жазылуу оңой болду',
    featuresDescription: 'Ыңгайлуу жазылуу үчүн керектүү нерселердин баары бир жерде.',
    feature1: 'Убакытты үнөмдөө',
    feature1Text: 'Онлайн жазылып, кезекте күтүүгө убакыт коротпо.',
    feature2: 'Ыңгайлуу график',
    feature2Text: 'Барууга ылайыктуу күндү жана убакытты танда.',
    feature3: 'Баары бир жерде',
    feature3Text: 'Керектүү маалыматты таап, жазылууларыңды башкар.',
    howTitle: 'Кантип иштейт?',
    howDescription: 'Үч жөнөкөй кадам — жана сен даярсың.',
    step1: 'Кызматты танда',
    step1Text: 'Керектүү суроону же кызматты тап.',
    step2: 'Убакытты танда',
    step2Text: 'Бош күндөрдү жана убакыттарды кара.',
    step3: 'Жазылууну ырастап кой',
    step3Text: 'Жазылууң тууралуу маалыматты ал.',
    questionsKicker: 'МААЛЫМАТ БАЗАСЫ',
    questionsTitle: 'Көп берилүүчү суроолор',
    questionsDescription: 'Колледждин администрациясы кошкон суроолор.',
    loading: 'Суроолор жүктөлүүдө...',
    empty: 'Азырынча суроолор жок.',
    error: 'Суроолор жүктөлгөн жок. Сервер иштеп жатканын текшер.',
    category: 'Категория',
    level: 'Бөлүм',
    ctaTitle: 'Жазылууга даярсыңбы?',
    ctaDescription: 'Баштоо үчүн аккаунт түз.',
    ctaButton: 'API ачуу',
    footer: 'Бардык укуктар корголгон.',
    registerTitle: 'Аккаунт түзүү',
    registerDescription: 'Катталуу үчүн маалыматтарды толтур.',
    username: 'Логин',
    password: 'Сырсөз',
    firstName: 'Атың',
    lastName: 'Фамилияң',
    phone: 'Телефон номери',
    direction: 'Окуу багыты',
    course: 'Курс',
    registerButton: 'Катталуу',
    registering: 'Катталууда...',
    directionIT: 'IT',
    success: 'Катталуу ийгиликтүү өттү! Эми аккаунтка кирсең болот.',
    registrationError: 'Катталуу ишке ашкан жок. Маалыматтарды текшерип кайра аракет кыл.',
    required: 'Милдеттүү талааларды толтур.',
    loginTitle: 'Аккаунтка кирүү',
    loginDescription: 'Катталууда колдонгон логин менен сырсөздү киргиз.',
    loginButton: 'Кирүү',
    loggingIn: 'Кирип жатат...',
    loginSuccess: 'Кирүү ийгиликтүү болду!',
    loginError: 'Кирүү ишке ашкан жок. Логин менен сырсөздү текшер.',
    logout: 'Чыгуу',
    loggedInAs: 'Аккаунтка кирдиң:',
  },

  EN: {
    home: 'Home',
    about: 'About',
    how: 'How it works',
    questions: 'Questions',
    login: 'Sign in',
    eyebrow: 'ONLINE BOOKING AT NOMAD COLLEGE',
    title1: 'Book your appointment',
    title2: 'without queues',
    description: 'Choose a service, select a convenient time, and book online — quickly and easily.',
    book: 'Book now',
    learn: 'Learn more',
    note: 'SIMPLE • FAST • CONVENIENT',
    photoLabel: 'NOMAD COLLEGE',
    photoTitle: 'Your future starts here',
    advantages: 'OUR ADVANTAGES',
    featuresTitle: 'Booking made easier',
    featuresDescription: 'Everything you need for convenient booking in one place.',
    feature1: 'Save time',
    feature1Text: 'Book online and avoid waiting in queues.',
    feature2: 'Convenient schedule',
    feature2Text: 'Choose an available date and time.',
    feature3: 'Everything in one place',
    feature3Text: 'Find information and manage your bookings.',
    howTitle: 'How does it work?',
    howDescription: 'Three simple steps to get started.',
    step1: 'Choose a service',
    step1Text: 'Find the question or service you need.',
    step2: 'Choose a time',
    step2Text: 'Check available dates and times.',
    step3: 'Confirm your booking',
    step3Text: 'Get information about your appointment.',
    questionsKicker: 'KNOWLEDGE BASE',
    questionsTitle: 'Frequently asked questions',
    questionsDescription: 'Questions added by the college administration.',
    loading: 'Loading questions...',
    empty: 'There are no questions yet.',
    error: 'Could not load questions. Check that the server is running.',
    category: 'Category',
    level: 'Department',
    ctaTitle: 'Ready to book?',
    ctaDescription: 'Create an account to get started.',
    ctaButton: 'Open API',
    footer: 'All rights reserved.',
    registerTitle: 'Create an account',
    registerDescription: 'Enter your details to register for Online Record.',
    username: 'Username',
    password: 'Password',
    firstName: 'First name',
    lastName: 'Last name',
    phone: 'Phone number',
    direction: 'Study direction',
    course: 'Course',
    registerButton: 'Register',
    registering: 'Registering...',
    directionIT: 'IT',
    success: 'Registration successful! You can now sign in.',
    registrationError: 'Registration failed. Check your details and try again.',
    required: 'Please fill in all required fields.',
    loginTitle: 'Sign in',
    loginDescription: 'Enter the username and password you registered with.',
    loginButton: 'Sign in',
    loggingIn: 'Signing in...',
    loginSuccess: 'You have signed in successfully!',
    loginError: 'Sign-in failed. Check your username and password.',
    logout: 'Sign out',
    loggedInAs: 'Signed in as',
  },
}

function getErrorMessage(data, fallback) {
  if (!data) return fallback
  if (typeof data.detail === 'string') return data.detail
  if (typeof data.message === 'string') return data.message

  if (typeof data === 'object') {
    const messages = Object.entries(data).map(([field, value]) => {
      const text = Array.isArray(value) ? value.join(' ') : String(value)
      return `${field}: ${text}`
    })

    if (messages.length) return messages.join(' | ')
  }

  return fallback
}

function App() {
  const [language, setLanguage] = useState('RU')
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [questionError, setQuestionError] = useState(false)

  const [form, setForm] = useState({
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    direction: 'it',
    course: '1',
  })

  const [registering, setRegistering] = useState(false)
  const [registrationMessage, setRegistrationMessage] = useState('')
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
  })
  const [loggingIn, setLoggingIn] = useState(false)
  const [loginMessage, setLoginMessage] = useState('')
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [currentUser, setCurrentUser] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [refreshToken, setRefreshToken] = useState('')

  const t = translations[language]

  // Загрузка вопросов из Django
  useEffect(() => {
    const controller = new AbortController()

    fetch(`${API_URL}/api/questions/`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.json()
      })
      .then((data) => {
        const items = Array.isArray(data)
          ? data
          : data.value ?? data.results ?? []

        setQuestions(items)
        setLoading(false)
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('Ошибка загрузки вопросов:', err)
          setQuestionError(true)
          setLoading(false)
        }
      })

    return () => controller.abort()
  }, [])

  const updateForm = (event) => {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))

    setRegistrationMessage('')
    setRegistrationSuccess(false)
  }

  // Регистрация пользователя
  const handleRegister = async (event) => {
    event.preventDefault()

    setRegistrationMessage('')
    setRegistrationSuccess(false)

    if (
      !form.username.trim() ||
      !form.password ||
      !form.first_name.trim() ||
      !form.last_name.trim() ||
      !form.phone.trim() ||
      !form.direction ||
      !form.course
    ) {
      setRegistrationMessage(t.required)
      return
    }

    setRegistering(true)

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
        throw new Error(getErrorMessage(data, t.registrationError))
      }

      setRegistrationSuccess(true)
      setRegistrationMessage(t.success)

      // Оставляем логин, чтобы его можно было использовать для входа.
      setLoginForm({
        username: form.username.trim(),
        password: '',
      })

      setForm({
        username: '',
        password: '',
        first_name: '',
        last_name: '',
        phone: '',
        direction: 'it',
        course: '1',
      })
    } catch (error) {
      console.error('Ошибка регистрации:', error)
      setRegistrationMessage(error.message || t.registrationError)
    } finally {
      setRegistering(false)
    }
  }

  // Вход через Django Simple JWT
  const handleLogin = async (event) => {
    event.preventDefault()

    setLoginMessage('')
    setLoginSuccess(false)

    if (!loginForm.username.trim() || !loginForm.password) {
      setLoginMessage(t.loginError)
      return
    }

    setLoggingIn(true)

    try {
      const response = await fetch(`${API_URL}/api/auth/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          username: loginForm.username.trim(),
          password: loginForm.password,
        }),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(getErrorMessage(data, t.loginError))
      }

      if (!data?.access) {
        throw new Error(t.loginError)
      }

      setAccessToken(data.access)
      setRefreshToken(data.refresh ?? '')
      setCurrentUser(loginForm.username.trim())
      setLoginSuccess(true)
      setLoginMessage(t.loginSuccess)

      setLoginForm({
        username: '',
        password: '',
      })
    } catch (error) {
      console.error('Ошибка входа:', error)
      setLoginMessage(error.message || t.loginError)
    } finally {
      setLoggingIn(false)
    }
  }

  const handleLogout = () => {
    setAccessToken('')
    setRefreshToken('')
    setCurrentUser('')
    setLoginMessage('')
    setLoginSuccess(false)
  }

  return (
    <div className="site-wrapper">
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Online Record">
          <img
            className="college-logo"
            src="/nomad.webp"
            alt="Логотип Nomad College"
          />

          <span className="brand-text">
            <strong>ONLINE</strong>
            <span>RECORD</span>
          </span>
        </a>

        <nav className="main-nav">
          <a href="#home">{t.home}</a>
          <a href="#about">{t.about}</a>
          <a href="#how">{t.how}</a>
          <a href="#questions">{t.questions}</a>
        </nav>

        <div className="header-actions">
          <div className="language-switch">
            {['RU', 'KG', 'EN'].map((lang) => (
              <button
                key={lang}
                type="button"
                className={`language ${language === lang ? 'active' : ''}`}
                onClick={() => setLanguage(lang)}
                aria-pressed={language === lang}
              >
                {lang}
              </button>
            ))}
          </div>

          <a className="header-button" href="#login">
            {t.login}
          </a>
        </div>
      </header>

      <main>
        {/* Главный экран */}
        <section className="hero section-container" id="home">
          <div className="hero-content">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              {t.eyebrow}
            </div>

            <h1>
              {t.title1}
              <span>{t.title2}</span>
            </h1>

            <p className="hero-description">{t.description}</p>

            <div className="hero-buttons">
              <a className="button button-primary" href="#booking">
                {t.book} <span>→</span>
              </a>

              <a className="button button-secondary" href="#about">
                {t.learn}
              </a>
            </div>

            <div className="hero-note">
              <span className="note-line" />
              {t.note}
            </div>
          </div>

          <div className="hero-visual">
            <div className="photo-frame">
              <img
                className="college-photo"
                src="/nomad1.webp"
                alt="Фотография Nomad College"
              />

              <div className="photo-overlay" />

              <div className="photo-caption">
                <span>{t.photoLabel}</span>
                <strong>{t.photoTitle}</strong>
              </div>

              <div className="photo-number">01 / OR</div>
            </div>

            <div className="visual-accent" />
          </div>
        </section>

        {/* Преимущества */}
        <section className="features-section" id="about">
          <div className="section-container">
            <div className="section-heading">
              <span className="section-kicker">{t.advantages}</span>
              <h2>{t.featuresTitle}</h2>
              <p>{t.featuresDescription}</p>
            </div>

            <div className="features-grid">
              <article className="feature-card">
                <div className="feature-icon red-icon">◷</div>
                <span className="feature-number">01</span>
                <h3>{t.feature1}</h3>
                <p>{t.feature1Text}</p>
              </article>

              <article className="feature-card">
                <div className="feature-icon dark-icon">▦</div>
                <span className="feature-number">02</span>
                <h3>{t.feature2}</h3>
                <p>{t.feature2Text}</p>
              </article>

              <article className="feature-card">
                <div className="feature-icon light-icon">▤</div>
                <span className="feature-number">03</span>
                <h3>{t.feature3}</h3>
                <p>{t.feature3Text}</p>
              </article>
            </div>
          </div>
        </section>

        {/* Как это работает */}
        <section className="features-section" id="how">
          <div className="section-container">
            <div className="section-heading">
              <span className="section-kicker">ONLINE RECORD</span>
              <h2>{t.howTitle}</h2>
              <p>{t.howDescription}</p>
            </div>

            <div className="features-grid">
              <article className="feature-card">
                <span className="feature-number">01</span>
                <h3>{t.step1}</h3>
                <p>{t.step1Text}</p>
                <a className="feature-link" href="#questions">→</a>
              </article>

              <article className="feature-card">
                <span className="feature-number">02</span>
                <h3>{t.step2}</h3>
                <p>{t.step2Text}</p>
                <a className="feature-link" href="#questions">→</a>
              </article>

              <article className="feature-card">
                <span className="feature-number">03</span>
                <h3>{t.step3}</h3>
                <p>{t.step3Text}</p>
                <a className="feature-link" href="#register">→</a>
              </article>
            </div>
          </div>
        </section>

        {/* Вопросы из Django */}
        <section className="features-section" id="questions">
          <div className="section-container">
            <div className="section-heading">
              <span className="section-kicker">{t.questionsKicker}</span>
              <h2>{t.questionsTitle}</h2>
              <p>{t.questionsDescription}</p>
            </div>

            {loading && (
              <p style={{ textAlign: 'center' }}>{t.loading}</p>
            )}

            {questionError && (
              <p style={{ textAlign: 'center', color: '#d51f32' }}>
                {t.error}
              </p>
            )}

            {!loading && !questionError && questions.length === 0 && (
              <p style={{ textAlign: 'center' }}>{t.empty}</p>
            )}

            <div className="features-grid">
              {questions.map((question) => (
                <article className="feature-card" key={question.id}>
                  <div className="feature-icon red-icon">?</div>

                  <h3>
                    {question.text ??
                      question.question ??
                      question.title ??
                      'Вопрос'}
                  </h3>

                  {question.category_title && (
                    <p>
                      {t.category}: {question.category_title}
                    </p>
                  )}

                  {question.level_display && (
                    <p>
                      {t.level}: {question.level_display}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Вход в аккаунт */}
        <section className="features-section" id="login">
          <div className="section-container">
            <div className="section-heading">
              <span className="section-kicker">ONLINE RECORD</span>
              <h2>{t.loginTitle}</h2>
              <p>{t.loginDescription}</p>
            </div>

            <div
              className="feature-card"
              style={{ maxWidth: '680px', margin: '0 auto' }}
            >
              {accessToken ? (
                <div>
                  <h3>{t.loginSuccess}</h3>

                  <p style={{ margin: '12px 0 20px' }}>
                    {t.loggedInAs}: <strong>{currentUser}</strong>
                  </p>

                  <button
                    className="button button-primary"
                    type="button"
                    onClick={handleLogout}
                    style={{ border: 0, cursor: 'pointer' }}
                  >
                    {t.logout}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleLogin}>
                  <div style={{ display: 'grid', gap: '16px' }}>
                    <label style={{ display: 'grid', gap: '7px' }}>
                      <span>{t.username} *</span>

                      <input
                        name="username"
                        value={loginForm.username}
                        onChange={(event) => {
                          setLoginForm((previous) => ({
                            ...previous,
                            username: event.target.value,
                          }))
                          setLoginMessage('')
                          setLoginSuccess(false)
                        }}
                        autoComplete="username"
                        required
                      />
                    </label>

                    <label style={{ display: 'grid', gap: '7px' }}>
                      <span>{t.password} *</span>

                      <input
                        name="password"
                        type="password"
                        value={loginForm.password}
                        onChange={(event) => {
                          setLoginForm((previous) => ({
                            ...previous,
                            password: event.target.value,
                          }))
                          setLoginMessage('')
                          setLoginSuccess(false)
                        }}
                        autoComplete="current-password"
                        required
                      />
                    </label>
                  </div>

                  {loginMessage && (
                    <p
                      role="status"
                      style={{
                        marginTop: '18px',
                        color: loginSuccess ? '#167a3f' : '#d51f32',
                        overflowWrap: 'anywhere',
                      }}
                    >
                      {loginMessage}
                    </p>
                  )}

                  <button
                    className="button button-primary"
                    type="submit"
                    disabled={loggingIn}
                    style={{
                      marginTop: '22px',
                      border: 0,
                      cursor: loggingIn ? 'wait' : 'pointer',
                    }}
                  >
                    {loggingIn ? t.loggingIn : t.loginButton}
                  </button>

                  <p style={{ marginTop: '18px' }}>
                    Ещё нет аккаунта? <a href="#register">Зарегистрироваться</a>
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Форма регистрации */}
        <section className="features-section" id="register">
          <div className="section-container">
            <div className="section-heading">
              <span className="section-kicker">ONLINE RECORD</span>
              <h2>{t.registerTitle}</h2>
              <p>{t.registerDescription}</p>
            </div>

            <form
              className="feature-card"
              onSubmit={handleRegister}
              style={{ maxWidth: '680px', margin: '0 auto' }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '16px',
                }}
              >
                <label style={{ display: 'grid', gap: '7px' }}>
                  <span>{t.username} *</span>
                  <input
                    name="username"
                    value={form.username}
                    onChange={updateForm}
                    autoComplete="username"
                    required
                    minLength={3}
                    maxLength={150}
                  />
                </label>

                <label style={{ display: 'grid', gap: '7px' }}>
                  <span>{t.password} *</span>
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={updateForm}
                    autoComplete="new-password"
                    required
                    minLength={8}
                  />
                </label>

                <label style={{ display: 'grid', gap: '7px' }}>
                  <span>{t.firstName} *</span>
                  <input
                    name="first_name"
                    value={form.first_name}
                    onChange={updateForm}
                    autoComplete="given-name"
                    required
                  />
                </label>

                <label style={{ display: 'grid', gap: '7px' }}>
                  <span>{t.lastName} *</span>
                  <input
                    name="last_name"
                    value={form.last_name}
                    onChange={updateForm}
                    autoComplete="family-name"
                    required
                  />
                </label>

                <label style={{ display: 'grid', gap: '7px' }}>
                  <span>{t.phone} *</span>
                  <input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={updateForm}
                    autoComplete="tel"
                    required
                  />
                </label>

                <label style={{ display: 'grid', gap: '7px' }}>
                  <span>{t.direction} *</span>
                  <select
                    name="direction"
                    value={form.direction}
                    onChange={updateForm}
                    required
                  >
                    <option value="it">{t.directionIT}</option>
                  </select>
                </label>

                <label style={{ display: 'grid', gap: '7px' }}>
                  <span>{t.course} *</span>
                  <select
                    name="course"
                    value={form.course}
                    onChange={updateForm}
                    required
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </label>
              </div>

              {registrationMessage && (
                <p
                  role="status"
                  style={{
                    marginTop: '18px',
                    color: registrationSuccess ? '#167a3f' : '#d51f32',
                    overflowWrap: 'anywhere',
                  }}
                >
                  {registrationMessage}
                </p>
              )}

              <button
                className="button button-primary"
                type="submit"
                disabled={registering}
                style={{
                  marginTop: '22px',
                  border: 0,
                  cursor: registering ? 'wait' : 'pointer',
                }}
              >
                {registering ? t.registering : t.registerButton}
              </button>

              {registrationSuccess && (
                <p style={{ marginTop: '14px' }}>
                  <a href="#login">Перейти ко входу →</a>
                </p>
              )}
            </form>
          </div>
        </section>

        {/* Призыв к действию */}
        <section className="cta-section" id="contact">
          <div className="section-container">
            <div className="cta-card">
              <div className="cta-content">
                <span className="section-kicker">ONLINE RECORD</span>
                <h2>{t.ctaTitle}</h2>
                <p>{t.ctaDescription}</p>

                <a
                  className="button button-white"
                  href={`${API_URL}/api/docs/`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t.ctaButton} <span>→</span>
                </a>
              </div>

              <div className="cta-decoration">OR</div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="footer-brand" href="#home">
          <span>ONLINE RECORD</span>
        </a>

        <p>
          © {new Date().getFullYear()} Online Record. {t.footer}
        </p>

        <span className="footer-year">NOMAD COLLEGE</span>
      </footer>
    </div>
  )
}

export default App
