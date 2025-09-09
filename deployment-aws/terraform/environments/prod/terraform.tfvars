# 本番環境用の変数設定
#
# 🎯 学習ポイント:
# - 本番環境では安定性とパフォーマンスを重視
# - 開発環境との設定差分を明確に管理
# - 本番環境固有のセキュリティ設定

# 基本設定
project_name = "simple-crud-board"
environment  = "prod"
aws_region   = "us-east-1"

# DynamoDB設定
# TODO: 本番環境用のテーブル名を設定
dynamodb_table_name = "TODO: 本番環境用DynamoDBテーブル名"

# S3設定
# TODO: 本番環境用のS3バケット名を設定
# ヒント: 本番環境では独自ドメインを使用することも考慮
s3_bucket_name = "TODO: 本番環境用S3バケット名"

# Lambda設定
# TODO: 本番環境用のLambda関数名を設定
lambda_function_name = "TODO: 本番環境用Lambda関数名"

# API Gateway設定
# TODO: 本番環境用のAPI Gateway名を設定
api_gateway_name = "TODO: 本番環境用API Gateway名"

# Lambda関数の詳細設定（本番環境用）
lambda_runtime     = "provided.al2023"  # Go用のカスタムランタイム
lambda_memory_size = 256                # 本番環境では少し多めのメモリ
lambda_timeout     = 30                 # API Gatewayの最大タイムアウト

# 共通タグ（本番環境用）
common_tags = {
  ManagedBy   = "terraform"
  Environment = "prod"
  Project     = "simple-crud-board"
  Owner       = "platform-team"
  # TODO: 本番環境固有のタグを追加
  # Backup      = "required"
  # Monitoring  = "enabled"
  # Compliance  = "required"
}