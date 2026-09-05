# 計測基盤の修正 実装計画

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** GA4の計測欠陥7項目を修正し、2026年12月のいちごシーズンをクリーンなデータで記録できる状態にする。

**Architecture:** `src/utils/analytics.ts`（単一ファイル・168行）を `src/utils/analytics/` ディレクトリに再構成する。純粋関数（パス正規化・GA4アイテム変換・問い合わせ分類）を独立ファイルに切り出してVitestで単体テストし、イベント送信の実発火はClaude in Chromeで検証する。イベント所有権は「カートを境界」とし、Shopifyが送信済みのイベントは自社側で一切送らない。

**Tech Stack:** React 18 / TypeScript / Vite 6 / TanStack Router / Vitest（本計画で新規導入）/ GA4 gtag.js

**Spec:** `docs/plans/2026-09-05-improvement-loop-design.md`

## Global Constraints

- **イベント所有権（設計書 §6.2）**: `begin_checkout` / `add_shipping_info` / `add_payment_info` / `purchase` は**Shopifyが所有する**。自社サイトから送信してはならない。追加すると全チェックアウトが二重計上される（Shopify側で実測 `begin_checkout` 339件・`purchase` 134件）。
- **GA4 プロパティ**: `properties/387758698`（測定ID `G-V0M4G7XVPQ`）
- **Google Ads**: `AW-17913747934`（既存のコンバージョン送信は壊さない）
- **パスエイリアス**: `@/` → `./src/`
- **モバイル優先**: セッションの81%・購入の85%がモバイル。動作確認はモバイルビューポートを基準とする。
- **既存の呼び出し元を壊さない**: `@/utils/analytics` からのimportは全ファイルで維持する（`ContactInfo` / `Footer` / `AccessSection` / `ContactForm` / `StrawberryPickingPage` / `ProductByHandlePage`）。
- コミットメッセージは日本語（リポジトリの既存慣例に合わせる）。

---

### Task 1: テスト基盤の導入（Vitest）

このリポジトリにはテストフレームワークが存在しない。以降の全タスクがテストサイクルを持つための土台を作る。

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json`（`typescript@^5` を追加し、`scripts` に `test` / `test:watch` / `typecheck` を追加）
- Test: `src/utils/__tests__/smoke.test.ts`

**Interfaces:**
- Consumes: なし
- Produces: `npm test` と `npm run typecheck`。以降の全タスクがこの2つを使う。

- [ ] **Step 1: Vitest をインストール**

```bash
npm install -D vitest typescript@^5
```

- [ ] **Step 2: `vitest.config.ts` を作成**

純粋関数のみを対象とするため `environment` は `node` とする。jsdomは導入しない（DOMを要するイベント発火の検証はClaude in Chromeが担当するため／設計書 §10.1 T1）。

```ts
import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
```

- [ ] **Step 3: `package.json` に scripts を追加**

`scripts` に以下2行を追加する（既存の行は変更しない）。

```json
"test": "vitest run",
"test:watch": "vitest",
"typecheck": "tsc --noEmit"
```

- [ ] **Step 4: 失敗するスモークテストを書く**

Create `src/utils/__tests__/smoke.test.ts`:

```ts
import { describe, expect, it } from 'vitest';

describe('test harness', () => {
  it('runs and can fail', () => {
    expect(1 + 1).toBe(3);
  });
});
```

- [ ] **Step 5: 失敗を確認する**

Run: `npm test`
Expected: FAIL — `expected 2 to be 3`

（テストランナーが実際にテストを実行し、失敗を検出できることの確認。ここで「テストが0件でPASS」になる場合は `include` のパス指定が誤っている。）

- [ ] **Step 6: テストを通す**

`src/utils/__tests__/smoke.test.ts` の `toBe(3)` を `toBe(2)` に変更する。

- [ ] **Step 7: 成功を確認する**

Run: `npm test`
Expected: PASS — 1 passed

- [ ] **Step 8: コミット**

```bash
git add package.json package-lock.json vitest.config.ts src/utils/__tests__/smoke.test.ts
git commit -m "テスト基盤としてVitestを導入

計測基盤の修正にあたり、純粋関数を単体テストできる土台を用意する。
DOMを要するイベント発火の検証はClaude in Chromeが担当するため、
environmentはnodeとしjsdomは導入しない。"
```

---

### Task 2: analyticsモジュールの再構成とイベント所有権の適用（修正項目1）

`src/utils/analytics.ts` を `src/utils/analytics/` ディレクトリに分割し、**Shopifyが所有するイベントを送る関数を削除**する。

削除対象は `trackBeginCheckout()` と `trackShopifyPurchase()`。どちらも現在どこからも呼ばれていないが、「未使用だから無害」ではなく「**呼び出してはならない関数**」である。残置すると将来の実装者が誤って接続する罠になる（設計書 §6.2）。

ディレクトリ内 `index.ts` を置くことで、既存の `from '@/utils/analytics'` というimportは全ファイルでそのまま動作する。

**Files:**
- Create: `src/utils/analytics/index.ts`
- Create: `src/utils/analytics/events.ts`
- Delete: `src/utils/analytics.ts`
- Test: `src/utils/analytics/__tests__/events.test.ts`

**Interfaces:**
- Consumes: なし
- Produces:
  - `sendGAEvent(eventName: string, eventParams?: Record<string, unknown>): void`
  - `isTrackingSuppressed(): boolean`
  - `trackContactFormSubmission(formData: { subject?: string; email?: string }): void`
  - `trackAddToCart(item: { productName: string; variantName?: string; price?: number }): void`
  - `trackExternalLinkClick(url: string, linkText?: string): void`
  - `trackPhoneClick(phoneNumber: string): void`
  - `trackEmailClick(email: string): void`
  - `trackStrawberryPickingConversion(url?: string): boolean`
  - `trackStrawberryPickingPhoneReservation(phoneNumber: string): void`

- [ ] **Step 1: 失敗するテストを書く**

プリレンダリング（Puppeteer）実行時にGA4へ偽のイベントが送られるのを防ぐ判定を、純粋関数として切り出してテストする。

Create `src/utils/analytics/__tests__/events.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { shouldSuppressTracking } from '@/utils/analytics/events';

describe('shouldSuppressTracking', () => {
  it('suppresses tracking for automated browsers (prerender)', () => {
    expect(shouldSuppressTracking({ webdriver: true })).toBe(true);
  });

  it('allows tracking for real visitors', () => {
    expect(shouldSuppressTracking({ webdriver: false })).toBe(false);
  });

  it('allows tracking when the flag is unavailable', () => {
    expect(shouldSuppressTracking(undefined)).toBe(false);
  });
});
```

- [ ] **Step 2: 失敗を確認する**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "@/utils/analytics/events"`

- [ ] **Step 3: `src/utils/analytics/events.ts` を作成する**

既存 `src/utils/analytics.ts` の内容を移植する。**`trackBeginCheckout` と `trackShopifyPurchase` は移植しない**（削除）。

