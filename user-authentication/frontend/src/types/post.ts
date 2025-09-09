// Post related types

export interface Post {
  id: number;
  content: string;
  user_id: number;
  author?: string; // Username of the author
  created_at: string;
  updated_at: string;
}

export interface CreatePostRequest {
  content: string;
}

export interface UpdatePostRequest {
  content: string;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  offset: number;
  limit: number;
}

export interface PostError {
  error: string;
  message?: string;
}