# IAMロールとポリシーモジュール
#
# 🎯 学習ポイント:
# - 最小権限の原則に従ったIAMポリシー設計
# - Lambda実行ロールとDynamoDBアクセス権限
# - GitHub ActionsからのAWSアクセス権限

# Lambda実行ロール
resource "aws_iam_role" "lambda_execution" {
  # TODO: ロール名を設定
  name = "TODO: Lambda実行ロール名を設定"

  # TODO: 信頼ポリシーを設定
  # ヒント: Lambda サービスがこのロールを引き受けることを許可
  assume_role_policy = jsonencode({
    # TODO: 信頼ポリシードキュメントを作成
    # Version: "2012-10-17"
    # Statement: Lambda サービスに AssumeRole を許可
  })

  # TODO: タグを設定
  tags = "TODO: タグを設定"
}

# Lambda基本実行ポリシーのアタッチ
resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  # TODO: ロールを指定
  role = "TODO: Lambda実行ロールを指定"
  
  # TODO: AWS管理ポリシーを指定
  # ヒント: "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  policy_arn = "TODO: Lambda基本実行ポリシーARNを指定"
}

# DynamoDBアクセス用のカスタムポリシー
resource "aws_iam_policy" "lambda_dynamodb_access" {
  # TODO: ポリシー名を設定
  name = "TODO: DynamoDBアクセスポリシー名を設定"
  
  # TODO: ポリシーの説明を設定
  description = "TODO: ポリシーの説明を設定"

  # TODO: ポリシードキュメントを設定
  policy = jsonencode({
    # TODO: DynamoDBアクセス用のポリシードキュメントを作成
    # Version: "2012-10-17"
    # Statement: DynamoDB の GetItem, PutItem, UpdateItem, DeleteItem, Query, Scan を許可
    # Resource: 特定のテーブルARNを指定
  })

  # TODO: タグを設定
  tags = "TODO: タグを設定"
}

# DynamoDBアクセスポリシーをLambda実行ロールにアタッチ
resource "aws_iam_role_policy_attachment" "lambda_dynamodb_access" {
  # TODO: ロールを指定
  role = "TODO: Lambda実行ロールを指定"
  
  # TODO: カスタムポリシーを指定
  policy_arn = "TODO: DynamoDBアクセスポリシーARNを指定"
}

# GitHub Actions用のIAMロール（OIDC連携用）
resource "aws_iam_role" "github_actions" {
  count = var.enable_github_actions_role ? 1 : 0
  
  # TODO: ロール名を設定
  name = "TODO: GitHub Actionsロール名を設定"

  # TODO: GitHub Actions OIDC用の信頼ポリシーを設定
  assume_role_policy = jsonencode({
    # TODO: GitHub Actions OIDC プロバイダー用の信頼ポリシー
    # Version: "2012-10-17"
    # Statement: GitHub Actions の OIDC プロバイダーからの AssumeRole を許可
    # Condition: リポジトリとブランチを制限
  })

  # TODO: タグを設定
  tags = "TODO: タグを設定"
}

# GitHub Actions用のデプロイメントポリシー
resource "aws_iam_policy" "github_actions_deployment" {
  count = var.enable_github_actions_role ? 1 : 0
  
  # TODO: ポリシー名を設定
  name = "TODO: GitHub Actionsデプロイメントポリシー名を設定"
  
  description = "GitHub ActionsからのAWSリソースデプロイメント権限"

  # TODO: デプロイメント用のポリシードキュメントを設定
  policy = jsonencode({
    # TODO: GitHub Actions用のポリシードキュメントを作成
    # Version: "2012-10-17"
    # Statement: S3, Lambda, API Gateway, DynamoDB の管理権限
    # 最小権限の原則に従って必要な権限のみを付与
  })

  tags = var.common_tags
}

# GitHub Actionsデプロイメントポリシーのアタッチ
resource "aws_iam_role_policy_attachment" "github_actions_deployment" {
  count = var.enable_github_actions_role ? 1 : 0
  
  # TODO: ロールを指定
  role = "TODO: GitHub Actionsロールを指定"
  
  # TODO: デプロイメントポリシーを指定
  policy_arn = "TODO: デプロイメントポリシーARNを指定"
}