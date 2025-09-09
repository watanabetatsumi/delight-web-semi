package migrations

import (
	"database/sql"
	"user-authentication/services"
)

// CreateUsersTableMigration creates the users table migration
func CreateUsersTableMigration() services.Migration {
	return services.Migration{
		Version:     1,
		Description: "Create users table",
		Up:          createUsersTableUp,
		Down:        createUsersTableDown,
	}
}

func createUsersTableUp(db *sql.DB) error {
	query := `
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

	_, err := db.Exec(query)
	return err
}

func createUsersTableDown(db *sql.DB) error {
	query := "DROP TABLE IF EXISTS users"
	_, err := db.Exec(query)
	return err
}