```ts
/**
 * Google Analytics イベント送信ユーティリティ
 *
 * イベント所有権ポリシー（docs/plans/2026-09-05-improvement-loop-design.md §6.2）:
 * begin_checkout / add_shipping_info / add_payment_info / purchase は
 * Shopify の Google & YouTube チャネル連携が送信する。
 * これらを自社サイトから送信してはならない（二重計上になる）。
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

/**
 * 自動操作ブラウザ（プリレンダリングのPuppeteer等）からの送信を抑止する。
 * これがないと scripts/prerender.ts の実行が全ルートの page_view を偽造する。
 */
export function shouldSuppressTracking(
  nav: { webdriver?: boolean } | undefined
): boolean {
  return nav?.webdriver === true;
}

export function isTrackingSuppressed(): boolean {
  if (typeof navigator === 'undefined') return true;
  return shouldSuppressTracking(navigator);
}

/**
 * カスタムイベントを送信
 */
export function sendGAEvent(
  eventName: string,
  eventParams?: Record<string, unknown>
) {
  if (isTrackingSuppressed()) return;

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
    console.log('GA Event sent:', eventName, eventParams);
  } else {
    console.warn('Google Analytics is not loaded');
  }
}

/**
 * お問い合わせフォーム送信イベント
 */
export function trackContactFormSubmission(formData: {
  subject?: string;
  email?: string;
}) {
  sendGAEvent('contact_form_submit', {
    event_category: 'engagement',
    event_label: formData.subject || 'お問い合わせ',
    value: 1,
  });

  sendGAEvent('generate_lead', {
    currency: 'JPY',
    value: 0,
  });
}

/**
 * Shopifyカート追加イベント
 */
export function trackAddToCart(item: {
  productName: string;
  variantName?: string;
  price?: number;
}) {
  sendGAEvent('add_to_cart', {
    event_category: 'ecommerce',
    event_label: item.productName,
    value: item.price || 0,
    currency: 'JPY',
    items: [
      {
        item_name: item.productName,
        item_variant: item.variantName,
        price: item.price,
        quantity: 1,
      },
    ],
  });
}

/**
 * 外部リンククリックイベント
 */
export function trackExternalLinkClick(url: string, linkText?: string) {
  sendGAEvent('click', {
    event_category: 'external_link',
    event_label: linkText || url,
    value: url,
  });
}

/**
 * 電話番号クリックイベント
 */
export function trackPhoneClick(phoneNumber: string) {
  sendGAEvent('click', {
    event_category: 'contact',
    event_label: 'phone_click',
    value: phoneNumber,
  });
}

/**
 * メールクリックイベント
 */
export function trackEmailClick(email: string) {
  sendGAEvent('click', {
    event_category: 'contact',
    event_label: 'email_click',
    value: email,
  });
}

/**
 * Google広告コンバージョンイベント - いちご狩り予約・問い合わせ
 */
export function trackStrawberryPickingConversion(url?: string) {
  const callback = function () {
    if (typeof url !== 'undefined') {
      window.location.href = url;
    }
  };

  if (typeof window !== 'undefined' && window.gtag && !isTrackingSuppressed()) {
    window.gtag('event', 'conversion', {
      'send_to': 'AW-17913747934/_9PYCI30zO4bEN6z-N1C',
      'value': 2000.0,
      'currency': 'JPY',
      'transaction_id': '',
      'event_callback': callback
    });
    console.log('Google Ads Conversion tracked: Strawberry Picking');
  } else {
    console.warn('Google Ads tracking is not loaded');
    callback();
  }

  return false;
}

/**
 * いちご狩り電話予約トラッキング（電話リンククリック時）
 */
export function trackStrawberryPickingPhoneReservation(phoneNumber: string) {
  trackPhoneClick(phoneNumber);
  trackStrawberryPickingConversion();
}
```

- [ ] **Step 4: `src/utils/analytics/index.ts` を作成する**

```ts
export * from './events';
```

- [ ] **Step 5: 旧ファイルを削除する**

```bash
git rm src/utils/analytics.ts
```

- [ ] **Step 6: テストと型検査を通す**

Run: `npm test`
Expected: PASS — 4 passed（smoke 1件 + events 3件）

Run: `npm run typecheck`
Expected: エラーなし。既存の6ファイルからの `from '@/utils/analytics'` importが
ディレクトリの `index.ts` に解決されることの確認。

- [ ] **Step 7: 呼び出し元が壊れていないことを確認する**

Run: `npm run dev`
ブラウザで `http://localhost:5173/` を開き、コンソールにエラーが出ないことを確認する。
確認後 `Ctrl+C` で停止する。

- [ ] **Step 8: コミット**

```bash
git add src/utils/analytics vitest.config.ts
git commit -m "analyticsをディレクトリ構成に再編し、Shopify所有イベントの送信関数を削除

イベント所有権ポリシー（設計書§6.2）に基づき、Shopifyが送信する
begin_checkout / purchase の送信関数を削除する。未使用だが、残置すると
将来誤って接続され全チェックアウトが二重計上される危険がある。

あわせてプリレンダリング（Puppeteer）からの送信を抑止する判定を追加。
scripts/prerender.ts が全ルートの page_view を偽造するのを防ぐ。"
```

---

### Task 3: URLパス正規化とpage_viewの自前送信（修正項目2）

`/strawberries`（1,095PV）と `/strawberries/`（1,295PV）が別ページとして二重計上されている。原因は、GitHub Pagesが末尾スラッシュ付きURLを配信する一方、TanStack Routerの内部遷移がスラッシュなしのパスを積むため。

GA4の拡張計測（履歴イベントによるページ変更）に任せている限りこの不整合は解消できないため、**gtagの自動page_viewを止め、正規化済みパスを自前で送信する**。

**Files:**
- Create: `src/utils/analytics/paths.ts`
- Modify: `src/utils/analytics/events.ts`（`trackPageView` を追加）
- Modify: `index.html`（`send_page_view: false`）
- Modify: `src/app/App.tsx`
- Test: `src/utils/analytics/__tests__/paths.test.ts`

**Interfaces:**
- Consumes: Task 2 の `sendGAEvent`
- Produces:
  - `normalizePath(pathname: string): string`
  - `trackPageView(pathname: string, title?: string): void`

- [ ] **Step 1: 失敗するテストを書く**

Create `src/utils/analytics/__tests__/paths.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { normalizePath } from '@/utils/analytics/paths';

describe('normalizePath', () => {
  it('keeps the root path as a single slash', () => {
    expect(normalizePath('/')).toBe('/');
  });

  it('strips a trailing slash so GitHub Pages and the router agree', () => {
    expect(normalizePath('/strawberries/')).toBe('/strawberries');
  });

  it('leaves an already-normalized path untouched', () => {
    expect(normalizePath('/strawberries')).toBe('/strawberries');
  });

  it('maps /index.html to the root path', () => {
    expect(normalizePath('/index.html')).toBe('/');
  });

  it('preserves multi-byte product handles', () => {
    expect(normalizePath('/product/いちご/')).toBe('/product/いちご');
  });

  it('collapses duplicate slashes', () => {
    expect(normalizePath('//rice//')).toBe('/rice');
  });

  it('falls back to the root path for empty input', () => {
    expect(normalizePath('')).toBe('/');
  });
});
```

- [ ] **Step 2: 失敗を確認する**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "@/utils/analytics/paths"`

- [ ] **Step 3: `src/utils/analytics/paths.ts` を作成する**

```ts
/**
 * GA4に送るページパスを正規化する。
 *
 * GitHub Pages は /strawberries/ を配信し、TanStack Router は /strawberries を
 * 積むため、正規化しないと同一ページが2行に分裂して計上される。
 */
