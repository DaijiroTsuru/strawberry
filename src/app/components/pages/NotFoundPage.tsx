import { Link } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { SEO } from '@/app/components/SEO';

export function NotFoundPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <SEO
        title="ページが見つかりません"
        description="お探しのページは見つかりませんでした。URLをご確認いただくか、トップページからお探しください。"
        url="/404"
      />

      {/* ヘッダースペース */}
      <div className="absolute top-0 left-0 right-0 h-20 lg:h-24"></div>

      <div className="text-center max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          {/* 404アイコン */}
          <div
            className="w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, var(--color-strawberry-100) 0%, var(--color-strawberry-200) 100%)',
            }}
          >
            <span
              className="text-5xl font-bold"
              style={{
                fontFamily: 'var(--font-serif)',
                color: 'var(--color-strawberry-600)',
              }}
            >
              404
            </span>
          </div>

          <h1
            className="text-3xl lg:text-4xl font-bold mb-4"
            style={{
              fontFamily: 'var(--font-serif)',
              color: 'var(--color-neutral-900)',
            }}
          >
            ページが見つかりません
          </h1>

          <p
            className="text-lg mb-8"
            style={{
              fontFamily: 'var(--font-sans)',
              color: 'var(--color-neutral-600)',
              lineHeight: '1.8',
            }}
          >
            お探しのページは移動または削除された可能性があります。
            <br />
            URLをご確認いただくか、以下のリンクからお探しください。
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          {/* トップページへ */}
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-full transition-all duration-300 font-semibold"
            style={{
              background: 'linear-gradient(135deg, var(--color-strawberry-600) 0%, var(--color-strawberry-700) 100%)',
              color: 'white',
              fontFamily: 'var(--font-sans)',
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
            }}
          >
            <Home className="w-5 h-5" />
            トップページへ戻る
          </Link>

          {/* クイックリンク */}
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <Link
              to="/strawberries"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-300"
              style={{
                background: 'var(--color-neutral-100)',
                color: 'var(--color-neutral-700)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              厳選いちご
            </Link>
            <Link
              to="/rice"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-300"
              style={{
                background: 'var(--color-neutral-100)',
                color: 'var(--color-neutral-700)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              無農薬栽培米
            </Link>
            <Link
              to="/strawberry-picking"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-300"
              style={{
                background: 'var(--color-neutral-100)',
                color: 'var(--color-neutral-700)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              いちご狩り
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-300"
              style={{
                background: 'var(--color-neutral-100)',
                color: 'var(--color-neutral-700)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              お問い合わせ
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
