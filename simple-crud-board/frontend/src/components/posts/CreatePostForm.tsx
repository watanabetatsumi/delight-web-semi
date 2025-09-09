'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'

interface CreatePostFormProps {
  onSubmit: (content: string) => Promise<void>
  onCancel: () => void
}

export function CreatePostForm({ onSubmit, onCancel }: CreatePostFormProps) {
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (content.trim() === '') {
      alert('投稿内容を入力してください')
      return
    }

    setIsLoading(true)
    try {
      await onSubmit(content.trim())
      setContent('')
    } catch (error) {
      console.error('Failed to create post:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="投稿内容を入力してください..."
          className="input min-h-[120px] resize-vertical"
          disabled={isLoading}
          maxLength={1000}
        />
        <div className="text-right text-sm text-gray-500 mt-1">
          {content.length}/1000
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="btn btn-secondary"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={isLoading || content.trim() === ''}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Send size={16} />
          <span>{isLoading ? '投稿中...' : '投稿する'}</span>
        </button>
      </div>
    </form>
  )
}