# 計測基盤修正 T1検証レポート（Task 10）

**検証日:** 2026-09-06
**対象ブランチ:** `feat/measurement-foundation`
**検証環境:** `npx vite build && npx vite preview --port 4173`（`npm run build` は不使用。理由は下記「検証方法」参照）
**ビューポート:** 375×667（モバイル。セッションの81%・購入の85%がモバイルであるため）。`window.innerWidth`/`innerHeight` および実ネットワークリクエストの `sr=375x667`・`u_w=375&u_h=667` パラメータで実際に375×667で送信されたことを確認済み。
**検証ツール:** 2種類を併用した。
1. Claude in Chrome 拡張（`navigator.webdriver === false`。本サイトの `shouldSuppressTracking` ガードで自動操作ブラウザからの送信は抑止されるが、この拡張は素の非自動操作ブラウザと同じ属性を持つため実際にイベントが送信される）。当初この拡張の `resize_window` ツールで375×667への変更を試みたが `"Bounds must be at least 50% within visible screen space"` エラーで失敗した（環境のウィンドウマネージャ起因、再現性なし）。
2. Playwright MCP（`page.setViewportSize({width:375,height:667})`）。Task 8が同一の制約（拡張の`resize_window`が使えない場合がある）に対して採用した実績のある方法。`navigator.webdriver` はこの起動設定では `false` となることを確認した上で使用した。

**手順:** まずClaude in Chrome拡張で全項目を一度検証したが、その時点でビューポートが375×667になっていないこと（`u_w=3008&u_h=1692`のまま）に気づき、Playwright MCPに切り替えて375×667を確定させた上で全項目（Step 1〜10、および`/strawberries`のview_item_list）を再実行した。以下の表はPlaywright MCP・375×667での再実行結果を記載する。

## 検証方法（設計書§10.1 T1に基づく）

Task 1〜8の実装はいずれもユニットテストで純粋関数（`normalizePath` / `toGaItem` / `categoryOf` / `classifyInquiry`）のみを検証済みだが、実際にGA4へイベントが発火するかはDOM操作を伴う実ブラウザでしか確認できない。本タスクは以下2つの独立した方法でイベント発火を裏取りした。

1. **`window.gtag` スパイ**: `window.gtag` を差し替えて全呼び出しを配列に記録する方式。過去タスクの検証（Task 3〜9）で「コンソールリーダーは `console.log('GA Event sent: ...')` を取りこぼすことがある」という既知の問題が報告されていたため、コンソールログより優先してこの方式を主evidenceとした。
2. **`window.dataLayer` の直接検査**: `gtag()` は `dataLayer.push(arguments)` のラッパーであるため、`dataLayer` 配列そのものをフィルタして送信済みイベントの全履歴を確認した（ページ内SPA遷移をまたいでも配列は保持されるため、「重複送信していないか」の確認に特に有効）。
3. **`read_network_requests` によるアウトバウンドリクエスト検査**: `google-analytics.com/g/collect`、`analytics.google.com/g/collect`、および Google Ads 側のcollectエンドポイント（`www.google.com/ccm/collect` 等）への実リクエストを確認した。

各行の「観測」列に、どちらの方法で得た証拠かを明記する。

**ビルドに関する逸脱:** ブリーフは `npm run build && npx vite preview` を指示していたが、`npm run build` は `prebuild`（Shopify Admin API）→ `fetch-reviews`（Google Places API）→ `vite build` → `prerender`（Puppeteer）の順に実行され、前2つはこの環境に認証情報がなく失敗する。今回検証したいのは「`send_page_view: false` とコンパイル後の analytics モジュールがminify後も正しく動くか」であり、プリレンダリングパイプライン自体の疎通ではないため、`npx vite build && npx vite preview` で代替した。`dist/index.html` を確認し、`gtag('config', 'G-V0M4G7XVPQ', { send_page_view: false });` および `gtag('config', 'AW-17913747934');` が本番ビルドに正しく含まれていることを確認済み。

**既知の環境要因（コード欠陥ではない）:**
- ネットワークリクエストの多くが `statusCode: 503` を返しているが、これは本セッションのサンドボックス環境からのアウトバウンド接続制限によるものであり、リクエスト自体は正しいイベント名・パラメータでGoogleの実エンドポイントに送信されている（後述の「発見した相違点」参照）。
- localhostからのイベントは本番のGA4プロパティ（`G-V0M4G7XVPQ`）にも実際に届く。これは設計上許容されており、集計時に `hostName` でフィルタする方針（既知・対応不要）。
- 本番デプロイ時にはGA4管理画面の拡張計測（履歴イベントベースのpage_view）を無効化する想定（Task 3の申し送り、Task 9で管理画面設定として未実施）。ローカルプレビューでは拡張計測の設定次第で履歴ベースの重複が発生しうるが、今回の検証では拡張計測由来の重複は観測されなかった（`dataLayer` 上の `page_view` は常に自前送信の1件のみ）。

