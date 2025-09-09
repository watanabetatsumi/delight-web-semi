'use client'

import { useState } from 'react'
import { Edit2, Trash2, Save, X } from 'lucide-react'
import type { Post } from '@/types/post'

interface PostItemProps {
  post: Post
  onUpdate: (id: number, content: string) => Promise<void>
  onDelete: (id: number) => Promise<void>
}

export function PostItem({ post, onUpdate, onDelete }: PostItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(post.content)
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    if (editContent.trim() === '') {
      alert('投稿内容を入力してください')
      return
    }

    setIsLoading(true)
    try {
      await onUpdate(post.id, editContent.trim())
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update post:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setEditContent(post.content)
    setIsEditing(false)
  }

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await onDelete(post.id)
    } catch (error) {
      console.error('Failed to delete post:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="card p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          {isEditing ? (
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="input min-h-[100px] resize-vertical"
              placeholder="投稿内容を入力してください..."
              disabled={isLoading}
            />
          ) : (
            <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
              {post.content}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          <p>作成日時: {formatDate(post.created_at)}</p>
          {post.updated_at !== post.created_at && (
            <p>更新日時: {formatDate(post.updated_at)}</p>
          )}
        </div>

        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={isLoading || editContent.trim() === ''}
                className="btn btn-primary flex items-center space-x-1"
              >
                <Save size={16} />
                <span>保存</span>
              </button>
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="btn btn-secondary flex items-center space-x-1"
              >
                <X size={16} />
                <span>キャンセル</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                disabled={isLoading}
                className="btn btn-secondary flex items-center space-x-1"
              >
                <Edit2 size={16} />
                <span>編集</span>
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="btn btn-danger flex items-center space-x-1"
              >
                <Trash2 size={16} />
                <span>削除</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}