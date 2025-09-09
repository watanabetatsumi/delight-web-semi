package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/go-sql-driver/mysql"
)

type Config struct {
	Host     string
	Port     string
	User     string
	Password string
	Database string
}

// GetDefaultConfig returns default MySQL configuration
func GetDefaultConfig() *Config {
	return &Config{
		Host:     getEnv("DB_HOST", "localhost"),
		Port:     getEnv("DB_PORT", "3306"),
		User:     getEnv("DB_USER", "root"),
		Password: getEnv("DB_PASSWORD", "password"),
		Database: getEnv("DB_NAME", "user_auth_board"),
	}
}

// Connect establishes a connection to MySQL database
func Connect(config *Config) (*sql.DB, error) {
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		config.User,
		config.Password,
		config.Host,
		config.Port,
		config.Database,
	)

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to open database connection: %w", err)
	}

	// Test the connection
	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	log.Printf("Successfully connected to MySQL database: %s", config.Database)
	return db, nil
}

// CreateDatabaseIfNotExists creates the database if it doesn't exist
func CreateDatabaseIfNotExists(config *Config) error {
	// Connect without specifying database
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/",
		config.User,
		config.Password,
		config.Host,
		config.Port,
	)

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return fmt.Errorf("failed to connect to MySQL server: %w", err)
	}
	defer db.Close()

	// Create database if it doesn't exist
	query := fmt.Sprintf("CREATE DATABASE IF NOT EXISTS %s CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci", config.Database)
	_, err = db.Exec(query)
	if err != nil {
		return fmt.Errorf("failed to create database: %w", err)
	}

	log.Printf("Database %s created or already exists", config.Database)
	return nil
}

// getEnv gets environment variable with fallback
func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}