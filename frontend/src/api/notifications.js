import { apiJson, apiRequest } from './client'

/** GET /notifications - list notifications for current user */
export async function getNotifications() {
  return apiJson('/notifications')
}

/** GET /notifications/unread-count */
export async function getUnreadCount() {
  return apiJson('/notifications/unread-count')
}

/** PATCH /notifications/{id}/read */
export async function markNotificationAsRead(id) {
  return apiJson(`/notifications/${id}/read`, { method: 'PATCH' })
}
