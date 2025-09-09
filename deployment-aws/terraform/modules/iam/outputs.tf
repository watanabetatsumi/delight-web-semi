# IAMモジュールの出力値定義
#
# 🎯 学習ポイント:
# - 他のリソースで使用するIAMロールARNを出力
# - GitHub ActionsでのAWS認証情報を提供
# - セキュリティ監査用の情報を出力

output "lambda_execution_role_arn" {
  description = "Lambda実行ロールのARN"
  # TODO: Lambda実行ロールのARNを出力
  value = "TODO: Lambda実行ロールARNを出力"
}

output "lambda_execution_role_name" {
  description = "Lambda実行ロールの名前"
  # TODO: Lambda実行ロール名を出力
  value = "TODO: Lambda実行ロール名を出力"
}

output "github_actions_role_arn" {
  description = "GitHub Actions用IAMロールのARN"
  # TODO: GitHub ActionsロールのARNを出力（作成された場合のみ）
  value = "TODO: GitHub ActionsロールARNを出力"
}

output "github_actions_role_name" {
  description = "GitHub Actions用IAMロールの名前"
  # TODO: GitHub Actionsロール名を出力（作成された場合のみ）
  value = "TODO: GitHub Actionsロール名を出力"
}

output "dynamodb_access_policy_arn" {
  description = "DynamoDBアクセスポリシーのARN"
  # TODO: DynamoDBアクセスポリシーのARNを出力
  value = "TODO: DynamoDBアクセスポリシーARNを出力"
}

# GitHub Actions設定用の情報
output "github_actions_config" {
  description = "GitHub Actions設定用の情報"
  value = {
    # TODO: GitHub Actions設定に必要な情報を出力
    # role_arn = var.enable_github_actions_role ? aws_iam_role.github_actions[0].arn : null
    # role_name = var.enable_github_actions_role ? aws_iam_role.github_actions[0].name : null
    # repository = var.github_repository
    # allowed_branches = var.github_branches
  }
}

# セキュリティ監査用の情報
output "security_info" {
  description = "セキュリティ監査用の情報"
  value = {
    # TODO: セキュリティ監査用の情報を出力
    # lambda_role_policies = [
    #   aws_iam_role_policy_attachment.lambda_basic_execution.policy_arn,
    #   aws_iam_policy.lambda_dynamodb_access.arn
    # ]
    # github_actions_enabled = var.enable_github_actions_role
    # mfa_required = var.enable_mfa_requirement
  }
}