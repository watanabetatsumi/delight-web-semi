# API Gatewayモジュール
#
# 🎯 学習ポイント:
# - REST APIの作成とLambda統合
# - CORS設定でクロスオリジンリクエストを許可
# - API Gatewayのデプロイメントとステージ管理

# API Gatewayの作成
resource "aws_api_gateway_rest_api" "api" {
  # TODO: API名を設定
  name = "TODO: API Gateway名を設定"
  
  # TODO: 説明を設定
  description = "TODO: API Gatewayの説明を設定"

  # TODO: エンドポイント設定
  endpoint_configuration {
    types = ["TODO: エンドポイントタイプを設定"] # REGIONAL, EDGE, PRIVATE
  }

  # バイナリメディアタイプ（必要に応じて）
  binary_media_types = var.binary_media_types

  # TODO: タグを設定
  tags = "TODO: タグを設定"
}

# プロキシリソース（すべてのパスをLambdaに転送）
resource "aws_api_gateway_resource" "proxy" {
  # TODO: REST APIを指定
  rest_api_id = "TODO: REST API IDを指定"
  
  # TODO: 親リソースIDを指定（ルートリソース）
  parent_id = "TODO: 親リソースIDを指定"
  
  # TODO: パスパートを設定
  path_part = "TODO: パスパートを設定" # "{proxy+}" でプロキシリソース
}

# プロキシメソッド（ANY メソッドでLambda統合）
resource "aws_api_gateway_method" "proxy" {
  # TODO: REST APIを指定
  rest_api_id = "TODO: REST API IDを指定"
  
  # TODO: リソースIDを指定
  resource_id = "TODO: リソースIDを指定"
  
  # TODO: HTTPメソッドを設定
  http_method = "TODO: HTTPメソッドを設定" # "ANY" ですべてのメソッドを許可
  
  # TODO: 認証を設定
  authorization = "TODO: 認証タイプを設定" # "NONE" で認証なし

  # リクエストパラメータ
  request_parameters = {
    "method.request.path.proxy" = true
  }
}

# Lambda統合の設定
resource "aws_api_gateway_integration" "lambda" {
  # TODO: REST APIを指定
  rest_api_id = "TODO: REST API IDを指定"
  
  # TODO: リソースIDを指定
  resource_id = "TODO: リソースIDを指定"
  
  # TODO: HTTPメソッドを指定
  http_method = "TODO: HTTPメソッドを指定"

  # TODO: 統合タイプを設定
  integration_http_method = "TODO: 統合HTTPメソッドを設定" # "POST" でLambda呼び出し
  
  # TODO: 統合タイプを設定
  type = "TODO: 統合タイプを設定" # "AWS_PROXY" でLambdaプロキシ統合
  
  # TODO: Lambda関数URIを設定
  uri = "TODO: Lambda関数URIを設定"
}

# ルートリソース用のメソッド（オプション）
resource "aws_api_gateway_method" "root" {
  # TODO: REST APIを指定
  rest_api_id = "TODO: REST API IDを指定"
  
  # TODO: ルートリソースIDを指定
  resource_id = "TODO: ルートリソースIDを指定"
  
  # TODO: HTTPメソッドを設定
  http_method = "TODO: HTTPメソッドを設定"
  
  authorization = "NONE"
}

# ルートリソース用のLambda統合
resource "aws_api_gateway_integration" "lambda_root" {
  # TODO: REST APIを指定
  rest_api_id = "TODO: REST API IDを指定"
  
  # TODO: ルートリソースIDを指定
  resource_id = "TODO: ルートリソースIDを指定"
  
  # TODO: HTTPメソッドを指定
  http_method = "TODO: HTTPメソッドを指定"

  integration_http_method = "POST"
  type                   = "AWS_PROXY"
  
  # TODO: Lambda関数URIを設定
  uri = "TODO: Lambda関数URIを設定"
}

# Lambda関数の実行権限をAPI Gatewayに付与
resource "aws_lambda_permission" "api_gw" {
  # TODO: ステートメントIDを設定
  statement_id = "TODO: ステートメントIDを設定"
  
  # TODO: アクションを設定
  action = "TODO: アクションを設定" # "lambda:InvokeFunction"
  
  # TODO: Lambda関数名を設定
  function_name = "TODO: Lambda関数名を設定"
  
  # TODO: プリンシパルを設定
  principal = "TODO: プリンシパルを設定" # "apigateway.amazonaws.com"

  # TODO: ソースARNを設定
  source_arn = "TODO: ソースARNを設定"
}

# API Gatewayのデプロイメント
resource "aws_api_gateway_deployment" "api" {
  # TODO: REST APIを指定
  rest_api_id = "TODO: REST API IDを指定"

  # リソースとメソッドの作成後にデプロイ
  depends_on = [
    aws_api_gateway_method.proxy,
    aws_api_gateway_integration.lambda,
    aws_api_gateway_method.root,
    aws_api_gateway_integration.lambda_root,
  ]

  # デプロイメントの再作成をトリガーするためのハッシュ
  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.proxy.id,
      aws_api_gateway_method.proxy.id,
      aws_api_gateway_integration.lambda.id,
      aws_api_gateway_method.root.id,
      aws_api_gateway_integration.lambda_root.id,
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}

# API Gatewayステージ
resource "aws_api_gateway_stage" "api" {
  # TODO: デプロイメントIDを指定
  deployment_id = "TODO: デプロイメントIDを指定"
  
  # TODO: REST APIを指定
  rest_api_id = "TODO: REST API IDを指定"
  
  # TODO: ステージ名を設定
  stage_name = "TODO: ステージ名を設定"

  # TODO: タグを設定
  tags = "TODO: タグを設定"

  # アクセスログ設定（オプション）
  # access_log_settings {
  #   destination_arn = aws_cloudwatch_log_group.api_gw.arn
  #   format = jsonencode({
  #     requestId      = "$context.requestId"
  #     ip             = "$context.identity.sourceIp"
  #     caller         = "$context.identity.caller"
  #     user           = "$context.identity.user"
  #     requestTime    = "$context.requestTime"
  #     httpMethod     = "$context.httpMethod"
  #     resourcePath   = "$context.resourcePath"
  #     status         = "$context.status"
  #     protocol       = "$context.protocol"
  #     responseLength = "$context.responseLength"
  #   })
  # }
}