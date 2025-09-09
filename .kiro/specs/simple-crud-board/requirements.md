# Requirements Document

## Introduction

学習目的の単純なCRUD機能を持つ掲示板アプリケーションを実装します。フロントエンドはNext.js、バックエンドはGolang（Gin）、データベースはSQLiteを使用し、認証機能は含まない基本的な投稿・表示機能を提供します。バックエンドAPIのエンドポイントは作成しますが、実装は空の状態にして学習者が実装できるようにします。

## Requirements

### Requirement 1

**User Story:** As a user, I want to view all posts on a bulletin board, so that I can see what others have posted.

#### Acceptance Criteria

1. WHEN the user accesses the main page THEN the system SHALL display all existing posts in chronological order (newest first)
2. WHEN there are no posts THEN the system SHALL display an appropriate empty state message
3. WHEN posts are displayed THEN each post SHALL show the content, timestamp, and a unique identifier

### Requirement 2

**User Story:** As a user, I want to create a new post, so that I can share my thoughts with others.

#### Acceptance Criteria

1. WHEN the user accesses the post creation form THEN the system SHALL display a text input field for post content
2. WHEN the user submits a valid post THEN the system SHALL save the post to the database
3. WHEN the post is successfully created THEN the system SHALL redirect the user to the main page showing the new post
4. WHEN the user submits an empty post THEN the system SHALL display an error message

### Requirement 3

**User Story:** As a user, I want to edit my existing posts, so that I can correct mistakes or update information.

#### Acceptance Criteria

1. WHEN the user clicks an edit button on a post THEN the system SHALL display an edit form with the current post content
2. WHEN the user submits valid updated content THEN the system SHALL update the post in the database
3. WHEN the post is successfully updated THEN the system SHALL redirect to the main page showing the updated post
4. WHEN the user cancels editing THEN the system SHALL return to the main page without changes

### Requirement 4

**User Story:** As a user, I want to delete posts, so that I can remove content I no longer want displayed.

#### Acceptance Criteria

1. WHEN the user clicks a delete button on a post THEN the system SHALL prompt for confirmation
2. WHEN the user confirms deletion THEN the system SHALL remove the post from the database
3. WHEN the post is successfully deleted THEN the system SHALL redirect to the main page without the deleted post
4. WHEN the user cancels deletion THEN the system SHALL return to the main page without changes

### Requirement 5

**User Story:** As a developer, I want REST API endpoints with empty implementations, so that I can practice implementing the actual functionality.

#### Acceptance Criteria

1. WHEN the API server starts THEN the system SHALL expose GET /api/posts endpoint with empty implementation
2. WHEN the API server starts THEN the system SHALL expose POST /api/posts endpoint with empty implementation
3. WHEN the API server starts THEN the system SHALL expose PUT /api/posts/:id endpoint with empty implementation
4. WHEN the API server starts THEN the system SHALL expose DELETE /api/posts/:id endpoint with empty implementation
5. WHEN any endpoint is called THEN the system SHALL return appropriate HTTP status codes and JSON responses

### Requirement 6

**User Story:** As a developer, I want a SQLite database setup, so that I can store and retrieve post data.

#### Acceptance Criteria

1. WHEN the application starts THEN the system SHALL create a SQLite database file if it doesn't exist
2. WHEN the database is initialized THEN the system SHALL create a posts table with appropriate columns (id, content, created_at, updated_at)
3. WHEN the application connects to the database THEN the system SHALL handle connection errors gracefully

### Requirement 7

**User Story:** As a developer, I want GitHub Actions CI/CD pipeline, so that I can automatically deploy the application to AWS.

#### Acceptance Criteria

1. WHEN code is pushed to the main branch THEN the system SHALL trigger a GitHub Actions workflow
2. WHEN the workflow runs THEN the system SHALL build the Next.js frontend and create a static export
3. WHEN the frontend build is complete THEN the system SHALL deploy static files to S3
4. WHEN the workflow runs THEN the system SHALL build and package the Go Lambda function
5. WHEN the Lambda function is packaged THEN the system SHALL deploy it using AWS CLI or Terraform
6. WHEN deployment is complete THEN the system SHALL update DynamoDB table configuration if needed

### Requirement 8

**User Story:** As a developer, I want AWS infrastructure setup, so that I can host the application in a serverless environment.

#### Acceptance Criteria

1. WHEN deploying to AWS THEN the system SHALL use S3 for hosting the static Next.js frontend
2. WHEN deploying to AWS THEN the system SHALL use Lambda for the Go backend API
3. WHEN deploying to AWS THEN the system SHALL use DynamoDB instead of SQLite for data storage
4. WHEN using DynamoDB THEN the system SHALL create a posts table with appropriate partition key and attributes
5. WHEN the infrastructure is deployed THEN the system SHALL configure API Gateway to route requests to Lambda
6. WHEN using Terraform THEN the system SHALL define all AWS resources as Infrastructure as Code