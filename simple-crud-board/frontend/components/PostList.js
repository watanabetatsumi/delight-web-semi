import PostItem from './PostItem'

export default function PostList({ posts, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <p>Loading posts...</p>
      </div>
    )
  }

  if (!posts || posts.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px',
        background: '#f9f9f9',
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h3>No posts yet</h3>
        <p>Be the first to create a post!</p>
      </div>
    )
  }

  return (
    <div>
      <h2>Posts ({posts.length})</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {posts.map(post => (
          <PostItem 
            key={post.id} 
            post={post} 
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  )
}