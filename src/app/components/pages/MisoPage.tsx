import { motion } from 'motion/react';
import { Soup, Leaf, Award, ShoppingCart, ArrowLeft, Shield } from 'lucide-react';
import { FARM_INFO, PRODUCTS } from '@/app/constants/farmInfo';

export function MisoPage() {
  const misoProducts = PRODUCTS.miso;

  return (
    <div className="min-h-screen">
      {/* ヘッダースペース */}
      <div className="h-20 lg:h-24"></div>

      {/* ヒーローセクション */}
      <section className="relative py-20 lg:py-32 px-4 overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(35, 65%, 92%) 0%, var(--color-neutral-50) 100%)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <a
              href="/"
              className="inline-flex items-center gap-2 mb-8 transition-colors duration-300"
              style={{ color: 'var(--color-neutral-600)', fontFamily: 'var(--font-sans)' }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>ホームに戻る</span>
            </a>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8" style={{ background: 'linear-gradient(135deg, hsl(35, 60%, 80%) 0%, hsl(35, 60%, 70%) 100%)', border: '1px solid hsl(35, 50%, 60%)' }}>
              <Soup className="w-4 h-4" style={{ color: 'hsl(35, 55%, 35%)' }} />
              <span className="text-sm font-medium" style={{ color: 'hsl(35, 60%, 25%)', fontFamily: 'var(--font-sans)', letterSpacing: '0.05em' }}>Miso</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold mb-6" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-neutral-900)', letterSpacing: '0.02em' }}>
              無添加味噌
            </h1>
            <p className="text-xl lg:text-2xl mb-8 max-w-3xl" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)', lineHeight: '1.8' }}>
              有機肥料のみを使用し農薬は一切使用していないお米、五島灘の塩、国産の大豆を使い、老舗の味噌屋さんに仕込んでいただきました
            </p>
          </motion.div>
        </div>

        {/* 装飾要素 */}
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: 'hsl(35, 70%, 55%)' }}></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: 'hsl(35, 65%, 65%)' }}></div>
      </section>

      {/* こだわりセクション */}
      <section className="py-20 lg:py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: 'linear-gradient(135deg, hsl(35, 60%, 88%) 0%, hsl(35, 60%, 82%) 100%)', border: '1px solid hsl(35, 50%, 72%)' }}>
                <Shield className="w-4 h-4" style={{ color: 'hsl(35, 55%, 35%)' }} />
                <span className="text-sm font-medium" style={{ color: 'hsl(35, 60%, 25%)', fontFamily: 'var(--font-sans)', letterSpacing: '0.05em' }}>Our Commitment</span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-neutral-900)' }}>
                厳選素材で作る<br />無添加の味噌
              </h2>
              <div className="space-y-6">
                <p className="text-lg" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)', lineHeight: '1.9' }}>
                  当園で無農薬栽培したお米を使用し、五島灘の良質な塩と国産大豆を厳選。添加物を一切使用せず、伝統的な製法で仕込んでいます。
                </p>
                <p className="text-lg" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)', lineHeight: '1.9' }}>
                  老舗の味噌屋さんの熟練の技術により、深い旨味とコクのある味噌に仕上がっています。一度、ご賞味くださいませ。
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl" style={{ aspectRatio: '4/5' }}>
                <img
                  src="https://images.unsplash.com/photo-1617093727343-374698b1b08d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                  alt="味噌"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 w-64 h-64 rounded-full -z-10 blur-3xl opacity-20" style={{ background: 'hsl(35, 70%, 55%)' }}></div>
            </motion.div>
          </div>

          {/* 特徴 */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Leaf, title: '無農薬米使用', description: '当園で無農薬栽培したお米を100%使用しています' },
              { icon: Shield, title: '完全無添加', description: '添加物を一切使用せず、自然の旨味を引き出しました' },
              { icon: Award, title: '老舗の技術', description: '伝統的な製法で丁寧に仕込んでいます' },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group p-8 rounded-3xl transition-all duration-500 hover:shadow-2xl"
                style={{ background: 'white', border: '1px solid var(--color-neutral-200)' }}
              >
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110" style={{ background: 'linear-gradient(135deg, hsl(35, 60%, 85%) 0%, hsl(35, 60%, 78%) 100%)', border: '1px solid hsl(35, 50%, 68%)' }}>
                  <feature.icon className="w-8 h-8" style={{ color: 'hsl(35, 55%, 35%)' }} />
                </div>
                <h3 className="font-bold text-xl mb-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-neutral-900)' }}>
                  {feature.title}
                </h3>
                <p style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-600)', lineHeight: '1.7' }}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 商品セクション */}
      <section className="py-20 lg:py-32 px-4" style={{ background: 'var(--color-neutral-50)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-neutral-900)' }}>
              商品情報
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {misoProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                {/* 商品画像 */}
                <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
                  <img
                    src="https://images.unsplash.com/photo-1727337440811-7ae0b89136b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaXNvJTIwcGFzdGUlMjBib3dsfGVufDF8fHx8MTc2ODk3NjE0N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                <div className="p-10 lg:p-12">
                  <h3 className="font-bold text-3xl mb-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-neutral-900)' }}>
                    {product.name}
                  </h3>
                  <p className="mb-8 text-lg" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-600)', lineHeight: '1.8' }}>
                    {product.description}
                  </p>

                  {/* Shopifyから取得する現在価格 */}
                  <div className="mb-8 p-8 rounded-2xl" style={{ background: 'linear-gradient(135deg, hsl(35, 65%, 90%) 0%, hsl(35, 65%, 85%) 100%)', border: '1px solid hsl(35, 60%, 75%)' }}>
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-medium" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-600)' }}>現在価格</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold" style={{ fontFamily: 'var(--font-serif)', color: 'hsl(35, 60%, 45%)' }}>
                          ¥{product.price.toLocaleString()}
                        </span>
                        <span className="text-sm" style={{ color: 'var(--color-neutral-500)' }}>（税込）</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={`#contact`}
                    className="group/btn w-full flex items-center justify-center gap-2 px-8 py-5 rounded-full transition-all duration-300 relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, hsl(35, 60%, 55%) 0%, hsl(35, 60%, 45%) 100%)', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '1.125rem' }}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-[color:hsl(35,60%,45%)] to-[color:hsl(35,60%,35%)] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></span>
                    <ShoppingCart className="w-5 h-5 text-white relative z-10" />
                    <span className="text-white relative z-10">カートに追加</span>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* お問い合わせCTA */}
      <section id="contact" className="py-20 lg:py-32 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-neutral-900)' }}>
              ご注文・お問い合わせ
            </h2>
            <p className="text-lg mb-8" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-600)', lineHeight: '1.8' }}>
              お電話、メールにてご注文を承っております
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`tel:${FARM_INFO.contact.phone}`}
                className="px-8 py-4 rounded-full transition-all duration-300 text-lg font-semibold"
                style={{ background: 'linear-gradient(135deg, hsl(35, 60%, 55%) 0%, hsl(35, 60%, 45%) 100%)', color: 'white', fontFamily: 'var(--font-sans)' }}
              >
                電話で注文
              </a>
              <a
                href={`mailto:${FARM_INFO.contact.email}`}
                className="px-8 py-4 rounded-full transition-all duration-300 text-lg font-semibold"
                style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--color-neutral-700)', fontFamily: 'var(--font-sans)', border: '2px solid var(--color-neutral-300)' }}
              >
                メールで注文
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}