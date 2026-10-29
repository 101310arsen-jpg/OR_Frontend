
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { useAuth } from '../context/AuthContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { translations } from '../locales/translations.js'
import { api } from '../services/api.js'

import Header from '../components/Header.jsx'
import '../App.css'

function Home() {

  // ======================================
  // 1. ОБЩИЙ ЯЗЫК И АВТОРИЗАЦИЯ
  // ======================================

  const { language } = useLanguage()
  const { isAuthenticated } = useAuth()

  const t = translations[language] || translations.RU

  // ======================================
  // 2. СОСТОЯНИЯ ВОПРОСОВ
  // ======================================

  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // ======================================
  // 3. ЗАГРУЗКА ВОПРОСОВ ЧЕРЕЗ API-СЕРВИС
  // ======================================

  useEffect(() => {
    const controller = new AbortController()

    async function loadQuestions() {
      setLoading(true)
      setError(false)

      try {
        // Запрос к Django через общий api.js
        const data = await api.getQuestions(
          controller.signal
        )

        // Поддержка обычного списка и пагинации
        const items = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
            ? data.results
            : Array.isArray(data?.value)
              ? data.value
              : []

        if (!controller.signal.aborted) {
          setQuestions(items)
        }

      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error(
            'Ошибка получения вопросов:',
            err
          )

          if (!controller.signal.aborted) {
            setError(true)
          }
        }

      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadQuestions()

    return () => controller.abort()
  }, [])

  // ======================================
  // 4. ГЛАВНАЯ СТРАНИЦА
  // ======================================

  return (
    <div className="site-wrapper">

      {/* ОБЩАЯ ШАПКА */}
      <Header showHomeNav={true} />

      <main>

        {/* =================================
            ГЛАВНЫЙ ЭКРАН
           ================================= */}

        <section
          className="hero section-container"
          id="home"
        >

          <div className="hero-content">

            <div className="eyebrow">
              <span className="eyebrow-dot" />
              {t.eyebrow}
            </div>

            <h1>
              {t.title1}
              <span>{t.title2}</span>
            </h1>

            <p className="hero-description">
              {t.description}
            </p>

            <div className="hero-buttons">

              <Link
                className="button button-primary"
                to={
                  isAuthenticated
                    ? '/booking'
                    : '/login'
                }
              >
                {t.book}
                <span>→</span>
              </Link>

              <a
                className="button button-secondary"
                href="#about"
              >
                {t.learn}
              </a>

            </div>

            <div className="hero-note">
              <span className="note-line" />
              {t.note}
            </div>

          </div>

          {/* ФОТОГРАФИЯ КОЛЛЕДЖА */}

          <div className="hero-visual">

            <div className="photo-frame">

              <img
                className="college-photo"
                src="/nomad1.webp"
                alt="Nomad College"
              />

              <div className="photo-overlay" />

              <div className="photo-caption">
                <span>{t.photoLabel}</span>
                <strong>{t.photoTitle}</strong>
              </div>

              <div className="photo-number">
                01 / OR
              </div>

            </div>

            <div className="visual-accent" />

          </div>

        </section>

        {/* =================================
            ПРЕИМУЩЕСТВА
           ================================= */}

        <section
          className="features-section"
          id="about"
        >

          <div className="section-container">

            <div className="section-heading">

              <span className="section-kicker">
                {t.advantages}
              </span>

              <h2>{t.featuresTitle}</h2>

              <p>{t.featuresDescription}</p>

            </div>

            <div className="features-grid">

              {/* ПРЕИМУЩЕСТВО 1 */}

              <article className="feature-card">

                <div className="feature-icon red-icon">
                  ◷
                </div>

                <span className="feature-number">
                  01
                </span>

                <h3>{t.feature1}</h3>
                <p>{t.feature1Text}</p>

              </article>

              {/* ПРЕИМУЩЕСТВО 2 */}

              <article className="feature-card">

                <div className="feature-icon dark-icon">
                  ▦
                </div>

                <span className="feature-number">
                  02
                </span>

                <h3>{t.feature2}</h3>
                <p>{t.feature2Text}</p>

              </article>

              {/* ПРЕИМУЩЕСТВО 3 */}

              <article className="feature-card">

                <div className="feature-icon light-icon">
                  ▤
                </div>

                <span className="feature-number">
                  03
                </span>

                <h3>{t.feature3}</h3>
                <p>{t.feature3Text}</p>

              </article>

            </div>

          </div>

        </section>

        {/* =================================
            КАК ЭТО РАБОТАЕТ
           ================================= */}

        <section
          className="features-section"
          id="how"
        >

          <div className="section-container">

            <div className="section-heading">

              <span className="section-kicker">
                ONLINE RECORD
              </span>

              <h2>{t.howTitle}</h2>

              <p>{t.howDescription}</p>

            </div>

            <div className="features-grid">

              {/* ШАГ 1 */}

              <article className="feature-card">

                <span className="feature-number">
                  01
                </span>

                <h3>{t.step1}</h3>
                <p>{t.step1Text}</p>

                <Link
                  className="feature-link"
                  to="/booking"
                >
                  →
                </Link>

              </article>

              {/* ШАГ 2 */}

              <article className="feature-card">

                <span className="feature-number">
                  02
                </span>

                <h3>{t.step2}</h3>
                <p>{t.step2Text}</p>

                <Link
                  className="feature-link"
                  to="/booking"
                >
                  →
                </Link>

              </article>

              {/* ШАГ 3 */}

              <article className="feature-card">

                <span className="feature-number">
                  03
                </span>

                <h3>{t.step3}</h3>
                <p>{t.step3Text}</p>

                <Link
                  className="feature-link"
                  to="/my-bookings"
                >
                  →
                </Link>

              </article>

            </div>

          </div>

        </section>

        {/* =================================
            ВОПРОСЫ ИЗ DJANGO
           ================================= */}

        <section
          className="features-section"
          id="questions"
        >

          <div className="section-container">

            <div className="section-heading">

              <span className="section-kicker">
                {t.questionsKicker}
              </span>

              <h2>{t.questionsTitle}</h2>

              <p>{t.questionsDescription}</p>

            </div>

            {/* ЗАГРУЗКА */}

            {loading && (
              <p
                style={{
                  textAlign: 'center',
                }}
              >
                {t.loading}
              </p>
            )}

            {/* ОШИБКА */}

            {error && (
              <p
                role="alert"
                style={{
                  textAlign: 'center',
                  color: '#d51f32',
                }}
              >
                {t.error}
              </p>
            )}

            {/* НЕТ ВОПРОСОВ */}

            {!loading &&
              !error &&
              questions.length === 0 && (

                <p
                  style={{
                    textAlign: 'center',
                  }}
                >
                  {t.empty}
                </p>

              )}

            {/* КАРТОЧКИ ВОПРОСОВ */}

            <div className="features-grid">

              {questions.map((question) => (

                <article
                  className="feature-card"
                  key={question.id}
                >

                  <div className="feature-icon red-icon">
                    ?
                  </div>

                  <h3>
                    {question.text ??
                      question.question ??
                      question.title ??
                      `Вопрос №${question.id}`}
                  </h3>

                  {question.category_title && (
                    <p>
                      {t.category}:{' '}
                      {question.category_title}
                    </p>
                  )}

                  {question.level_display && (
                    <p>
                      {t.level}:{' '}
                      {question.level_display}
                    </p>
                  )}

                  <Link
                    className="feature-link"
                    to={
                      isAuthenticated
                        ? '/booking'
                        : '/login'
                    }
                  >
                    →
                  </Link>

                </article>

              ))}

            </div>

          </div>

        </section>

        {/* =================================
            ПЕРЕХОД К ЗАПИСИ
           ================================= */}

        <section
          className="cta-section"
          id="contact"
        >

          <div className="section-container">

            <div className="cta-card">

              <div className="cta-content">

                <span className="section-kicker">
                  ONLINE RECORD
                </span>

                <h2>{t.ctaTitle}</h2>

                <p>{t.ctaDescription}</p>

                <Link
                  className="button button-white"
                  to={
                    isAuthenticated
                      ? '/booking'
                      : '/login'
                  }
                >
                  {t.ctaButton}
                  <span>→</span>
                </Link>

              </div>

              <div className="cta-decoration">
                OR
              </div>

            </div>

          </div>

        </section>

      </main>

      {/* =================================
          ПОДВАЛ САЙТА
         ================================= */}

      <footer className="site-footer">

        <Link
          className="footer-brand"
          to="/"
        >
          <span>
            ONLINE RECORD
          </span>
        </Link>

        <p>
          © {new Date().getFullYear()}{' '}
          Online Record. {t.footer}
        </p>

        <span className="footer-year">
          NOMAD COLLEGE
        </span>

      </footer>

    </div>
  )
}

export default Home
