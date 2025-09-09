// DynamoDBクライアントとCRUD操作の実装
//
// 🎯 学習ポイント:
// - AWS SDK for Go v2の使用方法
// - DynamoDB操作（PutItem, GetItem, UpdateItem, DeleteItem, Scan）
// - エラーハンドリングとAWS固有のエラー処理

package database

import (
	"context"
	"fmt"
	"log"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"

	"simple-crud-board-lambda/internal/models"
)

// Client はDynamoDBクライアントを管理する構造体
type Client struct {
	dynamodb  *dynamodb.Client
	tableName string
}

// NewClient は新しいDynamoDBクライアントを作成する
func NewClient(tableName string) (*Client, error) {
	// TODO: AWS設定の読み込み
	// ヒント: config.LoadDefaultConfig()を使用
	cfg, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		return nil, fmt.Errorf("failed to load AWS config: %w", err)
	}

	// TODO: DynamoDBクライアントの作成
	// ヒント: dynamodb.NewFromConfig(cfg)
	client := dynamodb.NewFromConfig(cfg)

	return &Client{
		dynamodb:  client,
		tableName: tableName,
	}, nil
}

// CreatePost は新しい投稿をDynamoDBに作成する
func (c *Client) CreatePost(ctx context.Context, post *models.Post) error {
	// TODO: 投稿データをDynamoDB属性値に変換
	// ヒント: attributevalue.MarshalMap()を使用
	item, err := attributevalue.MarshalMap(post)
	if err != nil {
		return fmt.Errorf("failed to marshal post: %w", err)
	}

	// TODO: PutItem操作でアイテムを作成
	// ヒント: dynamodb.PutItemInput構造体を使用
	input := &dynamodb.PutItemInput{
		TableName: aws.String(c.tableName),
		Item:      item,
		// TODO: 条件式を追加（オプション）
		// 同じIDの投稿が既に存在する場合はエラーにする
		// ConditionExpression: aws.String("attribute_not_exists(id)"),
	}

	// TODO: PutItem操作を実行
	_, err = c.dynamodb.PutItem(ctx, input)
	if err != nil {
		// TODO: DynamoDB固有のエラーハンドリング
		return c.handleDynamoDBError(err, "create post")
	}

	log.Printf("Created post with ID: %s", post.ID)
	return nil
}

// GetPost はIDで指定された投稿を取得する
func (c *Client) GetPost(ctx context.Context, id string) (*models.Post, error) {
	// TODO: GetItem操作の入力を作成
	// ヒント: パーティションキーでアイテムを取得
	input := &dynamodb.GetItemInput{
		TableName: aws.String(c.tableName),
		Key: map[string]types.AttributeValue{
			// TODO: パーティションキーを設定
			"id": &types.AttributeValueMemberS{Value: id},
		},
	}

	// TODO: GetItem操作を実行
	result, err := c.dynamodb.GetItem(ctx, input)
	if err != nil {
		return nil, c.handleDynamoDBError(err, "get post")
	}

	// TODO: アイテムが見つからない場合の処理
	if result.Item == nil {
		return nil, fmt.Errorf("post with ID %s not found", id)
	}

	// TODO: DynamoDB属性値を投稿構造体に変換
	// ヒント: attributevalue.UnmarshalMap()を使用
	var post models.Post
	err = attributevalue.UnmarshalMap(result.Item, &post)
	if err != nil {
		return nil, fmt.Errorf("failed to unmarshal post: %w", err)
	}

	return &post, nil
}

// GetAllPosts はすべての投稿を取得する（作成日時の降順）
func (c *Client) GetAllPosts(ctx context.Context) ([]*models.Post, error) {
	// TODO: Scan操作の入力を作成
	// ヒント: 全件取得にはScanを使用（小規模なテーブル用）
	input := &dynamodb.ScanInput{
		TableName: aws.String(c.tableName),
		// TODO: 投影式を追加（必要な属性のみ取得）
		// ProjectionExpression: aws.String("id, content, created_at, updated_at"),
	}

	// TODO: Scan操作を実行
	result, err := c.dynamodb.Scan(ctx, input)
	if err != nil {
		return nil, c.handleDynamoDBError(err, "scan posts")
	}

	// TODO: 結果をPost構造体のスライスに変換
	var posts []*models.Post
	for _, item := range result.Items {
		var post models.Post
		err := attributevalue.UnmarshalMap(item, &post)
		if err != nil {
			log.Printf("Failed to unmarshal post: %v", err)
			continue // エラーのあるアイテムはスキップ
		}
		posts = append(posts, &post)
	}

	// TODO: 作成日時で降順ソート
	// ヒント: sort.Slice()を使用してCreatedAtでソート
	// sort.Slice(posts, func(i, j int) bool {
	//     return posts[i].CreatedAt.After(posts[j].CreatedAt)
	// })

	log.Printf("Retrieved %d posts", len(posts))
	return posts, nil
}

