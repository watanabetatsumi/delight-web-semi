# Lambda関数のビルドとパッケージング用Makefile
#
# 🎯 学習ポイント:
# - Go言語でのクロスコンパイル（Linux AMD64）
# - Lambda用のZIPパッケージ作成
# - 環境変数とビルドオプションの管理

# 変数定義
BINARY_NAME=bootstrap
PACKAGE_NAME=lambda-deployment.zip
BUILD_DIR=bin
LAMBDA_DIR=.

# デフォルトターゲット
.PHONY: all
all: clean build package

# クリーンアップ
.PHONY: clean
clean:
	@echo "Cleaning up..."
	# TODO: ビルドディレクトリとZIPファイルを削除
	rm -rf $(BUILD_DIR)
	rm -f $(PACKAGE_NAME)
	@echo "Cleanup completed"

# 依存関係の更新
.PHONY: deps
deps:
	@echo "Updating dependencies..."
	# TODO: Go modulesの依存関係を更新
	go mod tidy
	go mod download
	@echo "Dependencies updated"

# Linux AMD64用のビルド（Lambda環境用）
.PHONY: build
build: deps
	@echo "Building Lambda function for Linux AMD64..."
	# TODO: ビルドディレクトリを作成
	mkdir -p $(BUILD_DIR)
	
	# TODO: Linux AMD64用にクロスコンパイル
	# ヒント: GOOS=linux GOARCH=amd64 CGO_ENABLED=0
	# Lambda関数名は "bootstrap" または "main" にする必要がある
	GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build \
		-ldflags="-s -w" \
		-o $(BUILD_DIR)/$(BINARY_NAME) \
		cmd/main.go
	
	@echo "Build completed: $(BUILD_DIR)/$(BINARY_NAME)"

# ローカル環境用のビルド（テスト用）
.PHONY: build-local
build-local: deps
	@echo "Building for local environment..."
	mkdir -p $(BUILD_DIR)
	
	# TODO: ローカル環境用のビルド
	go build -o $(BUILD_DIR)/main-local cmd/main.go
	
	@echo "Local build completed: $(BUILD_DIR)/main-local"

# Lambda用ZIPパッケージの作成
.PHONY: package
package: build
	@echo "Creating Lambda deployment package..."
	
	# TODO: ZIPファイルを作成
	# Lambda関数のバイナリをZIPに圧縮
	cd $(BUILD_DIR) && zip -r ../$(PACKAGE_NAME) $(BINARY_NAME)
	
	@echo "Package created: $(PACKAGE_NAME)"
	@echo "Package size: $$(du -h $(PACKAGE_NAME) | cut -f1)"

# テストの実行
.PHONY: test
test:
	@echo "Running tests..."
	# TODO: ユニットテストを実行
	go test -v ./...
	@echo "Tests completed"

# テストカバレッジの確認
.PHONY: test-coverage
test-coverage:
	@echo "Running tests with coverage..."
	# TODO: カバレッジ付きでテストを実行
	go test -v -coverprofile=coverage.out ./...
	go tool cover -html=coverage.out -o coverage.html
	@echo "Coverage report generated: coverage.html"

# コードの静的解析
.PHONY: lint
lint:
	@echo "Running linter..."
	# TODO: golangci-lintを実行（インストールされている場合）
	@if command -v golangci-lint >/dev/null 2>&1; then \
		golangci-lint run; \
	else \
		echo "golangci-lint not installed, running go vet instead"; \
		go vet ./...; \
	fi
	@echo "Linting completed"

# フォーマットの確認と修正
.PHONY: fmt
fmt:
	@echo "Formatting code..."
	# TODO: コードフォーマットを実行
	go fmt ./...
	@echo "Formatting completed"

# Lambda関数のローカル実行（SAM CLI使用）
.PHONY: run-local
run-local: build-local
	@echo "Starting local Lambda function..."
	# TODO: SAM CLIでローカル実行（sam-local.yamlが必要）
	@if command -v sam >/dev/null 2>&1; then \
		sam local start-api; \
	else \
		echo "SAM CLI not installed. Please install SAM CLI for local testing."; \
		echo "Running binary directly (not recommended for Lambda testing):"; \
		./$(BUILD_DIR)/main-local; \
	fi

# AWS Lambda関数の更新（手動デプロイ用）
.PHONY: deploy
deploy: package
	@echo "Deploying Lambda function..."
	# TODO: AWS CLIでLambda関数を更新
	# 注意: 実際のデプロイはCI/CDパイプラインで行うことを推奨
	@if [ -z "$(FUNCTION_NAME)" ]; then \
		echo "Error: FUNCTION_NAME environment variable is required"; \
		echo "Usage: make deploy FUNCTION_NAME=your-function-name"; \
		exit 1; \
	fi
	
	aws lambda update-function-code \
		--function-name $(FUNCTION_NAME) \
		--zip-file fileb://$(PACKAGE_NAME)
	
	@echo "Deployment completed for function: $(FUNCTION_NAME)"

# 開発用の監視モード（ファイル変更時に自動ビルド）
.PHONY: watch
watch:
	@echo "Starting watch mode..."
	# TODO: ファイル変更監視（fswatch等のツールが必要）
	@if command -v fswatch >/dev/null 2>&1; then \
		fswatch -o . | xargs -n1 -I{} make build; \
	else \
		echo "fswatch not installed. Please install fswatch for watch mode."; \
		echo "Alternatively, manually run 'make build' when files change."; \
	fi

# ヘルプの表示
.PHONY: help
help:
	@echo "Available targets:"
	@echo "  all          - Clean, build, and package (default)"
	@echo "  clean        - Remove build artifacts"
	@echo "  deps         - Update Go dependencies"
	@echo "  build        - Build Lambda function for Linux AMD64"
	@echo "  build-local  - Build for local environment"
	@echo "  package      - Create Lambda deployment ZIP"
	@echo "  test         - Run unit tests"
	@echo "  test-coverage- Run tests with coverage report"
	@echo "  lint         - Run static code analysis"
	@echo "  fmt          - Format Go code"
	@echo "  run-local    - Run Lambda function locally (requires SAM CLI)"
	@echo "  deploy       - Deploy to AWS Lambda (requires FUNCTION_NAME)"
	@echo "  watch        - Watch for file changes and auto-build"
	@echo "  help         - Show this help message"
	@echo ""
	@echo "Examples:"
	@echo "  make build"
	@echo "  make deploy FUNCTION_NAME=my-lambda-function"
	@echo "  make test-coverage"