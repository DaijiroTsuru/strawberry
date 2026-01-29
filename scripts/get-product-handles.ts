#!/usr/bin/env tsx
/**
 * Shopify商品のhandleを取得してproduct-routes.jsonに出力するスクリプト
 * プリレンダリング用に動的ルートのリストを生成します
 */

import { config } from 'dotenv';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

// .envファイルから環境変数を読み込む
config();

// Shopify Storefront API設定
const SHOPIFY_DOMAIN = process.env.VITE_SHOPIFY_STORE_DOMAIN;
const STOREFRONT_ACCESS_TOKEN = process.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const API_VERSION = '2026-01';

interface ProductNode {
  handle: string;
  title: string;
}

// すべての商品のhandleを取得するGraphQLクエリ
const ALL_PRODUCTS_QUERY = `
  query GetAllProductHandles($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          handle
          title
        }
      }
    }
  }
`;

async function shopifyFetch<T>(query: string, variables: Record<string, any> = {}): Promise<T> {
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
    throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  
  if (json.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
  }

  return json.data;
}

async function fetchAllProductHandles(): Promise<string[]> {
  const handles: string[] = [];
  let hasNextPage = true;
  let cursor: string | null = null;
  const pageSize = 250; // Shopifyの最大ページサイズ

  console.log('📦 Fetching product handles from Shopify...');

  while (hasNextPage) {
    const variables: Record<string, any> = { first: pageSize };
    if (cursor) {
      variables.after = cursor;
    }

    const data = await shopifyFetch<{
      products: {
        pageInfo: { hasNextPage: boolean; endCursor: string };
        edges: Array<{ node: ProductNode }>;
      };
    }>(ALL_PRODUCTS_QUERY, variables);

    const products = data.products.edges.map(edge => edge.node);
    handles.push(...products.map(p => p.handle));

    console.log(`  ✓ Fetched ${products.length} products (total: ${handles.length})`);

    hasNextPage = data.products.pageInfo.hasNextPage;
    cursor = data.products.pageInfo.endCursor;
  }

  return handles;
}

async function main() {
  try {
    console.log('🚀 Starting product handles fetch...\n');

    // Shopify認証情報がない場合は空の配列を出力
    if (!SHOPIFY_DOMAIN || !STOREFRONT_ACCESS_TOKEN) {
      console.warn('⚠️  Shopify credentials not configured');
      console.warn('   Skipping product routes generation (only static routes will be prerendered)');
      
      const outputPath = resolve(process.cwd(), 'product-routes.json');
      writeFileSync(outputPath, JSON.stringify([], null, 2));
      console.log(`   Generated empty product-routes.json\n`);
      return;
    }

    // Shopify APIから商品handle一覧を取得
    const handles = await fetchAllProductHandles();

    // ルートのパスに変換
    const routes = handles.map(handle => `/product/${handle}`);

    // JSONファイルに出力
    const outputPath = resolve(process.cwd(), 'product-routes.json');
    writeFileSync(outputPath, JSON.stringify(routes, null, 2));

    console.log(`\n✅ Successfully generated product routes!`);
    console.log(`   Total products: ${handles.length}`);
    console.log(`   Output file: ${outputPath}`);
    
    // 最初の5つを表示
    if (routes.length > 0) {
      console.log('\n📄 Sample routes:');
      routes.slice(0, 5).forEach(route => console.log(`   - ${route}`));
      if (routes.length > 5) {
        console.log(`   ... and ${routes.length - 5} more`);
      }
    }
  } catch (error) {
    console.error('\n❌ Error generating product routes:', error);
    
    // エラー時は空の配列を出力（ビルドを継続させるため）
    const outputPath = resolve(process.cwd(), 'product-routes.json');
    writeFileSync(outputPath, JSON.stringify([], null, 2));
    console.log('\n⚠️  Generated empty product-routes.json to allow build to continue\n');
  }
}

main();