// UpdatePost は既存の投稿を更新する
func (c *Client) UpdatePost(ctx context.Context, id string, content string) (*models.Post, error) {
	// TODO: UpdateItem操作の入力を作成
	// ヒント: UpdateExpressionで特定の属性のみ更新
	input := &dynamodb.UpdateItemInput{
		TableName: aws.String(c.tableName),
		Key: map[string]types.AttributeValue{
			"id": &types.AttributeValueMemberS{Value: id},
		},
		// TODO: 更新式を設定
		UpdateExpression: aws.String("SET content = :content, updated_at = :updated_at"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":content": &types.AttributeValueMemberS{Value: content},
			// TODO: 現在時刻をISO8601形式で設定
			":updated_at": &types.AttributeValueMemberS{Value: "TODO: 現在時刻を設定"},
		},
		// TODO: 条件式を追加（投稿が存在する場合のみ更新）
		ConditionExpression: aws.String("attribute_exists(id)"),
		// TODO: 更新後の値を返すように設定
		ReturnValues: types.ReturnValueAllNew,
	}

	// TODO: UpdateItem操作を実行
	result, err := c.dynamodb.UpdateItem(ctx, input)
	if err != nil {
		return nil, c.handleDynamoDBError(err, "update post")
	}

	// TODO: 更新後のアイテムをPost構造体に変換
	var post models.Post
	err = attributevalue.UnmarshalMap(result.Attributes, &post)
	if err != nil {
		return nil, fmt.Errorf("failed to unmarshal updated post: %w", err)
	}

	log.Printf("Updated post with ID: %s", id)
	return &post, nil
}

// DeletePost は指定されたIDの投稿を削除する
func (c *Client) DeletePost(ctx context.Context, id string) error {
	// TODO: DeleteItem操作の入力を作成
	input := &dynamodb.DeleteItemInput{
		TableName: aws.String(c.tableName),
		Key: map[string]types.AttributeValue{
			"id": &types.AttributeValueMemberS{Value: id},
		},
		// TODO: 条件式を追加（投稿が存在する場合のみ削除）
		ConditionExpression: aws.String("attribute_exists(id)"),
	}

	// TODO: DeleteItem操作を実行
	_, err := c.dynamodb.DeleteItem(ctx, input)
	if err != nil {
		return c.handleDynamoDBError(err, "delete post")
	}

	log.Printf("Deleted post with ID: %s", id)
	return nil
}

// handleDynamoDBError はDynamoDB固有のエラーを処理する
func (c *Client) handleDynamoDBError(err error, operation string) error {
	// TODO: DynamoDB固有のエラータイプを判定
	// ヒント: errors.As()を使用してエラータイプを判定

	// ConditionalCheckFailedException: 条件チェック失敗
	var conditionalCheckFailed *types.ConditionalCheckFailedException
	if errors.As(err, &conditionalCheckFailed) {
		return fmt.Errorf("conditional check failed for %s: item may not exist or condition not met", operation)
	}

	// ResourceNotFoundException: リソースが見つからない
	var resourceNotFound *types.ResourceNotFoundException
	if errors.As(err, &resourceNotFound) {
		return fmt.Errorf("table not found for %s: %s", operation, c.tableName)
	}

	// ValidationException: バリデーションエラー
	var validationException *types.ValidationException
	if errors.As(err, &validationException) {
		return fmt.Errorf("validation error for %s: %s", operation, *validationException.Message)
	}

	// その他のエラー
	return fmt.Errorf("DynamoDB error for %s: %w", operation, err)
}