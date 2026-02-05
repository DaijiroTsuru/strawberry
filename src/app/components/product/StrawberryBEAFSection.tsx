import { motion } from 'motion/react';
import {
  Gift,
  Heart,
  Truck,
  Award,
  CheckCircle,
  Scale,
  Leaf,
  Thermometer,
  Calendar,
  Package,
  Sparkles,
} from 'lucide-react';
import type { ShopifyProduct } from '@/utils/shopify';
import { BEAF_IMAGES } from '@/app/constants/beafImages';

interface StrawberryBEAFSectionProps {
  product: ShopifyProduct;
}

/**
 * いちご商品専用のBEAF訴求セクション
 * BEAFの法則に基づいて購入コンバージョンを向上させる
 * - Benefit（購入メリット）
 * - Evidence（論拠）
 * - Advantage（競合優位性）
 * - Feature（商品特徴）
 */
export function StrawberryBEAFSection({ product }: StrawberryBEAFSectionProps) {
  return (
    <div className="mt-16">
      <BenefitSection />
      <EvidenceSection />
      <AdvantageSection />
      <FeatureSection product={product} />
    </div>
  );
}

/**
 * Benefit（購入メリット）セクション
 */
function BenefitSection() {
  const benefits = [
    {
      icon: Gift,
      title: '特別感のある贈り物',
      description: '化粧箱入りで届いた瞬間から「特別」が伝わる',
      image: BEAF_IMAGES.benefit.gift,
    },
    {
      icon: Heart,
      title: '「美味しい」の歓声',
      description: '糖度15度超えの甘さに思わず笑顔がこぼれる',
      image: BEAF_IMAGES.benefit.smile,
    },
    {
      icon: Truck,
      title: '届いてすぐ食べられる',
      description: '朝摘み完熟だから届いた日がベストタイミング',
      image: BEAF_IMAGES.benefit.delivery,
    },
  ];

  return (
    <section
      className="py-16 lg:py-24 px-4"
      style={{
        background:
          'linear-gradient(180deg, var(--color-strawberry-50) 0%, var(--color-neutral-50) 100%)',
      }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              background: 'var(--color-strawberry-100)',
              color: 'var(--color-strawberry-700)',
            }}
          >
            <Sparkles className="w-4 h-4" />
            <span
              className="text-sm font-semibold"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              選ばれる理由
            </span>
          </div>
          <h2
            className="text-2xl lg:text-4xl font-bold mb-4"
            style={{
              fontFamily: 'var(--font-serif)',
              color: 'var(--color-neutral-900)',
              lineHeight: '1.4',
            }}
          >
            大切な方の笑顔が見たい、
            <br className="hidden sm:block" />
            そんな想いに応える贈り物
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{
              fontFamily: 'var(--font-sans)',
              color: 'var(--color-neutral-600)',
              lineHeight: '1.8',
            }}
          >
            津留いちご園の厳選いちごは、贈る人も贈られる人も笑顔にします
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg"
                style={{ border: '1px solid var(--color-neutral-200)' }}
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={benefit.image}
                    alt={benefit.title}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 50%)',
                    }}
                  />
                </div>
                <div className="p-6">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{
                      background:
                        'linear-gradient(135deg, var(--color-strawberry-500) 0%, var(--color-strawberry-600) 100%)',
                    }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3
                    className="text-xl font-bold mb-2"
                    style={{
                      fontFamily: 'var(--font-serif)',
                      color: 'var(--color-neutral-900)',
                    }}
                  >
                    {benefit.title}
                  </h3>
                  <p
                    className="text-base"
                    style={{
                      fontFamily: 'var(--font-sans)',
                      color: 'var(--color-neutral-600)',
                      lineHeight: '1.7',
                    }}
                  >
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/**
 * Evidence（論拠）セクション
 */
