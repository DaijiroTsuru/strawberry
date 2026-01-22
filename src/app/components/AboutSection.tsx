import { motion } from 'motion/react';
import { Leaf, Award, Sprout } from 'lucide-react';
import { FARM_INFO } from '@/app/constants/farmInfo';

export function AboutSection() {
  const features = [
    {
      icon: Sprout,
      title: '土耕栽培へのこだわり',
      description: '有機質の栄養をたっぷり含んだ土の力で、いちごを健康的に育てています',
    },
    {
      icon: Leaf,
      title: '無農薬栽培',
      description: `${FARM_INFO.features.motto}で安心・安全を実現`,
    },
    {
      icon: Award,
      title: 'かおり野ブランド',
      description: '大粒で糖度が高く酸味が少ない、上品な香りの「かおり野」を栽培',
    },
  ];

  return (
    <section id="about" className="py-24 lg:py-32 px-4" style={{ background: 'var(--color-neutral-50)' }}>
      <div className="max-w-7xl mx-auto">
        {/* メインコンテンツ */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
              style={{
                background: 'linear-gradient(135deg, var(--color-strawberry-50) 0%, var(--color-strawberry-100) 100%)',
                border: '1px solid var(--color-strawberry-200)'
              }}
            >
              <Leaf className="w-4 h-4" style={{ color: 'var(--color-strawberry-600)' }} />
              <span 
                className="text-sm font-medium" 
                style={{ 
                  color: 'var(--color-strawberry-700)',
                  fontFamily: 'var(--font-sans)',
                  letterSpacing: '0.05em'
                }}
              >
                About Us
              </span>
            </motion.div>

            <h2 
              className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-8"
              style={{ 
                fontFamily: 'var(--font-serif)',
                color: 'var(--color-neutral-900)',
                letterSpacing: '0.02em',
                lineHeight: '1.3'
              }}
            >
              {FARM_INFO.name}について
            </h2>
            
            <div className="space-y-6">
              <p 
                className="text-lg leading-relaxed"
                style={{ 
                  fontFamily: 'var(--font-sans)',
                  color: 'var(--color-neutral-700)',
                  lineHeight: '1.9'
                }}
              >
                私たち{FARM_INFO.name}は、{FARM_INFO.features.motto}。
              </p>
              <p 
                className="text-lg leading-relaxed"
                style={{ 
                  fontFamily: 'var(--font-sans)',
                  color: 'var(--color-neutral-700)',
                  lineHeight: '1.9'
                }}
              >
                有機質肥料（{FARM_INFO.features.fertilizers.slice(0, 4).join('、')}など12種類）を使用し、
                自然界に存在するもので健康的にいちごを育てています。
              </p>
              <p 
                className="text-lg leading-relaxed"
                style={{ 
                  fontFamily: 'var(--font-sans)',
                  color: 'var(--color-neutral-700)',
                  lineHeight: '1.9'
                }}
              >
                早朝より手摘みしたいちごの中から、一粒一粒良いものだけを厳選してお届けいたします。
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10"
            >
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div 
              className="rounded-3xl overflow-hidden shadow-2xl relative"
              style={{ aspectRatio: '4/5' }}
            >
              <img
                src="https://images.unsplash.com/photo-1663908428751-1ee8bfc3e39c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMGFncmljdWx0dXJlfGVufDF8fHx8MTc2ODk2MTY0M3ww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="農園の様子"
                className="w-full h-full object-cover"
              />
              {/* 装飾グラデーション */}
              <div 
                className="absolute inset-0 opacity-20 mix-blend-multiply"
                style={{
                  background: 'linear-gradient(135deg, var(--color-strawberry-500) 0%, transparent 100%)'
                }}
              ></div>
            </div>
            
            {/* 装飾要素 */}
            <div 
              className="absolute -bottom-8 -right-8 w-64 h-64 rounded-full -z-10 blur-3xl opacity-20"
              style={{ background: 'var(--color-strawberry-400)' }}
            ></div>
            <div 
              className="absolute -top-8 -left-8 w-48 h-48 rounded-full -z-10 blur-3xl opacity-20"
              style={{ background: 'var(--color-leaf-400)' }}
            ></div>
          </motion.div>
        </div>

        {/* 特徴 */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="group relative p-8 lg:p-10 rounded-3xl transition-all duration-500 hover:shadow-2xl"
              style={{
                background: 'white',
                border: '1px solid var(--color-neutral-200)'
              }}
            >
              {/* アイコン背景 */}
              <div 
                className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                style={{ background: 'var(--color-strawberry-500)' }}
              ></div>
              
              <div 
                className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 rounded-2xl lg:rounded-3xl mb-6 transition-all duration-500 group-hover:scale-110"
                style={{
                  background: 'linear-gradient(135deg, var(--color-strawberry-50) 0%, var(--color-strawberry-100) 100%)',
                  border: '1px solid var(--color-strawberry-200)'
                }}
              >
                <feature.icon className="w-8 h-8 lg:w-10 lg:h-10" style={{ color: 'var(--color-strawberry-600)' }} />
              </div>
              
              <h3 
                className="font-bold text-xl lg:text-2xl mb-4"
                style={{ 
                  fontFamily: 'var(--font-serif)',
                  color: 'var(--color-neutral-900)',
                  letterSpacing: '0.02em'
                }}
              >
                {feature.title}
              </h3>
              
              <p 
                className="leading-relaxed"
                style={{ 
                  fontFamily: 'var(--font-sans)',
                  color: 'var(--color-neutral-600)',
                  lineHeight: '1.8'
                }}
              >
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}