// 投稿関連の型定義
//
// 🎯 学習ポイント:
// - TypeScriptでの型定義
// - APIレスポンスとの型安全性
// - フロントエンドとバックエンドの型共有

// TODO: 投稿の基本型定義
export interface Post {
  id: string
  content: string
  created_at: string  // ISO8601形式の日時文字列
  updated_at: string  // ISO8601形式の日時文字列
}

// TODO: 投稿作成リクエストの型定義
export interface CreatePostRequest {
  content: string
}

// TODO: 投稿更新リクエストの型定義
export interface UpdatePostRequest {
  content: string
}

// TODO: API レスポンスの型定義
export interface PostsResponse {
  posts: Post[]
  count: number
}

export interface PostResponse {
  post: Post
  message?: string
}

export interface CreatePostResponse {
  post: Post
  message: string
}

export interface UpdatePostResponse {
  post: Post
  message: string
}

export interface DeletePostResponse {
  message: string
}

// TODO: エラーレスポンスの型定義
export interface ApiErrorResponse {
  error: string
  message: string
  code?: number
}

// TODO: フォーム用の型定義
export interface PostFormData {
  content: string
}

// TODO: 投稿の状態管理用の型定義
export interface PostState {
  posts: Post[]
  loading: boolean
  error: string | null
}

// TODO: 投稿操作の結果型定義
export type PostOperationResult = {
  success: boolean
  error?: string
  post?: Post
}

// TODO: ソート順の型定義
export type SortOrder = 'asc' | 'desc'
export type SortField = 'created_at' | 'updated_at' | 'content'

// TODO: フィルター条件の型定義
export interface PostFilter {
  search?: string
  dateFrom?: string
  dateTo?: string
}

// TODO: ページネーション用の型定義
export interface Pagination {
  page: number
  limit: number
  total: number
  hasNext: boolean
  hasPrev: boolean
}

// TODO: 投稿一覧のクエリパラメータ型定義
export interface PostsQuery {
  page?: number
  limit?: number
  sort?: SortField
  order?: SortOrder
  search?: string
}

// TODO: ユーティリティ型定義
export type PostId = string
export type PostContent = string

// TODO: 投稿の部分更新用の型定義
export type PartialPost = Partial<Omit<Post, 'id'>>

// TODO: 投稿作成時の一時的な型定義（ID未確定）
export type NewPost = Omit<Post, 'id' | 'created_at' | 'updated_at'>

// TODO: 投稿の表示用の型定義（日時をDateオブジェクトに変換）
export interface PostDisplay extends Omit<Post, 'created_at' | 'updated_at'> {
  created_at: Date
  updated_at: Date
  timeAgo: string  // 相対時間表示用
}