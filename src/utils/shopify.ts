/// <reference types="../vite-env" />

// Shopify Storefront API統合用ユーティリティ（2026-01バージョン）
// セットアップ方法は guides/SHOPIFY_SETUP.md を参照してください

const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const STOREFRONT_ACCESS_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const API_VERSION = '2026-01';

if (!SHOPIFY_DOMAIN || !STOREFRONT_ACCESS_TOKEN) {
  console.warn('Shopify credentials not configured. Using mock data.');
}

// 型定義
export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  descriptionHtml: string;
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
        id: string;
        title: string;
        priceV2: {
          amount: string;
          currencyCode: string;
        };
        availableForSale: boolean;
        quantityAvailable?: number;
      };
    }>;
  };
  collections?: {
    edges: Array<{
      node: {
        id: string;
        handle: string;
        title: string;
      };
    }>;
  };
}

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
  };
}

// GraphQLクエリヘルパー関数
async function shopifyFetch({
  query,
  variables = {},
}: {
  query: string;
  variables?: Record<string, any>;
}) {
  if (!SHOPIFY_DOMAIN || !STOREFRONT_ACCESS_TOKEN) {
    throw new Error('Shopify credentials not configured');
  }

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

  const json = await response.json();

  if (json.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
  }

  return json;
}

// Shopify Storefront APIへのGraphQLクエリ
const PRODUCTS_QUERY = `
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
                priceV2 {
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

// 商品一覧を取得
export async function fetchShopifyProducts(count: number = 10): Promise<ShopifyProduct[]> {
  try {
    const { data } = await shopifyFetch({
      query: PRODUCTS_QUERY,
      variables: { first: count },
    });

    return data.products.edges.map((edge: any) => edge.node);
  } catch (error) {
    console.error('Shopify API Error:', error);
    // エラー時はモックデータを返す
    return getMockProducts();
  }
}

// Product IDで単一商品を取得（AIカスタムショップ用）
export async function fetchProductById(productId: string): Promise<ShopifyProduct | null> {
  const query = `
    query GetProduct($id: ID!) {
      product(id: $id) {
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
        images(first: 10) {
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
              priceV2 {
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
  `;

  try {
    const { data } = await shopifyFetch({
      query,
      variables: { id: productId },
    });

    return data.product;
  } catch (error) {
    console.error('Fetch product by ID error:', error);
    // エラー時はモックデータから探す
    const mockProducts = getMockProducts();
    return mockProducts.find(p => p.id === productId) || null;
  }
}

// Handle（URL slug）で商品を取得（AIカスタムショップ用）
export async function fetchProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const query = `
    query GetProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        description
        descriptionHtml
        handle
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 10) {
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
              priceV2 {
                amount
                currencyCode
              }
              availableForSale
              quantityAvailable
            }
          }
        }
        collections(first: 5) {
          edges {
            node {
              id
              handle
              title
            }
          }
        }
      }
    }
  `;

  try {
    const { data } = await shopifyFetch({
      query,
      variables: { handle },
    });

    return data.productByHandle;
  } catch (error) {
    console.error('Fetch product by handle error:', error);
    // エラー時はモックデータから探す
    const mockProducts = getMockProducts();
    return mockProducts.find(p => p.handle === handle) || null;
  }
}

// Collection IDから商品一覧を取得（AIカスタムショップ用）
export async function fetchProductsByCollectionId(
  collectionId: string,
  count: number = 10
): Promise<ShopifyProduct[]> {
  const query = `
    query GetProductsByCollection($id: ID!, $first: Int!) {
      collection(id: $id) {
        id
        title
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
                    priceV2 {
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
    }
  `;

  try {
    // Collection IDをShopify GIDフォーマットに変換
    const gid = collectionId.includes('gid://shopify')
      ? collectionId
      : `gid://shopify/Collection/${collectionId}`;

    const { data } = await shopifyFetch({
      query,
      variables: { id: gid, first: count },
    });

    if (!data.collection) {
      console.warn(`Collection not found: ${collectionId}`);
      return getMockProducts();
    }

    return data.collection.products.edges.map((edge: any) => edge.node);
  } catch (error) {
    console.error('Fetch products by collection ID error:', error);
    // エラー時はモックデータを返す
    return getMockProducts();
  }
}

