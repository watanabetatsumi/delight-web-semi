'use client'

import { AlertCircle } from 'lucide-react'

interface ErrorMessageProps {
  message: string
  className?: string
}

export function ErrorMessage({ message, className = '' }: ErrorMessageProps) {
  return (
    <div className={`bg-red-50 border border-red-200 rounded-md p-4 ${className}`}>
      <div className="flex items-center">
        <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
        <div>
          <h3 className="text-sm font-medium text-red-800">エラーが発生しました</h3>
          <p className="text-sm text-red-700 mt-1">{message}</p>
        </div>
      </div>
    </div>
  )
}