export function normalizePath(pathname: string): string {
  if (!pathname) return '/';

  let path = pathname.startsWith('/') ? pathname : `/${pathname}`;

  if (path.endsWith('/index.html')) {
    path = path.slice(0, -'index.html'.length);
  }

  path = path.replace(/\/{2,}/g, '/');

  if (path.length > 1) {
    path = path.replace(/\/+$/, '');
  }

  return path || '/';
}
```

- [ ] **Step 4: テストを通す**

Run: `npm test`
Expected: PASS — 11 passed（smoke 1 + events 3 + paths 7）

- [ ] **Step 5: `trackPageView` を `events.ts` に追加する**

`src/utils/analytics/events.ts` の末尾に追加する。ファイル先頭の import 行も追加すること。

```ts
import { normalizePath } from './paths';
```

```ts
/**
 * ページビューを送信する。
 * index.html で send_page_view: false としているため、初回表示・ルート遷移とも
 * このアプリ側から送信する。
 */
export function trackPageView(pathname: string, title?: string) {
  const path = normalizePath(pathname);
  sendGAEvent('page_view', {
    page_path: path,
    page_location: `${window.location.origin}${path}${window.location.search}`,
    page_title: title ?? document.title,
  });
}
```

- [ ] **Step 6: `index.html` の自動page_viewを停止する**

`gtag('config', 'G-V0M4G7XVPQ');` の行を以下に置き換える。**`AW-17913747934` の config 行は変更しない**（広告コンバージョンを壊さないため）。

```html
gtag('config', 'G-V0M4G7XVPQ', { send_page_view: false });
```

- [ ] **Step 7: `src/app/App.tsx` からpage_viewを送信する**

既存の `router.subscribe('onResolved')` に相乗りさせる。初回表示分も送る必要があるため、`useEffect` の冒頭で1回送信する。

```tsx
import { useEffect } from 'react';
import { RouterProvider } from '@tanstack/react-router';
import { CartProvider } from '@/app/contexts/CartContext';
import { AuthProvider } from '@/app/contexts/AuthContext';
import { router } from '@/app/router';
import { trackPageView } from '@/utils/analytics';

export default function App() {
  useEffect(() => {
    trackPageView(window.location.pathname);

    const unsubscribe = router.subscribe('onResolved', () => {
      window.scrollTo(0, 0);
      trackPageView(window.location.pathname);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  );
}
```

- [ ] **Step 8: 実ブラウザで発火を確認する**

Run: `npm run dev`

ブラウザで `http://localhost:5173/` を開き、開発者ツールのコンソールで以下を確認する。

1. 初回表示で `GA Event sent: page_view {page_path: '/', ...}` が **1回だけ** 出ること
2. ヘッダーから「いちご」ページへ遷移し、`page_path: '/strawberries'`（**末尾スラッシュなし**）が出ること
3. `http://localhost:5173/strawberries/` を直接開いても `page_path: '/strawberries'` になること
4. 同一遷移で `page_view` が2回出ていないこと（2回出る場合は `send_page_view: false` が効いていない）

- [ ] **Step 9: GA4管理画面で拡張計測を無効化する（手動）**

GA4 管理 → データストリーム → 該当ストリーム → 拡張計測機能の歯車 →
**「ブラウザの履歴イベントに基づくページの変更」のチェックを外す**。

これを外さないと、自前送信と拡張計測の両方が発火し `page_view` が二重計上される。

- [ ] **Step 10: コミット**

```bash
git add index.html src/app/App.tsx src/utils/analytics
git commit -m "GA4のページパスを正規化し、page_viewを自前送信に切り替え

/strawberries と /strawberries/ が別ページとして二重計上されていた
（実測 1,095PV と 1,295PV）。GitHub Pagesが末尾スラッシュ付きURLを配信し、
TanStack Routerがスラッシュなしのパスを積むため。

gtagの自動page_viewを停止し、正規化済みパスをApp.tsxから送信する。
GA4管理画面側で拡張計測の履歴イベントも無効化すること。"
```

---

### Task 4: view_item / view_item_list の追加（修正項目3）

現在 `view_item` は1件も送信されていない。そのため「商品ページを見た人のうち何人がカートに入れたか」が測定不能で、`/strawberries` が `/rice` よりCVRが7倍低い（0.37% vs 2.6%）原因を切り分けられない。

**Files:**
- Create: `src/utils/analytics/items.ts`
- Modify: `src/utils/analytics/events.ts`
- Modify: `src/app/components/pages/ProductByHandlePage.tsx`
- Modify: `src/app/components/pages/StrawberriesPage.tsx`
- Modify: `src/app/components/pages/RicePage.tsx`
- Test: `src/utils/analytics/__tests__/items.test.ts`

**Interfaces:**
- Consumes: Task 2 の `sendGAEvent`
- Produces:
  - `type GaItem = { item_id: string; item_name: string; item_variant?: string; item_category?: string; price?: number; quantity: number }`
  - `toGaItem(product, variant, options?): GaItem`
  - `trackViewItem(item: GaItem): void`
  - `trackViewItemList(items: GaItem[], listName: string): void`

- [ ] **Step 1: 失敗するテストを書く**

Create `src/utils/analytics/__tests__/items.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { toGaItem } from '@/utils/analytics/items';

const product = { title: 'いちご かおり野 特秀', handle: 'ichigo-kaorino' };

describe('toGaItem', () => {
  it('builds an item from a product and its variant', () => {
    const item = toGaItem(product, {
      id: 'gid://shopify/ProductVariant/123',
      title: '化粧箱入 500g',
      priceV2: { amount: '3800.0' },
    });

    expect(item).toEqual({
      item_id: 'gid://shopify/ProductVariant/123',
      item_name: 'いちご かおり野 特秀',
      item_variant: '化粧箱入 500g',
      price: 3800,
      quantity: 1,
    });
  });

  it('falls back to the product handle when no variant exists', () => {
    const item = toGaItem(product, undefined);
    expect(item.item_id).toBe('ichigo-kaorino');
    expect(item.item_variant).toBeUndefined();
    expect(item.price).toBeUndefined();
  });

  it('attaches a category and quantity when given', () => {
    const item = toGaItem(product, undefined, { category: 'strawberry', quantity: 3 });
    expect(item.item_category).toBe('strawberry');
    expect(item.quantity).toBe(3);
  });

  it('omits price when the amount is not a number', () => {
    const item = toGaItem(product, {
      id: 'v1',
      priceV2: { amount: 'not-a-number' },
    });
    expect(item.price).toBeUndefined();
  });
});

describe('categoryOf', () => {
  const withCollection = (id: string) => ({
    collections: { edges: [{ node: { id: `gid://shopify/Collection/${id}` } }] },
  });

  it('detects the strawberry collection', () => {
    expect(categoryOf(withCollection('486373589215'))).toBe('strawberry');
  });

  it('detects the rice collection', () => {
    expect(categoryOf(withCollection('486421135583'))).toBe('rice');
  });

  it('returns undefined when the product has no known collection', () => {
    expect(categoryOf(withCollection('999'))).toBeUndefined();
    expect(categoryOf({})).toBeUndefined();
  });
});
```

`import` 行も `import { toGaItem, categoryOf } from '@/utils/analytics/items';` にすること。

- [ ] **Step 2: 失敗を確認する**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "@/utils/analytics/items"`

