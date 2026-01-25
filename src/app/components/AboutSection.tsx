import { motion } from 'motion/react';
import { Leaf, Award, Sprout, Sun, Heart, Sparkles } from 'lucide-react';
import { FARM_INFO } from '@/app/constants/farmInfo';

export function AboutSection() {
  return (
    <section id="about" className="py-24 lg:py-32 px-4" style={{ background: 'var(--color-neutral-50)' }}>
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              background: 'linear-gradient(135deg, var(--color-strawberry-50) 0%, var(--color-strawberry-100) 100%)',
              border: '1px solid var(--color-strawberry-200)'
            }}
          >
            <Leaf className="w-4 h-4" style={{ color: 'var(--color-strawberry-600)' }} />
            <span className="text-sm font-medium" 
              style={{ 
                color: 'var(--color-strawberry-700)',
                fontFamily: 'var(--font-sans)',
                letterSpacing: '0.05em'
              }}
            >
              About Us
            </span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6"
            style={{ 
              fontFamily: 'var(--font-serif)',
              color: 'var(--color-neutral-900)',
              letterSpacing: '0.02em'
            }}
          >
            自然を味わう、<br className="hidden sm:block" />豊かさを味わう
          </h2>
          
          <p className="text-xl lg:text-2xl max-w-3xl mx-auto"
            style={{ 
              fontFamily: 'var(--font-sans)',
              color: 'var(--color-neutral-600)',
              lineHeight: '1.8'
            }}
          >
            {FARM_INFO.name}のいちごは、<br className="sm:hidden" />
            大地の恵みと手仕事の想いが<br className="sm:hidden" />育む、本物の味わいです
          </p>
        </motion.div>

        {/* Section 1: 土耕栽培へのこだわり */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative order-2 lg:order-1"
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl" style={{ aspectRatio: '4/3' }}>
              <img
                src="https://cdn.shopify.com/s/files/1/0791/6434/2495/files/ABC9DC2F-929C-4CEA-A71B-5E4A9926BAC7_1_105_c.jpg?v=1768511100"
                alt="豊かな土壌で育ついちご"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-48 h-48 rounded-full -z-10 blur-3xl opacity-20"
              style={{ background: 'var(--color-leaf-400)' }}
            ></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2"
          >
            <div className="inline-flex items-center gap-2 mb-6">
              <Sprout className="w-6 h-6" style={{ color: 'var(--color-strawberry-600)' }} />
              <span className="text-sm font-semibold tracking-wider"
                style={{ color: 'var(--color-strawberry-600)', fontFamily: 'var(--font-sans)' }}
              >
                COMMITMENT 01
              </span>
            </div>
            
            <h3 className="text-3xl lg:text-4xl font-bold mb-6"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-neutral-900)' }}
            >
              土が育む、<br />いちご本来の力
            </h3>
            
            <p className="text-lg mb-6 leading-relaxed"
              style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)', lineHeight: '1.9' }}
            >
              有機質の栄養をたっぷり含んだ土の力で、いちごを健康的に育てるために、津留いちご園では<strong>土耕栽培</strong>にこだわっています。
            </p>
            
            <p className="text-lg leading-relaxed"
              style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)', lineHeight: '1.9' }}
            >
              水耕栽培が主流の現代において、あえて手間のかかる土耕栽培を選ぶ理由。それは、土が持つ無限の可能性を信じているからです。微生物が生きる豊かな土壌が、いちごに深い味わいと確かな栄養を与えてくれます。
            </p>
          </motion.div>
        </div>

        {/* Section 2: 12種類の有機質肥料 */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 mb-6">
              <Leaf className="w-6 h-6" style={{ color: 'var(--color-strawberry-600)' }} />
              <span className="text-sm font-semibold tracking-wider"
                style={{ color: 'var(--color-strawberry-600)', fontFamily: 'var(--font-sans)' }}
              >
                COMMITMENT 02
              </span>
            </div>
            
            <h3 className="text-3xl lg:text-4xl font-bold mb-6"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-neutral-900)' }}
            >
              自然の恵みが詰まった<br />12種類の有機質肥料
            </h3>
            
            <p className="text-lg mb-6 leading-relaxed"
              style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)', lineHeight: '1.9' }}
            >
              油粕、米ヌカ、魚粉など、<strong>12種類に及ぶ有機質肥料</strong>を独自にブレンド。化学肥料に頼らず、自然界に存在する素材だけで、いちごが健康に育つ環境を整えています。
            </p>
            
            <p className="text-lg mb-8 leading-relaxed"
              style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)', lineHeight: '1.9' }}
            >
              さらに黒砂糖、ニンニク、イオウなどの天然素材を散布することで、いちご自身の免疫力を高め、安心・安全ないちご作りに取り組んでいます。
            </p>

            <div className="inline-block">
              <div className="p-6 rounded-xl" style={{ background: 'var(--color-strawberry-50)', border: '1px solid var(--color-strawberry-200)' }}>
                <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-strawberry-800)', fontFamily: 'var(--font-sans)' }}>有機質肥料</p>
                <p className="text-3xl font-bold" style={{ color: 'var(--color-strawberry-600)', fontFamily: 'var(--font-serif)' }}>12種類</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl" style={{ aspectRatio: '4/3' }}>
              <img
                src="https://cdn.shopify.com/s/files/1/0791/6434/2495/files/4D5ACBFA-A81D-4359-A23B-244EB9682E0C_1_105_c.jpg?v=1768511100"
                alt="有機質肥料で育てる"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -top-6 -right-6 w-48 h-48 rounded-full -z-10 blur-3xl opacity-20"
              style={{ background: 'var(--color-strawberry-400)' }}
            ></div>
          </motion.div>
        </div>

        {/* Section 3: かおり野ブランド */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative order-2 lg:order-1"
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl" style={{ aspectRatio: '4/3' }}>
              <img
                src="https://cdn.shopify.com/s/files/1/0791/6434/2495/files/B0CC8765-C46B-46DA-A909-468B88639C7C_1_105_c.jpg?v=1769214971"
                alt="かおり野いちご"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-48 h-48 rounded-full -z-10 blur-3xl opacity-20"
              style={{ background: 'var(--color-strawberry-400)' }}
            ></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2"
          >
            <div className="inline-flex items-center gap-2 mb-6">
              <Award className="w-6 h-6" style={{ color: 'var(--color-strawberry-600)' }} />
              <span className="text-sm font-semibold tracking-wider"
                style={{ color: 'var(--color-strawberry-600)', fontFamily: 'var(--font-sans)' }}
              >
                COMMITMENT 03
              </span>
            </div>
            
            <h3 className="text-3xl lg:text-4xl font-bold mb-6"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-neutral-900)' }}
            >
              プレミアムブランド<br />「かおり野」
            </h3>
            
            <p className="text-lg mb-6 leading-relaxed"
              style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)', lineHeight: '1.9' }}
            >
              この土から育ついちごは、有名ブランド<strong>「かおり野」</strong>。上品な香りとあっさりとしたみずみずしい甘さが特徴の、希少価値の高い品種です。
            </p>
            
            <p className="text-lg leading-relaxed"
              style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)', lineHeight: '1.9' }}
            >
              大地の力をたっぷり吸った大粒でとても甘い当園のいちごは、その品質の高さから<strong>贈答用の品</strong>としても大変ご好評をいただいています。大切な方への贈り物に、自信を持っておすすめできる逸品です。
            </p>
          </motion.div>
        </div>

        {/* Section 4: 早朝手摘み */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 mb-6">
              <Sun className="w-6 h-6" style={{ color: 'var(--color-strawberry-600)' }} />
              <span className="text-sm font-semibold tracking-wider"
                style={{ color: 'var(--color-strawberry-600)', fontFamily: 'var(--font-sans)' }}
              >
                COMMITMENT 04
              </span>
            </div>
            
            <h3 className="text-3xl lg:text-4xl font-bold mb-6"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-neutral-900)' }}
            >
              朝摘みの鮮度、<br />一粒一粒の厳選
            </h3>
            
            <p className="text-lg mb-6 leading-relaxed"
              style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)', lineHeight: '1.9' }}
            >
              早朝、まだ日が昇りきらない涼しい時間帯に収穫を始めます。この時間のいちごは、夜の間にたっぷりと養分を蓄え、最も糖度が高く、みずみずしい状態です。
            </p>
            
            <p className="text-lg leading-relaxed"
              style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)', lineHeight: '1.9' }}
            >
              手摘みしたいちごの中から、一粒一粒、色・形・大きさを確認し、良いものだけを厳選。その日のうちにお届けすることで、<strong>朝摘みの新鮮さをそのまま</strong>お客様にお届けしています。
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl" style={{ aspectRatio: '4/3' }}>
              <img
                src="https://cdn.shopify.com/s/files/1/0791/6434/2495/files/5C7C8AFC-B2FE-4579-8ECE-F782B6599F9C_1_105_c.jpg?v=1768511100"
                alt="早朝手摘みの様子"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -top-6 -right-6 w-48 h-48 rounded-full -z-10 blur-3xl opacity-20"
              style={{ background: 'var(--color-leaf-400)' }}
            ></div>
          </motion.div>
        </div>

        {/* Section 5: 時代のニーズに応える */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative p-12 lg:p-16 rounded-3xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, var(--color-strawberry-50) 0%, var(--color-leaf-50) 100%)' }}
        >
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-6">
              <Heart className="w-6 h-6" style={{ color: 'var(--color-strawberry-600)' }} />
              <span className="text-sm font-semibold tracking-wider"
                style={{ color: 'var(--color-strawberry-600)', fontFamily: 'var(--font-sans)' }}
              >
                OUR PHILOSOPHY
              </span>
            </div>

            <h3 className="text-3xl lg:text-4xl font-bold mb-8"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-neutral-900)' }}
            >
              「豊かさを味わう」という<br className="sm:hidden" />時代のニーズに応えて
            </h3>

            <p className="text-lg lg:text-xl mb-8 leading-relaxed"
              style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)', lineHeight: '1.9' }}
            >
              本物の味わい、安心できる品質、そして自然と調和した農業。<br />
              津留いちご園は、持続可能な農業を通じて、<br className="hidden sm:block" />
              次世代に豊かな食文化を繋いでいきます。
            </p>

            <div className="relative rounded-2xl overflow-hidden shadow-xl" style={{ aspectRatio: '16/9', maxWidth: '800px', margin: '0 auto' }}>
              <img
                src="https://cdn.shopify.com/s/files/1/0791/6434/2495/files/E3E7EF01-0A10-4ACF-B9FA-43FD5FC485B9_1_105_c.jpg?v=1768717304"
                alt="生産者"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* 装飾要素 */}
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-10"
            style={{ background: 'var(--color-strawberry-400)' }}
          ></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-10"
            style={{ background: 'var(--color-leaf-400)' }}
          ></div>
        </motion.div>
      </div>
    </section>
  );
}