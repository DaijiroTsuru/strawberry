import { motion } from 'motion/react';

export function HeroSectionJP() {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-stone-50">
      {/* 和紙テクスチャ背景 */}
      <div className="absolute inset-0 z-0 opacity-30">
        <img
          src="https://images.unsplash.com/photo-1602629978920-a6a369d6c245?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXNoaSUyMHBhcGVyJTIwdGV4dHVyZXxlbnwxfHx8fDE3Njg5NTYxODR8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="和紙テクスチャ"
          className="w-full h-full object-cover"
        />
      </div>

      {/* メインコンテンツ */}
      <div className="relative z-10 px-4 max-w-6xl mx-auto py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* 左側：テキスト */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="text-center md:text-left"
          >
            {/* 縦書き風タイトル */}
            <div className="mb-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="inline-block"
              >
                <h1 className="text-6xl md:text-8xl font-serif mb-4" style={{ writingMode: 'horizontal-tb', letterSpacing: '0.3em' }}>
                  津留
                </h1>
                <h2 className="text-4xl md:text-6xl font-serif text-red-800" style={{ letterSpacing: '0.2em' }}>
                  苺園
                </h2>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="space-y-6"
            >
              <div className="border-l-4 border-red-800 pl-6">
                <p className="text-xl md:text-2xl text-gray-800 mb-2 font-serif">
                  心を込めて育てる
                </p>
                <p className="text-lg text-gray-600">
                  三世代が紡ぐ、いちご栽培の伝統
                </p>
              </div>

              <p className="text-gray-700 leading-relaxed">
                太陽の恵みと清らかな水、そして何より愛情を注いで育てた<br className="hidden md:block" />
                津留イチゴ園の苺を、ぜひご賞味ください。
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
            >
              <button
                onClick={scrollToProducts}
                className="px-8 py-4 bg-red-800 hover:bg-red-900 text-white transition-colors duration-300 font-serif border-2 border-red-800"
              >
                商品一覧
              </button>
              <a
                href="#about"
                className="px-8 py-4 bg-transparent hover:bg-stone-100 text-red-800 transition-colors duration-300 font-serif border-2 border-red-800"
              >
                農園について
              </a>
            </motion.div>
          </motion.div>

          {/* 右側：画像 */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative"
          >
            <div className="relative aspect-[3/4] overflow-hidden border-8 border-white shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1559483526-22d5a63adc24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHN0cmF3YmVycmllcyUyMGhhcnZlc3R8ZW58MXx8fHwxNzY4ODQ0OTQwfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="津留イチゴ園の苺"
                className="w-full h-full object-cover"
              />
            </div>
            {/* 和風装飾 */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 border-4 border-red-800 -z-10"></div>
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-red-800 opacity-10 -z-10"></div>
          </motion.div>
        </div>

        {/* スクロールインジケーター */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="text-center mt-16"
        >
          <button
            onClick={scrollToProducts}
            className="text-gray-500 hover:text-red-800 transition-colors"
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm font-serif tracking-widest">SCROLL</span>
              <div className="w-px h-16 bg-gradient-to-b from-gray-400 to-transparent"></div>
            </div>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
