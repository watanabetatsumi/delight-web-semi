# Docker Orchestration 学習課題

## 概要

この課題では、MakefileとDockerを使いこなして、これまで作成したWebアプリケーション（simple-crud-board、user-authentication）を統合し、本格的なマイクロサービス環境を構築します。

## 学習目標

1. **Docker Compose** を使った複数サービスの統合管理
2. **Makefile** による開発ワークフローの自動化
3. **マルチステージビルド** によるDockerイメージの最適化
4. **Caddy** を使ったリバースプロキシとHTTPS通信
5. **MySQL** を使った本格的なデータベース環境
6. **クリーンアーキテクチャ** に基づくGoバックエンドの実装
7. **Docker Network** によるサービス間通信の管理

## 前提条件

- simple-crud-board プロジェクトが完成していること
- user-authentication プロジェクトが完成していること
- Docker と Docker Compose がインストールされていること
- 基本的なMakefileの知識があること

## プロジェクト構造

```
docker-orchestration/
├── README.md                    # このファイル
├── Makefile                     # 開発ワークフロー自動化（要実装）
├── docker-compose.yml           # サービス統合設定（要実装）
├── .env.example                 # 環境変数設定例
├── caddy/
│   └── Caddyfile               # リバースプロキシ設定（要実装）
├── database/
│   ├── init/                   # データベース初期化スクリプト
│   └── migrations/             # マイグレーションファイル（要実装）
├── simple-crud-board/
│   ├── frontend/
│   │   └── Dockerfile.multi    # マルチステージDockerfile（要実装）
│   └── backend/
│       ├── Dockerfile.multi    # マルチステージDockerfile（要実装）
│       └── internal/           # クリーンアーキテクチャ実装（要実装）
├── user-authentication/
│   ├── frontend/
│   │   └── Dockerfile.multi    # マルチステージDockerfile（要実装）
│   └── backend/
│       ├── Dockerfile.multi    # マルチステージDockerfile（要実装）
│       └── internal/           # クリーンアーキテクチャ実装（要実装）
└── docs/
    ├── architecture.md         # アーキテクチャ設計書
    ├── deployment.md           # デプロイメント手順
    └── troubleshooting.md      # トラブルシューティング
```

## 実装課題

### Phase 1: 基盤構築
1. **Makefile作成** - 開発ワークフローの自動化
2. **Docker Compose設定** - 全サービスの統合管理
3. **環境変数管理** - 設定の外部化

### Phase 2: データベース統合
4. **MySQL環境構築** - SQLiteからMySQLへの移行
5. **マイグレーションシステム** - データベーススキーマ管理
6. **データベース接続** - アプリケーションとの統合

### Phase 3: マルチステージビルド
7. **フロントエンドDockerfile** - Next.js最適化
8. **バックエンドDockerfile** - Go最適化
9. **イメージサイズ最適化** - セキュリティ向上

### Phase 4: リバースプロキシ
10. **Caddy設定** - HTTPS自動化
11. **ルーティング設定** - サービス間通信
12. **SSL証明書管理** - セキュリティ強化

### Phase 5: クリーンアーキテクチャ
13. **Domain層実装** - エンティティとビジネスルール
14. **Application層実装** - サービスとインターフェース
15. **Infrastructure層実装** - データベースアクセス
16. **Presentation層実装** - HTTPハンドラー

### Phase 6: 統合とテスト
17. **サービス統合** - 既存アプリケーションの統合
18. **ヘルスチェック** - サービス監視
19. **統合テスト** - エンドツーエンドテスト
20. **パフォーマンス最適化** - 本番環境対応

## 評価基準

### 基本要件 (60点)
- [ ] Makefileで全サービスを起動・停止できる
- [ ] MySQLデータベースが正常に動作する
- [ ] 各サービスがDockerコンテナとして動作する
- [ ] 基本的なCRUD操作が動作する

### 発展要件 (30点)
- [ ] マルチステージビルドでイメージサイズが最適化されている
- [ ] CaddyでHTTPS通信が実現されている
- [ ] クリーンアーキテクチャが適切に実装されている
- [ ] サービス間通信が適切に設定されている

### 応用要件 (10点)
- [ ] ヘルスチェックとモニタリングが実装されている
- [ ] セキュリティ設定が適切に行われている
- [ ] パフォーマンス最適化が実装されている
- [ ] 適切なドキュメントが作成されている

## 開始方法

1. このディレクトリをプロジェクトルートにコピー
2. `.env.example` を `.env` にコピーして設定を調整
3. `Phase 1` から順番に実装を開始
4. 各フェーズ完了後、動作確認を実施

## 参考資料

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Caddy Documentation](https://caddyserver.com/docs/)
- [Clean Architecture in Go](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [MySQL Docker Image](https://hub.docker.com/_/mysql)

## サポート

実装中に困った場合は、以下を確認してください：

1. `docs/troubleshooting.md` - よくある問題と解決方法
2. `docs/architecture.md` - アーキテクチャの詳細説明
3. 各ディレクトリの `README.md` - 個別の実装ガイド

頑張って実装してください！🚀