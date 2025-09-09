# Terraform Infrastructure

このディレクトリには、AWSインフラストラクチャを定義するTerraformコードが含まれています。

## 📁 ディレクトリ構成

```
terraform/
├── modules/                  # 再利用可能なモジュール
│   ├── s3/                  # S3バケット設定
│   ├── dynamodb/            # DynamoDB設定
│   ├── lambda/              # Lambda関数設定
│   ├── api-gateway/         # API Gateway設定
│   └── iam/                 # IAMロール・ポリシー設定
├── environments/            # 環境別設定
│   ├── dev/                 # 開発環境
│   └── prod/                # 本番環境
├── backend.tf               # Terraformバックエンド設定
├── main.tf                  # メインの設定ファイル
├── variables.tf             # 変数定義
├── outputs.tf               # 出力値定義
└── versions.tf              # プロバイダーバージョン指定
```

## 🚀 使用方法

### 1. 初期化

```bash
cd terraform
terraform init
```

### 2. プランの確認

```bash
# 開発環境
terraform plan -var-file="environments/dev/terraform.tfvars"

# 本番環境  
terraform plan -var-file="environments/prod/terraform.tfvars"
```

### 3. インフラストラクチャの適用

```bash
# 開発環境
terraform apply -var-file="environments/dev/terraform.tfvars"

# 本番環境
terraform apply -var-file="environments/prod/terraform.tfvars"
```

## 🔧 実装のヒント

### モジュール設計のベストプラクティス

1. **単一責任の原則**: 各モジュールは1つのAWSサービスに集中
2. **再利用性**: 環境間で共通利用できる設計
3. **変数の活用**: ハードコードを避け、変数で設定可能に

### セキュリティ考慮事項

- IAMロールは最小権限の原則に従う
- S3バケットのパブリックアクセスは必要最小限に
- DynamoDBの暗号化を有効にする

### コスト最適化

- DynamoDBはオンデマンド課金を使用
- Lambdaのメモリは128MBから開始
- 不要なリソースのタグ付けで管理

## 📝 TODO: 実装が必要なファイル

以下のファイルを実装してください：

- [ ] `versions.tf` - Terraformとプロバイダーのバージョン指定
- [ ] `variables.tf` - 共通変数の定義
- [ ] `main.tf` - モジュールの呼び出し
- [ ] `outputs.tf` - 他のコンポーネントで使用する値の出力
- [ ] `modules/s3/main.tf` - S3バケットの設定
- [ ] `modules/dynamodb/main.tf` - DynamoDBテーブルの設定
- [ ] `modules/lambda/main.tf` - Lambda関数の設定
- [ ] `modules/api-gateway/main.tf` - API Gatewayの設定
- [ ] `modules/iam/main.tf` - IAMロール・ポリシーの設定
- [ ] `environments/dev/terraform.tfvars` - 開発環境の変数値
- [ ] `environments/prod/terraform.tfvars` - 本番環境の変数値

## 🎯 学習ポイント

1. **Infrastructure as Code**: コードでインフラを管理する利点
2. **モジュール化**: 再利用可能なコンポーネントの作成
3. **環境分離**: dev/prodの適切な分離方法
4. **状態管理**: Terraformステートファイルの管理