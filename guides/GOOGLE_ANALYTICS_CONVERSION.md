# Google Analytics コンバージョン設定ガイド

このドキュメントでは、津留いちご園のウェブサイトにおけるGoogle Analyticsのコンバージョン設定方法を説明します。

## 目次

1. [実装済みのトラッキング](#実装済みのトラッキング)
2. [GA4でのコンバージョン設定手順](#ga4でのコンバージョン設定手順)
3. [Shopify購入完了のトラッキング](#shopify購入完了のトラッキング)
4. [確認方法](#確認方法)

---

## 実装済みのトラッキング

以下のイベントが自動的にGoogle Analyticsに送信されるように実装されています：

### 1. お問い合わせフォーム送信
- **イベント名**: `contact_form_submit` および `generate_lead`
- **送信タイミング**: お問い合わせフォームの送信が成功したとき
- **パラメータ**:
  - `event_category`: engagement
  - `event_label`: お問い合わせの件名
  - `value`: 1

### 2. カート追加
- **イベント名**: `add_to_cart`
- **送信タイミング**: 商品を購入ボタンをクリックしたとき
- **パラメータ**:
  - `event_category`: ecommerce
  - `event_label`: 商品名
  - `value`: 商品価格
  - `currency`: JPY
  - `items`: 商品情報の配列

### 3. チェックアウト開始
- **イベント名**: `begin_checkout`
- **送信タイミング**: Shopifyのチェックアウトページに遷移する直前
- **パラメータ**:
  - `event_category`: ecommerce
  - `items`: 商品情報の配列

---

## GA4でのコンバージョン設定手順

### ステップ1: Google Analytics 4 にログイン

1. [Google Analytics](https://analytics.google.com/)にアクセス
2. 該当するプロパティ（測定ID: `G-V0M4G7XVPQ`）を選択

### ステップ2: イベントをコンバージョンとしてマーク

1. 左メニューから **「管理」** をクリック
2. **「データの表示」** セクションで **「イベント」** をクリック
3. 以下のイベントを見つけて、右側のスイッチをONにします：
   - `generate_lead` （お問い合わせフォーム送信）
   - `purchase` （Shopify購入完了 - 後述の設定が必要）

### ステップ3: コンバージョンの確認

1. 左メニューから **「レポート」** → **「エンゲージメント」** → **「コンバージョン」** を選択
2. マークしたイベントがコンバージョンとして表示されることを確認

---

## Shopify購入完了のトラッキング

Shopifyのサンクスページ（購入完了ページ）でコンバージョンを追跡するには、Shopifyの公式アプリを使用する方法が最も簡単で推奨されています。

### 方法1: Google & YouTube アプリを使用（推奨）

Shopify公式の「Google & YouTube」アプリを使用することで、Google AnalyticsとShopifyを簡単に連携できます。

#### 手順:

1. **Shopify管理画面にログイン**

2. **アプリを追加**
   - 左メニューから **「アプリ」** をクリック
   - 「アプリを検索」ボタンをクリック
   - **「Google & YouTube」** を検索（Shopify公式アプリ）
   - 「アプリを追加」をクリック

3. **Google アカウントと接続**
   - 「Googleアカウントに接続」をクリック
   - Google Analyticsを使用しているGoogleアカウントでログイン
   - 必要な権限を許可

4. **Google Analytics プロパティを選択**
   - アプリの設定画面で「Google Analytics」セクションを開く
   - 測定ID `G-V0M4G7XVPQ` に対応するプロパティを選択
   - 「接続」をクリック

5. **コンバージョンの自動トラッキングを有効化**
   - 「コンバージョン追跡」のトグルをONにする
   - 以下のイベントが自動的にトラッキングされます：
     - `view_item` (商品閲覧)
     - `add_to_cart` (カート追加)
     - `begin_checkout` (チェックアウト開始)
     - `purchase` (購入完了)
     - その他のeコマースイベント

6. **設定を保存**

#### メリット:

- ✅ コードの記述が不要
- ✅ Shopify公式アプリなので安心
- ✅ 自動的に最新のGA4仕様に対応
- ✅ 商品データが自動的に連携される
- ✅ Google Adsとの連携も可能
- ✅ Google Merchant Centerとの連携も可能

### 方法2: Shopify Pixelを使用（中級者向け）

Shopify Pixel（カスタムピクセル）を使用して、より詳細なカスタマイズが可能です。

#### 手順:

1. **Shopify管理画面** → **「設定」** → **「カスタマーイベント」**

2. **「カスタムピクセルを追加」** をクリック

3. **ピクセル名を入力** （例: "Google Analytics GA4"）

4. **以下のコードを貼り付け**:

```javascript
// Google Analytics GA4 Custom Pixel
(function() {
  const measurementId = 'G-V0M4G7XVPQ';
  
  // GA4スクリプトを読み込み
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.async = true;
  document.head.appendChild(script);
  
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', measurementId);
  
  // Shopifyイベントをリッスン
  analytics.subscribe('checkout_completed', (event) => {
    const checkout = event.data.checkout;
    
    gtag('event', 'purchase', {
      transaction_id: checkout.order.id,
      value: checkout.totalPrice.amount,
      currency: checkout.currencyCode,
      tax: checkout.totalTax?.amount || 0,
      shipping: checkout.shippingLine?.price?.amount || 0,
      items: checkout.lineItems.map((item, index) => ({
        item_id: item.variant.product.id,
        item_name: item.title,
        item_variant: item.variant.title,
        price: item.variant.price.amount,
        quantity: item.quantity,
        index: index
      }))
    });
  });
})();
```

5. **「保存」をクリック**

6. **接続をテスト** で動作確認

#### 注意事項:
- この方法はより高度なカスタマイズが可能ですが、コードの保守が必要です
- Shopifyのアップデートに応じてコードの更新が必要になる場合があります

### 方法3: Google Tag Manager経由（上級者向け）

Google Tag Managerを使用する場合：

1. **Shopify管理画面** → **「オンラインストア」** → **「テーマ」** → **「カスタマイズ」**
2. **「テーマ設定」** → **「チェックアウト」** (Shopify Plusのみ)
3. GTMコンテナスニペットを追加

**注意**: 標準プランではチェックアウトページのカスタマイズに制限があるため、方法1（Google & YouTube アプリ）の使用を推奨します。

---

## 確認方法

### リアルタイムでの確認

1. **Google Analytics 4 にアクセス**
2. 左メニューから **「レポート」** → **「リアルタイム」** を選択
3. 実際にテスト購入やお問い合わせを実行
4. リアルタイムレポートでイベントが表示されることを確認

### イベントの詳細確認

1. 左メニューから **「管理」** → **「データの表示」** → **「DebugView」** を選択
2. テストモードでイベントの詳細を確認できます

### コンバージョンレポートの確認

1. 左メニューから **「レポート」** → **「エンゲージメント」** → **「コンバージョン」** を選択
2. 設定したコンバージョンの数値が正しく記録されているか確認

---

## トラブルシューティング

### イベントが送信されない場合

1. **ブラウザの開発者ツールを開く** (F12)
2. **コンソールタブ**でエラーメッセージを確認
3. **ネットワークタブ**で `google-analytics.com` へのリクエストを確認
4. 広告ブロッカーが有効になっていないか確認

### Shopify購入イベントが記録されない場合

#### Google & YouTube アプリを使用している場合:

1. **アプリの接続状態を確認**
   - Shopify管理画面 → 「アプリ」 → 「Google & YouTube」
   - Googleアカウントとの接続が有効になっているか確認
   - 必要に応じて再接続

2. **Google Analytics プロパティの確認**
   - 正しい測定ID (`G-V0M4G7XVPQ`) が選択されているか確認
   - GA4プロパティ（UA-から始まるものではない）であることを確認

3. **コンバージョン追跡の有効化**
   - アプリ設定で「コンバージョン追跡」がONになっているか確認

4. **テスト注文を実行**
   - Shopifyのテストモードで注文を作成
   - または実際の注文を実行（最小金額の商品で）

5. **データ反映の待機**
   - GA4のデータ反映には最大24〜48時間かかる場合があります
   - リアルタイムレポートでは数分で確認可能

#### カスタムピクセルを使用している場合:

1. Shopify管理画面 → 「設定」 → 「カスタマーイベント」
2. カスタムピクセルの接続状態を確認
3. 「接続をテスト」でエラーがないか確認
4. ブラウザのコンソールログでエラーを確認

---

## まとめ

### 実装状況

- ✅ **お問い合わせフォーム送信**: 自動トラッキング済み（ウェブサイト側）
- ✅ **カート追加**: 自動トラッキング済み（ウェブサイト側）
- ✅ **チェックアウト開始**: 自動トラッキング済み（ウェブサイト側）
- 📱 **購入完了**: **Google & YouTube アプリの設定が必要**

### 推奨される設定方法

1. **簡単で確実**: **Google & YouTube アプリ**（推奨）
   - コード不要
   - Shopify公式サポート
   - 自動更新対応

2. **カスタマイズ重視**: Shopify Pixel（カスタムピクセル）
   - 詳細なカスタマイズが可能
   - コードの保守が必要

3. **既存GTM利用者**: Google Tag Manager経由
   - Shopify Plusプランが必要
   - 既存のGTM設定を活用可能

### 次のステップ

1. **Shopify管理画面**で「Google & YouTube」アプリをインストール
2. Googleアカウントと接続
3. 測定ID `G-V0M4G7XVPQ` を選択
4. コンバージョン追跡を有効化
5. テスト注文で動作確認

購入完了のトラッキングは、**Google & YouTube アプリ**を使用することで、コードを書かずに簡単に設定できます。

---

## 参考リンク

- [Google Analytics 4 公式ドキュメント](https://support.google.com/analytics/answer/9267735)
- [GA4 Eコマースイベント](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce)
- [Shopify: Google & YouTube アプリ](https://help.shopify.com/ja/manual/online-sales-channels/google)
- [Shopify: カスタムピクセル](https://help.shopify.com/ja/manual/promoting-marketing/pixels/custom-pixels)
- [Shopify: カスタマーイベント](https://shopify.dev/docs/api/web-pixels-api/standard-events)
