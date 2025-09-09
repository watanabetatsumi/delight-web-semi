// ルートレイアウトコンポーネント
//
// 🎯 学習ポイント:
// - Next.js App Routerのレイアウト設計
// - メタデータとSEO設定
// - グローバルスタイルの適用

import type { Metadata } from 'next'
import './globals.css'

// TODO: メタデータの設定
export const metadata: Metadata = {
  title: 'TODO: アプリケーションタイトル',
  description: 'TODO: アプリケーションの説明',
  // TODO: 追加のメタデータ設定
  // keywords: ['掲示板', 'CRUD', 'AWS', 'Next.js'],
  // authors: [{ name: 'Your Name' }],
  // viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gray-50">
        {/* TODO: ヘッダーコンポーネント */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {/* TODO: アプリケーション名を環境変数から取得 */}
              {process.env.NEXT_PUBLIC_APP_NAME || 'Simple CRUD Board'}
            </h1>
          </div>
        </header>

        {/* TODO: メインコンテンツエリア */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          {children}
        </main>

        {/* TODO: フッターコンポーネント */}
        <footer className="bg-white border-t mt-auto">
          <div className="max-w-4xl mx-auto px-4 py-4 text-center text-gray-600">
            <p>
              &copy; 2024 Simple CRUD Board - 
              Environment: {process.env.NEXT_PUBLIC_ENVIRONMENT || 'development'}
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}