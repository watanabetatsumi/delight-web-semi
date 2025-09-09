# Docker Orchestration トラブルシューティング

## よくある問題と解決方法

### Docker関連の問題

#### 1. コンテナが起動しない

**症状**:
- `docker-compose up` でエラーが発生
- コンテナが `Exited` 状態になる

**原因と解決方法**:

**原因1**: Dockerfileの構文エラー
```bash
# 確認方法
docker-compose config
docker build -f Dockerfile.multi -t test .

# 解決方法
# Dockerfileの構文を確認し、修正する
```

**原因2**: ポートの競合
```bash
# 確認方法
netstat -tulpn | grep :3000
lsof -i :3000

# 解決方法
# 使用中のポートを停止するか、別のポートを使用
```

**原因3**: 環境変数の設定ミス
```bash
# 確認方法
docker-compose config | grep environment

# 解決方法
# .envファイルの設定を確認・修正
```

#### 2. イメージのビルドエラー

**症状**:
- `docker build` でエラーが発生
- 依存関係のインストールに失敗

**解決方法**:

```bash
# キャッシュをクリアしてビルド
docker build --no-cache -f Dockerfile.multi -t app .

# 中間イメージを確認
docker images -a

# ビルドログを詳細表示
docker build --progress=plain -f Dockerfile.multi -t app .
```

#### 3. ネットワーク接続エラー

**症状**:
- サービス間の通信ができない
- `connection refused` エラー

**解決方法**:

```bash
# ネットワークの確認
docker network ls
docker network inspect docker-orchestration-network

# コンテナのネットワーク設定確認
docker inspect container_name | grep NetworkMode

# サービス名での接続テスト
docker exec -it frontend_container ping backend_container
```

### データベース関連の問題

#### 1. MySQL接続エラー

**症状**:
- `connection refused` エラー
- 認証エラー

**解決方法**:

```bash
# MySQLコンテナの状態確認
docker logs mysql-db

# 接続テスト
docker exec -it mysql-db mysql -u root -p

# 権限確認
docker exec -it mysql-db mysql -u root -p -e "SELECT user, host FROM mysql.user;"
```

**よくある原因**:
- パスワードの不一致
- ホスト名の設定ミス (`localhost` vs `mysql`)
- ポートの設定ミス

#### 2. マイグレーションエラー

**症状**:
- テーブルが作成されない
- SQL構文エラー

**解決方法**:

```bash
# 初期化スクリプトの確認
docker exec -it mysql-db ls -la /docker-entrypoint-initdb.d/

# 手動でSQLを実行
docker exec -it mysql-db mysql -u root -p appdb < database/init/01-create-tables.sql

# テーブル確認
docker exec -it mysql-db mysql -u root -p -e "USE appdb; SHOW TABLES;"
```

#### 3. データの永続化問題

**症状**:
- コンテナ再起動でデータが消える
- ボリュームマウントエラー

**解決方法**:

```bash
# ボリューム確認
docker volume ls
docker volume inspect docker-orchestration-mysql-data

# ボリュームの再作成
docker-compose down -v
docker volume prune
docker-compose up -d
```

### アプリケーション関連の問題

#### 1. API接続エラー

**症状**:
- フロントエンドからAPIにアクセスできない
- CORS エラー

**解決方法**:

```bash
# APIエンドポイントの確認
curl -X GET http://localhost:8080/health
curl -X GET http://localhost:8080/api/posts

# CORS設定の確認
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS http://localhost:8080/api/posts
```

**CORS設定例**:
```go
// Go/Gin での設定
router.Use(cors.New(cors.Config{
    AllowOrigins:     []string{"http://localhost:3000", "https://app.local"},
    AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
    AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
    AllowCredentials: true,
}))
```

#### 2. 認証エラー

**症状**:
- ログインできない
- セッションが保持されない

**解決方法**:

```bash
# セッションテーブルの確認
docker exec -it mysql-db mysql -u root -p -e "USE appdb; SELECT * FROM sessions;"

# Cookieの確認（ブラウザ開発者ツール）
# - HttpOnly属性
# - Secure属性
# - SameSite属性
```

#### 3. フロントエンドビルドエラー

**症状**:
- Next.jsのビルドに失敗
- 静的ファイルが見つからない

**解決方法**:

```bash
# ローカルでビルドテスト
cd simple-crud-board/frontend
npm run build

# Dockerでのビルドテスト
docker build -f Dockerfile.multi -t frontend-test .

# ビルド成果物の確認
docker run --rm frontend-test ls -la .next/
```

### Caddy関連の問題

#### 1. HTTPS証明書エラー

**症状**:
- SSL証明書エラー
- `NET::ERR_CERT_AUTHORITY_INVALID`

**解決方法**:

