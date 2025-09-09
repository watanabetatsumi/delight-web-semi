# Database Migration Guide

This guide explains how to run the users table migration for the user authentication system.

## Prerequisites

1. **MySQL Database**: Ensure you have a MySQL database running
2. **Go Environment**: Go 1.19 or later installed
3. **Database Configuration**: Set up environment variables or use defaults

## Database Setup

### Option 1: Using Docker (Recommended)

```bash
# Start MySQL using docker-compose
cd user-authentication
docker-compose up -d mysql

# Wait for MySQL to be ready (check logs)
docker-compose logs mysql
```

### Option 2: Local MySQL Installation

Ensure MySQL is running locally with these default settings:
- Host: localhost
- Port: 3306
- User: root
- Password: password
- Database: user_auth_board (will be created automatically)

### Option 3: Custom Configuration

Set environment variables for custom database configuration:

```bash
export DB_HOST=your-host
export DB_PORT=your-port
export DB_USER=your-user
export DB_PASSWORD=your-password
export DB_NAME=your-database-name
```

## Running Migrations

### Method 1: Using the Migration CLI Tool

```bash
cd user-authentication/backend

# Run all pending migrations (creates users table)
go run cmd/migrate/main.go -action=up

# Check migration status
go run cmd/migrate/main.go -action=status

# Rollback last migration (drops users table)
go run cmd/migrate/main.go -action=down

# Show help
go run cmd/migrate/main.go -help
```

### Method 2: Using the Main Application

```bash
cd user-authentication/backend

# Run the main application (automatically runs migrations on startup)
go run main.go
```

The application will:
1. Create the database if it doesn't exist
2. Initialize the migration table
3. Run all pending migrations
4. Start the web server on port 8080

### Method 3: Using Migration API Endpoints

If the application is running, you can use the HTTP endpoints:

```bash
# Run migrations
curl -X POST http://localhost:8080/api/migrate/up

# Check status
curl http://localhost:8080/api/migrate/status

# Rollback
curl -X POST http://localhost:8080/api/migrate/down
```

## Verifying Migration

### Using the Verification Tool

```bash
cd user-authentication/backend

# Verify users table structure
go run cmd/verify/main.go
```

This will check:
- ✅ Users table exists
- ✅ All required columns are present with correct types
- ✅ Primary key and unique constraints are set
- ✅ Indexes are created (if supported)

### Manual Verification

Connect to your MySQL database and run:

```sql
-- Check if users table exists
SHOW TABLES LIKE 'users';

-- Describe users table structure
DESCRIBE users;

-- Check indexes
SHOW INDEX FROM users;

-- Check migration history
SELECT * FROM migrations;
```

Expected users table structure:

```sql
+---------------+--------------+------+-----+-------------------+-------------------+
| Field         | Type         | Null | Key | Default           | Extra             |
+---------------+--------------+------+-----+-------------------+-------------------+
| id            | int          | NO   | PRI | NULL              | auto_increment    |
| username      | varchar(50)  | NO   | UNI | NULL              |                   |
| email         | varchar(100) | NO   | UNI | NULL              |                   |
| password_hash | varchar(255) | NO   |     | NULL              |                   |
| created_at    | timestamp    | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
| updated_at    | timestamp    | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
+---------------+--------------+------+-----+-------------------+-------------------+
```

## Running Tests

```bash
cd user-authentication/backend

# Run all tests
go test ./...

# Run migration-specific tests
go test ./database/migrations/
go test ./services/

# Run tests with verbose output
go test -v ./database/migrations/
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```
   Error: Failed to connect to database: dial tcp [::1]:3306: connect: connection refused
   ```
   - Ensure MySQL is running
   - Check host/port configuration
   - Verify credentials

2. **Database Does Not Exist**
   ```
   Error: Unknown database 'user_auth_board'
   ```
   - The migration tool will create the database automatically
   - Ensure the user has CREATE privileges

3. **Migration Already Applied**
   ```
   Migration 1 (Create users table) already applied, skipping
   ```
   - This is normal behavior
   - Use `go run cmd/migrate/main.go -action=status` to check current state

4. **Permission Denied**
   ```
   Error: Access denied for user 'root'@'localhost'
   ```
   - Check username/password
   - Ensure user has necessary privileges

### Reset Database

To start fresh:

```bash
# Drop and recreate database
mysql -u root -p -e "DROP DATABASE IF EXISTS user_auth_board; CREATE DATABASE user_auth_board;"

# Or using the migration tool
go run cmd/migrate/main.go -action=down  # Rollback
go run cmd/migrate/main.go -action=up    # Apply again
```

## Migration Files

The migration system uses these files:

- `database/migrations/001_create_users_table.go` - Users table migration
- `services/migration.go` - Migration manager
- `cmd/migrate/main.go` - CLI migration tool
- `cmd/verify/main.go` - Table verification tool

## Next Steps

After successfully running the users table migration:

1. ✅ Users table is created and ready
2. ➡️ Proceed to implement User model and database operations (Task 3)
3. ➡️ Implement password hashing and authentication utilities (Task 4)

The migration system is now set up and ready for future schema changes.