## 検証結果一覧

| # | イベント | 発火手順 | 観測（証拠を引用） | 方法 | 判定 |
|---|---|---|---|---|---|
| 1 | `page_view`（初回表示） | `/` を直接ロード | `dataLayer.filter(...page_view...)` → `[{"page_path":"/","page_location":"http://localhost:4173/",...}]`（**1件のみ**） | dataLayer検査 + コンソールログ（`GA Event sent: page_view`1行のみ） | ✅ PASS |
| 2 | `page_view`（SPA遷移） | トップページの商品セクション内 `<Link>`（`href="/rice"`、ヘッダーの素の`<a>`ではない方）をクリック | `__gaCalls`: `["event","page_view",{"page_path":"/rice","page_location":"http://localhost:4173/rice",...}]`。クリック後も `window.__gaSpyInstalled` が生存＝フルリロードではなく真のSPA内遷移であることを確認済み | gtagスパイ | ✅ PASS |
| 2 | `view_item_list`（同上の遷移） | 同上 | 同一 `__gaCalls` 内: `["event","view_item_list",{"item_list_name":"rice","items":[{"item_id":"gid://shopify/ProductVariant/48388477681887",...,"item_category":"rice","price":3800}, ...4件]}]` — `item_list_name: 'rice'`、全item `item_category: 'rice'` | gtagスパイ | ✅ PASS |
| 2 | `page_view` 重複なし | 上記2遷移をまたいだ全体 | `dataLayer.filter(page_view).map(e=>e.page_path)` → `["/", "/rice"]`（**ちょうど2件、重複なし**） | dataLayer検査 | ✅ PASS |
| 3 | `/rice/`（末尾スラッシュ）直接ロード | ブラウザで `http://localhost:4173/rice/` に直接ナビゲート | `dataLayer.filter(page_view)` → `[{"page_path":"/rice","page_location":"http://localhost:4173/rice",...}]`（URLバーは `/rice/` のままだが送信値は正規化済み、**1件のみ**） | dataLayer検査 | ✅ PASS |
| 4 | ハッシュアンカークリックで追加`page_view`なし | `/` でヘッダーの `<a href="/#about">` をクリック | クリック前後で `window.__gaSpyInstalled` は生存（フルリロードなし）。`__gaCalls`（クリック直前にクリア）→ `[]`（**0件**）。`dataLayer` 上の `page_view` 総数もクリック前後で変化なし（1件のまま） | gtagスパイ + dataLayer検査 | ✅ PASS |
| 5 | `view_item`（お米商品詳細） | `/rice` から「お米（ヒノヒカリ）白米」の詳細ページへ遷移 | `__gaCalls`: `["event","view_item",{"currency":"JPY","value":3800,"items":[{"item_id":"gid://shopify/ProductVariant/48388477681887","item_name":"お米（ヒノヒカリ）白米","item_variant":"5kg","item_category":"rice","price":3800}]}]` — `item_category: 'rice'` は `categoryOf(product)` による**導出値**（この動的ルートはいちご・お米両方を配信するため、コード上ハードコードされた文字列ではないことを`src/utils/analytics/items.ts`のコードで確認済み） | gtagスパイ | ✅ PASS |
| 6 | 商品バリアント切替で `view_item` 再発火 | 同ページで「9kg」ボタンをクリック | `__gaCalls`: `["event","view_item",{"currency":"JPY","value":6840,"items":[{"item_id":"gid://shopify/ProductVariant/48388477714655","item_variant":"9kg","item_category":"rice","price":6840}]}]` — `item_variant` が `5kg`→`9kg`、`item_id`・`price` も新バリアントの値に変化 | gtagスパイ | ✅ PASS |
| 7 | `add_to_cart`（`/rice` から） | `/rice` の商品カード「購入」ボタンをクリック（在庫あり: お米/ヒノヒカリ/玄米） | `__gaCalls`: `["event","add_to_cart",{"currency":"JPY","value":3800,"items":[{"item_id":"gid://shopify/ProductVariant/48388477681887","item_name":"お米（ヒノヒカリ）白米","item_variant":"5kg","item_category":"rice","price":3800}]}]` — `item_category: 'rice'` | gtagスパイ | ✅ PASS |
| 8 | `view_cart`（カートドロワー表示） | 上記「購入」クリック直後、カートドロワーが自動的に開く | 同一 `__gaCalls` 内、直後に: `["event","view_cart",{"currency":"JPY","value":3800,"items":[{"item_id":"...","item_variant":"5kg","price":3800,"quantity":1}]}]` | gtagスパイ | ✅ PASS |
| 9 | `remove_from_cart`（ゴミ箱ボタン） | カートドロワーの `aria-label="削除"` ボタンをクリック | `__gaCalls`: `["event","remove_from_cart",{"currency":"JPY","value":3800,"items":[{...}]}]` に続けて `["event","view_cart",{"currency":"JPY","value":0,"items":[]}]`。実削除確認: クリック後の `document.body.innerText` に「カートは空です」の文言を確認 | gtagスパイ + DOM検査 | ✅ PASS |
| 9 | `remove_from_cart`（数量−ボタン、数量1時） | 同商品を再度カートに追加後、`aria-label="数量を減らす"` ボタンを数量1の状態でクリック | `__gaCalls`: 同上と同じ形（`remove_from_cart`→`view_cart{items:[]}`）。実削除確認: 「カートは空です」を再度確認 | gtagスパイ + DOM検査 | ✅ PASS |
| 10 | `phone_click` | `/strawberry-picking` で `tel:` リンク（`0942-53-1038`）をクリック（`click`イベントに`preventDefault`のみ適用し、実際のtel:起動は抑止しつつReactの`onClick`ハンドラは正常発火させる方式） | `__gaCalls`: `["event","phone_click",{"phone_number":"0942-53-1038"}]` | gtagスパイ | ✅ PASS |
| 10 | Google Ads コンバージョン（同上） | 同上 | 同一 `__gaCalls` 内、直後に: `["event","conversion",{"send_to":"AW-17913747934/_9PYCI30zO4bEN6z-N1C","value":2000,"currency":"JPY","transaction_id":""}]` — Task 8以前と同一のコンバージョンID・金額・通貨 | gtagスパイ | ✅ PASS |

