// ホームページコンポーネント
//
// 🎯 学習ポイント:
// - Next.js App Routerでのページコンポーネント
// - クライアントサイドでのAPI呼び出し
// - React HooksとState管理

'use client'

import { useState, useEffect } from 'react'
import { PostList } from '@/components/PostList'
import { PostForm } from '@/components/PostForm'
import { apiClient } from '@/lib/api'
import type { Post } from '@/types/post'

export default function HomePage() {
  // TODO: 状態管理の設定
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // TODO: 投稿一覧の取得
  const fetchPosts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // TODO: API呼び出しを実装
      // ヒント: apiClient.getPosts()を使用
      const fetchedPosts = await apiClient.getPosts()
      setPosts(fetchedPosts)
    } catch (err) {
      console.error('Failed to fetch posts:', err)
      setError('投稿の取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  // TODO: 投稿作成のハンドラー
  const handleCreatePost = async (content: string) => {
    try {
      // TODO: 投稿作成API呼び出し
      const newPost = await apiClient.createPost(content)
      
      // TODO: 状態を更新（新しい投稿を先頭に追加）
      setPosts(prevPosts => [newPost, ...prevPosts])
      
      return true // 成功を示す
    } catch (err) {
      console.error('Failed to create post:', err)
      setError('投稿の作成に失敗しました')
      return false // 失敗を示す
    }
  }

  // TODO: 投稿更新のハンドラー
  const handleUpdatePost = async (id: string, content: string) => {
    try {
      // TODO: 投稿更新API呼び出し
      const updatedPost = await apiClient.updatePost(id, content)
      
      // TODO: 状態を更新
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === id ? updatedPost : post
        )
      )
      
      return true
    } catch (err) {
      console.error('Failed to update post:', err)
      setError('投稿の更新に失敗しました')
      return false
    }
  }

  // TODO: 投稿削除のハンドラー
  const handleDeletePost = async (id: string) => {
    try {
      // TODO: 投稿削除API呼び出し
      await apiClient.deletePost(id)
      
      // TODO: 状態を更新（該当投稿を除去）
      setPosts(prevPosts => prevPosts.filter(post => post.id !== id))
      
      return true
    } catch (err) {
      console.error('Failed to delete post:', err)
      setError('投稿の削除に失敗しました')
      return false
    }
  }

  // TODO: コンポーネントマウント時に投稿を取得
  useEffect(() => {
    fetchPosts()
  }, [])

  return (
    <div className="space-y-8">
      {/* TODO: ページタイトル */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          掲示板
        </h2>
        <p className="text-gray-600">
          自由に投稿してください
        </p>
      </div>

      {/* TODO: エラー表示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                エラーが発生しました
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => {
                    setError(null)
                    fetchPosts()
                  }}
                  className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                >
                  再試行
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TODO: 投稿フォーム */}
      <PostForm onSubmit={handleCreatePost} />

      {/* TODO: ローディング表示 */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">読み込み中...</p>
        </div>
      ) : (
        /* TODO: 投稿一覧 */
        <PostList
          posts={posts}
          onUpdate={handleUpdatePost}
          onDelete={handleDeletePost}
        />
      )}

      {/* TODO: 投稿が0件の場合の表示 */}
      {!loading && posts.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            まだ投稿がありません
          </p>
          <p className="text-gray-400 mt-2">
            最初の投稿をしてみましょう！
          </p>
        </div>
      )}
    </div>
  )
}