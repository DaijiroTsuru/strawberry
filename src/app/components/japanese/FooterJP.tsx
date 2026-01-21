import { Facebook, Instagram, Mail } from 'lucide-react';
import { FARM_INFO } from '@/app/constants/farmInfo';

export function FooterJP() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-900 text-stone-100 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* 農園情報 */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 border-2 border-red-800 flex items-center justify-center">
                <span className="text-red-800 font-serif text-2xl">津</span>
              </div>
              <div className="font-serif">
                <div className="text-xl" style={{ letterSpacing: '0.2em' }}>
                  津留苺園
                </div>
                <div className="text-xs text-stone-400 tracking-widest mt-1">
                  TSURU STRAWBERRY FARM
                </div>
              </div>
            </div>
            <p className="text-stone-400 leading-loose mb-6 max-w-md">
              除草剤や農薬を一切使用せず、<br />
              有機質肥料で丹精込めて栽培した苺をお届けいたします。
            </p>

            {/* SNS */}
            <div className="flex gap-4">
              <a
                href={`mailto:${FARM_INFO.contact.email}`}
                className="w-10 h-10 border border-stone-700 flex items-center justify-center hover:border-red-800 hover:text-red-800 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* メニュー */}
          <div>
            <h3 className="font-serif text-lg mb-6 border-b border-stone-700 pb-3">
              御案内
            </h3>
            <ul className="space-y-3 text-stone-400">
              <li>
                <a href="#" className="hover:text-red-800 transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-red-800"></span>
                  御案内
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-red-800 transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-red-800"></span>
                  品々
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-red-800 transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-red-800"></span>
                  想い
                </a>
              </li>
              <li>
                <a href="#access" className="hover:text-red-800 transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-red-800"></span>
                  所在
                </a>
              </li>
            </ul>
          </div>

          {/* お問い合わせ */}
          <div>
            <h3 className="font-serif text-lg mb-6 border-b border-stone-700 pb-3">
              連絡先
            </h3>
            <ul className="space-y-3 text-stone-400 text-sm">
              <li>{FARM_INFO.address.postal}</li>
              <li>{FARM_INFO.address.full}</li>
              <li className="pt-2">
                <a href={`tel:${FARM_INFO.contact.phone}`} className="hover:text-red-800 transition-colors">
                  TEL: {FARM_INFO.contact.phone}
                </a>
              </li>
              <li>
                <a href={`tel:${FARM_INFO.contact.mobile}`} className="hover:text-red-800 transition-colors">
                  携帯: {FARM_INFO.contact.mobile}
                </a>
              </li>
              <li>
                <a href={`mailto:${FARM_INFO.contact.email}`} className="hover:text-red-800 transition-colors break-all">
                  {FARM_INFO.contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* コピーライト */}
        <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-stone-500 text-sm">
          <p className="font-serif">
            &copy; {currentYear} {FARM_INFO.name}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-red-800 transition-colors">
              プライバシーポリシー
            </a>
            <a href="#" className="hover:text-red-800 transition-colors">
              特定商取引法
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}