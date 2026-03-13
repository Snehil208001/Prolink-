/**
 * ProLink API client - all requests go through the gateway.
 * Base URL: http://localhost:8080/api/v1
 */

const BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api/v1' : 'http://localhost:8080/api/v1')

function getAuthHeaders() {
  const token = localStorage.getItem('prolink-token')
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}

export async function apiRequest(path, options = {}) {
  const url = `${BASE_URL}${path}`
  const config = {
    ...options,
    headers: { ...getAuthHeaders(), ...options.headers },
  }
  const res = await fetch(url, config)
  if (res.status === 401) {
    localStorage.removeItem('prolink-token')
    localStorage.removeItem('prolink-user')
    window.dispatchEvent(new Event('prolink-unauthorized'))
  }
  return res
}

function parseErrorMessage(text, status) {
  if (!text) return `HTTP ${status || 'error'}`
  try {
    const json = JSON.parse(text)
    return json.message || json.error || json.msg || text
  } catch {
    return text
  }
}

export async function apiJson(path, options = {}) {
  const res = await apiRequest(path, options)
  const text = await res.text()
  if (!res.ok) {
    const err = new Error(parseErrorMessage(text, res.status))
    err.status = res.status
    err.body = text
    throw err
  }
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}
