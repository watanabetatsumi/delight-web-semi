/** @type {import('next').NextConfig} */

// Next.js設定ファイル（AWS S3静的サイトホスティング用）
//
// 🎯 学習ポイント:
// - 静的サイト生成（SSG）の設定
// - S3ホスティング用の最適化
// - 環境変数の管理

const nextConfig = {
  // TODO: 静的エクスポートを有効にする
  // ヒント: output: 'export' で静的サイト生成
  output: 'TODO: 静的エクスポート設定',

  // TODO: 末尾スラッシュの設定
  // S3の静的サイトホスティングでは末尾スラッシュが必要
  trailingSlash: true,

  // TODO: 画像最適化の無効化
  // 静的エクスポートでは画像最適化が使用できない
  images: {
    unoptimized: true,
  },

  // TODO: 厳密モードの有効化
  reactStrictMode: true,

  // TODO: SWCミニファイの有効化（パフォーマンス向上）
  swcMinify: true,

  // TODO: 実験的機能の設定
  experimental: {
    // App Routerの使用（Next.js 13+）
    appDir: true,
  },

  // TODO: 環境変数の設定
  env: {
    // フロントエンドで使用するAPI URL
    // CI/CDパイプラインで動的に設定される
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'TODO: デフォルトAPI URL',
    
    // 環境名（dev, staging, prod）
    NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT || 'TODO: デフォルト環境名',
    
    // アプリケーション名
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'TODO: アプリケーション名',
  },

  // TODO: アセットプレフィックスの設定（CDN使用時）
  // CloudFrontを使用する場合のベースパス
  // assetPrefix: process.env.NEXT_PUBLIC_CDN_URL || '',

  // TODO: ベースパスの設定（サブディレクトリでホスティングする場合）
  // basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',

  // TODO: ESLint設定
  eslint: {
    // ビルド時にESLintエラーを無視する（本番では false に設定）
    ignoreDuringBuilds: false,
  },

  // TODO: TypeScript設定
  typescript: {
    // ビルド時にTypeScriptエラーを無視する（本番では false に設定）
    ignoreBuildErrors: false,
  },

  // TODO: ヘッダー設定（セキュリティ強化）
  async headers() {
    return [
      {
        // すべてのルートに適用
        source: '/(.*)',
        headers: [
          // TODO: セキュリティヘッダーを設定
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          // TODO: CSP（Content Security Policy）の設定
          // {
          //   key: 'Content-Security-Policy',
          //   value: "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
          // },
        ],
      },
    ];
  },

  // TODO: リダイレクト設定
  async redirects() {
    return [
      // 例: ルートパスから/postsにリダイレクト
      // {
      //   source: '/',
      //   destination: '/posts',
      //   permanent: false,
      // },
    ];
  },

  // TODO: リライト設定（API プロキシなど）
  async rewrites() {
    return [
      // 開発環境でのAPIプロキシ設定例
      // {
      //   source: '/api/:path*',
      //   destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      // },
    ];
  },

  // TODO: Webpack設定のカスタマイズ
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // カスタムWebpack設定があればここに追加
    
    // 例: バンドルアナライザーの設定
    // if (process.env.ANALYZE === 'true') {
    //   const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
    //   config.plugins.push(
    //     new BundleAnalyzerPlugin({
    //       analyzerMode: 'static',
    //       openAnalyzer: false,
    //     })
    //   );
    // }

    return config;
  },

  // TODO: 出力ファイルの設定
  generateBuildId: async () => {
    // カスタムビルドIDの生成（オプション）
    // デフォルトではランダムな文字列が使用される
    return process.env.BUILD_ID || null;
  },
};

module.exports = nextConfig;