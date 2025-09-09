export interface Post {
  id: number
  content: string
  created_at: string
  updated_at: string
}

export interface CreatePostRequest {
  content: string
}

export interface UpdatePostRequest {
  content: string
}

export interface PostsResponse {
  posts: Post[]
}

export interface PostResponse {
  post: Post
}