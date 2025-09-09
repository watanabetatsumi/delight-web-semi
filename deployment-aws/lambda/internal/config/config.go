// 設定管理パッケージ
//
// 🎯 学習ポイント:
// - 環境変数から設定を読み込む
// - デフォルト値の設定
// - 設定の検証

package config

import (
	"fmt"
	"os"
)

// Config はアプリケーションの設定を保持する構造体
type Config struct {
	// DynamoDBテーブル名
	DynamoDBTableName string
	
	// AWSリージョン
	AWSRegion string
	
	// ログレベル
	LogLevel string
	
	// CORS設定
	AllowedOrigins []string
}

// Load は環境変数から設定を読み込む
func Load() (*Config, error) {
	config := &Config{}

	// TODO: DynamoDBテーブル名の読み込み
	// ヒント: os.Getenv("DYNAMODB_TABLE_NAME")
	config.DynamoDBTableName = os.Getenv("TODO: 環境変数名を設定")
	if config.DynamoDBTableName == "" {
		return nil, fmt.Errorf("DYNAMODB_TABLE_NAME environment variable is required")
	}

	// TODO: AWSリージョンの読み込み
	// ヒント: AWS_REGIONまたはAWS_DEFAULT_REGION
	config.AWSRegion = os.Getenv("TODO: 環境変数名を設定")
	if config.AWSRegion == "" {
		// TODO: デフォルトリージョンを設定
		config.AWSRegion = "TODO: デフォルトリージョンを設定"
	}

	// TODO: ログレベルの読み込み
	config.LogLevel = os.Getenv("TODO: 環境変数名を設定")
	if config.LogLevel == "" {
		// TODO: デフォルトログレベルを設定
		config.LogLevel = "TODO: デフォルトログレベルを設定"
	}

	// TODO: CORS許可オリジンの設定
	// ヒント: 環境変数から読み込むか、デフォルト値を設定
	allowedOrigins := os.Getenv("ALLOWED_ORIGINS")
	if allowedOrigins != "" {
		// TODO: カンマ区切りの文字列を配列に変換
		// ヒント: strings.Split(allowedOrigins, ",")
		config.AllowedOrigins = []string{allowedOrigins} // 簡略化版
	} else {
		// TODO: デフォルトの許可オリジンを設定
		config.AllowedOrigins = []string{"TODO: デフォルト許可オリジンを設定"}
	}

	return config, nil
}

// Validate は設定の妥当性を検証する
func (c *Config) Validate() error {
	// TODO: 必須設定項目の検証
	if c.DynamoDBTableName == "" {
		return fmt.Errorf("DynamoDBTableName is required")
	}

	if c.AWSRegion == "" {
		return fmt.Errorf("AWSRegion is required")
	}

	// TODO: 追加の検証ロジック
	// 例: リージョン名の形式チェック、テーブル名の形式チェックなど

	return nil
}

// GetDynamoDBTableName はDynamoDBテーブル名を返す
func (c *Config) GetDynamoDBTableName() string {
	return c.DynamoDBTableName
}

// GetAWSRegion はAWSリージョンを返す
func (c *Config) GetAWSRegion() string {
	return c.AWSRegion
}

// GetLogLevel はログレベルを返す
func (c *Config) GetLogLevel() string {
	return c.LogLevel
}

// GetAllowedOrigins は許可されたオリジンのリストを返す
func (c *Config) GetAllowedOrigins() []string {
	return c.AllowedOrigins
}