// HTTPハンドラーの実装（DynamoDB版）
//
// 🎯 学習ポイント:
// - GinフレームワークでのHTTPハンドラー実装
// - DynamoDBクライアントを使用したCRUD操作
// - エラーハンドリングとHTTPステータスコード
// - JSONレスポンスの生成

package handlers

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"simple-crud-board-lambda/internal/database"
	"simple-crud-board-lambda/internal/models"
)

// PostHandler は投稿関連のHTTPリクエストを処理する
type PostHandler struct {
	db *database.Client
}

// NewPostHandler は新しいPostHandlerを作成する
func NewPostHandler(db *database.Client) *PostHandler {
	return &PostHandler{db: db}
}

// GetPosts はすべての投稿を取得する (GET /api/posts)
func (h *PostHandler) GetPosts(c *gin.Context) {
	// TODO: DynamoDBからすべての投稿を取得
	// ヒント: h.db.GetAllPosts(c.Request.Context())を使用
	posts, err := h.db.GetAllPosts(c.Request.Context())
	if err != nil {
		// TODO: エラーレスポンスを返す
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to retrieve posts",
			"message": err.Error(),
		})
		return
	}

	// TODO: 投稿が0件の場合は空配列を返す
	if posts == nil {
		posts = []*models.Post{}
	}

	// TODO: 成功レスポンスを返す
	c.JSON(http.StatusOK, gin.H{
		"posts": posts,
		"count": len(posts),
	})
}

// CreatePost は新しい投稿を作成する (POST /api/posts)
func (h *PostHandler) CreatePost(c *gin.Context) {
	// TODO: リクエストボディをバインド
	var req models.CreatePostRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid JSON format",
			"message": err.Error(),
		})
		return
	}

	// TODO: リクエストデータのバリデーション
	if err := req.Validate(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Validation failed",
			"message": err.Error(),
		})
		return
	}

	// TODO: 新しい投稿オブジェクトを作成
	// ヒント: models.NewPost()を使用してUUID付きの投稿を作成
	post := models.NewPost(req.Content)
	
	// TODO: UUIDを生成してIDに設定
	// ヒント: uuid.New().String()
	post.ID = uuid.New().String()

	// TODO: DynamoDBに投稿を保存
	err := h.db.CreatePost(c.Request.Context(), post)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to create post",
			"message": err.Error(),
		})
		return
	}

	// TODO: 作成された投稿を返す
	c.JSON(http.StatusCreated, gin.H{
		"message": "Post created successfully",
		"post":    post,
	})
}

// UpdatePost は既存の投稿を更新する (PUT /api/posts/:id)
func (h *PostHandler) UpdatePost(c *gin.Context) {
	// TODO: URLパラメータからIDを取得
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Post ID is required",
		})
		return
	}

	// TODO: IDの形式をバリデーション（UUID形式かチェック）
	if _, err := uuid.Parse(id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid post ID format",
			"message": "Post ID must be a valid UUID",
		})
		return
	}

	// TODO: リクエストボディをバインド
	var req models.UpdatePostRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid JSON format",
			"message": err.Error(),
		})
		return
	}

	// TODO: リクエストデータのバリデーション
	if err := req.Validate(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Validation failed",
			"message": err.Error(),
		})
		return
	}

	// TODO: DynamoDBで投稿を更新
	updatedPost, err := h.db.UpdatePost(c.Request.Context(), id, req.Content)
	if err != nil {
		// TODO: エラーの種類に応じて適切なHTTPステータスを返す
		if strings.Contains(err.Error(), "not found") || strings.Contains(err.Error(), "conditional check failed") {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   "Post not found",
				"message": "The specified post does not exist",
			})
			return
		}
		
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to update post",
			"message": err.Error(),
		})
		return
	}

	// TODO: 更新された投稿を返す
	c.JSON(http.StatusOK, gin.H{
		"message": "Post updated successfully",
		"post":    updatedPost,
	})
}

// DeletePost は指定された投稿を削除する (DELETE /api/posts/:id)
func (h *PostHandler) DeletePost(c *gin.Context) {
	// TODO: URLパラメータからIDを取得
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Post ID is required",
		})
		return
	}

	// TODO: IDの形式をバリデーション（UUID形式かチェック）
	if _, err := uuid.Parse(id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid post ID format",
			"message": "Post ID must be a valid UUID",
		})
		return
	}

	// TODO: DynamoDBから投稿を削除
	err := h.db.DeletePost(c.Request.Context(), id)
	if err != nil {
		// TODO: エラーの種類に応じて適切なHTTPステータスを返す
		if strings.Contains(err.Error(), "not found") || strings.Contains(err.Error(), "conditional check failed") {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   "Post not found",
				"message": "The specified post does not exist",
			})
			return
		}
		
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to delete post",
			"message": err.Error(),
		})
		return
	}

	// TODO: 削除成功レスポンスを返す
	// ヒント: 204 No Content が一般的
	c.JSON(http.StatusOK, gin.H{
		"message": "Post deleted successfully",
	})
}

// GetPost は指定されたIDの投稿を取得する (GET /api/posts/:id) - オプション
func (h *PostHandler) GetPost(c *gin.Context) {
	// TODO: URLパラメータからIDを取得
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Post ID is required",
		})
		return
	}

	// TODO: IDの形式をバリデーション
	if _, err := uuid.Parse(id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid post ID format",
			"message": "Post ID must be a valid UUID",
		})
		return
	}

	// TODO: DynamoDBから投稿を取得
	post, err := h.db.GetPost(c.Request.Context(), id)
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   "Post not found",
				"message": "The specified post does not exist",
			})
			return
		}
		
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to retrieve post",
			"message": err.Error(),
		})
		return
	}

	// TODO: 投稿を返す
	c.JSON(http.StatusOK, gin.H{
		"post": post,
	})
}