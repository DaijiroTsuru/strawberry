import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { fetchShopPolicies, ShopPolicy } from '@/utils/shopify';
import { SEO, createBreadcrumbSchema } from '@/app/components/SEO';

export function RefundPolicyPage() {
  const [policy, setPolicy] = useState<ShopPolicy | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPolicy() {
      try {
        const policies = await fetchShopPolicies();
        setPolicy(policies.refundPolicy);
      } catch (error) {
        console.error('Failed to load refund policy:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadPolicy();
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title="返品・交換ポリシー"
        description="つるいちご園の返品・交換に関するポリシーをご確認ください。"
        url="/refund-policy"
        structuredData={createBreadcrumbSchema([
          { name: 'ホーム', url: '/' },
          { name: '返品・交換ポリシー', url: '/refund-policy' },
        ])}
      />

      {/* ヘッダースペース */}
      <div className="h-20 lg:h-24"></div>

      {/* ヒーローセクション */}
      <section className="relative py-20 lg:py-32 px-4 overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--color-strawberry-50) 0%, var(--color-neutral-50) 100%)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 mb-8 transition-colors duration-300"
              style={{ color: 'var(--color-neutral-600)', fontFamily: 'var(--font-sans)' }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>ホームに戻る</span>
            </Link>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8" style={{ background: 'linear-gradient(135deg, var(--color-strawberry-100) 0%, var(--color-strawberry-200) 100%)', border: '1px solid var(--color-strawberry-300)' }}>
              <RotateCcw className="w-4 h-4" style={{ color: 'var(--color-strawberry-700)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--color-strawberry-800)', fontFamily: 'var(--font-sans)', letterSpacing: '0.05em' }}>Refund Policy</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold mb-6" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-neutral-900)', letterSpacing: '0.02em' }}>
              返品・交換ポリシー
            </h1>
          </motion.div>
        </div>
      </section>

      {/* コンテンツ */}
      <section className="py-16 lg:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--color-strawberry-500)' }}></div>
            </div>
          ) : policy ? (
            <div className="prose prose-lg max-w-none" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-800)' }}>
              <div
                className="policy-content"
                dangerouslySetInnerHTML={{ __html: policy.body }}
              />
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg" style={{ color: 'var(--color-neutral-600)', fontFamily: 'var(--font-sans)' }}>
                返品・交換ポリシーは現在準備中です。
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
