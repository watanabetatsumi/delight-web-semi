package database

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

// InitDB initializes the SQLite database and creates tables
func InitDB() (*sql.DB, error) {
	// Create or open database file
	db, err := sql.Open("sqlite3", "./posts.db")
	if err != nil {
		return nil, err
	}

	// Test connection
	if err = db.Ping(); err != nil {
		return nil, err
	}

	// Create posts table
	createTableSQL := `
	CREATE TABLE IF NOT EXISTS posts (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		content TEXT NOT NULL,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);`

	_, err = db.Exec(createTableSQL)
	if err != nil {
		return nil, err
	}

	log.Println("Database initialized successfully")
	return db, nil
}