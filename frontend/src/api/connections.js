import { apiJson, apiRequest } from './client'

/** GET /connections/core/{userId}/first-degree - from Neo4j */
export async function getFirstDegreeConnections(userId) {
  return apiJson(`/connections/core/${userId}/first-degree`)
}

/** GET /connections/core/{userId}/connections - from PostgreSQL (source of truth) */
export async function getConnections(userId) {
  return apiJson(`/connections/core/${userId}/connections`)
}

/** POST /connections/request/{receiverId} */
export async function sendConnectionRequest(receiverId) {
  return apiJson(`/connections/request/${receiverId}`, { method: 'POST' })
}

/** POST /connections/accept/{requestId} */
export async function acceptConnectionRequest(requestId) {
  return apiJson(`/connections/accept/${requestId}`, { method: 'POST' })
}

/** POST /connections/reject/{requestId} */
export async function rejectConnectionRequest(requestId) {
  return apiJson(`/connections/reject/${requestId}`, { method: 'POST' })
}

/** DELETE /connections/remove/{userId} */
export async function removeConnection(userId) {
  await apiRequest(`/connections/remove/${userId}`, { method: 'DELETE' })
}

/** GET /connections/requests/received */
export async function getReceivedRequests() {
  return apiJson('/connections/requests/received')
}

/** GET /connections/requests/sent */
export async function getSentRequests() {
  return apiJson('/connections/requests/sent')
}
