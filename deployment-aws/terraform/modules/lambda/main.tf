# Lambda関数モジュール
#
# 🎯 学習ポイント:
# - Lambda関数の設定とデプロイメント
# - 環境変数でDynamoDBテーブル情報を渡す
# - CloudWatch Logsとの連携

# Lambda関数用のZIPファイル（プレースホルダー）
data "archive_file" "lambda_zip" {
  type        = "zip"
  output_path = "${path.module}/lambda_function.zip"
  
  # TODO: Lambda関数のソースファイルを指定
  # ヒント: 実際のビルドはCI/CDパイプラインで行う
  source {
    content  = "TODO: プレースホルダーコンテンツを設定"
    filename = "TODO: ファイル名を設定"
  }
}

# Lambda関数の作成
resource "aws_lambda_function" "api" {
  # TODO: 関数名を設定
  function_name = "TODO: Lambda関数名を設定"
  
  # TODO: IAM実行ロールを設定
  role = "TODO: Lambda実行ロールARNを設定"
  
  # TODO: ランタイムを設定
  runtime = "TODO: Lambdaランタイムを設定"
  
  # TODO: ハンドラーを設定
  # ヒント: Goの場合は通常 "main" または "bootstrap"
  handler = "TODO: ハンドラー名を設定"
  
  # TODO: デプロイメントパッケージを設定
  filename = "TODO: ZIPファイルパスを設定"
  
  # TODO: ソースコードハッシュを設定
  source_code_hash = "TODO: ソースコードハッシュを設定"
  
  # TODO: メモリサイズを設定
  memory_size = "TODO: メモリサイズを設定"
  
  # TODO: タイムアウトを設定
  timeout = "TODO: タイムアウトを設定"

  # TODO: 環境変数を設定
  environment {
    variables = {
      # TODO: DynamoDBテーブル名などの環境変数を設定
      # DYNAMODB_TABLE_NAME = var.dynamodb_table_name
      # AWS_REGION = var.aws_region
    }
  }

  # TODO: タグを設定
  tags = "TODO: タグを設定"

  # デッドレターキューの設定（オプション）
  # dead_letter_config {
  #   target_arn = aws_sqs_queue.dlq.arn
  # }

  # VPC設定（必要な場合）
  # vpc_config {
  #   subnet_ids         = var.subnet_ids
  #   security_group_ids = var.security_group_ids
  # }

  # X-Rayトレーシング設定
  tracing_config {
    mode = var.enable_xray_tracing ? "Active" : "PassThrough"
  }
}

# CloudWatch Logsグループ
resource "aws_cloudwatch_log_group" "lambda_logs" {
  # TODO: ロググループ名を設定
  name = "TODO: CloudWatchロググループ名を設定"
  
  # TODO: ログ保持期間を設定
  retention_in_days = "TODO: ログ保持期間を設定"

  # TODO: タグを設定
  tags = "TODO: タグを設定"
}

# Lambda関数のバージョン管理（オプション）
resource "aws_lambda_alias" "live" {
  count = var.enable_versioning ? 1 : 0
  
  # TODO: エイリアス名を設定
  name = "TODO: エイリアス名を設定"
  
  # TODO: 関数名を設定
  function_name = "TODO: Lambda関数名を設定"
  
  # TODO: 関数バージョンを設定
  function_version = "TODO: 関数バージョンを設定"

  # Blue/Green デプロイメント用の設定
  # routing_config {
  #   additional_version_weights = {
  #     "2" = 0.1  # 10%のトラフィックを新バージョンに
  #   }
  # }
}