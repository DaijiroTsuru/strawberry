import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Mail, ArrowLeft } from "lucide-react";
import { SEO, createBreadcrumbSchema } from "@/app/components/SEO";
import { ContactForm } from "@/app/components/ContactForm";
import { ContactInfo } from "@/app/components/ContactInfo";

export function ContactPage() {
  return (
    <div className="min-h-screen">
      <SEO
        title="お問い合わせ"
        description="津留いちご園へのお問い合わせはこちらから。商品のご注文、いちご狩りのご予約、その他ご質問など、お気軽にお問い合わせください。"
        keywords="お問い合わせ,連絡先,いちご,いちご狩り,予約,注文,津留いちご園"
        url="/contact"
        structuredData={createBreadcrumbSchema([
          { name: "ホーム", url: "/" },
          { name: "お問い合わせ", url: "/contact" },
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
              className="inline-flex items-center gap-2 mb-8 transition-colors duration-300 hover:text-[color:var(--color-strawberry-600)] cursor-pointer"
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
              <Mail
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
                CONTACT
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
              お問い合わせ
            </h1>
            <p
              className="text-xl lg:text-2xl mb-8 max-w-3xl"
              style={{
                fontFamily: "var(--font-sans)",
                color: "var(--color-neutral-700)",
                lineHeight: "1.8",
              }}
            >
              ご質問・ご相談はお気軽にどうぞ
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

      {/* お問い合わせフォーム */}
      <section
        className="py-20 px-4"
        style={{ background: "var(--color-neutral-50)" }}
      >
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-12">
              <h2
                className="text-3xl lg:text-4xl font-bold mb-4"
                style={{
                  fontFamily: "var(--font-serif)",
                  color: "var(--color-neutral-900)",
                }}
              >
                お問い合わせフォーム
              </h2>
              <p
                className="text-lg"
                style={{
                  fontFamily: "var(--font-sans)",
                  color: "var(--color-neutral-600)",
                  lineHeight: "1.8",
                }}
              >
                下記フォームよりお気軽にお問い合わせください
              </p>
            </div>

            <ContactForm />
          </motion.div>
        </div>
      </section>

      {/* 連絡先情報 */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ContactInfo />
          </div>
        </div>
      </section>
    </div>
  );
}
