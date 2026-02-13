# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

津留いちご園（福岡県筑後市）の公式ECサイト。いちご・お米の販売とイチゴ狩り情報を提供する。
React + TypeScript + Vite で構築し、Shopify Storefront APIで商品管理・決済を行い、GitHub Pagesにデプロイする静的サイト。

## コマンド

```bash
npm run dev          # 開発サーバー起動（Vite）
npm run build        # 本番ビルド（prebuild → fetch-reviews → vite build → prerender）
npm run fetch-reviews  # Googleレビューを手動取得
npm run prerender    # プリレンダリングのみ実行
```

ビルドの流れ:
1. `prebuild`: `tsx scripts/get-product-handles.ts` → Shopifyから商品ハンドルを取得し `product-routes.json` を生成
2. `fetch-reviews`: Google Places APIからレビューを取得し `src/data/reviews.json` に保存
3. `vite build`: 本番バンドル生成（`dist/`）
4. `prerender`: Puppeteerで各ルートの静的HTMLを生成（GitHub Pages用SPA対応）

テストフレームワークは導入されていない。リンターも設定されていない。

## アーキテクチャ

### ルーティング
TanStack Routerを使用（`src/app/router.tsx`）。全ルートはRootRoute配下で`Header`と`Footer`を共有する。
動的ルートは `/product/$handle` のみ（商品詳細ページ）。URLクエリパラメータ`variant`でバリアント選択を制御。

### 状態管理
- React Context API（`src/app/contexts/CartContext.tsx`）でカート状態を管理。カートIDは`localStorage`に永続化。
- `src/app/contexts/AuthContext.tsx` で顧客認証状態を管理。Shopify Customer Account API（OAuth 2.0 + PKCE）を使用。

### Shopify統合
`src/utils/shopify.ts` にStorefront API（GraphQL、APIバージョン `2026-01`）の全操作を集約。
環境変数が未設定の場合はモックデータにフォールバック。
カート操作（作成・追加・更新・削除）、商品取得（ハンドル・ID・コレクション別）をサポート。

### マイページ・認証
- `src/utils/shopify-customer.ts`: Shopify Customer Account API（OAuth 2.0 + PKCE）のユーティリティ。PKCE生成、トークン交換、顧客情報取得・更新、住所CRUD、注文履歴取得。
- `src/app/components/pages/LoginPage.tsx`: ログインページ（Shopifyへリダイレクト）
- `src/app/components/pages/AuthCallbackPage.tsx`: OAuth コールバック処理
- `src/app/components/pages/MyPage.tsx`: マイページ（注文履歴・プロフィール・住所管理の3タブ）
- `src/app/components/mypage/`: マイページ内タブコンポーネント（OrderHistory, ProfileEdit, AddressManagement）
- 環境変数: `VITE_SHOPIFY_CLIENT_ID`（Customer Account API クライアントID）

### UIコンポーネント
- `src/app/components/ui/`: shadcn/ui（Radix UIベース）の共通コンポーネント群
- `src/app/components/pages/`: ページ単位のコンポーネント
- `src/app/components/common/`: 共通UIコンポーネント
- `src/app/components/product/`: 商品関連コンポーネント（StrawberryBEAFSection, PurchaseBoxなど）
- スタイリング: Tailwind CSS v4 + CSS変数によるテーミング（`src/styles/theme.css`）
- アニメーション: Motion (Framer Motion)

### SEO・アナリティクス
- `src/app/components/SEO.tsx`: 動的メタタグ管理、JSON-LD構造化データ（Organization, LocalBusiness, Product, Breadcrumb）
- `src/data/product-seo.json`: 商品ごとのSEOメタデータ
- `src/utils/analytics.ts`: GA4イベント送信、Google Ads コンバージョントラッキング
- `index.html`: GA4・Google Ads のベーストラッキングコード

### プリレンダリング
`scripts/prerender.ts` がPuppeteerで静的HTML生成。`product-routes.json`（ビルド時自動生成）から動的ルートも含めてプリレンダリング。GitHub PagesのSPAルーティングは`404.html`リダイレクトで対応。

### お問い合わせ
EmailJS + reCAPTCHA v3 + react-hook-form で実装（`ContactPage.tsx`）。

## 環境変数

`.env.example` を参照。`VITE_` プレフィックスの変数はフロントエンドに公開される。
主要な変数: Shopify（ドメイン・トークン）、EmailJS、reCAPTCHA、Google Places API。

## パスエイリアス

`@/` → `./src/`（vite.config.ts と tsconfig.json で設定済み）

## デプロイ

masterブランチへのpushで GitHub Actions（`.github/workflows/deploy.yml`）が自動デプロイ。
Node.js 20、`npm ci` → `npm run build` → GitHub Pages。
環境変数はGitHub Secretsから注入。

## 定数データ

`src/app/constants/farmInfo.ts`: 農園情報（住所・連絡先・商品データ・いちご狩り料金など）の集約ファイル。商品情報の変更はここを起点に確認する。
