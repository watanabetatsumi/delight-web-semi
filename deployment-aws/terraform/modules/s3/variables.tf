# S3モジュールの変数定義
#
# 🎯 学習ポイント:
# - モジュールの入力パラメータを定義
# - 型指定とバリデーションでエラーを防ぐ
# - デフォルト値で使いやすさを向上

variable "bucket_name" {
  description = "S3バケット名（グローバルでユニークである必要があります）"
  type        = string

  # TODO: バリデーションを追加
  # ヒント: S3バケット名の命名規則に従う
  validation {
    condition = can(regex("^[a-z0-9][a-z0-9-]*[a-z0-9]$", var.bucket_name)) && length(var.bucket_name) >= 3 && length(var.bucket_name) <= 63
    error_message = "バケット名は3-63文字で、小文字、数字、ハイフンのみ使用可能です。"
  }
}

variable "index_document" {
  description = "インデックスドキュメントのファイル名"
  type        = string
  # TODO: デフォルト値を設定
  default = "TODO: インデックスファイル名を設定"
}

variable "error_document" {
  description = "エラードキュメントのファイル名"
  type        = string
  # TODO: デフォルト値を設定
  default = "TODO: エラーファイル名を設定"
}

variable "enable_versioning" {
  description = "S3バケットのバージョニングを有効にするかどうか"
  type        = bool
  # TODO: デフォルト値を設定
  default = false # 開発環境では無効、本番環境では有効にすることを検討
}

variable "cors_allowed_origins" {
  description = "CORS設定で許可するオリジンのリスト"
  type        = list(string)
  # TODO: デフォルト値を設定
  # ヒント: 開発時は ["*"]、本番では具体的なドメインを指定
  default = ["TODO: 許可するオリジンを設定"]
}

variable "cors_allowed_methods" {
  description = "CORS設定で許可するHTTPメソッドのリスト"
  type        = list(string)
  # TODO: デフォルト値を設定
  default = ["TODO: 許可するHTTPメソッドを設定"]
}

variable "common_tags" {
  description = "リソースに適用する共通タグ"
  type        = map(string)
  default     = {}
}