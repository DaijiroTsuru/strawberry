# 津留いちご園 Webサイト

津留いちご園の公式Webサイトです。React + TypeScript + Vite + Shopifyで構築されています。

## 🚀 クイックスタート

### 依存関係のインストール
```bash
npm install
```

### 開発サーバーの起動
```bash
npm run dev
```

### ビルド
```bash
npm run build
```

## 📦 主な機能

- **商品販売**: Shopify Storefront APIとの統合
- **カート機能**: リアルタイムショッピングカート
- **お問い合わせフォーム**: EmailJSを使用したメール送信
- **Googleレビュー**: Google Places APIから自動取得

## ⚙️ 環境変数の設定

`.env.example` をコピーして `.env` ファイルを作成し、以下の変数を設定してください：

```env
# Shopify設定
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token

# EmailJS設定
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key

# Google Places API設定
VITE_GOOGLE_PLACES_API_KEY=your_google_api_key
VITE_GOOGLE_PLACE_ID=your_place_id
```

## 📚 ドキュメント

各機能の詳細なセットアップ方法は `/guides` ディレクトリを参照してください：

- [Shopify統合ガイド](guides/SHOPIFY_SETUP.md) - Shopify Storefront APIの設定方法
- [Shopify統合概要](guides/SHOPIFY_INTEGRATION.md) - Shopify機能の使用方法
- [EmailJS設定ガイド](guides/EMAILJS_SETUP.md) - お問い合わせフォームの設定
- [Google Reviews設定](guides/GOOGLE_REVIEWS_SETUP.md) - Googleレビュー取得の設定
- [お問い合わせフォーム統合](guides/CONTACT_FORM_INTEGRATION.md) - フォーム機能の詳細
- [GitHub Pagesデプロイ](guides/GITHUB_PAGES_DEPLOYMENT.md) - GitHub Pagesへのデプロイ方法
- [ライセンス情報](guides/ATTRIBUTIONS.md) - 使用しているライブラリとリソース

## 🛠️ 技術スタック

- **フロントエンド**: React 18 + TypeScript
- **ビルドツール**: Vite
- **ルーティング**: TanStack Router
- **UI**: Radix UI + Tailwind CSS + Material-UI
- **Eコマース**: Shopify Storefront API
- **メール送信**: EmailJS
- **API**: Google Places API

## 📁 プロジェクト構成

```
/
├── src/
│   ├── app/
│   │   ├── components/     # Reactコンポーネント
│   │   ├── contexts/       # Contextプロバイダー（カートなど）
│   │   ├── utils/          # ユーティリティ関数
│   │   ├── App.tsx
│   │   └── router.tsx
│   ├── utils/
│   │   └── shopify.ts      # Shopify API統合
│   └── styles/             # グローバルスタイル
├── guides/                 # セットアップガイド
├── scripts/
│   └── fetch-reviews.ts    # レビュー取得スクリプト
└── public/                 # 静的アセット
```

## 🔧 スクリプト

- `npm run dev` - 開発サーバーを起動
- `npm run build` - 本番用にビルド（レビューも自動取得）
- `npm run fetch-reviews` - Googleレビューを手動で取得

## 📄 ライセンス

このプロジェクトは、[shadcn/ui](https://ui.shadcn.com/) (MIT License) と [Unsplash](https://unsplash.com) の画像を使用しています。詳細は [guides/ATTRIBUTIONS.md](guides/ATTRIBUTIONS.md) を参照してください。
  