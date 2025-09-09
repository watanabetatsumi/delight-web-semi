#!/bin/bash

# フロントエンド静的サイトのビルドスクリプト
#
# 🎯 学習ポイント:
# - Next.jsの静的サイト生成プロセス
# - 環境変数を使用した設定管理
# - S3デプロイ用のファイル準備

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
FRONTEND_DIR="$PROJECT_ROOT/frontend"
BUILD_DIR="$FRONTEND_DIR/.next"
OUTPUT_DIR="$FRONTEND_DIR/out"

# TODO: 環境変数の設定
export NODE_ENV="${NODE_ENV:-production}"
export NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL:-}"
export NEXT_PUBLIC_ENVIRONMENT="${NEXT_PUBLIC_ENVIRONMENT:-production}"
export NEXT_PUBLIC_APP_NAME="${NEXT_PUBLIC_APP_NAME:-Simple CRUD Board}"

log_info "Starting frontend build process..."
log_info "Frontend directory: $FRONTEND_DIR"
log_info "Node environment: $NODE_ENV"
log_info "API URL: ${NEXT_PUBLIC_API_URL:-'Not set'}"

# 前提条件のチェック
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # TODO: Node.jsがインストールされているかチェック
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed or not in PATH"
        exit 1
    fi
    
    # TODO: npmがインストールされているかチェック
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed or not in PATH"
        exit 1
    fi
    
    # TODO: Node.jsのバージョンチェック
    NODE_VERSION=$(node --version | sed 's/v//')
    log_info "Node.js version: $NODE_VERSION"
    
    # TODO: フロントエンドディレクトリの存在チェック
    if [ ! -d "$FRONTEND_DIR" ]; then
        log_error "Frontend directory not found: $FRONTEND_DIR"
        exit 1
    fi
    
    # TODO: package.jsonファイルの存在チェック
    if [ ! -f "$FRONTEND_DIR/package.json" ]; then
        log_error "package.json not found: $FRONTEND_DIR/package.json"
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

