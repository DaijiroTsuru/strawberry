import { useEffect } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { LogIn, ArrowLeft, AlertCircle } from 'lucide-react';
import { SEO } from '@/app/components/SEO';
import { useAuth } from '@/app/contexts/AuthContext';

export function LoginPage() {
  const { initiateLogin, isAuthenticated, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/mypage' });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async () => {
    clearError();
    await initiateLogin();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--color-strawberry-500)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SEO title="ログイン" noindex />

      <div className="h-20 lg:h-24"></div>

      <section
        className="relative py-20 lg:py-32 px-4 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, var(--color-strawberry-50) 0%, var(--color-neutral-50) 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 mb-8 transition-colors duration-300 hover:text-[color:var(--color-strawberry-600)]"
              style={{ color: 'var(--color-neutral-600)', fontFamily: 'var(--font-sans)', cursor: 'pointer' }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>ホームに戻る</span>
            </Link>

            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
              style={{
                background: 'linear-gradient(135deg, var(--color-strawberry-100) 0%, var(--color-strawberry-200) 100%)',
                border: '1px solid var(--color-strawberry-300)',
              }}
            >
              <LogIn className="w-4 h-4" style={{ color: 'var(--color-strawberry-700)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--color-strawberry-800)', fontFamily: 'var(--font-sans)', letterSpacing: '0.05em' }}>
                LOGIN
              </span>
            </div>

            <h1
              className="text-5xl lg:text-7xl font-bold mb-6"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-neutral-900)', letterSpacing: '0.02em' }}
            >
              ログイン
            </h1>
            <p
              className="text-xl lg:text-2xl mb-8 max-w-3xl"
              style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)', lineHeight: '1.8' }}
            >
              会員の方はログインしてください
            </p>
          </motion.div>
        </div>

        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: 'var(--color-strawberry-400)' }}></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: 'var(--color-strawberry-300)' }}></div>
      </section>

      <section className="py-20 px-4" style={{ background: 'var(--color-neutral-50)' }}>
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="rounded-3xl p-8 lg:p-12 shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, var(--color-neutral-50) 0%, white 100%)',
                border: '1px solid var(--color-neutral-200)',
              }}
            >
              <div className="space-y-6">
                <p className="text-center" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-600)', lineHeight: '1.8' }}>
                  Shopifyアカウントでログインできます。
                </p>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl flex items-center gap-3"
                    style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', border: '1px solid #fca5a5' }}
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#dc2626' }} />
                    <p style={{ color: '#991b1b', fontFamily: 'var(--font-sans)', fontWeight: 500 }}>{error}</p>
                  </motion.div>
                )}

                <motion.button
                  type="button"
                  onClick={handleLogin}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-strawberry-600) 0%, var(--color-strawberry-700) 100%)',
                    color: 'white',
                    fontFamily: 'var(--font-sans)',
                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
                  }}
                >
                  <LogIn className="w-5 h-5" />
                  ログイン
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
