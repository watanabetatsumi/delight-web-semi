package services

import (
	"database/sql"
	"fmt"
	"log"
	"sort"
	"time"
)

// Migration represents a database migration
type Migration struct {
	Version     int
	Description string
	Up          func(*sql.DB) error
	Down        func(*sql.DB) error
}

// MigrationManager manages database migrations
type MigrationManager struct {
	db         *sql.DB
	migrations []Migration
}

// NewMigrationManager creates a new migration manager
func NewMigrationManager(db *sql.DB) *MigrationManager {
	return &MigrationManager{
		db:         db,
		migrations: make([]Migration, 0),
	}
}

// AddMigration adds a migration to the manager
func (m *MigrationManager) AddMigration(migration Migration) {
	m.migrations = append(m.migrations, migration)
}

// GetMigrations returns all registered migrations
func (m *MigrationManager) GetMigrations() []Migration {
	return m.migrations
}

// InitializeMigrationTable creates the migrations table if it doesn't exist
func (m *MigrationManager) InitializeMigrationTable() error {
	query := `
		CREATE TABLE IF NOT EXISTS migrations (
			version INT PRIMARY KEY,
			description VARCHAR(255) NOT NULL,
			applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
	`

	_, err := m.db.Exec(query)
	if err != nil {
		return fmt.Errorf("failed to create migrations table: %w", err)
	}

	log.Println("Migration table initialized successfully")
	return nil
}

// GetAppliedMigrations returns a list of applied migration versions
func (m *MigrationManager) GetAppliedMigrations() ([]int, error) {
	query := "SELECT version FROM migrations ORDER BY version"
	rows, err := m.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to query applied migrations: %w", err)
	}
	defer rows.Close()

	var versions []int
	for rows.Next() {
		var version int
		if err := rows.Scan(&version); err != nil {
			return nil, fmt.Errorf("failed to scan migration version: %w", err)
		}
		versions = append(versions, version)
	}

	return versions, nil
}

// IsMigrationApplied checks if a specific migration version is applied
func (m *MigrationManager) IsMigrationApplied(version int) (bool, error) {
	query := "SELECT COUNT(*) FROM migrations WHERE version = ?"
	var count int
	err := m.db.QueryRow(query, version).Scan(&count)
	if err != nil {
		return false, fmt.Errorf("failed to check migration status: %w", err)
	}
	return count > 0, nil
}

// RecordMigration records a migration as applied
func (m *MigrationManager) RecordMigration(version int, description string) error {
	query := "INSERT INTO migrations (version, description, applied_at) VALUES (?, ?, ?)"
	_, err := m.db.Exec(query, version, description, time.Now())
	if err != nil {
		return fmt.Errorf("failed to record migration: %w", err)
	}
	return nil
}

// RemoveMigrationRecord removes a migration record
func (m *MigrationManager) RemoveMigrationRecord(version int) error {
	query := "DELETE FROM migrations WHERE version = ?"
	_, err := m.db.Exec(query, version)
	if err != nil {
		return fmt.Errorf("failed to remove migration record: %w", err)
	}
	return nil
}

// Up runs all pending migrations
func (m *MigrationManager) Up() error {
	// Sort migrations by version
	sort.Slice(m.migrations, func(i, j int) bool {
		return m.migrations[i].Version < m.migrations[j].Version
	})

	appliedMigrations, err := m.GetAppliedMigrations()
	if err != nil {
		return fmt.Errorf("failed to get applied migrations: %w", err)
	}

	appliedMap := make(map[int]bool)
	for _, version := range appliedMigrations {
		appliedMap[version] = true
	}

	for _, migration := range m.migrations {
		if appliedMap[migration.Version] {
			log.Printf("Migration %d (%s) already applied, skipping", migration.Version, migration.Description)
			continue
		}

		log.Printf("Applying migration %d: %s", migration.Version, migration.Description)

		// Start transaction
		tx, err := m.db.Begin()
		if err != nil {
			return fmt.Errorf("failed to start transaction for migration %d: %w", migration.Version, err)
		}

		// Run the migration
		if err := migration.Up(m.db); err != nil {
			tx.Rollback()
			return fmt.Errorf("failed to apply migration %d: %w", migration.Version, err)
		}

		// Record the migration
		if err := m.RecordMigration(migration.Version, migration.Description); err != nil {
			tx.Rollback()
			return fmt.Errorf("failed to record migration %d: %w", migration.Version, err)
		}

		// Commit transaction
		if err := tx.Commit(); err != nil {
			return fmt.Errorf("failed to commit migration %d: %w", migration.Version, err)
		}

		log.Printf("Successfully applied migration %d: %s", migration.Version, migration.Description)
	}

	return nil
}

// Down rolls back the last applied migration
func (m *MigrationManager) Down() error {
	appliedMigrations, err := m.GetAppliedMigrations()
	if err != nil {
		return fmt.Errorf("failed to get applied migrations: %w", err)
	}

	if len(appliedMigrations) == 0 {
		log.Println("No migrations to rollback")
		return nil
	}

	// Get the last applied migration
	lastVersion := appliedMigrations[len(appliedMigrations)-1]

	// Find the migration to rollback
	var migrationToRollback *Migration
	for _, migration := range m.migrations {
		if migration.Version == lastVersion {
			migrationToRollback = &migration
			break
		}
	}

	if migrationToRollback == nil {
		return fmt.Errorf("migration %d not found in registered migrations", lastVersion)
	}

	log.Printf("Rolling back migration %d: %s", migrationToRollback.Version, migrationToRollback.Description)

	// Start transaction
	tx, err := m.db.Begin()
	if err != nil {
		return fmt.Errorf("failed to start transaction for rollback %d: %w", lastVersion, err)
	}

	// Run the rollback
	if err := migrationToRollback.Down(m.db); err != nil {
		tx.Rollback()
		return fmt.Errorf("failed to rollback migration %d: %w", lastVersion, err)
	}

	// Remove the migration record
	if err := m.RemoveMigrationRecord(lastVersion); err != nil {
		tx.Rollback()
		return fmt.Errorf("failed to remove migration record %d: %w", lastVersion, err)
	}

	// Commit transaction
	if err := tx.Commit(); err != nil {
		return fmt.Errorf("failed to commit rollback %d: %w", lastVersion, err)
	}

	log.Printf("Successfully rolled back migration %d: %s", migrationToRollback.Version, migrationToRollback.Description)
	return nil
}

// Status returns the current migration status
func (m *MigrationManager) Status() ([]MigrationStatus, error) {
	appliedMigrations, err := m.GetAppliedMigrations()
	if err != nil {
		return nil, fmt.Errorf("failed to get applied migrations: %w", err)
	}

	appliedMap := make(map[int]bool)
	for _, version := range appliedMigrations {
		appliedMap[version] = true
	}

	var status []MigrationStatus
	for _, migration := range m.migrations {
		status = append(status, MigrationStatus{
			Version:     migration.Version,
			Description: migration.Description,
			Applied:     appliedMap[migration.Version],
		})
	}

	// Sort by version
	sort.Slice(status, func(i, j int) bool {
		return status[i].Version < status[j].Version
	})

	return status, nil
}

// MigrationStatus represents the status of a migration
type MigrationStatus struct {
	Version     int    `json:"version"`
	Description string `json:"description"`
	Applied     bool   `json:"applied"`
}