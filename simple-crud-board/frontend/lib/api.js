// API client functions for CRUD operations

const API_BASE_URL = '/api'

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || data.message || `HTTP ${response.status}`)
  }
  
  return data
}

// Get all posts
export const getPosts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`)
    return await handleResponse(response)
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    throw error
  }
}

// Create a new post
export const createPost = async (content) => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Failed to create post:', error)
    throw error
  }
}

// Update an existing post
export const updatePost = async (id, content) => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Failed to update post:', error)
    throw error
  }
}

// Delete a post
export const deletePost = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'DELETE',
    })
    return await handleResponse(response)
  } catch (error) {
    console.error('Failed to delete post:', error)
    throw error
  }
}