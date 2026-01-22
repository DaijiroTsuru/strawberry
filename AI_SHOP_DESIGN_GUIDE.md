# AI駆動型カスタムショップデザインガイド

Shopify MCPを使ってAIがShopifyの商品情報を取得し、カスタムデザインのショップを自動構築する方法を説明します。

## 概要

このガイドでは、以下のワークフローを実装します：

1. **AIがShopify MCPで商品データを取得**
2. **取得したproductId、variantIdを使ってカスタムUIを生成**
3. **カート機能と連携**

## 前提条件

- [SHOPIFY_DEV_MCP_SETUP.md](SHOPIFY_DEV_MCP_SETUP.md)のセットアップが完了していること
- Shopify Storefront APIの認証情報が設定されていること

## ステップ1: AIが商品情報を取得

### Copilot Chatでの使用例

```
@workspace Shopifyストアから全ての商品を取得して、各商品のid、title、description、variants（id、price、availableForSale）を表示して
```

### 期待される応答

AIは以下のようなGraphQLクエリを生成・実行します：

```graphql
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
        images(first: 5) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
              availableForSale
              quantityAvailable
            }
          }
        }
      }
    }
  }
}
```

### 重要なフィールド

カスタムショップデザインで必要な主要フィールド：

- **`product.id`**: 商品の一意なID（例: `gid://shopify/Product/123456789`）
- **`product.handle`**: URL用のslug（例: `strawberry-500g`）
- **`variant.id`**: バリアントID（カートに追加する際に使用）
- **`variant.price.amount`**: 価格
- **`variant.availableForSale`**: 在庫状況

## ステップ2: AIがカスタムUIを生成

### プロンプト例

```
@workspace 取得した商品データを使って、各商品カードに以下を含むReactコンポーネントを作成して：
- 商品画像
- 商品タイトル
- 価格表示
- 「カートに追加」ボタン（variant.idを使用）
- 在庫切れ表示
```

### 生成されるコード例

```tsx
import { useState } from 'react';
import { useCart } from '@/app/contexts/CartContext';

interface ProductCardProps {
  productId: string;
  title: string;
  description: string;
  imageUrl: string;
  variantId: string;
  price: string;
  currencyCode: string;
  availableForSale: boolean;
}

export function ProductCard({
  productId,
  title,
  description,
  imageUrl,
  variantId,
  price,
  currencyCode,
  availableForSale
}: ProductCardProps) {
  const { addToCart, isLoading } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = async () => {
    try {
      // AIが自動的にvariantIdを使用
      await addToCart(variantId, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 3000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  return (
    <div className="product-card">
      <img src={imageUrl} alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="price">
        {price} {currencyCode}
      </div>
      <button
        onClick={handleAddToCart}
        disabled={!availableForSale || isLoading}
      >
        {added ? '✓ 追加済み' : availableForSale ? 'カートに追加' : '売り切れ'}
      </button>
    </div>
  );
}
```

## ステップ3: データフローの実装

### 商品データ取得関数（AIが生成）

```typescript
// src/utils/shopify.ts に追加
export async function fetchShopifyProducts(count: number = 10) {
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
            images(first: 5) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                  quantityAvailable
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
    variables: { first: count },
  });

  return data.products.edges.map((edge: any) => edge.node);
}
```

### ページコンポーネント（AIが生成）

```tsx
import { useEffect, useState } from 'react';
import { fetchShopifyProducts } from '@/utils/shopify';
import { ProductCard } from './ProductCard';

export function CustomShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchShopifyProducts(20);
        setProducts(data);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="shop-grid">
      {products.map((product) => {
        const variant = product.variants.edges[0]?.node;
        const image = product.images.edges[0]?.node;
        
        return (
          <ProductCard
            key={product.id}
            productId={product.id}
            title={product.title}
            description={product.description}
            imageUrl={image?.url}
            variantId={variant?.id}
            price={variant?.price.amount}
            currencyCode={variant?.price.currencyCode}
            availableForSale={variant?.availableForSale}
          />
        );
      })}
    </div>
  );
}
```

## ステップ4: カート連携

### カート作成とアイテム追加

```typescript
// AIが自動的にvariantIdを使用してカートに追加
export async function addToCart(
  cartId: string,
  variantId: string,  // これがShopifyから取得したvariant.id
  quantity: number = 1
) {
  const query = `
    mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      title
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
      lines: [{ merchandiseId: variantId, quantity }],
    },
  });

  return data.cartLinesAdd.cart;
}
```

## AI活用の実践例

### 例1: 特定カテゴリの商品ページを生成

```
@workspace Shopifyから「いちご」に関連する商品を全て取得して、
かわいい農園テーマのカスタムデザインで商品ページを作成して。
各商品カードには：
- 商品画像（角丸）
- 商品名（大きなフォント）
- 説明（2行まで）
- 価格（目立つ表示）
- カートに追加ボタン（variantIdを使用）
```

### 例2: 商品詳細ページを生成

```
@workspace 特定のproductIdから商品詳細ページを作成して。
含めるもの：
- 商品画像ギャラリー
- 全バリアント表示（サイズ・色など）
- 各バリアントの価格と在庫状況
- バリアント選択時に対応するvariantIdでカート追加
- 関連商品表示（productRecommendations APIを使用）
```

### 例3: カスタム検索ページ

```
@workspace Storefront APIのsearchクエリを使って商品検索ページを作成。
検索結果には商品のid、title、画像、価格、variantIdを含めて、
検索結果から直接カートに追加できるようにして
```

## データ構造の理解

### Shopify GraphQL IDの形式

```
Product ID:   gid://shopify/Product/1234567890
Variant ID:   gid://shopify/ProductVariant/9876543210
```

これらのIDは：
- **グローバルに一意**
- **APIリクエストで直接使用可能**
- **カート操作に必須**

### 型定義（TypeScript）

```typescript
export interface ShopifyProduct {
  id: string;  // gid://shopify/Product/...
  title: string;
  description: string;
  handle: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;  // gid://shopify/ProductVariant/...
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        availableForSale: boolean;
        quantityAvailable?: number;
      };
    }>;
  };
}
```

## ベストプラクティス

### 1. エラーハンドリング

```typescript
try {
  const products = await fetchShopifyProducts(10);
  // 商品データを使用
} catch (error) {
  console.error('Shopify API Error:', error);
  // フォールバックUIまたはモックデータを表示
}
```

### 2. ローディング状態の管理

```tsx
{isLoading ? (
  <div>商品を読み込み中...</div>
) : products.length === 0 ? (
  <div>商品が見つかりません</div>
) : (
  <ProductGrid products={products} />
)}
```

### 3. バリアント選択

複数バリアントがある場合：

```typescript
const [selectedVariant, setSelectedVariant] = useState(
  product.variants.edges[0]?.node
);

