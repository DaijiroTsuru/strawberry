import { Link } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { HelpCircle, ArrowLeft, Phone, Mail } from 'lucide-react';
import { FARM_INFO } from '@/app/constants/farmInfo';
import { SEO, createBreadcrumbSchema, createFAQPageSchema } from '@/app/components/SEO';
import { RelatedLinks } from '@/app/components/common/RelatedLinks';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/app/components/ui/accordion';
import { faqCategories } from '@/app/constants/faqData';

const allFaqItems = faqCategories.flatMap((cat) =>
  cat.questions.map((q) => ({ question: q.question, answer: q.answer }))
);

export function FaqPage() {
  return (
    <div className="min-h-screen">
      <SEO
        title="よくあるご質問"
        description="津留いちご園へのよくあるご質問をまとめました。商品、ご注文、配送、いちご狩りなどについてのご質問にお答えします。"
        keywords="FAQ,よくある質問,いちご,いちご狩り,配送,注文方法,津留いちご園"
        url="/faq"
        structuredData={{
          '@context': 'https://schema.org',
          '@graph': [
            createBreadcrumbSchema([
              { name: 'ホーム', url: '/' },
              { name: 'よくあるご質問', url: '/faq' },
            ]),
            createFAQPageSchema(allFaqItems),
          ],
        }}
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
              <HelpCircle className="w-4 h-4" style={{ color: 'var(--color-strawberry-700)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--color-strawberry-800)', fontFamily: 'var(--font-sans)', letterSpacing: '0.05em' }}>FAQ</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold mb-6" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-neutral-900)', letterSpacing: '0.02em' }}>
              よくあるご質問
            </h1>
            <p className="text-xl lg:text-2xl mb-8 max-w-3xl" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)', lineHeight: '1.8' }}>
              お客様からよくいただくご質問をまとめました
            </p>
          </motion.div>
        </div>

        {/* 装飾要素 */}
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: 'var(--color-strawberry-400)' }}></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: 'var(--color-strawberry-300)' }}></div>
      </section>

      {/* FAQ セクション */}
      <section className="py-20 lg:py-32 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          {faqCategories.map((category, categoryIndex) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                className="mb-16 last:mb-0"
              >
                {/* カテゴリーヘッダー */}
                <div className="flex items-center gap-3 mb-8">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, var(--color-strawberry-500) 0%, var(--color-strawberry-600) 100%)' }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-neutral-900)' }}>
                    {category.category}
                  </h2>
                </div>

                {/* 質問アコーディオン */}
                <div className="bg-white rounded-3xl p-8 shadow-lg" style={{ border: '1px solid var(--color-neutral-200)' }}>
                  <Accordion type="single" collapsible className="space-y-4">
                    {category.questions.map((faq) => (
                      <AccordionItem 
                        key={faq.id} 
                        value={faq.id}
                        className="border-b last:border-b-0"
                        style={{ borderColor: 'var(--color-neutral-200)' }}
                      >
                        <AccordionTrigger 
                          className="text-left hover:no-underline group"
                          style={{ fontFamily: 'var(--font-sans)' }}
                        >
                          <span className="text-lg font-semibold group-hover:text-[color:var(--color-strawberry-600)] transition-colors duration-300" style={{ color: 'var(--color-neutral-900)' }}>
                            {faq.question}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <p 
                            className="text-base leading-relaxed pt-2"
                            style={{ 
                              fontFamily: 'var(--font-sans)', 
                              color: 'var(--color-neutral-700)',
                              lineHeight: '1.9',
                              whiteSpace: 'pre-line'
                            }}
                          >
                            {faq.answer}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 関連ページ */}
      <RelatedLinks
        links={[
          { title: '厳選いちご', description: '朝摘みのかおり野を産地直送でお届け。化粧箱入りギフトや家族用パック詰めなど。', href: '/strawberries' },
          { title: '無農薬栽培米', description: '12種類の有機質肥料で育てた、安心・安全なヒノヒカリをお届けします。', href: '/rice' },
          { title: 'お問い合わせ', description: 'ご質問はお気軽にどうぞ。お電話・メールにて承っております。', href: '/contact' },
        ]}
      />

      {/* お問い合わせCTA */}
      <section className="py-20 lg:py-32 px-4" style={{ background: 'var(--color-neutral-50)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{ background: 'linear-gradient(135deg, var(--color-strawberry-500) 0%, var(--color-strawberry-600) 100%)' }}
              >
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-neutral-900)' }}>
                その他のご質問
              </h2>
              <p className="text-lg mb-8" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-600)', lineHeight: '1.8' }}>
                こちらに掲載されていないご質問がございましたら、<br className="hidden sm:block" />
                お気軽にお問い合わせください
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <a
                href={`tel:${FARM_INFO.contact.phone}`}
                className="flex items-center justify-center gap-3 px-8 py-5 rounded-2xl transition-all duration-300 hover:shadow-xl"
                style={{ 
                  background: 'linear-gradient(135deg, var(--color-strawberry-600) 0%, var(--color-strawberry-700) 100%)', 
                  color: 'white', 
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 600
                }}
              >
                <Phone className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-xs opacity-90">お電話でのお問い合わせ</div>
                  <div className="text-lg">{FARM_INFO.contact.phone}</div>
                </div>
              </a>
              <a
                href="/contact"
                className="flex items-center justify-center gap-3 px-8 py-5 rounded-2xl transition-all duration-300 hover:shadow-lg"
                style={{ 
                  background: 'white', 
                  color: 'var(--color-neutral-700)', 
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 600,
                  border: '2px solid var(--color-neutral-300)'
                }}
              >
                <Mail className="w-5 h-5" style={{ color: 'var(--color-strawberry-600)' }} />
                <div className="text-left">
                  <div className="text-xs" style={{ color: 'var(--color-neutral-500)' }}>メールでのお問い合わせ</div>
                  <div className="text-sm">メールを送る</div>
                </div>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
