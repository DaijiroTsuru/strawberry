import { Instagram, Mail } from 'lucide-react';
import { FARM_INFO, NAV_ITEMS } from '@/app/constants/farmInfo';
import { trackStrawberryPickingPhoneReservation } from '@/utils/analytics';

// カスタムSNSアイコン
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function LineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
    </svg>
  );
}

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
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* 会社情報 */}
          <div className="md:col-span-2 lg:col-span-1">
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
            <div className="flex gap-3 flex-wrap">
              <a
                href="https://www.instagram.com/tsuruichigoen/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group hover:bg-[rgba(255,255,255,0.1)]"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <Instagram className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61587610740050"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group hover:bg-[rgba(255,255,255,0.1)]"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <FacebookIcon className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
              </a>
              <a
                href="https://x.com/tsuruichigoen"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group hover:bg-[rgba(255,255,255,0.1)]"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <XIcon className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
              </a>
              <a
                href="https://line.me/R/ti/p/@187syioi"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LINE"
                className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group hover:bg-[rgba(255,255,255,0.1)]"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <LineIcon className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
              </a>
              <a
                href="/contact"
                aria-label="お問い合わせ"
                className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group hover:bg-[rgba(255,255,255,0.1)]"
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

          {/* 商品カテゴリ */}
          <div>
            <h3
              className="font-bold mb-6 text-white"
              style={{ fontFamily: 'var(--font-serif)', letterSpacing: '0.03em' }}
            >
              商品カテゴリ
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/strawberries"
                  className="transition-colors duration-300 hover:text-[color:var(--color-strawberry-400)]"
                  style={{
                    color: 'var(--color-neutral-400)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.95rem'
                  }}
                >
                  厳選いちご
                </a>
              </li>
              <li>
                <a
                  href="/rice"
                  className="transition-colors duration-300 hover:text-[color:var(--color-strawberry-400)]"
                  style={{
                    color: 'var(--color-neutral-400)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.95rem'
                  }}
                >
                  無農薬栽培米
                </a>
              </li>
              <li>
                <a
                  href="/strawberry-picking"
                  className="transition-colors duration-300 hover:text-[color:var(--color-strawberry-400)]"
                  style={{
                    color: 'var(--color-neutral-400)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.95rem'
                  }}
                >
                  いちご狩り
                </a>
              </li>
            </ul>
          </div>

          {/* ポリシー */}
          <div>
            <h3 
              className="font-bold mb-6 text-white"
              style={{ fontFamily: 'var(--font-serif)', letterSpacing: '0.03em' }}
            >
              ポリシー
            </h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="/privacy-policy" 
                  className="transition-colors duration-300 hover:text-[color:var(--color-strawberry-400)]"
                  style={{ 
                    color: 'var(--color-neutral-400)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.95rem'
                  }}
                >
                  プライバシーポリシー
                </a>
              </li>
              <li>
                <a 
                  href="/terms-of-service" 
                  className="transition-colors duration-300 hover:text-[color:var(--color-strawberry-400)]"
                  style={{ 
                    color: 'var(--color-neutral-400)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.95rem'
                  }}
                >
                  利用規約
                </a>
              </li>
              <li>
                <a 
                  href="/refund-policy" 
                  className="transition-colors duration-300 hover:text-[color:var(--color-strawberry-400)]"
                  style={{ 
                    color: 'var(--color-neutral-400)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.95rem'
                  }}
                >
                  返品・交換ポリシー
                </a>
              </li>
              <li>
                <a 
                  href="/shipping-policy" 
                  className="transition-colors duration-300 hover:text-[color:var(--color-strawberry-400)]"
                  style={{ 
                    color: 'var(--color-neutral-400)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.95rem'
                  }}
                >
                  配送ポリシー
                </a>
              </li>
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