# Requirements Document

## Introduction

simple-crud-boardアプリケーションをAWSにデプロイするためのインフラストラクチャとCI/CDパイプラインを実装します。TerraformによるIaC（Infrastructure as Code）を使用し、S3 + Lambda + DynamoDB構成で無料枠内での運用を目指します。GitHub Actionsを使用してCI/CDパイプラインを構築し、自動デプロイメントを実現します。

## Requirements

### Requirement 1

**User Story:** As a developer, I want to define AWS infrastructure using Terraform, so that I can manage infrastructure as code and ensure reproducible deployments.

#### Acceptance Criteria

1. WHEN Terraform configuration is applied THEN the system SHALL create an S3 bucket for static website hosting
2. WHEN Terraform configuration is applied THEN the system SHALL create a Lambda function for the backend API
3. WHEN Terraform configuration is applied THEN the system SHALL create a DynamoDB table for post storage
4. WHEN Terraform configuration is applied THEN the system SHALL create an API Gateway to route requests to Lambda
5. WHEN Terraform configuration is applied THEN the system SHALL configure appropriate IAM roles and policies
6. WHEN Terraform configuration is applied THEN the system SHALL output necessary values for CI/CD pipeline

### Requirement 2

**User Story:** As a developer, I want to deploy the Next.js frontend to S3, so that users can access the application through a web browser.

#### Acceptance Criteria

1. WHEN the frontend is built THEN the system SHALL generate static files using Next.js export
2. WHEN static files are generated THEN the system SHALL upload them to the S3 bucket
3. WHEN S3 bucket is configured THEN the system SHALL enable static website hosting
4. WHEN S3 bucket is configured THEN the system SHALL set appropriate bucket policies for public read access
5. WHEN the deployment is complete THEN the system SHALL provide a public URL for accessing the application

### Requirement 3

**User Story:** As a developer, I want to deploy the Go backend as a Lambda function, so that I can run the API without managing servers.

#### Acceptance Criteria

1. WHEN the Go code is built THEN the system SHALL compile it for Linux AMD64 architecture
2. WHEN the Go binary is created THEN the system SHALL package it in a ZIP file for Lambda deployment
3. WHEN the Lambda function is deployed THEN the system SHALL configure it with appropriate runtime settings
4. WHEN the Lambda function is deployed THEN the system SHALL set environment variables for DynamoDB table name
5. WHEN the Lambda function receives requests THEN the system SHALL handle API Gateway proxy integration

### Requirement 4

**User Story:** As a developer, I want to use DynamoDB for data storage, so that I can have a serverless database solution.

#### Acceptance Criteria

1. WHEN DynamoDB table is created THEN the system SHALL use a partition key suitable for post storage
2. WHEN DynamoDB table is created THEN the system SHALL configure it for on-demand billing to stay within free tier
3. WHEN the Go backend connects to DynamoDB THEN the system SHALL use AWS SDK for Go v2
4. WHEN posts are stored THEN the system SHALL handle DynamoDB-specific data types and operations
5. WHEN DynamoDB operations fail THEN the system SHALL handle errors gracefully and return appropriate HTTP responses

### Requirement 5

**User Story:** As a developer, I want GitHub Actions CI/CD pipeline, so that I can automatically deploy changes to AWS.

#### Acceptance Criteria

1. WHEN code is pushed to main branch THEN the system SHALL trigger the deployment workflow
2. WHEN the workflow runs THEN the system SHALL build the Next.js frontend and deploy to S3
3. WHEN the workflow runs THEN the system SHALL build the Go Lambda function and deploy to AWS
4. WHEN the workflow runs THEN the system SHALL apply Terraform changes if infrastructure updates are needed
5. WHEN deployment fails THEN the system SHALL provide clear error messages and stop the pipeline
6. WHEN deployment succeeds THEN the system SHALL provide the application URL in the workflow output

### Requirement 6

**User Story:** As a developer, I want secure AWS credentials management, so that I can deploy safely without exposing sensitive information.

#### Acceptance Criteria

1. WHEN GitHub Actions runs THEN the system SHALL use GitHub Secrets for AWS credentials
2. WHEN Terraform state is managed THEN the system SHALL use S3 backend for remote state storage
3. WHEN IAM roles are created THEN the system SHALL follow the principle of least privilege
4. WHEN Lambda function accesses DynamoDB THEN the system SHALL use IAM roles instead of hardcoded credentials
5. WHEN S3 bucket is created THEN the system SHALL enable appropriate security settings

### Requirement 7

**User Story:** As a developer, I want cost optimization, so that I can run the application within AWS free tier limits.

#### Acceptance Criteria

1. WHEN Lambda function is configured THEN the system SHALL use minimum memory allocation (128MB)
2. WHEN DynamoDB table is configured THEN the system SHALL use on-demand billing mode
3. WHEN S3 bucket is configured THEN the system SHALL use standard storage class
4. WHEN API Gateway is configured THEN the system SHALL use REST API (not HTTP API) to stay within free tier
5. WHEN monitoring is needed THEN the system SHALL use CloudWatch free tier limits

### Requirement 8

**User Story:** As a developer, I want environment separation, so that I can test deployments without affecting production.

#### Acceptance Criteria

1. WHEN Terraform is configured THEN the system SHALL support multiple environments (dev, prod)
2. WHEN resources are created THEN the system SHALL use environment-specific naming conventions
3. WHEN GitHub Actions runs THEN the system SHALL deploy to appropriate environment based on branch
4. WHEN environment variables are set THEN the system SHALL use environment-specific values
5. WHEN Terraform state is managed THEN the system SHALL separate state files by environment