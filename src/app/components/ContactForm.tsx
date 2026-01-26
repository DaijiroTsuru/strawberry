import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle2, AlertCircle, Shield } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { trackContactFormSubmission } from '@/utils/analytics';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);

  // reCAPTCHA v3スクリプトの読み込み
  useEffect(() => {
    const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
    
    if (!siteKey) {
      console.warn('reCAPTCHA Site Key が設定されていません');
      return;
    }

    // reCAPTCHAスクリプトが既に読み込まれているかチェック
    if (document.querySelector(`script[src*="recaptcha"]`)) {
      setRecaptchaLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => setRecaptchaLoaded(true);
    document.head.appendChild(script);

    return () => {
      // クリーンアップ（必要に応じて）
    };
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'お名前を入力してください';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスを入力してください';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'お問い合わせ内容を入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setStatus('submitting');

    try {
      let recaptchaToken = '';

      // reCAPTCHA v3トークンの取得（スコア確認用）
      const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
      if (siteKey && recaptchaLoaded && (window as any).grecaptcha) {
        try {
          recaptchaToken = await (window as any).grecaptcha.execute(siteKey, {
            action: 'contact_form'
          });
          console.log('reCAPTCHA token obtained');
        } catch (error) {
          console.warn('reCAPTCHA token取得エラー:', error);
          // reCAPTCHAエラーでも送信は続行（開発環境対応）
        }
      }

      // EmailJSで送信
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error('EmailJSの設定が不完全です。環境変数を確認してください。');
      }

      // EmailJS送信用のパラメータ
      const templateParams = {
        name: formData.name,
        email: formData.email,
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone || 'なし',
        subject: formData.subject || 'その他',
        message: formData.message,
        g_recaptcha_response: recaptchaToken,
      };

      await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      );

      // 成功時の処理
      console.log('Form submitted successfully via EmailJS');
      setStatus('success');
      
      // Google Analyticsコンバージョントラッキング
      trackContactFormSubmission({
        subject: formData.subject,
        email: formData.email,
      });
      
      // フォームをリセット
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });

      // 3秒後にステータスをリセット
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
      
      // 3秒後にステータスをリセット
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // エラーをクリア
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="mt-16 lg:mt-20"
    >
      <div 
        className="rounded-3xl p-8 lg:p-12 shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, var(--color-neutral-50) 0%, white 100%)',
          border: '1px solid var(--color-neutral-200)'
        }}
      >
        <div className="mb-8">
          <h3 
            className="text-2xl lg:text-3xl font-bold mb-3"
            style={{ 
              fontFamily: 'var(--font-serif)',
              color: 'var(--color-neutral-900)'
            }}
          >
            お問い合わせフォーム
          </h3>
          <p 
            style={{ 
              fontFamily: 'var(--font-sans)',
              color: 'var(--color-neutral-600)'
            }}
          >
            ご質問やご要望がございましたら、お気軽にお問い合わせください。
          </p>
        </div>

        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl flex items-center gap-3"
            style={{
              background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
              border: '1px solid #6ee7b7'
            }}
          >
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: '#059669' }} />
            <p style={{ color: '#065f46', fontFamily: 'var(--font-sans)', fontWeight: 500 }}>
              お問い合わせを送信しました。ご連絡ありがとうございます！
            </p>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl flex items-center gap-3"
            style={{
              background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
              border: '1px solid #fca5a5'
            }}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#dc2626' }} />
            <p style={{ color: '#991b1b', fontFamily: 'var(--font-sans)', fontWeight: 500 }}>
              送信中にエラーが発生しました。もう一度お試しください。
            </p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* お名前 */}
          <div>
            <label 
              htmlFor="name"
              className="block mb-2 font-medium"
              style={{ 
                fontFamily: 'var(--font-sans)',
                color: 'var(--color-neutral-700)'
              }}
            >
              お名前 <span style={{ color: 'var(--color-strawberry-600)' }}>*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2"
              style={{
                border: errors.name ? '1px solid var(--color-strawberry-500)' : '1px solid var(--color-neutral-300)',
                fontFamily: 'var(--font-sans)',
                backgroundColor: 'white'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--color-strawberry-500)';
                e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
              }}
              onBlur={(e) => {
                if (!errors.name) {
                  e.target.style.borderColor = 'var(--color-neutral-300)';
                }
                e.target.style.boxShadow = 'none';
              }}
            />
            {errors.name && (
              <p className="mt-2 text-sm" style={{ color: 'var(--color-strawberry-600)', fontFamily: 'var(--font-sans)' }}>
                {errors.name}
              </p>
            )}
          </div>

          {/* メールアドレス */}
          <div>
            <label 
              htmlFor="email"
              className="block mb-2 font-medium"
              style={{ 
                fontFamily: 'var(--font-sans)',
                color: 'var(--color-neutral-700)'
              }}
            >
              メールアドレス <span style={{ color: 'var(--color-strawberry-600)' }}>*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2"
              style={{
                border: errors.email ? '1px solid var(--color-strawberry-500)' : '1px solid var(--color-neutral-300)',
                fontFamily: 'var(--font-sans)',
                backgroundColor: 'white'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--color-strawberry-500)';
                e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
              }}
              onBlur={(e) => {
                if (!errors.email) {
                  e.target.style.borderColor = 'var(--color-neutral-300)';
                }
                e.target.style.boxShadow = 'none';
              }}
            />
            {errors.email && (
              <p className="mt-2 text-sm" style={{ color: 'var(--color-strawberry-600)', fontFamily: 'var(--font-sans)' }}>
                {errors.email}
              </p>
            )}
          </div>

          {/* 電話番号 */}
          <div>
            <label 
              htmlFor="phone"
              className="block mb-2 font-medium"
              style={{ 
                fontFamily: 'var(--font-sans)',
                color: 'var(--color-neutral-700)'
              }}
            >
              電話番号（任意）
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2"
              style={{
                border: '1px solid var(--color-neutral-300)',
                fontFamily: 'var(--font-sans)',
                backgroundColor: 'white'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--color-strawberry-500)';
                e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--color-neutral-300)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* 件名 */}
          <div>
            <label 
              htmlFor="subject"
              className="block mb-2 font-medium"
              style={{ 
                fontFamily: 'var(--font-sans)',
                color: 'var(--color-neutral-700)'
              }}
            >
              件名（任意）
            </label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2"
              style={{
                border: '1px solid var(--color-neutral-300)',
                fontFamily: 'var(--font-sans)',
                backgroundColor: 'white'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--color-strawberry-500)';
                e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--color-neutral-300)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="">選択してください</option>
              <option value="いちご狩りについて">いちご狩りについて</option>
              <option value="いちごの購入について">いちごの購入について</option>
              <option value="アクセス・営業時間について">アクセス・営業時間について</option>
              <option value="その他">その他</option>
            </select>
          </div>

          {/* お問い合わせ内容 */}
          <div>
            <label 
              htmlFor="message"
              className="block mb-2 font-medium"
              style={{ 
                fontFamily: 'var(--font-sans)',
                color: 'var(--color-neutral-700)'
              }}
            >
              お問い合わせ内容 <span style={{ color: 'var(--color-strawberry-600)' }}>*</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-3 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 resize-none"
              style={{
                border: errors.message ? '1px solid var(--color-strawberry-500)' : '1px solid var(--color-neutral-300)',
                fontFamily: 'var(--font-sans)',
                backgroundColor: 'white'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--color-strawberry-500)';
                e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
              }}
              onBlur={(e) => {
                if (!errors.message) {
                  e.target.style.borderColor = 'var(--color-neutral-300)';
                }
                e.target.style.boxShadow = 'none';
              }}
            />
            {errors.message && (
              <p className="mt-2 text-sm" style={{ color: 'var(--color-strawberry-600)', fontFamily: 'var(--font-sans)' }}>
                {errors.message}
              </p>
            )}
          </div>

          {/* 送信ボタン */}
          <motion.button
            type="submit"
            disabled={status === 'submitting'}
            whileHover={{ scale: status === 'submitting' ? 1 : 1.02 }}
            whileTap={{ scale: status === 'submitting' ? 1 : 0.98 }}
            className="w-full px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: status === 'submitting' 
                ? 'var(--color-neutral-400)' 
                : 'linear-gradient(135deg, var(--color-strawberry-600) 0%, var(--color-strawberry-700) 100%)',
              color: 'white',
              fontFamily: 'var(--font-sans)',
              boxShadow: status === 'submitting' ? 'none' : '0 4px 12px rgba(220, 38, 38, 0.3)'
            }}
          >
            {status === 'submitting' ? (
              <>
                <div 
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                />
                送信中...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                送信する
              </>
            )}
          </motion.button>

          {/* reCAPTCHA v3 バッジ表示の注記 */}
          {recaptchaLoaded && (
            <div className="mt-4 flex items-center justify-center gap-2 text-xs" style={{ color: 'var(--color-neutral-500)' }}>
              <Shield className="w-3 h-3" />
              <span>
                このサイトはreCAPTCHA v3によって保護されており、Googleの
                <a 
                  href="https://policies.google.com/privacy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:text-strawberry-600"
                  style={{ marginLeft: '0.25rem', marginRight: '0.25rem' }}
                >
                  プライバシーポリシー
                </a>
                と
                <a 
                  href="https://policies.google.com/terms" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:text-strawberry-600"
                  style={{ marginLeft: '0.25rem' }}
                >
                  利用規約
                </a>
                が適用されます。
              </span>
            </div>
          )}
        </form>
      </div>
    </motion.div>
  );
}
