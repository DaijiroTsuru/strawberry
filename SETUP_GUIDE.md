# 津留いちご園 ホームページ - 設定ガイド

## 概要
このホームページは3つの異なるデザインテイストを持っています：
- **モダンデザイン** (`designType: 'modern'`): 鮮やか・ダイナミック
- **和風デザイン** (`designType: 'japanese'`): 伝統的・上品
- **ナチュラルデザイン** (`designType: 'natural'`): 自然派・温かみ

`/src/app/App.tsx`の`designType`を変更することで、デザインを切り替えられます。

## 必要な設定

### 1. Google Maps API設定

#### Google Maps APIキーの取得
1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成（または既存のプロジェクトを選択）
3. 「APIとサービス」→「ライブラリ」から「Maps Embed API」を有効化
4. 「APIとサービス」→「認証情報」でAPIキーを作成
5. APIキーの使用を制限（HTTPリファラーで自サイトのドメインを指定）

#### 環境変数の設定
`.env.example`をコピーして`.env`ファイルを作成：
```bash
cp .env.example .env
```

`.env`ファイルに取得したAPIキーを設定：
```
VITE_GOOGLE_MAPS_API_KEY=YOUR_ACTUAL_API_KEY_HERE
```

### 2. Shopify設定

#### Shopifyストアの準備
1. Shopifyアカウントにログイン
2. 「設定」→「アプリと販売チャネル」→「アプリとチャネルを開発する」
3. 「アプリを作成」をクリック
4. アプリ名を入力（例：「津留いちご園 ホームページ」）

#### Storefront APIアクセストークンの取得
1. 作成したアプリの設定画面を開く
2. 「設定」→「Storefront API」
3. 「Storefront API アクセストークン」を生成
4. 必要な権限を選択：
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_read_checkouts`
   - `unauthenticated_write_checkouts`

#### 環境変数の設定
`.env`ファイルにShopify情報を追加：
```
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=YOUR_ACTUAL_TOKEN_HERE
```

#### Shopifyで商品を作成
1. Shopifyダッシュボードで「商品」→「商品を追加」
2. 各商品の情報を入力：
   - 商品名
   - 説明
   - 価格
   - 在庫
   - 商品画像

3. 商品IDを取得してコードに反映：
   - Storefront API経由で商品IDを取得（GraphQLで`gid://shopify/Product/[ID]`形式）
   - `/src/app/constants/farmInfo.ts`の`PRODUCTS`配列の`shopifyId`フィールドを更新

例：
```typescript
{
  id: 'premium-strawberry-500g',
  shopifyId: 'gid://shopify/Product/1234567890', // ← ここに実際のShopify商品IDを設定
  name: '厳選いちご（特秀）500g',
  // ...
}
```

### 3. 商品画像のアップロード

Shopifyに商品画像をアップロードすると、自動的にStorefront API経由で取得できます。

または、画像を直接ホスティングする場合：
1. 画像を`/public/images/`フォルダに配置
2. `/src/app/constants/farmInfo.ts`の`image`フィールドを更新

## 農園情報のカスタマイズ

農園の実際の情報は`/src/app/constants/farmInfo.ts`に集約されています。

### 更新可能な情報
- 農園名、住所、連絡先
- いちご狩り料金
- 商品情報と価格
- 送料設定
- その他農園の特徴

## デプロイ

### ビルド
```bash
npm run build
```

### プレビュー
```bash
npm run preview
```

### 本番環境へのデプロイ
- Vercel、Netlify、またはその他のホスティングサービスにデプロイ
- 環境変数を本番環境で設定することを忘れずに

## トラブルシューティング

### Google Mapsが表示されない
- APIキーが正しく設定されているか確認
- Google Cloud ConsoleでMaps Embed APIが有効化されているか確認
- APIキーの使用制限が正しく設定されているか確認

### Shopify商品が取得できない
- Storefront APIアクセストークンが正しく設定されているか確認
- 商品が「オンラインストア」で公開されているか確認
- CORSエラーが発生していないか確認

## サポート

ご不明な点がございましたら、以下までお問い合わせください：
- メール: tsuruichigoen@herb.ocn.ne.jp
- 電話: 0942-53-1038