// カートを作成
export async function createCart(note?: string) {
  const query = `
    mutation CreateCart($input: CartInput) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
          note
          lines(first: 10) {
            edges {
              node {
                id
                quantity
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

  try {
    const variables = note ? { input: { note } } : {};
    const { data } = await shopifyFetch({ query, variables });
    if (data.cartCreate.userErrors.length > 0) {
      throw new Error(data.cartCreate.userErrors[0].message);
    }
    return data.cartCreate.cart;
  } catch (error) {
    console.error('Create cart error:', error);
    throw error;
  }
}

// カートに商品を追加
export async function addToCart(
  cartId: string,
  merchandiseId: string,
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
                    priceV2 {
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
          cost {
            totalAmount {
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

  try {
    const { data } = await shopifyFetch({
      query,
      variables: {
        cartId,
        lines: [{ merchandiseId, quantity }],
      },
    });

    if (data.cartLinesAdd.userErrors.length > 0) {
      throw new Error(data.cartLinesAdd.userErrors[0].message);
    }

    return data.cartLinesAdd.cart;
  } catch (error) {
    console.error('Add to cart error:', error);
    throw error;
  }
}

// カート内の商品を更新
export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number
) {
  const query = `
    mutation UpdateCartLine($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          lines(first: 10) {
            edges {
              node {
                id
                quantity
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

  try {
    const { data } = await shopifyFetch({
      query,
      variables: {
        cartId,
        lines: [{ id: lineId, quantity }],
      },
    });

    if (data.cartLinesUpdate.userErrors.length > 0) {
      throw new Error(data.cartLinesUpdate.userErrors[0].message);
    }

    return data.cartLinesUpdate.cart;
  } catch (error) {
    console.error('Update cart line error:', error);
    throw error;
  }
}

// カート内の商品を削除
export async function removeFromCart(cartId: string, lineIds: string[]) {
  const query = `
    mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
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
                    product {
                      title
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

  try {
    const { data } = await shopifyFetch({
      query,
      variables: { cartId, lineIds },
    });

    if (data.cartLinesRemove.userErrors.length > 0) {
      throw new Error(data.cartLinesRemove.userErrors[0].message);
    }

    return data.cartLinesRemove.cart;
  } catch (error) {
    console.error('Remove from cart error:', error);
    throw error;
  }
}

// カート情報を取得
export async function getCart(cartId: string) {
  const query = `
    query GetCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        note
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
                  product {
                    title
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
    }
  `;

  try {
    const { data } = await shopifyFetch({
      query,
      variables: { cartId },
    });

    return data.cart;
  } catch (error) {
    console.error('Get cart error:', error);
    throw error;
  }
}

// カートのnoteを更新
export async function updateCartNote(cartId: string, note: string) {
  const query = `
    mutation UpdateCartNote($cartId: ID!, $note: String!) {
      cartNoteUpdate(cartId: $cartId, note: $note) {
        cart {
          id
          note
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
                    product {
                      title
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

  try {
    const { data } = await shopifyFetch({
      query,
      variables: { cartId, note },
    });

    if (data.cartNoteUpdate.userErrors.length > 0) {
      throw new Error(data.cartNoteUpdate.userErrors[0].message);
    }

    return data.cartNoteUpdate.cart;
  } catch (error) {
    console.error('Update cart note error:', error);
    throw error;
  }
}

// モックデータ（開発・デモ用）
export function getMockProducts(): ShopifyProduct[] {
  return [
    {
      id: 'gid://shopify/Product/1',
      title: 'あまおう（特大サイズ）',
      description: '福岡県産の最高級ブランドいちご。大粒で甘みが強く、贈答用に最適です。',
      handle: 'amaou-large',
      priceRange: {
        minVariantPrice: {
          amount: '3800',
          currencyCode: 'JPY',
        },
      },
      images: {
        edges: [
          {
            node: {
              url: 'https://images.unsplash.com/photo-1559483526-22d5a63adc24?w=800',
              altText: 'あまおう特大サイズ',
            },
          },
        ],
      },
      variants: {
        edges: [
          {
            node: {
              id: 'gid://shopify/ProductVariant/1',
              title: '500g',
              priceV2: {
                amount: '3800',
                currencyCode: 'JPY',
              },
              availableForSale: true,
              quantityAvailable: 10,
            },
          },
        ],
      },
    },
    {
      id: 'gid://shopify/Product/2',
      title: 'とちおとめ（大サイズ）',
      description: '栃木県を代表する品種。程よい酸味と甘みのバランスが絶妙です。',
      handle: 'tochiotome-large',
      priceRange: {
        minVariantPrice: {
          amount: '2800',
          currencyCode: 'JPY',
        },
      },
      images: {
        edges: [
          {
            node: {
              url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800',
              altText: 'とちおとめ大サイズ',
            },
          },
        ],
      },
      variants: {
        edges: [
          {
            node: {
              id: 'gid://shopify/ProductVariant/2',
              title: '400g',
              priceV2: {
                amount: '2800',
                currencyCode: 'JPY',
              },
              availableForSale: true,
              quantityAvailable: 15,
            },
          },
        ],
      },
    },
    {
      id: 'gid://shopify/Product/3',
      title: '紅ほっぺ（中サイズ）',
      description: '静岡県生まれの人気品種。鮮やかな紅色と豊かな香りが特徴です。',
      handle: 'benihoppe-medium',
      priceRange: {
        minVariantPrice: {
          amount: '2200',
          currencyCode: 'JPY',
        },
      },
      images: {
        edges: [
          {
            node: {
              url: 'https://images.unsplash.com/photo-1518635017498-87f514b751ba?w=800',
              altText: '紅ほっぺ中サイズ',
            },
          },
        ],
      },
      variants: {
        edges: [
          {
            node: {
              id: 'gid://shopify/ProductVariant/3',
              title: '300g',
              priceV2: {
                amount: '2200',
                currencyCode: 'JPY',
              },
              availableForSale: true,
              quantityAvailable: 20,
            },
          },
        ],
      },
    },
    {
      id: 'gid://shopify/Product/4',
      title: 'いちごジャム（自家製）',
      description: '完熟いちごをたっぷり使用した無添加ジャム。朝食に最適です。',
      handle: 'strawberry-jam',
      priceRange: {
        minVariantPrice: {
          amount: '1200',
          currencyCode: 'JPY',
        },
      },
      images: {
        edges: [
          {
            node: {
              url: 'https://images.unsplash.com/photo-1599844873874-f5faa58aec8f?w=800',
              altText: '自家製いちごジャム',
            },
          },
        ],
      },
      variants: {
        edges: [
          {
            node: {
              id: 'gid://shopify/ProductVariant/4',
              title: '200g',
              priceV2: {
                amount: '1200',
                currencyCode: 'JPY',
              },
              availableForSale: true,
              quantityAvailable: 30,
            },
          },
        ],
      },
    },
  ];
}

// ポリシー型定義
export interface ShopPolicy {
  title: string;
  body: string;
  handle: string;
  url?: string;
}

export interface ShopPolicies {
  privacyPolicy: ShopPolicy | null;
  refundPolicy: ShopPolicy | null;
  termsOfService: ShopPolicy | null;
  shippingPolicy: ShopPolicy | null;
}

// ポリシー取得用のGraphQLクエリ
const SHOP_POLICIES_QUERY = `
  query GetShopPolicies {
    shop {
      privacyPolicy {
        title
        body
        handle
        url
      }
      refundPolicy {
        title
        body
        handle
        url
      }
      termsOfService {
        title
        body
        handle
        url
      }
      shippingPolicy {
        title
        body
        handle
        url
      }
    }
  }
`;

// Shopifyから店舗のポリシーを取得
export async function fetchShopPolicies(): Promise<ShopPolicies> {
  try {
    const { data } = await shopifyFetch({
      query: SHOP_POLICIES_QUERY,
      variables: {},
    });

    return {
      privacyPolicy: data.shop.privacyPolicy,
      refundPolicy: data.shop.refundPolicy,
      termsOfService: data.shop.termsOfService,
      shippingPolicy: data.shop.shippingPolicy,
    };
  } catch (error) {
    console.error('Shopify Policies API Error:', error);
    // エラー時は空のポリシーを返す
    return {
      privacyPolicy: null,
      refundPolicy: null,
      termsOfService: null,
      shippingPolicy: null,
    };
  }
}

// 価格のフォーマット関数
export function formatPrice(amount: string, currencyCode: string = 'JPY'): string {
  const price = parseFloat(amount);
  if (currencyCode === 'JPY') {
    return `¥${price.toLocaleString('ja-JP')}`;
  }
  return `${price.toLocaleString()} ${currencyCode}`;
}
