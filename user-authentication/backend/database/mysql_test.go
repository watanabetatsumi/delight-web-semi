package database

import (
	"testing"
)

func TestGetDefaultConfig(t *testing.T) {
	config := GetDefaultConfig()

	if config.Host != "localhost" {
		t.Errorf("Expected host to be 'localhost', got '%s'", config.Host)
	}

	if config.Port != "3306" {
		t.Errorf("Expected port to be '3306', got '%s'", config.Port)
	}

	if config.User != "root" {
		t.Errorf("Expected user to be 'root', got '%s'", config.User)
	}

	if config.Database != "user_auth_board" {
		t.Errorf("Expected database to be 'user_auth_board', got '%s'", config.Database)
	}
}

func TestConfigValidation(t *testing.T) {
	config := &Config{
		Host:     "localhost",
		Port:     "3306",
		User:     "testuser",
		Password: "testpass",
		Database: "testdb",
	}

	if config.Host == "" {
		t.Error("Host should not be empty")
	}

	if config.Port == "" {
		t.Error("Port should not be empty")
	}

	if config.User == "" {
		t.Error("User should not be empty")
	}

	if config.Database == "" {
		t.Error("Database should not be empty")
	}
}