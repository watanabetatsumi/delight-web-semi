// データモデル定義
//
// 🎯 学習ポイント:
// - DynamoDB用のデータモデル設計
// - JSON/DynamoDBタグの使用
// - バリデーション用の構造体

package models

import (
	"time"
)

// Post は掲示板の投稿を表すモデル
type Post struct {
	// TODO: DynamoDBのパーティションキーとして使用するID
	// ヒント: UUIDを使用してユニークなIDを生成
	ID string `json:"id" dynamodbav:"id"`

	// TODO: 投稿内容
	Content string `json:"content" dynamodbav:"content"`

	// TODO: 作成日時
	// ヒント: time.Time型を使用し、DynamoDBではISO8601形式で保存
	CreatedAt time.Time `json:"created_at" dynamodbav:"created_at"`

	// TODO: 更新日時
	UpdatedAt time.Time `json:"updated_at" dynamodbav:"updated_at"`
}

// CreatePostRequest は投稿作成リクエストの構造体
type CreatePostRequest struct {
	// TODO: 投稿内容（必須）
	Content string `json:"content" binding:"required" validate:"required,min=1,max=1000"`
}

// UpdatePostRequest は投稿更新リクエストの構造体
type UpdatePostRequest struct {
	// TODO: 更新する投稿内容（必須）
	Content string `json:"content" binding:"required" validate:"required,min=1,max=1000"`
}

// Validate はCreatePostRequestのバリデーションを行う
func (r *CreatePostRequest) Validate() error {
	// TODO: 投稿内容のバリデーション
	// - 空文字チェック
	// - 最小文字数チェック（例：1文字以上）
	// - 最大文字数チェック（例：1000文字以下）
	
	if r.Content == "" {
		return fmt.Errorf("content is required")
	}
	
	if len(r.Content) < 1 {
		return fmt.Errorf("content must be at least 1 character")
	}
	
	if len(r.Content) > 1000 {
		return fmt.Errorf("content must be less than 1000 characters")
	}
	
	return nil
}

// Validate はUpdatePostRequestのバリデーションを行う
func (r *UpdatePostRequest) Validate() error {
	// TODO: CreatePostRequestと同様のバリデーション
	if r.Content == "" {
		return fmt.Errorf("content is required")
	}
	
	if len(r.Content) < 1 {
		return fmt.Errorf("content must be at least 1 character")
	}
	
	if len(r.Content) > 1000 {
		return fmt.Errorf("content must be less than 1000 characters")
	}
	
	return nil
}

// NewPost は新しいPost構造体を作成する
func NewPost(content string) *Post {
	now := time.Now()
	
	return &Post{
		// TODO: UUIDを生成してIDに設定
		// ヒント: github.com/google/uuid パッケージを使用
		ID:        "TODO: UUIDを生成",
		Content:   content,
		CreatedAt: now,
		UpdatedAt: now,
	}
}

// UpdateContent は投稿内容を更新する
func (p *Post) UpdateContent(content string) {
	p.Content = content
	p.UpdatedAt = time.Now()
}

// IsEmpty は投稿が空かどうかを判定する
func (p *Post) IsEmpty() bool {
	return p.Content == ""
}

// Age は投稿の経過時間を返す
func (p *Post) Age() time.Duration {
	return time.Since(p.CreatedAt)
}