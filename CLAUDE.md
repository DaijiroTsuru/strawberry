# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

津留いちご園（福岡県筑後市）の公式ECサイト。いちご・お米の販売とイチゴ狩り情報を提供する。
React + TypeScript + Vite で構築し、Shopify Storefront APIで商品管理・決済を行い、GitHub Pagesにデプロイする静的サイト。

## コマンド

```bash
npm run dev          # 開発サーバー起動（Vite、ポート5173）
npm run build        # 本番ビルド（prebuild → fetch-reviews → vite build → prerender）
npm run fetch-reviews  # Googleレビューを手動取得
npm run prerender    # プリレンダリングのみ実行
```

ビルドの流れ:
1. `prebuild`: `tsx scripts/get-product-handles.ts` → Shopifyから商品ハンドルを取得し `product-routes.json` を生成
2. `fetch-reviews`: Google Places APIからレビューを取得し `src/data/reviews.json` に保存
3. `vite build`: 本番バンドル生成（`dist/`）
4. `prerender`: Puppeteerで各ルートの静的HTMLを生成、`sitemap.xml` と `404.html` も生成

テストフレームワークは導入されていない。リンターも設定されていない。

## アーキテクチャ

### ルーティング
TanStack Routerを使用（`src/app/router.tsx`）。全ルートはRootRoute配下で`Header`と`Footer`を共有する。
動的ルートは `/product/$handle` のみ（商品詳細ページ）。URLクエリパラメータ`variant`でバリアント選択を制御。
存在しないルートは `NotFoundPage` コンポーネントで処理（`defaultNotFoundComponent`）。

主要ルート:
- `/` — ホーム（HeroSection, ProductSection, AboutSection等を統合）
- `/strawberries`, `/rice`, `/strawberry-picking` — 商品・体験ページ
- `/product/$handle` — 商品詳細（動的ルート）
- `/login` — Shopify OAuth ログイン開始
- `/auth/callback` — OAuth コールバック処理
- `/mypage` — マイページ（`?tab=orders|profile|addresses`）
- `/faq`, `/contact` — 情報ページ
- `/privacy-policy`, `/terms-of-service`, `/refund-policy`, `/shipping-policy` — 法的ページ

### 状態管理
- `src/app/contexts/CartContext.tsx`: カート状態管理。カートIDは`localStorage`に永続化。`addToCart`, `buyNow`（カート作成→チェックアウトリダイレクト）, `updateQuantity`, `removeItem`, `updateCartNote` を提供。
- `src/app/contexts/AuthContext.tsx`: 顧客認証状態管理。Shopify Customer Account API（OAuth 2.0 + PKCE）を使用。PKCEパラメータは`sessionStorage`、トークンは`localStorage`に保存。トークン期限5分前に自動リフレッシュ。

### Shopify統合
`src/utils/shopify.ts` にStorefront API（GraphQL、APIバージョン `2026-01`）の全操作を集約。
環境変数が未設定の場合はモックデータにフォールバック（開発時に便利）。
カート操作（作成・追加・更新・削除）、商品取得（ハンドル・ID・コレクション別）をサポート。

### マイページ・認証（Customer Account API）
- `src/utils/shopify-customer.ts`: OAuth 2.0 + PKCEフロー実装。PKCE生成、トークン交換・リフレッシュ、Customer Account API GraphQLクエリ（顧客情報・住所CRUD・注文履歴）。
- `src/app/components/pages/LoginPage.tsx`: ログインボタン → Shopify認可ページへリダイレクト
- `src/app/components/pages/AuthCallbackPage.tsx`: `code` と `state` を受け取りトークン交換 → `/mypage` へリダイレクト
- `src/app/components/pages/MyPage.tsx`: 3タブ構成（注文履歴・プロフィール・住所管理）
- `src/app/components/mypage/`: タブ内コンポーネント（OrderHistory, ProfileEdit, AddressManagement）
- 環境変数: `VITE_SHOPIFY_CLIENT_ID`（クライアントID）、`VITE_SHOPIFY_SHOP_ID`（数値ショップID）

### UIコンポーネント
- `src/app/components/ui/`: shadcn/ui（Radix UIベース）の共通コンポーネント群
- `src/app/components/pages/`: ページ単位のコンポーネント
- `src/app/components/common/`: 共通UIコンポーネント（FaqSection, RelatedLinksなど）
- `src/app/components/product/`: 商品関連コンポーネント（StrawberryBEAFSection, PurchaseBoxなど）
- スタイリング: Tailwind CSS v4 + CSS変数によるテーミング（`src/styles/theme.css`）
- アニメーション: Motion (Framer Motion)

### SEO・アナリティクス
- `src/app/components/SEO.tsx`: 動的メタタグ管理、JSON-LD構造化データ（Organization, LocalBusiness, Product, Breadcrumb）
- `src/data/product-seo.json`: 商品ごとのSEOメタデータ
- `src/utils/analytics.ts`: GA4イベント送信、Google Ads コンバージョントラッキング
- `index.html`: GA4・Google Ads のベーストラッキングコード

### プリレンダリングと404処理
`scripts/prerender.ts` がPuppeteerで静的HTML生成。`product-routes.json`（ビルド時自動生成）から動的ルートも含めてプリレンダリング。
ビルド時に`index.html`を`404.html`にコピーし、GitHub Pagesで存在しないURLにアクセスした場合もReactアプリが起動してNotFoundPageを表示。

### 旧URLリダイレクト
`public/sp/` 配下に旧サイトURL用のリダイレクトHTMLを配置。meta refreshとJavaScriptで新URLにリダイレクト。

### お問い合わせ
EmailJS + reCAPTCHA v3 + react-hook-form で実装（`ContactForm.tsx`）。reCAPTCHAバッジはCSS非表示（代替テキスト表示）。

## 環境変数

`.env.example` を参照。`VITE_` プレフィックスの変数はフロントエンドに公開される。
主要な変数: Shopify（ドメイン・トークン・クライアントID・ショップID）、EmailJS、reCAPTCHA、Google Places API。

## パスエイリアス

`@/` → `./src/`（vite.config.ts と tsconfig.json で設定済み）

## デプロイ

masterブランチへのpushで GitHub Actions（`.github/workflows/deploy.yml`）が自動デプロイ。
Node.js 20、`npm ci` → `npm run build` → GitHub Pages。
環境変数はGitHub Secretsから注入。

## 定数データ

- `src/app/constants/farmInfo.ts`: 農園情報（住所・連絡先・商品データ・いちご狩り料金など）
- `src/app/constants/beafImages.ts`: BEAFセクション用画像URL
- `src/app/constants/faqData.ts`: よくある質問データ
