# Shopifyディスカウント表示 実装計画

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Shopifyの自動ディスカウント情報（compareAtPrice + cart discountAllocations）を価格表示のある全箇所に反映する

**Architecture:** 商品レベルでは `compareAtPrice` フィールドを追加取得し元値取消線+割引率バッジを表示。カートレベルでは `discountAllocations` でディスカウント名と割引額を表示。既存の表示はcompareAtPriceがない場合にそのまま維持される。

**Tech Stack:** React, TypeScript, Shopify Storefront API (GraphQL, 2026-01), Tailwind CSS

---

## Task 1: 型定義の拡張

**Files:**
- Modify: `src/utils/shopify.ts:15-57` (ShopifyProduct型)
- Modify: `src/utils/shopify.ts:59-100` (ShopifyCart型)

**Step 1: ShopifyProduct型にcompareAtPriceを追加**

`src/utils/shopify.ts` の `ShopifyProduct` インターフェースのvariants定義を変更:

```typescript
variants: {
  edges: Array<{
    node: {
      id: string;
      title: string;
      priceV2: {
        amount: string;
        currencyCode: string;
      };
      compareAtPrice: {
        amount: string;
        currencyCode: string;
      } | null;
      availableForSale: boolean;
    };
  }>;
};
```

**Step 2: ShopifyCart型にdiscountAllocationsとtotalDiscountAmountを追加**

`ShopifyCart` インターフェースのlines定義にdiscountAllocationsを追加し、costにtotalDiscountAmountを追加:

```typescript
export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  note?: string | null;
  lines: {
    edges: Array<{
      node: {
        id: string;
        quantity: number;
        merchandise: {
          id: string;
          title: string;
          priceV2: {
            amount: string;
            currencyCode: string;
          };
          compareAtPrice: {
            amount: string;
            currencyCode: string;
          } | null;
          product: {
            title: string;
            images?: {
              edges: Array<{
                node: {
                  url: string;
                  altText: string | null;
                };
              }>;
            };
          };
        };
        discountAllocations: Array<{
          discountedAmount: {
            amount: string;
            currencyCode: string;
          };
          title?: string;
        }>;
      };
    }>;
  };
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
    subtotalAmount: {
      amount: string;
      currencyCode: string;
    };
    totalDiscountAmount: {
      amount: string;
      currencyCode: string;
    };
  };
}
```

**Step 3: ヘルパー関数を追加**

`src/utils/shopify.ts` の `formatPrice` 関数の後に追加:

```typescript
/** compareAtPriceとpriceから割引率を計算（整数%） */
export function calcDiscountPercent(compareAtPrice: string, price: string): number {
  const original = parseFloat(compareAtPrice);
  const current = parseFloat(price);
  if (original <= 0 || current >= original) return 0;
  return Math.round(((original - current) / original) * 100);
}

/** バリアントに有効な割引があるか判定 */
export function hasDiscount(variant: { priceV2: { amount: string }; compareAtPrice: { amount: string } | null }): boolean {
  if (!variant.compareAtPrice) return false;
  return parseFloat(variant.compareAtPrice.amount) > parseFloat(variant.priceV2.amount);
}
```

**Step 4: コミット**

```bash
git add src/utils/shopify.ts
git commit -m "feat: ShopifyProduct/Cart型にディスカウント関連フィールドとヘルパー関数を追加"
```

---

## Task 2: 商品GraphQLクエリにcompareAtPriceを追加

**Files:**
- Modify: `src/utils/shopify.ts:139-179` (PRODUCTS_QUERY)
- Modify: `src/utils/shopify.ts:199-235` (fetchProductById)
- Modify: `src/utils/shopify.ts:254-300` (fetchProductByHandle)
- Modify: `src/utils/shopify.ts:322-366` (fetchProductsByCollectionId)

**Step 1: 4つの商品クエリすべてのvariantsブロックにcompareAtPriceを追加**

各クエリの `variants` > `node` に以下を追加:

```graphql
compareAtPrice {
  amount
  currencyCode
}
```

対象箇所（4箇所すべて同じ変更パターン）:
- `PRODUCTS_QUERY` のvariants内
- `fetchProductById` のクエリ文字列のvariants内
- `fetchProductByHandle` のクエリ文字列のvariants内
- `fetchProductsByCollectionId` のクエリ文字列のvariants内

**Step 2: モックデータにcompareAtPriceを追加**

