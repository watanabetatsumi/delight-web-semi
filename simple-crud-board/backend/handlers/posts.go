package handlers

import (
	"database/sql"
	"net/http"
	"simple-crud-board/models"

	"github.com/gin-gonic/gin"
)

// PostHandler handles post-related HTTP requests
type PostHandler struct {
	db *sql.DB
}

// NewPostHandler creates a new PostHandler
func NewPostHandler(db *sql.DB) *PostHandler {
	return &PostHandler{db: db}
}

// GetPosts handles GET /api/posts
func (h *PostHandler) GetPosts(c *gin.Context) {
	// TODO: Implement get all posts
	// This should:
	// 1. Query all posts from the database with SQL: SELECT id, content, created_at, updated_at FROM posts ORDER BY created_at DESC
	// 2. Scan results into Post structs
	// 3. Return posts as JSON array (empty array [] if no posts)
	
	c.JSON(http.StatusOK, gin.H{
		"message": "Not implemented - Please implement this handler",
		"hint": "Use SQL: SELECT id, content, created_at, updated_at FROM posts ORDER BY created_at DESC",
		"expected_return": "Array of Post objects or empty array []",
	})
}

// CreatePost handles POST /api/posts
func (h *PostHandler) CreatePost(c *gin.Context) {
	// TODO: Implement create post
	// This should:
	// 1. Bind JSON request to CreatePostRequest struct
	// 2. Validate the content (not empty, length limits)
	// 3. Insert new post into database with SQL: INSERT INTO posts (content) VALUES (?)
	// 4. Get the inserted post ID and timestamps
	// 5. Return created post with ID and timestamps
	
	var req models.CreatePostRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON format"})
		return
	}

	// Server-side validation (students should implement this)
	if len(req.Content) < 3 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Post content must be at least 3 characters long"})
		return
	}
	
	if len(req.Content) > 1000 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Post content cannot exceed 1000 characters"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Not implemented - Please implement this handler",
		"hint": "Use SQL: INSERT INTO posts (content) VALUES (?) and return the created post",
		"received_content": req.Content,
		"validation": "passed",
	})
}

// UpdatePost handles PUT /api/posts/:id
func (h *PostHandler) UpdatePost(c *gin.Context) {
	// TODO: Implement update post
	// This should:
	// 1. Get post ID from URL parameter and validate it's a number
	// 2. Bind JSON request to UpdatePostRequest struct
	// 3. Validate the content (not empty, length limits)
	// 4. Check if post exists with SQL: SELECT id FROM posts WHERE id = ?
	// 5. Update post content and updated_at timestamp with SQL: UPDATE posts SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
	// 6. Return updated post
	
	id := c.Param("id")
	var req models.UpdatePostRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON format"})
		return
	}

	// Server-side validation (students should implement this)
	if len(req.Content) < 3 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Post content must be at least 3 characters long"})
		return
	}
	
	if len(req.Content) > 1000 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Post content cannot exceed 1000 characters"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Not implemented - Please implement this handler",
		"hint": "Use SQL: UPDATE posts SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
		"post_id": id,
		"new_content": req.Content,
		"validation": "passed",
	})
}

// DeletePost handles DELETE /api/posts/:id
func (h *PostHandler) DeletePost(c *gin.Context) {
	// TODO: Implement delete post
	// This should:
	// 1. Get post ID from URL parameter and validate it's a number
	// 2. Check if post exists with SQL: SELECT id FROM posts WHERE id = ?
	// 3. Delete post from database with SQL: DELETE FROM posts WHERE id = ?
	// 4. Return success response (204 No Content)
	
	id := c.Param("id")

	c.JSON(http.StatusOK, gin.H{
		"message": "Not implemented - Please implement this handler",
		"hint": "Use SQL: DELETE FROM posts WHERE id = ? and return 204 status",
		"post_id": id,
	})
}