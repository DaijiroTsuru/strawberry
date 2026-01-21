import { motion } from 'motion/react';
import { Sparkles, Package, Calendar, ShoppingCart, ArrowLeft, Flower2 } from 'lucide-react';
import { FARM_INFO, PRODUCTS } from '@/app/constants/farmInfo';

export function StrawberriesPageJP() {
  const strawberryProducts = PRODUCTS.strawberries;

  return (
    <div className="min-h-screen" style={{ background: '#faf9f7' }}>
      {/* ヘッダースペース */}
      <div className="h-20 lg:h-24"></div>

      {/* ヒーローセクション */}
      <section className="relative py-20 lg:py-32 px-4 overflow-hidden" style={{ background: 'linear-gradient(to bottom, #f5f3ef 0%, #faf9f7 100%)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <a
              href="/"
              className="inline-flex items-center gap-2 mb-8 transition-colors duration-300"
              style={{ color: '#6b5d4f', fontFamily: 'var(--font-sans)' }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>ホームに戻る</span>
            </a>

            <div className="text-center mb-12">
              <div className="inline-block mb-8">
                <div className="w-1 h-16 mx-auto mb-4" style={{ background: 'linear-gradient(to bottom, transparent, #c94b4b, transparent)' }}></div>
                <h1 className="text-5xl lg:text-7xl font-bold mb-4" style={{ fontFamily: 'var(--font-serif)', color: '#2d2416', letterSpacing: '0.1em' }}>
                  厳選いちご
                </h1>
                <div className="w-1 h-16 mx-auto mt-4" style={{ background: 'linear-gradient(to bottom, transparent, #c94b4b, transparent)' }}></div>
              </div>
              <p className="text-xl lg:text-2xl max-w-3xl mx-auto" style={{ fontFamily: 'var(--font-sans)', color: '#6b5d4f', lineHeight: '2' }}>
                その日の朝に収穫した新鮮な<br />
                「{FARM_INFO.features.strawberryVariety}」を<br />
                真心込めてお届けします
              </p>
            </div>
          </motion.div>
        </div>

        {/* 和柄装飾 */}
        <div className="absolute top-10 right-10 opacity-5">
          <Flower2 className="w-32 h-32" style={{ color: '#c94b4b' }} />
        </div>
        <div className="absolute bottom-10 left-10 opacity-5">
          <Flower2 className="w-32 h-32" style={{ color: '#c94b4b' }} />
        </div>
      </section>

      {/* かおり野について */}
      <section className="py-20 lg:py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <div className="overflow-hidden border-4" style={{ borderColor: '#c94b4b', aspectRatio: '4/5' }}>
                <img
                  src="https://images.unsplash.com/photo-1464454709131-ffd692591ee5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                  alt="かおり野いちご"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <div className="inline-block mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-px" style={{ background: 'linear-gradient(to right, transparent, #c94b4b)' }}></div>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.875rem', color: '#c94b4b', letterSpacing: '0.3em' }}>KAORINO</span>
                  <div className="w-12 h-px" style={{ background: 'linear-gradient(to left, transparent, #c94b4b)' }}></div>
                </div>
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: 'var(--font-serif)', color: '#2d2416', letterSpacing: '0.05em' }}>
                「{FARM_INFO.features.strawberryVariety}」<br />の魅力
              </h2>
              <p className="text-lg mb-6" style={{ fontFamily: 'var(--font-sans)', color: '#6b5d4f', lineHeight: '2' }}>
                上品な香りとあっさりとしたみずみずしい甘さがある人気のブランドいちご。大粒なのに糖度が高く酸味が少ないのが特徴です。
              </p>
              <p className="text-lg mb-6" style={{ fontFamily: 'var(--font-sans)', color: '#6b5d4f', lineHeight: '2' }}>
                朝の光を浴びて赤く輝くいちごを一粒ずつ丁寧に手摘みし、その日のうちにお客様へお届けしています。
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border text-center" style={{ borderColor: '#c94b4b', background: '#fef5f5' }}>
                  <Package className="w-6 h-6 mb-2 mx-auto" style={{ color: '#c94b4b' }} />
                  <p className="font-medium" style={{ fontFamily: 'var(--font-sans)', color: '#c94b4b' }}>朝摘み新鮮</p>
                </div>
                <div className="p-4 border text-center" style={{ borderColor: '#c94b4b', background: '#fef5f5' }}>
                  <Sparkles className="w-6 h-6 mb-2 mx-auto" style={{ color: '#c94b4b' }} />
                  <p className="font-medium" style={{ fontFamily: 'var(--font-sans)', color: '#c94b4b' }}>糖度が高い</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 商品一覧セクション */}
      <section className="py-20 lg:py-32 px-4" style={{ background: '#f5f3ef' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center mb-16"
          >
            <div className="inline-block mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-px" style={{ background: 'linear-gradient(to right, transparent, #c94b4b)' }}></div>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.875rem', color: '#c94b4b', letterSpacing: '0.3em' }}>PRODUCTS</span>
                <div className="w-12 h-px" style={{ background: 'linear-gradient(to left, transparent, #c94b4b)' }}></div>
              </div>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold" style={{ fontFamily: 'var(--font-serif)', color: '#2d2416', letterSpacing: '0.05em' }}>
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
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-white border overflow-hidden transition-all duration-500 hover:shadow-xl"
                  style={{ borderColor: '#e8e3db' }}
                >
                  {/* 商品画像 */}
                  <div className="relative overflow-hidden border-b-4" style={{ aspectRatio: '16/10', borderColor: '#c94b4b' }}>
                    <img
                      src={productImages[index]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-8">
                    <h3 className="font-bold text-2xl mb-3" style={{ fontFamily: 'var(--font-serif)', color: '#2d2416', letterSpacing: '0.05em' }}>
                      {product.name}
                    </h3>
                    <p className="mb-6" style={{ fontFamily: 'var(--font-sans)', color: '#6b5d4f', lineHeight: '1.9', fontSize: '0.95rem' }}>
                      {product.description}
                    </p>

                    {/* Shopifyから取得する現在価格 */}
                    <div className="mb-6 p-6 border" style={{ borderColor: '#c94b4b', background: '#fef5f5' }}>
                      <div className="flex items-baseline justify-between mb-4">
                        <span className="text-xs font-medium" style={{ fontFamily: 'var(--font-sans)', color: '#6b5d4f' }}>現在価格</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-bold" style={{ fontFamily: 'var(--font-serif)', color: '#c94b4b' }}>
                            ¥{product.pricing[0].price.toLocaleString()}
                          </span>
                          <span className="text-xs" style={{ color: '#9b8b7a' }}>（税込）</span>
                        </div>
                      </div>
                      
                      {/* 時期別価格（小さく表示） */}
                      {product.pricing.length > 1 && (
                        <details className="text-xs" style={{ color: '#6b5d4f' }}>
                          <summary className="cursor-pointer flex items-center gap-2 mb-2 pt-4 border-t" style={{ borderColor: '#e8e3db', fontFamily: 'var(--font-sans)' }}>
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
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 transition-all duration-300 border-2"
                      style={{ borderColor: '#c94b4b', color: '#c94b4b', fontFamily: 'var(--font-sans)', fontWeight: 600 }}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>カートに追加</span>
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
            transition={{ duration: 1 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6" style={{ fontFamily: 'var(--font-serif)', color: '#2d2416', letterSpacing: '0.05em' }}>
              ご注文・お問い合わせ
            </h2>
            <p className="text-lg mb-8" style={{ fontFamily: 'var(--font-sans)', color: '#6b5d4f', lineHeight: '2' }}>
              お電話、メールにてご注文を承っております
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`tel:${FARM_INFO.contact.phone}`}
                className="px-8 py-4 transition-all duration-300 text-lg font-semibold"
                style={{ background: '#c94b4b', color: 'white', fontFamily: 'var(--font-sans)' }}
              >
                電話で注文
              </a>
              <a
                href={`mailto:${FARM_INFO.contact.email}`}
                className="px-8 py-4 transition-all duration-300 text-lg font-semibold border-2"
                style={{ borderColor: '#c94b4b', color: '#c94b4b', fontFamily: 'var(--font-sans)' }}
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