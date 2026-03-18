import { apiJson, apiRequest } from './client'

/** GET /posts/core/feed */
export async function getFeed() {
  return apiJson('/posts/core/feed')
}

/** POST /posts/core - create post */
export async function createPost(content) {
  return apiJson('/posts/core', {
    method: 'POST',
    body: JSON.stringify({ content }),
  })
}

/** GET /posts/core/{postId} */
export async function getPost(postId) {
  return apiJson(`/posts/core/${postId}`)
}

/** GET /posts/core/users/{userId}/allPosts */
export async function getPostsByUser(userId) {
  return apiJson(`/posts/core/users/${userId}/allPosts`)
}

/** POST /posts/likes/{postId} */
export async function likePost(postId) {
  await apiRequest(`/posts/likes/${postId}`, { method: 'POST' })
}

/** DELETE /posts/likes/{postId} */
export async function unlikePost(postId) {
  await apiRequest(`/posts/likes/${postId}`, { method: 'DELETE' })
}

/** POST /posts/comments/posts/{postId} */
export async function createComment(postId, content, parentId = null) {
  return apiJson(`/posts/comments/posts/${postId}`, {
    method: 'POST',
    body: JSON.stringify({ content, parentId }),
  })
}

/** GET /posts/comments/posts/{postId} */
export async function getComments(postId) {
  return apiJson(`/posts/comments/posts/${postId}`)
}
