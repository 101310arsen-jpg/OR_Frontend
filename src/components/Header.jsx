
import { Link } from 'react-router-dom'
import { translations } from '../locales/index.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'



function Header({ showHomeNav = false }) {
  const { isAuthenticated, currentUser } = useAuth()
  const { language, setLanguage } = useLanguage()

  const t = translations[language]?.header || translations.RU.header

  return (
    <header className="site-header">

      {/* ЛОГОТИП */}
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

      {/* НАВИГАЦИЯ */}
      <nav className="main-nav">
        {showHomeNav ? (
          <>
            <a href="#home">{t.home}</a>
            <a href="#about">{t.about}</a>
            <a href="#how">{t.how}</a>
            <a href="#questions">{t.questions}</a>
          </>
        ) : (
          <Link to="/">{t.home}</Link>
        )}

        <Link to="/booking">
          {t.booking}
        </Link>

        {isAuthenticated && (
          <Link to="/my-bookings">
            {t.myBookings}
          </Link>
        )}
      </nav>

      {/* ПРАВАЯ ЧАСТЬ */}
      <div className="header-actions">

        {/* ПЕРЕКЛЮЧАТЕЛЬ ЯЗЫКА */}
        <div className="language-switch">
          {['RU', 'KG', 'EN'].map((lang) => (
            <button
              key={lang}
              type="button"
              className={`language ${
                language === lang ? 'active' : ''
              }`}
              onClick={() => setLanguage(lang)}
              aria-pressed={language === lang}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* ВХОД ИЛИ АККАУНТ */}
        <Link
          to={isAuthenticated ? '/my-bookings' : '/login'}
          className="header-button"
        >
          {isAuthenticated ? currentUser : t.login}
        </Link>

      </div>
    </header>
  )
}

export default Header
