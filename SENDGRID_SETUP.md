# SendGrid セットアップガイド

## 📧 SendGridとは

SendGridは世界中で使用されているクラウドベースのメール配信サービスです。
高い配信率と信頼性で、ビジネス用途に最適です。

**無料プラン**: 月100通まで無料（問い合わせフォームには十分）

---

## 🚀 セットアップ手順

### ステップ1: SendGridアカウント作成

1. [SendGrid公式サイト](https://sendgrid.com/)にアクセス
2. 「Start for Free」をクリックしてアカウント作成
3. メールアドレスとパスワードを設定
4. メール認証を完了

### ステップ2: APIキーの取得

1. SendGridダッシュボードにログイン
2. 左メニューから **Settings** → **API Keys** を選択
3. 「Create API Key」をクリック
4. API Key名を入力（例: `tsuru-ichigo-contact-form`）
5. **Restricted Access** を選択
6. **Mail Send** → **Full Access** を選択
7. 「Create & View」をクリック
8. **表示されたAPIキーをコピー**（再表示できないので注意！）

### ステップ3: 送信元メールアドレスの認証

#### オプションA: 単一送信者の認証（推奨・簡単）

1. **Settings** → **Sender Authentication** を選択
2. 「Verify a Single Sender」セクションで「Get Started」をクリック
3. 以下の情報を入力:
   - **From Name**: `津留いちご園 お問い合わせフォーム`
   - **From Email Address**: `noreply@tsuru-ichigo.com` （実際のメールアドレス）
   - **Reply To**: 農園の実際のメールアドレス
   - **Company Address**: 農園の住所
   - **Nickname**: `Tsuru Ichigo Contact`
4. 「Create」をクリック
5. **認証メールが送信されるので、メール内のリンクをクリック**
6. 認証完了

#### オプションB: ドメイン認証（上級者向け）

独自ドメインを持っている場合、ドメイン全体を認証できます。
DNSレコードの設定が必要なため、少し複雑です。

### ステップ4: パッケージのインストール

プロジェクトのルートディレクトリで以下を実行:

```bash
npm install @sendgrid/mail
npm install -D @vercel/node
```

### ステップ5: 環境変数の設定

プロジェクトのルートに `.env` ファイルを作成（既にある場合は追記）:

```bash
# SendGrid設定
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@tsuru-ichigo.com
CONTACT_EMAIL=info@tsuru-ichigo.com
```

**重要**: `.gitignore` に `.env` が含まれていることを確認してください！

### ステップ6: Vercelに環境変数を設定（本番環境）

1. Vercelダッシュボードにログイン
2. プロジェクトを選択
3. **Settings** → **Environment Variables** を開く
4. 以下の環境変数を追加:

| Name | Value | Environment |
|------|-------|-------------|
| `SENDGRID_API_KEY` | `SG.xxx...` | Production, Preview, Development |
| `SENDGRID_FROM_EMAIL` | `noreply@tsuru-ichigo.com` | Production, Preview, Development |
| `CONTACT_EMAIL` | `info@tsuru-ichigo.com` | Production, Preview, Development |

5. 「Save」をクリック

### ステップ7: 動作確認

#### ローカル環境でのテスト

1. 開発サーバーを起動:
```bash
npm run dev
```

2. ブラウザで `http://localhost:5173` を開く
3. アクセスセクションまでスクロール
4. 問い合わせフォームにテストデータを入力
5. 送信ボタンをクリック

#### 確認ポイント:
- ✅ 「お問い合わせを送信しました」のメッセージが表示される
- ✅ `CONTACT_EMAIL` で設定したメールアドレスにメールが届く
- ✅ SendGridダッシュボードの **Activity** で送信履歴を確認できる

---

## 🔧 トラブルシューティング

### エラー: 401 Unauthorized

**原因**: APIキーが無効または設定されていない

**解決方法**:
1. `.env` ファイルの `SENDGRID_API_KEY` を確認
2. APIキーが正しくコピーされているか確認
3. 開発サーバーを再起動

### エラー: 403 Forbidden

**原因**: 送信元メールアドレスが認証されていない

**解決方法**:
1. SendGridダッシュボードで **Sender Authentication** を確認
2. 認証メールのリンクをクリックしたか確認
3. `.env` の `SENDGRID_FROM_EMAIL` が認証済みアドレスと一致しているか確認

### メールが届かない

**確認項目**:
1. **迷惑メールフォルダ**を確認
2. SendGridダッシュボードの **Activity** で送信ステータスを確認
3. `CONTACT_EMAIL` のアドレスが正しいか確認
4. ブラウザのコンソールでエラーを確認

### ローカル環境で API Route が 404 になる

**原因**: Vercel の開発環境でAPIルートが認識されていない

**解決方法**:
1. `vercel dev` コマンドを使用:
```bash
npm install -g vercel
vercel dev
```

または、Viteの設定でプロキシを設定してください。

---

## 📊 SendGrid ダッシュボードの使い方

### メール送信履歴の確認

1. **Activity** タブを開く
2. 送信したメールのステータスを確認:
   - ✅ **Delivered**: 正常に配信
   - ⏳ **Processed**: 処理中
   - ❌ **Dropped**: 送信失敗
   - 📭 **Bounced**: バウンス（受信失敗）

### 統計情報の確認

1. **Stats** → **Overview** を開く
2. 以下の情報を確認:
   - 送信数
   - 配信率
   - 開封率（トラッキング有効時）
   - クリック率（トラッキング有効時）

---

## 🎨 カスタマイズ

### メールのデザインを変更

`/api/contact.ts` の `html` 部分を編集してください。

### 自動返信メールの追加

お客様にも確認メールを送信したい場合:

```typescript
// お客様への自動返信メール
const confirmationMsg = {
  to: email,
  from: {
    email: process.env.SENDGRID_FROM_EMAIL || 'noreply@tsuru-ichigo.com',
    name: '津留いちご園',
  },
  subject: 'お問い合わせを受け付けました',
  html: `
    <p>${name} 様</p>
    <p>お問い合わせいただき、ありがとうございます。</p>
    <p>以下の内容で受け付けました。</p>
    <hr>
    <p><strong>件名:</strong> ${formattedSubject}</p>
    <p><strong>お問い合わせ内容:</strong></p>
    <p>${message.replace(/\n/g, '<br>')}</p>
    <hr>
    <p>通常、2-3営業日以内に返信いたします。</p>
    <p>津留いちご園</p>
  `,
};

// 両方送信
await Promise.all([
  sgMail.send(msg),
  sgMail.send(confirmationMsg)
]);
```

---

## 💰 料金プラン

| プラン | 月額 | 送信数 |
|--------|------|--------|
| **Free** | $0 | 100通 |
| **Essentials** | $19.95 | 50,000通 |
| **Pro** | $89.95 | 100,000通 |

問い合わせフォームの場合、**Freeプラン（月100通）で十分**です。

---

## 🔒 セキュリティのベストプラクティス

1. ✅ **APIキーを絶対にGitにコミットしない**
2. ✅ **環境変数で管理**
3. ✅ **本番とテストで別々のAPIキーを使用**
4. ✅ **APIキーの権限を最小限に**（Mail Send のみ）
5. ✅ **定期的にAPIキーをローテーション**

---

## 📚 参考リンク

- [SendGrid公式ドキュメント](https://docs.sendgrid.com/)
- [SendGrid Node.js ライブラリ](https://github.com/sendgrid/sendgrid-nodejs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)

---

## ✅ チェックリスト

セットアップが完了したら、以下を確認してください:

- [ ] SendGridアカウントを作成した
- [ ] APIキーを取得した
- [ ] 送信元メールアドレスを認証した
- [ ] パッケージをインストールした（`@sendgrid/mail`）
- [ ] `.env` ファイルに環境変数を設定した
- [ ] `.gitignore` に `.env` が含まれている
- [ ] ローカル環境でテスト送信が成功した
- [ ] Vercelに環境変数を設定した（本番環境用）
- [ ] 本番環境でテスト送信が成功した

全て完了したら、問い合わせフォームが完全に動作します！🎉
