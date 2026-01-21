import { motion } from 'motion/react';
import { ArrowRight, Flower2, Cookie, Soup } from 'lucide-react';

export function ProductSectionJP() {
  const productCategories = [
    {
      id: 'strawberries',
      title: 'いちご',
      description: '朝摘みの新鮮ないちご。厳選した「かおり野」をお届け',
      color: '#c94b4b',
      image: 'https://images.unsplash.com/photo-1464454709131-ffd692591ee5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      link: '#strawberries'
    },
    {
      id: 'strawberry-picking',
      title: 'いちご狩り',
      description: '有名ブランド「かおり野」が楽しめるいちご狩り体験',
      color: '#c94b4b',
      image: 'https://images.unsplash.com/photo-1518635017498-87f514b751ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      link: '#strawberry-picking'
    },
    {
      id: 'rice',
      title: '無農薬栽培米',
      description: '12種類の有機質肥料で育てた安心・安全なお米',
      color: '#8b7355',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      link: '#rice'
    },
    {
      id: 'mochi',
      title: 'おいしいおもち',
      description: '無農薬もち米を使った手作のおもち',
      color: '#d4a574',
      image: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      link: '#mochi'
    },
    {
      id: 'miso',
      title: '無添加味噌',
      description: '厳選素材で作る完全無添加の味噌',
      color: '#a67c52',
      image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      link: '#miso'
    },
  ];

  return (
    <section id="products" className="py-24 lg:py-32 px-4" style={{ background: '#f5f3ef' }}>
      <div className="max-w-7xl mx-auto">
        {/* セクションタイトル */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <div className="inline-block">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-px" style={{ background: 'linear-gradient(to right, transparent, #c94b4b)' }}></div>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.875rem', color: '#c94b4b', letterSpacing: '0.3em' }}>PRODUCTS</span>
              <div className="w-12 h-px" style={{ background: 'linear-gradient(to left, transparent, #c94b4b)' }}></div>
            </div>
            
            <h2 className="text-5xl lg:text-6xl font-bold mb-6" style={{ fontFamily: 'var(--font-serif)', letterSpacing: '0.15em', color: '#2d2416' }}>
              品々
            </h2>
            
            <div className="w-1 h-16 mx-auto mb-6" style={{ background: 'linear-gradient(to bottom, transparent, #c94b4b, transparent)' }}></div>
            
            <p className="text-lg" style={{ fontFamily: 'var(--font-sans)', color: '#6b5d4f', lineHeight: '2' }}>
              朝摘みの新鮮な苺、無農薬栽培のお米など<br className="hidden md:block" />
              こだわりの商品を真心と共にお届けします
            </p>
          </div>
        </motion.div>

        {/* 商品カテゴリ */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
          {productCategories.map((category, index) => (
            <motion.a
              key={category.id}
              href={category.link}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className="group block relative overflow-hidden border-4 transition-all duration-500 hover:shadow-2xl"
              style={{ borderColor: category.color, aspectRatio: '16/10' }}
            >
              {/* 背景画像 */}
              <div className="absolute inset-0">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                {/* オーバーレイ */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 group-hover:from-black/70 group-hover:via-black/50 group-hover:to-black/80 transition-all duration-500"></div>
              </div>

              {/* コンテンツ */}
              <div className="absolute inset-0 p-8 lg:p-10 flex flex-col justify-between">
                <div className="flex-1 flex flex-col justify-center">
                  <h3 
                    className="text-4xl lg:text-5xl font-bold mb-4 text-white text-center"
                    style={{ 
                      fontFamily: 'var(--font-serif)',
                      letterSpacing: '0.1em',
                      textShadow: '0 2px 12px rgba(0,0,0,0.5)'
                    }}
                  >
                    {category.title}
                  </h3>
                  
                  <div className="w-16 h-px mx-auto mb-4" style={{ background: `linear-gradient(to right, transparent, ${category.color}, transparent)` }}></div>
                  
                  <p 
                    className="text-base lg:text-lg text-white/90 text-center max-w-md mx-auto"
                    style={{ 
                      fontFamily: 'var(--font-sans)',
                      lineHeight: '2',
                      textShadow: '0 1px 8px rgba(0,0,0,0.5)'
                    }}
                  >
                    {category.description}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2 text-white font-medium group-hover:gap-4 transition-all duration-300" style={{ fontFamily: 'var(--font-sans)' }}>
                  <span style={{ letterSpacing: '0.1em' }}>詳しく見る</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>

              {/* 装飾 */}
              <div className="absolute top-4 right-4 opacity-20">
                {category.id === 'strawberry-picking' && <Flower2 className="w-16 h-16 text-white" />}
                {category.id === 'rice' && <Flower2 className="w-16 h-16 text-white" />}
                {category.id === 'mochi' && <Cookie className="w-16 h-16 text-white" />}
                {category.id === 'miso' && <Soup className="w-16 h-16 text-white" />}
              </div>
            </motion.a>
          ))}
        </div>

        {/* お知らせ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-16 p-8 lg:p-10 text-center border-4"
          style={{ borderColor: '#c94b4b', background: 'white' }}
        >
          <p 
            className="text-lg lg:text-xl mb-3"
            style={{ fontFamily: 'var(--font-sans)', color: '#2d2416', lineHeight: '2' }}
          >
            オンラインショップで簡単にご購入いただけます
          </p>
          <p 
            className="text-base lg:text-lg"
            style={{ fontFamily: 'var(--font-sans)', color: '#6b5d4f', lineHeight: '2' }}
          >
            お電話、メール、FAXでもご注文を承っております
          </p>
        </motion.div>
      </div>
    </section>
  );
}