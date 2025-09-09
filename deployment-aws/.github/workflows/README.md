# GitHub Actions CI/CD Workflows

このディレクトリには、AWS デプロイメント用の GitHub Actions ワークフローが含まれています。

## 🎯 学習目標

- GitHub Actions を使用した CI/CD パイプライン
- AWS への自動デプロイメント
- Terraform を使用したインフラストラクチャ管理
- 環境別デプロイメント戦略

## 📁 ワークフロー構成

```
.github/workflows/
├── deploy-infrastructure.yml    # インフラストラクチャデプロイ
├── deploy-frontend.yml          # フロントエンドデプロイ
├── deploy-backend.yml           # バックエンドデプロイ
├── deploy-full.yml              # 全体デプロイ
└── README.md                    # このファイル
```

## 🚀 ワークフローの概要

### 1. Infrastructure Deployment (`deploy-infrastructure.yml`)

- **トリガー**: `terraform/` ディレクトリの変更
- **処理内容**:
  - Terraform の初期化
  - プランの作成と確認
  - インフラストラクチャの適用

### 2. Frontend Deployment (`deploy-frontend.yml`)

- **トリガー**: `frontend/` ディレクトリの変更
- **処理内容**:
  - Next.js アプリのビルド
  - 静的ファイルの生成
  - S3 への アップロード

### 3. Backend Deployment (`deploy-backend.yml`)

- **トリガー**: `lambda/` ディレクトリの変更
- **処理内容**:
  - Go アプリのビルド
  - Lambda 関数の更新

### 4. Full Deployment (`deploy-full.yml`)

- **トリガー**: 手動実行または main ブランチへのプッシュ
- **処理内容**:
  - 上記すべてのデプロイメントを順次実行

## 🔧 必要な GitHub Secrets

以下の Secrets を GitHub リポジトリに設定してください：

### AWS 認証情報

```
AWS_ACCESS_KEY_ID          # AWS アクセスキー ID
AWS_SECRET_ACCESS_KEY      # AWS シークレットアクセスキー
AWS_REGION                 # AWS リージョン (例: us-east-1)
```

### Terraform 設定

```
TF_STATE_BUCKET           # Terraform ステートファイル用 S3 バケット
TF_STATE_KEY              # Terraform ステートファイルのキー
TF_LOCK_TABLE             # Terraform ロック用 DynamoDB テーブル
```

### アプリケーション設定

```
DYNAMODB_TABLE_NAME       # DynamoDB テーブル名
S3_BUCKET_NAME           # フロントエンド用 S3 バケット名
LAMBDA_FUNCTION_NAME     # Lambda 関数名
API_GATEWAY_URL          # API Gateway URL
```

## 🌍 環境別デプロイメント

### 開発環境 (dev)

- **ブランチ**: `develop`
- **トリガー**: プッシュ時
- **設定**: 開発用リソース

### 本番環境 (prod)

- **ブランチ**: `main`
- **トリガー**: プッシュ時またはリリース作成時
- **設定**: 本番用リソース

## 📋 デプロイメント手順

### 1. 初回セットアップ

```bash
# 1. リポジトリをクローン
git clone <repository-url>
cd deployment-aws

# 2. GitHub Secrets を設定
# GitHub リポジトリの Settings > Secrets and variables > Actions で設定

# 3. Terraform バックエンドを手動で作成
aws s3 mb s3://your-terraform-state-bucket
aws dynamodb create-table --table-name terraform-locks --attribute-definitions AttributeName=LockID,AttributeType=S --key-schema AttributeName=LockID,KeyType=HASH --billing-mode PAY_PER_REQUEST
```

### 2. 通常のデプロイメント

```bash
# 1. 変更をコミット
git add .
git commit -m "Update application"

# 2. ブランチにプッシュ（自動デプロイが開始される）
git push origin main  # 本番環境
git push origin develop  # 開発環境
```

### 3. 手動デプロイメント

GitHub の Actions タブから `Full Deployment` ワークフローを手動実行

## 🔍 トラブルシューティング

### よくある問題

1. **AWS 認証エラー**
   - GitHub Secrets の AWS 認証情報を確認
   - IAM ロールの権限を確認

2. **Terraform エラー**
   - ステートファイルのロック状態を確認
   - リソースの命名衝突を確認

3. **ビルドエラー**
   - 依存関係の問題を確認
   - 環境変数の設定を確認

### デバッグ方法

1. **ワークフローログの確認**
   - GitHub Actions の詳細ログを確認
   - エラーメッセージを分析

2. **ローカルテスト**
   - スクリプトをローカルで実行
   - AWS CLI で手動操作を確認

## 📚 参考資料

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [AWS CLI Configuration](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)
- [Terraform GitHub Actions](https://learn.hashicorp.com/tutorials/terraform/github-actions)