# Simple CRUD Board Frontend

Next.js 14 (App Router) を使用したシンプルな掲示板アプリケーションのフロントエンド

## 技術スタック

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Lucide React

## 機能

- 投稿の一覧表示
- 新規投稿の作成
- 投稿の編集
- 投稿の削除
- レスポンシブデザイン
- エラーハンドリング
- ローディング状態の表示

## プロジェクト構造

```
src/
├── app/                    # App Router pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── posts/            # Post-related components
│   │   ├── PostList.tsx
│   │   ├── PostItem.tsx
│   │   └── CreatePostForm.tsx
│   └── ui/               # UI components
│       ├── LoadingSpinner.tsx
│       └── ErrorMessage.tsx
├── hooks/                # Custom hooks
│   └── usePosts.ts
├── lib/                  # Utilities
│   └── api.ts           # API client
└── types/               # TypeScript types
    └── post.ts
```

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

```bash
cp .env.local.example .env.local
```

`.env.local` を編集してAPIのURLを設定：

```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

アプリケーションは http://localhost:3000 で起動します。

## 利用可能なスクリプト

- `npm run dev` - 開発サーバーを起動
- `npm run build` - プロダクション用にビルド
- `npm run start` - プロダクションサーバーを起動
- `npm run lint` - ESLintでコードをチェック
- `npm run type-check` - TypeScriptの型チェック

## API連携

バックエンドAPI（Go/Gin）との連携を前提としています：

- `GET /api/posts` - 投稿一覧取得
- `POST /api/posts` - 新規投稿作成
- `PUT /api/posts/:id` - 投稿更新
- `DELETE /api/posts/:id` - 投稿削除

## 設計思想

### App Router

Next.js 14のApp Routerを採用し、最新のベストプラクティスに従っています。

### コンポーネント設計

- **Atomic Design**: 小さく再利用可能なコンポーネントを組み合わせ
- **Single Responsibility**: 各コンポーネントは単一の責任を持つ
- **Props Interface**: TypeScriptで型安全性を確保

### 状態管理

- **Custom Hooks**: ビジネスロジックをカスタムフックに分離
- **Local State**: React の useState を活用
- **Error Handling**: 適切なエラーハンドリングとユーザーフィードバック

### スタイリング

- **Tailwind CSS**: ユーティリティファーストのCSS
- **Component Classes**: 再利用可能なコンポーネントクラス
- **Responsive Design**: モバイルファーストのレスポンシブデザイン

## 今後の拡張予定

- ユーザー認証機能
- リアルタイム更新
- 投稿の検索・フィルタリング
- ページネーション
- 画像アップロード機能