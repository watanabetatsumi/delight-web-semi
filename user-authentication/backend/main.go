package main

import (
	"log"
	"user-authentication/database"
	"user-authentication/database/migrations"
	"user-authentication/services"

	"github.com/gin-gonic/gin"
)

func main() {
	// Load database configuration
	config := database.GetDefaultConfig()

	// Create database if it doesn't exist
	if err := database.CreateDatabaseIfNotExists(config); err != nil {
		log.Fatalf("Failed to create database: %v", err)
	}

	// Connect to database
	db, err := database.Connect(config)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// Initialize migration manager
	migrationManager := services.NewMigrationManager(db)

	// Initialize migration table
	if err := migrationManager.InitializeMigrationTable(); err != nil {
		log.Fatalf("Failed to initialize migration table: %v", err)
	}

	// Register migrations
	migrationManager.AddMigration(migrations.CreateUsersTableMigration())

	// Run migrations
	if err := migrationManager.Up(); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	// Initialize Gin router
	r := gin.Default()

	// Add CORS middleware
	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"message": "User authentication service is running",
		})
	})

	// Migration endpoints
	r.POST("/api/migrate/up", func(c *gin.Context) {
		if err := migrationManager.Up(); err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, gin.H{"message": "Migrations applied successfully"})
	})

	r.POST("/api/migrate/down", func(c *gin.Context) {
		if err := migrationManager.Down(); err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, gin.H{"message": "Migration rolled back successfully"})
	})

	r.GET("/api/migrate/status", func(c *gin.Context) {
		status, err := migrationManager.Status()
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, gin.H{"migrations": status})
	})

	// Start server
	log.Println("Starting server on :8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}