// Lambda関数のメインエントリーポイント
//
// 🎯 学習ポイント:
// - AWS Lambda Go API Proxyを使用してGinルーターをLambdaで動作させる
// - API Gateway Proxy Integrationでリクエストを処理
// - 環境変数から設定を読み込む

package main

import (
	"context"
	"log"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/awslabs/aws-lambda-go-api-proxy/gin"
	"github.com/gin-contrib/cors"
	ginFramework "github.com/gin-gonic/gin"

	"simple-crud-board-lambda/internal/config"
	"simple-crud-board-lambda/internal/database"
	"simple-crud-board-lambda/internal/handlers"
)

var ginLambda *ginadapter.GinLambda

// init関数でLambda関数の初期化を行う
// Lambda関数は再利用されるため、初期化処理は一度だけ実行される
func init() {
	log.Println("Initializing Lambda function...")

	// TODO: 設定の読み込み
	// ヒント: config.Load()を実装して環境変数から設定を読み込む
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	// TODO: DynamoDBクライアントの初期化
	// ヒント: database.NewClient()を実装してDynamoDBクライアントを作成
	dbClient, err := database.NewClient(cfg.DynamoDBTableName)
	if err != nil {
		log.Fatalf("Failed to initialize database client: %v", err)
	}

	// TODO: Ginルーターの設定
	// ヒント: setupRouter()関数を実装してルーターを設定
	router := setupRouter(dbClient)

	// TODO: Gin Lambda アダプターの初期化
	// ヒント: ginadapter.New(router)でアダプターを作成
	ginLambda = ginadapter.New(router)
}

// setupRouter はGinルーターを設定する
func setupRouter(dbClient *database.Client) *ginFramework.Engine {
	// TODO: Ginモードの設定
	// ヒント: 本番環境ではgin.SetMode(gin.ReleaseMode)
	if os.Getenv("GIN_MODE") == "" {
		ginFramework.SetMode(ginFramework.ReleaseMode)
	}

	// TODO: Ginルーターの作成
	r := ginFramework.Default()

	// TODO: CORS設定
	// ヒント: フロントエンドからのクロスオリジンリクエストを許可
	config := cors.DefaultConfig()
	// TODO: 許可するオリジンを設定
	// 開発環境: ["http://localhost:3000"]
	// 本番環境: ["https://your-domain.com"]
	config.AllowOrigins = []string{"TODO: 許可するオリジンを設定"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	r.Use(cors.New(config))

	// TODO: ハンドラーの初期化
	// ヒント: handlers.NewPostHandler()を実装
	postHandler := handlers.NewPostHandler(dbClient)

	// TODO: ルートの設定
	// ヒント: /api/posts のエンドポイントを設定
	api := r.Group("/api")
	{
		// TODO: 投稿関連のルートを設定
		// GET /api/posts - 全投稿取得
		// POST /api/posts - 投稿作成
		// PUT /api/posts/:id - 投稿更新
		// DELETE /api/posts/:id - 投稿削除
		api.GET("/posts", postHandler.GetPosts)
		api.POST("/posts", postHandler.CreatePost)
		api.PUT("/posts/:id", postHandler.UpdatePost)
		api.DELETE("/posts/:id", postHandler.DeletePost)
	}

	// TODO: ヘルスチェックエンドポイント
	r.GET("/health", func(c *ginFramework.Context) {
		c.JSON(200, ginFramework.H{
			"status":  "ok",
			"service": "simple-crud-board-api",
		})
	})

	return r
}

// Handler はLambda関数のハンドラー
func Handler(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// TODO: リクエストのログ出力（デバッグ用）
	log.Printf("Request: %s %s", req.HTTPMethod, req.Path)

	// TODO: Gin Lambda アダプターでリクエストを処理
	// ヒント: ginLambda.ProxyWithContext()を使用
	return ginLambda.ProxyWithContext(ctx, req)
}

// main はLambda関数のエントリーポイント
func main() {
	// TODO: Lambda関数の開始
	// ヒント: lambda.Start(Handler)でハンドラーを登録
	lambda.Start(Handler)
}