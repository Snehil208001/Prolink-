/**
 * Chat API - conversations and messages
 */

import { apiJson } from './client'

export async function getConversations() {
  return apiJson('/chat/conversations')
}

export async function getOrCreateConversation(otherUserId) {
  return apiJson(`/chat/conversations?otherUserId=${otherUserId}`, {
    method: 'POST',
  })
}

export async function getMessages(conversationId, limit = 50) {
  return apiJson(`/chat/conversations/${conversationId}/messages?limit=${limit}`)
}

export async function sendMessage(conversationId, content) {
  return apiJson(`/chat/conversations/${conversationId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  })
}

export async function markConversationRead(conversationId) {
  return apiJson(`/chat/conversations/${conversationId}/read`, {
    method: 'POST',
  })
}
