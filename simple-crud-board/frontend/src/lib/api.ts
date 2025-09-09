import axios from 'axios'
import type { Post, CreatePostRequest, UpdatePostRequest } from '@/types/post'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export const postsApi = {
  // Get all posts
  getPosts: async (): Promise<Post[]> => {
    try {
      const response = await api.get('/api/posts')
      const data = response.data
      if (Array.isArray(data)) {
        return data
      }
      if (data && Array.isArray(data.posts)) {
        return data.posts
      }
      return []
    } catch (error) {
      console.error('Failed to fetch posts:', error)
      throw new Error('投稿の取得に失敗しました')
    }
  },

  // Create a new post
  createPost: async (data: CreatePostRequest): Promise<Post> => {
    try {
      const response = await api.post('/api/posts', data)
      return response.data
    } catch (error) {
      console.error('Failed to create post:', error)
      throw new Error('投稿の作成に失敗しました')
    }
  },

  // Update a post
  updatePost: async (id: number, data: UpdatePostRequest): Promise<Post> => {
    try {
      const response = await api.put(`/api/posts/${id}`, data)
      return response.data
    } catch (error) {
      console.error('Failed to update post:', error)
      throw new Error('投稿の更新に失敗しました')
    }
  },

  // Delete a post
  deletePost: async (id: number): Promise<void> => {
    try {
      await api.delete(`/api/posts/${id}`)
    } catch (error) {
      console.error('Failed to delete post:', error)
      throw new Error('投稿の削除に失敗しました')
    }
  },
}

export default api