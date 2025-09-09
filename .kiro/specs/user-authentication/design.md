# Design Document

## Overview

この設計は、既存の掲示板アプリケーション（simple-crud-board）にユーザー認証・認可機能を追加します。Cookieベースの認証を実装し、各ユーザーが自分の投稿を管理できるようにします。データベースをSQLiteからMySQLに移行し、Goでのマイグレーション機能を追加します。将来的にSessionIDやJWT認証への拡張、ユーザー間チャット機能も可能な設計とします。

## Architecture

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js       │    │   Go/Gin        │    │   MySQL         │
│   Frontend      │───▶│   Backend       │───▶│   Database      │
│   (Port 3000)   │    │   (Port 8080)   │    │   (Port 3306)   │
│                 │    │                 │    │                 │
│ - Login Form    │    │ - Auth Middleware│   │ - users         │
│ - Post List     │    │ - Session Mgmt  │    │ - posts         │
│ - My Posts      │    │ - Post CRUD     │    │ - sessions      │
│ - Chat (future) │    │ - Migration     │    │ - users_chat    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Authentication Flow
```
1. User Login → Backend validates → Set Cookie → Return user info
2. Subsequent requests → Cookie validation → Access granted/denied
3. User Logout → Clear cookie → Invalidate session
```

## Components and Interfaces

### Frontend Components (Next.js)

#### AuthProvider Component
- **Purpose**: Manage authentication state across the application
- **State**: `user: User | null, isLoading: boolean`
- **Methods**: `login(), logout(), checkAuth()`

#### LoginForm Component
- **Purpose**: Handle user login
- **Props**: `onLogin: (credentials) => void`
- **State**: Form data, validation errors
- **API Calls**: POST /api/auth/login

#### RegisterForm Component
- **Purpose**: Handle user registration
- **Props**: `onRegister: (userData) => void`
- **State**: Form data, validation errors
- **API Calls**: POST /api/auth/register

#### ProtectedRoute Component
- **Purpose**: Protect routes that require authentication
- **Props**: `children: ReactNode`
- **Behavior**: Redirect to login if not authenticated

#### MyPostsList Component
- **Purpose**: Display user's own posts only
- **Props**: `userId: number`
- **API Calls**: GET /api/posts/my

#### ChatInterface Component (Future)
- **Purpose**: Handle user-to-user messaging
- **Props**: `currentUser: User, targetUser: User`
- **API Calls**: GET/POST /api/chat

### Backend API Endpoints (Go/Gin)

#### Authentication Endpoints
```go
POST   /api/auth/register  - User registration
POST   /api/auth/login     - User login
POST   /api/auth/logout    - User logout
GET    /api/auth/me        - Get current user info
```

#### Enhanced Post Endpoints
```go
GET    /api/posts          - List all posts (with author info)
GET    /api/posts/my       - List current user's posts
POST   /api/posts          - Create new post (authenticated)
PUT    /api/posts/:id      - Update post (owner only)
DELETE /api/posts/:id      - Delete post (owner only)
```

#### Chat Endpoints (Future)
```go
GET    /api/chat/:userId   - Get chat history with user
POST   /api/chat/:userId   - Send message to user
GET    /api/chat/users     - Get list of users for chat
```

#### Migration Endpoints
```go
POST   /api/migrate/up     - Run migrations
POST   /api/migrate/down   - Rollback migrations
GET    /api/migrate/status - Check migration status
```

### Middleware Components

#### AuthMiddleware
```go
func AuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        // Validate cookie
        // Set user context
        // Continue or abort with 401
    }
}
```

#### CORSMiddleware
```go
func CORSMiddleware() gin.HandlerFunc {
    // Handle CORS for frontend-backend communication
}
```

## Data Models

### User Model (MySQL)
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Enhanced Post Model (MySQL)
```sql
CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Session Model (MySQL)
```sql
CREATE TABLE sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id INT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Chat Model (MySQL) - Future
```sql
CREATE TABLE users_chat (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_chat_users (sender_id, receiver_id),
    INDEX idx_chat_time (created_at)
);
```

### Go Structs
```go
type User struct {
    ID        int       `json:"id" db:"id"`
    Username  string    `json:"username" db:"username"`
    Email     string    `json:"email" db:"email"`
    Password  string    `json:"-" db:"password_hash"`
    CreatedAt time.Time `json:"created_at" db:"created_at"`
    UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}

type Post struct {
    ID        int       `json:"id" db:"id"`
    UserID    int       `json:"user_id" db:"user_id"`
    Content   string    `json:"content" db:"content"`
    Author    string    `json:"author,omitempty"` // Joined from users table
    CreatedAt time.Time `json:"created_at" db:"created_at"`
    UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}

type Session struct {
    ID        string    `json:"id" db:"id"`
    UserID    int       `json:"user_id" db:"user_id"`
    ExpiresAt time.Time `json:"expires_at" db:"expires_at"`
    CreatedAt time.Time `json:"created_at" db:"created_at"`
}

type ChatMessage struct {
    ID         int       `json:"id" db:"id"`
    SenderID   int       `json:"sender_id" db:"sender_id"`
    ReceiverID int       `json:"receiver_id" db:"receiver_id"`
    Message    string    `json:"message" db:"message"`
    CreatedAt  time.Time `json:"created_at" db:"created_at"`
}
```

