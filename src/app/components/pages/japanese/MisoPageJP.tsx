import { motion } from 'motion/react';
import { Soup, Leaf, Award, ShoppingCart, ArrowLeft, Shield } from 'lucide-react';
import { FARM_INFO, PRODUCTS } from '@/app/constants/farmInfo';

export function MisoPageJP() {
  const misoProducts = PRODUCTS.miso;

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
                <div className="w-1 h-16 mx-auto mb-4" style={{ background: 'linear-gradient(to bottom, transparent, #a67c52, transparent)' }}></div>
                <h1 className="text-5xl lg:text-7xl font-bold mb-4" style={{ fontFamily: 'var(--font-serif)', color: '#2d2416', letterSpacing: '0.1em' }}>
                  無添加味噌
                </h1>
                <div className="w-1 h-16 mx-auto mt-4" style={{ background: 'linear-gradient(to bottom, transparent, #a67c52, transparent)' }}></div>
              </div>
              <p className="text-xl lg:text-2xl max-w-3xl mx-auto" style={{ fontFamily: 'var(--font-sans)', color: '#6b5d4f', lineHeight: '2' }}>
                有機肥料のみを使用し農薬は一切使用していないお米<br />
                五島灘の塩、国産の大豆を使い<br />
                老舗の味噌屋さんに仕込んでいただきました
              </p>
            </div>
          </motion.div>
        </div>

        {/* 和柄装飾 */}
        <div className="absolute top-10 right-10 w-32 h-32 opacity-5" style={{ 
          backgroundImage: 'radial-gradient(circle, #a67c52 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 opacity-5" style={{ 
          backgroundImage: 'radial-gradient(circle, #a67c52 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}></div>
      </section>

      {/* こだわりセクション */}
      <section className="py-20 lg:py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <div className="inline-block mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-px" style={{ background: 'linear-gradient(to right, transparent, #a67c52)' }}></div>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.875rem', color: '#a67c52', letterSpacing: '0.3em' }}>COMMITMENT</span>
                  <div className="w-12 h-px" style={{ background: 'linear-gradient(to left, transparent, #a67c52)' }}></div>
                </div>
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: 'var(--font-serif)', color: '#2d2416', letterSpacing: '0.05em' }}>
                厳選素材で作る<br />無添加の味噌
              </h2>
              <div className="space-y-6">
                <p className="text-lg" style={{ fontFamily: 'var(--font-sans)', color: '#6b5d4f', lineHeight: '2' }}>
                  当園で無農薬栽培したお米を使用し、五島灘の良質な塩と国産大豆を厳選。添加物を一切使用せず、伝統的な製法で仕込んでいます。
                </p>
                <p className="text-lg" style={{ fontFamily: 'var(--font-sans)', color: '#6b5d4f', lineHeight: '2' }}>
                  老舗の味噌屋さんの熟練の技術により、深い旨味とコクのある味噌に仕上がっています。一度、ご賞味くださいませ。
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <div className="overflow-hidden border-4" style={{ borderColor: '#a67c52', aspectRatio: '4/5' }}>
                <img
                  src="https://images.unsplash.com/photo-1617093727343-374698b1b08d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                  alt="味噌"
                  className="w-full h-full object-cover"
                />
              </div>
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
                transition={{ duration: 0.8, delay: index * 0.15 }}
                className="text-center p-8 border transition-all duration-500 hover:shadow-lg"
                style={{ borderColor: '#e8e3db', background: '#faf9f7' }}
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: 'white', border: '2px solid #a67c52' }}>
                  <feature.icon className="w-10 h-10" style={{ color: '#a67c52' }} />
                </div>
                <h3 className="font-bold text-xl mb-3" style={{ fontFamily: 'var(--font-serif)', color: '#2d2416', letterSpacing: '0.05em' }}>
                  {feature.title}
                </h3>
                <p style={{ fontFamily: 'var(--font-sans)', color: '#6b5d4f', lineHeight: '1.9', fontSize: '0.95rem' }}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 商品セクション */}
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
                <div className="w-12 h-px" style={{ background: 'linear-gradient(to right, transparent, #a67c52)' }}></div>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.875rem', color: '#a67c52', letterSpacing: '0.3em' }}>PRODUCTS</span>
                <div className="w-12 h-px" style={{ background: 'linear-gradient(to left, transparent, #a67c52)' }}></div>
              </div>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold" style={{ fontFamily: 'var(--font-serif)', color: '#2d2416', letterSpacing: '0.05em' }}>
              商品情報
            </h2>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            {misoProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white border overflow-hidden transition-all duration-500 hover:shadow-xl"
                style={{ borderColor: '#e8e3db' }}
              >
                <div className="p-10 lg:p-12">
                  <div className="flex items-start gap-8 flex-col md:flex-row">
                    <div className="w-24 h-24 rounded-full flex items-center justify-center flex-shrink-0 mx-auto md:mx-0" style={{ background: '#a67c52' }}>
                      <Soup className="w-12 h-12 text-white" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="font-bold text-3xl mb-4" style={{ fontFamily: 'var(--font-serif)', color: '#2d2416', letterSpacing: '0.05em' }}>
                        {product.name}
                      </h3>
                      <p className="mb-6 text-lg" style={{ fontFamily: 'var(--font-sans)', color: '#6b5d4f', lineHeight: '2' }}>
                        {product.description}
                      </p>
                      <div className="flex items-baseline gap-2 mb-8 justify-center md:justify-start">
                        <span className="text-5xl font-bold" style={{ fontFamily: 'var(--font-serif)', color: '#a67c52' }}>
                          ¥{product.price.toLocaleString()}
                        </span>
                        <span style={{ fontFamily: 'var(--font-sans)', color: '#9b8b7a', fontSize: '0.9rem' }}>（税込）</span>
                      </div>
                      <a
                        href={`#contact`}
                        className="inline-flex items-center gap-2 px-8 py-4 transition-all duration-300 border-2"
                        style={{ borderColor: '#a67c52', color: '#a67c52', fontFamily: 'var(--font-sans)', fontWeight: 600 }}
                      >
                        <ShoppingCart className="w-5 h-5" />
                        <span>カートに追加</span>
                      </a>
                    </div>
                  </div>
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
                style={{ background: '#a67c52', color: 'white', fontFamily: 'var(--font-sans)' }}
              >
                電話で注文
              </a>
              <a
                href={`mailto:${FARM_INFO.contact.email}`}
                className="px-8 py-4 transition-all duration-300 text-lg font-semibold border-2"
                style={{ borderColor: '#a67c52', color: '#a67c52', fontFamily: 'var(--font-sans)' }}
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