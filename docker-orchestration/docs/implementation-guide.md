# Docker Orchestration 実装ガイド

## はじめに

このガイドでは、Docker Orchestrationプロジェクトの実装手順を段階的に説明します。各フェーズを順番に実装することで、完全なマイクロサービス環境を構築できます。

## 実装フェーズ

### Phase 1: 基盤構築

#### 1.1 Makefile実装

**目標**: 開発ワークフローの自動化

**実装手順**:
1. `Makefile.template` を `Makefile` にコピー
2. 基本コマンドを実装:
   ```makefile
   up:
       docker-compose up -d
   
   down:
       docker-compose down
   
   build:
       docker-compose build --no-cache
   
   logs:
       docker-compose logs -f
   ```

**確認方法**:
```bash
make help  # ヘルプが表示される
make up    # サービスが起動する（エラーでも可）
make down  # サービスが停止する
```

#### 1.2 Docker Compose設定

**目標**: 全サービスの統合管理

**実装手順**:
1. `docker-compose.template.yml` を `docker-compose.yml` にコピー
2. 各サービスの設定を実装:
   - ネットワーク設定
   - ボリューム設定
   - 環境変数設定
   - 依存関係設定

**確認方法**:
```bash
docker-compose config  # 設定が正しいか確認
docker-compose up mysql  # MySQLサービスのみ起動
```

#### 1.3 環境変数管理

**目標**: 設定の外部化

**実装手順**:
1. `.env.example` を `.env` にコピー
2. 開発環境用の値を設定
3. Makefileで環境変数を読み込み

**確認方法**:
```bash
cat .env  # 環境変数が設定されている
make up   # 環境変数が正しく読み込まれる
```

### Phase 2: データベース統合

#### 2.1 MySQL環境構築

**目標**: SQLiteからMySQLへの移行

**実装手順**:
1. MySQLサービスの設定を完成
2. 初期化スクリプトの配置
3. ヘルスチェックの実装

**確認方法**:
```bash
make up-db  # MySQLが起動
docker exec -it mysql-db mysql -u root -p  # 接続確認
```

#### 2.2 マイグレーションシステム

**目標**: データベーススキーマ管理

**実装手順**:
1. `database/migrations/` ディレクトリ作成
2. マイグレーションファイルの作成
3. マイグレーション実行コマンドの実装

**確認方法**:
```bash
make migrate  # マイグレーションが実行される
make shell-db  # テーブルが作成されている
```

### Phase 3: マルチステージビルド

#### 3.1 バックエンドDockerfile

**目標**: Go最適化

**実装手順**:
1. `Dockerfile.multi.template` を `Dockerfile.multi` にコピー
2. ビルドステージの実装:
   ```dockerfile
   FROM golang:1.21-alpine AS builder
   WORKDIR /app
   COPY go.mod go.sum ./
   RUN go mod download
   COPY . .
   RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o main .
   ```
3. 本番ステージの実装:
   ```dockerfile
   FROM alpine:latest AS runner
   RUN apk --no-cache add ca-certificates
   WORKDIR /app
   COPY --from=builder /app/main .
   EXPOSE 8080
   CMD ["./main"]
   ```

**確認方法**:
```bash
docker build -f Dockerfile.multi -t backend:latest .
docker images backend:latest  # イメージサイズを確認
```

#### 3.2 フロントエンドDockerfile

**目標**: Next.js最適化

**実装手順**:
1. Next.js設定の最適化:
   ```javascript
   // next.config.js
   module.exports = {
     output: 'standalone',
     experimental: {
       outputFileTracingRoot: path.join(__dirname, '../../'),
     },
   }
   ```
2. マルチステージDockerfileの実装
3. 非rootユーザーでの実行設定

**確認方法**:
```bash
docker build -f Dockerfile.multi -t frontend:latest .
docker run --rm -p 3000:3000 frontend:latest
```

### Phase 4: リバースプロキシ

#### 4.1 Caddy設定

**目標**: HTTPS自動化とルーティング

