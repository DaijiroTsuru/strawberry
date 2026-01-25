# GitHub Pages デプロイガイド

このガイドでは、津留いちご園のWebサイトをGitHub Pagesにデプロイする方法を説明します。

## 📋 前提条件

- GitHubアカウントを持っていること
- プロジェクトがGitHubリポジトリに配置されていること
- 環境変数が設定されていること（EmailJS、Shopify、Google Places API）

## 🚀 GitHub Actionsを使用したデプロイ

### ステップ1: GitHub Secretsの設定

GitHubリポジトリで環境変数をSecretsとして設定します。

1. GitHubリポジトリの **Settings** → **Secrets and variables** → **Actions** を開く
2. 「New repository secret」をクリックし、以下のSecretsを追加:

#### EmailJS設定
- **Name**: `VITE_EMAILJS_SERVICE_ID`
- **Value**: EmailJSのService ID

- **Name**: `VITE_EMAILJS_TEMPLATE_ID`
- **Value**: EmailJSのTemplate ID

- **Name**: `VITE_EMAILJS_PUBLIC_KEY`
- **Value**: EmailJSのPublic Key

#### reCAPTCHA設定（お問い合わせフォームのスパム対策）
- **Name**: `VITE_RECAPTCHA_SITE_KEY`
- **Value**: reCAPTCHA v3のサイトキー

#### Shopify設定
- **Name**: `VITE_SHOPIFY_STORE_DOMAIN`
- **Value**: `your-store.myshopify.com`

- **Name**: `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN`
- **Value**: ShopifyのStorefront API Token

#### Google Places API設定
- **Name**: `VITE_GOOGLE_PLACES_API_KEY`
- **Value**: Google Places APIキー

- **Name**: `VITE_GOOGLE_PLACE_ID`
- **Value**: GoogleのPlace ID

### ステップ2: GitHub Actionsワークフローの作成

プロジェクトのルートに `.github/workflows/deploy.yml` ファイルを作成:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        env:
          # EmailJS設定
          VITE_EMAILJS_SERVICE_ID: ${{ secrets.VITE_EMAILJS_SERVICE_ID }}
          VITE_EMAILJS_TEMPLATE_ID: ${{ secrets.VITE_EMAILJS_TEMPLATE_ID }}
          VITE_EMAILJS_PUBLIC_KEY: ${{ secrets.VITE_EMAILJS_PUBLIC_KEY }}
          # reCAPTCHA設定
          VITE_RECAPTCHA_SITE_KEY: ${{ secrets.VITE_RECAPTCHA_SITE_KEY }}
          # Shopify設定
          VITE_SHOPIFY_STORE_DOMAIN: ${{ secrets.VITE_SHOPIFY_STORE_DOMAIN }}
          VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN: ${{ secrets.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN }}
          # Google Places API設定
          VITE_GOOGLE_PLACES_API_KEY: ${{ secrets.VITE_GOOGLE_PLACES_API_KEY }}
          VITE_GOOGLE_PLACE_ID: ${{ secrets.VITE_GOOGLE_PLACE_ID }}
        run: npm run build
        
      - name: Setup Pages
        uses: actions/configure-pages@v4
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
          
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### ステップ3: GitHub Pagesの有効化

1. GitHubリポジトリの **Settings** → **Pages** を開く
2. **Source** で「GitHub Actions」を選択
3. 設定を保存

### ステップ4: デプロイの実行

#### 自動デプロイ
`main` ブランチにプッシュすると自動的にデプロイされます:

```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

#### 手動デプロイ
GitHubリポジトリの **Actions** タブから手動でワークフローを実行できます。

### ステップ5: デプロイの確認

1. GitHubリポジトリの **Actions** タブを開く
2. 最新のワークフローの実行状態を確認
3. 緑色のチェックマークが表示されたら成功
4. デプロイされたサイトのURLは `https://<username>.github.io/<repository>/`

## 🔧 vite.config.ts の設定

