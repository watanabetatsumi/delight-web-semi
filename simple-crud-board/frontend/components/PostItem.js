import { deletePost } from '../lib/api'

export default function PostItem({ post, onEdit, onDelete }) {
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return
    }

    try {
      await deletePost(post.id)
      onDelete()
    } catch (error) {
      alert('Failed to delete post: ' + error.message)
    }
  }

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString()
    } catch {
      return dateString
    }
  }

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '15px',
      background: 'white'
    }}>
      <div style={{ marginBottom: '10px' }}>
        <p style={{ margin: '0 0 10px 0', lineHeight: '1.5' }}>
          {post.content}
        </p>
        <div style={{ 
          fontSize: '0.9em', 
          color: '#666',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>
            Created: {formatDate(post.created_at)}
            {post.updated_at !== post.created_at && (
              <span> • Updated: {formatDate(post.updated_at)}</span>
            )}
          </span>
          <span>ID: {post.id}</span>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={() => onEdit(post)}
          style={{
            padding: '5px 10px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Edit
        </button>
        <button 
          onClick={handleDelete}
          style={{
            padding: '5px 10px',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Delete
        </button>
      </div>
    </div>
  )
}