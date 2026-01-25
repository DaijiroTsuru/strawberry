import { Link } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { HelpCircle, ArrowLeft, Package, Truck, ShoppingCart, Calendar, MapPin, CreditCard } from 'lucide-react';
import { FARM_INFO, SHIPPING } from '@/app/constants/farmInfo';
import { SEO, createBreadcrumbSchema } from '@/app/components/SEO';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/app/components/ui/accordion';

export function FaqPage() {
  const faqCategories = [
    {
      category: '商品について',
      icon: Package,
      questions: [
        {
          id: 'product-1',
          question: 'いちごの品種は何ですか？',
          answer: `当園では「${FARM_INFO.features.strawberryVariety}」という品種を栽培しています。上品な香りとあっさりとしたみずみずしい甘さがある人気のブランドいちごで、大粒なのに糖度が高く酸味が少ないのが特徴です。`,
        },
        {
          id: 'product-2',
          question: '無農薬栽培とはどういう意味ですか？',
          answer: `${FARM_INFO.features.motto}しています。化学合成農薬や除草剤を一切使わず、油粕、米糠、海藻、魚粉、黒砂糖などの有機質肥料のみで育てています。安心・安全な農産物をお届けすることを第一に考えています。`,
        },
        {
          id: 'product-3',
          question: 'いちごの鮮度はどうですか？',
          answer: 'その日の朝に収穫した新鮮ないちごを、一粒ずつ丁寧に選別してお届けしています。収穫から発送まで最短時間で行うため、届いたその日から最高の状態でお楽しみいただけます。',
        },
        {
          id: 'product-4',
          question: 'いちごの保存方法を教えてください',
          answer: '冷蔵庫の野菜室で保存してください。洗わずにヘタをつけたまま保存し、食べる直前に洗うことをおすすめします。なるべく早くお召し上がりいただくことで、より美味しくお楽しみいただけます。',
        },
      ],
    },
    {
      category: 'ご注文・お支払いについて',
      icon: ShoppingCart,
      questions: [
        {
          id: 'order-1',
          question: '注文方法を教えてください',
          answer: `オンラインショップからのご注文のほか、お電話（${FARM_INFO.contact.phone}）、メール（${FARM_INFO.contact.email}）でもご注文を承っております。お気軽にお問い合わせください。`,
        },
        {
          id: 'order-2',
          question: 'どのような支払い方法がありますか？',
          answer: 'クレジットカード決済、銀行振込、代金引換をご利用いただけます。オンラインショップではクレジットカード決済が便利です。',
        },
        {
          id: 'order-3',
          question: '注文のキャンセルや変更はできますか？',
          answer: '発送前であればキャンセル・変更が可能です。発送準備に入る前にお早めにご連絡ください。発送後のキャンセルはお受けできかねますので、ご了承ください。',
        },
        {
          id: 'order-4',
          question: '領収書は発行できますか？',
          answer: '領収書が必要な場合は、ご注文時の備考欄にその旨をご記入いただくか、お電話・メールにてお知らせください。商品に同梱、または別途郵送にて発行させていただきます。',
        },
      ],
    },
    {
      category: '配送について',
      icon: Truck,
      questions: [
        {
          id: 'shipping-1',
          question: '送料はいくらですか？',
          answer: `送料は全国一律${SHIPPING.standardFee.toLocaleString()}円です。${SHIPPING.note}`,
        },
        {
          id: 'shipping-2',
          question: '配送日時の指定はできますか？',
          answer: 'はい、可能です。ご注文時に配送日時をご指定いただけます。ただし、天候や収穫状況により、ご希望に添えない場合もございますので、あらかじめご了承ください。',
        },
        {
          id: 'shipping-3',
          question: 'いつ頃届きますか？',
          answer: 'ご注文確定後、通常3〜7日程度でお届けします。収穫時期や天候により前後する場合がございます。お急ぎの場合は、ご注文時にお知らせください。',
        },
        {
          id: 'shipping-4',
          question: 'ギフト包装はできますか？',
          answer: '化粧箱入りの商品は、ギフトに最適な包装でお届けします。熨斗やメッセージカードのご希望がある場合は、ご注文時にお知らせください。',
        },
      ],
    },
    {
      category: 'いちご狩りについて',
      icon: Calendar,
      questions: [
        {
          id: 'picking-1',
          question: 'いちご狩りの予約は必要ですか？',
          answer: 'はい、いちご狩りは完全予約制です。事前にお電話またはメールにてご予約ください。当日のご来園はお受けできない場合がございますので、必ずご予約をお願いいたします。',
        },
        {
          id: 'picking-2',
          question: 'いちご狩りの料金を教えてください',
          answer: '料金は時期により異なります。12月〜2月：大人2,000円、子供1,000円、3月：大人1,900円、子供950円、4月〜：大人1,800円、子供900円です。30分間の食べ放題となっています。',
        },
        {
          id: 'picking-3',
          question: 'いちご狩りの期間はいつですか？',
          answer: '例年12月から5月頃までいちご狩りをお楽しみいただけます。その年の生育状況により期間が変わる場合がございますので、詳しくはお問い合わせください。',
        },
        {
          id: 'picking-4',
          question: 'どのような服装で行けばいいですか？',
          answer: 'ビニールハウス内は暖かいため、調整しやすい服装がおすすめです。また、足元の土が緩んでいることがありますので、靴はスニーカーや長靴などをおすすめいたします。',
        },
        {
          id: 'picking-5',
          question: '持ち帰りはできますか？',
          answer: 'はい、別料金にて持ち帰り用のいちごもご用意しております。時期により100gあたり250円〜300円でお持ち帰りいただけます。',
        },
      ],
    },
    {
      category: 'その他',
      icon: HelpCircle,
      questions: [
        {
          id: 'other-1',
          question: '農園の営業時間を教えてください',
          answer: '営業時間は9:00〜17:00です。定休日や臨時休業がある場合がございますので、ご来園前にお電話にてご確認いただくことをおすすめします。',
        },
        {
          id: 'other-2',
          question: '駐車場はありますか？',
          answer: 'はい、無料駐車場をご用意しております。お車でお越しの際は、八女ICより約20分です。',
        },
        {
          id: 'other-3',
          question: 'アレルギーへの対応はありますか？',
          answer: '当園ではいちごとお米を中心に栽培しており、いちごにアレルギーのある方はお召し上がりになれません。その他、ご不安な点がございましたら、事前にお問い合わせください。',
        },
        {
          id: 'other-4',
          question: '直売所での購入はできますか？',
          answer: `はい、農園の直売所でも商品をお買い求めいただけます。ただし、商品の在庫状況により、ご希望の商品がない場合もございますので、ご来園前にお電話（${FARM_INFO.contact.phone}）にてご確認いただくことをおすすめします。`,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <SEO 
        title="よくあるご質問"
        description="津留いちご園へのよくあるご質問をまとめました。商品、ご注文、配送、いちご狩りなどについてのご質問にお答えします。"
        keywords="FAQ,よくある質問,いちご,いちご狩り,配送,注文方法,津留いちご園"
        url="/faq"
        structuredData={createBreadcrumbSchema([
          { name: 'ホーム', url: '/' },
          { name: 'よくあるご質問', url: '/faq' },
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
                <MapPin className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-xs opacity-90">お電話でのお問い合わせ</div>
                  <div className="text-lg">{FARM_INFO.contact.phone}</div>
                </div>
              </a>
              <a
                href={`mailto:${FARM_INFO.contact.email}`}
                className="flex items-center justify-center gap-3 px-8 py-5 rounded-2xl transition-all duration-300 hover:shadow-lg"
                style={{ 
                  background: 'white', 
                  color: 'var(--color-neutral-700)', 
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 600,
                  border: '2px solid var(--color-neutral-300)'
                }}
              >
                <CreditCard className="w-5 h-5" style={{ color: 'var(--color-strawberry-600)' }} />
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
