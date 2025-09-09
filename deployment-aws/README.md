# AWS Deployment Challenge - 完成版

このプロジェクトは、simple-crud-boardアプリケーションをAWSのサーバーレス環境にデプロイするための実装課題です。

## 🎯 学習目標達成

✅ **Terraformを使用したInfrastructure as Code (IaC)**
- S3、Lambda、DynamoDB、API Gateway、IAMの設定
- 環境別設定管理（dev/prod）
- モジュール化による再利用可能な設計

✅ **AWSサーバーレスアーキテクチャ**
- S3での静的サイトホスティング
- Lambda関数でのGo API実装
- DynamoDBでのNoSQLデータストレージ
- API Gatewayでのリクエストルーティング

✅ **GitHub ActionsによるCI/CDパイプライン**
- インフラストラクチャの自動デプロイ
- フロントエンド・バックエンドの自動ビルド・デプロイ
- テスト実行とデプロイメント検証

✅ **Go言語でのLambda関数開発**
- AWS Lambda Go API Proxyの使用
- DynamoDB SDK v2の実装
- エラーハンドリングとログ管理

✅ **Next.jsの静的サイト生成とS3デプロイ**
- 静的エクスポート設定
- 環境変数を使用したAPI URL設定
- レスポンシブデザインとTailwind CSS

## 📁 プロジェクト構成

```
deployment-aws/
├── terraform/                 # Terraformインフラストラクチャ
│   ├── modules/              # 再利用可能なモジュール
│   │   ├── s3/              # S3バケット設定
│   │   ├── dynamodb/        # DynamoDB設定
│   │   ├── lambda/          # Lambda関数設定
│   │   ├── api-gateway/     # API Gateway設定
│   │   └── iam/             # IAMロール・ポリシー設定
│   ├── environments/        # 環境別設定
│   │   ├── dev/            # 開発環境
│   │   └── prod/           # 本番環境
│   ├── main.tf             # メイン設定
│   ├── variables.tf        # 変数定義
│   ├── outputs.tf          # 出力値定義
│   └── versions.tf         # プロバイダー設定
├── lambda/                   # Lambda関数のソースコード
│   ├── cmd/main.go          # エントリーポイント
│   ├── internal/            # 内部パッケージ
│   │   ├── handlers/        # HTTPハンドラー
│   │   ├── models/          # データモデル
│   │   ├── database/        # DynamoDB操作
│   │   └── config/          # 設定管理
│   ├── go.mod              # Go モジュール
│   └── Makefile            # ビルドスクリプト
├── frontend/                # Next.js静的サイト
│   ├── src/                # ソースコード
│   │   ├── app/            # App Router
│   │   ├── components/     # Reactコンポーネント
│   │   ├── lib/            # ユーティリティ
│   │   └── types/          # 型定義
│   ├── next.config.js      # Next.js設定
│   └── package.json        # 依存関係
├── .github/workflows/       # GitHub Actions CI/CD
│   ├── deploy-infrastructure.yml
│   ├── deploy-backend.yml
│   ├── deploy-frontend.yml
│   └── deploy-full.yml
├── scripts/                 # デプロイメントスクリプト
│   ├── build-lambda.sh     # Lambda関数ビルド
│   └── build-frontend.sh   # フロントエンドビルド
└── README.md               # このファイル
```

## 🚀 実装のポイント

### 1. 学習者向けのTODOコメント

すべてのファイルに詳細なTODOコメントを配置し、学習者が段階的に実装できるよう設計：

```go
// TODO: DynamoDBクライアントの初期化
// ヒント: config.LoadDefaultConfig()を使用
cfg, err := config.LoadDefaultConfig(context.TODO())
```

### 2. エラーハンドリングとベストプラクティス

- AWS SDK v2の適切な使用方法
- DynamoDB固有のエラーハンドリング
- Lambda関数のパフォーマンス最適化
- セキュリティベストプラクティス

### 3. 環境分離とスケーラビリティ

- 開発環境と本番環境の適切な分離
- Terraformモジュールによる再利用性
- コスト最適化（AWS無料枠内での運用）

### 4. CI/CDパイプライン

- テスト → ビルド → デプロイの自動化
- 環境別デプロイメント戦略
- ロールバック機能とエラー通知

## 🔧 セットアップ手順

### 1. 前提条件

- AWS CLI設定済み
- Terraform 1.6以上
- Go 1.21以上
- Node.js 18以上
- GitHub リポジトリ

### 2. GitHub Secrets設定

```bash
# AWS認証情報
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION

# Terraform設定
TF_STATE_BUCKET
TF_STATE_KEY
TF_LOCK_TABLE

# アプリケーション設定
DYNAMODB_TABLE_NAME
S3_BUCKET_NAME
LAMBDA_FUNCTION_NAME
```

### 3. 初回デプロイ

```bash
# 1. リポジトリクローン
git clone <repository-url>
cd deployment-aws

# 2. Terraformバックエンド作成
aws s3 mb s3://your-terraform-state-bucket
aws dynamodb create-table --table-name terraform-locks \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST

# 3. 設定ファイル更新
# terraform/environments/dev/terraform.tfvars を編集

# 4. デプロイ実行
git add .
git commit -m "Initial deployment"
git push origin main
```

## 📚 学習リソース

### 実装ガイド

各ディレクトリのREADME.mdに詳細な実装ガイドを用意：

- `terraform/README.md` - インフラストラクチャ構築
- `lambda/README.md` - Lambda関数実装
- `frontend/README.md` - フロントエンド開発
- `.github/workflows/README.md` - CI/CD設定

### 参考資料

- [AWS Lambda Go Developer Guide](https://docs.aws.amazon.com/lambda/latest/dg/golang-handler.html)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## 🎓 学習の進め方

### Phase 1: インフラストラクチャ理解
1. Terraformモジュールの構造を理解
2. AWS リソース間の関係を把握
3. 環境別設定の仕組みを学習

### Phase 2: バックエンド実装
1. Lambda関数の基本構造を理解
2. DynamoDB操作の実装
3. API Gateway統合の設定

### Phase 3: フロントエンド実装
1. Next.js静的エクスポートの設定
2. API クライアントの実装
3. レスポンシブUIの構築

### Phase 4: CI/CD構築
1. GitHub Actions ワークフローの理解
2. 自動テストとデプロイの設定
3. 監視とアラートの実装

## 💰 コスト管理

AWS無料枠内での運用を想定した設定：

- **Lambda**: 128MB メモリ、1M requests/month
- **DynamoDB**: オンデマンド課金、25GB storage
- **S3**: 5GB storage、20,000 GET requests
- **API Gateway**: 1M calls/month

## 🔍 トラブルシューティング

よくある問題と解決方法：

1. **Terraform エラー**: ステートファイルの競合
2. **Lambda デプロイエラー**: パッケージサイズ制限
3. **CORS エラー**: API Gateway設定
4. **DynamoDB エラー**: IAM権限不足

## 🎉 完了後の次のステップ

1. **監視とアラート**: CloudWatch メトリクス設定
2. **セキュリティ強化**: WAF、VPC設定
3. **パフォーマンス最適化**: CloudFront CDN導入
4. **スケーリング**: Auto Scaling設定

この実装課題を通じて、現代的なサーバーレスアプリケーションの開発・デプロイメントスキルを習得できます！