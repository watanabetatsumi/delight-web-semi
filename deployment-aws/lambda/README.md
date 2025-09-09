# Lambda Function Implementation

このディレクトリには、AWS LambdaでデプロイするGo言語のバックエンドAPIが含まれています。

## 🎯 学習目標

- Go言語でのLambda関数開発
- AWS Lambda Go API Proxyの使用
- DynamoDB SDK v2の実装
- API Gateway統合の理解

## 📁 ディレクトリ構成

```
lambda/
├── cmd/
│   └── main.go              # Lambda関数のエントリーポイント
├── internal/
│   ├── handlers/            # HTTPハンドラー
│   ├── models/              # データモデル
│   ├── database/            # DynamoDB操作
│   └── config/              # 設定管理
├── go.mod                   # Go モジュール定義
├── go.sum                   # 依存関係のハッシュ
├── Makefile                 # ビルドスクリプト
└── README.md               # このファイル
```

## 🚀 開発環境のセットアップ

### 前提条件

- Go 1.21以上
- AWS CLI（ローカルテスト用）
- Docker（オプション：ローカル環境構築用）

### 依存関係のインストール

```bash
cd lambda
go mod tidy
```

### ローカルでのビルド

```bash
# Linux用バイナリのビルド（Lambda環境用）
make build

# ローカル環境用のビルド
go build -o bin/main cmd/main.go
```

## 🔧 実装のヒント

### Lambda Handler の実装

1. **AWS Lambda Go API Proxy** を使用してGinルーターをLambdaで動作させる
2. **API Gateway Proxy Integration** でHTTPリクエストを処理
3. **環境変数** でDynamoDBテーブル名などの設定を管理

### DynamoDB操作の実装

1. **AWS SDK for Go v2** を使用
2. **DynamoDB Expression Builder** でクエリを構築
3. **エラーハンドリング** でAWS固有のエラーを適切に処理

### 環境変数

Lambda関数で使用する環境変数：

- `DYNAMODB_TABLE_NAME`: DynamoDBテーブル名
- `AWS_REGION`: AWSリージョン（自動設定）

## 📚 実装ガイド

### 1. Lambda Handler の作成

```go
// cmd/main.go
package main

import (
    "context"
    "github.com/aws/aws-lambda-go/events"
    "github.com/aws/aws-lambda-go/lambda"
    "github.com/awslabs/aws-lambda-go-api-proxy/gin"
)

func Handler(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
    // TODO: Ginルーターの初期化とLambda統合
}

func main() {
    lambda.Start(Handler)
}
```

### 2. DynamoDB Client の実装

```go
// internal/database/dynamodb.go
package database

import (
    "context"
    "github.com/aws/aws-sdk-go-v2/config"
    "github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

type Client struct {
    dynamodb  *dynamodb.Client
    tableName string
}

func NewClient(tableName string) (*Client, error) {
    // TODO: DynamoDB クライアントの初期化
}
```

### 3. CRUD操作の実装

各操作で以下を実装：

- **Create**: `PutItem` でアイテムを作成
- **Read**: `GetItem` または `Scan` でアイテムを取得
- **Update**: `UpdateItem` でアイテムを更新
- **Delete**: `DeleteItem` でアイテムを削除

## 🧪 テスト

### ユニットテスト

```bash
go test ./...
```

### ローカルテスト（SAM CLI使用）

```bash
# SAM CLIでローカル実行
sam local start-api
```

## 📦 デプロイメント

### 手動デプロイ

```bash
# ビルド
make build

# ZIPファイル作成
make package

# Lambda関数の更新
aws lambda update-function-code \
  --function-name your-function-name \
  --zip-file fileb://deployment.zip
```

### CI/CDパイプライン

GitHub Actionsワークフローが自動的に：

1. Goコードをビルド
2. ZIPパッケージを作成
3. Lambda関数を更新

## 🔍 トラブルシューティング

### よくある問題

1. **Import cycle**: パッケージの循環参照
2. **DynamoDB permissions**: IAMロールの権限不足
3. **Cold start**: Lambda関数の初回実行時の遅延

### デバッグ方法

1. **CloudWatch Logs**: Lambda関数のログを確認
2. **AWS X-Ray**: 分散トレーシングでパフォーマンス分析
3. **ローカルテスト**: SAM CLIでローカル環境でテスト