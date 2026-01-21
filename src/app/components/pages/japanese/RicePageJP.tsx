import { motion } from 'motion/react';
import { Leaf, Sprout, Shield, Award, ShoppingCart, ArrowLeft } from 'lucide-react';
import { FARM_INFO, PRODUCTS } from '@/app/constants/farmInfo';

export function RicePageJP() {
  const riceProducts = PRODUCTS.rice;

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
                <div className="w-1 h-16 mx-auto mb-4" style={{ background: 'linear-gradient(to bottom, transparent, #8b7355, transparent)' }}></div>
                <h1 className="text-5xl lg:text-7xl font-bold mb-4" style={{ fontFamily: 'var(--font-serif)', color: '#2d2416', letterSpacing: '0.1em' }}>
                  無農薬栽培米
                </h1>
                <div className="w-1 h-16 mx-auto mt-4" style={{ background: 'linear-gradient(to bottom, transparent, #8b7355, transparent)' }}></div>
              </div>
              <p className="text-xl lg:text-2xl max-w-3xl mx-auto" style={{ fontFamily: 'var(--font-sans)', color: '#6b5d4f', lineHeight: '2' }}>
                除草剤や農薬を一切使用せず<br />
                油粕、米糠、海草、魚粉等12種類に及ぶ肥料を使用して<br />
                栽培した安心・安全なお米
              </p>
            </div>
          </motion.div>
        </div>

        {/* 和柄装飾 */}
        <div className="absolute top-10 right-10 w-32 h-32 opacity-5" style={{ 
          backgroundImage: 'radial-gradient(circle, #8b7355 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 opacity-5" style={{ 
          backgroundImage: 'radial-gradient(circle, #8b7355 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}></div>
      </section>

      {/* 特徴セクション */}
      <section className="py-20 lg:py-32 px-4" style={{ background: 'white' }}>
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
                <div className="w-12 h-px" style={{ background: 'linear-gradient(to right, transparent, #8b7355)' }}></div>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.875rem', color: '#8b7355', letterSpacing: '0.3em' }}>COMMITMENT</span>
                <div className="w-12 h-px" style={{ background: 'linear-gradient(to left, transparent, #8b7355)' }}></div>
              </div>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: 'var(--font-serif)', color: '#2d2416', letterSpacing: '0.05em' }}>
              栽培方法へのこだわり
            </h2>
            <p className="text-lg max-w-3xl mx-auto" style={{ fontFamily: 'var(--font-sans)', color: '#6b5d4f', lineHeight: '2' }}>
              手間とコストをかけても、皆様に安全でおいしいお米をご提供したいと願い<br />
              丁寧にお米の栽培を行っています
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
                transition={{ duration: 0.8, delay: index * 0.15 }}
                className="text-center p-8 border transition-all duration-500 hover:shadow-lg"
                style={{ borderColor: '#e8e3db', background: '#faf9f7' }}
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: 'white', border: '2px solid #8b7355' }}>
                  <feature.icon className="w-10 h-10" style={{ color: '#8b7355' }} />
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
                <div className="w-12 h-px" style={{ background: 'linear-gradient(to right, transparent, #8b7355)' }}></div>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.875rem', color: '#8b7355', letterSpacing: '0.3em' }}>PRODUCTS</span>
                <div className="w-12 h-px" style={{ background: 'linear-gradient(to left, transparent, #8b7355)' }}></div>
              </div>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold" style={{ fontFamily: 'var(--font-serif)', color: '#2d2416', letterSpacing: '0.05em' }}>
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
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white border overflow-hidden transition-all duration-500 hover:shadow-xl"
                style={{ borderColor: '#e8e3db' }}
              >
                <div className="p-8">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: '#8b7355' }}>
                    <Sprout className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-2xl mb-3 text-center" style={{ fontFamily: 'var(--font-serif)', color: '#2d2416', letterSpacing: '0.05em' }}>
                    {product.name}
                  </h3>
                  <p className="mb-6 text-center" style={{ fontFamily: 'var(--font-sans)', color: '#6b5d4f', lineHeight: '1.9', fontSize: '0.95rem' }}>
                    {product.description}
                  </p>
                  <div className="flex items-baseline justify-center gap-2 mb-6">
                    <span className="text-4xl font-bold" style={{ fontFamily: 'var(--font-serif)', color: '#8b7355' }}>
                      ¥{product.price.toLocaleString()}
                    </span>
                    <span style={{ fontFamily: 'var(--font-sans)', color: '#9b8b7a', fontSize: '0.9rem' }}>（税込）</span>
                  </div>
                  <a
                    href={`#contact`}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 transition-all duration-300 border-2"
                    style={{ borderColor: '#8b7355', color: '#8b7355', fontFamily: 'var(--font-sans)', fontWeight: 600 }}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>カートに追加</span>
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
                style={{ background: '#8b7355', color: 'white', fontFamily: 'var(--font-sans)' }}
              >
                電話で注文
              </a>
              <a
                href={`mailto:${FARM_INFO.contact.email}`}
                className="px-8 py-4 transition-all duration-300 text-lg font-semibold border-2"
                style={{ borderColor: '#8b7355', color: '#8b7355', fontFamily: 'var(--font-sans)' }}
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