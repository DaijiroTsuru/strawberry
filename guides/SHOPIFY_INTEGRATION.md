# Shopify統合のセットアップ

このプロジェクトは、Shopify Storefront API 2026-01を使用しています。

## 初回セットアップ

1. `.env.example`を`.env`にコピー
   ```bash
   cp .env.example .env
   ```

2. `.env`ファイルを編集して、Shopifyの認証情報を設定
   ```env
   VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_access_token_here
   ```

3. 依存関係のインストール
   ```bash
   npm install
   ```

4. 開発サーバーの起動
   ```bash
   npm run dev
   ```

## Shopify設定

詳細なShopify設定手順は[SHOPIFY_SETUP.md](./SHOPIFY_SETUP.md)を参照してください。

### 主な手順
1. Headlessチャネルをインストール
2. ストアフロントを作成
3. Storefront APIアクセストークンを取得
4. 商品を登録し、Headlessチャネルに公開

## 利用可能な機能

### 商品表示
```typescript
import { fetchShopifyProducts } from '@/utils/shopify';

const products = await fetchShopifyProducts(10);
```

### カート機能
```typescript
import { 
  createCart, 
  addToCart, 
  updateCartLine, 
  removeFromCart,
  getCart 
} from '@/utils/shopify';

// カート作成
const cart = await createCart();

// 商品追加
await addToCart(cart.id, variantId, quantity);

// カート情報取得
const cartData = await getCart(cart.id);
```

## TypeScript型定義

環境変数の型定義は`src/vite-env.d.ts`に記載されています。

## トラブルシューティング

### TypeScriptエラー "プロパティ 'env' は型 'ImportMeta' に存在しません"

VSCodeを再起動するか、TypeScriptサーバーを再起動してください：
1. Command Palette (Cmd+Shift+P / Ctrl+Shift+P)
2. "TypeScript: Restart TS Server"を選択

### 商品が表示されない

1. `.env`ファイルが正しく設定されているか確認
2. Shopify管理画面で商品がHeadlessチャネルに公開されているか確認
3. アクセストークンが有効か確認

### APIエラー

認証情報が設定されていない場合、モックデータが使用されます。本番データを使用するには、`.env`ファイルを正しく設定してください。
