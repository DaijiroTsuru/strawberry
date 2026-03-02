# Shopifyディスカウント表示 設計ドキュメント

日付: 2026-03-03

## 目的

Shopifyの自動ディスカウント（ステータス有効）を価格表示のある全箇所に反映する。
元値取消線 + 割引後価格 + 割引率バッジのUIで表示する。

## 技術的制約

Shopify Storefront APIにおけるディスカウント情報の取得方法は表示場所によって異なる。

| 表示場所 | 元値取消線 + 割引価格 | ディスカウント名 |
|---|---|---|
| 商品ページ / 一覧 | `compareAtPrice` で可能 | 不可（カート投入前のため） |
| カートドロワー | `compareAtPrice` で可能 | `discountAllocations` で可能 |

## データ層の変更

### 型定義の拡張

`ShopifyProduct` のバリアントに `compareAtPrice` を追加:

```typescript
compareAtPrice: {
  amount: string;
  currencyCode: string;
} | null;
```

`ShopifyCart` のカートラインに `discountAllocations` を追加、`cost` に `totalDiscountAmount` を追加:

```typescript
// cart.lines.edges[].node
discountAllocations: Array<{
  discountedAmount: { amount: string; currencyCode: string };
  title?: string;
}>;

// cart.cost
totalDiscountAmount: { amount: string; currencyCode: string };
```

### GraphQLクエリの変更

**商品クエリ（4箇所）** に `compareAtPrice { amount currencyCode }` を追加:
- `PRODUCTS_QUERY`
- `fetchProductById`
- `fetchProductByHandle`
- `fetchProductsByCollectionId`

**カートクエリ（6箇所）** に以下を追加:
- `discountAllocations { discountedAmount { amount currencyCode } ... on CartAutomaticDiscountAllocation { title } }`
- `cost.totalDiscountAmount { amount currencyCode }`

対象: `createCart`, `addToCart`, `updateCartLine`, `removeFromCart`, `getCart`, `updateCartNote`

### ヘルパー関数

```typescript
function calcDiscountPercent(compareAtPrice: string, price: string): number
function hasDiscount(variant: VariantNode): boolean
```

## UI表示

### 商品ページ・一覧（compareAtPriceがある場合）

```
[ 10%OFF ]
¥3,000  →  ¥2,700（税込）
```

- 元値（compareAtPrice）に取消線
- 割引後価格（price）を大きく赤字表示
- 割引率バッジ（strawberry系背景色）
- compareAtPriceがない場合は現状通り（破壊的変更なし）

対象コンポーネント:
- `ProductByHandlePage.tsx`
- `StrawberriesPage.tsx`
- `RicePage.tsx`（該当パターンがあれば）
- `PurchaseBox.tsx`

### カートドロワー

ラインアイテム:
- compareAtPriceがあれば元値取消線 + 割引後価格
- discountAllocationsがあればディスカウント名を表示（例: 「春のセール適用」）

合計欄:
- totalDiscountAmount > 0 なら「割引合計: -¥XXX」を表示
- 割引適用後の合計金額を表示

## 影響範囲

- `src/utils/shopify.ts` — 型定義、GraphQLクエリ、ヘルパー関数
- `src/app/components/pages/ProductByHandlePage.tsx` — 商品詳細の価格表示
- `src/app/components/pages/StrawberriesPage.tsx` — いちご一覧の価格表示
- `src/app/components/product/PurchaseBox.tsx` — 下部CTA価格表示
- `src/app/components/CartDrawer.tsx` — カートドロワーの価格・割引表示
- `src/app/contexts/CartContext.tsx` — カート型定義の更新（必要に応じて）

## 参考

- [Shopify Storefront API - ProductVariant](https://shopify.dev/docs/api/storefront/2024-07/objects/ProductVariant)
- [Shopify Storefront API - AutomaticDiscountApplication](https://shopify.dev/docs/api/storefront/latest/objects/automaticdiscountapplication)
- [Cart discountAllocations changelog](https://shopify.dev/changelog/new-cart-discountallocations-field-and-change-in-cartline-discountallocations)
