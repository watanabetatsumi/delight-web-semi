package models

import "time"

// Post represents a bulletin board post
type Post struct {
	ID        int       `json:"id" db:"id"`
	Content   string    `json:"content" db:"content"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}

// CreatePostRequest represents the request body for creating a post
type CreatePostRequest struct {
	Content string `json:"content" binding:"required"`
}

// UpdatePostRequest represents the request body for updating a post
type UpdatePostRequest struct {
	Content string `json:"content" binding:"required"`
}