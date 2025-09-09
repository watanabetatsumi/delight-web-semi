# DynamoDBテーブルモジュール
#
# 🎯 学習ポイント:
# - DynamoDBのテーブル設計とパーティションキー
# - オンデマンド課金でコスト最適化
# - 暗号化とバックアップの設定

# DynamoDBテーブルの作成
resource "aws_dynamodb_table" "posts" {
  # TODO: テーブル名を設定
  name = "TODO: テーブル名を設定"

  # TODO: 課金モードを設定
  # ヒント: "PAY_PER_REQUEST" でオンデマンド課金（無料枠に適している）
  billing_mode = "TODO: 課金モードを設定"

  # TODO: ハッシュキー（パーティションキー）を設定
  # ヒント: 投稿のIDを使用
  hash_key = "TODO: ハッシュキーを設定"

  # TODO: 属性定義を追加
  attribute {
    # 投稿ID（パーティションキー）
    name = "TODO: 属性名を設定"
    type = "TODO: 属性タイプを設定" # S=String, N=Number, B=Binary
  }

  # TODO: 追加の属性が必要な場合は定義
  # 例: GSI（Global Secondary Index）用の属性
  # attribute {
  #   name = "created_at"
  #   type = "S"
  # }

  # TODO: タグを設定
  tags = "TODO: タグを設定"

  # 削除保護（本番環境では有効にすることを推奨）
  deletion_protection_enabled = var.enable_deletion_protection

  # TODO: 暗号化設定
  server_side_encryption {
    enabled = true
    # KMSキーを指定しない場合はAWS管理キーを使用
  }

  # TODO: ポイントインタイムリカバリ設定
  point_in_time_recovery {
    enabled = var.enable_point_in_time_recovery
  }

  # TTL設定（オプション）
  # 投稿の自動削除が必要な場合に使用
  # ttl {
  #   attribute_name = "expires_at"
  #   enabled        = var.enable_ttl
  # }
}

# Global Secondary Index（GSI）の例
# 作成日時でソートするためのインデックス
resource "aws_dynamodb_table" "posts_gsi" {
  count = var.enable_created_at_index ? 1 : 0

  # メインテーブルと同じ設定
  name         = "${var.table_name}-gsi"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "status"  # 例: "published", "draft"
  range_key    = "created_at"

  attribute {
    name = "status"
    type = "S"
  }

  attribute {
    name = "created_at"
    type = "S"
  }

  tags = var.common_tags

  # TODO: GSIの設定
  global_secondary_index {
    name     = "StatusCreatedAtIndex"
    hash_key = "status"
    range_key = "created_at"
    projection_type = "ALL"  # すべての属性を投影
  }
}