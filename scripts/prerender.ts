#!/usr/bin/env tsx
/**
 * カスタムプリレンダリングスクリプト
 * Viteビルド後にPuppeteerを使って各ルートをHTMLとして保存
 */

import puppeteer from 'puppeteer';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { spawn } from 'child_process';

// プリレンダリング対象の静的ルート
const staticRoutes = [
  '/',
  '/rice',
  '/strawberry-picking',
  '/strawberries',
  '/faq',
  '/contact',
  '/privacy-policy',
  '/terms-of-service',
  '/refund-policy',
  '/shipping-policy',
];

// product-routes.jsonから動的ルートを読み込む
function loadProductRoutes(): string[] {
  const productRoutesPath = resolve(process.cwd(), 'product-routes.json');
  if (!existsSync(productRoutesPath)) {
    return [];
  }

  try {
    const content = readFileSync(productRoutesPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.warn('Failed to load product-routes.json:', error);
    return [];
  }
}

// ローカルサーバーを起動
async function startPreviewServer(): Promise<{ url: string; kill: () => Promise<void> }> {
  return new Promise((resolve, reject) => {
    console.log('🚀 Starting preview server...');
    
    const server = spawn('npx', ['vite', 'preview', '--port', '4173'], {
      stdio: ['inherit', 'pipe', 'pipe'],
    });

    let serverReady = false;
    let serverUrl = '';

    server.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(output);
      
      if (!serverReady && output.includes('http://')) {
        serverReady = true;
        serverUrl = 'http://localhost:4173';
        resolve({
          url: serverUrl,
          kill: async () => {
            return new Promise<void>((resolveKill) => {
              // サーバーが既に終了している場合
              if (server.killed || server.exitCode !== null) {
                resolveKill();
                return;
              }

              // プロセス終了時のハンドラー
              const onExit = () => {
                resolveKill();
              };

              server.once('exit', onExit);
              server.once('close', onExit);

              // まずSIGTERMを送信
              server.kill('SIGTERM');

              // 3秒後にまだ終了していなければSIGKILLを送信
              setTimeout(() => {
                if (!server.killed && server.exitCode === null) {
                  console.log('⚠️  Server did not exit gracefully, forcing...');
                  server.kill('SIGKILL');
                }
              }, 3000);

              // 最大5秒待機
              setTimeout(() => {
                server.removeListener('exit', onExit);
                server.removeListener('close', onExit);
                resolveKill();
              }, 5000);
            });
          },
        });
      }
    });

    server.stderr.on('data', (data) => {
      console.error(data.toString());
    });

    server.on('error', (error) => {
      reject(error);
    });

    // タイムアウト（10秒）
    setTimeout(() => {
      if (!serverReady) {
        server.kill('SIGKILL');
        reject(new Error('Server startup timeout'));
      }
    }, 10000);
  });
}

// HTMLを最適化（不要なスクリプトの削除、メタタグの整理など）
function optimizeHTML(html: string): string {
  let optimized = html;
  
  // 不要な空白を削除
  optimized = optimized.replace(/\n\s*\n/g, '\n');
  
  return optimized;
}

