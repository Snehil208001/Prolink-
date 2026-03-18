import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import { getFeed, createPost } from '../api/posts'
import { discoverUsers } from '../api/users'
import ComposePost from '../components/feed/ComposePost'
import PostCard from '../components/feed/PostCard'
import { message, Spin } from 'antd'
import './HomeFeed.css'

function HomeFeed() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ['feed'],
    queryFn: getFeed,
    select: (data) => (Array.isArray(data) ? data : []),
  })

  const { data: discover = [] } = useQuery({
    queryKey: ['discover'],
    queryFn: discoverUsers,
    select: (data) => (Array.isArray(data) ? data : []),
  })

  const userNames = { ...Object.fromEntries((discover || []).map(u => [u?.id, u?.name]).filter(([id]) => id)), ...(user?.id && user?.name ? { [user.id]: user.name } : {}) }

  const createPostMutation = useMutation({
    mutationFn: (content) => createPost(content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] })
      message.success('Post created')
    },
    onError: (err) => {
      message.error(err.message || 'Failed to create post')
    },
  })

  const handleCreatePost = (content) => {
    if (!content?.trim()) return
    createPostMutation.mutate(content.trim())
  }

  useEffect(() => {
    if (error) message.error(error.message || 'Failed to load feed')
  }, [error])

  if (isLoading) {
    return (
      <div className="home-feed" style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div className="home-feed">
      <ComposePost
        user={user}
        onSubmit={handleCreatePost}
        posting={createPostMutation.isPending}
      />
      {posts.map((post) => (
        <PostCard key={post.id} post={post} userNames={userNames} />
      ))}
    </div>
  )
}

export default HomeFeed