## Step 11: Shopify所有イベントが自社サイトから送信されないことの確認（明示的な否定結果）

対象: `begin_checkout` / `purchase` / `add_shipping_info` / `add_payment_info`

**実施した検索と結果:**

1. **静的コード検索**（`grep -rn "begin_checkout\|add_shipping_info\|add_payment_info\|'purchase'\|\"purchase\"\|trackBeginCheckout\|trackShopifyPurchase" src/ index.html`）
   → ヒットは2件のみ、いずれも `src/utils/analytics/events.ts` 冒頭のポリシーコメント（「これらはShopifyが送信するため自社から送信してはならない」旨の注釈）内。実際に `sendGAEvent` や `gtag()` を呼び出すコードは一切存在しない。

2. **`window.dataLayer` 検索**（本レポートの全検証手順を実行した後、各ページ遷移ごとに）
   `dataLayer.filter(e => e[0]==='event' && ['begin_checkout','purchase','add_shipping_info','add_payment_info'].includes(e[1]))` → 常に `[]`（0件）。

3. **ネットワークログ検索（375×667のPlaywright MCPセッション）**
   `browser_network_requests` を正規表現 `en=begin_checkout|en=purchase|en=add_shipping_info|en=add_payment_info` でフィルタ → 0件。
   さらに `/strawberries` ページ読み込みで発生した実アウトバウンドリクエスト（`collect|conversion`でフィルタした一部を含む）を目視確認したところ、`en=` パラメータの値は `gtag.config` / `page_view` / `view_item_list` のみで、対象4イベントは1件も含まれていなかった。同様の検索は375×667補正前のClaude in Chromeセッション（`/mypage`未ログイン→`/login`→`/strawberries`の26件の実リクエスト）でも実施し、そちらも0件だった。

**結論: 対象4イベントは自社サイトのコード・実行時挙動のいずれからも一切送信されていないことを確認した。**

## 検証できなかった項目（明示）

