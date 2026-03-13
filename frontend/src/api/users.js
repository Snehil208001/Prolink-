import { apiJson } from './client'

/** GET /users/profile - current user (requires auth) */
export async function getProfile() {
  return apiJson('/users/profile')
}

/** GET /users/profile/{userId} - get user profile by ID (requires auth) */
export async function getProfileByUserId(userId) {
  return apiJson(`/users/profile/${userId}`)
}

/** PATCH /users/profile - update profile (bio, headline, location, name) */
export async function updateProfile(data) {
  return apiJson('/users/profile', {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

/** GET /users/network/discover - users to connect with (excludes current user) */
export async function discoverUsers() {
  return apiJson('/users/network/discover')
}