## Error Handling

### Authentication Errors
```go
type AuthError struct {
    Code    int    `json:"code"`
    Message string `json:"message"`
    Type    string `json:"type"`
}

// Standard auth error responses
// 401 - Unauthorized (invalid credentials, expired session)
// 403 - Forbidden (insufficient permissions)
// 409 - Conflict (username/email already exists)
// 422 - Unprocessable Entity (validation errors)
```

### Enhanced Error Handling
- **Password Validation**: Minimum 8 characters, alphanumeric
- **Email Validation**: Valid email format, uniqueness
- **Session Management**: Automatic cleanup of expired sessions
- **Database Errors**: Connection issues, constraint violations
- **Migration Errors**: Rollback on failure, version conflicts

## Testing Strategy

### Authentication Testing
- **Unit Tests**: Password hashing, session validation
- **Integration Tests**: Login/logout flows, middleware behavior
- **Security Tests**: Cookie security, session hijacking prevention

### Authorization Testing
- **Access Control**: Verify users can only modify their own posts
- **Route Protection**: Ensure protected routes require authentication
- **Permission Tests**: Test different user roles and permissions

### Database Testing
- **Migration Tests**: Up/down migration functionality
- **Relationship Tests**: Foreign key constraints, cascading deletes
- **Performance Tests**: Query optimization for user-specific data

## Security Considerations

### Cookie Security
```go
cookie := &http.Cookie{
    Name:     "session_id",
    Value:    sessionID,
    HttpOnly: true,        // Prevent XSS
    Secure:   true,        // HTTPS only
    SameSite: http.SameSiteStrictMode, // CSRF protection
    MaxAge:   3600 * 24,   // 24 hours
    Path:     "/",
}
```

### Password Security
- **Hashing**: Use bcrypt with appropriate cost factor
- **Validation**: Enforce strong password requirements
- **Storage**: Never store plain text passwords

### Session Management
- **Expiration**: Automatic session cleanup
- **Regeneration**: New session ID on login
- **Invalidation**: Proper logout handling

## Migration System

### Migration Structure
```go
type Migration struct {
    Version     int
    Description string
    Up          func(*sql.DB) error
    Down        func(*sql.DB) error
}

type MigrationManager struct {
    db         *sql.DB
    migrations []Migration
}
```

### Migration Files
```
migrations/
├── 001_create_users_table.go
├── 002_create_sessions_table.go
├── 003_add_user_id_to_posts.go
└── 004_create_users_chat_table.go
```

## Extensibility Design

### Authentication Interface
```go
type AuthProvider interface {
    Authenticate(credentials Credentials) (*User, error)
    ValidateToken(token string) (*User, error)
    GenerateToken(user *User) (string, error)
    RevokeToken(token string) error
}

type CookieAuthProvider struct{}
type JWTAuthProvider struct{}
type SessionAuthProvider struct{}
```

### Future Extensions
- **JWT Authentication**: Stateless token-based auth
- **OAuth Integration**: Social login (Google, GitHub)
- **Role-Based Access**: Admin, moderator, user roles
- **Real-time Chat**: WebSocket implementation
- **File Uploads**: Profile pictures, post attachments

## Project Structure

```
user-authentication/
├── frontend/                    # Enhanced Next.js application
│   ├── pages/
│   │   ├── login.js            # Login page
│   │   ├── register.js         # Registration page
│   │   ├── my-posts.js         # User's posts page
│   │   └── chat/               # Chat pages (future)
│   ├── components/
│   │   ├── auth/               # Authentication components
│   │   ├── posts/              # Enhanced post components
│   │   └── chat/               # Chat components (future)
│   ├── contexts/
│   │   └── AuthContext.js      # Authentication context
│   └── utils/
│       └── api.js              # API client with auth
├── backend/                     # Enhanced Go/Gin application
│   ├── main.go                 # Application entry point
│   ├── middleware/
│   │   ├── auth.go             # Authentication middleware
│   │   └── cors.go             # CORS middleware
│   ├── handlers/
│   │   ├── auth.go             # Authentication handlers
│   │   ├── posts.go            # Enhanced post handlers
│   │   └── chat.go             # Chat handlers (future)
│   ├── models/
│   │   ├── user.go             # User model
│   │   ├── post.go             # Enhanced post model
│   │   ├── session.go          # Session model
│   │   └── chat.go             # Chat model (future)
│   ├── database/
│   │   ├── mysql.go            # MySQL connection
│   │   └── migrations/         # Migration files
│   ├── services/
│   │   ├── auth.go             # Authentication service
│   │   └── migration.go        # Migration service
│   └── utils/
│       ├── password.go         # Password utilities
│       └── session.go          # Session utilities
├── docker-compose.yml          # MySQL setup
└── README.md                   # Setup instructions
```