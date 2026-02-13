import { useEffect } from 'react';
import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { motion } from 'motion/react';
import * as Tabs from '@radix-ui/react-tabs';
import { User, ArrowLeft, LogOut, Package, UserCircle, MapPin } from 'lucide-react';
import { SEO } from '@/app/components/SEO';
import { useAuth } from '@/app/contexts/AuthContext';
import { OrderHistory } from '@/app/components/mypage/OrderHistory';
import { ProfileEdit } from '@/app/components/mypage/ProfileEdit';
import { AddressManagement } from '@/app/components/mypage/AddressManagement';

const TABS = [
  { value: 'orders', label: '注文履歴', icon: Package },
  { value: 'profile', label: 'プロフィール', icon: UserCircle },
  { value: 'addresses', label: '配送先住所', icon: MapPin },
] as const;

type TabValue = (typeof TABS)[number]['value'];

export function MyPage() {
  const { customer, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  // URLクエリパラメータからタブを取得
  const search = useSearch({ strict: false }) as { tab?: string };
  const currentTab = (TABS.some((t) => t.value === search.tab) ? search.tab : 'orders') as TabValue;

  // 未ログインなら /login にリダイレクト
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: '/login' });
    }
  }, [isLoading, isAuthenticated, navigate]);

  const handleTabChange = (value: string) => {
    navigate({ to: '/mypage', search: { tab: value } });
  };

  const handleLogout = async () => {
    await logout();
    // logout() が Shopify へリダイレクトしない場合のフォールバック
    navigate({ to: '/' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: 'var(--color-strawberry-500)', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  if (!isAuthenticated || !customer) {
    return null;
  }

  const displayName = [customer.lastName, customer.firstName].filter(Boolean).join(' ') || customer.email;

  return (
    <div className="min-h-screen">
      <SEO title="マイページ" noindex />

      {/* ヘッダースペース */}
      <div className="h-20 lg:h-24"></div>

      {/* ヒーローセクション */}
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
              style={{
                color: 'var(--color-neutral-600)',
                fontFamily: 'var(--font-sans)',
                cursor: 'pointer',
              }}
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
              <User className="w-4 h-4" style={{ color: 'var(--color-strawberry-700)' }} />
              <span
                className="text-sm font-medium"
                style={{
                  color: 'var(--color-strawberry-800)',
                  fontFamily: 'var(--font-sans)',
                  letterSpacing: '0.05em',
                }}
              >
                MY PAGE
              </span>
            </div>

            <h1
              className="text-5xl lg:text-7xl font-bold mb-6"
              style={{
                fontFamily: 'var(--font-serif)',
                color: 'var(--color-neutral-900)',
                letterSpacing: '0.02em',
              }}
            >
              マイページ
            </h1>
            <p
              className="text-xl lg:text-2xl mb-8 max-w-3xl"
              style={{
                fontFamily: 'var(--font-sans)',
                color: 'var(--color-neutral-700)',
                lineHeight: '1.8',
              }}
            >
              {displayName} さん、ようこそ
            </p>
          </motion.div>
        </div>

        <div
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: 'var(--color-strawberry-400)' }}
        ></div>
        <div
          className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: 'var(--color-strawberry-300)' }}
        ></div>
      </section>

      {/* コンテンツ */}
      <section className="py-16 lg:py-20 px-4" style={{ background: 'var(--color-neutral-50)' }}>
        <div className="max-w-5xl mx-auto">
          <Tabs.Root value={currentTab} onValueChange={handleTabChange}>
            {/* タブリスト */}
            <Tabs.List
              className="flex flex-wrap gap-2 mb-10 p-1.5 rounded-2xl"
              style={{ background: 'white', border: '1px solid var(--color-neutral-200)' }}
            >
              {TABS.map(({ value, label, icon: Icon }) => (
                <Tabs.Trigger
                  key={value}
                  value={value}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex-1 min-w-[120px] justify-center data-[state=active]:shadow-md"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    color: currentTab === value ? 'white' : 'var(--color-neutral-600)',
                    background:
                      currentTab === value
                        ? 'linear-gradient(135deg, var(--color-strawberry-600) 0%, var(--color-strawberry-700) 100%)'
                        : 'transparent',
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            {/* タブコンテンツ */}
            <Tabs.Content value="orders">
              <OrderHistory />
            </Tabs.Content>
            <Tabs.Content value="profile">
              <ProfileEdit />
            </Tabs.Content>
            <Tabs.Content value="addresses">
              <AddressManagement />
            </Tabs.Content>
          </Tabs.Root>

          {/* ログアウト */}
          <div className="mt-16 pt-8" style={{ borderTop: '1px solid var(--color-neutral-200)' }}>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-[color:var(--color-neutral-100)]"
              style={{
                color: 'var(--color-neutral-600)',
                fontFamily: 'var(--font-sans)',
                border: '1px solid var(--color-neutral-300)',
              }}
            >
              <LogOut className="w-4 h-4" />
              ログアウト
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
