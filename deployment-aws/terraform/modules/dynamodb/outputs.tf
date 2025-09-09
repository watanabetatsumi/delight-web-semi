# DynamoDBモジュールの出力値定義
#
# 🎯 学習ポイント:
# - Lambda関数で使用するテーブル情報を出力
# - IAMポリシーで使用するARNを提供
# - 監視とログで使用する情報を出力

output "table_name" {
  description = "作成されたDynamoDBテーブル名"
  # TODO: テーブル名を出力
  value = "TODO: テーブル名を出力"
}

output "table_arn" {
  description = "DynamoDBテーブルのARN"
  # TODO: テーブルARNを出力
  value = "TODO: テーブルARNを出力"
}

output "table_id" {
  description = "DynamoDBテーブルのID"
  # TODO: テーブルIDを出力
  value = "TODO: テーブルIDを出力"
}

output "hash_key" {
  description = "テーブルのハッシュキー名"
  # TODO: ハッシュキー名を出力
  value = "TODO: ハッシュキー名を出力"
}

output "table_stream_arn" {
  description = "DynamoDBストリームのARN（有効な場合）"
  # TODO: ストリームARNを出力（ストリームが有効な場合のみ）
  value = "TODO: ストリームARNを出力"
}

# Lambda関数の環境変数用
output "lambda_environment_vars" {
  description = "Lambda関数で使用する環境変数"
  value = {
    # TODO: Lambda関数で使用する環境変数を定義
    # DYNAMODB_TABLE_NAME = aws_dynamodb_table.posts.name
    # DYNAMODB_REGION = aws_dynamodb_table.posts.region
  }
}

# IAMポリシー用の情報
output "iam_policy_arns" {
  description = "IAMポリシーで使用するARN情報"
  value = {
    # TODO: IAMポリシーで使用するARN情報を出力
    # table_arn = aws_dynamodb_table.posts.arn
    # index_arns = [for idx in aws_dynamodb_table.posts.global_secondary_index : "${aws_dynamodb_table.posts.arn}/index/${idx.name}"]
  }
}

# 監視用の情報
output "monitoring_info" {
  description = "監視とアラート用の情報"
  value = {
    # TODO: 監視用の情報を出力
    # table_name = aws_dynamodb_table.posts.name
    # billing_mode = aws_dynamodb_table.posts.billing_mode
    # deletion_protection = aws_dynamodb_table.posts.deletion_protection_enabled
  }
}