- [ ] **Step 3: `src/utils/analytics/items.ts` を作成する**

```ts
export type GaItem = {
  item_id: string;
  item_name: string;
  item_variant?: string;
  item_category?: string;
  price?: number;
  quantity: number;
};

type ProductLike = { title: string; handle?: string };
type VariantLike = { id: string; title?: string; priceV2?: { amount?: string } };

/**
 * Shopifyの商品・バリアントをGA4のitem形式へ変換する。
 * item_id はバリアントIDを優先する（同一商品の重量違いを区別するため）。
 */
export function toGaItem(
  product: ProductLike,
  variant: VariantLike | undefined,
  options: { category?: string; quantity?: number } = {}
): GaItem {
  const amount = variant?.priceV2?.amount;
  const price = amount === undefined ? NaN : Number.parseFloat(amount);

  const item: GaItem = {
    item_id: variant?.id ?? product.handle ?? product.title,
    item_name: product.title,
    quantity: options.quantity ?? 1,
  };

  if (variant?.title) item.item_variant = variant.title;
  if (options.category) item.item_category = options.category;
  if (Number.isFinite(price)) item.price = price;

  return item;
}

/** ShopifyのコレクションID。StrawberriesPage.tsx / RicePage.tsx と同じ値。 */
export const STRAWBERRY_COLLECTION_ID = '486373589215';
export const RICE_COLLECTION_ID = '486421135583';

type WithCollections = {
  collections?: { edges: Array<{ node: { id: string } }> };
};

/**
 * 商品のカテゴリを collections から導出する。
 *
 * /product/$handle は動的ルートでいちご・お米の双方を配信するため、
 * ページ側でカテゴリを固定してはならない（お米をstrawberryと誤ラベルする）。
 * 一覧ページは自分のコレクションを指定して取得しているためカテゴリを知っており、
 * 呼び出し側で明示指定する。一覧の取得クエリは collections を返さないため、
 * この関数は商品詳細ページ専用である。
 */
export function categoryOf(product: WithCollections): string | undefined {
  const ids = product.collections?.edges.map((e) => e.node.id) ?? [];
  if (ids.some((id) => id.includes(STRAWBERRY_COLLECTION_ID))) return 'strawberry';
  if (ids.some((id) => id.includes(RICE_COLLECTION_ID))) return 'rice';
  return undefined;
}
```

- [ ] **Step 4: テストを通す**

Run: `npm test`
Expected: PASS — 18 passed

- [ ] **Step 5: 送信関数を `events.ts` に追加する**

ファイル先頭に import を追加する。

```ts
import type { GaItem } from './items';
```

末尾に追加する。

```ts
/**
 * 商品詳細の表示。view_item がないと商品ページ→カートの転換率が測れない。
 */
export function trackViewItem(item: GaItem) {
  sendGAEvent('view_item', {
    currency: 'JPY',
    value: item.price ?? 0,
    items: [item],
  });
}

/**
 * 商品一覧の表示。
 */
export function trackViewItemList(items: GaItem[], listName: string) {
  sendGAEvent('view_item_list', {
    item_list_name: listName,
    items,
  });
}
```

- [ ] **Step 6: `ProductByHandlePage.tsx` に `view_item` を追加する**

import 行を変更する（既存は `import { trackAddToCart } from '@/utils/analytics';`）。

```ts
import { trackAddToCart, trackViewItem } from '@/utils/analytics';
import { toGaItem, categoryOf } from '@/utils/analytics/items';
```

既存の割引取得 `useEffect`（`fetchVariantDiscounts` を呼んでいるもの、77行目付近）の**直後**に、以下の `useEffect` を追加する。バリアント切り替えでも再送するため依存配列に `selectedVariantIndex` を含める。

**カテゴリは `categoryOf(product)` で導出する。** `/product/$handle` は動的ルートで
お米商品も配信するため、`'strawberry'` を固定すると誤ラベルになる。

```tsx
useEffect(() => {
  if (!product) return;
  const variant = product.variants.edges[selectedVariantIndex]?.node;
  trackViewItem(toGaItem(product, variant, { category: categoryOf(product) }));
}, [product, selectedVariantIndex]);
```

- [ ] **Step 7: `StrawberriesPage.tsx` に `view_item_list` を追加する**

import に追加する。

```ts
import { trackViewItemList } from '@/utils/analytics';
import { toGaItem } from '@/utils/analytics/items';
```

既存の割引取得 `useEffect`（36-41行目付近）の**直後**に追加する。

```tsx
useEffect(() => {
  if (products.length === 0) return;
  trackViewItemList(
    products.map((p) => toGaItem(p, p.variants.edges[0]?.node, { category: 'strawberry' })),
    'strawberries'
  );
}, [products]);
```

- [ ] **Step 8: `RicePage.tsx` に `view_item_list` を追加する**

同じ import を追加し、商品読み込み後の `useEffect` の直後に追加する。

```tsx
useEffect(() => {
  if (products.length === 0) return;
  trackViewItemList(
    products.map((p) => toGaItem(p, p.variants.edges[0]?.node, { category: 'rice' })),
    'rice'
  );
}, [products]);
```

- [ ] **Step 9: 実ブラウザで発火を確認する**

Run: `npm run dev`

1. `/strawberries` を開き、コンソールに `GA Event sent: view_item_list` が出て `items` に商品が並ぶこと
2. `/rice` を開き、`item_list_name: 'rice'` が出ること
3. 商品詳細ページを開き、`GA Event sent: view_item` が出ること
4. 商品詳細でバリアントを切り替え、`view_item` が再送され `item_variant` が変わること

- [ ] **Step 10: コミット**

```bash
git add src/utils/analytics src/app/components/pages
git commit -m "view_item / view_item_list を追加

いずれも送信実績が0件で、商品ページ→カートの転換率が測定不能だった。
/strawberries のCVRが /rice の7分の1（0.37% vs 2.6%）である原因を
切り分けるために必要。"
```

---

### Task 5: add_to_cart の計測漏れ3箇所を解消（修正項目5）

`addToCart` は4箇所から呼ばれているが、`trackAddToCart` は1箇所（`ProductByHandlePage`）でしか呼ばれていない。これが `begin_checkout`(339) > `add_to_cart`(304) という逆転の原因。

漏れているのは一覧ページ（実測でランディング `/rice` から14件・`/strawberries` から6件の購入が発生している主要経路）と、マイページからの再注文（**リピート購入導線そのもの**でLTV分析の中核）。

一覧ページの `handleAddToCart(variantId: string)` は **`variantId` しか受け取らない**ため、
`products` から該当バリアントを引く純粋関数を用意する。あわせて `trackAddToCart` の引数を
`GaItem` に統一し、`view_item` / `view_cart` と同じ形にそろえる。

**Files:**
- Modify: `src/utils/analytics/items.ts`（`findVariant` を追加）
- Modify: `src/utils/analytics/events.ts`（`trackAddToCart` の引数を `GaItem` に変更）
- Modify: `src/app/components/pages/ProductByHandlePage.tsx:77-84`
- Modify: `src/app/components/pages/StrawberriesPage.tsx:43-51`
- Modify: `src/app/components/pages/RicePage.tsx:42-50`
- Modify: `src/app/components/mypage/OrderHistory.tsx:49-68`
- Test: `src/utils/analytics/__tests__/items.test.ts`（追記）

