import { Link } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Package } from 'lucide-react';

/**
 * 注目商品バナーセクション
 * トップページに表示し、特定の商品詳細ページに直接遷移できます
 */
export function FeaturedBannerSection() {
  // 注目商品の設定（handle を変更することで別の商品を表示できます）
  const featuredProducts = [
    {
      handle: 'いちごかおり野特秀-化粧箱入500g',
      title: 'いちご（かおり野）特秀',
      subtitle: '化粧箱入 500g',
      description: 'その日の朝に収穫した新鮮な「かおり野」を真心込めてお届け',
      image: 'https://cdn.shopify.com/s/files/1/0791/6434/2495/files/C575B8A9-AF31-4F3D-A4E0-A168B27A2911_1_105_c.jpg?v=1768511098',
      gradient: 'from-strawberry-500 to-strawberry-700',
      bgColor: 'bg-strawberry-50',
      icon: Sparkles,
      iconColor: 'text-strawberry-600',
    },
    {
      handle: 'お米-ヒノヒカリ-白米',
      title: 'ヒノヒカリ白米',
      subtitle: '無農薬栽培 5kg',
      description: '除草剤や農薬を一切使用せず、有機質肥料で丁寧に育てた安心・安全なお米',
      image: 'https://cdn.shopify.com/s/files/1/0791/6434/2495/files/01F69287-C88A-464C-9CD4-7CE4CA3CB3C4_1_105_c.jpg?v=1768511100',
      gradient: 'from-harvest-500 to-harvest-700',
      bgColor: 'bg-harvest-50',
      icon: Package,
      iconColor: 'text-harvest-600',
    },
  ];

  return (
    <section className="py-20 lg:py-32 px-4" style={{ background: 'var(--color-neutral-50)' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 
            className="text-4xl lg:text-5xl font-bold mb-4" 
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-neutral-900)' }}
          >
            注目商品
          </h2>
          <p 
            className="text-lg max-w-3xl mx-auto" 
            style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-600)', lineHeight: '1.8' }}
          >
            今が旬の厳選商品をご紹介します
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.handle}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <Link
                to="/product/$handle"
                params={{ handle: product.handle }}
                className="group block relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                {/* 背景画像 */}
                <div className="relative h-96 lg:h-[500px] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* グラデーションオーバーレイ */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
                  ></div>
                </div>

                {/* コンテンツ */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-10">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
                  >
                    {/* アイコンバッジ */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 backdrop-blur-md"
                      style={{
                        background: 'rgba(255,255,255,0.15)',
                        border: '1px solid rgba(255,255,255,0.3)',
                      }}
                    >
                      <product.icon className="w-4 h-4 text-white" />
                      <span className="text-xs font-medium text-white tracking-wider" style={{ fontFamily: 'var(--font-sans)' }}>
                        おすすめ
                      </span>
                    </div>

                    <h3 
                      className="text-3xl lg:text-4xl font-bold mb-2 text-white" 
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      {product.title}
                    </h3>
                    <p 
                      className="text-xl lg:text-2xl mb-4 text-white/90 font-light" 
                      style={{ fontFamily: 'var(--font-sans)' }}
                    >
                      {product.subtitle}
                    </p>
                    <p 
                      className="text-base mb-6 text-white/80 max-w-lg" 
                      style={{ fontFamily: 'var(--font-sans)', lineHeight: '1.7' }}
                    >
                      {product.description}
                    </p>

                    {/* CTAボタン */}
                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full backdrop-blur-md group-hover:gap-3 transition-all duration-300"
                      style={{
                        background: 'rgba(255,255,255,0.9)',
                        border: '1px solid rgba(255,255,255,0.3)',
                      }}
                    >
                      <span 
                        className="font-semibold" 
                        style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-900)' }}
                      >
                        詳細を見る
                      </span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" style={{ color: 'var(--color-neutral-900)' }} />
                    </div>
                  </motion.div>
                </div>

                {/* ホバー時の装飾 */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -translate-y-1/2 translate-x-1/2"></div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