**実装手順**:
1. `Caddyfile.template` を `Caddyfile` にコピー
2. 基本設定の実装:
   ```caddyfile
   {
       auto_https off
       local_certs
   }
   
   app.local {
       reverse_proxy /api/crud/* simple-crud-backend:8080
       reverse_proxy /api/auth/* user-auth-backend:8081
       reverse_proxy /crud/* simple-crud-frontend:3000
       reverse_proxy /auth/* user-auth-frontend:3001
       reverse_proxy /* simple-crud-frontend:3000
   }
   ```

**確認方法**:
```bash
make up  # 全サービス起動
curl -k https://app.local  # HTTPSアクセス確認
```

#### 4.2 SSL証明書管理

**目標**: セキュアな通信

**実装手順**:
1. ローカル証明書の設定
2. ブラウザでの証明書信頼設定
3. セキュリティヘッダーの追加

**確認方法**:
```bash
curl -k -I https://app.local  # セキュリティヘッダー確認
```

### Phase 5: クリーンアーキテクチャ

#### 5.1 Domain層実装

**目標**: エンティティとビジネスルール

**実装手順**:
1. エンティティの定義:
   ```go
   // internal/domain/entities/post.go
   type Post struct {
       ID        int       `json:"id"`
       Content   string    `json:"content"`
       UserID    int       `json:"user_id"`
       CreatedAt time.Time `json:"created_at"`
       UpdatedAt time.Time `json:"updated_at"`
   }
   
   func (p *Post) Validate() error {
       if strings.TrimSpace(p.Content) == "" {
           return errors.New("content cannot be empty")
       }
       return nil
   }
   ```

2. 値オブジェクトの実装
3. ドメインルールの実装

#### 5.2 Application層実装

**目標**: サービスとインターフェース

**実装手順**:
1. リポジトリインターフェースの定義:
   ```go
   // internal/application/interfaces/post_repository.go
   type PostRepository interface {
       Create(ctx context.Context, post *entities.Post) error
       GetByID(ctx context.Context, id int) (*entities.Post, error)
       GetByUserID(ctx context.Context, userID int) ([]*entities.Post, error)
       Update(ctx context.Context, post *entities.Post) error
       Delete(ctx context.Context, id int) error
   }
   ```

2. アプリケーションサービスの実装:
   ```go
   // internal/application/services/post_service.go
   type PostService struct {
       postRepo interfaces.PostRepository
       userRepo interfaces.UserRepository
   }
   
   func (s *PostService) CreatePost(ctx context.Context, userID int, content string) (*entities.Post, error) {
       post := &entities.Post{
           Content: content,
           UserID:  userID,
       }
       
       if err := post.Validate(); err != nil {
           return nil, err
       }
       
       return post, s.postRepo.Create(ctx, post)
   }
   ```

#### 5.3 Infrastructure層実装

**目標**: データベースアクセス

**実装手順**:
1. MySQLリポジトリの実装:
   ```go
   // internal/infrastructure/repositories/mysql_post_repository.go
   type MySQLPostRepository struct {
       db *sql.DB
   }
   
   func (r *MySQLPostRepository) Create(ctx context.Context, post *entities.Post) error {
       query := `INSERT INTO posts (content, user_id, created_at, updated_at) VALUES (?, ?, ?, ?)`
       _, err := r.db.ExecContext(ctx, query, post.Content, post.UserID, time.Now(), time.Now())
       return err
   }
   ```

2. データベース接続の実装
3. 外部サービス連携の実装

#### 5.4 Presentation層実装

**目標**: HTTPハンドラー

**実装手順**:
1. HTTPハンドラーの実装:
   ```go
   // internal/presentation/handlers/post_handler.go
   type PostHandler struct {
       postService *services.PostService
   }
   
   func (h *PostHandler) CreatePost(c *gin.Context) {
       var req CreatePostRequest
       if err := c.ShouldBindJSON(&req); err != nil {
           c.JSON(400, gin.H{"error": err.Error()})
           return
       }
       
       userID := getUserIDFromContext(c)
       post, err := h.postService.CreatePost(c.Request.Context(), userID, req.Content)
       if err != nil {
           c.JSON(500, gin.H{"error": err.Error()})
           return
       }
       
       c.JSON(201, post)
   }
   ```

2. ミドルウェアの実装
3. ルーティングの設定

#### 5.5 依存性注入

**目標**: 疎結合の実現

