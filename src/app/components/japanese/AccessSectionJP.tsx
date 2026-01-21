import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Smartphone } from 'lucide-react';
import { FARM_INFO } from '@/app/constants/farmInfo';

export function AccessSectionJP() {
  return (
    <section id="access" className="py-24 px-4 bg-stone-50">
      <div className="max-w-7xl mx-auto">
        {/* セクションタイトル */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-serif text-gray-900 mb-4" style={{ letterSpacing: '0.2em' }}>
            所在
          </h2>
          <div className="w-24 h-1 bg-red-800 mx-auto"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16">
          {/* 連絡先情報 */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="border-l-4 border-red-800 pl-8 py-4">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-red-800 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-xl mb-3 text-gray-900">所在地</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {FARM_INFO.address.postal}<br />
                    {FARM_INFO.address.full}<br />
                    <span className="text-sm text-gray-500">（{FARM_INFO.address.note}）</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-red-800 pl-8 py-4">
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-red-800 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-xl mb-3 text-gray-900">電話</h3>
                  <a 
                    href={`tel:${FARM_INFO.contact.phone}`}
                    className="text-gray-700 hover:text-red-800 transition-colors text-lg"
                  >
                    {FARM_INFO.contact.phone}
                  </a>
                  <p className="text-sm text-gray-500 mt-2">
                    ※いちご狩りは要予約です
                  </p>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-red-800 pl-8 py-4">
              <div className="flex items-start gap-4">
                <Smartphone className="w-6 h-6 text-red-800 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-xl mb-3 text-gray-900">携帯電話</h3>
                  <a 
                    href={`tel:${FARM_INFO.contact.mobile}`}
                    className="text-gray-700 hover:text-red-800 transition-colors text-lg"
                  >
                    {FARM_INFO.contact.mobile}
                  </a>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-red-800 pl-8 py-4">
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-red-800 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-xl mb-3 text-gray-900">電子郵便</h3>
                  <a 
                    href={`mailto:${FARM_INFO.contact.email}`}
                    className="text-gray-700 hover:text-red-800 transition-colors break-all"
                  >
                    {FARM_INFO.contact.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-red-800 pl-8 py-4">
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-red-800 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif text-xl mb-3 text-gray-900">営業時間</h3>
                  <p className="text-gray-700 leading-relaxed">
                    月曜日〜土曜日：午前九時〜午後六時<br />
                    定休日：日曜日
                  </p>
                </div>
              </div>
            </div>

            {/* 装飾 */}
            <div className="mt-12 pt-8 border-t border-stone-200">
              <p className="text-gray-600 text-sm leading-loose">
                お問い合わせ、ご注文など、何なりとお気軽にご連絡くださいませ。<br />
                心よりお待ち申し上げております。
              </p>
            </div>
          </motion.div>

          {/* 地図 */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="border-8 border-white shadow-xl h-[600px] bg-stone-100">
              {/* Google Maps埋め込み */}
              <iframe
                src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}&q=${encodeURIComponent(FARM_INFO.address.full)}`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="津留いちご園の地図"
              ></iframe>
            </div>
            <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-red-800 -z-10"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}