`getMockProducts()` の各バリアントに `compareAtPrice: null` を追加。

**Step 3: ビルド確認**

```bash
npm run build
```

Expected: ビルド成功（型エラーなし）

**Step 4: コミット**

```bash
git add src/utils/shopify.ts
git commit -m "feat: 商品GraphQLクエリにcompareAtPriceフィールドを追加"
```

---

## Task 3: カートGraphQLクエリにdiscountAllocationsを追加

**Files:**
- Modify: `src/utils/shopify.ts` — カート関連のミューテーション/クエリ6箇所

**Step 1: カートフラグメントの共通部分を特定して更新**

以下の6つのカート操作すべてのGraphQLクエリを更新:

1. `addToCart` — `merchandise` に `compareAtPrice { amount currencyCode }` 追加、`node` に `discountAllocations` 追加、`cost` に `totalDiscountAmount` 追加
2. `removeFromCart` — 同上
3. `getCart` — 同上
4. `updateCartNote` — 同上
5. `createCart` — `cost` と `discountAllocations` 追加（merchandiseが返されている場合）
6. `updateCartLine` — `cost` と `discountAllocations` 追加

各クエリの `lines > edges > node` に追加:
```graphql
discountAllocations {
  discountedAmount {
    amount
    currencyCode
  }
  ... on CartAutomaticDiscountAllocation {
    title
  }
}
```

各クエリの `merchandise` に追加:
```graphql
compareAtPrice {
  amount
  currencyCode
}
```

各クエリの `cost` に追加:
```graphql
totalDiscountAmount {
  amount
  currencyCode
}
```

**Step 2: ビルド確認**

```bash
npm run build
```

Expected: ビルド成功

**Step 3: コミット**

```bash
git add src/utils/shopify.ts
git commit -m "feat: カートGraphQLクエリにdiscountAllocationsとtotalDiscountAmountを追加"
```

---

## Task 4: 商品詳細ページの価格表示を更新

**Files:**
- Modify: `src/app/components/pages/ProductByHandlePage.tsx:273-294`

**Step 1: 価格表示部分を割引対応に変更**

`selectedVariant` の価格表示を以下のパターンに変更:

```tsx
import { formatPrice, hasDiscount, calcDiscountPercent } from '@/utils/shopify';

{/* 価格表示 */}
<div className="flex items-baseline gap-3 mb-4">
  {selectedVariant && hasDiscount(selectedVariant) && (
    <span
      className="inline-block px-3 py-1 text-sm font-bold rounded-full text-white mb-2"
      style={{ backgroundColor: 'var(--color-strawberry-500)' }}
    >
      {calcDiscountPercent(selectedVariant.compareAtPrice!.amount, selectedVariant.priceV2.amount)}%OFF
    </span>
  )}
</div>
<div className="flex items-baseline gap-3 mb-4">
  {selectedVariant && hasDiscount(selectedVariant) && (
    <span
      className="text-2xl line-through"
      style={{ color: 'var(--color-neutral-400)' }}
    >
      {formatPrice(selectedVariant.compareAtPrice!.amount, selectedVariant.compareAtPrice!.currencyCode)}
    </span>
  )}
  <span
    className="text-5xl font-bold"
    style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-strawberry-600)' }}
  >
    {selectedVariant && formatPrice(selectedVariant.priceV2.amount, selectedVariant.priceV2.currencyCode)}
  </span>
  <span className="text-lg" style={{ color: 'var(--color-neutral-500)' }}>
    （税込）
  </span>
</div>
```

**Step 2: dev serverで目視確認**

```bash
npm run dev
```

ブラウザで商品詳細ページを開き、compareAtPriceがある商品で割引表示を確認。ない商品は従来通り表示されることを確認。

**Step 3: コミット**

```bash
git add src/app/components/pages/ProductByHandlePage.tsx
git commit -m "feat: 商品詳細ページにディスカウント表示を追加"
```

---

## Task 5: いちご一覧ページの価格表示を更新

**Files:**
- Modify: `src/app/components/pages/StrawberriesPage.tsx:363-392`

**Step 1: importにヘルパー関数を追加**

```typescript
import { fetchProductsByCollectionId, ShopifyProduct, formatPrice, hasDiscount, calcDiscountPercent } from '@/utils/shopify';
```

**Step 2: 価格表示部分を割引対応に変更**

