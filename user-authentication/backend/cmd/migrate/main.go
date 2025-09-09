package main

import (
	"flag"
	"log"
	"os"
	"user-authentication/database"
	"user-authentication/database/migrations"
	"user-authentication/services"
)

func main() {
	var (
		action = flag.String("action", "up", "Migration action: up, down, or status")
		help   = flag.Bool("help", false, "Show help")
	)
	flag.Parse()

	if *help {
		printHelp()
		return
	}

	// Load database configuration
	config := database.GetDefaultConfig()

	// Create database if it doesn't exist (for up action)
	if *action == "up" {
		if err := database.CreateDatabaseIfNotExists(config); err != nil {
			log.Fatalf("Failed to create database: %v", err)
		}
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

	// Execute the requested action
	switch *action {
	case "up":
		if err := migrationManager.Up(); err != nil {
			log.Fatalf("Failed to run migrations: %v", err)
		}
		log.Println("Migrations completed successfully")

	case "down":
		if err := migrationManager.Down(); err != nil {
			log.Fatalf("Failed to rollback migration: %v", err)
		}
		log.Println("Migration rollback completed successfully")

	case "status":
		status, err := migrationManager.Status()
		if err != nil {
			log.Fatalf("Failed to get migration status: %v", err)
		}

		log.Println("Migration Status:")
		log.Println("================")
		for _, s := range status {
			appliedStatus := "Not Applied"
			if s.Applied {
				appliedStatus = "Applied"
			}
			log.Printf("Version %d: %s - %s", s.Version, s.Description, appliedStatus)
		}

	default:
		log.Fatalf("Unknown action: %s. Use 'up', 'down', or 'status'", *action)
	}
}

func printHelp() {
	log.Println("Migration Tool")
	log.Println("==============")
	log.Println("Usage: go run cmd/migrate/main.go [options]")
	log.Println("")
	log.Println("Options:")
	log.Println("  -action string")
	log.Println("        Migration action: up, down, or status (default \"up\")")
	log.Println("  -help")
	log.Println("        Show this help message")
	log.Println("")
	log.Println("Examples:")
	log.Println("  go run cmd/migrate/main.go -action=up      # Run all pending migrations")
	log.Println("  go run cmd/migrate/main.go -action=down    # Rollback last migration")
	log.Println("  go run cmd/migrate/main.go -action=status  # Show migration status")
	log.Println("")
	log.Println("Environment Variables:")
	log.Println("  DB_HOST     - Database host (default: localhost)")
	log.Println("  DB_PORT     - Database port (default: 3306)")
	log.Println("  DB_USER     - Database user (default: root)")
	log.Println("  DB_PASSWORD - Database password (default: password)")
	log.Println("  DB_NAME     - Database name (default: user_auth_board)")
}