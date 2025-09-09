# メインのTerraform設定ファイル
#
# 🎯 学習ポイント:
# - モジュールを使用してコードを整理・再利用
# - データソースで既存リソースの情報を取得
# - ローカル値で計算や文字列結合を行う

# ローカル値の定義（計算や文字列結合に使用）
locals {
  # TODO: 共通のリソース名プレフィックスを定義
  # ヒント: "${var.project_name}-${var.environment}"
  name_prefix = "TODO: リソース名プレフィックスを定義"

  # TODO: 共通タグを定義
  # ヒント: var.common_tagsとプロジェクト固有のタグをマージ
  common_tags = merge(var.common_tags, {
    # Project     = var.project_name
    # Environment = var.environment
  })
}

# データソース: 現在のAWSアカウント情報を取得
data "aws_caller_identity" "current" {}

# データソース: 現在のAWSリージョン情報を取得
data "aws_region" "current" {}

# IAMモジュール（他のリソースが依存するため最初に作成）
module "iam" {
  # TODO: モジュールのソースパスを指定
  source = "TODO: IAMモジュールのパスを指定"

  # TODO: 必要な変数を渡す
  # project_name = var.project_name
  # environment  = var.environment
  # common_tags  = local.common_tags
}

# DynamoDBモジュール
module "dynamodb" {
  # TODO: モジュールのソースパスを指定
  source = "TODO: DynamoDBモジュールのパスを指定"

  # TODO: 必要な変数を渡す
  # table_name  = var.dynamodb_table_name
  # common_tags = local.common_tags
}

# S3モジュール（静的サイトホスティング）
module "s3" {
  # TODO: モジュールのソースパスを指定
  source = "TODO: S3モジュールのパスを指定"

  # TODO: 必要な変数を渡す
  # bucket_name = var.s3_bucket_name
  # common_tags = local.common_tags
}

# Lambdaモジュール
module "lambda" {
  # TODO: モジュールのソースパスを指定
  source = "TODO: Lambdaモジュールのパスを指定"

  # TODO: 必要な変数を渡す
  # function_name    = var.lambda_function_name
  # runtime         = var.lambda_runtime
  # memory_size     = var.lambda_memory_size
  # timeout         = var.lambda_timeout
  # execution_role  = module.iam.lambda_execution_role_arn
  # dynamodb_table  = module.dynamodb.table_name
  # common_tags     = local.common_tags

  # モジュール間の依存関係を明示
  depends_on = [module.iam, module.dynamodb]
}

# API Gatewayモジュール
module "api_gateway" {
  # TODO: モジュールのソースパスを指定
  source = "TODO: API Gatewayモジュールのパスを指定"

  # TODO: 必要な変数を渡す
  # api_name           = var.api_gateway_name
  # lambda_function_arn = module.lambda.function_arn
  # lambda_function_name = module.lambda.function_name
  # common_tags        = local.common_tags

  # モジュール間の依存関係を明示
  depends_on = [module.lambda]
}