StrawberriesPageの商品カード価格表示部分（L366-374付近）を更新。Task 4と同じパターンだが、レイアウトが`flex items-baseline justify-between`なので調整:

```tsx
<div className="flex items-baseline justify-between">
  <span className="text-sm font-medium" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-600)' }}>
    価格
    {hasDiscount(variant) && (
      <span
        className="ml-2 inline-block px-2 py-0.5 text-xs font-bold rounded-full text-white"
        style={{ backgroundColor: 'var(--color-strawberry-500)' }}
      >
        {calcDiscountPercent(variant.compareAtPrice!.amount, variant.priceV2.amount)}%OFF
      </span>
    )}
  </span>
  <div className="flex items-baseline gap-2">
    {hasDiscount(variant) && (
      <span className="text-lg line-through" style={{ color: 'var(--color-neutral-400)' }}>
        {formatPrice(variant.compareAtPrice!.amount, variant.compareAtPrice!.currencyCode)}
      </span>
    )}
    <span className="text-4xl font-bold" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-strawberry-600)' }}>
      {formatPrice(variant.priceV2.amount, variant.priceV2.currencyCode)}
    </span>
    <span className="text-sm" style={{ color: 'var(--color-neutral-500)' }}>（税込）</span>
  </div>
</div>
```

**Step 3: コミット**

```bash
git add src/app/components/pages/StrawberriesPage.tsx
git commit -m "feat: いちご一覧ページにディスカウント表示を追加"
```

---

## Task 6: お米一覧ページの価格表示を更新

**Files:**
- Modify: `src/app/components/pages/RicePage.tsx:433-456`

**Step 1: importにヘルパー関数を追加**

```typescript
import { fetchProductsByCollectionId, ShopifyProduct, formatPrice, hasDiscount, calcDiscountPercent } from '@/utils/shopify';
```

**Step 2: 価格表示部分を割引対応に変更**

Task 5と同じパターン。ただしRicePageはharvest系の色を使っている点に注意:

```tsx
<div className="flex items-baseline justify-between">
  <span className="text-sm font-medium" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-600)' }}>
    価格
    {hasDiscount(variant) && (
      <span
        className="ml-2 inline-block px-2 py-0.5 text-xs font-bold rounded-full text-white"
        style={{ backgroundColor: 'var(--color-harvest-500)' }}
      >
        {calcDiscountPercent(variant.compareAtPrice!.amount, variant.priceV2.amount)}%OFF
      </span>
    )}
  </span>
  <div className="flex items-baseline gap-2">
    {hasDiscount(variant) && (
      <span className="text-lg line-through" style={{ color: 'var(--color-neutral-400)' }}>
        {formatPrice(variant.compareAtPrice!.amount, variant.compareAtPrice!.currencyCode)}
      </span>
    )}
    <span className="text-4xl font-bold" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-harvest-600)' }}>
      {formatPrice(variant.priceV2.amount, variant.priceV2.currencyCode)}
    </span>
    <span className="text-sm" style={{ color: 'var(--color-neutral-500)' }}>（税込）</span>
  </div>
</div>
```

**Step 3: コミット**

```bash
git add src/app/components/pages/RicePage.tsx
git commit -m "feat: お米一覧ページにディスカウント表示を追加"
```

---

## Task 7: PurchaseBoxの価格表示を更新

**Files:**
- Modify: `src/app/components/product/PurchaseBox.tsx:132-161`

**Step 1: importにヘルパー関数を追加**

```typescript
import { formatPrice, hasDiscount, calcDiscountPercent } from '@/utils/shopify';
```

**Step 2: 価格表示部分を割引対応に変更**

Task 4と同じパターン（PurchaseBoxはProductByHandlePageの下部CTAと同じ見た目）:

```tsx
{selectedVariant && hasDiscount(selectedVariant) && (
  <div className="mb-2">
    <span
      className="inline-block px-3 py-1 text-sm font-bold rounded-full text-white"
      style={{ backgroundColor: 'var(--color-strawberry-500)' }}
    >
      {calcDiscountPercent(selectedVariant.compareAtPrice!.amount, selectedVariant.priceV2.amount)}%OFF
    </span>
  </div>
)}
<div className="flex items-baseline gap-3 mb-4">
  {selectedVariant && hasDiscount(selectedVariant) && (
    <span
      className="text-xl line-through"
      style={{ color: 'var(--color-neutral-400)' }}
    >
      {formatPrice(selectedVariant.compareAtPrice!.amount, selectedVariant.compareAtPrice!.currencyCode)}
    </span>
  )}
  <span
    className="text-4xl lg:text-5xl font-bold"
    style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-strawberry-600)' }}
  >
    {selectedVariant && formatPrice(selectedVariant.priceV2.amount, selectedVariant.priceV2.currencyCode)}
  </span>
  <span className="text-lg" style={{ color: 'var(--color-neutral-500)' }}>
    （税込）
  </span>
</div>
```

