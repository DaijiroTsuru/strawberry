// Shopify Storefront API統合用ユーティリティ
// 実際の使用時は、Shopify管理画面から以下を取得してください：
// 1. Storefront API アクセストークン
// 2. ストアドメイン

const SHOPIFY_DOMAIN = 'YOUR_STORE_NAME.myshopify.com';
const STOREFRONT_ACCESS_TOKEN = 'YOUR_STOREFRONT_ACCESS_TOKEN';

export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
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
      };
    }>;
  };
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
              }
            }
          }
        }
      }
    }
  }
`;

// Shopify APIへのリクエスト関数
export async function fetchShopifyProducts(count: number = 10): Promise<ShopifyProduct[]> {
  try {
    const response = await fetch(`https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query: PRODUCTS_QUERY,
        variables: { first: count },
      }),
    });

    const { data } = await response.json();
    return data.products.edges.map((edge: any) => edge.node);
  } catch (error) {
    console.error('Shopify API Error:', error);
    // エラー時はモックデータを返す
    return getMockProducts();
  }
}

// モックデータ（開発・デモ用）
export function getMockProducts(): ShopifyProduct[] {
  return [
    {
      id: 'gid://shopify/Product/1',
      title: 'あまおう（特大サイズ）',
      description: '福岡県産の最高級ブランドいちご。大粒で甘みが強く、贈答用に最適です。',
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
            },
          },
        ],
      },
    },
    {
      id: 'gid://shopify/Product/2',
      title: 'とちおとめ（大サイズ）',
      description: '栃木県を代表する品種。程よい酸味と甘みのバランスが絶妙です。',
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
            },
          },
        ],
      },
    },
    {
      id: 'gid://shopify/Product/3',
      title: '紅ほっぺ（中サイズ）',
      description: '静岡県生まれの人気品種。鮮やかな紅色と豊かな香りが特徴です。',
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
            },
          },
        ],
      },
    },
    {
      id: 'gid://shopify/Product/4',
      title: 'いちごジャム（自家製）',
      description: '完熟いちごをたっぷり使用した無添加ジャム。朝食に最適です。',
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
            },
          },
        ],
      },
    },
  ];
}

// 価格のフォーマット関数
export function formatPrice(amount: string, currencyCode: string = 'JPY'): string {
  const price = parseFloat(amount);
  if (currencyCode === 'JPY') {
    return `¥${price.toLocaleString('ja-JP')}`;
  }
  return `${price.toLocaleString()} ${currencyCode}`;
}