| 項目 | 理由 | 対応 |
|---|---|---|
| いちごの購入導線一式（`add_to_cart`・`view_cart`実削除・カート内バリアント表示など、いちご商品での実クリック検証） | 検証時点（2026年9月、オフシーズン）でShopifyストアのいちご商品が全て売り切れ（`売り切れ`ボタンが`disabled`）。`.disabled = false`をDOM操作で外してもReactの合成イベントはfiberレベルの`disabled` propを見るため`onClick`は発火せず、偽装検証はしなかった | `/strawberries`の`view_item_list`は在庫状況に関係なく発火することを実クリックで確認済み（`item_category: 'strawberry'`が全item に正しく付与）。`add_to_cart`/`view_item`のカテゴリ導出ロジックはお米側の同一コードパス（`ProductByHandlePage.tsx`の`categoryOf()`、`RicePage.tsx`の`category:'rice'`と構造的に対をなす`StrawberriesPage.tsx`の`category:'strawberry'`）で**構造的等価性により検証済み**とし、実行による検証ではないことを明記する。2026年12月のいちごシーズン再開後、在庫が入り次第、実クリックでの再検証が必要 |
| マイページの再注文導線（`OrderHistory.tsx`の`trackAddToCart`呼び出し） | Shopify OAuthログインが必要。ログインを偽装しないことがタスクの明示的な制約 | `/mypage`に未ログイン状態でアクセスし`/login`へリダイレクトされることを確認（認証ガードは機能している）。実ログインでの再注文フローは未検証のまま。Shopifyテストアカウントでの手動確認が別途必要 |
| お問い合わせフォームの実送信（EmailJS経由） | `ContactForm.tsx`の`handleSubmit`はEmailJS環境変数（`VITE_EMAILJS_*`）が未設定だと`emailjs.send()`より前で例外を投げ、`trackContactFormSubmission`（追跡コード）に到達しない実装になっている。本環境で環境変数の設定有無を確認する手段がなく（`.env`の直接参照は許可されていない）、かつ実送信を試みた場合、設定が生きていれば実際のメールが農園の受信箱に届くリスクがあるため、実クリックでの送信は行わなかった | Task 7と同一の手法で代替検証: 実際の（改変していない）`trackContactFormSubmission`関数をNode/tsxスクリプトから直接呼び出し、`gtag`をスタブして出力を確認。`{subject:'いちご狩りについて', message:'見学したいです'}` → `contact_form_submit`/`generate_lead`ともに`inquiry_type:'strawberry_picking'`。`{subject:'その他', message:'玄米を購入したいのですが'}` → 両イベントとも`inquiry_type:'ec_rice'`。追跡ロジック自体は本物のコードパスで確認済みだが、EmailJS送信そのもの・実ブラウザでのフォーム送信フロー・GA4 DebugViewでの着弾は未検証 |

## 発見した相違点（正直な報告）

- **`analytics.google.com/g/collect` へのリクエストのステータスコードがツール・セッションによって揺れた。** Claude in Chrome拡張での検証セッションでは、`analytics.google.com/g/collect`・`www.google.com/rmkt/collect/...`・`www.google.com/ccm/collect`など、gtag.jsが内部的に発行する全collectリクエストが`503`を返していた。一方、375×667のビューポート修正のためPlaywright MCPに切り替えて再実行したセッションでは、`/strawberries`ページ読み込み時の`analytics.google.com/g/collect`（`en=page_view`、`sr=375x667`）が**`204`（成功）**を返すのを確認した。つまり同一のGA4測定ID・同一のGoogle実エンドポイントに対して、ツール・セッションによって応答が異なった。いずれのリクエストもURL・クエリパラメータ自体は正しいイベント名・パラメータで構成されている（例: 503を返した`en=add_to_cart`のリクエストにも`item_category`相当の`ca=rice`が正しく含まれていた）ため、**送信ロジック自体に不具合はない**と判断する。`200`を返しているものの大半は`googleads.g.doubleclick.net`系・`www.google.com/pagead/1p-user-list/...`系で、これらはGoogle Ads側のリマーケティング/コンバージョンピクセルでありGA4の計測パイプラインとは別経路。204が一度得られたことは「GA4側が実際にイベントを受理した」ことの直接証拠になるが、他の大半のケースで503が観測された事実は変わらないため、**本番環境（実ドメイン・実ユーザーのネットワーク経路）でも一貫して届くと断定はできない**。GA4のリアルタイムレポートでの着弾確認（設計書の元のStep 4）は、本タスクのブリーフ（`npm run build`を使わない、等の明示的な変更点）には含まれていなかったため実施していない。次工程（サブプロジェクト2以降）が「計測は信頼できる」という前提に依拠する前に、本番デプロイ後に一度、実際のGA4管理画面（リアルタイムレポートまたはDebugView）での着弾確認を推奨する。
- 上記以外に、Task 1〜8の実装内容とTask 10で観測した実挙動との間に矛盾は見つからなかった（正規化・重複防止・イベント所有権の分離・カテゴリ導出は全てコード通りに動作した）。

## 実行した既存ゲートの再確認

- `npm test -- --run` → `Test Files 5 passed (5)` / `Tests 29 passed (29)`（Task 1〜9終了時点のベースラインと一致）
- `npm run typecheck` → エラー25件（既知の25件ベースラインと一致、本タスクはソースコードを変更していないため差分なし）