**Step 3: コミット**

```bash
git add src/app/components/product/PurchaseBox.tsx
git commit -m "feat: PurchaseBoxにディスカウント表示を追加"
```

---

## Task 8: カートドロワーにディスカウント表示を追加

**Files:**
- Modify: `src/app/components/CartDrawer.tsx:110-165`

**Step 1: importにヘルパー関数を追加**

```typescript
import { formatPrice, hasDiscount, calcDiscountPercent } from '@/utils/shopify';
```

**Step 2: ラインアイテムの価格表示を更新（L123-132付近）**

各アイテムの価格部分にcompareAtPrice表示とdiscountAllocations表示を追加:

```tsx
<div className="flex flex-col items-end gap-1">
  {item.merchandise.compareAtPrice && parseFloat(item.merchandise.compareAtPrice.amount) > parseFloat(item.merchandise.priceV2.amount) && (
    <span className="text-sm line-through" style={{ color: 'var(--color-neutral-400)' }}>
      {formatPrice(item.merchandise.compareAtPrice.amount, item.merchandise.compareAtPrice.currencyCode)}
    </span>
  )}
  <span className="font-bold" style={{ color: 'var(--color-strawberry-600)' }}>
    {formatPrice(item.merchandise.priceV2.amount, item.merchandise.priceV2.currencyCode)}
  </span>
  {item.discountAllocations && item.discountAllocations.length > 0 && (
    <div className="flex flex-col gap-0.5">
      {item.discountAllocations.map((alloc, idx) => (
        <span key={idx} className="text-xs font-medium" style={{ color: 'var(--color-strawberry-500)' }}>
          {alloc.title ? `${alloc.title}適用` : `割引 -${formatPrice(alloc.discountedAmount.amount, alloc.discountedAmount.currencyCode)}`}
        </span>
      ))}
    </div>
  )}
</div>
```

**Step 3: カート合計欄にディスカウント合計を追加（L154-161付近）**

合計金額の上にディスカウント合計行を追加:

```tsx
{/* ディスカウント合計 */}
{cart.cost.totalDiscountAmount && parseFloat(cart.cost.totalDiscountAmount.amount) > 0 && (
  <div className="flex items-center justify-between text-sm">
    <span style={{ color: 'var(--color-strawberry-600)' }}>割引合計</span>
    <span className="font-bold" style={{ color: 'var(--color-strawberry-600)' }}>
      -{formatPrice(cart.cost.totalDiscountAmount.amount, cart.cost.totalDiscountAmount.currencyCode)}
    </span>
  </div>
)}
<div className="flex items-center justify-between text-lg">
  <span style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)' }}>合計</span>
  <span className="text-2xl font-bold" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-strawberry-600)' }}>
    {formatPrice(totalAmount.amount, totalAmount.currencyCode)}
  </span>
</div>
```

**Step 4: ビルド確認**

```bash
npm run build
```

Expected: ビルド成功

**Step 5: コミット**

```bash
git add src/app/components/CartDrawer.tsx
git commit -m "feat: カートドロワーにディスカウント名・割引合計を表示"
```

---

## Task 9: 最終確認

**Step 1: フルビルド**

```bash
npm run build
```

Expected: エラーなしでビルド完了

**Step 2: dev serverで全ページを目視確認**

```bash
npm run dev
```

確認項目:
- [ ] 商品詳細ページ: compareAtPriceあり → 元値取消線 + 割引率バッジ + 割引後価格
- [ ] 商品詳細ページ: compareAtPriceなし → 従来通りの価格表示
- [ ] いちご一覧ページ: 同上
- [ ] お米一覧ページ: 同上（harvest色）
- [ ] PurchaseBox: 同上
- [ ] カートドロワー: compareAtPrice表示 + ディスカウント名表示 + 割引合計表示
- [ ] カートドロワー: 割引なし商品 → 従来通り
