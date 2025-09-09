# Terraformとプロバイダーのバージョン指定
# 
# 🎯 学習ポイント:
# - Terraformのバージョン固定により、チーム間での一貫性を保つ
# - AWSプロバイダーのバージョン指定で予期しない変更を防ぐ
# - required_providersブロックでプロバイダーの詳細を指定

terraform {
  # Terraformの最小バージョンを指定
  # TODO: 適切なバージョンを指定してください（例: ">= 1.0"）
  required_version = "TODO: Terraformの最小バージョンを指定"

  # 使用するプロバイダーとそのバージョンを指定
  required_providers {
    aws = {
      # TODO: AWSプロバイダーのソースとバージョンを指定
      # ヒント: source = "hashicorp/aws", version = "~> 5.0"
      source  = "TODO: プロバイダーのソースを指定"
      version = "TODO: プロバイダーのバージョンを指定"
    }
  }

  # Terraformステートファイルの保存先設定
  # TODO: S3バックエンドの設定を追加
  # ヒント: backend "s3" ブロックを使用
  # backend "s3" {
  #   bucket = "your-terraform-state-bucket"
  #   key    = "simple-crud-board/terraform.tfstate"
  #   region = "us-east-1"
  # }
}

# AWSプロバイダーの設定
provider "aws" {
  # TODO: デフォルトリージョンを指定
  # ヒント: region = var.aws_region
  region = "TODO: AWSリージョンを指定"

  # TODO: デフォルトタグを設定（オプション）
  # ヒント: プロジェクト名、環境、所有者などのタグを設定
  default_tags {
    tags = {
      # Project     = var.project_name
      # Environment = var.environment
      # ManagedBy   = "terraform"
    }
  }
}