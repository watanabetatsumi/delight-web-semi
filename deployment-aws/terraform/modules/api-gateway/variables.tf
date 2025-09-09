# API Gatewayモジュールの変数定義
#
# 🎯 学習ポイント:
# - API Gatewayの設定をカスタマイズ可能にする
# - Lambda統合とCORS設定の管理
# - ステージとデプロイメント設定の制御

variable "api_name" {
  description = "API Gateway名"
  type        = string
}

variable "api_description" {
  description = "API Gatewayの説明"
  type        = string
  # TODO: デフォルト値を設定
  default = "TODO: API Gatewayの説明を設定"
}

variable "lambda_function_arn" {
  description = "統合するLambda関数のARN"
  type        = string
}

variable "lambda_function_name" {
  description = "統合するLambda関数名"
  type        = string
}

variable "lambda_invoke_arn" {
  description = "Lambda関数の呼び出しARN"
  type        = string
}

variable "stage_name" {
  description = "API Gatewayステージ名"
  type        = string
  # TODO: デフォルト値を設定
  default = "TODO: ステージ名を設定"
}

variable "endpoint_type" {
  description = "API Gatewayエンドポイントタイプ"
  type        = string
  # TODO: デフォルト値を設定
  default = "TODO: エンドポイントタイプを設定"

  validation {
    condition     = contains(["REGIONAL", "EDGE", "PRIVATE"], var.endpoint_type)
    error_message = "エンドポイントタイプは REGIONAL, EDGE, PRIVATE のいずれかを指定してください。"
  }
}

variable "enable_cors" {
  description = "CORS設定を有効にするかどうか"
  type        = bool
  # TODO: デフォルト値を設定
  default = true
}

variable "cors_allow_origins" {
  description = "CORS設定で許可するオリジンのリスト"
  type        = list(string)
  # TODO: デフォルト値を設定
  default = ["TODO: 許可するオリジンを設定"]
}

variable "cors_allow_methods" {
  description = "CORS設定で許可するHTTPメソッドのリスト"
  type        = list(string)
  # TODO: デフォルト値を設定
  default = ["TODO: 許可するHTTPメソッドを設定"]
}

variable "cors_allow_headers" {
  description = "CORS設定で許可するヘッダーのリスト"
  type        = list(string)
  # TODO: デフォルト値を設定
  default = ["TODO: 許可するヘッダーを設定"]
}

variable "binary_media_types" {
  description = "バイナリメディアタイプのリスト"
  type        = list(string)
  default     = []
}

variable "enable_access_logs" {
  description = "アクセスログを有効にするかどうか"
  type        = bool
  # TODO: デフォルト値を設定
  default = false
}

variable "log_retention_days" {
  description = "アクセスログの保持期間（日）"
  type        = number
  # TODO: デフォルト値を設定
  default = 14
}

variable "throttle_settings" {
  description = "スロットリング設定"
  type = object({
    rate_limit  = number
    burst_limit = number
  })
  default = {
    rate_limit  = 10000
    burst_limit = 5000
  }
}

variable "enable_api_key" {
  description = "APIキー認証を有効にするかどうか"
  type        = bool
  # TODO: デフォルト値を設定
  default = false
}

variable "common_tags" {
  description = "リソースに適用する共通タグ"
  type        = map(string)
  default     = {}
}