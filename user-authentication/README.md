# User Authentication System

認証認可機能付き掲示板アプリケーション

## 概要

このプロジェクトは、既存の掲示板アプリケーションにユーザー認証・認可機能を追加したものです。Cookieベースの認証を実装し、各ユーザーが自分の投稿を管理できるようにします。

## 技術スタック

- **Backend**: Go (Gin framework)
- **Database**: MySQL 8.0
- **Frontend**: Next.js (予定)
- **Authentication**: Cookie-based sessions

## セットアップ

### 1. データベースの起動

```bash
# MySQL コンテナを起動
docker-compose up -d mysql

# データベースの状態確認
docker-compose ps
```

### 2. バックエンドの起動

```bash
cd backend

# 依存関係のインストール
go mod tidy

# アプリケーションの起動
go run main.go
```

### 3. マイグレーションの実行

アプリケーション起動時に自動的にマイグレーションが実行されますが、手動で実行することも可能です：

```bash
# マイグレーション状態の確認
curl http://localhost:8080/api/migrate/status

# マイグレーションの実行
curl -X POST http://localhost:8080/api/migrate/up

# マイグレーションのロールバック
curl -X POST http://localhost:8080/api/migrate/down
```

## API エンドポイント

### システム

- `GET /health` - ヘルスチェック
- `GET /api/migrate/status` - マイグレーション状態確認
- `POST /api/migrate/up` - マイグレーション実行
- `POST /api/migrate/down` - マイグレーションロールバック

### 認証 (予定)

- `POST /api/auth/register` - ユーザー登録
- `POST /api/auth/login` - ログイン
- `POST /api/auth/logout` - ログアウト
- `GET /api/auth/me` - 現在のユーザー情報取得

### 投稿 (予定)

- `GET /api/posts` - 全投稿取得
- `GET /api/posts/my` - 自分の投稿取得
- `POST /api/posts` - 投稿作成
- `PUT /api/posts/:id` - 投稿更新
- `DELETE /api/posts/:id` - 投稿削除

## データベーススキーマ

### users テーブル

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 環境変数

```bash
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=user_auth_board
```

## 開発

### テストの実行

```bash
cd backend
go test ./...
```

### マイグレーションの追加

1. `database/migrations/` ディレクトリに新しいマイグレーションファイルを作成
2. `main.go` でマイグレーションを登録
3. アプリケーションを再起動してマイグレーションを適用

## 今後の実装予定

- [ ] ユーザー認証機能
- [ ] 投稿の認可機能
- [ ] フロントエンド実装
- [ ] チャット機能 (発展)
- [ ] JWT認証対応 (発展)