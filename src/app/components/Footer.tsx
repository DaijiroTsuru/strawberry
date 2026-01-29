import { Facebook, Instagram, Mail } from 'lucide-react';
import { FARM_INFO, NAV_ITEMS } from '@/app/constants/farmInfo';
import { trackStrawberryPickingPhoneReservation } from '@/utils/analytics';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="py-16 lg:py-20 px-4"
      style={{
        background: 'linear-gradient(to bottom, var(--color-neutral-900) 0%, var(--color-neutral-800) 100%)'
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* 会社情報 */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, var(--color-strawberry-500) 0%, var(--color-strawberry-600) 100%)',
                  boxShadow: '0 4px 16px rgba(220, 38, 38, 0.3)'
                }}
              >
                <span className="text-white font-bold text-2xl" style={{ fontFamily: 'var(--font-serif)' }}>津</span>
              </div>
              <div>
                <span 
                  className="font-bold text-xl block text-white"
                  style={{ fontFamily: 'var(--font-serif)', letterSpacing: '0.02em' }}
                >
                  {FARM_INFO.name}
                </span>
                <span 
                  className="text-xs block mt-1"
                  style={{ 
                    color: 'var(--color-strawberry-300)',
                    fontFamily: 'var(--font-sans)',
                    letterSpacing: '0.1em',
                    fontWeight: 500
                  }}
                >
                  TSURU STRAWBERRY FARM
                </span>
              </div>
            </div>
            <p 
              className="text-sm leading-relaxed mb-6 max-w-md"
              style={{ 
                color: 'var(--color-neutral-400)',
                fontFamily: 'var(--font-sans)',
                lineHeight: '1.8'
              }}
            >
              こだわりの栽培で、<br />
              本物の美味しさをお届けします
            </p>
            
            {/* SNS */}
            <div className="flex gap-3">
              <a
                href="/contact"
                className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <Mail className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
              </a>
            </div>
          </div>

          {/* リンク */}
          <div>
            <h3 
              className="font-bold mb-6 text-white"
              style={{ fontFamily: 'var(--font-serif)', letterSpacing: '0.03em' }}
            >
              メニュー
            </h3>
            <ul className="space-y-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <a 
                    href={item.href} 
                    className="transition-colors duration-300 hover:text-[color:var(--color-strawberry-400)]"
                    style={{ 
                      color: 'var(--color-neutral-400)',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.95rem'
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 連絡先 */}
          <div>
            <h3 
              className="font-bold mb-6 text-white"
              style={{ fontFamily: 'var(--font-serif)', letterSpacing: '0.03em' }}
            >
              お問い合わせ
            </h3>
            <ul className="space-y-3 text-sm" style={{ fontFamily: 'var(--font-sans)' }}>
              <li style={{ color: 'var(--color-neutral-400)' }}>{FARM_INFO.address.postal}</li>
              <li style={{ color: 'var(--color-neutral-400)' }}>{FARM_INFO.address.full}</li>
              <li>
                <a 
                  href={`tel:${FARM_INFO.contact.phone}`}
                  onClick={() => trackStrawberryPickingPhoneReservation(FARM_INFO.contact.phone)}
                  className="transition-colors duration-300"
                  style={{ color: 'var(--color-neutral-400)' }}
                >
                  TEL: {FARM_INFO.contact.phone}
                </a>
              </li>
              <li>
                <a 
                  href={`tel:${FARM_INFO.contact.mobile}`}
                  onClick={() => trackStrawberryPickingPhoneReservation(FARM_INFO.contact.mobile)}
                  className="transition-colors duration-300"
                  style={{ color: 'var(--color-neutral-400)' }}
                >
                  携帯: {FARM_INFO.contact.mobile}
                </a>
              </li>
              <li>
                <a 
                  href="/contact" 
                  className="break-all transition-colors duration-300"
                  style={{ color: 'var(--color-neutral-400)' }}
                >
                  {FARM_INFO.contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* コピーライト */}
        <div 
          className="pt-8 text-center text-sm"
          style={{ 
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'var(--color-neutral-500)',
            fontFamily: 'var(--font-sans)'
          }}
        >
          <p>&copy; {currentYear} {FARM_INFO.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}