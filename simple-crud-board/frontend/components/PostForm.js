import { useState, useEffect } from 'react'
import { createPost, updatePost } from '../lib/api'

export default function PostForm({ post, onPostCreated, onPostUpdated, onCancel }) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const isEditing = !!post

  useEffect(() => {
    if (post) {
      setContent(post.content)
    } else {
      setContent('')
    }
    setError(null)
  }, [post])

  const validateContent = (content) => {
    const trimmed = content.trim()
    
    if (!trimmed) {
      return 'Post content cannot be empty'
    }
    
    if (trimmed.length < 3) {
      return 'Post content must be at least 3 characters long'
    }
    
    if (trimmed.length > 1000) {
      return 'Post content cannot exceed 1000 characters'
    }
    
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validationError = validateContent(content)
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    setError(null)

    try {
      if (isEditing) {
        await updatePost(post.id, content.trim())
        onPostUpdated()
      } else {
        await createPost(content.trim())
        onPostCreated()
      }
      setContent('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setContent('')
    setError(null)
    if (onCancel) {
      onCancel()
    }
  }

  return (
    <div style={{ 
      background: '#f8f9fa', 
      padding: '20px', 
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h3>{isEditing ? 'Edit Post' : 'Create New Post'}</h3>
      
      {error && (
        <div style={{ 
          background: '#fee', 
          border: '1px solid #fcc', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '15px'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value)
              // Clear error when user starts typing
              if (error) setError(null)
            }}
            placeholder="What's on your mind? (3-1000 characters)"
            rows={4}
            style={{
              width: '100%',
              padding: '10px',
              border: error ? '1px solid #dc3545' : '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              resize: 'vertical'
            }}
            disabled={loading}
          />
          <div style={{ 
            fontSize: '0.8em', 
            color: '#666', 
            textAlign: 'right',
            marginTop: '5px'
          }}>
            {content.length}/1000 characters
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="submit" 
            disabled={loading || !content.trim() || validateContent(content)}
            style={{
              padding: '10px 20px',
              background: (loading || !content.trim() || validateContent(content)) ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: (loading || !content.trim() || validateContent(content)) ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Saving...' : (isEditing ? 'Update Post' : 'Create Post')}
          </button>
          
          {isEditing && (
            <button 
              type="button"
              onClick={handleCancel}
              disabled={loading}
              style={{
                padding: '10px 20px',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}