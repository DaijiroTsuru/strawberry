import { useEffect, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { AlertCircle } from 'lucide-react';
import { SEO } from '@/app/components/SEO';
import { useAuth } from '@/app/contexts/AuthContext';

export function AuthCallbackPage() {
  const { handleAuthCallback } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');
      const errorParam = params.get('error');

      if (errorParam) {
        const errorDescription = params.get('error_description') || '認証に失敗しました';
        setError(errorDescription);
        return;
      }

      if (!code || !state) {
        setError('認証パラメータが不足しています。再度ログインしてください。');
        return;
      }

      try {
        await handleAuthCallback(code, state);
        navigate({ to: '/mypage' });
      } catch (err) {
        const message = err instanceof Error ? err.message : '認証に失敗しました';
        setError(message);
      }
    };

    processCallback();
  }, [handleAuthCallback, navigate]);

  if (error) {
    return (
      <div className="min-h-screen">
        <SEO title="認証エラー" noindex />
        <div className="h-20 lg:h-24"></div>
        <div className="flex flex-col items-center justify-center py-32 px-4">
          <div
            className="max-w-md w-full rounded-3xl p-8 lg:p-12 shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, var(--color-neutral-50) 0%, white 100%)',
              border: '1px solid var(--color-neutral-200)',
            }}
          >
            <div className="flex flex-col items-center text-center space-y-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)' }}
              >
                <AlertCircle className="w-8 h-8" style={{ color: '#dc2626' }} />
              </div>
              <div>
                <h1
                  className="text-2xl font-bold mb-2"
                  style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-neutral-900)' }}
                >
                  認証エラー
                </h1>
                <p className="text-sm" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-600)', lineHeight: '1.8' }}>
                  {error}
                </p>
              </div>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, var(--color-strawberry-600) 0%, var(--color-strawberry-700) 100%)',
                  color: 'white',
                  fontFamily: 'var(--font-sans)',
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
                }}
              >
                ログインページに戻る
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SEO title="認証中..." noindex />
      <div className="h-20 lg:h-24"></div>
      <div className="flex flex-col items-center justify-center py-32 px-4">
        <div
          className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mb-4"
          style={{ borderColor: 'var(--color-strawberry-500)', borderTopColor: 'transparent' }}
        />
        <p className="text-lg" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-600)' }}>
          認証処理中...
        </p>
      </div>
    </div>
  );
}
