import { motion } from 'motion/react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { FARM_INFO } from '@/app/constants/farmInfo';

export function HeroSection() {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* 背景画像 */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1694632872166-c7ae400a5087?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJhd2JlcnJ5JTIwZmFybSUyMGZpZWxkfGVufDF8fHx8MTc2ODk2MTY0Mnww&ixlib=rb-4.1.0&q=80&w=1080"
          alt={FARM_INFO.name}
          className="w-full h-full object-cover scale-105"
        />
        {/* グラデーションオーバーレイ */}
        <div 
          className="absolute inset-0" 
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.6) 100%)'
          }}
        ></div>
        {/* 装飾要素 */}
        <div className="absolute inset-0 opacity-10" style={{ 
          backgroundImage: `radial-gradient(circle at 20% 30%, var(--color-strawberry-400) 0%, transparent 40%), 
                           radial-gradient(circle at 80% 70%, var(--color-strawberry-600) 0%, transparent 40%)`
        }}></div>
      </div>

      {/* コンテンツ */}
      <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* バッジ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 backdrop-blur-md"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
            }}
          >
            <Sparkles className="w-4 h-4" style={{ color: 'var(--color-strawberry-200)' }} />
            <span 
              className="text-sm font-medium tracking-wider" 
              style={{ 
                fontFamily: 'var(--font-sans)',
                letterSpacing: '0.1em'
              }}
            >
              無農薬・有機栽培
            </span>
          </motion.div>

          <h1 
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
            style={{ 
              fontFamily: 'var(--font-serif)',
              letterSpacing: '0.05em',
              textShadow: '0 4px 24px rgba(0,0,0,0.3)',
              lineHeight: '1.2'
            }}
          >
            {FARM_INFO.name}
          </h1>
          
          <p 
            className="text-xl md:text-2xl lg:text-3xl mb-4 font-light"
            style={{ 
              fontFamily: 'var(--font-sans)',
              letterSpacing: '0.08em',
              fontWeight: 300
            }}
          >
            自然の恵みと、丹精込めた栽培
          </p>
          
          <p 
            className="text-base md:text-lg lg:text-xl mb-12 opacity-90 max-w-2xl mx-auto"
            style={{ 
              fontFamily: 'var(--font-sans)',
              fontWeight: 400,
              lineHeight: '1.8',
              letterSpacing: '0.05em'
            }}
          >
            {FARM_INFO.features.motto}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={scrollToProducts}
            className="group px-8 py-4 rounded-full transition-all duration-300 text-lg font-semibold shadow-2xl hover:shadow-3xl relative overflow-hidden"
            style={{ 
              background: 'linear-gradient(135deg, var(--color-strawberry-600) 0%, var(--color-strawberry-700) 100%)',
              fontFamily: 'var(--font-sans)',
              fontWeight: 600,
              letterSpacing: '0.05em'
            }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[color:var(--color-strawberry-700)] to-[color:var(--color-strawberry-800)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative z-10 group-hover:scale-105 inline-block transition-transform duration-300">商品を見る</span>
          </button>
          
          <a
            href="#about"
            className="group px-8 py-4 rounded-full transition-all duration-300 text-lg font-semibold relative overflow-hidden"
            style={{ 
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(12px)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              fontFamily: 'var(--font-sans)',
              fontWeight: 600,
              letterSpacing: '0.05em'
            }}
          >
            <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative z-10">農園について</span>
          </a>
        </motion.div>
      </div>

      {/* スクロールインジケーター */}
      <motion.div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 cursor-pointer z-10 flex flex-col items-center gap-2"
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        onClick={scrollToProducts}
      >
        <span 
          className="text-xs uppercase tracking-widest opacity-70 mb-1" 
          style={{ 
            fontFamily: 'var(--font-sans)',
            fontWeight: 500,
            letterSpacing: '0.15em'
          }}
        >
          Scroll
        </span>
        <ChevronDown className="w-6 h-6 opacity-70" />
      </motion.div>
    </section>
  );
}