# Simple CRUD Board - Learning Project

This is a learning project for implementing basic CRUD operations with a bulletin board application.

## Tech Stack

- **Frontend**: Next.js (React)
- **Backend**: Go with Gin framework
- **Database**: SQLite
- **API**: REST

## Project Structure

```
simple-crud-board/
├── frontend/          # Next.js application
├── backend/           # Go/Gin application
└── README.md         # This file
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   go mod tidy
   ```

3. Run the server:
   ```bash
   go run main.go
   ```

The backend server will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

## Learning Objectives

This project is designed to help you learn:

1. **Basic CRUD Operations**: Create, Read, Update, Delete posts
2. **REST API Design**: Implementing standard HTTP methods
3. **Database Integration**: Working with SQLite in Go
4. **Frontend-Backend Communication**: Making API calls from React
5. **Error Handling**: Both client and server-side validation

## API Endpoints (To Be Implemented)

The backend provides these endpoints with empty implementations:

### GET /api/posts
- **Purpose**: Retrieve all posts
- **Response**: Array of post objects ordered by creation date (newest first)
- **Example Response**:
```json
[
  {
    "id": 1,
    "content": "Hello World!",
    "created_at": "2023-12-01T10:00:00Z",
    "updated_at": "2023-12-01T10:00:00Z"
  }
]
```

### POST /api/posts
- **Purpose**: Create a new post
- **Request Body**: `{"content": "Post content here"}`
- **Validation**: Content must be 3-1000 characters
- **Response**: Created post object with ID and timestamps

### PUT /api/posts/:id
- **Purpose**: Update an existing post
- **Request Body**: `{"content": "Updated content"}`
- **Validation**: Content must be 3-1000 characters, post must exist
- **Response**: Updated post object

### DELETE /api/posts/:id
- **Purpose**: Delete a post
- **Response**: 204 No Content on success, 404 if post not found

## Your Implementation Task

The API endpoints are created but have empty implementations. Your job is to:

### 1. Implement Database Operations
- Use the provided SQLite database connection
- Write SQL queries for CRUD operations
- Handle database errors appropriately

### 2. Complete Handler Functions
Each handler in `backend/handlers/posts.go` has detailed TODO comments with:
- Step-by-step implementation guide
- Required SQL queries
- Expected response formats
- Error handling requirements

### 3. Test Your Implementation
- Start both frontend and backend servers
- Test all CRUD operations through the web interface
- Verify error handling with invalid inputs

## Expected Functionality

When completed, the application should allow users to:

- **View Posts**: See all posts on the main page, newest first
- **Create Posts**: Add new posts with content validation
- **Edit Posts**: Update existing post content
- **Delete Posts**: Remove posts with confirmation dialog
- **Error Handling**: See appropriate error messages for:
  - Empty or too short content (< 3 characters)
  - Too long content (> 1000 characters)
  - Network errors
  - Post not found errors

## Database Schema

The SQLite database contains a `posts` table with the following structure:

```sql
CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Implementation Hints

### For GetPosts Handler:
```go
rows, err := h.db.Query("SELECT id, content, created_at, updated_at FROM posts ORDER BY created_at DESC")
// Handle error, scan rows into Post structs, return JSON array
```

### For CreatePost Handler:
```go
result, err := h.db.Exec("INSERT INTO posts (content) VALUES (?)", req.Content)
// Get last insert ID, query the created post, return it
```

### For UpdatePost Handler:
```go
_, err := h.db.Exec("UPDATE posts SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", req.Content, id)
// Check if post exists, update it, return updated post
```

### For DeletePost Handler:
```go
result, err := h.db.Exec("DELETE FROM posts WHERE id = ?", id)
// Check if post was actually deleted, return appropriate status
```
## Devel
opment Guide

### Project Structure Explained

```
simple-crud-board/
├── backend/
│   ├── main.go              # Server entry point, routes setup
│   ├── go.mod               # Go dependencies
│   ├── handlers/
│   │   └── posts.go         # HTTP handlers (YOUR IMPLEMENTATION HERE)
│   ├── models/
│   │   └── post.go          # Data structures and request/response models
│   └── database/
│       └── sqlite.go        # Database initialization and connection
├── frontend/
│   ├── pages/
│   │   └── index.js         # Main page component
│   ├── components/
│   │   ├── PostList.js      # Displays list of posts
│   │   ├── PostForm.js      # Form for creating/editing posts
│   │   └── PostItem.js      # Individual post display
│   ├── lib/
│   │   └── api.js           # API client functions
│   ├── package.json         # Node.js dependencies
│   └── next.config.js       # Next.js configuration with API proxy
└── README.md                # This documentation
```

### Step-by-Step Implementation

1. **Start with GetPosts**: Implement reading posts first to see data flow
2. **Then CreatePost**: Add ability to create new posts
3. **Add UpdatePost**: Implement editing functionality
4. **Finally DeletePost**: Complete CRUD with delete operation

### Testing Your Implementation

1. **Manual Testing**: Use the web interface to test each operation
2. **API Testing**: Use curl or Postman to test endpoints directly
3. **Error Testing**: Try invalid inputs to test error handling

### Common Issues and Solutions

- **CORS Errors**: Make sure backend CORS is configured for `http://localhost:3000`
- **Database Locked**: Ensure you're properly closing database connections
- **JSON Parsing**: Check request/response JSON format matches expected structure
- **SQL Errors**: Use proper parameter binding to prevent SQL injection

### Next Steps

After completing the basic implementation, you can extend the project with:
- User authentication (prepare for challenge 2)
- Post categories or tags
- Search functionality
- Pagination for large numbers of posts
- Rich text editing
- File uploads for images

This project serves as the foundation for more advanced challenges involving authentication, Docker deployment, and AWS cloud deployment.