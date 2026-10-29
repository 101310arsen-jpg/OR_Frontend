
import {
  createContext,
  useContext,
  useState,
} from 'react'

const LanguageContext = createContext(null)

const STORAGE_KEY = 'online_record_language'

const availableLanguages = ['RU', 'KG', 'EN']

function getSavedLanguage() {
  try {
    const savedLanguage = localStorage.getItem(STORAGE_KEY)

    return availableLanguages.includes(savedLanguage)
      ? savedLanguage
      : 'RU'
  } catch {
    return 'RU'
  }
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(
    getSavedLanguage
  )

  const setLanguage = (newLanguage) => {
    if (!availableLanguages.includes(newLanguage)) {
      return
    }

    setLanguageState(newLanguage)

    try {
      localStorage.setItem(STORAGE_KEY, newLanguage)
    } catch {
      // Сайт продолжит работать без сохранения языка
    }
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error(
      'useLanguage должен использоваться внутри LanguageProvider'
    )
  }

  return context
}
