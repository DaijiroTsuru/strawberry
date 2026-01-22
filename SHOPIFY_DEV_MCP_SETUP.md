# Shopify Dev MCP セットアップガイド

Shopify Dev MCPサーバーを使用して、VS Code GitHub CopilotでShopify開発をスムーズに行う方法です。

## Shopify Dev MCPとは？

開発者向けのMCPサーバーで、Copilotと会話しながらShopify開発ができます。

### できること

- **ドキュメント検索**: Shopify APIのドキュメントを検索
- **API学習**: Admin API、Storefront API、Functions APIなどの使い方を学習
- **GraphQL検証**: GraphQLクエリの検証とフィールド確認
- **コード生成**: Shopifyアプリのコード例を生成

### 使用例

```
@workspace Shopifyで商品を作成するGraphQL mutationを教えて
```

```
@workspace Storefront APIでカートを作成する方法は？
```

```
@workspace Admin APIのOrder objectにはどんなフィールドがある？
```

## 前提条件

- Node.js 18以上がインストールされていること
- VS Code GitHub Copilot拡張機能がインストールされていること

## セットアップ手順（VS Code）

### 1. VS Code設定を開く

`Cmd + Shift + P` → 「Preferences: Open User Settings (JSON)」を選択

### 2. MCP設定を追加

以下の設定を `settings.json` に追加：

```json
{
  "github.copilot.chat.mcp.enabled": true,
  "github.copilot.chat.mcp.servers": {
    "shopify-dev-mcp": {
      "command": "npx",
      "args": ["-y", "@shopify/dev-mcp@latest"]
    }
  }
}
```

### 3. VS Codeを再起動

設定を保存したら、VS Codeを完全に再起動してください。

## 使い方

### Copilot Chatで使用

1. VS Code/CursorでCopilot Chatパネルを開く
2. `@workspace` を入力してから質問

```
@workspace Shopify Admin APIで商品を作成する方法を教えて
```

```
@workspace カートにバリアントを追加するStorefront API GraphQLクエリを書いて
```

```
@workspace Shopify FunctionsでDiscountを作成する例を見せて
```

### エディタ内でインライン使用

1. コードエディタで `Cmd + I` (または `Ctrl + I`)
2. Shopifyに関する質問やコード生成を依頼

```
Storefront API 2026-01でcartCreateのmutationを生成して
```

## 対応API

Dev MCPサーバーは以下のShopify APIに対応：

- **Admin GraphQL API** - 商品、注文、顧客管理
- **Storefront API** - ストアフロント、カート、チェックアウト
- **Customer Account API** - 顧客アカウント管理
- **Functions API** - Shopify Functions開発
- **Liquid API** - テーマ開発
- **Partner API** - パートナー管理
- **Payment Apps API** - 決済アプリ開発
- **Polaris Web Components** - UI開発
- **POS UI Extensions** - POS拡張機能

## 利用可能なツール

Dev MCPサーバーが提供する主なツール：

### `learn_shopify_api`
Shopify APIの使い方を学習します。常に最初に呼び出すことで、最新のAPI情報を取得します。

### `search_docs_chunks`
Shopifyドキュメント全体を検索します。複数のトピックを横断検索する際に便利です。

### `fetch_full_docs`
特定のドキュメントページの完全な内容を取得します。完全なコンテキストが必要な場合に使用します。

### `introspect_graphql_schema`
GraphQL schemaを探索し、利用可能なtype、query、mutationを確認します。

### `validate_graphql_codeblocks`
GraphQLコードブロックを検証し、存在しないフィールドや操作を検出します。

### `validate_component_codeblocks`
JavaScriptコンポーネントコードを検証し、存在しないcomponentやpropsを検出します。

### `validate_theme`
テーマディレクトリ全体をTheme Checkで検証します（Liquid、JSON、CSS、JSなど）。

## 高度な設定

### インストルメンテーションを無効化

使用状況の収集を無効にしたい場合：

```json
{
  "github.copilot.chat.mcp.enabled": true,
  "github.copilot.chat.mcp.servers": {
    "shopify-dev-mcp": {
      "command": "npx",
      "args": ["-y", "@shopify/dev-mcp@latest"],
      "env": {
        "OPT_OUT_INSTRUMENTATION": "true"
      }
    }
  }
}
```

### Liquid検証モードの設定

```json
{
  "github.copilot.chat.mcp.enabled": true,
  "github.copilot.chat.mcp.servers": {
    "shopify-dev-mcp": {
      "command": "npx",
      "args": ["-y", "@shopify/dev-mcp@latest"],
      "env": {
        "LIQUID_VALIDATION_MODE": "full"
      }
    }
  }
}
```

- `full` (デフォルト推奨): テーマディレクトリ全体の検証
- `partial`: 個別のLiquidファイルのみ検証

## トラブルシューティング

### MCPサーバーが認識されない

1. **VS Codeの出力パネルを確認**
   - View → Output → "GitHub Copilot Chat" を選択
   - エラーメッセージを確認

2. **設定のJSON形式を確認**
   - カンマやクォートの間違いがないか確認

3. **VS Codeを完全に再起動**
   - Cmd + Q で完全終了してから再起動

### Node.jsバージョンエラー

Node.js 18以上が必要です：

```bash
node --version
```

18未満の場合は、[nodejs.org](https://nodejs.org/)から最新版をインストールしてください。

### npxコマンドが見つからない

Node.jsと一緒にnpmがインストールされているか確認：

```bash
npm --version
```

### Windows接続エラー

上記のCursor設定の代替設定（`cmd` + `/k`）を試してください。

## 開発ワークフロー例

### 1. 新機能の実装

```
@workspace Shopify Admin APIで商品にメタフィールドを追加する方法を教えて
```

→ Copilotがドキュメントとコード例を提供

### 2. エラーのデバッグ

```
@workspace このGraphQLエラーの原因は？ "Field 'productCreate' doesn't accept argument 'variants'"
```

→ Copilotがschemaを確認して正しい引数を提案

### 3. API移行

```
@workspace Admin API 2025-01から2026-01への移行で変更された点は？
```

→ Copilotが変更点と更新方法を説明

## このプロジェクトでの活用例

現在、Storefront API 2026-01を使用したヘッドレスコマースサイトを開発中です。Dev MCPを使って以下のような開発がスムーズになります：

```
@workspace src/utils/shopify.tsのカート機能を確認して、Storefront API 2026-01のベストプラクティスに沿っているか教えて
```

```
@workspace CartContextに注文履歴機能を追加したい。Customer Account APIを使った実装例を教えて
```

```
@workspace 商品バリアントの在庫状態をリアルタイムで確認する方法は？
```

## 認証について

**Dev MCPサーバーは認証不要です**。Shopify公式ドキュメントとschemaにアクセスするだけで、実際のストアデータにはアクセスしません。

## 参考リンク

- [Shopify Dev MCP公式ドキュメント](https://shopify.dev/docs/apps/build/devmcp)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [Cursor MCP Documentation](https://docs.cursor.com/context/model-context-protocol)

## まとめ

Shopify Dev MCPをセットアップすることで：

✅ Shopify APIの最新ドキュメントに即座にアクセス  
✅ GraphQLクエリの検証がリアルタイムで可能  
✅ コード生成がShopifyのベストプラクティスに準拠  
✅ API移行やバージョンアップが簡単に  

開発効率が大幅に向上します！
