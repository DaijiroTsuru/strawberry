import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Smartphone } from 'lucide-react';
import { FARM_INFO } from '@/app/constants/farmInfo';
import { ContactForm } from './ContactForm';

export function AccessSection() {
  return (
    <section id="access" className="py-24 lg:py-32 px-4 bg-white">
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
            <MapPin className="w-4 h-4" style={{ color: 'var(--color-strawberry-600)' }} />
            <span 
              className="text-sm font-medium" 
              style={{ 
                color: 'var(--color-strawberry-700)',
                fontFamily: 'var(--font-sans)',
                letterSpacing: '0.05em'
              }}
            >
              Access
            </span>
          </motion.div>

          <h2 
            className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-4"
            style={{ 
              fontFamily: 'var(--font-serif)',
              color: 'var(--color-neutral-900)',
              letterSpacing: '0.02em'
            }}
          >
            アクセス・お問い合わせ
          </h2>
        </motion.div>

        {/* 農園の写真 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 lg:mb-20"
        >
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {/* いちご園看板 */}
            <div className="relative rounded-3xl overflow-hidden shadow-xl group">
              <div className="relative" style={{ aspectRatio: '16/9' }}>
                <img
                  src="https://cdn.shopify.com/s/files/1/0791/6434/2495/files/0CEB5C93-92BA-47ED-89A6-140DEFD40174_1_105_c.jpg?v=1768511100"
                  alt="津留いちご園 看板"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                ></div>
              </div>
              <div 
                className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500"
              >
                <p 
                  className="text-lg font-semibold"
                  style={{ fontFamily: 'var(--font-sans)', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
                >
                  いちご園看板
                </p>
              </div>
            </div>

            {/* 全体の風景 */}
            <div className="relative rounded-3xl overflow-hidden shadow-xl group">
              <div className="relative" style={{ aspectRatio: '16/9' }}>
                <img
                  src="https://cdn.shopify.com/s/files/1/0791/6434/2495/files/432B94FE-D152-4224-8126-52B0791AC0D0_1_105_c.jpg?v=1768511099"
                  alt="津留いちご園 全体風景"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                ></div>
              </div>
              <div 
                className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500"
              >
                <p 
                  className="text-lg font-semibold"
                  style={{ fontFamily: 'var(--font-sans)', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
                >
                  農園全体の風景
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* 地図 */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl overflow-hidden shadow-2xl h-[500px] lg:h-[600px] relative"
          >
            {/* Google Maps埋め込み */}
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY || 'YOUR_API_KEY'}&q=${encodeURIComponent(FARM_INFO.address.full)}`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="津留いちご園の地図"
            ></iframe>
          </motion.div>

          {/* 連絡先情報 */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <div 
              className="group p-8 rounded-3xl transition-all duration-500 hover:shadow-xl"
              style={{
                background: 'linear-gradient(135deg, var(--color-neutral-50) 0%, white 100%)',
                border: '1px solid var(--color-neutral-200)'
              }}
            >
              <div className="flex items-start gap-5">
                <div 
                  className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-strawberry-600) 0%, var(--color-strawberry-700) 100%)',
                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)'
                  }}
                >
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 
                    className="font-bold text-xl mb-3"
                    style={{ 
                      fontFamily: 'var(--font-serif)',
                      color: 'var(--color-neutral-900)'
                    }}
                  >
                    住所
                  </h3>
                  <p 
                    className="leading-relaxed"
                    style={{ 
                      fontFamily: 'var(--font-sans)',
                      color: 'var(--color-neutral-700)',
                      lineHeight: '1.8'
                    }}
                  >
                    {FARM_INFO.address.postal}<br />
                    {FARM_INFO.address.full}<br />
                    <span style={{ color: 'var(--color-neutral-500)', fontSize: '0.9rem' }}>
                      （{FARM_INFO.address.note}）
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div 
              className="group p-8 rounded-3xl transition-all duration-500 hover:shadow-xl"
              style={{
                background: 'linear-gradient(135deg, var(--color-neutral-50) 0%, white 100%)',
                border: '1px solid var(--color-neutral-200)'
              }}
            >
              <div className="flex items-start gap-5">
                <div 
                  className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-strawberry-600) 0%, var(--color-strawberry-700) 100%)',
                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)'
                  }}
                >
                  <Phone className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 
                    className="font-bold text-xl mb-3"
                    style={{ 
                      fontFamily: 'var(--font-serif)',
                      color: 'var(--color-neutral-900)'
                    }}
                  >
                    電話番号
                  </h3>
                  <a 
                    href={`tel:${FARM_INFO.contact.phone}`}
                    className="block mb-2 transition-colors duration-300 hover:underline"
                    style={{ 
                      fontFamily: 'var(--font-sans)',
                      color: 'var(--color-strawberry-600)',
                      fontSize: '1.125rem',
                      fontWeight: 600
                    }}
                  >
                    {FARM_INFO.contact.phone}
                  </a>
                  <p style={{ color: 'var(--color-neutral-500)', fontSize: '0.875rem', fontFamily: 'var(--font-sans)' }}>
                    ※いちご狩りは要予約です
                  </p>
                </div>
              </div>
            </div>

            <div 
              className="group p-8 rounded-3xl transition-all duration-500 hover:shadow-xl"
              style={{
                background: 'linear-gradient(135deg, var(--color-neutral-50) 0%, white 100%)',
                border: '1px solid var(--color-neutral-200)'
              }}
            >
              <div className="flex items-start gap-5">
                <div 
                  className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-strawberry-600) 0%, var(--color-strawberry-700) 100%)',
                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)'
                  }}
                >
                  <Smartphone className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 
                    className="font-bold text-xl mb-3"
                    style={{ 
                      fontFamily: 'var(--font-serif)',
                      color: 'var(--color-neutral-900)'
                    }}
                  >
                    携帯電話
                  </h3>
                  <a 
                    href={`tel:${FARM_INFO.contact.mobile}`}
                    className="transition-colors duration-300 hover:underline"
                    style={{ 
                      fontFamily: 'var(--font-sans)',
                      color: 'var(--color-strawberry-600)',
                      fontSize: '1.125rem',
                      fontWeight: 600
                    }}
                  >
                    {FARM_INFO.contact.mobile}
                  </a>
                </div>
              </div>
            </div>

            <div 
              className="group p-8 rounded-3xl transition-all duration-500 hover:shadow-xl"
              style={{
                background: 'linear-gradient(135deg, var(--color-neutral-50) 0%, white 100%)',
                border: '1px solid var(--color-neutral-200)'
              }}
            >
              <div className="flex items-start gap-5">
                <div 
                  className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-strawberry-600) 0%, var(--color-strawberry-700) 100%)',
                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)'
                  }}
                >
                  <Mail className="w-7 h-7 text-white" />
                </div>
                <div className="min-w-0">
                  <h3 
                    className="font-bold text-xl mb-3"
                    style={{ 
                      fontFamily: 'var(--font-serif)',
                      color: 'var(--color-neutral-900)'
                    }}
                  >
                    メール
                  </h3>
                  <a 
                    href={`mailto:${FARM_INFO.contact.email}`}
                    className="break-all transition-colors duration-300 hover:underline"
                    style={{ 
                      fontFamily: 'var(--font-sans)',
                      color: 'var(--color-strawberry-600)',
                      fontWeight: 500
                    }}
                  >
                    {FARM_INFO.contact.email}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* お問い合わせフォーム */}
        <ContactForm />
      </div>
    </section>
  );
}