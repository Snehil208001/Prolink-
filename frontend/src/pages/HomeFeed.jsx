import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { Avatar, Input, Button, message, Spin } from 'antd'
import {
  LikeOutlined,
  LikeFilled,
  MessageOutlined,
  RetweetOutlined,
  SendOutlined,
  PictureOutlined,
  FileTextOutlined,
  VideoCameraOutlined
} from '@ant-design/icons'
import {
  getFeed,
  createPost,
  likePost,
  unlikePost,
  getComments,
  createComment
} from '../api/posts'
import { discoverUsers } from '../api/users'
import './HomeFeed.css'

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

function HomeFeed() {
  const { theme } = useTheme()
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)
  const [composeText, setComposeText] = useState('')
  const [likedIds, setLikedIds] = useState(new Set())
  const [commentCounts, setCommentCounts] = useState({})
  const [expandedComments, setExpandedComments] = useState({})
  const [commentInputs, setCommentInputs] = useState({})
  const [userNames, setUserNames] = useState({})

  /** Flatten nested comment tree (roots + replies) for count and display */
  const flattenComments = (comments) => {
    if (!comments?.length) return []
    return comments.flatMap(c => [c, ...flattenComments(c.replies || [])])
  }

  const loadFeed = async () => {
    setLoading(true)
    try {
      const [data, discover] = await Promise.all([
        getFeed(),
        discoverUsers().catch(() => [])
      ])
      const postList = Array.isArray(data) ? data : []
      const names = {}
      if (user?.id && user?.name) names[user.id] = user.name
      ;(discover || []).forEach(u => { if (u?.id && u?.name) names[u.id] = u.name })
      setUserNames(names)
      setPosts(postList)
      // Pre-fetch comment counts so they persist after refresh
      const counts = {}
      await Promise.all(
        postList.map(async (p) => {
          try {
            const comments = await getComments(p.id)
            const flat = flattenComments(comments)
            counts[p.id] = flat.length
          } catch {
            counts[p.id] = 0
          }
        })
      )
      setCommentCounts(counts)
    } catch (err) {
      message.error(err.body || err.message || 'Failed to load feed')
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFeed()
  }, [])

  const handleCreatePost = async () => {
    const content = composeText?.trim()
    if (!content) return
    setPosting(true)
    try {
      await createPost(content)
      setComposeText('')
      message.success('Post created')
      loadFeed()
    } catch (err) {
      message.error(err.body || err.message || 'Failed to create post')
    } finally {
      setPosting(false)
    }
  }

  const handleLike = async (postId) => {
    const isLiked = likedIds.has(postId)
    setLikedIds(prev => {
      const next = new Set(prev)
      if (isLiked) next.delete(postId)
      else next.add(postId)
      return next
    })
    try {
      if (isLiked) await unlikePost(postId)
      else await likePost(postId)
    } catch (err) {
      setLikedIds(prev => {
        const next = new Set(prev)
        if (isLiked) next.add(postId)
        else next.delete(postId)
        return next
      })
      message.error(err.body || err.message || 'Failed to update like')
    }
  }

  const loadComments = async (postId) => {
    if (expandedComments[postId]) return
    try {
      const comments = await getComments(postId)
      const flat = flattenComments(comments)
      setCommentCounts(prev => ({ ...prev, [postId]: flat.length }))
      setExpandedComments(prev => ({ ...prev, [postId]: comments ?? [] }))
    } catch {
      setExpandedComments(prev => ({ ...prev, [postId]: [] }))
    }
  }

  const handleAddComment = async (postId) => {
    const content = commentInputs[postId]?.trim()
    if (!content) return
    try {
      await createComment(postId, content)
      setCommentInputs(prev => ({ ...prev, [postId]: '' }))
      const comments = await getComments(postId)
      const flat = flattenComments(comments)
      setExpandedComments(prev => ({ ...prev, [postId]: comments ?? [] }))
      setCommentCounts(prev => ({ ...prev, [postId]: flat.length }))
      message.success('Comment added')
    } catch (err) {
      message.error(err.body || err.message || 'Failed to add comment')
    }
  }

  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'

  if (loading) {
    return (
      <div className="home-feed" style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div className="home-feed">
      {/* LinkedIn-style post composer */}
      <div className="feed-compose">
        <div className="compose-inner">
          <Avatar size={48} style={{ backgroundColor: 'var(--primary)' }}>{initials}</Avatar>
          <div className="compose-input-wrap">
            <input
              className="compose-input"
              type="text"
              placeholder={`Start a post, ${user?.name || 'there'}...`}
              value={composeText}
              onChange={e => setComposeText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleCreatePost() } }}
            />
            <div className="compose-actions">
              <button type="button" className="compose-btn" title="Photo">
                <PictureOutlined style={{ fontSize: 20 }} />
                <span>Photo</span>
              </button>
              <button type="button" className="compose-btn" title="Video">
                <VideoCameraOutlined style={{ fontSize: 20 }} />
                <span>Video</span>
              </button>
              <button type="button" className="compose-btn" title="Document">
                <FileTextOutlined style={{ fontSize: 20 }} />
                <span>Document</span>
              </button>
              <button
                type="button"
                className="compose-btn post-btn"
                onClick={handleCreatePost}
                disabled={!composeText?.trim() || posting}
              >
                {posting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feed posts */}
      {posts.map((post) => {
        const authorName = (post.userId != null && userNames[post.userId]) ? userNames[post.userId] : (post.userId != null ? `User ${post.userId}` : 'User')
        const authorInitials = (post.userId != null && userNames[post.userId]) ? getInitials(userNames[post.userId]) : (post.userId != null ? `U${String(post.userId).charAt(0)}` : 'U')
        const isLiked = likedIds.has(post.id)
        const commentCount = commentCounts[post.id] ?? 0
        const comments = expandedComments[post.id]
        const showComments = comments !== undefined

        return (
          <div key={post.id} className="feed-post">
            <div className="post-header">
              <Link to={post.userId ? `/profile/${post.userId}` : '#'} style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: 'inherit' }}>
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
              <button
                type="button"
                className={`post-action-btn ${isLiked ? 'liked' : ''}`}
                onClick={() => handleLike(post.id)}
              >
                {isLiked ? <LikeFilled /> : <LikeOutlined />}
                <span>Like</span>
              </button>
              <button
                type="button"
                className="post-action-btn"
                onClick={() => loadComments(post.id)}
              >
                <MessageOutlined />
                <span>Comment{commentCount ? ` (${commentCount})` : ''}</span>
              </button>
              <button type="button" className="post-action-btn">
                <RetweetOutlined />
                <span>Repost</span>
              </button>
              <button type="button" className="post-action-btn">
                <SendOutlined />
                <span>Send</span>
              </button>
            </div>

            {showComments && (
              <div className="post-comments">
                {flattenComments(comments)?.map(c => (
                  <div key={c.id} className="comment-item">
                    <div>
                      <Link to={c.userId ? `/profile/${c.userId}` : '#'} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="comment-author">{userNames[c.userId] || (c.userId != null ? `User ${c.userId}` : 'User')}</div>
                      </Link>
                      <div className="comment-content">{c.content}</div>
                      <div className="comment-time">{formatTime(c.createdAt)}</div>
                    </div>
                  </div>
                ))}
                <div className="comment-input-row">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentInputs[post.id] || ''}
                    onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                    onKeyDown={e => { if (e.key === 'Enter') handleAddComment(post.id) }}
                  />
                  <Button type="primary" size="small" onClick={() => handleAddComment(post.id)}>
                    Post
                  </Button>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default HomeFeed