function EvidenceSection() {
  const stats = [
    {
      value: '15度超',
      label: '糖度',
      description: '一般的ないちごの約1.5倍の甘さ',
    },
    {
      value: '12種類',
      label: '有機質肥料',
      description: '化学肥料不使用・自然の力で栽培',
    },
    {
      value: '朝摘み',
      label: '収穫当日発送',
      description: 'その日の朝に収穫した完熟いちごを直送',
    },
  ];

  return (
    <section className="py-16 lg:py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              background: 'var(--color-leaf-100)',
              color: 'var(--color-leaf-700)',
            }}
          >
            <Award className="w-4 h-4" />
            <span
              className="text-sm font-semibold"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              美味しさの証拠
            </span>
          </div>
          <h2
            className="text-2xl lg:text-4xl font-bold mb-4"
            style={{
              fontFamily: 'var(--font-serif)',
              color: 'var(--color-neutral-900)',
            }}
          >
            美味しさの理由には、確かな根拠があります
          </h2>
        </motion.div>

        {/* 数値データカード */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center p-8 rounded-2xl"
              style={{
                background: 'var(--color-neutral-50)',
                border: '1px solid var(--color-neutral-200)',
              }}
            >
              <div
                className="text-4xl lg:text-5xl font-bold mb-2"
                style={{
                  fontFamily: 'var(--font-serif)',
                  color: 'var(--color-strawberry-600)',
                }}
              >
                {stat.value}
              </div>
              <div
                className="text-lg font-semibold mb-2"
                style={{
                  fontFamily: 'var(--font-sans)',
                  color: 'var(--color-neutral-900)',
                }}
              >
                {stat.label}
              </div>
              <p
                className="text-sm"
                style={{
                  fontFamily: 'var(--font-sans)',
                  color: 'var(--color-neutral-600)',
                }}
              >
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* 土耕栽培説明 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid lg:grid-cols-2 gap-8 items-center"
        >
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img
              src={BEAF_IMAGES.evidence.soil}
              alt="土耕栽培"
              className="w-full h-64 lg:h-80 object-cover"
            />
          </div>
          <div className="lg:pl-4">
            <h3
              className="text-2xl lg:text-3xl font-bold mb-4"
              style={{
                fontFamily: 'var(--font-serif)',
                color: 'var(--color-neutral-900)',
              }}
            >
              土の力を活かした「土耕栽培」
            </h3>
            <p
              className="text-base mb-6"
              style={{
                fontFamily: 'var(--font-sans)',
                color: 'var(--color-neutral-700)',
                lineHeight: '1.9',
              }}
            >
              津留いちご園では、効率重視の水耕栽培ではなく、昔ながらの「土耕栽培」にこだわっています。
              土に含まれるミネラルや微生物の力で、いちご本来の濃厚な味わいが生まれます。
            </p>
            <ul className="space-y-3">
              {[
                '12種類の有機質肥料を独自配合',
                '化学肥料・農薬を極力控えた栽培',
                '土壌の微生物を活かした自然な甘さ',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle
                    className="w-5 h-5 mt-0.5 flex-shrink-0"
                    style={{ color: 'var(--color-leaf-600)' }}
                  />
                  <span
                    style={{
                      fontFamily: 'var(--font-sans)',
                      color: 'var(--color-neutral-700)',
                    }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/**
 * Advantage（競合優位性）セクション
 */
function AdvantageSection() {
  const comparisons = [
    {
      item: '収穫タイミング',
      ours: '完熟してから収穫',
      others: '青いうちに収穫',
    },
    {
      item: '届くまでの日数',
      ours: '当日〜翌日',
      others: '3〜5日以上',
    },
    {
      item: '鮮度管理',
      ours: '朝摘みクール便直送',
      others: '流通経路経由',
    },
    {
      item: '選別方法',
      ours: '手作業で厳選',
      others: '機械選別',
    },
    {
      item: '栽培方法',
      ours: '土耕栽培・有機質肥料',
      others: '水耕栽培が多い',
    },
  ];

  return (
    <section
      className="py-16 lg:py-24 px-4"
      style={{
        background:
          'linear-gradient(180deg, var(--color-strawberry-50) 0%, var(--color-leaf-50) 100%)',
      }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              background: 'var(--color-strawberry-100)',
              color: 'var(--color-strawberry-700)',
            }}
          >
            <CheckCircle className="w-4 h-4" />
            <span
              className="text-sm font-semibold"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              ここが違う
            </span>
          </div>
          <h2
            className="text-2xl lg:text-4xl font-bold mb-4"
            style={{
              fontFamily: 'var(--font-serif)',
              color: 'var(--color-neutral-900)',
            }}
          >
            スーパーのいちごには、もう戻れない
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{
              fontFamily: 'var(--font-sans)',
              color: 'var(--color-neutral-600)',
              lineHeight: '1.8',
            }}
          >
            農園直送だからこそ実現できる、圧倒的な鮮度と味わい
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
          style={{ border: '1px solid var(--color-neutral-200)' }}
        >
          {/* テーブルヘッダー */}
          <div
            className="grid grid-cols-3 gap-4 p-4 lg:p-6"
            style={{
              background:
                'linear-gradient(135deg, var(--color-strawberry-600) 0%, var(--color-strawberry-700) 100%)',
            }}
          >
            <div
              className="text-sm lg:text-base font-semibold text-white"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              比較項目
            </div>
            <div
              className="text-sm lg:text-base font-bold text-white text-center"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              津留いちご園
            </div>
            <div
              className="text-sm lg:text-base font-semibold text-white/80 text-center"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              一般的なスーパー
            </div>
          </div>

          {/* テーブル行 */}
          {comparisons.map((row, index) => (
            <div
              key={row.item}
              className="grid grid-cols-3 gap-4 p-4 lg:p-6 items-center"
              style={{
                background:
                  index % 2 === 0 ? 'white' : 'var(--color-neutral-50)',
                borderTop: '1px solid var(--color-neutral-200)',
              }}
            >
              <div
                className="text-sm lg:text-base font-medium"
                style={{
                  fontFamily: 'var(--font-sans)',
                  color: 'var(--color-neutral-700)',
                }}
              >
                {row.item}
              </div>
              <div className="text-center">
                <span
                  className="inline-flex items-center gap-1 text-sm lg:text-base font-semibold"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    color: 'var(--color-strawberry-600)',
                  }}
                >
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{row.ours}</span>
                </span>
              </div>
              <div
                className="text-sm lg:text-base text-center"
                style={{
                  fontFamily: 'var(--font-sans)',
                  color: 'var(--color-neutral-500)',
                }}
              >
                {row.others}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/**
 * Feature（商品特徴）セクション
 */
function FeatureSection({ product }: { product: ShopifyProduct }) {
  // バリアント情報から内容量を取得（最初のバリアント）
  const firstVariant = product.variants.edges[0]?.node;
  const contentAmount = firstVariant?.title || '500g 化粧箱入り';

  const features = [
    {
      icon: Scale,
      label: '内容量',
      value: contentAmount,
    },
    {
      icon: Leaf,
      label: '品種',
      value: 'かおり野（三重県生まれの希少品種）',
    },
    {
      icon: Thermometer,
      label: '保存方法',
      value: '要冷蔵（10℃以下）',
    },
    {
      icon: Calendar,
      label: '賞味期限',
      value: '発送日含め3〜4日',
    },
  ];

  return (
    <section className="py-16 lg:py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              background: 'var(--color-neutral-100)',
              color: 'var(--color-neutral-700)',
            }}
          >
            <Package className="w-4 h-4" />
            <span
              className="text-sm font-semibold"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              商品詳細
            </span>
          </div>
          <h2
            className="text-2xl lg:text-4xl font-bold"
            style={{
              fontFamily: 'var(--font-serif)',
              color: 'var(--color-neutral-900)',
            }}
          >
            商品の詳細
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 商品情報カード */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg"
            style={{ border: '1px solid var(--color-neutral-200)' }}
          >
            <h3
              className="text-xl font-bold mb-6"
              style={{
                fontFamily: 'var(--font-serif)',
                color: 'var(--color-neutral-900)',
              }}
            >
              商品情報
            </h3>
            <dl className="space-y-4">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.label}
                    className="flex items-start gap-4 pb-4"
                    style={{ borderBottom: '1px solid var(--color-neutral-100)' }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: 'var(--color-neutral-100)' }}
                    >
                      <Icon
                        className="w-5 h-5"
                        style={{ color: 'var(--color-neutral-600)' }}
                      />
                    </div>
                    <div>
                      <dt
                        className="text-sm font-medium mb-1"
                        style={{
                          fontFamily: 'var(--font-sans)',
                          color: 'var(--color-neutral-500)',
                        }}
                      >
                        {feature.label}
                      </dt>
                      <dd
                        className="text-base font-semibold"
                        style={{
                          fontFamily: 'var(--font-sans)',
                          color: 'var(--color-neutral-900)',
                        }}
                      >
                        {feature.value}
                      </dd>
                    </div>
                  </div>
                );
              })}
            </dl>
          </motion.div>

          {/* 配送情報カード */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg"
            style={{ border: '1px solid var(--color-neutral-200)' }}
          >
            <h3
              className="text-xl font-bold mb-6"
              style={{
                fontFamily: 'var(--font-serif)',
                color: 'var(--color-neutral-900)',
              }}
            >
              配送について
            </h3>
            <div
              className="p-4 rounded-xl mb-6"
              style={{ background: 'var(--color-strawberry-50)' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Truck
                  className="w-5 h-5"
                  style={{ color: 'var(--color-strawberry-600)' }}
                />
                <span
                  className="font-semibold"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    color: 'var(--color-strawberry-700)',
                  }}
                >
                  鮮度保持便（クール便・梱包材込）
                </span>
              </div>
              <div className="space-y-2">
                <div
                  className="flex justify-between text-sm"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  <span style={{ color: 'var(--color-neutral-600)' }}>九州</span>
                  <span
                    className="font-semibold"
                    style={{ color: 'var(--color-neutral-900)' }}
                  >
                    1,550円
                  </span>
                </div>
                <div
                  className="flex justify-between text-sm"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  <span style={{ color: 'var(--color-neutral-600)' }}>
                    九州外
                  </span>
                  <span
                    className="font-semibold"
                    style={{ color: 'var(--color-neutral-900)' }}
                  >
                    2,300円
                  </span>
                </div>
              </div>
            </div>

            <ul className="space-y-3">
              {[
                '農園から冷蔵で直送します',
                'ご注文確認後、収穫次第発送します',
                '発送日の指定はできません',
                '離島へのお届けはお取り扱いしておりません',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    color: 'var(--color-neutral-600)',
                  }}
                >
                  <span style={{ color: 'var(--color-neutral-400)' }}>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
