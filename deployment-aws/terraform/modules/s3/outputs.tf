# S3モジュールの出力値定義
#
# 🎯 学習ポイント:
# - モジュールの出力値で他のリソースに情報を提供
# - CI/CDパイプラインで使用する値を出力
# - 適切な説明文でチームメンバーに意図を伝える

output "bucket_name" {
  description = "作成されたS3バケットの名前"
  # TODO: S3バケットの名前を出力
  value = "TODO: S3バケット名を出力"
}

output "bucket_arn" {
  description = "S3バケットのARN"
  # TODO: S3バケットのARNを出力
  value = "TODO: S3バケットARNを出力"
}

output "website_endpoint" {
  description = "S3静的サイトのエンドポイントURL"
  # TODO: ウェブサイトエンドポイントを出力
  # ヒント: aws_s3_bucket_website_configuration.website.website_endpoint
  value = "TODO: ウェブサイトエンドポイントを出力"
}

output "website_domain" {
  description = "S3静的サイトのドメイン名"
  # TODO: ウェブサイトドメインを出力
  value = "TODO: ウェブサイトドメインを出力"
}

output "bucket_regional_domain_name" {
  description = "S3バケットのリージョナルドメイン名"
  # TODO: バケットのリージョナルドメイン名を出力
  value = "TODO: リージョナルドメイン名を出力"
}

# CI/CDパイプラインで使用する情報
output "deployment_info" {
  description = "デプロイメント用の情報"
  value = {
    # TODO: デプロイメントに必要な情報をまとめて出力
    # bucket_name = aws_s3_bucket.website.bucket
    # region = aws_s3_bucket.website.region
    # website_url = "http://${aws_s3_bucket_website_configuration.website.website_endpoint}"
  }
}