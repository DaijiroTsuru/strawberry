import { motion } from 'motion/react';
import { Cookie, Heart, ShoppingCart, ArrowLeft, Sparkles } from 'lucide-react';
import { FARM_INFO, PRODUCTS } from '@/app/constants/farmInfo';

export function MochiPage() {
  const mochiProducts = PRODUCTS.mochi;

  return (
    <div className="min-h-screen">
      {/* ヘッダースペース */}
      <div className="h-20 lg:h-24"></div>

      {/* ヒーローセクション */}
      <section className="relative py-20 lg:py-32 px-4 overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(30, 80%, 95%) 0%, var(--color-neutral-50) 100%)' }}>
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

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8" style={{ background: 'linear-gradient(135deg, hsl(30, 70%, 85%) 0%, hsl(30, 70%, 75%) 100%)', border: '1px solid hsl(30, 60%, 65%)' }}>
              <Cookie className="w-4 h-4" style={{ color: 'hsl(30, 60%, 40%)' }} />
              <span className="text-sm font-medium" style={{ color: 'hsl(30, 70%, 30%)', fontFamily: 'var(--font-sans)', letterSpacing: '0.05em' }}>Mochi</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold mb-6" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-neutral-900)', letterSpacing: '0.02em' }}>
              おいしいおもち
            </h1>
            <p className="text-xl lg:text-2xl mb-8 max-w-3xl" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)', lineHeight: '1.8' }}>
              無農薬で育てたもち米を使って、今までにないおいしさを実現。一個一個手作りして真空パックに詰めてお送りいたします
            </p>
          </motion.div>
        </div>

        {/* 装飾要素 */}
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: 'hsl(30, 80%, 60%)' }}></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: 'hsl(30, 70%, 70%)' }}></div>
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
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl" style={{ aspectRatio: '4/5' }}>
                <img
                  src="https://images.unsplash.com/photo-1609501676725-7186f017a4b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                  alt="おもち"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 w-64 h-64 rounded-full -z-10 blur-3xl opacity-20" style={{ background: 'hsl(30, 80%, 60%)' }}></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: 'linear-gradient(135deg, hsl(30, 70%, 90%) 0%, hsl(30, 70%, 85%) 100%)', border: '1px solid hsl(30, 60%, 75%)' }}>
                <Heart className="w-4 h-4" style={{ color: 'hsl(30, 60%, 40%)' }} />
                <span className="text-sm font-medium" style={{ color: 'hsl(30, 70%, 30%)', fontFamily: 'var(--font-sans)', letterSpacing: '0.05em' }}>Our Commitment</span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-neutral-900)' }}>
                無農薬もち米で作る<br />こだわりのおもち
              </h2>
              <div className="space-y-6">
                <p className="text-lg" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)', lineHeight: '1.9' }}>
                  当園で無農薬栽培したもち米を100%使用。除草剤や農薬を一切使用せず、12種類の有機質肥料で育てたもち米は、安心・安全で風味豊かです。
                </p>
                <p className="text-lg" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)', lineHeight: '1.9' }}>
                  一つ一つ丁寧に手作りし、できたての美味しさを保つために真空パックでお届けします。
                </p>
              </div>
            </motion.div>
          </div>

          {/* 特徴 */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Sparkles, title: '無農薬もち米', description: '除草剤や農薬を一切使用せず育てたもち米を100%使用' },
              { icon: Heart, title: '手作り製法', description: '一個一個丁寧に手作りして、愛情を込めてお届けします' },
              { icon: Cookie, title: '真空パック', description: '新鮮さを保つため、できたてを真空パックに詰めます' },
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
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110" style={{ background: 'linear-gradient(135deg, hsl(30, 70%, 90%) 0%, hsl(30, 70%, 85%) 100%)', border: '1px solid hsl(30, 60%, 75%)' }}>
                  <feature.icon className="w-8 h-8" style={{ color: 'hsl(30, 60%, 40%)' }} />
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
              商品ラインナップ
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {mochiProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                {/* 商品画像 */}
                <div className="relative overflow-hidden" style={{ aspectRatio: '16/10' }}>
                  <img
                    src="https://images.unsplash.com/photo-1759928255044-0996087c10ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2NoaSUyMGphcGFuZXNlJTIwcmljZSUyMGNha2V8ZW58MXx8fHwxNzY4ODg5MjYyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                <div className="p-8">
                  <h3 className="font-bold text-2xl mb-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-neutral-900)' }}>
                    {product.name}
                  </h3>
                  <p className="mb-6" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-600)', lineHeight: '1.7' }}>
                    {product.description}
                  </p>

                  {/* Shopifyから取得する現在価格 */}
                  <div className="mb-6 p-6 rounded-2xl" style={{ background: 'linear-gradient(135deg, hsl(30, 80%, 90%) 0%, hsl(30, 80%, 85%) 100%)', border: '1px solid hsl(30, 70%, 75%)' }}>
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-medium" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-600)' }}>現在価格</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold" style={{ fontFamily: 'var(--font-serif)', color: 'hsl(30, 70%, 50%)' }}>
                          ¥{product.price.toLocaleString()}
                        </span>
                        <span className="text-sm" style={{ color: 'var(--color-neutral-500)' }}>（税込）</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={`#contact`}
                    className="group/btn w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full transition-all duration-300 relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, hsl(30, 70%, 60%) 0%, hsl(30, 70%, 50%) 100%)', fontFamily: 'var(--font-sans)', fontWeight: 600 }}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-[color:hsl(30,70%,50%)] to-[color:hsl(30,70%,40%)] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></span>
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
                style={{ background: 'linear-gradient(135deg, hsl(30, 70%, 60%) 0%, hsl(30, 70%, 50%) 100%)', color: 'white', fontFamily: 'var(--font-sans)' }}
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