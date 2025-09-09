# API Gatewayモジュールの出力値定義
#
# 🎯 学習ポイント:
# - フロントエンドで使用するAPI URLを出力
# - CI/CDパイプラインで使用するデプロイ情報を提供
# - 監視とログで使用する情報を出力

output "api_id" {
  description = "API GatewayのID"
  # TODO: API Gateway IDを出力
  value = "TODO: API Gateway IDを出力"
}

output "api_arn" {
  description = "API GatewayのARN"
  # TODO: API Gateway ARNを出力
  value = "TODO: API Gateway ARNを出力"
}

output "invoke_url" {
  description = "API Gatewayの実行URL"
  # TODO: 実行URLを出力
  # ヒント: "https://${aws_api_gateway_rest_api.api.id}.execute-api.${var.aws_region}.amazonaws.com/${aws_api_gateway_stage.api.stage_name}"
  value = "TODO: 実行URLを出力"
}

output "stage_name" {
  description = "API Gatewayステージ名"
  # TODO: ステージ名を出力
  value = "TODO: ステージ名を出力"
}

output "deployment_id" {
  description = "API GatewayデプロイメントのID"
  # TODO: デプロイメントIDを出力
  value = "TODO: デプロイメントIDを出力"
}

output "root_resource_id" {
  description = "ルートリソースのID"
  # TODO: ルートリソースIDを出力
  value = "TODO: ルートリソースIDを出力"
}

# フロントエンド用の環境変数
output "frontend_config" {
  description = "フロントエンドで使用する設定情報"
  value = {
    # TODO: フロントエンド用の設定を出力
    # api_url = "https://${aws_api_gateway_rest_api.api.id}.execute-api.${data.aws_region.current.name}.amazonaws.com/${aws_api_gateway_stage.api.stage_name}"
    # api_id = aws_api_gateway_rest_api.api.id
    # stage = aws_api_gateway_stage.api.stage_name
  }
}

# CI/CDパイプライン用の情報
output "deployment_info" {
  description = "デプロイメント用の情報"
  value = {
    # TODO: デプロイメントに必要な情報を出力
    # api_id = aws_api_gateway_rest_api.api.id
    # api_name = aws_api_gateway_rest_api.api.name
    # stage_name = aws_api_gateway_stage.api.stage_name
    # invoke_url = "https://${aws_api_gateway_rest_api.api.id}.execute-api.${data.aws_region.current.name}.amazonaws.com/${aws_api_gateway_stage.api.stage_name}"
  }
}

# 監視用の情報
output "monitoring_info" {
  description = "監視とアラート用の情報"
  value = {
    # TODO: 監視用の情報を出力
    # api_id = aws_api_gateway_rest_api.api.id
    # stage_name = aws_api_gateway_stage.api.stage_name
    # endpoint_type = var.endpoint_type
    # cors_enabled = var.enable_cors
  }
}