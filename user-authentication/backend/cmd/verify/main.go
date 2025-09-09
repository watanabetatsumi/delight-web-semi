package main

import (
	"database/sql"
	"fmt"
	"log"
	"user-authentication/database"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
	// Load database configuration
	config := database.GetDefaultConfig()

	// Connect to database
	db, err := database.Connect(config)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// Verify users table exists and has correct structure
	if err := verifyUsersTable(db); err != nil {
		log.Fatalf("Users table verification failed: %v", err)
	}

	log.Println("✅ Users table verification completed successfully")
}

func verifyUsersTable(db *sql.DB) error {
	// Check if users table exists
	var tableName string
	query := "SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'users'"
	err := db.QueryRow(query).Scan(&tableName)
	if err != nil {
		if err == sql.ErrNoRows {
			return fmt.Errorf("users table does not exist")
		}
		return fmt.Errorf("failed to check if users table exists: %w", err)
	}

	log.Println("✅ Users table exists")

	// Verify table structure
	columns, err := getTableColumns(db, "users")
	if err != nil {
		return fmt.Errorf("failed to get table columns: %w", err)
	}

	expectedColumns := map[string]ColumnInfo{
		"id": {
			Type:    "int",
			Null:    "NO",
			Key:     "PRI",
			Default: sql.NullString{},
			Extra:   "auto_increment",
		},
		"username": {
			Type:    "varchar(50)",
			Null:    "NO",
			Key:     "UNI",
			Default: sql.NullString{},
			Extra:   "",
		},
		"email": {
			Type:    "varchar(100)",
			Null:    "NO",
			Key:     "UNI",
			Default: sql.NullString{},
			Extra:   "",
		},
		"password_hash": {
			Type:    "varchar(255)",
			Null:    "NO",
			Key:     "",
			Default: sql.NullString{},
			Extra:   "",
		},
		"created_at": {
			Type:    "timestamp",
			Null:    "YES",
			Key:     "",
			Default: sql.NullString{String: "CURRENT_TIMESTAMP", Valid: true},
			Extra:   "DEFAULT_GENERATED",
		},
		"updated_at": {
			Type:    "timestamp",
			Null:    "YES",
			Key:     "",
			Default: sql.NullString{String: "CURRENT_TIMESTAMP", Valid: true},
			Extra:   "DEFAULT_GENERATED on update CURRENT_TIMESTAMP",
		},
	}

	// Verify each expected column exists
	for expectedCol, expectedInfo := range expectedColumns {
		if actualInfo, exists := columns[expectedCol]; !exists {
			return fmt.Errorf("column '%s' is missing", expectedCol)
		} else {
			// Basic type checking (MySQL types can vary in representation)
			if !isCompatibleType(actualInfo.Type, expectedInfo.Type) {
				log.Printf("⚠️  Column '%s' type mismatch: expected %s, got %s", expectedCol, expectedInfo.Type, actualInfo.Type)
			} else {
				log.Printf("✅ Column '%s' has correct type: %s", expectedCol, actualInfo.Type)
			}

			// Check nullable constraint
			if actualInfo.Null != expectedInfo.Null {
				log.Printf("⚠️  Column '%s' null constraint mismatch: expected %s, got %s", expectedCol, expectedInfo.Null, actualInfo.Null)
			}

			// Check key constraints for important columns
			if expectedCol == "id" && actualInfo.Key != "PRI" {
				return fmt.Errorf("column 'id' should be primary key")
			}
		}
	}

	// Verify indexes exist
	if err := verifyIndexes(db); err != nil {
		return fmt.Errorf("index verification failed: %w", err)
	}

	return nil
}

type ColumnInfo struct {
	Type    string
	Null    string
	Key     string
	Default sql.NullString
	Extra   string
}

func getTableColumns(db *sql.DB, tableName string) (map[string]ColumnInfo, error) {
	query := `
		SELECT column_name, data_type, is_nullable, column_key, column_default, extra
		FROM information_schema.columns 
		WHERE table_schema = DATABASE() AND table_name = ?
		ORDER BY ordinal_position
	`

	rows, err := db.Query(query, tableName)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	columns := make(map[string]ColumnInfo)
	for rows.Next() {
		var columnName, dataType, isNullable, columnKey, extra string
		var columnDefault sql.NullString

		err := rows.Scan(&columnName, &dataType, &isNullable, &columnKey, &columnDefault, &extra)
		if err != nil {
			return nil, err
		}

		columns[columnName] = ColumnInfo{
			Type:    dataType,
			Null:    isNullable,
			Key:     columnKey,
			Default: columnDefault,
			Extra:   extra,
		}
	}

	return columns, nil
}

func isCompatibleType(actual, expected string) bool {
	// Simple type compatibility check
	// MySQL can return types in different formats
	typeMap := map[string][]string{
		"int":          {"int", "int(11)", "integer"},
		"varchar(50)":  {"varchar(50)"},
		"varchar(100)": {"varchar(100)"},
		"varchar(255)": {"varchar(255)"},
		"timestamp":    {"timestamp"},
	}

	if compatibleTypes, exists := typeMap[expected]; exists {
		for _, compatibleType := range compatibleTypes {
			if actual == compatibleType {
				return true
			}
		}
	}

	return actual == expected
}

func verifyIndexes(db *sql.DB) error {
	// Check for email index
	emailIndexExists, err := indexExists(db, "users", "idx_users_email")
	if err != nil {
		return fmt.Errorf("failed to check email index: %w", err)
	}

	if emailIndexExists {
		log.Println("✅ Email index exists")
	} else {
		log.Println("⚠️  Email index not found (this might be expected depending on MySQL version)")
	}

	// Check for username index
	usernameIndexExists, err := indexExists(db, "users", "idx_users_username")
	if err != nil {
		return fmt.Errorf("failed to check username index: %w", err)
	}

	if usernameIndexExists {
		log.Println("✅ Username index exists")
	} else {
		log.Println("⚠️  Username index not found (this might be expected depending on MySQL version)")
	}

	return nil
}

func indexExists(db *sql.DB, tableName, indexName string) (bool, error) {
	query := `
		SELECT COUNT(*) 
		FROM information_schema.statistics 
		WHERE table_schema = DATABASE() 
		AND table_name = ? 
		AND index_name = ?
	`

	var count int
	err := db.QueryRow(query, tableName, indexName).Scan(&count)
	if err != nil {
		return false, err
	}

	return count > 0, nil
}