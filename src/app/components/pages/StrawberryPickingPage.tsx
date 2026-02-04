import { motion } from "motion/react";
import {
  Calendar,
  Clock,
  Users,
  Info,
  Phone,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { FARM_INFO, STRAWBERRY_PICKING } from "@/app/constants/farmInfo";
import { Link } from "@tanstack/react-router";
import { FaqSection } from "@/app/components/common/FaqSection";
import { SEO, createBreadcrumbSchema } from "@/app/components/SEO";
import { trackStrawberryPickingPhoneReservation, trackStrawberryPickingConversion } from "@/utils/analytics";

export function StrawberryPickingPage() {
  return (
    <div className="min-h-screen">
      <SEO 
        title="いちご狩り"
        description="津留いちご園でいちご狩り体験をお楽しみください。12月から5月までの期間限定で、新鮮で甘い「かおり野」を食べ放題でお楽しみいただけます。ご予約はお電話にて承ります。"
        keywords="いちご狩り,かおり野,体験,予約,久留米,筑後,福岡,食べ放題,津留いちご園"
        image="https://cdn.shopify.com/s/files/1/0791/6434/2495/files/C575B8A9-AF31-4F3D-A4E0-A168B27A2911_1_105_c.jpg?v=1768511098"
        url="/strawberry-picking"
        structuredData={createBreadcrumbSchema([
          { name: 'ホーム', url: '/' },
          { name: 'いちご狩り', url: '/strawberry-picking' },
        ])}
      />

      {/* ヘッダースペース */}
      <div className="h-20 lg:h-24"></div>

      {/* ヒーローセクション */}
      <section
        className="relative py-20 lg:py-32 px-4 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, var(--color-strawberry-50) 0%, var(--color-neutral-50) 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 mb-8 transition-colors duration-300"
              style={{
                color: "var(--color-neutral-600)",
                fontFamily: "var(--font-sans)",
              }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>ホームに戻る</span>
            </Link>

            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-strawberry-100) 0%, var(--color-strawberry-200) 100%)",
                border: "1px solid var(--color-strawberry-300)",
              }}
            >
              <Sparkles
                className="w-4 h-4"
                style={{ color: "var(--color-strawberry-700)" }}
              />
              <span
                className="text-sm font-medium"
                style={{
                  color: "var(--color-strawberry-800)",
                  fontFamily: "var(--font-sans)",
                  letterSpacing: "0.05em",
                }}
              >
                Strawberry Picking
              </span>
            </div>

            <h1
              className="text-5xl lg:text-7xl font-bold mb-6"
              style={{
                fontFamily: "var(--font-serif)",
                color: "var(--color-neutral-900)",
                letterSpacing: "0.02em",
              }}
            >
              いちご狩り
            </h1>
            <p
              className="text-xl lg:text-2xl mb-8 max-w-3xl"
              style={{
                fontFamily: "var(--font-sans)",
                color: "var(--color-neutral-700)",
                lineHeight: "1.8",
              }}
            >
              柔らかい春の日差しを感じながら、摘みたてこだわりいちご「
              {FARM_INFO.features.strawberryVariety}
              」を心ゆくまでお楽しみください
            </p>
          </motion.div>
        </div>

        {/* 装飾要素 */}
        <div
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: "var(--color-strawberry-400)" }}
        ></div>
        <div
          className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: "var(--color-strawberry-300)" }}
        ></div>
      </section>

      {/* かおり野について */}
      <section className="py-20 lg:py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2
                className="text-4xl lg:text-5xl font-bold mb-6"
                style={{
                  fontFamily: "var(--font-serif)",
                  color: "var(--color-neutral-900)",
                }}
              >
                「{FARM_INFO.features.strawberryVariety}」について
              </h2>
              <p
                className="text-lg mb-6"
                style={{
                  fontFamily: "var(--font-sans)",
                  color: "var(--color-neutral-700)",
                  lineHeight: "1.9",
                }}
              >
                上品な香りとあっさりとしたみずみずしい甘さがある人気のブランドいちご。大粒なのに糖度が高く酸味が少ないのが特徴です。
              </p>
              <p
                className="text-lg mb-6"
                style={{
                  fontFamily: "var(--font-sans)",
                  color: "var(--color-neutral-700)",
                  lineHeight: "1.9",
                }}
              >
                だから、敢えて練乳や砂糖はご用意していません。いちごが持つ本来の甘みとみずみずしさを、たっぷり味わっていただけたらと思います。
              </p>
              <div
                className="p-6 rounded-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-strawberry-50) 0%, var(--color-strawberry-100) 100%)",
                  border: "1px solid var(--color-strawberry-200)",
                }}
              >
                <p
                  className="font-medium"
                  style={{
                    fontFamily: "var(--font-sans)",
                    color: "var(--color-strawberry-800)",
                  }}
                >
                  <Info className="inline w-5 h-5 mr-2" />
                  {STRAWBERRY_PICKING.note}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div
                className="rounded-3xl overflow-hidden shadow-2xl"
                style={{ aspectRatio: "4/5" }}
              >
                <img
                  src="https://cdn.shopify.com/s/files/1/0791/6434/2495/files/B0CC8765-C46B-46DA-A909-468B88639C7C_1_105_c.jpg?v=1768511101"
                  alt="いちご狩り"
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className="absolute -bottom-8 -right-8 w-64 h-64 rounded-full -z-10 blur-3xl opacity-20"
                style={{ background: "var(--color-strawberry-400)" }}
              ></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 料金表 */}
      <section
        className="py-20 lg:py-32 px-4"
        style={{ background: "var(--color-neutral-50)" }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2
              className="text-4xl lg:text-5xl font-bold mb-4"
              style={{
                fontFamily: "var(--font-serif)",
                color: "var(--color-neutral-900)",
              }}
            >
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
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <div className="p-8">
                  <div className="text-center mb-6">
                    <div
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--color-strawberry-100) 0%, var(--color-strawberry-200) 100%)",
                      }}
                    >
                      <Calendar
                        className="w-4 h-4"
                        style={{ color: "var(--color-strawberry-700)" }}
                      />
                      <span
                        className="text-sm font-medium"
                        style={{
                          color: "var(--color-strawberry-800)",
                          fontFamily: "var(--font-sans)",
                        }}
                      >
                        {pricing.period}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div
                      className="flex justify-between items-center pb-4"
                      style={{
                        borderBottom: "1px solid var(--color-neutral-200)",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-sans)",
                          color: "var(--color-neutral-700)",
                        }}
                      >
                        小学生以上
                      </span>
                      <span
                        className="text-2xl font-bold"
                        style={{
                          fontFamily: "var(--font-serif)",
                          color: "var(--color-strawberry-600)",
                        }}
                      >
                        ¥{pricing.adult.toLocaleString()}
                      </span>
                    </div>
                    <div
                      className="flex justify-between items-center pb-4"
                      style={{
                        borderBottom: "1px solid var(--color-neutral-200)",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-sans)",
                          color: "var(--color-neutral-700)",
                        }}
                      >
                        幼児（3歳以上）
                      </span>
                      <span
                        className="text-2xl font-bold"
                        style={{
                          fontFamily: "var(--font-serif)",
                          color: "var(--color-strawberry-600)",
                        }}
                      >
                        ¥{pricing.child.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span
                        style={{
                          fontFamily: "var(--font-sans)",
                          color: "var(--color-neutral-700)",
                        }}
                      >
                        お持ち帰り
                      </span>
                      <span
                        className="text-xl font-bold"
                        style={{
                          fontFamily: "var(--font-serif)",
                          color: "var(--color-strawberry-600)",
                        }}
                      >
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
            transition={{ duration: 0.8 }}
            className="mt-12 max-w-3xl mx-auto p-6 rounded-2xl"
            style={{
              background: "white",
              border: "1px solid var(--color-neutral-200)",
            }}
          >
            <p
              className="text-center"
              style={{
                fontFamily: "var(--font-sans)",
                color: "var(--color-neutral-600)",
                lineHeight: "1.8",
              }}
            >
              {STRAWBERRY_PICKING.footwearNote}
            </p>
          </motion.div>
        </div>
      </section>

      {/* よくあるご質問セクション */}
      <FaqSection 
        tags={['いちご狩り']}
        title="いちご狩りに関するよくあるご質問"
        description="いちご狩りについてよくいただくご質問をまとめました"
      />

      {/* YouTube動画セクション */}
      <section className="py-20 lg:py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2
              className="text-4xl lg:text-5xl font-bold mb-4"
              style={{
                fontFamily: "var(--font-serif)",
                color: "var(--color-neutral-900)",
              }}
            >
              いちご狩りの様子
            </h2>
            <p
              className="text-lg"
              style={{
                fontFamily: "var(--font-sans)",
                color: "var(--color-neutral-700)",
                lineHeight: "1.8",
              }}
            >
              実際のいちご狩りの雰囲気を動画でご覧ください
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <div className="relative" style={{ aspectRatio: "16/9" }}>
                <iframe
                  src="https://www.youtube.com/embed/I8I8PZ2jPuY?rel=0"
                  title="いちご狩りの様子"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
            
            <p
              className="text-center mt-6 text-sm"
              style={{
                fontFamily: "var(--font-sans)",
                color: "var(--color-neutral-500)",
              }}
            >
              ※再生ボタンをクリックすると、音声付きで動画が再生されます
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
            transition={{ duration: 0.8 }}
            className="text-center p-12 lg:p-16 rounded-3xl relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, var(--color-strawberry-600) 0%, var(--color-strawberry-700) 100%)",
            }}
          >
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <h2
                className="text-3xl lg:text-4xl font-bold mb-6 text-white"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                ご予約・お問い合わせ
              </h2>
              <p
                className="text-lg mb-8 text-white/90"
                style={{ fontFamily: "var(--font-sans)", lineHeight: "1.8" }}
              >
                いちご狩りは完全予約制です。お電話またはメールにてご予約ください
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={`tel:${FARM_INFO.contact.phone}`}
                  onClick={() => trackStrawberryPickingPhoneReservation(FARM_INFO.contact.phone)}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full transition-all duration-300 text-lg font-semibold"
                  style={{
                    background: "white",
                    color: "var(--color-strawberry-600)",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  <Phone className="w-5 h-5" />
                  電話で予約
                </a>
                <a
                  href="/contact"
                  onClick={() => trackStrawberryPickingConversion()}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full transition-all duration-300 text-lg font-semibold"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(12px)",
                    border: "2px solid white",
                    color: "white",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  メールで予約
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
