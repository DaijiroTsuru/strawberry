# Google Places APIからレビューを自動取得する設定

このプロジェクトでは、ビルド時にGoogle Places APIからお客様の声を自動取得します。

## セットアップ手順

### 1. Google Cloud Platformの設定

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成、または既存のプロジェクトを選択
3. 「APIとサービス」→「ライブラリ」から「Places API (New)」を有効化
4. 「認証情報」→「認証情報を作成」→「APIキー」を作成

### 2. Place IDの取得

あなたのビジネスのPlace IDを取得する方法：

**方法1: Place ID Finder（推奨）**
1. [Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id)にアクセス
2. ビジネス名や住所で検索
3. Place IDをコピー

**方法2: Google Mapsから**
1. [Google Maps](https://www.google.com/maps)でビジネスを検索
2. URLから`?cid=`の後の数字をコピー
3. これをPlace IDに変換（または直接APIで使用可能）

### 3. 環境変数の設定

1. `.env`ファイルを作成（`.env.example`をコピー）:
```bash
cp .env.example .env
```

2. `.env`ファイルに以下を設定:
```
VITE_GOOGLE_PLACES_API_KEY=あなたのAPIキー
VITE_GOOGLE_PLACE_ID=あなたのPlace ID
```

### 4. レビューの取得

レビューを手動で取得:
```bash
npm run fetch-reviews
```

ビルド時に自動取得（ビルドコマンドに含まれています）:
```bash
npm run build
```

## 動作

- `npm run fetch-reviews`を実行すると、`src/data/reviews.json`が更新されます
- 取得されるレビューの条件:
  - 評価4以上
  - 最大6件
  - 日本語優先
- 取得した情報:
  - レビュアー名
  - 評価（星の数）
  - コメント
  - 投稿日時
  - プロフィール写真URL（オプション）

## トラブルシューティング

### APIキーエラー
- APIキーが正しく設定されているか確認
- Places API (New)が有効化されているか確認
- APIキーの制限設定を確認

### Place IDエラー
- Place IDが正しいか確認
- ビジネスがGoogleマップに登録されているか確認

### レビューが取得できない
- ビジネスにレビューが投稿されているか確認
- API使用制限（クォータ）を超えていないか確認

## セキュリティ注意事項

- `.env`ファイルは`.gitignore`に含まれており、Gitにコミットされません
- APIキーは公開しないでください
- 本番環境では、環境変数を安全に管理してください
