
import { useState } from 'react'
import './App.css'

const translations = {
  RU: {
    home: 'Главная',
    about: 'О сервисе',
    how: 'Как это работает',
    login: 'Войти',
    badge: 'ОНЛАЙН-СЕРВИС NOMAD COLLEGE',
    title: 'Твоё будущее.',
    titleAccent: 'Твой следующий шаг.',
    description:
      'Записывайся на консультации, выбирай удобное время и следи за своими обращениями в одном месте.',
    primary: 'Записаться',
    secondary: 'Как это работает',
    label: 'ТВОЁ ОБРАЗОВАНИЕ — ТВОЙ ВЫБОР',
    sectionTitle: 'Всё необходимое — в одном месте',
    sectionDescription:
      'Удобный сервис для студентов и абитуриентов Nomad College.',
    feature1: 'Удобная запись',
    feature1Text:
      'Выбирай подходящее время для консультации без лишних звонков.',
    feature2: 'Понятный процесс',
    feature2Text:
      'Следи за своими записями и получай необходимую информацию.',
    feature3: 'Твой выбор',
    feature3Text:
      'Получай помощь и ответы на вопросы об обучении.',
    ctaTitle: 'Готов сделать следующий шаг?',
    ctaText:
      'Начни с записи на консультацию и узнай больше о возможностях обучения.',
    ctaButton: 'Начать сейчас',
    footer: 'Образование открывает новые возможности.',
  },
  KG: {
    home: 'Башкы бет',
    about: 'Сервис жөнүндө',
    how: 'Кантип иштейт',
    login: 'Кирүү',
    badge: 'NOMAD COLLEGE ОНЛАЙН-СЕРВИСИ',
    title: 'Сенин келечегиң.',
    titleAccent: 'Сенин кийинки кадамың.',
    description:
      'Кеңеш алууга жазыл, ыңгайлуу убакытты танда жана кайрылууларыңды бир жерден көзөмөлдө.',
    primary: 'Жазылуу',
    secondary: 'Кантип иштейт',
    label: 'БИЛИМ — СЕНИН ТАНДООҢ',
    sectionTitle: 'Керектүү нерселердин баары бир жерде',
    sectionDescription:
      'Nomad College студенттери жана абитуриенттери үчүн ыңгайлуу сервис.',
    feature1: 'Ыңгайлуу жазылуу',
    feature1Text:
      'Кеңеш алуу үчүн ылайыктуу убакытты оңой танда.',
    feature2: 'Түшүнүктүү процесс',
    feature2Text:
      'Жазылууларыңды көзөмөлдөп, керектүү маалыматты ал.',
    feature3: 'Сенин тандооң',
    feature3Text:
      'Окуу тууралуу суроолоруңа жооп жана жардам ал.',
    ctaTitle: 'Кийинки кадамга даярсыңбы?',
    ctaText:
      'Кеңеш алууга жазылып, окуу мүмкүнчүлүктөрү тууралуу көбүрөөк бил.',
    ctaButton: 'Азыр баштоо',
    footer: 'Билим жаңы мүмкүнчүлүктөрдү ачат.',
  },
  EN: {
    home: 'Home',
    about: 'About',
    how: 'How it works',
    login: 'Sign in',
    badge: 'NOMAD COLLEGE ONLINE SERVICE',
    title: 'Your future.',
    titleAccent: 'Your next step.',
    description:
      'Book a consultation, choose a convenient time, and manage your requests in one place.',
    primary: 'Book now',
    secondary: 'How it works',
    label: 'YOUR EDUCATION — YOUR CHOICE',
    sectionTitle: 'Everything you need in one place',
    sectionDescription:
      'A convenient service for Nomad College students and applicants.',
    feature1: 'Easy booking',
    feature1Text:
      'Choose a convenient consultation time without unnecessary calls.',
    feature2: 'Simple process',
    feature2Text:
      'Keep track of your bookings and get the information you need.',
    feature3: 'Your choice',
    feature3Text:
      'Get help and answers to your questions about studying.',
    ctaTitle: 'Ready to take the next step?',
    ctaText:
      'Book a consultation and discover more about your study opportunities.',
    ctaButton: 'Get started',
    footer: 'Education opens new opportunities.',
  },
}

