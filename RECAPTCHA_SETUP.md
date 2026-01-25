# reCAPTCHA v3 セットアップガイド

## 🛡️ reCAPTCHA v3とは

Googleが提供する無料のスパム対策サービスです。
- **v3の特徴**: ユーザー操作不要（バックグラウンドで動作）
- **スコアベース**: 0.0（bot）～ 1.0（人間）でスコアリング
- **完全無料**: 月100万リクエストまで無料

---

## 🚀 セットアップ手順

### ステップ1: reCAPTCHA登録

1. [Google reCAPTCHA管理画面](https://www.google.com/recaptcha/admin)にアクセス
2. Googleアカウントでログイン
3. 「**+**」ボタンをクリックして新しいサイトを登録

### ステップ2: サイト情報の入力

以下の情報を入力:

| 項目 | 入力内容 |
|------|---------|
| **ラベル** | `津留いちご園 お問い合わせフォーム` |
| **reCAPTCHAタイプ** | ✅ **reCAPTCHA v3** を選択 |
| **ドメイン** | `tsuru-ichigo.com`（本番ドメイン）<br>`localhost`（開発用） |
| **オーナー** | あなたのメールアドレス |
| **reCAPTCHA利用規約** | ✅ チェック |

**重要**: ドメインは複数追加可能。開発環境用に `localhost` も追加してください。

### ステップ3: サイトキーとシークレットキーの取得

登録完了後、以下の2つのキーが表示されます:

- **サイトキー（Site Key）**: フロントエンド用（公開OK）
- **シークレットキー（Secret Key）**: バックエンド用（秘密！）

両方をコピーしてください。

---

## 🔧 環境変数の設定

### ローカル環境（`.env`）

プロジェクトルートの `.env` ファイルに追加:

```bash
# reCAPTCHA v3設定
VITE_RECAPTCHA_SITE_KEY=6Lxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RECAPTCHA_SECRET_KEY=6Lxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# SendGrid設定
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@tsuru-ichigo.com
CONTACT_EMAIL=info@tsuru-ichigo.com
```

**重要**: 
- `VITE_` プレフィックスはViteでフロントエンドに公開するため必須
- `RECAPTCHA_SECRET_KEY` にはプレフィックス不要（バックエンドのみ）
- `.gitignore` に `.env` が含まれていることを確認！

### 本番環境（Vercel）

1. Vercelダッシュボードにログイン
2. プロジェクトを選択
3. **Settings** → **Environment Variables**
4. 以下の環境変数を追加:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_RECAPTCHA_SITE_KEY` | `6Lxxx...` | Production, Preview, Development |
| `RECAPTCHA_SECRET_KEY` | `6Lxxx...` | Production, Preview, Development |

5. 「Save」をクリック
6. **再デプロイが必要**（Settings → Deployments → Redeploy）

---

## ✅ 動作確認

### 1. ローカル環境でテスト

```bash
npm run dev
```

1. ブラウザで `http://localhost:5173` を開く
2. 開発者ツール（F12）のコンソールタブを確認
3. アクセスセクションまでスクロール
4. 問い合わせフォームにテストデータを入力:
   - お名前: テスト太郎
   - メールアドレス: test@example.com
   - お問い合わせ内容: テストメッセージ
5. 送信ボタンをクリック
6. コンソールに以下のログが表示されればOK:
   ```
   reCAPTCHA token obtained
   Form submitted successfully
   ```

### 2. reCAPTCHA管理画面で確認

1. [reCAPTCHA管理画面](https://www.google.com/recaptcha/admin)を開く
2. 登録したサイトを選択
3. **分析**タブでリクエスト数とスコアを確認

### 3. スコアの確認

サーバーログ（Vercel Logs）で以下を確認:
```
reCAPTCHA verified. Score: 0.9
```

**スコアの目安**:
- **0.9 - 1.0**: 確実に人間
- **0.7 - 0.9**: ほぼ人間
- **0.5 - 0.7**: 疑わしい
- **0.0 - 0.5**: bot の可能性大（現在の実装では拒否）

---

## 🎨 UIカスタマイズ

### reCAPTCHA v3バッジの位置変更

デフォルトでは右下に表示されます。位置を変更する場合:

```css
/* src/styles/index.css に追加 */
.grecaptcha-badge {
  visibility: hidden;
}
```

**注意**: バッジを非表示にする場合、フォーム内に利用規約へのリンクを表示する必要があります（実装済み）。

---

## 🔒 セキュリティ設定

### スコア閾値の調整

`/api/contact.ts` の以下の行でスコア閾値を変更可能:

```typescript
if (!recaptchaData.success || recaptchaData.score < 0.5) {
```

**推奨値**:
- **厳しい**: `0.7` - スパムをほぼ完全にブロック（誤検知のリスク小）
- **標準**: `0.5` - バランス型（推奨・現在の設定）
- **緩い**: `0.3` - スパムを多少許容

### レート制限の追加（オプション）

同じIPアドレスからの連続送信を防ぐ:

```typescript
// api/contact.ts の先頭に追加
const rateLimitMap = new Map<string, number>();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // ... CORS設定 ...

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const lastRequest = rateLimitMap.get(ip as string) || 0;

  // 60秒以内の再送信を拒否
  if (now - lastRequest < 60000) {
    return res.status(429).json({ 
      error: '送信が早すぎます。しばらくしてから再度お試しください。' 
    });
  }

  rateLimitMap.set(ip as string, now);
  
  // 以下、既存のコード...
}
```

---

## 🐛 トラブルシューティング

### エラー: "reCAPTCHA Site Key が設定されていません"

**原因**: `.env` ファイルに `VITE_RECAPTCHA_SITE_KEY` が設定されていない

**解決方法**:
1. `.env` ファイルを確認・作成
2. reCAPTCHA管理画面からサイトキーをコピー
3. 開発サーバーを再起動: `npm run dev`

### エラー: "reCAPTCHA token取得エラー"

**原因**: reCAPTCHAスクリプトの読み込み失敗

**解決方法**:
1. ブラウザのコンソールでエラーを確認
2. 広告ブロッカーを無効化
3. ネットワークタブで `recaptcha` のリクエストを確認
4. サイトキーが正しいか確認

### エラー: "invalid-input-secret"

**原因**: シークレットキーが間違っている

**解決方法**:
1. reCAPTCHA管理画面でシークレットキーを再確認
2. `.env` の `RECAPTCHA_SECRET_KEY` を更新
3. Vercelの環境変数も確認・更新
4. 開発サーバーを再起動

### スコアが常に低い（0.1など）

**原因**: テスト環境でのボット操作、またはVPN使用

**解決方法**:
1. 通常のブラウザで操作（シークレットモード無効）
2. VPNを無効化
3. 実際にマウスで操作してフォーム入力
4. 開発環境では閾値を下げる（`0.3`など）

### メールが送信されない

**確認項目**:
1. SendGridのAPIキーとメールアドレスが設定されているか
2. `.env` ファイルの全ての環境変数を確認
3. ブラウザのコンソールでエラーを確認
4. Vercel Logsでサーバーエラーを確認

---

## 📊 分析とモニタリング

### reCAPTCHA管理画面の活用

1. **分析タブ**:
   - リクエスト数の推移
   - スコア分布
   - ボット検出率

2. **設定タブ**:
   - アラート設定
   - 通知メール設定

### Vercel Logsの確認

1. Vercelダッシュボード → プロジェクト選択
2. **Logs** タブを開く
3. `reCAPTCHA` で検索
4. スコアとエラーを確認:
   ```
   reCAPTCHA verified. Score: 0.9
   ```

---

## 🎯 ベストプラクティス

1. ✅ **スコア閾値は0.5から始める**（後で調整）
2. ✅ **ログでスコアをモニタリング**
3. ✅ **誤検知が多い場合は閾値を下げる**
4. ✅ **スパムが多い場合は閾値を上げる**
5. ✅ **レート制限と組み合わせる**
6. ✅ **バッジは非表示にせず、利用規約を明示**
7. ✅ **開発環境と本番環境で別々のサイトを登録**

---

## 💰 料金

**完全無料**: 月100万リクエストまで無料
- 問い合わせフォームの場合、ほぼ確実に無料枠内

---

## 📚 参考リンク

- [reCAPTCHA v3 公式ドキュメント](https://developers.google.com/recaptcha/docs/v3)
- [reCAPTCHA 管理画面](https://www.google.com/recaptcha/admin)
- [スコアの解釈方法](https://developers.google.com/recaptcha/docs/v3#interpreting_the_score)
- [SendGrid セットアップガイド](./SENDGRID_SETUP.md)

---

## ✅ チェックリスト

セットアップ完了の確認:

- [ ] reCAPTCHA v3サイトを登録した
- [ ] サイトキーとシークレットキーを取得した
- [ ] `.env` ファイルに環境変数を追加した（5つ）
- [ ] `.gitignore` に `.env` が含まれている
- [ ] ローカル環境でテスト送信が成功した
- [ ] コンソールに「reCAPTCHA token obtained」が表示された
- [ ] reCAPTCHA管理画面で分析を確認した
- [ ] Vercelに環境変数を設定した（本番用）
- [ ] 本番環境でテスト送信が成功した
- [ ] SendGridでメール受信を確認した

全て完了したら、セキュアな問い合わせフォームの完成です！🎉
