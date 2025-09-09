# 開発環境用の変数設定
#
# 🎯 学習ポイント:
# - 環境ごとに異なる設定値を管理
# - 開発環境では最小リソースでコストを抑制
# - 命名規則で環境を明確に区別

# 基本設定
project_name = "simple-crud-board"
environment  = "dev"
aws_region   = "us-east-1"

# DynamoDB設定
# TODO: 開発環境用のテーブル名を設定
# ヒント: プロジェクト名-posts-環境名の形式
dynamodb_table_name = "TODO: 開発環境用DynamoDBテーブル名"

# S3設定
# TODO: 開発環境用のS3バケット名を設定
# ヒント: バケット名はグローバルでユニークである必要があります
# 例: "your-name-simple-crud-board-frontend-dev"
s3_bucket_name = "TODO: 開発環境用S3バケット名"

# Lambda設定
# TODO: 開発環境用のLambda関数名を設定
lambda_function_name = "TODO: 開発環境用Lambda関数名"

# API Gateway設定
# TODO: 開発環境用のAPI Gateway名を設定
api_gateway_name = "TODO: 開発環境用API Gateway名"

# Lambda関数の詳細設定
lambda_runtime     = "provided.al2023"  # Go用のカスタムランタイム
lambda_memory_size = 128                # 最小メモリサイズ（コスト最適化）
lambda_timeout     = 30                 # API Gatewayの最大タイムアウト

# 共通タグ
common_tags = {
  ManagedBy   = "terraform"
  Environment = "dev"
  Project     = "simple-crud-board"
  Owner       = "development-team"
  # TODO: 必要に応じて追加のタグを設定
  # CostCenter = "engineering"
  # Team       = "backend"
}