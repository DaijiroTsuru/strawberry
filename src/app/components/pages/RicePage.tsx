import { motion } from 'motion/react';
import { Leaf, Sprout, Shield, Award, ShoppingCart, ArrowLeft } from 'lucide-react';
import { FARM_INFO, PRODUCTS } from '@/app/constants/farmInfo';

export function RicePage() {
  const riceProducts = PRODUCTS.rice;

  return (
    <div className="min-h-screen">
      {/* ヘッダースペース */}
      <div className="h-20 lg:h-24"></div>

      {/* ヒーローセクション */}
      <section className="relative py-20 lg:py-32 px-4 overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--color-leaf-50) 0%, var(--color-neutral-50) 100%)' }}>
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

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8" style={{ background: 'linear-gradient(135deg, var(--color-leaf-100) 0%, var(--color-leaf-200) 100%)', border: '1px solid var(--color-leaf-300)' }}>
              <Sprout className="w-4 h-4" style={{ color: 'var(--color-leaf-700)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--color-leaf-800)', fontFamily: 'var(--font-sans)', letterSpacing: '0.05em' }}>Rice</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold mb-6" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-neutral-900)', letterSpacing: '0.02em' }}>
              無農薬栽培米
            </h1>
            <p className="text-xl lg:text-2xl mb-8 max-w-3xl" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)', lineHeight: '1.8' }}>
              除草剤や農薬を一切使用せず、油粕、米糠、海草、魚粉等12種類に及ぶ肥料を使用して栽培した安心・安全なお米
            </p>
          </motion.div>
        </div>

        {/* 装飾要素 */}
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: 'var(--color-leaf-400)' }}></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: 'var(--color-leaf-300)' }}></div>
      </section>

      {/* 特徴セクション */}
      <section className="py-20 lg:py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-neutral-900)' }}>
              栽培方法へのこだわり
            </h2>
            <p className="text-lg max-w-3xl mx-auto" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-600)', lineHeight: '1.8' }}>
              手間とコストをかけても、皆様に安全でおいしいお米をご提供したいと願い、丁寧にお米の栽培を行っています
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Sprout, title: '薄まき', description: '一箱あたり80gの薄まきで、しっかりとした苗を育成' },
              { icon: Leaf, title: '無除草剤', description: '除草剤を使用せず、代かきを3回行うことで雑草を抑制' },
              { icon: Shield, title: '減農薬', description: '農薬散布は一切行わず、病害虫に強い栽培方法を実践' },
              { icon: Award, title: '有機肥料', description: '油粕、米糠、海草、魚粉など12種類の有機質肥料を使用' },
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
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110" style={{ background: 'linear-gradient(135deg, var(--color-leaf-50) 0%, var(--color-leaf-100) 100%)', border: '1px solid var(--color-leaf-200)' }}>
                  <feature.icon className="w-8 h-8" style={{ color: 'var(--color-leaf-600)' }} />
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

      {/* 商品一覧セクション */}
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {riceProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                {/* 商品画像 */}
                <div className="relative overflow-hidden" style={{ aspectRatio: '1/1' }}>
                  <img
                    src="https://images.unsplash.com/photo-1654086147189-d6363590ab28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMHJpY2UlMjBiYWclMjBwYWNrYWdlfGVufDF8fHx8MTc2ODk3NjE0N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-neutral-900)' }}>
                    {product.name}
                  </h3>
                  <p className="mb-4 text-sm" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-600)', lineHeight: '1.7' }}>
                    {product.description}
                  </p>

                  {/* Shopifyから取得する現在価格 */}
                  <div className="mb-4 p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, var(--color-leaf-50) 0%, var(--color-leaf-100) 100%)', border: '1px solid var(--color-leaf-200)' }}>
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-medium" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-600)' }}>現在価格</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-leaf-600)' }}>
                          ¥{product.price.toLocaleString()}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--color-neutral-500)' }}>（税込）</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={`#contact`}
                    className="group/btn w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full transition-all duration-300 relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, var(--color-leaf-600) 0%, var(--color-leaf-700) 100%)', fontFamily: 'var(--font-sans)', fontWeight: 600 }}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-[color:var(--color-leaf-700)] to-[color:var(--color-leaf-800)] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></span>
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
                style={{ background: 'linear-gradient(135deg, var(--color-leaf-600) 0%, var(--color-leaf-700) 100%)', color: 'white', fontFamily: 'var(--font-sans)' }}
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