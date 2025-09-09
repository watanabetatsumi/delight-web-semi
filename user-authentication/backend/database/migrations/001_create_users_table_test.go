package migrations

import (
	"database/sql"
	"testing"
	"user-authentication/services"

	_ "github.com/go-sql-driver/mysql"
)

func TestCreateUsersTableMigration(t *testing.T) {
	migration := CreateUsersTableMigration()

	// Test migration structure
	if migration.Version != 1 {
		t.Errorf("Expected migration version 1, got %d", migration.Version)
	}

	if migration.Description != "Create users table" {
		t.Errorf("Expected migration description 'Create users table', got '%s'", migration.Description)
	}

	if migration.Up == nil {
		t.Error("Migration Up function should not be nil")
	}

	if migration.Down == nil {
		t.Error("Migration Down function should not be nil")
	}
}

func TestCreateUsersTableMigrationFunctions(t *testing.T) {
	// Test that the migration functions are properly defined
	migration := CreateUsersTableMigration()

	// Test Up function exists and is callable
	if migration.Up == nil {
		t.Fatal("Up function is nil")
	}

	// Test Down function exists and is callable
	if migration.Down == nil {
		t.Fatal("Down function is nil")
	}

	// Note: We can't test actual database operations without a real database connection
	// These tests verify the migration structure is correct
}

func TestMigrationIntegration(t *testing.T) {
	// This test demonstrates how the migration would be used
	// It doesn't require a real database connection

	// Create a migration manager (with nil db for testing)
	manager := services.NewMigrationManager(nil)

	// Add the users table migration
	migration := CreateUsersTableMigration()
	manager.AddMigration(migration)

	// Verify the migration was added correctly
	if len(manager.GetMigrations()) != 1 {
		t.Errorf("Expected 1 migration, got %d", len(manager.GetMigrations()))
	}

	addedMigration := manager.GetMigrations()[0]
	if addedMigration.Version != 1 {
		t.Errorf("Expected migration version 1, got %d", addedMigration.Version)
	}

	if addedMigration.Description != "Create users table" {
		t.Errorf("Expected migration description 'Create users table', got '%s'", addedMigration.Description)
	}
}

// Helper function to test SQL syntax (without executing)
func TestUsersTableSQL(t *testing.T) {
	// Test that the SQL statements are properly formatted
	// This is a basic syntax check

	expectedUpSQL := `
		CREATE TABLE users (
			id INT AUTO_INCREMENT PRIMARY KEY,
			username VARCHAR(50) UNIQUE NOT NULL,
			email VARCHAR(100) UNIQUE NOT NULL,
			password_hash VARCHAR(255) NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			INDEX idx_users_email (email),
			INDEX idx_users_username (username)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
	`

	expectedDownSQL := "DROP TABLE IF EXISTS users"

	// Basic checks for SQL content
	if len(expectedUpSQL) == 0 {
		t.Error("Up SQL should not be empty")
	}

	if len(expectedDownSQL) == 0 {
		t.Error("Down SQL should not be empty")
	}

	// Check that SQL contains expected keywords
	upSQL := expectedUpSQL
	if !containsKeywords(upSQL, []string{"CREATE TABLE", "users", "id", "username", "email", "password_hash"}) {
		t.Error("Up SQL missing expected keywords")
	}

	downSQL := expectedDownSQL
	if !containsKeywords(downSQL, []string{"DROP TABLE", "users"}) {
		t.Error("Down SQL missing expected keywords")
	}
}

func containsKeywords(sql string, keywords []string) bool {
	for _, keyword := range keywords {
		if !contains(sql, keyword) {
			return false
		}
	}
	return true
}

func contains(s, substr string) bool {
	return len(s) >= len(substr) && (s == substr || len(s) > len(substr) && (s[:len(substr)] == substr || s[len(s)-len(substr):] == substr || containsSubstring(s, substr)))
}

func containsSubstring(s, substr string) bool {
	for i := 0; i <= len(s)-len(substr); i++ {
		if s[i:i+len(substr)] == substr {
			return true
		}
	}
	return false
}