**Interfaces:**
- Consumes: Task 4 の `toGaItem` / `GaItem`
- Produces:
  - `findVariant(products, variantId)` → `{ product, variant } | undefined`
  - `trackAddToCart(item: GaItem): void`（**引数の形が変わる破壊的変更**）

- [ ] **Step 1: 失敗するテストを追記する**

`src/utils/analytics/__tests__/items.test.ts` の末尾に追加する。

```ts
import { findVariant } from '@/utils/analytics/items';

describe('findVariant', () => {
  const products = [
    { title: 'いちご', variants: { edges: [{ node: { id: 'v1', title: '500g' } }] } },
    { title: 'お米', variants: { edges: [{ node: { id: 'v2', title: '5kg' } }] } },
  ];

  it('finds the product that owns a variant id', () => {
    const found = findVariant(products, 'v2');
    expect(found?.product.title).toBe('お米');
    expect(found?.variant.title).toBe('5kg');
  });

  it('returns undefined for an unknown variant id', () => {
    expect(findVariant(products, 'nope')).toBeUndefined();
  });
});
```

- [ ] **Step 2: 失敗を確認する**

Run: `npm test`
Expected: FAIL — `findVariant is not a function`

- [ ] **Step 3: `findVariant` を `items.ts` に追加する**

```ts
type WithVariants = {
  title: string;
  handle?: string;
  variants: { edges: Array<{ node: VariantLike }> };
};

/**
 * 一覧ページの handleAddToCart は variantId しか受け取らないため、
 * 商品側から逆引きする。
 */
export function findVariant<P extends WithVariants>(
  products: P[],
  variantId: string
): { product: P; variant: VariantLike } | undefined {
  for (const product of products) {
    const variant = product.variants.edges.find((e) => e.node.id === variantId)?.node;
    if (variant) return { product, variant };
  }
  return undefined;
}
```

- [ ] **Step 4: テストを通す**

Run: `npm test`
Expected: PASS — 20 passed

- [ ] **Step 5: `trackAddToCart` の引数を `GaItem` に変更する**

`events.ts` の既存 `trackAddToCart` を置き換える。

```ts
export function trackAddToCart(item: GaItem) {
  sendGAEvent('add_to_cart', {
    currency: 'JPY',
    value: (item.price ?? 0) * item.quantity,
    items: [item],
  });
}
```

- [ ] **Step 6: `ProductByHandlePage.tsx` の既存呼び出しを新しい形に直す**

77-84行目の `trackAddToCart({ productName: ..., variantName: ..., price: ... })` を置き換える。

```tsx
try {
  trackAddToCart(toGaItem(product, selectedVariant, { category: categoryOf(product) }));
} catch (gaError) {
  console.warn('GA tracking error (add_to_cart):', gaError);
}
```

`toGaItem` と `categoryOf` は Task 4 で既に import 済み。
**ここで `'strawberry'` を固定してはならない** — `/product/$handle` はお米商品も配信するため、
`view_item` と `add_to_cart` が同一商品で異なるカテゴリを名乗ることになり、
設計書§4.1のファネルA/B分割が壊れる。

- [ ] **Step 7: `StrawberriesPage.tsx` の `handleAddToCart` を書き換える**

import に `trackAddToCart` と `findVariant` を追加する（`trackViewItemList` と `toGaItem` は Task 4 で追加済み）。

```ts
import { trackViewItemList, trackAddToCart } from '@/utils/analytics';
import { toGaItem, findVariant } from '@/utils/analytics/items';
```

43-51行目の `handleAddToCart` を置き換える。

```tsx
const handleAddToCart = async (variantId: string) => {
  try {
    const found = findVariant(products, variantId);
    if (found) {
      try {
        trackAddToCart(toGaItem(found.product, found.variant, { category: 'strawberry' }));
      } catch (gaError) {
        console.warn('GA tracking error (add_to_cart):', gaError);
      }
    }
    await addToCart(variantId, 1);
    // カートドロワーを開く
    openCart();
  } catch (error) {
    console.error('Failed to add to cart:', error);
  }
};
```

- [ ] **Step 8: `RicePage.tsx` の `handleAddToCart` を書き換える**

Step 7 と同じ構造で、`category` のみ `'rice'` にする。

```tsx
const handleAddToCart = async (variantId: string) => {
  try {
    const found = findVariant(products, variantId);
    if (found) {
      try {
        trackAddToCart(toGaItem(found.product, found.variant, { category: 'rice' }));
      } catch (gaError) {
        console.warn('GA tracking error (add_to_cart):', gaError);
      }
    }
    await addToCart(variantId, 1);
    // カートドロワーを開く
    openCart();
  } catch (error) {
    console.error('Failed to add to cart:', error);
  }
};
```

import も Step 7 と同様に追加する（`trackViewItemList` は Task 4 で追加済み）。

- [ ] **Step 9: `OrderHistory.tsx` の再注文に追加する**

注文明細の型は `title` / `quantity` / `variant: { id, title, price: { amount } }`
（`shopify-customer.ts:365-383`）。`toGaItem` は `priceV2` を期待するため、
ここでは `GaItem` を直接組み立てる。

まず import を追加する。

```ts
import { trackAddToCart } from '@/utils/analytics';
```

49-54行目の `.map()` を、明細ごと保持する形に変更する。

```tsx
const variantIds = order.lineItems.edges
  .filter((e) => e.node.variant?.id)
  .map((e) => ({
    variantId: e.node.variant!.id,
    quantity: e.node.quantity,
    line: e.node,
  }));
```

62-68行目のループ本体を変更する。**再注文なので数量は1固定にせず実際の数量を送る。**

```tsx
for (const { variantId, quantity, line } of variantIds) {
  try {
    try {
      trackAddToCart({
        item_id: variantId,
        item_name: line.title,
        item_variant: line.variant?.title,
        price: line.variant?.price?.amount
          ? parseFloat(line.variant.price.amount)
          : undefined,
        quantity,
      });
    } catch (gaError) {
      console.warn('GA tracking error (add_to_cart):', gaError);
    }
    await addToCart(variantId, quantity);
    addedCount++;
  } catch {
    // バリアントが存在しない場合はスキップ
  }
}
```

- [ ] **Step 10: 型検査とテストを通す**

Run: `npm run typecheck`
Expected: エラーなし（`trackAddToCart` の引数変更に伴う呼び出し元の型エラーが
残っていないこと）

Run: `npm test`
Expected: PASS — 20 passed

- [ ] **Step 11: 実ブラウザで発火を確認する**

Run: `npm run dev`

1. `/strawberries` で商品をカートに追加 → コンソールに `GA Event sent: add_to_cart` が出て
   `items[0].item_category` が `'strawberry'` であること
2. `/rice` で同様に確認し、`item_category` が `'rice'` であること
3. 商品詳細ページからの追加でも従来どおり `add_to_cart` が出ること（Step 6 の回帰確認）
4. `items[0].item_name` がカートに入った商品と一致していること

（マイページの再注文はログインが必要なため、ここでは確認しない。Task 10 のClaude in Chrome検証で扱う。）

- [ ] **Step 12: コミット**

