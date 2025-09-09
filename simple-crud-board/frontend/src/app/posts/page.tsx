'use client'

import { useState, useEffect } from 'react'
import { PostList } from '@/components/posts/PostList'
import { CreatePostForm } from '@/components/posts/CreatePostForm'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { usePosts } from '@/hooks/usePosts'

export default function PostsPage() {
  const { posts, loading, error, createPost, updatePost, deletePost, refreshPosts } = usePosts()
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    refreshPosts()
  }, [refreshPosts])

  const handleCreatePost = async (content: string) => {
    try {
      await createPost(content)
      setShowCreateForm(false)
    } catch (error) {
      console.error('Failed to create post:', error)
    }
  }

  const handleUpdatePost = async (id: number, content: string) => {
    try {
      await updatePost(id, content)
    } catch (error) {
      console.error('Failed to update post:', error)
    }
  }

  const handleDeletePost = async (id: number) => {
    if (window.confirm('この投稿を削除しますか？')) {
      try {
        await deletePost(id)
      } catch (error) {
        console.error('Failed to delete post:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <ErrorMessage message={error} />
        <button
          onClick={refreshPosts}
          className="btn btn-primary mt-4"
        >
          再試行
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">投稿一覧</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="btn btn-primary"
        >
          {showCreateForm ? 'キャンセル' : '新規投稿'}
        </button>
      </div>

      {showCreateForm && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">新規投稿</h3>
          <CreatePostForm
            onSubmit={handleCreatePost}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      )}

      <PostList
        posts={posts}
        onUpdate={handleUpdatePost}
        onDelete={handleDeletePost}
      />

      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">まだ投稿がありません</p>
          <p className="text-gray-400 mt-2">最初の投稿を作成してみましょう！</p>
        </div>
      )}
    </div>
  )
}


