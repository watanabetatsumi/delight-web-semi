# Terraform変数定義
#
# 🎯 学習ポイント:
# - 変数を使用してハードコードを避ける
# - 型指定とデフォルト値で安全性を向上
# - 説明文でチームメンバーに意図を伝える

# プロジェクト名
variable "project_name" {
  description = "プロジェクトの名前（リソース名のプレフィックスに使用）"
  type        = string
  # TODO: デフォルト値を設定してください
  default = "TODO: プロジェクト名を設定"

  # バリデーション例（オプション）
  validation {
    condition     = length(var.project_name) > 0 && length(var.project_name) <= 20
    error_message = "プロジェクト名は1-20文字で指定してください。"
  }
}

# 環境名（dev, staging, prod など）
variable "environment" {
  description = "デプロイ環境（dev, staging, prod）"
  type        = string
  # TODO: デフォルト値を設定してください
  default = "TODO: 環境名を設定"

  # TODO: バリデーションを追加してください
  # ヒント: 許可される値を制限する
  validation {
    condition = contains(["dev", "staging", "prod"], var.environment)
    error_message = "環境は dev, staging, prod のいずれかを指定してください。"
  }
}

# AWSリージョン
variable "aws_region" {
  description = "AWSリージョン"
  type        = string
  # TODO: デフォルト値を設定してください（例: "us-east-1"）
  default = "TODO: AWSリージョンを設定"
}

# DynamoDBテーブル名
variable "dynamodb_table_name" {
  description = "DynamoDBテーブル名"
  type        = string
  # TODO: デフォルト値を設定してください
  # ヒント: "${var.project_name}-posts-${var.environment}" のような命名規則
  default = "TODO: DynamoDBテーブル名を設定"
}

# S3バケット名（静的サイトホスティング用）
variable "s3_bucket_name" {
  description = "静的サイトホスティング用S3バケット名"
  type        = string
  # TODO: デフォルト値を設定してください
  # ヒント: S3バケット名はグローバルでユニークである必要があります
  default = "TODO: S3バケット名を設定"
}

# Lambda関数名
variable "lambda_function_name" {
  description = "Lambda関数名"
  type        = string
  # TODO: デフォルト値を設定してください
  default = "TODO: Lambda関数名を設定"
}

# API Gateway名
variable "api_gateway_name" {
  description = "API Gateway名"
  type        = string
  # TODO: デフォルト値を設定してください
  default = "TODO: API Gateway名を設定"
}

# Lambda関数の設定
variable "lambda_runtime" {
  description = "Lambda関数のランタイム"
  type        = string
  # TODO: Goのランタイムを指定してください
  default = "TODO: Lambdaランタイムを設定"
}

variable "lambda_memory_size" {
  description = "Lambda関数のメモリサイズ（MB）"
  type        = number
  # TODO: コスト最適化のため最小値を設定してください
  default = 128 # ヒント: 128MBが最小値
}

variable "lambda_timeout" {
  description = "Lambda関数のタイムアウト（秒）"
  type        = number
  # TODO: 適切なタイムアウト値を設定してください
  default = 30 # ヒント: API Gatewayの最大タイムアウトは30秒
}

# タグ設定
variable "common_tags" {
  description = "全リソースに適用する共通タグ"
  type        = map(string)
  default = {
    # TODO: 共通タグを設定してください
    # 例:
    # ManagedBy = "terraform"
    # Owner     = "development-team"
  }
}