```bash
git add src/app/components/pages src/app/components/mypage
git commit -m "add_to_cart の計測漏れ3箇所を解消

addToCart の呼び出し4箇所のうち、trackAddToCart は
ProductByHandlePage でしか呼ばれていなかった。これが
begin_checkout(339) > add_to_cart(304) という逆転の原因。

漏れていたのは一覧ページという主要な購入経路と、マイページからの
再注文（リピート購入導線）。後者はLTV分析の中核にあたる。"
```

---

### Task 6: view_cart / remove_from_cart の追加（修正項目3の残り）

カート内での離脱がどこで起きているかを観測できるようにする。

**Files:**
- Modify: `src/utils/analytics/events.ts`
- Modify: `src/app/components/CartDrawer.tsx`

**Interfaces:**
- Consumes: Task 2 の `sendGAEvent`、Task 4 の `GaItem`
- Produces:
  - `trackViewCart(items: GaItem[], value: number): void`
  - `trackRemoveFromCart(item: GaItem): void`

- [ ] **Step 1: 送信関数を `events.ts` に追加する**

```ts
/**
 * カートドロワーの表示。
 * begin_checkout は Shopify が所有するため、ここでは送信しない（設計書 §6.2）。
 */
export function trackViewCart(items: GaItem[], value: number) {
  sendGAEvent('view_cart', {
    currency: 'JPY',
    value,
    items,
  });
}

export function trackRemoveFromCart(item: GaItem) {
  sendGAEvent('remove_from_cart', {
    currency: 'JPY',
    value: (item.price ?? 0) * item.quantity,
    items: [item],
  });
}
```

- [ ] **Step 2: `CartDrawer.tsx` に `view_cart` を追加する**

import を追加する。

```ts
import { trackViewCart, trackRemoveFromCart } from '@/utils/analytics';
import type { GaItem } from '@/utils/analytics/items';
```

`CartDrawer` の props は `{ isOpen, onClose }`、`useEffect` は import 済み、
`cartItems` は `cart?.lines.edges || []` で要素は `{ node }` 形（12-38行目で確認済み）。

`const totalAmount = cart?.cost.totalAmount;`（39行目）の直後に追加する。

```tsx
useEffect(() => {
  if (!isOpen || !cart) return;
  const items: GaItem[] = cart.lines.edges.map(({ node }) => ({
    item_id: node.merchandise.id,
    item_name: node.merchandise.product.title,
    item_variant: node.merchandise.title,
    price: parseFloat(node.merchandise.priceV2.amount),
    quantity: node.quantity,
  }));
  trackViewCart(items, parseFloat(cart.cost.totalAmount.amount));
}, [isOpen, cart]);
```

- [ ] **Step 3: 削除ボタンに `remove_from_cart` を追加する**

`removeItem(item.id)` の呼び出しは2箇所ある。`cartItems.map(({ node: item }) => {` の
スコープ内なので、変数名は `item` である。

まず、同じオブジェクトを2箇所で組み立てないよう、`cartItems.map` のコールバック冒頭
（`const product = item.merchandise.product;` の直後）にヘルパーを置く。

```tsx
const gaItem = (): GaItem => ({
  item_id: item.merchandise.id,
  item_name: product.title,
  item_variant: item.merchandise.title,
  price: unitPrice,
  quantity: item.quantity,
});
```

`unitPrice` は96行目で既に `parseFloat(item.merchandise.priceV2.amount)` として定義済み。

次に2箇所を書き換える。

**(1) ゴミ箱ボタン（138行目付近）:**

```tsx
onClick={() => {
  trackRemoveFromCart(gaItem());
  removeItem(item.id);
}}
```

**(2) 数量1での「−」押下（151-157行目付近）:**

```tsx
onClick={() => {
  if (item.quantity <= 1) {
    trackRemoveFromCart(gaItem());
    removeItem(item.id);
  } else {
    updateQuantity(item.id, item.quantity - 1);
  }
}}
```

- [ ] **Step 4: 実ブラウザで発火を確認する**

Run: `npm run dev`

1. 商品をカートに追加 → ドロワーが開く → `GA Event sent: view_cart` が出ること
2. ドロワーを閉じて再度開く → `view_cart` が再度出ること
3. ゴミ箱ボタンで削除 → `GA Event sent: remove_from_cart` が出ること
4. 数量1の状態で「−」を押す → `remove_from_cart` が出ること
5. **`begin_checkout` が出ないこと**（出る場合はポリシー違反。実装を戻すこと）

- [ ] **Step 5: コミット**

```bash
git add src/utils/analytics src/app/components/CartDrawer.tsx
git commit -m "view_cart / remove_from_cart を追加

カート内での離脱箇所を観測可能にする。begin_checkout は Shopify が
所有するため自社側では送信しない（設計書§6.2）。"
```

---

### Task 7: 問い合わせ種別のGA4送信（修正項目4）

問い合わせの77.4%がいちご狩り（Gmail実測115件中89件）だが、GA4には種別が送られていない。`ContactForm.tsx:150` に判定ロジックは既に存在するが、Google広告のコンバージョン発火にしか使われていない。

現状 `trackContactFormSubmission` は種別を `event_label` に入れているが、`event_label` はGA4の標準ディメンションではないためレポートで分解できない。**独立したパラメータとして送り、カスタムディメンションに登録する。**

分類の語彙は Gmail 側の分類器と一致させる（同一タクソノミーで両データソースを突き合わせるため）。

**Files:**
- Create: `src/utils/analytics/inquiry.ts`
- Modify: `src/utils/analytics/events.ts`
- Modify: `src/app/components/ContactForm.tsx`
- Test: `src/utils/analytics/__tests__/inquiry.test.ts`

**Interfaces:**
- Consumes: Task 2 の `sendGAEvent`
- Produces:
  - `type InquiryType = 'strawberry_picking' | 'wholesale' | 'ec_rice' | 'ec_strawberry' | 'access' | 'other'`
  - `classifyInquiry(subject: string, message: string): InquiryType`

- [ ] **Step 1: 失敗するテストを書く**

Create `src/utils/analytics/__tests__/inquiry.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { classifyInquiry } from '@/utils/analytics/inquiry';

describe('classifyInquiry', () => {
  it('classifies the picking dropdown value', () => {
    expect(classifyInquiry('いちご狩りについて', '')).toBe('strawberry_picking');
  });

  it('classifies picking mentioned only in the message body', () => {
    expect(classifyInquiry('その他', '苺狩りの予約をしたいです')).toBe('strawberry_picking');
  });

  it('classifies a rice enquiry even when it uses purchase wording', () => {
    expect(classifyInquiry('その他', '玄米30キロ買いに行きたいのですが')).toBe('ec_rice');
  });

  it('classifies the strawberry purchase dropdown value', () => {
    expect(classifyInquiry('いちごの購入について', '')).toBe('ec_strawberry');
  });

  it('classifies a wholesale enquiry', () => {
    expect(classifyInquiry('その他', '業務用で卸していただけますか')).toBe('wholesale');
  });

  it('classifies an access enquiry', () => {
    expect(classifyInquiry('アクセス・営業時間について', '')).toBe('access');
  });

  it('falls back to other', () => {
    expect(classifyInquiry('その他', 'こんにちは')).toBe('other');
  });

  it('prefers picking over purchase wording when both appear', () => {
    expect(classifyInquiry('その他', 'いちご狩りの後に購入もできますか')).toBe('strawberry_picking');
  });
});
```