// sitemap.xmlを生成
function generateSitemap(routes: string[], distPath: string): void {
  const baseUrl = 'https://www.tsuru-strawberry-farm.com';
  const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD形式
  
  // URLの優先度とchangefreqを設定
  const getUrlPriority = (route: string): { priority: string; changefreq: string } => {
    if (route === '/') {
      return { priority: '1.0', changefreq: 'daily' };
    }
    if (['/strawberries', '/rice', '/strawberry-picking'].includes(route)) {
      return { priority: '0.9', changefreq: 'weekly' };
    }
    if (['/faq', '/contact'].includes(route)) {
      return { priority: '0.8', changefreq: 'monthly' };
    }
    if (route.startsWith('/product/')) {
      return { priority: '0.7', changefreq: 'weekly' };
    }
    if (['/privacy-policy', '/terms-of-service', '/refund-policy', '/shipping-policy'].includes(route)) {
      return { priority: '0.3', changefreq: 'yearly' };
    }
    return { priority: '0.6', changefreq: 'monthly' };
  };
  
  const urls = routes.map(route => {
    const { priority, changefreq } = getUrlPriority(route);
    // URLの末尾に / を付加（既に / で終わっている場合は追加しない）
    const url = route.endsWith('/') ? route : `${route}/`;
    return `  <url>
    <loc>${baseUrl}${url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }).join('\n');
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  
  const sitemapPath = resolve(distPath, 'sitemap.xml');
  writeFileSync(sitemapPath, sitemap, 'utf-8');
  console.log(`  ✓ Sitemap generated: ${sitemapPath}`);
  console.log(`    Total URLs: ${routes.length}`);
}

// ルートをプリレンダリング
async function prerenderRoute(
  page: puppeteer.Page,
  baseUrl: string,
  route: string,
  distPath: string
): Promise<void> {
  try {
    const url = `${baseUrl}${route}`;
    console.log(`  📄 Rendering: ${route}`);

    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    // 追加の待機時間（JavaScriptの実行を待つ）
    // SEOコンポーネントがメタタグを更新するのを待つ
    await new Promise(resolve => setTimeout(resolve, 3000));

    const html = await page.content();
    
    // HTMLを最適化
    const optimizedHtml = optimizeHTML(html);

    // ファイルパスを決定
    let filePath: string;
    if (route === '/') {
      filePath = resolve(distPath, 'index.html');
    } else {
      const routePath = route.slice(1); // 先頭の / を削除
      const dirPath = resolve(distPath, routePath);
      
      // ディレクトリを作成
      if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true });
      }
      
      filePath = resolve(dirPath, 'index.html');
    }

    // HTMLを保存
    writeFileSync(filePath, optimizedHtml, 'utf-8');
    console.log(`    ✓ Saved to: ${filePath}`);
  } catch (error) {
    console.error(`    ✗ Failed to render ${route}:`, error);
    throw error;
  }
}

async function main() {
  const distPath = resolve(process.cwd(), 'dist');
  
  if (!existsSync(distPath)) {
    console.error('❌ dist directory not found. Please run `npm run build` first.');
    process.exit(1);
  }

  console.log('\n🎨 Starting prerendering...\n');

  // ルートのリストを作成
  const productRoutes = loadProductRoutes();
  const allRoutes = [...staticRoutes, ...productRoutes];
  
  console.log(`📋 Total routes to prerender: ${allRoutes.length}`);
  console.log(`   - Static routes: ${staticRoutes.length}`);
  console.log(`   - Product routes: ${productRoutes.length}\n`);

  // プレビューサーバーを起動
  const server = await startPreviewServer();
  
  // 少し待つ
  await new Promise(resolve => setTimeout(resolve, 2000));

  let browser: puppeteer.Browser | null = null;

  try {
    // Puppeteerを起動
    console.log('\n🤖 Launching Puppeteer...');
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    // 各ルートをプリレンダリング
    console.log('\n📄 Prerendering routes:\n');
    
    for (const route of allRoutes) {
      await prerenderRoute(page, server.url, route, distPath);
    }

    console.log('\n✅ Prerendering completed successfully!');
    console.log(`   Total pages rendered: ${allRoutes.length}\n`);
    
    // sitemap.xmlを生成
    console.log('🗺️  Generating sitemap.xml...\n');
    generateSitemap(allRoutes, distPath);
    
  } catch (error) {
    console.error('\n❌ Prerendering failed:', error);
    
    // クリーンアップしてから終了
    try {
      if (browser) {
        await browser.close();
      }
      await server.kill();
    } catch (cleanupError) {
      console.error('Cleanup error:', cleanupError);
    }
    
    process.exit(1);
  } finally {
    // クリーンアップ
    console.log('🧹 Cleaning up...');
    
    if (browser) {
      await browser.close();
      console.log('  ✓ Browser closed');
    }
    
    await server.kill();
    console.log('  ✓ Server stopped');
    
    console.log('\n✨ Done!\n');
  }
}

main()
  .then(() => {
    console.log('🎉 Prerendering process completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
