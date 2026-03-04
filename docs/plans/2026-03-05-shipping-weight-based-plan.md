# 重量ベース送料計算 + カート梱包数表示 実装計画

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** カート内の商品数に応じた正確な送料計算（Shopify側）と、カート画面での梱包数表示（フロントエンド側）を実現する。

**Architecture:** Shopify管理画面で全バリアントの重量を1kgに統一し、重量ティアで送料を梱包数倍にする。フロントエンドのCartDrawerでは梱包数を計算して案内メッセージを表示する。

**Tech Stack:** Shopify管理画面（手動設定）、React + TypeScript（CartDrawer.tsx）

---

### Task 1: Shopify管理画面 — バリアント重量の統一

**手動作業（コード変更なし）**

**Step 1: Shopify管理画面で全商品の重量を設定**

1. Shopify管理画面 > 商品 にアクセス
2. 各商品の各バリアントを開く
3. 「配送」セクションの重量を `1 kg` に設定
4. 全商品・全バリアントで繰り返す

**Step 2: 確認**

商品一覧で全バリアントの重量が1kgになっていることを確認する。

---

### Task 2: Shopify管理画面 — 配送ゾーンと重量ティアの設定

**手動作業（コード変更なし）**

**Step 1: 既存の送料設定を確認**

Shopify管理画面 > 設定 > 配送と配達 > 配送プロファイル

**Step 2: 配送ゾーンの設定**

- 九州ゾーン: 福岡県、佐賀県、長崎県、熊本県、大分県、宮崎県、鹿児島県
- その他日本ゾーン: 上記以外の都道府県

**Step 3: 九州ゾーンの重量ティア設定**

既存の固定送料を削除し、以下の重量ベース送料を追加:

| 重量範囲 | 送料 |
|----------|------|
| 0〜1 kg | ¥1,300 |
| 1.01〜2 kg | ¥2,600 |
| 1.01〜3 kg | ¥3,900 |
| 3.01〜4 kg | ¥5,200 |
| 4.01〜5 kg | ¥6,500 |
| 5.01〜6 kg | ¥7,800 |
| 6.01〜7 kg | ¥9,100 |
| 7.01〜8 kg | ¥10,400 |
| 8.01〜9 kg | ¥11,700 |
| 9.01〜10 kg | ¥13,000 |

**Step 4: その他日本ゾーンの重量ティア設定**

同様に:

| 重量範囲 | 送料 |
|----------|------|
| 0〜1 kg | ¥2,300 |
| 1.01〜2 kg | ¥4,600 |
| 2.01〜3 kg | ¥6,900 |
| 3.01〜4 kg | ¥9,200 |
| 4.01〜5 kg | ¥11,500 |
| 5.01〜6 kg | ¥13,800 |
| 6.01〜7 kg | ¥16,100 |
| 7.01〜8 kg | ¥18,400 |
| 8.01〜9 kg | ¥20,700 |
| 9.01〜10 kg | ¥23,000 |

**Step 5: テスト注文で確認**

テスト注文を作成し、商品数に応じた送料が正しく表示されることを確認する。

---

### Task 3: CartDrawer.tsx — 梱包数表示の追加

**Files:**
- Modify: `src/app/components/CartDrawer.tsx:196-203`（合計金額表示の下に追加）

**Step 1: 梱包数の計算と表示を追加**

`CartDrawer.tsx` のフッター部分、合計金額の `<div>` の直後に以下を追加:

```tsx
{(() => {
  const packageCount = cartItems.reduce((sum, { node }) => sum + node.quantity, 0);
  if (packageCount < 2) return null;
  return (
    <div
      className="flex items-start gap-2 p-3 rounded-lg text-sm"
      style={{ backgroundColor: 'var(--color-neutral-100)', color: 'var(--color-neutral-700)' }}
    >
      <span className="flex-shrink-0 mt-0.5">📦</span>
      <div>
        <p className="font-semibold">{packageCount}梱包での配送になります</p>
        <p className="mt-1 text-xs" style={{ color: 'var(--color-neutral-500)' }}>
          ※送料は梱包数分かかります。正確な送料はチェックアウト時に確定します。
        </p>
      </div>
    </div>
  );
})()}
```

**Step 2: 目視確認**

`npm run dev` で開発サーバーを起動し、以下を確認:
- カートに商品1つ → 梱包数メッセージ非表示
- カートに商品2つ以上 → 「N梱包での配送になります」が表示される
- 同じ商品を数量2 → 「2梱包での配送になります」が表示される

**Step 3: コミット**

```bash
git add src/app/components/CartDrawer.tsx
git commit -m "カート画面に梱包数の案内メッセージを追加"
```
