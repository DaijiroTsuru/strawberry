import { motion } from 'motion/react';

export function TestimonialsSectionJP() {
  const testimonials = [
    {
      name: '田中 美咲',
      location: '東京都',
      comment: '甘みと香りが素晴らしく、今まで食べた苺の中で最も美味でした。贈り物にも最適です。',
    },
    {
      name: '山田 太郎',
      location: '大阪府',
      comment: '毎年、季節になると必ず注文しております。変わらぬ品質に、家族一同感謝しております。',
    },
    {
      name: '佐藤 花子',
      location: '福岡県',
      comment: '子供たちが大変喜んでおります。安心して食べられる品質が何よりも嬉しいです。',
    },
  ];

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-stone-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* セクションタイトル */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-serif text-gray-900 mb-4" style={{ letterSpacing: '0.2em' }}>
            お声
          </h2>
          <div className="w-24 h-1 bg-red-800 mx-auto mb-6"></div>
          <p className="text-gray-600 font-serif">
            お客様からいただいた、温かいお言葉
          </p>
        </motion.div>

        {/* お客様の声 */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <div className="bg-white border border-stone-200 p-8 relative min-h-[280px] flex flex-col">
                {/* 引用符 */}
                <div className="absolute top-6 left-6 text-6xl text-red-800 opacity-20 font-serif">
                  "
                </div>

                {/* コメント */}
                <div className="relative z-10 flex-1 pt-8">
                  <p className="text-gray-700 leading-loose mb-8">
                    {testimonial.comment}
                  </p>
                </div>

                {/* 顧客情報 */}
                <div className="border-t border-stone-200 pt-6">
                  <p className="font-serif text-gray-900 text-lg mb-1">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {testimonial.location}
                  </p>
                </div>

                {/* 装飾 */}
                <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-red-800"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
