import type { VercelRequest, VercelResponse } from '@vercel/node';
import sgMail from '@sendgrid/mail';

// SendGrid APIキーの設定
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORSヘッダーの設定
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // プリフライトリクエストへの対応
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // POSTメソッドのみ許可
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, subject, message, recaptchaToken } = req.body;

    // バリデーション
    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: 'お名前、メールアドレス、お問い合わせ内容は必須です' 
      });
    }

    // メールアドレスの簡易バリデーション
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: '有効なメールアドレスを入力してください' 
      });
    }

    // reCAPTCHA v3 検証（本番環境のみ推奨）
    if (recaptchaToken && process.env.RECAPTCHA_SECRET_KEY) {
      try {
        const recaptchaResponse = await fetch(
          'https://www.google.com/recaptcha/api/siteverify',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
          }
        );

        const recaptchaData = await recaptchaResponse.json();

        // スコアが0.5未満の場合はスパムと判定
        if (!recaptchaData.success || recaptchaData.score < 0.5) {
          console.warn('reCAPTCHA failed:', recaptchaData);
          return res.status(400).json({ 
            error: 'スパム検出のため送信できませんでした。しばらくしてから再度お試しください。' 
          });
        }

        console.log('reCAPTCHA verified. Score:', recaptchaData.score);
      } catch (error) {
        console.error('reCAPTCHA verification error:', error);
        // reCAPTCHA検証エラーでも送信は続行（開発環境対応）
      }
    }

    // 件名のマッピング
    const subjectMap: Record<string, string> = {
      'ichigogari': 'いちご狩りについて',
      'purchase': 'いちごの購入について',
      'access': 'アクセス・営業時間について',
      'other': 'その他',
    };

    const formattedSubject = subject && subjectMap[subject] 
      ? subjectMap[subject] 
      : subject || 'お問い合わせ';

    // 送信するメールの内容
    const msg = {
      to: process.env.CONTACT_EMAIL || 'info@tsuru-ichigo.com', // 農園のメールアドレス
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || 'noreply@tsuru-ichigo.com',
        name: '津留いちご園 お問い合わせフォーム',
      },
      replyTo: {
        email: email,
        name: name,
      },
      subject: `【お問い合わせ】${formattedSubject}`,
      html: `
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
              .header h1 {
                margin: 0;
                font-size: 24px;
              }
              .content {
                background: #f9fafb;
                padding: 30px 20px;
                border-left: 1px solid #e5e7eb;
                border-right: 1px solid #e5e7eb;
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
              .message-box {
                background: white;
                padding: 20px;
                border-radius: 8px;
                border: 1px solid #e5e7eb;
                margin-top: 10px;
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
                <div class="field-value">${formattedSubject}</div>
              </div>

              <div class="field">
                <div class="field-label">👤 お名前</div>
                <div class="field-value">${name}</div>
              </div>

              <div class="field">
                <div class="field-label">📧 メールアドレス</div>
                <div class="field-value"><a href="mailto:${email}">${email}</a></div>
              </div>

              ${phone ? `
              <div class="field">
                <div class="field-label">📱 電話番号</div>
                <div class="field-value"><a href="tel:${phone}">${phone}</a></div>
              </div>
              ` : ''}

              <div class="field">
                <div class="field-label">💬 お問い合わせ内容</div>
                <div class="message-box">
                  <div class="field-value">${message.replace(/\n/g, '<br>')}</div>
                </div>
              </div>
            </div>

            <div class="footer">
              <p>このメールは津留いちご園のお問い合わせフォームから自動送信されました。</p>
              <p>返信する場合は、上記のメールアドレスまたは電話番号にご連絡ください。</p>
            </div>
          </body>
        </html>
      `,
      text: `
【お問い合わせ】${formattedSubject}

件名: ${formattedSubject}
お名前: ${name}
メールアドレス: ${email}
${phone ? `電話番号: ${phone}` : ''}

お問い合わせ内容:
${message}

---
このメールは津留いちご園のお問い合わせフォームから自動送信されました。
      `.trim(),
    };

    // SendGridでメール送信
    await sgMail.send(msg);

    // 成功レスポンス
    return res.status(200).json({ 
      success: true,
      message: 'お問い合わせを送信しました' 
    });

  } catch (error: any) {
    console.error('SendGrid Error:', error);
    
    // SendGridのエラーメッセージを解析
    if (error.response) {
      console.error('SendGrid Error Body:', error.response.body);
    }

    return res.status(500).json({ 
      error: 'メールの送信に失敗しました。しばらくしてから再度お試しください。',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
