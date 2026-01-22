# Shopify統合セットアップガイド（2026年版）

このガイドでは、津留イチゴ園のウェブサイトにShopifyを統合する最新の手順を説明します。

## 前提条件

- Shopifyアカウントとストアが作成済みであること
- Shopifyストアに商品が登録されていること

## ステップ1: Headlessチャネルのインストール

1. Shopify管理画面にログイン
2. [Shopify App Store](https://apps.shopify.com/headless)から「Headless」チャネルをインストール
3. インストール後、管理画面の「販売チャネル」に「Headless」が表示されます

## ステップ2: ストアフロントの作成

1. Shopify管理画面で「販売チャネル」→「Headless」をクリック
2. 「ストアフロントを追加」をクリック
3. ストアフロント名を入力（例：「津留イチゴ園ウェブサイト」）
4. 作成されたストアフロントを選択

## ステップ3: API権限の設定

1. ストアフロントの詳細ページで「APIアクセスを管理」セクションを確認
2. 「Storefront API」の「管理」をクリック
3. 「権限」セクションで編集アイコンをクリック
4. 必要な権限スコープを有効化：
   - ✅ 製品リスト（Products and collections）
   - ✅ カート（Cart）
   - ✅ チェックアウト（Checkout）
   - ✅ 顧客アカウント（Customers）- オプション
   - ✅ メタフィールド（Metafields）- オプション
5. 「保存」をクリック

## ステップ4: アクセストークンの取得

1. ストアフロントの詳細ページで「Storefront API」の「管理」をクリック
2. 「API トークン」または「公開アクセストークン」をコピー
3. このトークンは安全に保管してください

## ステップ5: 環境変数の設定

プロジェクトのルートディレクトリに `.env` ファイルを作成し、以下の値を設定してください：

```env
VITE_SHOPIFY_STORE_DOMAIN=your-store-name.myshopify.com
VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token_here
```

次に、`/src/utils/shopify.ts` ファイルを更新して環境変数を使用します：

```typescript
const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const STOREFRONT_ACCESS_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
```

## ステップ6: 商品の登録

Shopify管理画面で以下の商品を登録してください。

### 商品登録用プロンプト

以下のプロンプトを使用して、Shopify管理画面で商品を効率的に登録できます：

#### 商品1: あまおう（特大サイズ）

```
商品名: あまおう（特大サイズ）
説明: 
福岡県産の最高級ブランドいちご「あまおう」。
大粒で甘みが強く、果肉がしっかりしているのが特徴です。
贈答用に最適な特大サイズのみを厳選してお届けします。

- 品種：あまおう
- 産地：福岡県
- サイズ：特大（1粒30g以上）
- 内容量：500g（約15-20粒）
- 賞味期限：冷蔵保存で3-4日
- 保存方法：要冷蔵（10℃以下）

価格: ¥3,800
バリアント: 500g
SKU: AMAOU-L-500
在庫管理: 有効
販売チャネル: Headlessにチェック
```

#### 商品2: とちおとめ（大サイズ）

```
商品名: とちおとめ（大サイズ）
説明:
栃木県を代表する品種「とちおとめ」。
程よい酸味と甘みのバランスが絶妙で、万人に愛される味わいです。
鮮やかな紅色と豊かな香りが特徴です。

- 品種：とちおとめ
- 産地：福岡県（契約農家栽培）
- サイズ：大（1粒20-25g）
- 内容量：400g（約20-25粒）
- 賞味期限：冷蔵保存で3-4日
- 保存方法：要冷蔵（10℃以下）

価格: ¥2,800
バリアント: 400g
SKU: TOCHI-L-400
在庫管理: 有効
販売チャネル: Headlessにチェック
```

#### 商品3: 紅ほっぺ（中サイズ）

```
商品名: 紅ほっぺ（中サイズ）
説明:
静岡県生まれの人気品種「紅ほっぺ」。
鮮やかな紅色と豊かな香り、しっかりとした甘みが特徴です。
デザートやスイーツ作りにも最適なサイズです。

- 品種：紅ほっぺ
- 産地：福岡県
- サイズ：中（1粒15-20g）
- 内容量：300g（約20-25粒）
- 賞味期限：冷蔵保存で3-4日
- 保存方法：要冷蔵（10℃以下）

価格: ¥2,200
バリアント: 300g
SKU: BENI-M-300
在庫管理: 有効
販売チャネル: Headlessにチェック
```

#### 商品4: いちごジャム（自家製）

```
商品名: いちごジャム（自家製）
説明:
完熟いちごをたっぷり使用した無添加の自家製ジャムです。
砂糖とレモン果汁のみで作られた、いちご本来の味わいをお楽しみいただけます。
パンやヨーグルトに最適です。

- 原材料：いちご（福岡県産）、砂糖、レモン果汁
- 内容量：200g
- 賞味期限：製造日から6ヶ月（開封後は冷蔵保存で2週間）
- 保存方法：直射日光を避け、常温保存（開封後は要冷蔵）
- 添加物：不使用

価格: ¥1,200
バリアント: 200g
SKU: JAM-200
在庫管理: 有効
販売チャネル: Headlessにチェック
```

**重要**: 各商品を登録する際、「販売チャネル」で「Headless」にチェックを入れることを忘れないでください。

## ステップ7: 商品画像の準備

各商品に高品質な画像をアップロードしてください：

- 推奨サイズ：1200x1200px以上
- ファイル形式：JPG または PNG
- 背景：白または自然光での撮影
- 最低3枚の画像（正面、斜め、クローズアップ）

## ステップ8: コレクションの作成

Shopify管理画面で以下のコレクションを作成してください：

1. **生いちご**
   - あまおう（特大サイズ）
   - とちおとめ（大サイズ）
   - 紅ほっぺ（中サイズ）
   - 販売チャネル：Headlessにチェック

2. **加工品**
   - いちごジャム（自家製）
   - 販売チャネル：Headlessにチェック

## ステップ9: 配送設定

1. Shopify管理画面の「設定」→「配送と配達」
2. 配送エリアを設定（日本全国）
3. 配送料金を設定：
   - クール便（冷蔵）必須
   - 北海道・沖縄：1,500円
   - その他の地域：1,000円
   - 10,000円以上のご購入で送料無料

## ステップ10: ウェブサイトへの統合

### Storefront API 2026-01バージョンを使用

最新のStorefront APIエンドポイント：

```
https://{store_name}.myshopify.com/api/2026-01/graphql.json
```

### 実装例

`/src/utils/shopify.ts` で以下のように実装します：

```typescript
const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const STOREFRONT_ACCESS_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const API_VERSION = '2026-01';

async function shopifyFetch({ query, variables = {} }: {
  query: string;
  variables?: Record<string, any>;
}) {
  const endpoint = `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`;
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.statusText}`);
  }

  return response.json();
}

