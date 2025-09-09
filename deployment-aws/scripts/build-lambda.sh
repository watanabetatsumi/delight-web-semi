#!/bin/bash

# Lambda関数のビルドスクリプト
#
# 🎯 学習ポイント:
# - シェルスクリプトでのビルド自動化
# - エラーハンドリングとログ出力
# - CI/CD環境での使用を想定した設計

set -e  # エラー時にスクリプトを終了
set -u  # 未定義変数使用時にエラー

# 色付きログ出力用の定数
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ログ出力関数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 設定変数
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
LAMBDA_DIR="$PROJECT_ROOT/lambda"
BUILD_DIR="$LAMBDA_DIR/bin"
BINARY_NAME="bootstrap"
PACKAGE_NAME="lambda-deployment.zip"

# TODO: 環境変数から設定を読み込み
GOOS="${GOOS:-linux}"
GOARCH="${GOARCH:-amd64}"
CGO_ENABLED="${CGO_ENABLED:-0}"

log_info "Starting Lambda function build process..."
log_info "Project root: $PROJECT_ROOT"
log_info "Lambda directory: $LAMBDA_DIR"
log_info "Target OS/Arch: $GOOS/$GOARCH"

# 前提条件のチェック
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # TODO: Goがインストールされているかチェック
    if ! command -v go &> /dev/null; then
        log_error "Go is not installed or not in PATH"
        exit 1
    fi
    
    # TODO: Goのバージョンチェック
    GO_VERSION=$(go version | awk '{print $3}' | sed 's/go//')
    log_info "Go version: $GO_VERSION"
    
    # TODO: Lambdaディレクトリの存在チェック
    if [ ! -d "$LAMBDA_DIR" ]; then
        log_error "Lambda directory not found: $LAMBDA_DIR"
        exit 1
    fi
    
    # TODO: main.goファイルの存在チェック
    if [ ! -f "$LAMBDA_DIR/cmd/main.go" ]; then
        log_error "Main Go file not found: $LAMBDA_DIR/cmd/main.go"
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

# 依存関係の更新
update_dependencies() {
    log_info "Updating Go dependencies..."
    
    cd "$LAMBDA_DIR"
    
    # TODO: go mod tidyで依存関係を整理
    if ! go mod tidy; then
        log_error "Failed to tidy Go modules"
        exit 1
    fi
    
    # TODO: go mod downloadで依存関係をダウンロード
    if ! go mod download; then
        log_error "Failed to download Go modules"
        exit 1
    fi
    
    log_success "Dependencies updated successfully"
}

# ビルドディレクトリの準備
prepare_build_dir() {
    log_info "Preparing build directory..."
    
    # TODO: 既存のビルドディレクトリを削除
    if [ -d "$BUILD_DIR" ]; then
        rm -rf "$BUILD_DIR"
        log_info "Removed existing build directory"
    fi
    
    # TODO: 新しいビルドディレクトリを作成
    mkdir -p "$BUILD_DIR"
    log_success "Build directory prepared: $BUILD_DIR"
}

# Go言語のビルド実行
build_binary() {
    log_info "Building Lambda binary..."
    
    cd "$LAMBDA_DIR"
    
    # TODO: ビルドコマンドの実行
    # クロスコンパイル設定とビルドフラグ
    if ! GOOS="$GOOS" GOARCH="$GOARCH" CGO_ENABLED="$CGO_ENABLED" go build \
        -ldflags="-s -w" \
        -o "$BUILD_DIR/$BINARY_NAME" \
        cmd/main.go; then
        log_error "Failed to build Lambda binary"
        exit 1
    fi
    
    # TODO: ビルド結果の確認
    if [ ! -f "$BUILD_DIR/$BINARY_NAME" ]; then
        log_error "Binary not found after build: $BUILD_DIR/$BINARY_NAME"
        exit 1
    fi
    
    # TODO: バイナリサイズの表示
    BINARY_SIZE=$(du -h "$BUILD_DIR/$BINARY_NAME" | cut -f1)
    log_success "Binary built successfully: $BINARY_NAME ($BINARY_SIZE)"
}

# ZIPパッケージの作成
create_package() {
    log_info "Creating deployment package..."
    
    cd "$BUILD_DIR"
    
    # TODO: 既存のZIPファイルを削除
    if [ -f "../$PACKAGE_NAME" ]; then
        rm "../$PACKAGE_NAME"
        log_info "Removed existing package"
    fi
    
    # TODO: ZIPファイルの作成
    if ! zip -r "../$PACKAGE_NAME" "$BINARY_NAME"; then
        log_error "Failed to create deployment package"
        exit 1
    fi
    
    # TODO: パッケージサイズの確認
    PACKAGE_SIZE=$(du -h "../$PACKAGE_NAME" | cut -f1)
    log_success "Deployment package created: $PACKAGE_NAME ($PACKAGE_SIZE)"
    
    # TODO: Lambda制限の確認（50MB未圧縮、10MB圧縮）
    PACKAGE_SIZE_BYTES=$(stat -f%z "../$PACKAGE_NAME" 2>/dev/null || stat -c%s "../$PACKAGE_NAME")
    MAX_SIZE_BYTES=$((10 * 1024 * 1024))  # 10MB
    
    if [ "$PACKAGE_SIZE_BYTES" -gt "$MAX_SIZE_BYTES" ]; then
        log_warning "Package size ($PACKAGE_SIZE) exceeds Lambda limit (10MB)"
        log_warning "Consider optimizing the binary or using Lambda layers"
    fi
}

# テストの実行（オプション）
run_tests() {
    if [ "${RUN_TESTS:-false}" = "true" ]; then
        log_info "Running tests..."
        
        cd "$LAMBDA_DIR"
        
        # TODO: ユニットテストの実行
        if ! go test -v ./...; then
            log_error "Tests failed"
            exit 1
        fi
        
        log_success "All tests passed"
    else
        log_info "Skipping tests (set RUN_TESTS=true to enable)"
    fi
}

# メイン処理
main() {
    log_info "Lambda build script started"
    
    # TODO: 各ステップを順次実行
    check_prerequisites
    update_dependencies
    prepare_build_dir
    build_binary
    create_package
    run_tests
    
    log_success "Lambda function build completed successfully!"
    log_info "Deployment package: $LAMBDA_DIR/$PACKAGE_NAME"
    
    # TODO: 次のステップの案内
    echo ""
    log_info "Next steps:"
    echo "  1. Test locally: cd lambda && make run-local"
    echo "  2. Deploy manually: aws lambda update-function-code --function-name YOUR_FUNCTION --zip-file fileb://$PACKAGE_NAME"
    echo "  3. Use CI/CD pipeline for automated deployment"
}

# スクリプトの実行
main "$@"