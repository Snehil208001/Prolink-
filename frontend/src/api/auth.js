import { apiJson, apiRequest } from './client'

/** POST /users/auth/signup */
export async function signup({ name, email, password }) {
  return apiJson('/users/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })
}

/** POST /users/auth/login - returns JWT string */
export async function login({ email, password }) {
  return apiJson('/users/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}
