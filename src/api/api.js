import axios from 'axios'
import ROUTES from './routes.js'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

api.interceptors.response.use(
  (response) => {
    if (response.data?.success === false) {
      return Promise.reject(new Error(response.data.message || 'Request failed'))
    }
    return response.data
  },
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

export const fetchUsers = () => api.get(ROUTES.users)

export const createUser = (name) => api.post(ROUTES.users, { name })

export const createEvent = (data) => api.post(ROUTES.events, data)

export const fetchEventsByMember = (userId) => api.get(ROUTES.eventsByMember(userId))

export const updateEvent = (eventId, data) => api.patch(ROUTES.eventById(eventId), data)

export const fetchEventLogs = (eventId) => api.get(ROUTES.eventLogs(eventId))
