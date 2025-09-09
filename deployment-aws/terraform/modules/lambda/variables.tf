# Lambdaモジュールの変数定義
#
# 🎯 学習ポイント:
# - Lambda関数の設定をカスタマイズ可能にする
# - パフォーマンスとコストのバランス調整
# - 環境変数とログ設定の管理

variable "function_name" {
  description = "Lambda関数名"
  type        = string
}

variable "execution_role_arn" {
  description = "Lambda実行ロールのARN"
  type        = string
}

variable "runtime" {
  description = "Lambdaランタイム"
  type        = string
  # TODO: デフォルト値を設定
  default = "TODO: Lambdaランタイムを設定"
}

variable "handler" {
  description = "Lambda関数のハンドラー"
  type        = string
  # TODO: デフォルト値を設定
  default = "TODO: ハンドラー名を設定"
}

variable "memory_size" {
  description = "Lambda関数のメモリサイズ（MB）"
  type        = number
  # TODO: デフォルト値を設定
  default = 128

  # TODO: バリデーションを追加
  validation {
    condition     = var.memory_size >= 128 && var.memory_size <= 10240
    error_message = "メモリサイズは128MB-10240MBの範囲で指定してください。"
  }
}

variable "timeout" {
  description = "Lambda関数のタイムアウト（秒）"
  type        = number
  # TODO: デフォルト値を設定
  default = 30

  validation {
    condition     = var.timeout >= 1 && var.timeout <= 900
    error_message = "タイムアウトは1-900秒の範囲で指定してください。"
  }
}

variable "dynamodb_table_name" {
  description = "DynamoDBテーブル名（環境変数として設定）"
  type        = string
}

variable "aws_region" {
  description = "AWSリージョン（環境変数として設定）"
  type        = string
}

variable "environment_variables" {
  description = "Lambda関数の追加環境変数"
  type        = map(string)
  default     = {}
}

variable "enable_xray_tracing" {
  description = "AWS X-Rayトレーシングを有効にするかどうか"
  type        = bool
  # TODO: デフォルト値を設定
  default = false
}

variable "enable_versioning" {
  description = "Lambda関数のバージョニングを有効にするかどうか"
  type        = bool
  # TODO: デフォルト値を設定
  default = false
}

variable "log_retention_days" {
  description = "CloudWatch Logsの保持期間（日）"
  type        = number
  # TODO: デフォルト値を設定
  default = 14

  validation {
    condition = contains([
      1, 3, 5, 7, 14, 30, 60, 90, 120, 150, 180, 365, 400, 545, 731, 1827, 3653
    ], var.log_retention_days)
    error_message = "ログ保持期間は有効な値を指定してください。"
  }
}

variable "reserved_concurrent_executions" {
  description = "予約済み同時実行数（-1で無制限）"
  type        = number
  default     = -1
}

variable "dead_letter_queue_arn" {
  description = "デッドレターキューのARN（オプション）"
  type        = string
  default     = ""
}

variable "vpc_config" {
  description = "VPC設定（オプション）"
  type = object({
    subnet_ids         = list(string)
    security_group_ids = list(string)
  })
  default = null
}

variable "common_tags" {
  description = "リソースに適用する共通タグ"
  type        = map(string)
  default     = {}
}