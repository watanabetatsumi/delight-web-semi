# DynamoDBモジュールの変数定義
#
# 🎯 学習ポイント:
# - DynamoDBテーブルの設定をカスタマイズ可能にする
# - セキュリティとバックアップ設定の制御
# - 環境に応じた機能の有効/無効切り替え

variable "table_name" {
  description = "DynamoDBテーブル名"
  type        = string

  # TODO: バリデーションを追加
  validation {
    condition     = length(var.table_name) > 0 && length(var.table_name) <= 255
    error_message = "テーブル名は1-255文字で指定してください。"
  }
}

variable "hash_key_name" {
  description = "ハッシュキー（パーティションキー）の属性名"
  type        = string
  # TODO: デフォルト値を設定
  default = "TODO: ハッシュキー名を設定"
}

variable "hash_key_type" {
  description = "ハッシュキーのデータ型"
  type        = string
  # TODO: デフォルト値を設定
  default = "TODO: ハッシュキータイプを設定"

  # TODO: バリデーションを追加
  validation {
    condition     = contains(["S", "N", "B"], var.hash_key_type)
    error_message = "ハッシュキータイプは S（String）、N（Number）、B（Binary）のいずれかを指定してください。"
  }
}

variable "enable_deletion_protection" {
  description = "削除保護を有効にするかどうか"
  type        = bool
  # TODO: デフォルト値を設定
  # ヒント: 開発環境ではfalse、本番環境ではtrueが推奨
  default = false
}

variable "enable_point_in_time_recovery" {
  description = "ポイントインタイムリカバリを有効にするかどうか"
  type        = bool
  # TODO: デフォルト値を設定
  default = false
}

variable "enable_ttl" {
  description = "TTL（Time To Live）を有効にするかどうか"
  type        = bool
  # TODO: デフォルト値を設定
  default = false
}

variable "ttl_attribute_name" {
  description = "TTL用の属性名"
  type        = string
  # TODO: デフォルト値を設定
  default = "TODO: TTL属性名を設定"
}

variable "enable_created_at_index" {
  description = "作成日時用のGSIを作成するかどうか"
  type        = bool
  # TODO: デフォルト値を設定
  default = false
}

variable "enable_encryption" {
  description = "サーバーサイド暗号化を有効にするかどうか"
  type        = bool
  # TODO: デフォルト値を設定
  default = true
}

variable "kms_key_id" {
  description = "暗号化に使用するKMSキーID（指定しない場合はAWS管理キーを使用）"
  type        = string
  default     = null
}

variable "common_tags" {
  description = "リソースに適用する共通タグ"
  type        = map(string)
  default     = {}
}

# 読み取り/書き込み容量の設定（プロビジョンドモード用）
variable "read_capacity" {
  description = "読み取り容量ユニット（プロビジョンドモード時のみ使用）"
  type        = number
  default     = 5
}

variable "write_capacity" {
  description = "書き込み容量ユニット（プロビジョンドモード時のみ使用）"
  type        = number
  default     = 5
}