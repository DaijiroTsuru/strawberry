import { Link } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { ArrowRight, Apple, Cookie, Soup, Sparkles } from 'lucide-react';

export function ProductSection() {
  const productCategories = [
    {
      id: 'strawberries',
      title: 'いちご',
      description: '朝摘みの新鮮ないちご。厳選した「かおり野」をお届け',
      icon: Sparkles,
      color: 'strawberry',
      gradient: 'linear-gradient(135deg, var(--color-strawberry-500) 0%, var(--color-strawberry-600) 100%)',
      bgGradient: 'linear-gradient(135deg, var(--color-strawberry-50) 0%, var(--color-strawberry-100) 100%)',
      image: 'https://cdn.shopify.com/s/files/1/0791/6434/2495/files/ab590049a4e5e575622c2f7e4d8cbf89.jpg?v=1768511539',
      link: '/strawberries'
    },
    {
      id: 'strawberry-picking',
      title: 'いちご狩り',
      description: '有名ブランド「かおり野」が楽しめるいちご狩り体験',
      icon: Sparkles,
      color: 'strawberry',
      gradient: 'linear-gradient(135deg, var(--color-strawberry-500) 0%, var(--color-strawberry-600) 100%)',
      bgGradient: 'linear-gradient(135deg, var(--color-strawberry-50) 0%, var(--color-strawberry-100) 100%)',
      image: 'https://cdn.shopify.com/s/files/1/0791/6434/2495/files/AD824885-157E-4627-94E4-6CF232FEED85_1_105_c.jpg?v=1768511100',
      link: '/strawberry-picking'
    },
    {
      id: 'rice',
      title: '無農薬栽培米',
      description: '12種類の有機質肥料で育てた安心・安全なお米',
      icon: Apple,
      color: 'leaf',
      gradient: 'linear-gradient(135deg, var(--color-leaf-500) 0%, var(--color-leaf-600) 100%)',
      bgGradient: 'linear-gradient(135deg, var(--color-leaf-50) 0%, var(--color-leaf-100) 100%)',
      image: 'https://cdn.shopify.com/s/files/1/0791/6434/2495/files/3C5ADABF-60AC-4BF5-9332-478863C6944A_1_105_c.jpg?v=1768511098',
      link: '/rice'
    },
    {
      id: 'mochi',
      title: 'おいしいおもち',
      description: '無農薬もち米を使った手作りのおもち',
      icon: Cookie,
      color: 'mochi',
      gradient: 'linear-gradient(135deg, hsl(30, 70%, 60%) 0%, hsl(30, 70%, 50%) 100%)',
      bgGradient: 'linear-gradient(135deg, hsl(30, 80%, 90%) 0%, hsl(30, 80%, 85%) 100%)',
      image: 'https://cdn.shopify.com/s/files/1/0791/6434/2495/files/A858687D-ADA7-4068-913D-EAE2A9AFC97A_1_105_c.jpg?v=1768511100',
      link: '/product/小もち'
    },
  ];

  return (
    <section id="products" className="py-24 lg:py-32 px-4" style={{ background: 'var(--color-neutral-50)' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{
              background: 'linear-gradient(135deg, var(--color-strawberry-50) 0%, var(--color-strawberry-100) 100%)',
              border: '1px solid var(--color-strawberry-200)'
            }}
          >
            <Sparkles className="w-4 h-4" style={{ color: 'var(--color-strawberry-600)' }} />
            <span 
              className="text-sm font-medium" 
              style={{ 
                color: 'var(--color-strawberry-700)',
                fontFamily: 'var(--font-sans)',
                letterSpacing: '0.05em'
              }}
            >
              Products
            </span>
          </motion.div>

          <h2 
            className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6"
            style={{ 
              fontFamily: 'var(--font-serif)',
              color: 'var(--color-neutral-900)',
              letterSpacing: '0.02em'
            }}
          >
            商品ラインナップ
          </h2>
          <p 
            className="text-lg lg:text-xl max-w-3xl mx-auto"
            style={{ 
              fontFamily: 'var(--font-sans)',
              color: 'var(--color-neutral-600)',
              lineHeight: '1.8'
            }}
          >
            その日の朝に収穫した新鮮ないちご、無農薬栽培のお米など、<br className="hidden md:block" />
            こだわりの商品をお届けします
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
          {productCategories.map((category, index) => (
            <Link
              key={category.id}
              to={category.link}
            >
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group block relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                style={{ aspectRatio: '16/10' }}
              >
              {/* 背景画像 */}
              <div className="absolute inset-0">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* オーバーレイ */}
                <div 
                  className="absolute inset-0 opacity-80 group-hover:opacity-90 transition-opacity duration-500"
                  style={{ background: `linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 100%)` }}
                ></div>
              </div>

              {/* コンテンツ */}
              <div className="absolute inset-0 p-8 lg:p-10 flex flex-col justify-between">
                <div>
                  <div 
                    className="inline-flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300"
                    style={{ background: category.gradient, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}
                  >
                    <category.icon className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                  </div>

                  <h3 
                    className="text-3xl lg:text-4xl font-bold mb-3 text-white"
                    style={{ 
                      fontFamily: 'var(--font-serif)',
                      letterSpacing: '0.02em',
                      textShadow: '0 2px 12px rgba(0,0,0,0.3)'
                    }}
                  >
                    {category.title}
                  </h3>
                  <p 
                    className="text-base lg:text-lg text-white/90 max-w-md"
                    style={{ 
                      fontFamily: 'var(--font-sans)',
                      lineHeight: '1.7',
                      textShadow: '0 1px 8px rgba(0,0,0,0.3)'
                    }}
                  >
                    {category.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-white font-medium group-hover:gap-4 transition-all duration-300" style={{ fontFamily: 'var(--font-sans)' }}>
                  <span>詳しく見る</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
            </Link>
          ))}
        </div>

        {/* お知らせ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 p-8 lg:p-10 text-center rounded-3xl shadow-lg"
          style={{ background: 'linear-gradient(135deg, var(--color-strawberry-50) 0%, var(--color-leaf-50) 100%)', border: '2px solid var(--color-strawberry-200)' }}
        >
          <p 
            className="text-lg lg:text-xl mb-3 font-semibold"
            style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-900)', lineHeight: '1.8' }}
          >
            オンラインショップで簡単にご購入いただけます
          </p>
          <p 
            className="text-base lg:text-lg"
            style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-600)', lineHeight: '1.8' }}
          >
            お電話、メール、FAXでもご注文を承っております
          </p>
        </motion.div>
      </div>
    </section>
  );
}