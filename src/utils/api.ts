import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authApi = {
  signup: (data: { name: string; email: string; password: string }) =>
    api.post('/users/auth/signup', data),
  login: (data: { email: string; password: string }) =>
    api.post('/users/auth/login', data),
  getProfile: () => api.get('/users/profile'),
}

export const postsApi = {
  create: (data: { content: string }) => api.post('/posts/core', data),
  getPost: (postId: number) => api.get(`/posts/core/${postId}`),
  getUserPosts: (userId: number) => api.get(`/posts/core/users/${userId}/allPosts`),
  like: (postId: number) => api.post(`/posts/likes/${postId}`),
  unlike: (postId: number) => api.delete(`/posts/likes/${postId}`),
}

export const commentsApi = {
  create: (postId: number, data: { content: string; parentId?: number | null }) =>
    api.post(`/posts/comments/posts/${postId}`, data),
  getComments: (postId: number) => api.get(`/posts/comments/posts/${postId}`),
}

export const connectionsApi = {
  getFirstDegree: (userId: number) => api.get(`/connections/core/${userId}/first-degree`),
}

export default api
