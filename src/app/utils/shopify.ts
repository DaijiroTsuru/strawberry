// Shopify Storefront API用のヘルパー関数

// 環境変数からShopify設定を取得
const SHOPIFY_STORE_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || 'your-store.myshopify.com';
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';

// Shopify Storefront APIのエンドポイント
const SHOPIFY_GRAPHQL_URL = `https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`;

// GraphQLクエリを実行
async function shopifyFetch<T>(query: string, variables = {}): Promise<T> {
  try {
    const response = await fetch(SHOPIFY_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.statusText}`);
    }

    const json = await response.json();
    
    if (json.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
    }

    return json.data;
  } catch (error) {
    console.error('Shopify fetch error:', error);
    throw error;
  }
}

// 商品情報を取得
export async function getProduct(productId: string) {
  const query = `
    query getProduct($id: ID!) {
      product(id: $id) {
        id
        title
        description
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
        variants(first: 1) {
          edges {
            node {
              id
              title
              priceV2 {
                amount
                currencyCode
              }
              availableForSale
            }
          }
        }
      }
    }
  `;

  return shopifyFetch<{ product: any }>(query, { id: productId });
}

// 複数の商品情報を取得
export async function getProducts(productIds: string[]) {
  const query = `
    query getProducts($ids: [ID!]!) {
      nodes(ids: $ids) {
        ... on Product {
          id
          title
          description
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
          variants(first: 1) {
            edges {
              node {
                id
                title
                priceV2 {
                  amount
                  currencyCode
                }
                availableForSale
              }
            }
          }
        }
      }
    }
  `;

  return shopifyFetch<{ nodes: any[] }>(query, { ids: productIds });
}

// カートを作成
export async function createCart(variantId: string, quantity: number) {
  const query = `
    mutation createCart($input: CartInput!) {
      cartCreate(input: $input) {
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
                    priceV2 {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
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

  const variables = {
    input: {
      lines: [
        {
          merchandiseId: variantId,
          quantity,
        },
      ],
    },
  };

  return shopifyFetch<{ cartCreate: any }>(query, variables);
}

// カートに商品を追加
export async function addToCart(cartId: string, variantId: string, quantity: number) {
  const query = `
    mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
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
                    priceV2 {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
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

  const variables = {
    cartId,
    lines: [
      {
        merchandiseId: variantId,
        quantity,
      },
    ],
  };

  return shopifyFetch<{ cartLinesAdd: any }>(query, variables);
}

// 全商品を取得（コレクション別）
export async function getProductsByCollection(collectionHandle: string, first = 10) {
  const query = `
    query getProductsByCollection($handle: String!, $first: Int!) {
      collection(handle: $handle) {
        title
        products(first: $first) {
          edges {
            node {
              id
              title
              description
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
              variants(first: 1) {
                edges {
                  node {
                    id
                    title
                    priceV2 {
                      amount
                      currencyCode
                    }
                    availableForSale
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  return shopifyFetch<{ collection: any }>(query, { handle: collectionHandle, first });
}

// 価格をフォーマット
export function formatPrice(amount: string | number, currencyCode = 'JPY'): string {
  const price = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (currencyCode === 'JPY') {
    return `¥${price.toLocaleString('ja-JP')}`;
  }
  
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: currencyCode,
  }).format(price);
}
