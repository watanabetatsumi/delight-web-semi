# Lambdaモジュールの出力値定義
#
# 🎯 学習ポイント:
# - API Gatewayで使用するLambda関数情報を出力
# - CI/CDパイプラインで使用するデプロイ情報を提供
# - 監視とログで使用する情報を出力

output "function_name" {
  description = "Lambda関数名"
  # TODO: Lambda関数名を出力
  value = "TODO: Lambda関数名を出力"
}

output "function_arn" {
  description = "Lambda関数のARN"
  # TODO: Lambda関数ARNを出力
  value = "TODO: Lambda関数ARNを出力"
}

output "function_qualified_arn" {
  description = "Lambda関数の修飾ARN（バージョン付き）"
  # TODO: 修飾ARNを出力
  value = "TODO: 修飾ARNを出力"
}

output "invoke_arn" {
  description = "Lambda関数の呼び出しARN（API Gateway用）"
  # TODO: 呼び出しARNを出力
  value = "TODO: 呼び出しARNを出力"
}

output "function_version" {
  description = "Lambda関数のバージョン"
  # TODO: 関数バージョンを出力
  value = "TODO: 関数バージョンを出力"
}

output "alias_arn" {
  description = "Lambda関数エイリアスのARN（バージョニング有効時）"
  # TODO: エイリアスARNを出力（作成された場合のみ）
  value = "TODO: エイリアスARNを出力"
}

output "log_group_name" {
  description = "CloudWatch Logsグループ名"
  # TODO: ロググループ名を出力
  value = "TODO: ロググループ名を出力"
}

output "log_group_arn" {
  description = "CloudWatch LogsグループのARN"
  # TODO: ロググループARNを出力
  value = "TODO: ロググループARNを出力"
}

# CI/CDパイプライン用の情報
output "deployment_info" {
  description = "デプロイメント用の情報"
  value = {
    # TODO: デプロイメントに必要な情報を出力
    # function_name = aws_lambda_function.api.function_name
    # runtime = aws_lambda_function.api.runtime
    # handler = aws_lambda_function.api.handler
    # memory_size = aws_lambda_function.api.memory_size
    # timeout = aws_lambda_function.api.timeout
  }
}

# 監視用の情報
output "monitoring_info" {
  description = "監視とアラート用の情報"
  value = {
    # TODO: 監視用の情報を出力
    # function_name = aws_lambda_function.api.function_name
    # log_group = aws_cloudwatch_log_group.lambda_logs.name
    # memory_size = aws_lambda_function.api.memory_size
    # timeout = aws_lambda_function.api.timeout
    # xray_enabled = var.enable_xray_tracing
  }
}