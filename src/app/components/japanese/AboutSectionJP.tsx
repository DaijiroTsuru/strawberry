import { motion } from 'motion/react';
import { FARM_INFO } from '@/app/constants/farmInfo';

export function AboutSectionJP() {
  return (
    <section id="about" className="py-24 px-4 bg-white">
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
            想い
          </h2>
          <div className="w-24 h-1 bg-red-800 mx-auto"></div>
        </motion.div>

        {/* メインコンテンツ */}
        <div className="grid md:grid-cols-5 gap-12 mb-24">
          {/* 画像 */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:col-span-2"
          >
            <div className="relative">
              <div className="border-8 border-white shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1685999260547-e00f9fa132e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMHRyYWRpdGlvbmFsJTIwZmFybXxlbnwxfHx8fDE3Njg5NjIwOTN8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="農園"
                  className="w-full aspect-[3/4] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-red-800 -z-10"></div>
            </div>
          </motion.div>

          {/* テキスト */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:col-span-3 space-y-8"
          >
            <div className="border-l-4 border-red-800 pl-8">
              <h3 className="text-2xl font-serif text-gray-900 mb-4">
                土耕栽培の伝統
              </h3>
              <p className="text-gray-700 leading-loose mb-4">
                有機質の栄養をたっぷり含んだ土の力でいちごを健康的に育てるため、
                {FARM_INFO.name}では{FARM_INFO.features.cultivationMethod}にこだわっております。
              </p>
              <p className="text-gray-700 leading-loose">
                この土から育ついちごは有名ブランド「{FARM_INFO.features.strawberryVariety}」。
                大地の力をたっぷり吸った大粒でとても甘い当園のいちごは、贈答用の品としても大変ご好評を頂いております。
              </p>
            </div>

            <div className="border-l-4 border-red-800 pl-8">
              <h3 className="text-2xl font-serif text-gray-900 mb-4">
                自然との調和
              </h3>
              <p className="text-gray-700 leading-loose mb-4">
                {FARM_INFO.features.motto}。
              </p>
              <p className="text-gray-700 leading-loose">
                {FARM_INFO.features.fertilizers.slice(0, 7).join('、')}など、
                自然界に存在するもので、いちごが健康に育つよう心を配っております。
              </p>
            </div>

            <div className="border-l-4 border-red-800 pl-8">
              <h3 className="text-2xl font-serif text-gray-900 mb-4">
                真心を込めて
              </h3>
              <p className="text-gray-700 leading-loose mb-4">
                毎朝、夜明けと共に収穫を行います。
              </p>
              <p className="text-gray-700 leading-loose">
                最も美味しい瞬間を、新鮮なままお客様の元へお届けいたします。
              </p>
            </div>
          </motion.div>
        </div>

        {/* 三つの価値観 */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              kanji: '誠',
              title: '誠実',
              description: '偽りのない、真摯な姿勢で苺と向き合っております',
            },
            {
              kanji: '心',
              title: '真心',
              description: 'お客様への感謝の気持ちを、一粒一粒に込めて',
            },
            {
              kanji: '質',
              title: '品質',
              description: '妥協なき品質管理で、最高の味わいをお約束します',
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="text-center p-10 border border-stone-200 hover:border-red-800 transition-colors duration-500 bg-stone-50"
            >
              <div className="w-24 h-24 mx-auto mb-6 border-4 border-red-800 rounded-full flex items-center justify-center">
                <span className="text-4xl font-serif text-red-800">{item.kanji}</span>
              </div>
              <h3 className="text-xl font-serif text-gray-900 mb-3" style={{ letterSpacing: '0.3em' }}>
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}