const handleAddToCart = () => {
  addToCart(selectedVariant.id, 1);
};
```

### 4. 在庫チェック

```typescript
const isInStock = variant.availableForSale && 
                  (variant.quantityAvailable ?? 0) > 0;
```

## AIプロンプトのテンプレート

### 商品一覧取得

```
@workspace Shopify Storefront APIを使って商品一覧を取得。
必要なフィールド: id, title, description, handle, images, variants(id, price, availableForSale)
取得件数: 20件
```

### カスタムUIデザイン

```
@workspace 取得した商品データで[デザイン要件]のUIを作成。
各商品カードに以下を含める：
- [UI要素1]
- [UI要素2]
- カートに追加ボタン（variant.idを使用）

デザインテーマ: [テーマ名]
カラースキーム: [色の指定]
```

### フィルター・ソート機能

```
@workspace 商品一覧に以下の機能を追加：
- 価格帯フィルター
- カテゴリフィルター
- 価格ソート（昇順・降順）
- 在庫ありのみ表示

全てのフィルター適用後もvariantIdを保持してカート追加可能に
```

## トラブルシューティング

### variantIdが取得できない

```typescript
// 常に最初のバリアントを取得
const variant = product.variants.edges[0]?.node;
if (!variant) {
  console.error('No variants found for product:', product.id);
  return null;
}
```

### カート追加エラー

```typescript
if (data.cartLinesAdd.userErrors.length > 0) {
  const error = data.cartLinesAdd.userErrors[0];
  console.error('Cart error:', error.field, error.message);
  // エラーをユーザーに表示
}
```

### 画像が表示されない

```typescript
const imageUrl = product.images.edges[0]?.node.url || 
                 '/placeholder-image.jpg';
```

## 参考リンク

- [Shopify Storefront API - Products](https://shopify.dev/docs/api/storefront/latest/queries/products)
- [Shopify Storefront API - Cart](https://shopify.dev/docs/api/storefront/latest/mutations/cartCreate)
- [Product Type Reference](https://shopify.dev/docs/api/storefront/latest/objects/Product)
- [ProductVariant Type Reference](https://shopify.dev/docs/api/storefront/latest/objects/ProductVariant)

## まとめ

このガイドを使うことで：

✅ AIがShopifyから商品データを自動取得  
✅ productId/variantIdを含むカスタムUIを生成  
✅ カート機能と完全に連携  
✅ デザインの自由度が高い  
✅ コードの保守性が高い  

AIとShopify MCPの組み合わせで、高速にカスタムショップを構築できます！

## 実装済みの機能

このプロジェクトには既に以下が実装されています：

### ヘルパー関数（src/utils/shopify.ts）

```typescript
// 商品一覧を取得
fetchShopifyProducts(count: number): Promise<ShopifyProduct[]>

// Product IDで単一商品を取得
fetchProductById(productId: string): Promise<ShopifyProduct | null>

// Handleで商品を取得
fetchProductByHandle(handle: string): Promise<ShopifyProduct | null>

// カート操作
createCart()
addToCart(cartId: string, variantId: string, quantity: number)
updateCartLine(cartId: string, lineId: string, quantity: number)
removeFromCart(cartId: string, lineIds: string[])
getCart(cartId: string)
```

### コンポーネント例

- **StrawberriesPage** ([src/app/components/pages/StrawberriesPage.tsx](src/app/components/pages/StrawberriesPage.tsx))
  - 商品一覧表示
  - variantIdを使ったカート追加
  - 在庫管理

- **ProductDetailPage** ([src/app/components/pages/ProductDetailPage.tsx](src/app/components/pages/ProductDetailPage.tsx))
  - productIdから商品詳細表示
  - バリアント選択
  - カスタムデザイン例

### AI活用の実践

```
@workspace 新しい商品ページを作成して。
Product ID: gid://shopify/Product/123456789 から商品情報を取得して、
農園らしい温かみのあるデザインで表示。
各バリアントのvariantIdを使ってカートに追加できるようにして。
```

このプロンプトで、AIが：
1. `fetchProductById()`を使って商品データを取得
2. カスタムデザインのUIコンポーネントを生成
3. variantIdを正しく使ってカート機能を実装

すべて自動で行います！
