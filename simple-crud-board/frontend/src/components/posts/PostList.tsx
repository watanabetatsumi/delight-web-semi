'use client'

import { PostItem } from './PostItem'
import type { Post } from '@/types/post'

interface PostListProps {
  posts: Post[]
  onUpdate: (id: number, content: string) => Promise<void>
  onDelete: (id: number) => Promise<void>
}

export function PostList({ posts, onUpdate, onDelete }: PostListProps) {
  if (posts.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostItem
          key={post.id}
          post={post}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}