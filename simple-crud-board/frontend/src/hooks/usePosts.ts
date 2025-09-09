import { useState, useCallback } from 'react'
import { postsApi } from '@/lib/api'
import type { Post } from '@/types/post'

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refreshPosts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const fetchedPosts = await postsApi.getPosts()
      setPosts(fetchedPosts)
    } catch (err) {
      setError(err instanceof Error ? err.message : '投稿の取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }, [])

  const createPost = useCallback(async (content: string) => {
    setError(null)
    try {
      const newPost = await postsApi.createPost({ content })
      setPosts(prevPosts => [newPost, ...prevPosts])
      return newPost
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '投稿の作成に失敗しました'
      setError(errorMessage)
      throw err
    }
  }, [])

  const updatePost = useCallback(async (id: number, content: string) => {
    setError(null)
    try {
      const updatedPost = await postsApi.updatePost(id, { content })
      setPosts(prevPosts =>
        prevPosts.map(post => post.id === id ? updatedPost : post)
      )
      return updatedPost
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '投稿の更新に失敗しました'
      setError(errorMessage)
      throw err
    }
  }, [])

  const deletePost = useCallback(async (id: number) => {
    setError(null)
    try {
      await postsApi.deletePost(id)
      setPosts(prevPosts => prevPosts.filter(post => post.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '投稿の削除に失敗しました'
      setError(errorMessage)
      throw err
    }
  }, [])

  return {
    posts,
    loading,
    error,
    refreshPosts,
    createPost,
    updatePost,
    deletePost,
  }
}