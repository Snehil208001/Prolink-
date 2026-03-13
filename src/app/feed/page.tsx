'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { useAuth } from '@/context/AuthContext'
import { Heart, MessageCircle, Share2, Send } from 'lucide-react'

export default function FeedPage() {
  const { token } = useAuth()
  const router = useRouter()
  const [posts, setPosts] = useState<any[]>([
    {
      id: 1,
      author: 'John Doe',
      avatar: '👨‍💼',
      content: 'Just launched a new project! Excited to share my learning journey with everyone.',
      timestamp: '2 hours ago',
      likes: 245,
      comments: 12,
      shares: 8,
      liked: false,
    },
    {
      id: 2,
      author: 'Jane Smith',
      avatar: '👩‍💻',
      content: 'Tips for productive remote work: 1) Set boundaries 2) Take regular breaks 3) Stay connected with your team',
      timestamp: '4 hours ago',
      likes: 532,
      comments: 47,
      shares: 89,
      liked: false,
    },
  ])
  const [newPost, setNewPost] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  React.useEffect(() => {
    if (!token) {
      router.push('/login')
    }
  }, [token, router])

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPost.trim()) return

    setIsSubmitting(true)
    try {
      // In a real app, this would call the API
      const post = {
        id: posts.length + 1,
        author: 'You',
        avatar: '👤',
        content: newPost,
        timestamp: 'now',
        likes: 0,
        comments: 0,
        shares: 0,
        liked: false,
      }
      setPosts([post, ...posts])
      setNewPost('')
    } catch (error) {
      console.error('Error posting:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleLike = (postId: number) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    )
  }

  if (!token) return null

  return (
    <>
      <Header />
      <div className="container-custom max-w-2xl mx-auto px-4 py-8">
        {/* Compose Post */}
        <div className="card p-6 mb-6">
          <form onSubmit={handlePostSubmit} className="space-y-4">
            <div className="flex gap-4">
              <div className="text-3xl">👤</div>
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's on your mind?"
                className="flex-1 input-field resize-none min-h-24"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !newPost.trim()}
                className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send size={18} />
                Post
              </button>
            </div>
          </form>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="card p-6 hover:shadow-md transition-shadow">
              <div className="flex gap-4 mb-4">
                <div className="text-3xl">{post.avatar}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{post.author}</h3>
                  <p className="text-sm text-gray-500">{post.timestamp}</p>
                </div>
              </div>

              <p className="text-gray-800 mb-4 leading-relaxed">{post.content}</p>

              <div className="flex justify-between text-gray-600 border-t border-gray-200 pt-4">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    post.liked ? 'text-red-600 bg-red-50' : 'hover:bg-gray-100'
                  }`}
                >
                  <Heart size={18} fill={post.liked ? 'currentColor' : 'none'} />
                  <span>{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <MessageCircle size={18} />
                  <span>{post.comments}</span>
                </button>
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <Share2 size={18} />
                  <span>{post.shares}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
