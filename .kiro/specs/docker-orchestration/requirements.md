# Requirements Document

## Introduction

このプロジェクトは、MakefileとDockerを活用して、既存のWebアプリケーション（simple-crud-board、user-authentication）の開発・運用環境を統合し、本格的なマイクロサービス環境を構築する機能です。SQLiteではなくMySQLサーバーを使用し、マルチステージビルド、Caddyを使ったHTTPS通信、クリーンアーキテクチャに基づくGoバックエンドの実装を含みます。

## Requirements

### Requirement 1

**User Story:** 開発者として、Makefileを使って複数のアプリケーションを一括で起動・停止できるようにしたい。そうすることで、開発環境のセットアップが簡単になり、チーム開発が効率化される。

#### Acceptance Criteria

1. WHEN 開発者が `make up` コマンドを実行する THEN システムは全てのDockerコンテナ（フロントエンド、バックエンド、データベース、プロキシ）を起動する SHALL
2. WHEN 開発者が `make down` コマンドを実行する THEN システムは全てのDockerコンテナを停止し、リソースをクリーンアップする SHALL
3. WHEN 開発者が `make logs` コマンドを実行する THEN システムは全サービスのログを表示する SHALL
4. WHEN 開発者が `make build` コマンドを実行する THEN システムは全てのDockerイメージを再ビルドする SHALL

### Requirement 2

**User Story:** 開発者として、MySQLデータベースサーバーを使用したい。そうすることで、本番環境により近い環境で開発でき、SQLiteの制限を回避できる。

#### Acceptance Criteria

1. WHEN システムが起動する THEN MySQLコンテナが起動し、データベースが利用可能になる SHALL
2. WHEN アプリケーションがデータベースに接続する THEN MySQL 8.0以上のバージョンを使用する SHALL
3. WHEN データベースが初期化される THEN 必要なテーブルとサンプルデータが自動的に作成される SHALL
4. WHEN 開発者がデータベースにアクセスしたい THEN 専用のポートを通じて外部からアクセスできる SHALL

### Requirement 3

**User Story:** 開発者として、マルチステージビルドを使用してDockerイメージを最適化したい。そうすることで、本番用イメージのサイズを削減し、セキュリティを向上させることができる。

#### Acceptance Criteria

1. WHEN Dockerイメージをビルドする THEN ビルドステージと実行ステージを分離する SHALL
2. WHEN 本番用イメージを作成する THEN 不要な開発ツールやソースコードを含まない SHALL
3. WHEN イメージサイズを比較する THEN マルチステージビルド使用後のイメージサイズが従来より小さくなる SHALL
4. WHEN セキュリティスキャンを実行する THEN 脆弱性の数が削減されている SHALL

### Requirement 4

**User Story:** 開発者として、CaddyをリバースプロキシとしてHTTPS通信を実現したい。そうすることで、本番環境と同様のセキュアな通信環境で開発できる。

#### Acceptance Criteria

1. WHEN システムが起動する THEN Caddyコンテナがリバースプロキシとして動作する SHALL
2. WHEN ユーザーがアプリケーションにアクセスする THEN HTTPS通信が自動的に有効になる SHALL
3. WHEN 複数のサービスにアクセスする THEN Caddyが適切なバックエンドサービスにルーティングする SHALL
4. WHEN SSL証明書が必要な場合 THEN Caddyが自動的に証明書を生成・管理する SHALL

### Requirement 5

**User Story:** 開発者として、Goバックエンドをクリーンアーキテクチャで実装したい。そうすることで、保守性が高く、テストしやすいコードベースを構築できる。

#### Acceptance Criteria

1. WHEN バックエンドアーキテクチャを設計する THEN Entity層、Service層、Repository層、Handler層に分離する SHALL
2. WHEN 層間の依存関係を定義する THEN 上位層が下位層に依存し、逆方向の依存は interface を通じて実現する SHALL
3. WHEN 依存性注入を実装する THEN Go の interface を使用して疎結合を実現する SHALL
4. WHEN ビジネスロジックを実装する THEN Entity層とService層にビジネスルールを集約する SHALL

### Requirement 6

**User Story:** 開発者として、Docker Networkを構築して各サービス間の通信を管理したい。そうすることで、セキュリティを向上させ、サービス間の依存関係を明確にできる。

#### Acceptance Criteria

1. WHEN Docker環境を構築する THEN 専用のDocker Networkを作成する SHALL
2. WHEN サービス間で通信する THEN 内部ネットワーク経由でのみ通信を許可する SHALL
3. WHEN 外部からアクセスする THEN Caddyプロキシ経由でのみアクセスを許可する SHALL
4. WHEN ネットワーク設定を変更する THEN サービスの再起動なしに設定を反映できる SHALL

### Requirement 7

**User Story:** 開発者として、既存のsimple-crud-boardとuser-authenticationアプリケーションを統合したい。そうすることで、統一された開発環境で複数のサービスを管理できる。

#### Acceptance Criteria

1. WHEN 既存アプリケーションを統合する THEN 各アプリケーションが独立したコンテナとして動作する SHALL
2. WHEN アプリケーション間で通信する THEN 適切なAPI経由で連携する SHALL
3. WHEN 認証が必要な場合 THEN user-authenticationサービスを通じて認証を行う SHALL
4. WHEN データを共有する場合 THEN 同一のMySQLデータベースを使用する SHALL