import type { CreateAxiosDefaults } from 'axios'
import axios from 'axios'

// Определяем базовый URL в зависимости от среды выполнения
const getBaseURL = (): string => {
  // Проверяем, выполняется ли код на клиенте
  if (typeof window !== 'undefined') {
    // На клиенте используем относительные URL для обращения к локальным API routes
    return ''
  }
  
  // На сервере используем полный URL к локальному серверу
  // Получаем из переменных окружения или используем значение по умолчанию
  return process.env.API_BASE_URL || 'http://localhost:3000'
}

const options: CreateAxiosDefaults = {
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
}

export const axiosClassic = axios.create(options)