# 環境変数の検証
validate_environment() {
    log_info "Validating environment variables..."
    
    # TODO: 必須環境変数のチェック
    if [ -z "$NEXT_PUBLIC_API_URL" ]; then
        log_warning "NEXT_PUBLIC_API_URL is not set"
        log_warning "Frontend will use default API URL"
    else
        log_info "API URL configured: $NEXT_PUBLIC_API_URL"
    fi
    
    # TODO: API URLの形式チェック
    if [ -n "$NEXT_PUBLIC_API_URL" ]; then
        if [[ ! "$NEXT_PUBLIC_API_URL" =~ ^https?:// ]]; then
            log_error "Invalid API URL format: $NEXT_PUBLIC_API_URL"
            log_error "API URL must start with http:// or https://"
            exit 1
        fi
    fi
    
    log_success "Environment validation completed"
}

# 依存関係のインストール
install_dependencies() {
    log_info "Installing dependencies..."
    
    cd "$FRONTEND_DIR"
    
    # TODO: package-lock.jsonの存在チェック
    if [ -f "package-lock.json" ]; then
        log_info "Using npm ci for faster, reliable, reproducible builds"
        npm ci
    else
        log_info "Using npm install"
        npm install
    fi
    
    log_success "Dependencies installed successfully"
}

# 既存ビルドファイルのクリーンアップ
cleanup_build_files() {
    log_info "Cleaning up previous build files..."
    
    cd "$FRONTEND_DIR"
    
    # TODO: 既存のビルドディレクトリを削除
    if [ -d "$BUILD_DIR" ]; then
        rm -rf "$BUILD_DIR"
        log_info "Removed existing .next directory"
    fi
    
    # TODO: 既存の出力ディレクトリを削除
    if [ -d "$OUTPUT_DIR" ]; then
        rm -rf "$OUTPUT_DIR"
        log_info "Removed existing out directory"
    fi
    
    log_success "Cleanup completed"
}

# Next.jsアプリケーションのビルド
build_application() {
    log_info "Building Next.js application..."
    
    cd "$FRONTEND_DIR"
    
    # TODO: Next.jsビルドの実行
    if ! npm run build; then
        log_error "Failed to build Next.js application"
        exit 1
    fi
    
    log_success "Next.js build completed"
}

# 静的ファイルのエクスポート
export_static_files() {
    log_info "Exporting static files..."
    
    cd "$FRONTEND_DIR"
    
    # TODO: 静的エクスポートの実行
    if ! npm run export; then
        log_error "Failed to export static files"
        exit 1
    fi
    
    # TODO: 出力ディレクトリの確認
    if [ ! -d "$OUTPUT_DIR" ]; then
        log_error "Output directory not found after export: $OUTPUT_DIR"
        exit 1
    fi
    
    # TODO: 出力ファイルの確認
    FILE_COUNT=$(find "$OUTPUT_DIR" -type f | wc -l)
    TOTAL_SIZE=$(du -sh "$OUTPUT_DIR" | cut -f1)
    
    log_success "Static export completed"
    log_info "Generated files: $FILE_COUNT"
    log_info "Total size: $TOTAL_SIZE"
}

# S3デプロイ用の最適化
optimize_for_s3() {
    log_info "Optimizing files for S3 deployment..."
    
    cd "$OUTPUT_DIR"
    
    # TODO: .nojekyllファイルの作成（GitHub Pages用だが、S3でも有用）
    touch .nojekyll
    
    # TODO: index.htmlファイルの存在確認
    if [ ! -f "index.html" ]; then
        log_error "index.html not found in output directory"
        exit 1
    fi
    
    # TODO: 404.htmlファイルの作成（存在しない場合）
    if [ ! -f "404.html" ]; then
        log_info "Creating 404.html from index.html"
        cp index.html 404.html
    fi
    
    # TODO: ファイル権限の設定
    find . -type f -exec chmod 644 {} \;
    find . -type d -exec chmod 755 {} \;
    
    log_success "S3 optimization completed"
}

# ビルド結果の検証
validate_build_output() {
    log_info "Validating build output..."
    
    # TODO: 必須ファイルの存在チェック
    REQUIRED_FILES=("index.html" "_next")
    
    cd "$OUTPUT_DIR"
    
    for file in "${REQUIRED_FILES[@]}"; do
        if [ ! -e "$file" ]; then
            log_error "Required file/directory not found: $file"
            exit 1
        fi
    done
    
    # TODO: HTMLファイルの基本的な検証
    if ! grep -q "<!DOCTYPE html>" index.html; then
        log_warning "index.html may not be a valid HTML document"
    fi
    
    # TODO: JavaScriptファイルの存在確認
    JS_FILES=$(find . -name "*.js" | wc -l)
    if [ "$JS_FILES" -eq 0 ]; then
        log_warning "No JavaScript files found in output"
    fi
    
    log_success "Build output validation completed"
}

# メイン処理
main() {
    log_info "Frontend build script started"
    
    # TODO: 各ステップを順次実行
    check_prerequisites
    validate_environment
    install_dependencies
    cleanup_build_files
    build_application
    export_static_files
    optimize_for_s3
    validate_build_output
    
    log_success "Frontend build completed successfully!"
    log_info "Static files ready for deployment: $OUTPUT_DIR"
    
    # TODO: 次のステップの案内
    echo ""
    log_info "Next steps:"
    echo "  1. Test locally: cd frontend && npx serve out"
    echo "  2. Deploy to S3: aws s3 sync out/ s3://your-bucket-name --delete"
    echo "  3. Use CI/CD pipeline for automated deployment"
    
    # TODO: デプロイ用の情報出力
    echo ""
    log_info "Deployment information:"
    echo "  Output directory: $OUTPUT_DIR"
    echo "  File count: $(find "$OUTPUT_DIR" -type f | wc -l)"
    echo "  Total size: $(du -sh "$OUTPUT_DIR" | cut -f1)"
}

# スクリプトの実行
main "$@"