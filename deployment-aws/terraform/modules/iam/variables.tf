# IAMモジュールの変数定義
#
# 🎯 学習ポイント:
# - セキュリティ設定をカスタマイズ可能にする
# - 環境に応じたアクセス権限の制御
# - GitHub Actions連携の有効/無効切り替え

variable "project_name" {
  description = "プロジェクト名（IAMリソース名に使用）"
  type        = string
}

variable "environment" {
  description = "環境名（dev, staging, prod）"
  type        = string
}

variable "dynamodb_table_arn" {
  description = "DynamoDBテーブルのARN（Lambda関数のアクセス権限用）"
  type        = string
}

variable "enable_github_actions_role" {
  description = "GitHub Actions用のIAMロールを作成するかどうか"
  type        = bool
  # TODO: デフォルト値を設定
  default = true
}

variable "github_repository" {
  description = "GitHub リポジトリ名（org/repo 形式）"
  type        = string
  # TODO: デフォルト値を設定
  default = "TODO: GitHubリポジトリ名を設定"
}

variable "github_branches" {
  description = "GitHub Actions からのアクセスを許可するブランチのリスト"
  type        = list(string)
  # TODO: デフォルト値を設定
  default = ["TODO: 許可するブランチを設定"]
}

variable "lambda_function_name" {
  description = "Lambda関数名（IAMロール名の生成に使用）"
  type        = string
}

variable "enable_cloudwatch_logs" {
  description = "CloudWatch Logsへのアクセス権限を付与するかどうか"
  type        = bool
  # TODO: デフォルト値を設定
  default = true
}

variable "enable_xray_tracing" {
  description = "AWS X-Rayトレーシングの権限を付与するかどうか"
  type        = bool
  # TODO: デフォルト値を設定
  default = false
}

variable "additional_lambda_policies" {
  description = "Lambda関数に追加でアタッチするポリシーARNのリスト"
  type        = list(string)
  default     = []
}

variable "s3_bucket_arn" {
  description = "S3バケットのARN（GitHub Actionsのデプロイ権限用）"
  type        = string
  default     = ""
}

variable "api_gateway_arn" {
  description = "API GatewayのARN（GitHub Actionsのデプロイ権限用）"
  type        = string
  default     = ""
}

variable "common_tags" {
  description = "リソースに適用する共通タグ"
  type        = map(string)
  default     = {}
}

# セキュリティ設定
variable "max_session_duration" {
  description = "IAMロールの最大セッション時間（秒）"
  type        = number
  # TODO: デフォルト値を設定
  # ヒント: 3600秒（1時間）が一般的
  default = 3600
}

variable "enable_mfa_requirement" {
  description = "MFA（多要素認証）を必須にするかどうか"
  type        = bool
  # TODO: デフォルト値を設定
  default = false
}