function App() {
  const [language, setLanguage] = useState('RU')
  const t = translations[language]

  return (
    <div className="site-wrapper">
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Nomad College home">
          <img
            src="/nomad.webp"
            alt="Nomad College"
            className="college-logo"
          />
          <span className="brand-text">
            <strong>NOMAD</strong>
            <span>COLLEGE</span>
          </span>
        </a>

        <nav className="main-nav">
          <a href="#home">{t.home}</a>
          <a href="#about">{t.about}</a>
          <a href="#how">{t.how}</a>
        </nav>

        <div className="header-actions">
          <div className="language-switch" aria-label="Choose language">
            {['RU', 'KG', 'EN'].map((lang) => (
              <button
                key={lang}
                type="button"
                className={language === lang ? 'language active' : 'language'}
                onClick={() => setLanguage(lang)}
              >
                {lang}
              </button>
            ))}
          </div>

          <a className="header-button" href="#contact">
            {t.login}
          </a>
        </div>
      </header>

      <main>
        <section className="hero section-container" id="home">
          <div className="hero-content">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              {t.badge}
            </div>

            <h1>
              {t.title}
              <span>{t.titleAccent}</span>
            </h1>

            <p className="hero-description">{t.description}</p>

            <div className="hero-buttons">
              <a className="button button-primary" href="#contact">
                {t.primary}
                <span aria-hidden="true">↗</span>
              </a>
              <a className="button button-secondary" href="#how">
                {t.secondary}
              </a>
            </div>

            <div className="hero-note">
              <span className="note-line" />
              {t.label}
            </div>
          </div>

          <div className="hero-visual">
            <div className="photo-frame">
              <img
                src="/nomad1.webp"
                alt="Nomad College"
                className="college-photo"
              />
              <div className="photo-overlay" />
              <div className="photo-caption">
                <span>NOMAD COLLEGE</span>
                <strong>Learn. Grow. Lead.</strong>
              </div>
              <div className="photo-number">01 / 03</div>
            </div>
            <div className="visual-accent" />
          </div>
        </section>

        <section className="features-section" id="about">
          <div className="section-container">
            <div className="section-heading">
              <span className="section-kicker">{t.about}</span>
              <h2>{t.sectionTitle}</h2>
              <p>{t.sectionDescription}</p>
            </div>

            <div className="features-grid" id="how">
              <article className="feature-card">
                <div className="feature-icon red-icon">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect
                      x="3.5"
                      y="5"
                      width="17"
                      height="16"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    />
                    <path
                      d="M8 3v4M16 3v4M4 10h16M8 14h3"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <span className="feature-number">01</span>
                <h3>{t.feature1}</h3>
                <p>{t.feature1Text}</p>
                <a href="#contact" className="feature-link" aria-label={t.primary}>
                  ↗
                </a>
              </article>

              <article className="feature-card">
                <div className="feature-icon dark-icon">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M5 12.5l4.2 4.2L19.5 6.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    />
                  </svg>
                </div>
                <span className="feature-number">02</span>
                <h3>{t.feature2}</h3>
                <p>{t.feature2Text}</p>
                <a href="#contact" className="feature-link" aria-label={t.primary}>
                  ↗
                </a>
              </article>

              <article className="feature-card">
                <div className="feature-icon light-icon">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3z"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="feature-number">03</span>
                <h3>{t.feature3}</h3>
                <p>{t.feature3Text}</p>
                <a href="#contact" className="feature-link" aria-label={t.primary}>
                  ↗
                </a>
              </article>
            </div>
          </div>
        </section>

        <section className="cta-section section-container" id="contact">
          <div className="cta-card">
            <div className="cta-decoration" aria-hidden="true">
              N
            </div>
            <div className="cta-content">
              <span className="section-kicker">{t.badge}</span>
              <h2>{t.ctaTitle}</h2>
              <p>{t.ctaText}</p>
              <a
                className="button button-white"
                href="https://nomadcollege.kg/"
                target="_blank"
                rel="noreferrer"
              >
                {t.ctaButton}
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="footer-brand" href="#home">
          <img src="/nomad.webp" alt="" />
          <span>NOMAD COLLEGE</span>
        </a>
        <p>{t.footer}</p>
        <span className="footer-year">© {new Date().getFullYear()} NOMAD</span>
      </footer>
    </div>
  )
}

export default App
