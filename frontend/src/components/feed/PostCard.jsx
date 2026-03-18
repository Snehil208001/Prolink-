import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Avatar, Button, Input, message } from 'antd'
import { LikeOutlined, LikeFilled, MessageOutlined, RetweetOutlined, SendOutlined } from '@ant-design/icons'
import { likePost, unlikePost, getComments, createComment } from '../../api/posts'
import './PostCard.css'

function getInitials(name) {
  if (!name) return 'U'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function formatTime(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const now = new Date()
  const diff = (now - d) / 1000
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`
  return d.toLocaleDateString()
}

function flattenComments(comments) {
  if (!comments?.length) return []
  return comments.flatMap(c => [c, ...flattenComments(c.replies || [])])
}

export default function PostCard({ post, userNames, onLikeUpdate }) {
  const [isLiked, setIsLiked] = useState(false)
  const [comments, setComments] = useState(undefined)
  const [commentCount, setCommentCount] = useState(0)
  const [commentInput, setCommentInput] = useState('')
  const [loadingComments, setLoadingComments] = useState(false)
  const [postingComment, setPostingComment] = useState(false)

  const authorName = post.userId != null && userNames[post.userId]
    ? userNames[post.userId]
    : (post.userId != null ? `User ${post.userId}` : 'User')
  const authorInitials = post.userId != null && userNames[post.userId]
    ? getInitials(userNames[post.userId])
    : (post.userId != null ? `U${String(post.userId).charAt(0)}` : 'U')

  const flatComments = useMemo(
    () => (comments !== undefined ? flattenComments(comments) : []),
    [comments]
  )

  const handleLike = async () => {
    const nextLiked = !isLiked
    setIsLiked(nextLiked)
    try {
      if (nextLiked) await likePost(post.id)
      else await unlikePost(post.id)
    } catch (err) {
      setIsLiked(!nextLiked)
      message.error(err.message || 'Failed to update like')
    }
  }

  const loadComments = async () => {
    if (comments !== undefined) return
    setLoadingComments(true)
    try {
      const data = await getComments(post.id)
      const flat = flattenComments(data)
      setComments(data ?? [])
      setCommentCount(flat.length)
    } catch {
      setComments([])
    } finally {
      setLoadingComments(false)
    }
  }

  const handleAddComment = async () => {
    const content = commentInput?.trim()
    if (!content) return
    setPostingComment(true)
    try {
      await createComment(post.id, content)
      setCommentInput('')
      const data = await getComments(post.id)
      const flat = flattenComments(data)
      setComments(data ?? [])
      setCommentCount(flat.length)
      message.success('Comment added')
    } catch (err) {
      message.error(err.message || 'Failed to add comment')
    } finally {
      setPostingComment(false)
    }
  }

  const showComments = comments !== undefined

  return (
    <div className="feed-post">
      <div className="post-header">
        <Link
          to={post.userId ? `/profile/${post.userId}` : '#'}
          style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: 'inherit' }}
        >
          <Avatar size={48} style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 600 }}>
            {authorInitials}
          </Avatar>
          <div className="post-meta">
            <div className="post-author">{authorName}</div>
            <div className="post-time">{formatTime(post.createdAt)}</div>
          </div>
        </Link>
      </div>
      <div className="post-content">{post.content}</div>
      <div className="post-actions">
        <Button
          type="text"
          icon={isLiked ? <LikeFilled /> : <LikeOutlined />}
          className={`post-action-btn ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          Like
        </Button>
        <Button
          type="text"
          icon={<MessageOutlined />}
          className="post-action-btn"
          onClick={loadComments}
          loading={loadingComments}
        >
          Comment{commentCount ? ` (${commentCount})` : ''}
        </Button>
        <Button type="text" icon={<RetweetOutlined />} className="post-action-btn">
          Repost
        </Button>
        <Button type="text" icon={<SendOutlined />} className="post-action-btn">
          Send
        </Button>
      </div>

      {showComments && (
        <div className="post-comments">
          {flatComments.map((c) => (
            <div key={c.id} className="comment-item">
              <div>
                <Link to={c.userId ? `/profile/${c.userId}` : '#'} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="comment-author">
                    {userNames[c.userId] || (c.userId != null ? `User ${c.userId}` : 'User')}
                  </div>
                </Link>
                <div className="comment-content">{c.content}</div>
                <div className="comment-time">{formatTime(c.createdAt)}</div>
              </div>
            </div>
          ))}
          <div className="comment-input-row">
            <Input
              placeholder="Write a comment..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              onPressEnter={() => handleAddComment()}
              style={{ flex: 1 }}
            />
            <Button type="primary" size="small" onClick={handleAddComment} loading={postingComment}>
              Post
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
