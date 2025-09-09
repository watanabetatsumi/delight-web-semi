package services

import (
	"database/sql"
	"testing"

	_ "github.com/go-sql-driver/mysql"
)

func TestMigrationManager_AddMigration(t *testing.T) {
	manager := NewMigrationManager(nil)

	migration := Migration{
		Version:     1,
		Description: "Test migration",
		Up:          func(db *sql.DB) error { return nil },
		Down:        func(db *sql.DB) error { return nil },
	}

	manager.AddMigration(migration)

	if len(manager.migrations) != 1 {
		t.Errorf("Expected 1 migration, got %d", len(manager.migrations))
	}

	if manager.migrations[0].Version != 1 {
		t.Errorf("Expected migration version 1, got %d", manager.migrations[0].Version)
	}

	if manager.migrations[0].Description != "Test migration" {
		t.Errorf("Expected migration description 'Test migration', got '%s'", manager.migrations[0].Description)
	}
}

func TestMigrationStatus(t *testing.T) {
	status := MigrationStatus{
		Version:     1,
		Description: "Test migration",
		Applied:     true,
	}

	if status.Version != 1 {
		t.Errorf("Expected version 1, got %d", status.Version)
	}

	if status.Description != "Test migration" {
		t.Errorf("Expected description 'Test migration', got '%s'", status.Description)
	}

	if !status.Applied {
		t.Error("Expected migration to be applied")
	}
}

func TestNewMigrationManager(t *testing.T) {
	manager := NewMigrationManager(nil)

	if manager == nil {
		t.Error("Expected migration manager to be created")
	}

	if manager.migrations == nil {
		t.Error("Expected migrations slice to be initialized")
	}

	if len(manager.migrations) != 0 {
		t.Errorf("Expected empty migrations slice, got %d migrations", len(manager.migrations))
	}
}