GitHub Pagesでサブディレクトリにデプロイする場合、`vite.config.ts` の `base` を設定します:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/repository-name/', // リポジトリ名を設定
  // または、ルートドメインの場合は '/'
})
```

**注意**: カスタムドメインを使用する場合は `base: '/'` のままでOKです。

## 🌐 カスタムドメインの設定（オプション）

### ステップ1: CNAMEファイルの作成

`public/CNAME` ファイルを作成し、カスタムドメインを記載:

```
www.tsuru-ichigo.com
```

### ステップ2: DNSの設定

ドメインレジストラで以下のDNS設定を追加:

#### Aレコード（apex domain用）
```
@   A   185.199.108.153
@   A   185.199.109.153
@   A   185.199.110.153
@   A   185.199.111.153
```

#### CNAMEレコード（www用）
```
www   CNAME   <username>.github.io.
```

### ステップ3: GitHub Pagesでカスタムドメインを設定

1. GitHubリポジトリの **Settings** → **Pages** を開く
2. **Custom domain** に `www.tsuru-ichigo.com` を入力
3. **Enforce HTTPS** にチェック（DNS設定後に有効化）

## 🐛 トラブルシューティング

### ビルドが失敗する

**原因**: 環境変数が設定されていない、または依存関係のインストールに失敗

**解決方法**:
1. GitHub Secretsが正しく設定されているか確認
2. Actionsタブでビルドログを確認
3. ローカルで `npm run build` が成功するか確認

### 404エラーが表示される

**原因**: ルーティングの設定やbase pathが正しくない

**解決方法**:
1. `vite.config.ts` の `base` 設定を確認
2. SPAの場合、`public/404.html` を作成してリダイレクト設定を追加
3. TanStack Routerの場合、`basename` 設定を確認

### 環境変数が反映されない

**原因**: ビルド時に環境変数が埋め込まれていない

**解決方法**:
1. GitHub Secretsの名前が `VITE_` プレフィックスで始まっているか確認
2. ワークフローファイルの `env` セクションで環境変数が設定されているか確認
3. ビルドログで環境変数が読み込まれているか確認

### EmailJSでForbiddenエラー

**原因**: Allowed Domainsが設定されていない

**解決方法**:
1. EmailJSダッシュボードの **Security** → **Allowed Domains** を確認
2. GitHub Pagesのドメインまたはカスタムドメインを追加:
   ```
   <username>.github.io
   www.tsuru-ichigo.com
   ```

### Shopify APIがエラーを返す

**原因**: Shopify Storefront APIのドメイン制限

**解決方法**:
1. Shopify管理画面で「Headless」チャネルを確認
2. ストアフロントのドメイン設定にGitHub Pagesのドメインを追加

## 📊 デプロイ後の確認事項

- [ ] サイトが正しく表示される
- [ ] すべてのページにアクセスできる
- [ ] お問い合わせフォームが動作する
- [ ] Shopifyの商品が表示される
- [ ] カート機能が動作する
- [ ] Googleレビューが表示される
- [ ] 画像やアセットが正しく読み込まれる
- [ ] HTTPSが有効になっている

## 🔄 更新とメンテナンス

### コンテンツの更新

1. ローカルで変更を加える
2. `main` ブランチにプッシュ
3. GitHub Actionsが自動的にビルド＆デプロイ
4. 数分後にサイトが更新される

### Googleレビューの更新

レビューはビルド時に自動取得されるため、デプロイのたびに最新のレビューが反映されます。

### キャッシュのクリア

ブラウザキャッシュが原因で変更が反映されない場合:
- `Ctrl + F5` (Windows) / `Cmd + Shift + R` (Mac) で強制リロード

## 📚 参考リンク

- [GitHub Pages公式ドキュメント](https://docs.github.com/pages)
- [GitHub Actions環境変数](https://docs.github.com/actions/learn-github-actions/variables)
- [Vite本番環境へのデプロイ](https://vitejs.dev/guide/static-deploy.html#github-pages)
- [カスタムドメインの設定](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site)
