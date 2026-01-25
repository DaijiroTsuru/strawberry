# 問い合わせフォーム連携ガイド

## 概要

問い合わせフォームコンポーネント (`ContactForm.tsx`) を実装しました。
現在はフロントエンドのみで、バックエンドAPIへの連携が必要です。

## Shopify APIについて

**重要**: Shopifyには直接的な「問い合わせフォームAPI」は存在しません。
- Shopify Liquid テーマの `{% form 'contact' %}` はテーマ専用
- Storefront API は商品・カート・チェックアウト用
- 顧客作成APIはありますが、問い合わせ送信には適していません

## 推奨される実装方法

### オプション1: EmailJS（最も簡単）

**メリット**:
- バックエンド不要
- 無料プラン: 月200通まで
- 簡単なセットアップ

**実装手順**:

1. EmailJSアカウント作成: https://www.emailjs.com/

2. パッケージインストール:
```bash
npm install @emailjs/browser
```

3. `ContactForm.tsx` の `handleSubmit` を更新:
```typescript
import emailjs from '@emailjs/browser';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;

  setStatus('submitting');

  try {
    await emailjs.send(
      'YOUR_SERVICE_ID',
      'YOUR_TEMPLATE_ID',
      {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      },
      'YOUR_PUBLIC_KEY'
    );

    setStatus('success');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setTimeout(() => setStatus('idle'), 3000);
  } catch (error) {
    console.error('Error:', error);
    setStatus('error');
    setTimeout(() => setStatus('idle'), 3000);
  }
};
```

4. 環境変数設定 (`.env`):
```
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

---

### オプション2: Formspree（シンプル）

**メリット**:
- バックエンド不要
- 無料プラン: 月50通まで
- スパム対策機能付き

**実装手順**:

1. Formspreeアカウント作成: https://formspree.io/

2. `ContactForm.tsx` の `handleSubmit` を更新:
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;

  setStatus('submitting');

  try {
    const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) throw new Error('送信に失敗しました');

    setStatus('success');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setTimeout(() => setStatus('idle'), 3000);
  } catch (error) {
    console.error('Error:', error);
    setStatus('error');
    setTimeout(() => setStatus('idle'), 3000);
  }
};
```

---

### オプション3: Vercel/Netlify Serverless Functions

**メリット**:
- 完全なカスタマイズ可能
- Gmail/SendGrid等を使用可能
- 無料枠が大きい

**実装手順**:

1. Vercel Serverless Function作成 (`/api/contact.ts`):
```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, subject, message } = req.body;

  // nodemailerでメール送信
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: '農園のメールアドレス',
      subject: `【お問い合わせ】${subject || '件名なし'}`,
      html: `
        <h2>新しいお問い合わせがあります</h2>
        <p><strong>お名前:</strong> ${name}</p>
        <p><strong>メール:</strong> ${email}</p>
        <p><strong>電話:</strong> ${phone || 'なし'}</p>
        <p><strong>件名:</strong> ${subject || 'なし'}</p>
        <p><strong>内容:</strong></p>
        <p>${message}</p>
      `,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
}
```

2. 依存関係追加:
```bash
npm install nodemailer
npm install -D @types/nodemailer @vercel/node
```

3. `ContactForm.tsx` の `handleSubmit` を更新:
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;

  setStatus('submitting');

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (!response.ok) throw new Error('送信に失敗しました');

    setStatus('success');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setTimeout(() => setStatus('idle'), 3000);
  } catch (error) {
    console.error('Error:', error);
    setStatus('error');
    setTimeout(() => setStatus('idle'), 3000);
  }
};
```

---

### オプション4: Shopify Customer Metafields（高度）

**メリット**:
- Shopifyに統合
- 顧客情報と紐付け可能

**デメリット**:
- 複雑な実装
- Shopify Admin APIが必要

この方法は推奨しません（通常の問い合わせには過剰）。

---

## 推奨

**初心者・迅速な実装**: **EmailJS（オプション1）**
**中級者・コスト重視**: **Formspree（オプション2）**
**上級者・カスタマイズ重視**: **Serverless Functions（オプション3）**

---

## セキュリティ注意事項

1. **APIキーは環境変数に保存**
2. **スパム対策の実装**（reCAPTCHA等）
3. **レート制限の設定**
4. **バリデーションの強化**

---

## 次のステップ

1. 上記のいずれかの方法を選択
2. 必要なアカウント/サービスを作成
3. `ContactForm.tsx` の `handleSubmit` を実装
4. 環境変数を設定
5. テスト送信を実施
