import { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { FARM_INFO, NAV_ITEMS } from '@/app/constants/farmInfo';
import { CartDrawer } from './CartDrawer';
import { useCart } from '@/app/contexts/CartContext';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart, isCartOpen, openCart, closeCart } = useCart();

  const cartItemCount = cart?.lines.edges.reduce((total, { node }) => total + node.quantity, 0) || 0;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-white/80 backdrop-blur-sm'
      }`}
      style={{ borderBottom: isScrolled ? '1px solid var(--color-strawberry-100)' : 'none' }}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* ロゴ */}
          <Link to="/" className="flex items-center gap-3 group">
            <div 
              className="w-11 h-11 lg:w-12 lg:h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
              style={{ 
                background: 'linear-gradient(135deg, var(--color-strawberry-500) 0%, var(--color-strawberry-600) 100%)',
                boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)'
              }}
            >
              <span className="text-white font-bold text-xl lg:text-2xl" style={{ fontFamily: 'var(--font-serif)' }}>津</span>
            </div>
            <div>
              <span 
                className="font-bold text-xl lg:text-2xl block transition-colors duration-300"
                style={{ 
                  fontFamily: 'var(--font-serif)',
                  color: 'var(--color-neutral-900)',
                  letterSpacing: '0.02em'
                }}
              >
                {FARM_INFO.name}
              </span>
              <span 
                className="text-xs hidden lg:block" 
                style={{ 
                  color: 'var(--color-strawberry-600)',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 500,
                  letterSpacing: '0.1em'
                }}
              >
                TSURU STRAWBERRY FARM
              </span>
            </div>
          </Link>

          {/* デスクトップナビゲーション */}
          <nav className="hidden md:flex items-center gap-10">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="relative group"
                style={{
                  color: 'var(--color-neutral-700)',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  letterSpacing: '0.02em'
                }}
              >
                <span className="relative z-10 transition-colors duration-300 group-hover:text-[color:var(--color-strawberry-600)]">
                  {item.label}
                </span>
                <span 
                  className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[color:var(--color-strawberry-500)] to-[color:var(--color-strawberry-600)] transition-all duration-300 group-hover:w-full"
                  style={{ transform: 'translateY(4px)' }}
                ></span>
              </a>
            ))}
          </nav>

          {/* カートボタン（商品がある場合のみ表示） */}
          <div className="flex items-center gap-4">
            {cartItemCount > 0 && (
              <button
                onClick={() => openCart()}
                className="hidden md:flex items-center gap-2 px-6 py-2.5 rounded-full transition-all duration-300 group overflow-hidden relative"
                style={{
                  background: 'linear-gradient(135deg, var(--color-strawberry-600) 0%, var(--color-strawberry-700) 100%)',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)',
                  letterSpacing: '0.03em'
                }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[color:var(--color-strawberry-700)] to-[color:var(--color-strawberry-800)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <div className="relative z-10 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-white">カート</span>
                  <span 
                    className="bg-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center"
                    style={{ color: 'var(--color-strawberry-600)' }}
                  >
                    {cartItemCount}
                  </span>
                </div>
              </button>
            )}

            {/* モバイルメニューボタン */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg transition-colors duration-300"
              style={{ color: 'var(--color-neutral-700)' }}
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
          className="md:hidden bg-white/98 backdrop-blur-md"
          style={{ borderTop: '1px solid var(--color-strawberry-100)' }}
        >
          <nav className="px-4 py-6 space-y-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block px-4 py-3 rounded-lg transition-all duration-300"
                style={{
                  color: 'var(--color-neutral-700)',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 500,
                  fontSize: '0.95rem'
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            {cartItemCount > 0 && (
              <button
                onClick={() => {
                  openCart();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 justify-center mt-4 w-full"
                style={{
                  background: 'linear-gradient(135deg, var(--color-strawberry-600) 0%, var(--color-strawberry-700) 100%)',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)'
                }}
              >
                <ShoppingCart className="w-5 h-5 text-white" />
                <span className="text-white">カート</span>
                <span 
                  className="bg-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center"
                  style={{ color: 'var(--color-strawberry-600)' }}
                >
                  {cartItemCount}
                </span>
              </button>
            )}
          </nav>
        </motion.div>
      )}

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => closeCart()} />
    </header>
  );
}