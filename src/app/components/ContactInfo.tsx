import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Smartphone } from 'lucide-react';
import { FARM_INFO } from '@/app/constants/farmInfo';
import { trackStrawberryPickingPhoneReservation } from '@/utils/analytics';

export function ContactInfo() {
  return (
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
          border: '1px solid var(--color-neutral-200)',
        }}
      >
        <div className="flex items-start gap-5">
          <div
            className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            style={{
              background: 'linear-gradient(135deg, var(--color-strawberry-600) 0%, var(--color-strawberry-700) 100%)',
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)',
            }}
          >
            <MapPin className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3
              className="font-bold text-xl mb-3"
              style={{
                fontFamily: 'var(--font-serif)',
                color: 'var(--color-neutral-900)',
              }}
            >
              住所
            </h3>
            <p
              className="leading-relaxed"
              style={{
                fontFamily: 'var(--font-sans)',
                color: 'var(--color-neutral-700)',
                lineHeight: '1.8',
              }}
            >
              {FARM_INFO.address.postal}
              <br />
              {FARM_INFO.address.full}
              <br />
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
          border: '1px solid var(--color-neutral-200)',
        }}
      >
        <div className="flex items-start gap-5">
          <div
            className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            style={{
              background: 'linear-gradient(135deg, var(--color-strawberry-600) 0%, var(--color-strawberry-700) 100%)',
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)',
            }}
          >
            <Phone className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3
              className="font-bold text-xl mb-3"
              style={{
                fontFamily: 'var(--font-serif)',
                color: 'var(--color-neutral-900)',
              }}
            >
              電話番号
            </h3>
            <a
              href={`tel:${FARM_INFO.contact.phone}`}
              onClick={() => trackStrawberryPickingPhoneReservation(FARM_INFO.contact.phone)}
              className="block mb-2 transition-colors duration-300 hover:underline"
              style={{
                fontFamily: 'var(--font-sans)',
                color: 'var(--color-strawberry-600)',
                fontSize: '1.125rem',
                fontWeight: 600,
              }}
            >
              {FARM_INFO.contact.phone}
            </a>
            <p
              style={{
                color: 'var(--color-neutral-500)',
                fontSize: '0.875rem',
                fontFamily: 'var(--font-sans)',
              }}
            >
              ※いちご狩りは要予約です
            </p>
          </div>
        </div>
      </div>

      <div
        className="group p-8 rounded-3xl transition-all duration-500 hover:shadow-xl"
        style={{
          background: 'linear-gradient(135deg, var(--color-neutral-50) 0%, white 100%)',
          border: '1px solid var(--color-neutral-200)',
        }}
      >
        <div className="flex items-start gap-5">
          <div
            className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            style={{
              background: 'linear-gradient(135deg, var(--color-strawberry-600) 0%, var(--color-strawberry-700) 100%)',
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)',
            }}
          >
            <Smartphone className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3
              className="font-bold text-xl mb-3"
              style={{
                fontFamily: 'var(--font-serif)',
                color: 'var(--color-neutral-900)',
              }}
            >
              携帯電話
            </h3>
            <a
              href={`tel:${FARM_INFO.contact.mobile}`}
              onClick={() => trackStrawberryPickingPhoneReservation(FARM_INFO.contact.mobile)}
              className="transition-colors duration-300 hover:underline"
              style={{
                fontFamily: 'var(--font-sans)',
                color: 'var(--color-strawberry-600)',
                fontSize: '1.125rem',
                fontWeight: 600,
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
          border: '1px solid var(--color-neutral-200)',
        }}
      >
        <div className="flex items-start gap-5">
          <div
            className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            style={{
              background: 'linear-gradient(135deg, var(--color-strawberry-600) 0%, var(--color-strawberry-700) 100%)',
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)',
            }}
          >
            <Mail className="w-7 h-7 text-white" />
          </div>
          <div className="min-w-0">
            <h3
              className="font-bold text-xl mb-3"
              style={{
                fontFamily: 'var(--font-serif)',
                color: 'var(--color-neutral-900)',
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
                fontWeight: 500,
              }}
            >
              {FARM_INFO.contact.email}
            </a>
            <p
              className="text-xs mt-2"
              style={{
                color: 'var(--color-neutral-500)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              ※クリックでメールアプリが開きます
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
