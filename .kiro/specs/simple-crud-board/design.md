# Design Document

## Overview

This project implements a simple CRUD bulletin board application for learning purposes. The application uses Next.js for the frontend, Go/Gin for the backend API, and SQLite for data storage. Authentication is not included in this basic version. The backend API endpoints will be created with empty implementations to allow learners to practice implementing the actual functionality.

## Architecture

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js       │    │   Go/Gin        │    │   SQLite        │
│   Frontend      │───▶│   Backend       │───▶│   Database      │
│   (Port 3000)   │    │   (Port 8080)   │    │   (File-based)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Request Flow
1. User interacts with Next.js frontend
2. Frontend makes HTTP requests to Go/Gin backend API
3. Backend processes requests and interacts with SQLite database
4. Response data flows back through the same path

## Components and Interfaces

### Frontend Components (Next.js)

#### PostList Component
- **Purpose**: Display all posts in chronological order
- **Props**: `posts: Post[]`
- **State**: Loading state, error handling
- **API Calls**: GET /api/posts

#### PostForm Component
- **Purpose**: Create and edit posts
- **Props**: `post?: Post, onSubmit: (post: Post) => void`
- **State**: Form data, validation errors
- **API Calls**: POST /api/posts, PUT /api/posts/:id

#### PostItem Component
- **Purpose**: Display individual post with edit/delete actions
- **Props**: `post: Post, onEdit: () => void, onDelete: () => void`
- **API Calls**: DELETE /api/posts/:id

### Backend API Endpoints (Go/Gin)

#### REST API Structure
```go
// Routes
GET    /api/posts     - List all posts
POST   /api/posts     - Create new post
PUT    /api/posts/:id - Update existing post
DELETE /api/posts/:id - Delete post
```

#### Handler Structure (Empty Implementations)
```go
type PostHandler struct {
    // To be implemented by learners
}

func (h *PostHandler) GetPosts(c *gin.Context) {
    // TODO: Implement get all posts
    c.JSON(200, gin.H{"message": "Not implemented"})
}

func (h *PostHandler) CreatePost(c *gin.Context) {
    // TODO: Implement create post
    c.JSON(201, gin.H{"message": "Not implemented"})
}

func (h *PostHandler) UpdatePost(c *gin.Context) {
    // TODO: Implement update post
    c.JSON(200, gin.H{"message": "Not implemented"})
}

func (h *PostHandler) DeletePost(c *gin.Context) {
    // TODO: Implement delete post
    c.JSON(204, gin.H{"message": "Not implemented"})
}
```



## Data Models

### Post Model (SQLite)
```sql
CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Go Struct
```go
type Post struct {
    ID        int       `json:"id" db:"id"`
    Content   string    `json:"content" db:"content"`
    CreatedAt time.Time `json:"created_at" db:"created_at"`
    UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}
```

## Error Handling

### Frontend Error Handling
- Network errors: Display user-friendly messages
- Validation errors: Show field-specific error messages
- Loading states: Show spinners during API calls
- Empty states: Display appropriate messages when no posts exist

### Backend Error Handling
```go
type APIError struct {
    Code    int    `json:"code"`
    Message string `json:"message"`
}

// Standard error responses
// 400 - Bad Request (validation errors)
// 404 - Not Found (post doesn't exist)
// 500 - Internal Server Error (database/system errors)
```

### Database Error Handling
- SQLite connection errors
- Database file creation/access issues
- SQL syntax and constraint violations

## Testing Strategy

### Frontend Testing
- **Unit Tests**: Component rendering and user interactions
- **Integration Tests**: API communication
- **E2E Tests**: Full user workflows (create, read, update, delete)

### Backend Testing
- **Unit Tests**: Handler logic (when implemented)
- **Integration Tests**: Database operations
- **API Tests**: Endpoint behavior and error handling

### Database Testing
- **SQLite Operations**: Test database initialization and CRUD operations
- **Data Integrity**: Verify data validation and constraints

## Project Structure

```
simple-crud-board/
├── frontend/                 # Next.js application
│   ├── pages/
│   │   ├── index.js         # Main page with post list
│   │   └── api/             # Next.js API routes (optional)
│   ├── components/
│   │   ├── PostList.js      # Display all posts
│   │   ├── PostForm.js      # Create/edit post form
│   │   └── PostItem.js      # Individual post display
│   └── package.json
├── backend/                  # Go/Gin application
│   ├── main.go              # Application entry point
│   ├── handlers/
│   │   └── posts.go         # Post handlers (empty implementations)
│   ├── models/
│   │   └── post.go          # Post model and database operations
│   ├── database/
│   │   └── sqlite.go        # Database initialization
│   └── go.mod
└── README.md                # Setup and learning instructions
```

## Development Workflow

### Setup Phase
1. Initialize Next.js frontend with basic UI components
2. Create Go/Gin server with empty API endpoint implementations
3. Set up SQLite database with posts table
4. Configure CORS for frontend-backend communication

### Learning Phase
1. Students implement the empty handler functions
2. Students add database operations to interact with SQLite
3. Students test the complete CRUD functionality
4. Students can extend with additional features

This design focuses specifically on the first learning objective: implementing basic CRUD operations with a simple tech stack.