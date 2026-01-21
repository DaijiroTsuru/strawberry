import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Menu, X } from 'lucide-react';

export function HeaderJP() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: '御案内', href: '#' },
    { label: '品々', href: '#products' },
    { label: '想い', href: '#about' },
    { label: '所在', href: '#access' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white shadow-md border-b border-stone-200' 
          : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-24">
          {/* ロゴ */}
          <a href="#" className="flex items-center gap-3">
            <div className="w-12 h-12 border-2 border-red-800 flex items-center justify-center">
              <span className="text-red-800 font-serif text-2xl">津</span>
            </div>
            <div className="font-serif">
              <div className="text-xl text-gray-900" style={{ letterSpacing: '0.2em' }}>
                津留苺園
              </div>
              <div className="text-xs text-gray-500 tracking-widest">
                TSURU STRAWBERRY FARM
              </div>
            </div>
          </a>

          {/* デスクトップナビゲーション */}
          <nav className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-gray-700 hover:text-red-800 transition-colors font-serif relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-red-800 group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </nav>

          {/* カートボタン */}
          <div className="flex items-center gap-4">
            <a
              href="https://YOUR_STORE.myshopify.com/cart"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-6 py-3 bg-red-800 hover:bg-red-900 text-white transition-colors duration-300 font-serif text-sm border-2 border-red-800"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>購入</span>
            </a>

            {/* モバイルメニューボタン */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-700"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* モバイルメニュー */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-white border-t border-stone-200"
        >
          <nav className="px-4 py-6 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block text-gray-700 hover:text-red-800 hover:bg-stone-50 transition-colors font-serif py-3 px-4 border-l-4 border-transparent hover:border-red-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href="https://YOUR_STORE.myshopify.com/cart"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-4 bg-red-800 hover:bg-red-900 text-white transition-colors duration-300 font-serif justify-center mt-4"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>購入</span>
            </a>
          </nav>
        </motion.div>
      )}
    </header>
  );
}
