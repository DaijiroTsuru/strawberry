import { motion } from 'motion/react';
import { Calendar, Info, Phone, ArrowLeft, Flower2 } from 'lucide-react';
import { FARM_INFO, STRAWBERRY_PICKING } from '@/app/constants/farmInfo';

export function StrawberryPickingPageJP() {
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
                  いちご狩り
                </h1>
                <div className="w-1 h-16 mx-auto mt-4" style={{ background: 'linear-gradient(to bottom, transparent, #c94b4b, transparent)' }}></div>
              </div>
              <p className="text-xl lg:text-2xl max-w-3xl mx-auto" style={{ fontFamily: 'var(--font-sans)', color: '#6b5d4f', lineHeight: '2' }}>
                柔らかい春の日差しを感じながら<br />
                摘みたてこだわりいちご「{FARM_INFO.features.strawberryVariety}」を<br />
                心ゆくまでお楽しみください
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
            >
              <div className="inline-block mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-px" style={{ background: 'linear-gradient(to right, transparent, #c94b4b)' }}></div>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.875rem', color: '#c94b4b', letterSpacing: '0.3em' }}>KAORINO</span>
                  <div className="w-12 h-px" style={{ background: 'linear-gradient(to left, transparent, #c94b4b)' }}></div>
                </div>
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: 'var(--font-serif)', color: '#2d2416', letterSpacing: '0.05em' }}>
                「{FARM_INFO.features.strawberryVariety}」<br />について
              </h2>
              <p className="text-lg mb-6" style={{ fontFamily: 'var(--font-sans)', color: '#6b5d4f', lineHeight: '2' }}>
                上品な香りとあっさりとしたみずみずしい甘さがある人気のブランドいちご。大粒なのに糖度が高く酸味が少ないのが特徴です。
              </p>
              <p className="text-lg mb-6" style={{ fontFamily: 'var(--font-sans)', color: '#6b5d4f', lineHeight: '2' }}>
                だから、敢えて練乳や砂糖はご用意していません。いちごが持つ本来の甘みとみずみずしさを、たっぷり味わっていただけたらと思います。
              </p>
              <div className="p-6 border" style={{ borderColor: '#c94b4b', background: '#fef5f5' }}>
                <p className="font-medium flex items-start gap-2" style={{ fontFamily: 'var(--font-sans)', color: '#c94b4b', lineHeight: '1.9' }}>
                  <Info className="w-5 h-5 flex-shrink-0 mt-1" />
                  <span>{STRAWBERRY_PICKING.note}</span>
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
              <div className="overflow-hidden border-4" style={{ borderColor: '#c94b4b', aspectRatio: '4/5' }}>
                <img
                  src="https://images.unsplash.com/photo-1518635017498-87f514b751ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                  alt="いちご狩り"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 料金表 */}
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
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.875rem', color: '#c94b4b', letterSpacing: '0.3em' }}>PRICING</span>
                <div className="w-12 h-px" style={{ background: 'linear-gradient(to left, transparent, #c94b4b)' }}></div>
              </div>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold" style={{ fontFamily: 'var(--font-serif)', color: '#2d2416', letterSpacing: '0.05em' }}>
              入園料
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {STRAWBERRY_PICKING.pricing.map((pricing, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                className="bg-white border overflow-hidden transition-all duration-500 hover:shadow-lg"
                style={{ borderColor: '#e8e3db' }}
              >
                <div className="p-8">
                  <div className="text-center mb-6 pb-6 border-b" style={{ borderColor: '#e8e3db' }}>
                    <div className="inline-flex items-center gap-2 px-4 py-2 mb-2" style={{ background: '#fef5f5', border: '1px solid #c94b4b' }}>
                      <Calendar className="w-4 h-4" style={{ color: '#c94b4b' }} />
                      <span className="text-sm font-medium" style={{ color: '#c94b4b', fontFamily: 'var(--font-sans)', letterSpacing: '0.05em' }}>
                        {pricing.period}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b" style={{ borderColor: '#e8e3db' }}>
                      <span style={{ fontFamily: 'var(--font-sans)', color: '#6b5d4f' }}>小学生以上</span>
                      <span className="text-2xl font-bold" style={{ fontFamily: 'var(--font-serif)', color: '#c94b4b' }}>
                        ¥{pricing.adult.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b" style={{ borderColor: '#e8e3db' }}>
                      <span style={{ fontFamily: 'var(--font-sans)', color: '#6b5d4f' }}>幼児（3歳以上）</span>
                      <span className="text-2xl font-bold" style={{ fontFamily: 'var(--font-serif)', color: '#c94b4b' }}>
                        ¥{pricing.child.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span style={{ fontFamily: 'var(--font-sans)', color: '#6b5d4f' }}>お持ち帰り</span>
                      <span className="text-xl font-bold" style={{ fontFamily: 'var(--font-serif)', color: '#c94b4b' }}>
                        ¥{pricing.takeaway}/100g
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="mt-12 max-w-3xl mx-auto p-6 bg-white border text-center"
            style={{ borderColor: '#e8e3db' }}
          >
            <p style={{ fontFamily: 'var(--font-sans)', color: '#6b5d4f', lineHeight: '2' }}>
              {STRAWBERRY_PICKING.footwearNote}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 予約CTA */}
      <section className="py-20 lg:py-32 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center p-12 lg:p-16 border-4"
            style={{ borderColor: '#c94b4b', background: '#fef5f5' }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6" style={{ fontFamily: 'var(--font-serif)', color: '#2d2416', letterSpacing: '0.05em' }}>
              ご予約・お問い合わせ
            </h2>
            <p className="text-lg mb-8" style={{ fontFamily: 'var(--font-sans)', color: '#6b5d4f', lineHeight: '2' }}>
              いちご狩りは完全予約制です<br />
              お電話またはメールにてご予約ください
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`tel:${FARM_INFO.contact.phone}`}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 transition-all duration-300 text-lg font-semibold"
                style={{ background: '#c94b4b', color: 'white', fontFamily: 'var(--font-sans)' }}
              >
                <Phone className="w-5 h-5" />
                電話で予約
              </a>
              <a
                href={`mailto:${FARM_INFO.contact.email}`}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 transition-all duration-300 text-lg font-semibold border-2"
                style={{ borderColor: '#c94b4b', color: '#c94b4b', fontFamily: 'var(--font-sans)' }}
              >
                メールで予約
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
