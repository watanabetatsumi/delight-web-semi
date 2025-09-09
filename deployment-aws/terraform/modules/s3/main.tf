# S3静的サイトホスティングモジュール
#
# 🎯 学習ポイント:
# - S3バケットの静的サイトホスティング設定
# - バケットポリシーでパブリックアクセスを制御
# - CORS設定でクロスオリジンリクエストを許可

# S3バケットの作成
resource "aws_s3_bucket" "website" {
  # TODO: バケット名を設定
  # ヒント: var.bucket_nameを使用
  bucket = "TODO: バケット名を設定"

  # TODO: タグを設定
  tags = "TODO: タグを設定"
}

# S3バケットの静的サイトホスティング設定
resource "aws_s3_bucket_website_configuration" "website" {
  # TODO: バケットを指定
  bucket = "TODO: バケットを指定"

  # インデックスドキュメントの設定
  index_document {
    # TODO: インデックスファイル名を設定（通常は "index.html"）
    suffix = "TODO: インデックスファイル名"
  }

  # エラードキュメントの設定
  error_document {
    # TODO: エラーページファイル名を設定
    # ヒント: Next.jsの場合は "404.html" または "index.html"
    key = "TODO: エラーページファイル名"
  }
}

# S3バケットのパブリックアクセス設定
resource "aws_s3_bucket_public_access_block" "website" {
  # TODO: バケットを指定
  bucket = "TODO: バケットを指定"

  # TODO: パブリックアクセス設定を行う
  # ヒント: 静的サイトホスティングのため、読み取りアクセスは許可が必要
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# S3バケットポリシー（パブリック読み取りアクセスを許可）
resource "aws_s3_bucket_policy" "website" {
  # TODO: バケットを指定
  bucket = "TODO: バケットを指定"

  # パブリックアクセスブロック設定後に適用
  depends_on = [aws_s3_bucket_public_access_block.website]

  # TODO: バケットポリシーを設定
  # ヒント: jsonencode()を使用してポリシーを定義
  policy = jsonencode({
    # TODO: ポリシードキュメントを作成
    # Version: "2012-10-17"
    # Statement: GetObject権限をすべてのプリンシパルに許可
    # Resource: "arn:aws:s3:::${aws_s3_bucket.website.bucket}/*"
  })
}

# S3バケットのCORS設定
resource "aws_s3_bucket_cors_configuration" "website" {
  # TODO: バケットを指定
  bucket = "TODO: バケットを指定"

  cors_rule {
    # TODO: 許可するHTTPメソッドを設定
    allowed_methods = ["TODO: HTTPメソッドを設定"]
    
    # TODO: 許可するオリジンを設定
    # ヒント: ["*"] ですべてのオリジンを許可（開発用）
    allowed_origins = ["TODO: オリジンを設定"]
    
    # TODO: 許可するヘッダーを設定
    allowed_headers = ["TODO: ヘッダーを設定"]
    
    # TODO: 公開するヘッダーを設定
    expose_headers = ["TODO: 公開ヘッダーを設定"]
    
    # キャッシュ時間（秒）
    max_age_seconds = 3000
  }
}

# S3バケットのバージョニング設定（オプション）
resource "aws_s3_bucket_versioning" "website" {
  # TODO: バケットを指定
  bucket = "TODO: バケットを指定"
  
  versioning_configuration {
    # TODO: バージョニングの有効/無効を設定
    # ヒント: "Enabled" または "Disabled"
    status = "TODO: バージョニング設定"
  }
}