```bash
# Caddyログの確認
docker logs caddy-proxy

# 証明書の確認
docker exec -it caddy-proxy ls -la /data/caddy/certificates/

# ローカル証明書の信頼設定
# macOS: キーチェーンアクセスで証明書を信頼
# Windows: 証明書ストアに追加
# Linux: ca-certificates に追加
```

#### 2. プロキシ設定エラー

**症状**:
- 502 Bad Gateway エラー
- ルーティングが正しく動作しない

**解決方法**:

```bash
# Caddyfile の構文確認
docker exec -it caddy-proxy caddy validate --config /etc/caddy/Caddyfile

# バックエンドサービスの確認
docker exec -it caddy-proxy nslookup simple-crud-backend

# プロキシテスト
curl -H "Host: app.local" http://localhost/api/crud/health
```

### パフォーマンス関連の問題

#### 1. 起動が遅い

**症状**:
- サービスの起動に時間がかかる
- ヘルスチェックがタイムアウト

**解決方法**:

```bash
# 起動時間の測定
time docker-compose up -d

# リソース使用量の確認
docker stats

# ヘルスチェック設定の調整
# docker-compose.yml で interval, timeout, retries を調整
```

#### 2. メモリ不足

**症状**:
- OOM (Out of Memory) エラー
- コンテナが突然停止

**解決方法**:

```bash
# メモリ使用量の確認
docker stats --no-stream

# リソース制限の設定
# docker-compose.yml
deploy:
  resources:
    limits:
      memory: 512M
    reservations:
      memory: 256M
```

## デバッグ手順

### 1. 基本的な確認手順

```bash
# 1. サービスの状態確認
docker-compose ps

# 2. ログの確認
docker-compose logs -f

# 3. 個別サービスのログ
docker logs container_name

# 4. コンテナ内部の確認
docker exec -it container_name /bin/sh

# 5. ネットワークの確認
docker network ls
docker network inspect network_name
```

### 2. 段階的なデバッグ

```bash
# Step 1: データベースのみ起動
docker-compose up mysql -d
docker logs mysql-db

# Step 2: バックエンドを追加
docker-compose up mysql simple-crud-backend -d
curl http://localhost:8080/health

# Step 3: フロントエンドを追加
docker-compose up mysql simple-crud-backend simple-crud-frontend -d
curl http://localhost:3000

# Step 4: プロキシを追加
docker-compose up -d
curl -k https://app.local
```

### 3. ログレベルの調整

**開発環境での詳細ログ**:
```yaml
# docker-compose.yml
environment:
  - LOG_LEVEL=debug
  - GIN_MODE=debug
  - DB_LOG_LEVEL=debug
```

**本番環境での最適化**:
```yaml
environment:
  - LOG_LEVEL=info
  - GIN_MODE=release
  - DB_LOG_LEVEL=warn
```

## 予防策

### 1. 定期的なメンテナンス

```bash
# 未使用リソースのクリーンアップ
docker system prune -f

# 未使用ボリュームの削除
docker volume prune -f

# 未使用ネットワークの削除
docker network prune -f
```

### 2. 監視の実装

```bash
# ヘルスチェックの実装
curl -f http://localhost:8080/health || exit 1

# リソース監視
docker stats --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"
```

### 3. バックアップの実装

```bash
# データベースバックアップ
docker exec mysql-db mysqldump -u root -p appdb > backup.sql

# 設定ファイルのバージョン管理
git add .env docker-compose.yml Makefile
git commit -m "Update configuration"
```

## 緊急時の対応

### 1. サービス全体の停止

```bash
# 緊急停止
docker-compose down

# 強制停止
docker-compose kill

# 完全クリーンアップ
docker-compose down -v --remove-orphans
```

### 2. データの復旧

```bash
# データベース復旧
docker exec -i mysql-db mysql -u root -p appdb < backup.sql

# ボリュームの復旧
docker volume create docker-orchestration-mysql-data
# バックアップからデータを復元
```

### 3. 設定のロールバック

```bash
# Git履歴から復旧
git log --oneline
git checkout commit_hash -- docker-compose.yml

# 前回の動作確認済み設定に戻す
git revert HEAD
```

## サポートリソース

### 公式ドキュメント
- [Docker Compose](https://docs.docker.com/compose/)
- [Caddy Server](https://caddyserver.com/docs/)
- [MySQL Docker](https://hub.docker.com/_/mysql)

### コミュニティ
- [Docker Community](https://www.docker.com/community/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/docker-compose)

### ログ収集
問題が解決しない場合は、以下の情報を収集してください：

```bash
# システム情報
docker version
docker-compose version
uname -a

# 設定情報
docker-compose config

# ログ情報
docker-compose logs > logs.txt

# リソース情報
docker stats --no-stream > stats.txt
```