**実装手順**:
1. DIコンテナの実装:
   ```go
   // cmd/server/main.go
   func main() {
       // Database connection
       db := setupDatabase()
       
       // Repository layer
       postRepo := repositories.NewMySQLPostRepository(db)
       userRepo := repositories.NewMySQLUserRepository(db)
       
       // Service layer
       postService := services.NewPostService(postRepo, userRepo)
       userService := services.NewUserService(userRepo)
       
       // Handler layer
       postHandler := handlers.NewPostHandler(postService)
       userHandler := handlers.NewUserHandler(userService)
       
       // Router setup
       router := setupRouter(postHandler, userHandler)
       router.Run(":8080")
   }
   ```

### Phase 6: 統合とテスト

#### 6.1 サービス統合

**目標**: 既存アプリケーションの統合

**実装手順**:
1. 既存コードのクリーンアーキテクチャへの移行
2. API エンドポイントの統合
3. 認証システムの統合

#### 6.2 ヘルスチェック

**目標**: サービス監視

**実装手順**:
1. ヘルスチェックエンドポイントの実装:
   ```go
   func (h *HealthHandler) Check(c *gin.Context) {
       // Database connection check
       if err := h.db.Ping(); err != nil {
           c.JSON(503, gin.H{
               "status": "unhealthy",
               "database": "disconnected",
           })
           return
       }
       
       c.JSON(200, gin.H{
           "status": "healthy",
           "database": "connected",
           "timestamp": time.Now(),
       })
   }
   ```

2. Docker Composeヘルスチェックの設定
3. 監視ダッシュボードの実装

#### 6.3 統合テスト

**目標**: エンドツーエンドテスト

**実装手順**:
1. テスト環境の構築
2. API テストの実装
3. E2E テストの実装

## 実装のコツ

### 段階的実装

1. **最小構成から開始**: 基本的な機能から実装
2. **一つずつ確認**: 各段階で動作確認
3. **エラーハンドリング**: 適切なエラー処理を実装
4. **ログ出力**: デバッグ用のログを追加

### よくある問題と解決方法

#### Docker関連

**問題**: コンテナが起動しない
**解決**: 
- ログを確認: `docker logs container_name`
- 設定を確認: `docker-compose config`
- ポートの競合を確認

**問題**: ネットワーク接続エラー
**解決**:
- ネットワーク設定を確認
- サービス名での接続を確認
- ファイアウォール設定を確認

#### データベース関連

**問題**: 接続エラー
**解決**:
- MySQLが起動しているか確認
- 認証情報が正しいか確認
- ネットワーク設定を確認

**問題**: マイグレーションエラー
**解決**:
- SQLファイルの構文を確認
- 権限設定を確認
- 既存データとの競合を確認

#### アプリケーション関連

**問題**: API エラー
**解決**:
- ログを確認
- エンドポイントのパスを確認
- CORS設定を確認

## 評価基準

### 基本要件 (60点)

- [ ] **Makefile**: 基本コマンドが動作する
- [ ] **Docker Compose**: 全サービスが起動する
- [ ] **MySQL**: データベースが正常に動作する
- [ ] **API**: 基本的なCRUD操作が動作する

### 発展要件 (30点)

- [ ] **マルチステージビルド**: イメージサイズが最適化されている
- [ ] **HTTPS**: Caddyで安全な通信が実現されている
- [ ] **クリーンアーキテクチャ**: 適切な層分離が実装されている
- [ ] **認証**: ユーザー認証が正常に動作する

### 応用要件 (10点)

- [ ] **ヘルスチェック**: 監視機能が実装されている
- [ ] **セキュリティ**: 適切なセキュリティ設定がされている
- [ ] **パフォーマンス**: 最適化が実装されている
- [ ] **ドキュメント**: 適切な文書化がされている

## 次のステップ

実装完了後は以下を検討してください:

1. **CI/CD パイプライン**: 自動ビルド・デプロイ
2. **監視システム**: Prometheus + Grafana
3. **ログ集約**: ELK Stack
4. **セキュリティ強化**: WAF、脆弱性スキャン
5. **パフォーマンス最適化**: キャッシュ、CDN

頑張って実装してください！🚀