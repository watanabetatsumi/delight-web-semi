// API クライアント
//
// 🎯 学習ポイント:
// - Axiosを使用したHTTPクライアント実装
// - 環境変数を使用したAPI URL設定
// - エラーハンドリングとレスポンス型定義

import axios, { AxiosInstance, AxiosError } from 'axios'
import type { Post, CreatePostRequest, UpdatePostRequest } from '@/types/post'

// TODO: APIクライアントクラスの定義
class ApiClient {
  private client: AxiosInstance

  constructor() {
    // TODO: Axiosインスタンスの作成
    this.client = axios.create({
      // TODO: ベースURLを環境変数から設定
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'TODO: デフォルトAPI URL',
      
      // TODO: デフォルトヘッダーの設定
      headers: {
        'Content-Type': 'application/json',
      },
      
      // TODO: タイムアウト設定
      timeout: 10000, // 10秒
    })

    // TODO: リクエストインターセプターの設定
    this.client.interceptors.request.use(
      (config) => {
        // リクエスト前の処理（ログ出力など）
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
        return config
      },
      (error) => {
        console.error('Request interceptor error:', error)
        return Promise.reject(error)
      }
    )

    // TODO: レスポンスインターセプターの設定
    this.client.interceptors.response.use(
      (response) => {
        // レスポンス成功時の処理
        console.log(`API Response: ${response.status} ${response.config.url}`)
        return response
      },
      (error: AxiosError) => {
        // レスポンスエラー時の処理
        this.handleApiError(error)
        return Promise.reject(error)
      }
    )
  }

  // TODO: APIエラーハンドリング
  private handleApiError(error: AxiosError): void {
    if (error.response) {
      // サーバーからエラーレスポンスが返された場合
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
      })
    } else if (error.request) {
      // リクエストが送信されたがレスポンスがない場合
      console.error('API No Response:', error.request)
    } else {
      // その他のエラー
      console.error('API Error:', error.message)
    }
  }

  // TODO: 全投稿取得
  async getPosts(): Promise<Post[]> {
    try {
      const response = await this.client.get<{ posts: Post[] }>('/api/posts')
      
      // TODO: レスポンスデータの検証
      if (!response.data || !Array.isArray(response.data.posts)) {
        throw new Error('Invalid response format')
      }
      
      return response.data.posts
    } catch (error) {
      console.error('Failed to get posts:', error)
      throw new Error('投稿の取得に失敗しました')
    }
  }

  // TODO: 投稿作成
  async createPost(content: string): Promise<Post> {
    try {
      // TODO: リクエストデータの検証
      if (!content || content.trim().length === 0) {
        throw new Error('投稿内容が空です')
      }

      const requestData: CreatePostRequest = {
        content: content.trim(),
      }

      const response = await this.client.post<{ post: Post }>('/api/posts', requestData)
      
      // TODO: レスポンスデータの検証
      if (!response.data || !response.data.post) {
        throw new Error('Invalid response format')
      }
      
      return response.data.post
    } catch (error) {
      console.error('Failed to create post:', error)
      
      // TODO: エラーメッセージの詳細化
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data?.message || error.response.data?.error
        if (errorMessage) {
          throw new Error(errorMessage)
        }
      }
      
      throw new Error('投稿の作成に失敗しました')
    }
  }

  // TODO: 投稿更新
  async updatePost(id: string, content: string): Promise<Post> {
    try {
      // TODO: パラメータの検証
      if (!id || !content || content.trim().length === 0) {
        throw new Error('無効なパラメータです')
      }

      const requestData: UpdatePostRequest = {
        content: content.trim(),
      }

      const response = await this.client.put<{ post: Post }>(`/api/posts/${id}`, requestData)
      
      // TODO: レスポンスデータの検証
      if (!response.data || !response.data.post) {
        throw new Error('Invalid response format')
      }
      
      return response.data.post
    } catch (error) {
      console.error('Failed to update post:', error)
      
      // TODO: エラーメッセージの詳細化
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 404) {
          throw new Error('投稿が見つかりません')
        }
        
        const errorMessage = error.response.data?.message || error.response.data?.error
        if (errorMessage) {
          throw new Error(errorMessage)
        }
      }
      
      throw new Error('投稿の更新に失敗しました')
    }
  }

  // TODO: 投稿削除
  async deletePost(id: string): Promise<void> {
    try {
      // TODO: パラメータの検証
      if (!id) {
        throw new Error('投稿IDが指定されていません')
      }

      await this.client.delete(`/api/posts/${id}`)
    } catch (error) {
      console.error('Failed to delete post:', error)
      
      // TODO: エラーメッセージの詳細化
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 404) {
          throw new Error('投稿が見つかりません')
        }
        
        const errorMessage = error.response.data?.message || error.response.data?.error
        if (errorMessage) {
          throw new Error(errorMessage)
        }
      }
      
      throw new Error('投稿の削除に失敗しました')
    }
  }

  // TODO: 単一投稿取得（オプション）
  async getPost(id: string): Promise<Post> {
    try {
      if (!id) {
        throw new Error('投稿IDが指定されていません')
      }

      const response = await this.client.get<{ post: Post }>(`/api/posts/${id}`)
      
      if (!response.data || !response.data.post) {
        throw new Error('Invalid response format')
      }
      
      return response.data.post
    } catch (error) {
      console.error('Failed to get post:', error)
      
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 404) {
          throw new Error('投稿が見つかりません')
        }
      }
      
      throw new Error('投稿の取得に失敗しました')
    }
  }

  // TODO: ヘルスチェック
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/health')
      return response.status === 200
    } catch (error) {
      console.error('Health check failed:', error)
      return false
    }
  }
}

// TODO: APIクライアントのシングルトンインスタンスをエクスポート
export const apiClient = new ApiClient()

// TODO: 型定義のエクスポート
export type { Post, CreatePostRequest, UpdatePostRequest }