- [ ] **Step 2: 失敗を確認する**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "@/utils/analytics/inquiry"`

- [ ] **Step 3: `src/utils/analytics/inquiry.ts` を作成する**

```ts
/**
 * 問い合わせ種別。Gmail側の分類器と同一のタクソノミーを使う
 * （設計書 §2.4 / 両データソースを突き合わせるため）。
 */
export type InquiryType =
  | 'strawberry_picking'
  | 'wholesale'
  | 'ec_rice'
  | 'ec_strawberry'
  | 'access'
  | 'other';

/**
 * 判定は上から順に評価し、最初に一致したものを返す。
 * 実測（2026-01〜04 / 115件）で77.4%がいちご狩りであるため最優先。
 * 「玄米を購入したい」のように購入語とお米語が同居するため、
 * お米・卸を汎用の購入語より先に評価する。
 */
const RULES: Array<[InquiryType, string[]]> = [
  ['strawberry_picking', ['いちご狩り', 'イチゴ狩り', '苺狩り', 'いちごがり']],
  ['wholesale', ['卸', '業務用', '仕入', '法人', '取引']],
  ['ec_rice', ['お米', '玄米', '白米', 'ヒノヒカリ', '精米', '分づき']],
  ['ec_strawberry', ['いちごの購入', '購入', '注文', '通販', '発送', '配送', '在庫']],
  ['access', ['アクセス', '営業時間', '駐車', '場所', '道順']],
];

export function classifyInquiry(subject: string, message: string): InquiryType {
  const haystack = `${subject} ${message}`;
  for (const [type, keywords] of RULES) {
    if (keywords.some((word) => haystack.includes(word))) return type;
  }
  return 'other';
}
```

- [ ] **Step 4: テストを通す**

Run: `npm test`
Expected: PASS — 28 passed

- [ ] **Step 5: `trackContactFormSubmission` に種別を追加する**

`events.ts` の先頭に import を追加する。

```ts
import { classifyInquiry } from './inquiry';
```

既存の `trackContactFormSubmission` を置き換える。**引数に `message` を追加する**（本文にのみ種別が現れるケースが実測で存在するため）。

```ts
export function trackContactFormSubmission(formData: {
  subject?: string;
  email?: string;
  message?: string;
}) {
  const inquiryType = classifyInquiry(formData.subject ?? '', formData.message ?? '');

  sendGAEvent('contact_form_submit', {
    event_category: 'engagement',
    event_label: formData.subject || 'お問い合わせ',
    inquiry_type: inquiryType,
    value: 1,
  });

  sendGAEvent('generate_lead', {
    currency: 'JPY',
    value: 0,
    inquiry_type: inquiryType,
  });
}
```

- [ ] **Step 6: `ContactForm.tsx` から `message` を渡す**

144行目付近の呼び出しを変更する。

```tsx
trackContactFormSubmission({
  subject: formData.subject,
  email: formData.email,
  message: formData.message,
});
```

**150行目の広告コンバージョン判定は変更しない。** 既存の挙動を維持する。

- [ ] **Step 7: 実ブラウザで発火を確認する**

Run: `npm run dev`

`/contact` でフォームに件名「いちご狩りについて」を選んで送信し、コンソールに
`inquiry_type: 'strawberry_picking'` が含まれることを確認する。

（EmailJSの環境変数が未設定の場合は送信自体が失敗する。その場合は
`ContactForm.tsx` の送信処理を一時的にコメントアウトして計測部分のみ確認するか、
Task 10 の本番環境での検証に回す。）

- [ ] **Step 8: GA4管理画面でカスタムディメンションを登録する（手動）**

GA4 管理 → カスタム定義 → カスタムディメンションを作成:

| 項目 | 値 |
|---|---|
| ディメンション名 | 問い合わせ種別 |
| 範囲 | イベント |
| イベントパラメータ | `inquiry_type` |

**登録しないとレポートで分解できない。** これが `click` イベントで起きた失敗の再発防止にあたる。

- [ ] **Step 9: コミット**

```bash
git add src/utils/analytics src/app/components/ContactForm.tsx
git commit -m "問い合わせ種別をGA4に送信

問い合わせの77.4%がいちご狩り（Gmail実測115件中89件）だが、GA4では
種別が分解できなかった。event_label は標準ディメンションではないため、
inquiry_type パラメータとして送りカスタムディメンションに登録する。

分類の語彙はGmail側の分類器と一致させ、両データソースを
同一タクソノミーで突き合わせられるようにする。"
```

---

### Task 8: click イベントの分解可能化（修正項目7）

電話クリック・メールクリック・外部リンククリックがすべて `click` という単一イベント名で送られ、区別が `event_category` / `event_label` に入っている。これらは未登録のカスタムパラメータのためレポートで分解できず、**いちご狩りの主要導線である電話予約が測定不能**になっている（実測 `click` 225件の内訳が不明）。

カスタムディメンション登録ではなく、**独立したイベント名に分ける**。登録漏れという同じ失敗を構造的に起こさないため。

**Files:**
- Modify: `src/utils/analytics/events.ts`

**Interfaces:**
- Consumes: Task 2 の `sendGAEvent`
- Produces: `trackPhoneClick` / `trackEmailClick` / `trackExternalLinkClick`（シグネチャは変更せず、送信するイベント名のみ変更）

- [ ] **Step 1: 3つの関数のイベント名を変更する**

`events.ts` の該当関数を置き換える。**呼び出し元のシグネチャは変えないため、5箇所の呼び出し元は無変更で済む。**

```ts
/**
 * 外部リンククリック。
 * 電話・メールとイベント名を分けている理由:
 * event_category / event_label は未登録のカスタムパラメータであり
 * GA4レポートで分解できないため（設計書 §6.3 項目7）。
 */
export function trackExternalLinkClick(url: string, linkText?: string) {
  sendGAEvent('outbound_click', {
    link_url: url,
    link_text: linkText || url,
  });
}

/**
 * 電話番号クリック。いちご狩り予約の主要導線。
 */
export function trackPhoneClick(phoneNumber: string) {
  sendGAEvent('phone_click', {
    phone_number: phoneNumber,
  });
}

export function trackEmailClick(email: string) {
  sendGAEvent('email_click', {
    email_domain: email.split('@')[1] ?? '',
  });
}
```

`trackEmailClick` はメールアドレス全体ではなくドメインのみを送る。個人を特定しうる情報をGA4に送らないため。

- [ ] **Step 2: 型検査を通す**

Run: `npm run typecheck`
Expected: エラーなし

Run: `npm test`
Expected: PASS — 28 passed（既存テストが壊れていないこと）

- [ ] **Step 3: 実ブラウザで発火を確認する**

Run: `npm run dev`

モバイルビューポート（DevToolsのデバイスモード）で `/strawberry-picking` を開き、
電話番号リンクをクリックして以下を確認する。

1. `GA Event sent: phone_click {phone_number: ...}` が出ること
2. `GA Event sent: click` が**出ないこと**
3. Google広告のコンバージョン（`Google Ads Conversion tracked`）が従来どおり出ること

- [ ] **Step 4: GA4管理画面でキーイベントに登録する（手動）**

GA4 管理 → イベント → 新しいイベントが記録されるまで最大24時間待ち、
`phone_click` を**キーイベントとしてマークする**。

（イベントは1度発生しないと管理画面の一覧に現れない。Step 3 の確認で
発生させた分が反映されるのを待つ。）

- [ ] **Step 5: コミット**

```bash
git add src/utils/analytics
git commit -m "clickイベントを phone_click / email_click / outbound_click に分割

