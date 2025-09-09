package main

import (
	"log"
	"simple-crud-board/database"
	"simple-crud-board/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Initialize database
	db, err := database.InitDB()
	if err != nil {
		log.Fatal("Failed to initialize database:", err)
	}
	defer db.Close()

	// Initialize Gin router
	r := gin.Default()

	// Configure CORS
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	r.Use(cors.New(config))

	// Initialize handlers
	postHandler := handlers.NewPostHandler(db)

	// API routes
	api := r.Group("/api")
	{
		api.GET("/posts", postHandler.GetPosts)
		api.POST("/posts", postHandler.CreatePost)
		api.PUT("/posts/:id", postHandler.UpdatePost)
		api.DELETE("/posts/:id", postHandler.DeletePost)
	}

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	log.Println("Server starting on :8080")
	r.Run(":8080")
}