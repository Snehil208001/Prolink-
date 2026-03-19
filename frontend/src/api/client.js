/**
 * ProLink API client - Axios-based with interceptors.
 * Base URL: http://localhost:8080/api/v1
 */

import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api/v1' : 'http://localhost:8080/api/v1')

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  timeout: 30000,
})

// Callback for 401 - set by AuthContext so we stay in React ecosystem
let onUnauthorized = null
export function setOnUnauthorized(callback) {
  onUnauthorized = callback
}

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('prolink-token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (err) => {
    if (err.response?.status === 401 && onUnauthorized) {
      onUnauthorized()
    }
    const msg = err.message === 'Network Error'
      ? 'Unable to connect. Ensure the API gateway (port 8080) and backend services are running.'
      : err.response?.data?.message || err.response?.data?.error || err.message
    const error = new Error(msg)
    error.status = err.response?.status
    error.body = err.response?.data
    throw error
  }
)

function parseErrorMessage(data, status) {
  if (!data) return `HTTP ${status || 'error'}`
  if (typeof data === 'string') return data
  return data.message || data.error || data.msg || JSON.stringify(data)
}

export async function apiRequest(path, options = {}) {
  const { body, ...rest } = options
  const res = await apiClient.request({
    url: path,
    data: body,
    ...rest,
    headers: { ...options.headers },
  })
  return { ok: true, status: res.status, data: res.data }
}

export async function apiJson(path, options = {}) {
  const { body, ...rest } = options
  const config = { url: path, ...rest, headers: { ...options.headers } }
  if (body) config.data = typeof body === 'string' ? JSON.parse(body) : body
  const res = await apiClient.request(config)
  return res.data
}
