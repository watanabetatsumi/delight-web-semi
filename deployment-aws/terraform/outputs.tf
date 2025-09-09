# Terraform出力値定義
#
# 🎯 学習ポイント:
# - 出力値で他のコンポーネントに必要な情報を提供
# - GitHub ActionsやCI/CDパイプラインで使用する値を出力
# - センシティブな情報は適切にマークする

# S3バケット関連の出力
output "s3_bucket_name" {
  description = "静的サイトホスティング用S3バケット名"
  # TODO: S3モジュールからバケット名を出力
  value = "TODO: S3バケット名を出力"
}

output "s3_website_endpoint" {
  description = "S3静的サイトのエンドポイントURL"
  # TODO: S3モジュールからウェブサイトエンドポイントを出力
  value = "TODO: S3ウェブサイトエンドポイントを出力"
}

# API Gateway関連の出力
output "api_gateway_url" {
  description = "API GatewayのベースURL"
  # TODO: API Gatewayモジュールから実行URLを出力
  value = "TODO: API Gateway URLを出力"
}

output "api_gateway_id" {
  description = "API GatewayのID"
  # TODO: API GatewayモジュールからIDを出力
  value = "TODO: API Gateway IDを出力"
}

# Lambda関数関連の出力
output "lambda_function_name" {
  description = "Lambda関数名"
  # TODO: Lambdaモジュールから関数名を出力
  value = "TODO: Lambda関数名を出力"
}

output "lambda_function_arn" {
  description = "Lambda関数のARN"
  # TODO: Lambdaモジュールから関数ARNを出力
  value = "TODO: Lambda関数ARNを出力"
}

# DynamoDB関連の出力
output "dynamodb_table_name" {
  description = "DynamoDBテーブル名"
  # TODO: DynamoDBモジュールからテーブル名を出力
  value = "TODO: DynamoDBテーブル名を出力"
}

output "dynamodb_table_arn" {
  description = "DynamoDBテーブルのARN"
  # TODO: DynamoDBモジュールからテーブルARNを出力
  value = "TODO: DynamoDBテーブルARNを出力"
}

# IAM関連の出力（センシティブ情報として扱う）
output "lambda_execution_role_arn" {
  description = "Lambda実行ロールのARN"
  # TODO: IAMモジュールから実行ロールARNを出力
  value = "TODO: Lambda実行ロールARNを出力"
  # センシティブ情報としてマーク（ログに出力されない）
  sensitive = false # 実際の運用ではtrueに設定することを検討
}

# 環境情報の出力
output "environment" {
  description = "デプロイ環境"
  value       = var.environment
}

output "aws_region" {
  description = "AWSリージョン"
  value       = var.aws_region
}

# フロントエンドビルド用の環境変数
output "frontend_env_vars" {
  description = "フロントエンドビルド時に使用する環境変数"
  value = {
    # TODO: フロントエンドで使用する環境変数を定義
    # NEXT_PUBLIC_API_URL = module.api_gateway.invoke_url
    # NEXT_PUBLIC_ENVIRONMENT = var.environment
  }
}

# CI/CD用の出力（GitHub Actionsで使用）
output "deployment_info" {
  description = "デプロイメント情報（CI/CDで使用）"
  value = {
    # TODO: CI/CDパイプラインで使用する情報をまとめて出力
    # s3_bucket = module.s3.bucket_name
    # lambda_function = module.lambda.function_name
    # api_url = module.api_gateway.invoke_url
    # region = var.aws_region
  }
}