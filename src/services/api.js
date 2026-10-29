
/*
 * ONLINE RECORD — API SERVICE
 *
 * Все запросы React к Django проходят
 * через этот файл.
 */

// Адрес Django-сервера
const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  'http://127.0.0.1:8001'
).replace(/\/+$/, '')

// Ошибка, возвращённая сервером
export class ApiError extends Error {
  constructor(status, data) {
    super(
      typeof data?.detail === 'string'
        ? data.detail
        : `HTTP ${status}`
    )

    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

// Преобразуем ошибки Django в понятный текст
export function getApiErrorMessage(error, fallback) {
  if (error instanceof ApiError) {
    const data = error.data

    if (typeof data?.detail === 'string') {
      return data.detail
    }

    if (data && typeof data === 'object') {
      const messages = Object.entries(data)
        .map(([field, value]) => {
          const message = Array.isArray(value)
            ? value.join(', ')
            : String(value)

          return `${field}: ${message}`
        })
        .join(' | ')

      if (messages) return messages
    }
  }

  return fallback
}

// Универсальная функция HTTP-запросов
export async function apiRequest(
  path,
  {
    method = 'GET',
    body,
    token,
    signal,
    headers = {},
  } = {}
) {
  const requestHeaders = {
    Accept: 'application/json',
    ...headers,
  }

  // Добавляем JSON только если есть тело запроса
  if (body !== undefined) {
    requestHeaders['Content-Type'] = 'application/json'
  }

  // Добавляем JWT для защищённых запросов
  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`
  }

  const response = await fetch(
    `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`,
    {
      method,
      headers: requestHeaders,
      body:
        body === undefined
          ? undefined
          : JSON.stringify(body),
      signal,
    }
  )

  // Не все ответы сервера содержат JSON
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(response.status, data)
  }

  return data
}

// ==========================================
// ГОТОВЫЕ МЕТОДЫ ДЛЯ ONLINE RECORD
// ==========================================

export const api = {

  // Авторизация студента
  login(username, password) {
    return apiRequest('/api/auth/token/', {
      method: 'POST',
      body: {
        username,
        password,
      },
    })
  },

  // Регистрация студента
  register(studentData) {
    return apiRequest('/api/register/', {
      method: 'POST',
      body: studentData,
    })
  },

  // Получение вопросов
  getQuestions(signal) {
    return apiRequest('/api/questions/', {
      signal,
    })
  },

  // Получение свободного времени
  getBookingSlots({
    question,
    date,
    token,
    signal,
  }) {
    const params = new URLSearchParams({
      question: String(question),
      date,
    })

    return apiRequest(
      `/api/booking/slots/?${params.toString()}`,
      {
        token,
        signal,
      }
    )
  },

  // Создание записи
  createBooking({
    question,
    date,
    time,
    duration,
    token,
  }) {
    return apiRequest('/api/booking/', {
      method: 'POST',
      token,
      body: {
        question,
        date,
        time,
        duration,
      },
    })
  },

  // Получение записей студента
  getMyBookings(token, signal) {
    return apiRequest('/api/booking/my/', {
      token,
      signal,
    })
  },

  // Отмена записи
  cancelBooking(id, token) {
    return apiRequest(
      `/api/booking/${id}/cancel/`,
      {
        method: 'POST',
        token,
      }
    )
  },
}
