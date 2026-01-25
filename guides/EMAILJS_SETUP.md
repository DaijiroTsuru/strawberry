# EmailJS セットアップガイド

## 📧 EmailJSとは

EmailJSは、サーバーサイドコード不要でメール送信ができるサービスです。
静的サイトでのメール送信に最適です。

**無料プラン**: 月200通まで無料

**GitHub Pagesへのデプロイ方法**: [GITHUB_PAGES_DEPLOYMENT.md](./GITHUB_PAGES_DEPLOYMENT.md)を参照してください。

---

## 🚀 セットアップ手順

### ステップ1: EmailJSアカウント作成

1. [EmailJS公式サイト](https://www.emailjs.com/)にアクセス
2. 「Sign Up Free」をクリック
3. メールアドレスでアカウント作成
4. 認証メールのリンクをクリック

---

### ステップ2: メールサービスの追加

1. EmailJSダッシュボードにログイン
2. 左メニューから **Email Services** を選択
3. 「Add New Service」をクリック
4. 使用するメールサービスを選択:

#### 推奨: Gmail

1. **Gmail** を選択
2. Service ID: `gmail_service`（自動生成・変更可能）
3. 「Connect Account」をクリック
4. Googleアカウントでログイン・認証
5. 「Create Service」をクリック

**注意**: Gmailの場合、アプリパスワードが必要な場合があります。

#### 代替: その他のサービス

- **Outlook/Hotmail**
- **Yahoo**
- **Custom SMTP**（独自メールサーバー）

---

### ステップ3: メールテンプレートの作成

1. 左メニューから **Email Templates** を選択
2. 「Create New Template」をクリック
3. 以下の内容を設定:

#### テンプレート名
`contact_form_template`

#### テンプレート設定

**Subject（件名）**:
```
【お問い合わせ】{{subject}} - 津留いちご園
```

**Content（本文）**:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
      color: white;
      padding: 30px 20px;
      border-radius: 10px 10px 0 0;
      text-align: center;
    }
    .content {
      background: #f9fafb;
      padding: 30px 20px;
      border: 1px solid #e5e7eb;
    }
    .field {
      margin-bottom: 20px;
      background: white;
      padding: 15px;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
    }
    .field-label {
      font-weight: bold;
      color: #dc2626;
      margin-bottom: 5px;
      font-size: 14px;
    }
    .field-value {
      color: #1f2937;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .footer {
      background: #374151;
      color: #9ca3af;
      padding: 20px;
      border-radius: 0 0 10px 10px;
      text-align: center;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🍓 新しいお問い合わせがあります</h1>
  </div>
  
  <div class="content">
    <div class="field">
      <div class="field-label">📝 件名</div>
      <div class="field-value">{{subject}}</div>
    </div>

    <div class="field">
      <div class="field-label">👤 お名前</div>
      <div class="field-value">{{from_name}}</div>
    </div>

    <div class="field">
      <div class="field-label">📧 メールアドレス</div>
      <div class="field-value"><a href="mailto:{{from_email}}">{{from_email}}</a></div>
    </div>

    <div class="field">
      <div class="field-label">📱 電話番号</div>
      <div class="field-value">{{phone}}</div>
    </div>

    <div class="field">
      <div class="field-label">💬 お問い合わせ内容</div>
      <div class="field-value">{{message}}</div>
    </div>
  </div>

  <div class="footer">
    <p>このメールは津留いちご園のお問い合わせフォームから自動送信されました。</p>
    <p>返信する場合は、上記のメールアドレスまたは電話番号にご連絡ください。</p>
  </div>
</body>
</html>
```

4. **Settings** タブで以下を設定:
   - **From Name**: `津留いちご園 お問い合わせフォーム`
   - **From Email**: あなたのGmailアドレス
   - **To Email**: 農園のメールアドレス（受信先）
   - **Reply To**: `{{from_email}}`（お客様のメールアドレス）

5. 「Save」をクリック
6. **Template ID** をメモ（例: `template_xxxxxxx`）

---

### ステップ4: Public Keyの取得

1. 左メニューから **Account** → **General** を選択
2. **Public Key** をコピー（例: `Xxxxxxxxxxxxxx`）

---

### ステップ5: reCAPTCHA v2設定（オプション）

**重要**: EmailJSは **reCAPTCHA v2のみ**サポートしています（v3は非サポート）

#### reCAPTCHA v2サイトの登録

1. [Google reCAPTCHA管理画面](https://www.google.com/recaptcha/admin/create)にアクセス
2. 新しいサイトを登録:
   - **ラベル**: `津留いちご園 お問い合わせフォーム v2`
   - **reCAPTCHAタイプ**: **reCAPTCHA v2** の「"ロボットではありません" チェックボックス」を選択
   - **ドメイン**: `localhost` と本番ドメインを追加
3. サイトキーとシークレットキーを取得

#### EmailJSでの設定

1. EmailJSダッシュボードで作成したテンプレートを開く
2. **Settings** タブを選択
3. 「**Enable reCAPTCHA V2 verification**」にチェック
4. reCAPTCHAのシークレットキーを入力
5. 「Save」をクリック

#### フロントエンド実装（必要な場合）

reCAPTCHA v2を使用する場合、ユーザーにチェックボックスが表示されます。現在の実装はreCAPTCHA v3（バックグラウンド動作）のため、v2を使う場合はフォームの修正が必要です。

**推奨**: EmailJSのreCAPTCHA機能は使わず、フロントエンドでreCAPTCHA v3を継続使用し、Allowed Domainsとレート制限でスパム対策を行う方が、ユーザー体験が良好です。

---

### ステップ6: 環境変数の設定

プロジェクトルートの `.env` ファイルを作成・更新:

```bash
# EmailJS設定
VITE_EMAILJS_SERVICE_ID=gmail_service
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=Xxxxxxxxxxxxxx
```

**重要**: 
- すべて `VITE_` プレフィックスが必要（Viteでフロントエンドに公開）
- `.gitignore` に `.env` が含まれていることを確認

**GitHub Pagesへのデプロイ**: 環境変数の設定方法は [GITHUB_PAGES_DEPLOYMENT.md](./GITHUB_PAGES_DEPLOYMENT.md) を参照してください。

---

### ステップ7: 動作確認

#### ローカルテスト

```bash
npm run dev
```

1. ブラウザで `http://localhost:5173` を開く
2. お問い合わせフォームに入力
3. 送信ボタンをクリック
4. コンソールに `Form submitted successfully via EmailJS` と表示されることを確認
5. 設定したメールアドレスにメールが届くことを確認

#### 本番環境へのデプロイ

GitHub Pagesへのデプロイ方法は [GITHUB_PAGES_DEPLOYMENT.md](./GITHUB_PAGES_DEPLOYMENT.md) を参照してください。

---

## 🔒 セキュリティ設定

### EmailJS側のセキュリティ設定

1. **Account** → **Security** を開く
2. 以下を設定:

#### Allowed Domains（重要！）

```
localhost
your-username.github.io
```

これにより、指定ドメイン以外からの送信を拒否します。

#### Rate Limiting

- **Max requests per hour**: 10-20（スパム対策）

#### reCAPTCHA

EmailJSはreCAPTCHA v2のみサポート。テンプレートのSettingsタブで設定可能。

**推奨**: EmailJSのreCAPTCHA機能を使わず、Allowed DomainsとRate Limitingのみでスパム対策する方が、ユーザー体験が良好です（現在の実装でreCAPTCHA v3は参考用にトークンを送信していますが、EmailJS側では検証されません）。

---

## 🎨 カスタマイズ

### 自動返信メールの追加

お客様にも確認メールを送りたい場合:

1. 新しいテンプレートを作成: `confirmation_template`
2. **To Email**: `{{from_email}}`
3. 件名: `お問い合わせを受け付けました - 津留いちご園`
4. ContactForm.tsx で2通送信:

```typescript
// 農園への通知メール
await emailjs.send(serviceId, templateId, templateParams, publicKey);

// お客様への確認メール
await emailjs.send(
  serviceId,
  'confirmation_template',
  {
    to_email: formData.email,
    to_name: formData.name,
    subject: formData.subject,
    message: formData.message,
  },
  publicKey
);
```

---

## 🐛 トラブルシューティング

### エラー: "EmailJSの設定が不完全です"

**原因**: 環境変数が設定されていない

**解決方法**:
1. `.env` ファイルを確認
2. Service ID, Template ID, Public Keyが正しいか確認
3. 開発サーバーを再起動

### メールが届かない

**確認項目**:
1. EmailJSダッシュボードの **Email Logs** を確認
2. 迷惑メールフォルダを確認
3. Gmailの場合、アプリパスワードが正しいか確認
4. テンプレートの **To Email** が正しいか確認

### エラー: "Forbidden"

**原因**: ドメイン制限

**解決方法**:
1. EmailJS **Security** → **Allowed Domains** を確認
2. `localhost` と本番ドメインを追加

### 本番環境でメールが送信されない

**原因**: 環境変数が正しく設定されていない

**解決方法**:
1. 環境変数が正しく設定されているか確認
2. ビルドログで環境変数が読み込まれているか確認
3. Allowed Domainsに本番ドメインが追加されているか確認

GitHub Pagesの詳細は [GITHUB_PAGES_DEPLOYMENT.md](./GITHUB_PAGES_DEPLOYMENT.md) を参照してください。

---

## 💰 料金プラン

| プラン | 月額 | 送信数 |
|--------|------|--------|
| **Free** | $0 | 200通 |
| **Starter** | $9 | 1,000通 |
| **Pro** | $19 | 5,000通 |

問い合わせフォームの場合、**Freeプラン（月200通）で十分**です。

---

## 📊 EmailJS vs SendGrid

| 項目 | EmailJS<br>（GitHub Pages） | SendGrid<br>（Vercel/Netlify） |
|------|------------|----------|
| **静的サイト対応** | ✅ | ❌（Functionsが必要） |
| **セキュリティ** | △（Public Key公開） | ✅（APIキー非公開） |
| **reCAPTCHA検証** | △ サーバー側でも可能 | ✅ サーバー側 |
| **実装の複雑さ** | ✅ 簡単 | 中 |
| **無料枠** | 200通/月 | 100通/月 |
| **設定の手間** | 低 | 中 |
| **配信率** | 中 | ✅ 高 |

---

## ✅ チェックリスト

- [ ] EmailJSアカウントを作成した
- [ ] メールサービス（Gmail等）を連携した
- [ ] メールテンプレートを作成した
- [ ] Service ID, Template ID, Public Keyを取得した
- [ ] EmailJSのAllowed Domainsを設定した（必須）
- [ ] EmailJSのRate Limitingを設定した（推奨）
- [ ] `.env` ファイルに環境変数を設定した
- [ ] ローカル環境でテスト送信が成功した
- [ ] メールが届くことを確認した
- [ ] 本番環境でテスト送信が成功した

全て完了したら、問い合わせフォームの完成です！🎉

**GitHub Pagesへのデプロイ**: [GITHUB_PAGES_DEPLOYMENT.md](./GITHUB_PAGES_DEPLOYMENT.md) を参照してください。

---

## 📚 参考リンク

- [EmailJS公式ドキュメント](https://www.emailjs.com/docs/)
- [EmailJS React統合](https://www.emailjs.com/docs/examples/reactjs/)
- [GitHub Pagesデプロイガイド](./GITHUB_PAGES_DEPLOYMENT.md)
