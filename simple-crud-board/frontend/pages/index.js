import { useState, useEffect } from 'react'
import PostList from '../components/PostList'
import PostForm from '../components/PostForm'
import { getPosts } from '../lib/api'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingPost, setEditingPost] = useState(null)

  // Fetch posts from API
  const fetchPosts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getPosts()

      // Handle the "not implemented" response
      if (data.message && data.message.includes('Not implemented')) {
        setPosts([])
        setError('API endpoints are not implemented yet. Please implement the handlers in the backend.')
      } else {
        setPosts(Array.isArray(data) ? data : [])
      }
    } catch (err) {
      setError('Failed to fetch posts: ' + err.message)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handlePostCreated = () => {
    fetchPosts()
  }

  const handlePostUpdated = () => {
    setEditingPost(null)
    fetchPosts()
  }

  const handlePostDeleted = () => {
    fetchPosts()
  }

  const handleEdit = (post) => {
    setEditingPost(post)
  }

  const handleCancelEdit = () => {
    setEditingPost(null)
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Simple CRUD Board</h1>
      <p>A learning project for implementing basic CRUD operations</p>

      {error && (
        <div style={{
          background: '#fee',
          border: '1px solid #fcc',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <PostForm
        post={editingPost}
        onPostCreated={handlePostCreated}
        onPostUpdated={handlePostUpdated}
        onCancel={handleCancelEdit}
      />

      <PostList
        posts={posts}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handlePostDeleted}
      />
    </div>
  )
}