3種類のクリックが単一のclickイベントで送られ、区別が未登録の
カスタムパラメータ(event_category/event_label)に入っていたため、
GA4レポートで分解できなかった。実測225件の内訳が不明の状態。

いちご狩りの主要導線である電話予約が測定不能だったのを解消する。
カスタムディメンション登録ではなくイベント名を分けることで、
登録漏れという同じ失敗が構造的に起きないようにする。

email_click はアドレス全体ではなくドメインのみを送る。"
```

---

### Task 9: GA4のファネル別キーイベント定義（修正項目6）

設計書 §4.1 の3ファネル分割をGA4上で定義する。**すべて管理画面での手動作業**であり、コード変更はない。

**Files:** なし（GA4管理画面の設定のみ）

**Interfaces:**
- Consumes: Task 4〜8 で送信を開始したイベント
- Produces: GA4上のキーイベント定義。データ取得スクリプト（サブプロジェクト2）がこれを参照する。

- [ ] **Step 1: イベントが記録されていることを確認する**

GA4 管理 → データ表示 → イベント で、以下が一覧に現れていること。
現れない場合は最大24時間待つ。

`page_view` / `view_item` / `view_item_list` / `add_to_cart` / `view_cart` /
`remove_from_cart` / `contact_form_submit` / `phone_click`

- [ ] **Step 2: キーイベントを登録する**

| ファネル | キーイベント |
|---|---|
| A・B（EC） | `add_to_cart`（`purchase` はShopify側で既に記録済み） |
| C（いちご狩り） | `contact_form_submit`、`phone_click` |

- [ ] **Step 3: 比較セグメントを作成する**

レポート上でファネルA/Bを分離するため、以下のセグメントを作成する。

| セグメント名 | 条件 |
|---|---|
| EC-いちご | `item_category` = `strawberry` を含むイベントがあるセッション |
| EC-お米 | `item_category` = `rice` を含むイベントがあるセッション |
| いちご狩り | `page_path` に `/strawberry-picking` を含むセッション |

- [ ] **Step 4: カスタムディメンションの登録漏れを確認する**

カスタム定義に `inquiry_type`（Task 7 で登録）が存在すること。
存在しない場合、問い合わせ種別は永久に分解できない。

- [ ] **Step 5: 設定内容を設計書に記録する**

`docs/plans/2026-09-05-improvement-loop-design.md` の §6.3 項目6 の行に、
実際に登録したキーイベント名とセグメント定義を追記する。
GA4の管理画面設定はコードに残らないため、記録しないと再現できない。

- [ ] **Step 6: コミット**

```bash
git add docs/plans/2026-09-05-improvement-loop-design.md
git commit -m "GA4のファネル別キーイベント定義を設計書に記録

管理画面の設定はコードに残らないため、実際に登録した
キーイベント名とセグメント定義を設計書に追記する。"
```

---

### Task 10: Claude in Chrome によるT1検証

設計書 §10.1 の T1（計測欠陥の修正の検証通貨）を実施する。ユニットテストは純粋関数しか検証していない。**実際にGA4へイベントが届いているかは、実ブラウザで実サイトを操作してのみ確認できる。**

**Files:**
- Create: `docs/plans/2026-09-05-measurement-verification-report.md`

**Interfaces:**
- Consumes: Task 1〜9 の全成果
- Produces: 検証レポート。サブプロジェクト2以降が「計測は信頼できる」と仮定する根拠になる。

- [ ] **Step 1: ステージング環境で確認する**

`npm run build && npx vite preview` でプロダクションビルドを起動する。
開発サーバーではなくビルド後の成果物で確認する理由は、プリレンダリングを経た
HTMLで `send_page_view: false` が正しく効いているかを確認するため。

- [ ] **Step 2: モバイルビューポートで購入導線を通しで操作する**

Claude in Chrome を使い、**375x667（モバイル）** で以下を順に実行し、
各ステップでコンソールとネットワーク（`google-analytics.com/g/collect` へのリクエスト）
を確認する。

1. トップページを開く → `page_view` が1回
2. `/strawberries` へ遷移 → `page_view`（`page_path: '/strawberries'`）と `view_item_list`
3. 商品をカートに追加 → `add_to_cart` と `view_cart`
4. カートから商品を削除 → `remove_from_cart`
5. 再度追加してチェックアウトボタンを押す → **`begin_checkout` が自社側から出ないこと**
6. `/strawberry-picking` へ遷移 → 電話リンクをクリック → `phone_click`

- [ ] **Step 3: 二重計上がないことを確認する**

`/strawberries/`（末尾スラッシュあり）を直接開き、以下を確認する。

- `page_path` が `/strawberries` に正規化されていること
- `page_view` が**1回だけ**送信されていること（拡張計測との二重送信がないこと）

- [ ] **Step 4: GA4のリアルタイムレポートで着弾を確認する**

GA4 → レポート → リアルタイム で、Step 2〜3 で発生させたイベントが
**実際にGA4側に記録されている**ことを確認する。

コンソールに出ていてもGA4に届いていないケース（広告ブロッカー、
測定IDの誤り、consent設定）があるため、この確認は省略しない。

- [ ] **Step 5: 検証レポートを作成する**

Create `docs/plans/2026-09-05-measurement-verification-report.md`:

各イベントについて「送信された / GA4に着弾した / パラメータが正しい」の3点を
表形式で記録する。未達の項目があれば、それをそのまま次の修正タスクとする。

- [ ] **Step 6: コミット**

```bash
git add docs/plans/2026-09-05-measurement-verification-report.md
git commit -m "計測基盤修正のT1検証レポートを追加

Claude in Chrome によりモバイルビューポートで購入導線を通しで操作し、
各イベントの発火・GA4への着弾・パラメータの正しさを確認した記録。
ユニットテストは純粋関数しか検証していないため、実発火の確認は
実ブラウザでのみ行える（設計書§10.1 T1）。"
```

---

## 完了条件

- [ ] `npm test` が通る
- [ ] `npm run typecheck` が通る
- [ ] `npm run build` が通る
- [ ] Task 10 の検証レポートで全イベントが「GA4着弾」を確認済み
- [ ] `begin_checkout` / `purchase` が自社サイトから送信されていないこと
- [ ] `page_view` の二重計上がないこと

## 本計画のスコープ外

以下は設計書の別サブプロジェクトであり、それぞれ個別の実装計画を作成する。

| サブプロジェクト | 内容 |
|---|---|
| 2 | データ集約（スナップショット取得スクリプト・Shopify Admin API・BigQuery連携） |
| 3 | 仮説台帳（GitHub Projects v2） |
| 4 | AIループ（週次自動化・広告操作） |
| 5 | 定性観測（PostHog導入・プライバシーポリシー改訂） |

## 期限

**2026年11月末。** 12月のいちごシーズン開始までに完了しない場合、
クリーンなデータでピークシーズンを記録できる次の機会は2027年12月になる。