// 商品一覧を取得
export async function fetchProducts(limit = 10) {
  const query = `
    query GetProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            description
            handle
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  `;

  const { data } = await shopifyFetch({
    query,
    variables: { first: limit },
  });

  return data.products.edges.map((edge: any) => edge.node);
}
```

### トークンレスアクセス（オプション）

基本的な製品情報とカート操作には、トークンなしでもアクセス可能です（クエリ複雑度1,000まで）：

```typescript
async function shopifyFetchTokenless({ query, variables = {} }: {
  query: string;
  variables?: Record<string, any>;
}) {
  const endpoint = `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`;
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });

  return response.json();
}
```

**注意**: トークンレスアクセスでは以下の機能にアクセスできません：
- 商品タグ
- メタオブジェクトとメタフィールド
- オンラインストアのナビゲーション
- 顧客情報

## ステップ11: カート機能の実装

### カートの作成

```typescript
export async function createCart() {
  const query = `
    mutation CreateCart {
      cartCreate {
        cart {
          id
          checkoutUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const { data } = await shopifyFetch({ query });
  return data.cartCreate.cart;
}
```

### カートに商品を追加

```typescript
export async function addToCart(cartId: string, merchandiseId: string, quantity: number = 1) {
  const query = `
    mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    priceV2 {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const { data } = await shopifyFetch({
    query,
    variables: {
      cartId,
      lines: [{ merchandiseId, quantity }],
    },
  });

  return data.cartLinesAdd.cart;
}
```

## ステップ12: テスト

1. テスト注文を実行
2. 決済フローの確認
3. メール通知の確認
4. 在庫管理の確認

## セキュリティ上の注意

### 公開アクセストークン
- 公開アクセストークン（Public Access Token）はクライアント側で使用しても安全です
- ブラウザや��バイルアプリから直接APIを呼び出せます
- 環境変数名に `VITE_` プレフィックスを付けることで、Viteがブラウザに公開します

### プライベートアクセストークン
- サーバーサイドでのみ使用してください
- 絶対にクライアント側のコードやGitリポジトリに含めないでください
- 必要最小限のスコープのみを要求してください

### 本番環境での環境変数管理
- `.env` ファイルは `.gitignore` に追加してください
- 各環境（開発、ステージング、本番）で異なる環境変数を使用してください
- Vercel、Netlify、Cloudflare Pagesなどのホスティングサービスの環境変数設定を使用してください

## 推奨アプローチ

### 1. Hydrogen（推奨）

Shopify公式のReactフレームワークを使用して、高性能なヘッドレスコマースを構築：

```bash
npm create @shopify/hydrogen@latest
```

**メリット**:
- Shopify APIに最適化されたコンポーネント
- Oxygen（Shopifyのエッジホスティング）で無料デプロイ
- サーバーサイドレンダリングとプログレッシブエンハンスメント
- React Routerベースで高速

### 2. カスタムスタック（現在のプロジェクト）

既存のReact/Viteプロジェクトに統合する場合は、Storefront APIを直接使用します。

**メリット**:
- 既存のインフラストラクチャを維持
- フレームワークの自由な選択
- 任意のホスティングプロバイダーを使用可能

### 3. Storefront Web Components（シンプルな統合）

既存のウェブサイトに商品を埋め込む場合：

```html
<script type="module" src="https://cdn.shopify.com/shopifycloud/storefront-web-components/v1/storefront-web-components.js"></script>

<shopify-product handle="your-product-handle" store-domain="your-store.myshopify.com">
</shopify-product>
```

## サポートとリソース

### 公式ドキュメント
- [Storefront API リファレンス](https://shopify.dev/docs/api/storefront/2026-01)
- [Headless チャネルガイド](https://shopify.dev/docs/storefronts/headless/bring-your-own-stack)
- [Hydrogen ドキュメント](https://shopify.dev/docs/storefronts/headless/hydrogen)
- [GraphiQL Explorer](https://shopify.dev/docs/custom-storefronts/tools/graphiql-storefront-api)

### 開発者ツール
- [Shopify CLI](https://shopify.dev/docs/api/shopify-cli) - 開発効率化ツール
- [GraphiQL App](https://shopify-graphiql-app.shopifycloud.com/) - クエリテストツール
- [Storefront API Learning Kit](https://github.com/Shopify/storefront-api-learning-kit)

### コミュニティ
- [Shopify Developer Changelog](https://shopify.dev/changelog)
- [Shopify Community Forums](https://community.shopify.com/)
- [Shopify Partner Program](https://www.shopify.com/partners)

## よくある質問（FAQ）

### Q: 在庫数はリアルタイムで反映されますか？
A: はい、Storefront APIを使用すると、リアルタイムで在庫状況が反映されます。商品クエリに `quantityAvailable` フィールドを含めることで在庫数を取得できます。

### Q: 複数のバリアント（サイズなど）を設定できますか？
A: はい、Shopifyの商品にバリアントを追加することで、サイズや色などの選択肢を提供できます。各バリアントは独自の価格、SKU、在庫を持つことができます。

### Q: レート制限はありますか？
A: Storefront APIにはリクエスト数の制限はありませんが、悪意のあるトラフィックと判断された場合、`430 Shopify Security Rejection` エラーが返されます。トークンレスアクセスの場合、クエリ複雑度1,000までという制限があります。

### Q: トークンレスアクセスとトークンベース認証の違いは？
A: 
- **トークンレスアクセス**: 基本的な製品情報、コレクション、カート操作にアクセス可能（複雑度制限あり）
- **トークンベース認証**: 商品タグ、メタフィールド、顧客情報など、すべての機能にアクセス可能

### Q: 定期購入は設定できますか？
A: はい、[Shopify Subscriptions](https://help.shopify.com/en/manual/products/purchase-options/subscriptions)機能を使用することで定期購入が可能です。

### Q: クーポンコードは使えますか？
A: はい、Shopify管理画面の「ディスカウント」セクションでクーポンコードを作成できます。チェックアウト時に自動的に適用されます。

### Q: API バージョンはどのくらいの頻度で更新されますか？
A: Storefront APIは年4回（四半期ごと）新しいバージョンがリリースされます。各バージョンは最低12ヶ月間サポートされます。

### Q: 本番環境にデプロイする前にテストできますか？
A: はい、Shopifyの開発ストアを使用するか、[GraphiQL Explorer](https://shopify.dev/docs/custom-storefronts/tools/graphiql-storefront-api)でクエリをテストできます。

### Q: Buy Button SDKはまだ使用できますか？
A: Buy Button SDKは現在も使用可能ですが、より柔軟性の高いStorefront APIの直接使用が推奨されています。新しいプロジェクトではStorefront APIまたはHydrogenを使用することを推奨します。

### Q: Headlessチャネルとカスタムアプリの違いは？
A: 
- **Headlessチャネル**: ヘッドレスストアフロント専用の販売チャネル。複数のストアフロントを管理しやすい
- **カスタムアプリ**: より高度な統合や管理機能が必要な場合に使用。Admin APIアクセスも可能

### Q: サーバーサイドとクライアントサイドのどちらでAPIを呼び出すべきですか？
A: 
- **クライアントサイド**: 公開アクセストークンを使用。ブラウザから直接API呼び出し
- **サーバーサイド**: プライベートアクセストークンを使用。より高度な機能やセキュリティが必要な場合

一般的には、静的サイト生成やSEO最適化のためにサーバーサイド、リアルタイムな操作（カート追加など）にはクライアントサイドを使用します。

## バージョン情報

- **ドキュメントバージョン**: 2026年1月版
- **Storefront APIバージョン**: 2026-01
- **最終更新日**: 2026年1月22日

## 変更履歴

### 2026年1月版
- Headlessチャネルを使用した最新のセットアップ方法に更新
- Storefront API 2026-01対応
- トークンレスアクセスの情報を追加
- 環境変数管理のベストプラクティスを追加
- Buy Button SDK推奨から Storefront API 直接使用に変更
- Hydrogenフレームワークの情報を追加
