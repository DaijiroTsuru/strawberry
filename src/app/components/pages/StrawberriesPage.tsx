import { motion } from 'motion/react';
import { Sparkles, Package, Calendar, ShoppingCart, ArrowLeft } from 'lucide-react';
import { FARM_INFO, PRODUCTS } from '@/app/constants/farmInfo';

export function StrawberriesPage() {
  const strawberryProducts = PRODUCTS.strawberries;

  return (
    <div className="min-h-screen">
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
            <a
              href="/"
              className="inline-flex items-center gap-2 mb-8 transition-colors duration-300"
              style={{ color: 'var(--color-neutral-600)', fontFamily: 'var(--font-sans)' }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>ホームに戻る</span>
            </a>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8" style={{ background: 'linear-gradient(135deg, var(--color-strawberry-100) 0%, var(--color-strawberry-200) 100%)', border: '1px solid var(--color-strawberry-300)' }}>
              <Sparkles className="w-4 h-4" style={{ color: 'var(--color-strawberry-700)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--color-strawberry-800)', fontFamily: 'var(--font-sans)', letterSpacing: '0.05em' }}>Strawberries</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold mb-6" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-neutral-900)', letterSpacing: '0.02em' }}>
              厳選いちご
            </h1>
            <p className="text-xl lg:text-2xl mb-8 max-w-3xl" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)', lineHeight: '1.8' }}>
              その日の朝に収穫した新鮮な「{FARM_INFO.features.strawberryVariety}」を、真心込めてお届けします
            </p>
          </motion.div>
        </div>

        {/* 装飾要素 */}
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: 'var(--color-strawberry-400)' }}></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: 'var(--color-strawberry-300)' }}></div>
      </section>

      {/* かおり野について */}
      <section className="py-20 lg:py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl" style={{ aspectRatio: '4/5' }}>
                <img
                  src="https://images.unsplash.com/photo-1464454709131-ffd692591ee5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                  alt="かおり野いちご"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 w-64 h-64 rounded-full -z-10 blur-3xl opacity-20" style={{ background: 'var(--color-strawberry-400)' }}></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-neutral-900)' }}>
                「{FARM_INFO.features.strawberryVariety}」の魅力
              </h2>
              <p className="text-lg mb-6" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)', lineHeight: '1.9' }}>
                上品な香りとあっさりとしたみずみずしい甘さがある人気のブランドいちご。大粒なのに糖度が高く酸味が少ないのが特徴です。
              </p>
              <p className="text-lg mb-6" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)', lineHeight: '1.9' }}>
                朝の光を浴びて赤く輝くいちごを一粒ずつ丁寧に手摘みし、その日のうちにお客様へお届けしています。
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl" style={{ background: 'var(--color-strawberry-50)', border: '1px solid var(--color-strawberry-200)' }}>
                  <Package className="w-6 h-6 mb-2" style={{ color: 'var(--color-strawberry-600)' }} />
                  <p className="font-medium" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-strawberry-800)' }}>朝摘み新鮮</p>
                </div>
                <div className="p-4 rounded-2xl" style={{ background: 'var(--color-strawberry-50)', border: '1px solid var(--color-strawberry-200)' }}>
                  <Sparkles className="w-6 h-6 mb-2" style={{ color: 'var(--color-strawberry-600)' }} />
                  <p className="font-medium" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-strawberry-800)' }}>糖度が高い</p>
                </div>
              </div>
            </motion.div>
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

          <div className="grid md:grid-cols-2 gap-8">
            {strawberryProducts.map((product, index) => {
              // 商品画像の設定
              const productImages = [
                'https://images.unsplash.com/photo-1551280769-56782ff097bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwc3RyYXdiZXJyeSUyMGJveCUyMGdpZnR8ZW58MXx8fHwxNzY4OTc2MTQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
                'https://images.unsplash.com/photo-1752149610530-b2b33a9e5bec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHN0cmF3YmVycmllcyUyMHBhY2thZ2V8ZW58MXx8fHwxNzY4OTc2MTQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
                'https://images.unsplash.com/photo-1656256793479-73199141e777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJhd2JlcnJpZXMlMjBjb250YWluZXIlMjBwYWNrfGVufDF8fHx8MTc2ODk3NjE0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
                'https://images.unsplash.com/photo-1747479465236-35452c184426?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcm96ZW4lMjBzdHJhd2JlcnJpZXN8ZW58MXx8fHwxNzY4OTc2MTQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
              ];

              return (
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
                      src={productImages[index]}
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
                    <div className="mb-6 p-6 rounded-2xl" style={{ background: 'linear-gradient(135deg, var(--color-strawberry-50) 0%, var(--color-strawberry-100) 100%)', border: '1px solid var(--color-strawberry-200)' }}>
                      <div className="flex items-baseline justify-between mb-4">
                        <span className="text-sm font-medium" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-600)' }}>現在価格</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-bold" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-strawberry-600)' }}>
                            ¥{product.pricing[0].price.toLocaleString()}
                          </span>
                          <span className="text-sm" style={{ color: 'var(--color-neutral-500)' }}>（税込）</span>
                        </div>
                      </div>
                      
                      {/* 時期別価格（小さく表示） */}
                      {product.pricing.length > 1 && (
                        <details className="text-xs" style={{ color: 'var(--color-neutral-600)' }}>
                          <summary className="cursor-pointer flex items-center gap-2 mb-2" style={{ fontFamily: 'var(--font-sans)' }}>
                            <Calendar className="w-3 h-3" />
                            <span>時期別価格を表示</span>
                          </summary>
                          <div className="pl-5 space-y-1 mt-2">
                            {product.pricing.map((pricing, idx) => (
                              <div key={idx} className="flex justify-between">
                                <span>{pricing.month}</span>
                                <span>¥{pricing.price.toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        </details>
                      )}
                    </div>

                    <a
                      href={`#contact`}
                      className="group/btn w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full transition-all duration-300 relative overflow-hidden"
                      style={{ background: 'linear-gradient(135deg, var(--color-strawberry-600) 0%, var(--color-strawberry-700) 100%)', fontFamily: 'var(--font-sans)', fontWeight: 600 }}
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-[color:var(--color-strawberry-700)] to-[color:var(--color-strawberry-800)] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></span>
                      <ShoppingCart className="w-5 h-5 text-white relative z-10" />
                      <span className="text-white relative z-10">カートに追加</span>
                    </a>
                  </div>
                </motion.div>
              );
            })}
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
                style={{ background: 'linear-gradient(135deg, var(--color-strawberry-600) 0%, var(--color-strawberry-700) 100%)', color: 'white', fontFamily: 'var(--font-sans)' }}
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