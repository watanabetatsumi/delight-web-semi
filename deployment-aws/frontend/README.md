# Frontend Static Site

このディレクトリには、S3にデプロイするNext.js静的サイトが含まれています。

## 🎯 学習目標

- Next.jsの静的サイト生成（SSG）
- S3での静的サイトホスティング
- 環境変数を使用したAPI URL設定
- CI/CDパイプラインでの自動デプロイ

## 📁 ディレクトリ構成

```
frontend/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # Reactコンポーネント
│   └── lib/                 # ユーティリティ関数
├── public/                  # 静的ファイル
├── next.config.js           # Next.js設定
├── package.json             # 依存関係
├── tailwind.config.js       # Tailwind CSS設定
└── README.md               # このファイル
```

## 🚀 開発環境のセットアップ

### 前提条件

- Node.js 18以上
- npm または yarn

### 依存関係のインストール

```bash
cd frontend
npm install
```

### 開発サーバーの起動

```bash
# 開発サーバー（ローカルAPI使用）
npm run dev

# 本番API使用での開発
NEXT_PUBLIC_API_URL=https://your-api-gateway-url.amazonaws.com/prod npm run dev
```

## 🔧 静的サイト生成

### ビルドと静的エクスポート

```bash
# 静的サイトのビルド
npm run build

# 静的ファイルの生成
npm run export

# ワンコマンドでビルド＆エクスポート
npm run build:static
```

### 生成されるファイル

- `out/` ディレクトリに静的ファイルが生成される
- S3にアップロードするのはこのディレクトリの内容

## 🌐 環境変数

### 開発環境

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 本番環境

```bash
# CI/CDパイプラインで設定
NEXT_PUBLIC_API_URL=https://your-api-gateway-id.execute-api.us-east-1.amazonaws.com/prod
```

## 📦 デプロイメント

### 手動デプロイ

```bash
# 1. 静的サイトをビルド
npm run build:static

# 2. S3にアップロード
aws s3 sync out/ s3://your-bucket-name --delete

# 3. CloudFrontキャッシュを無効化（使用している場合）
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### CI/CDパイプライン

GitHub Actionsワークフローが自動的に：

1. Next.jsアプリをビルド
2. 静的ファイルを生成
3. S3にアップロード
4. CloudFrontキャッシュを無効化

## 🎨 スタイリング

- **Tailwind CSS**: ユーティリティファーストのCSS
- **レスポンシブデザイン**: モバイルファーストアプローチ
- **ダークモード**: システム設定に対応

## 🧪 テスト

```bash
# ユニットテスト
npm run test

# E2Eテスト
npm run test:e2e

# テストカバレッジ
npm run test:coverage
```

## 🔍 トラブルシューティング

### よくある問題

1. **API接続エラー**: `NEXT_PUBLIC_API_URL`の設定を確認
2. **CORS エラー**: API GatewayのCORS設定を確認
3. **静的エクスポートエラー**: 動的ルーティングの使用を確認

### デバッグ方法

1. **開発者ツール**: ブラウザのNetwork タブでAPI リクエストを確認
2. **ログ出力**: `console.log`でデバッグ情報を出力
3. **Next.js デバッグモード**: `DEBUG=* npm run dev`

## 📚 参考資料

- [Next.js Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [AWS S3 Static Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)