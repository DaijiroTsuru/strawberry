import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingCart, Trash2, ExternalLink } from 'lucide-react';
import { useCart } from '@/app/contexts/CartContext';
import { formatPrice } from '@/utils/shopify';
import { useState, useEffect } from 'react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeItem, updateCartNote, isLoading } = useCart();
  const [note, setNote] = useState('');
  const maxNoteLength = 500;

  // カートが読み込まれたら既存のnoteを設定
  useEffect(() => {
    if (cart?.note) {
      setNote(cart.note);
    }
  }, [cart?.note]);

  // noteが変更されたらデバウンスして保存
  useEffect(() => {
    if (!cart) return;
    
    const timer = setTimeout(() => {
      if (note !== (cart.note || '')) {
        updateCartNote(note).catch(console.error);
      }
    }, 1000); // 1秒のデバウンス

    return () => clearTimeout(timer);
  }, [note, cart, updateCartNote]);

  const cartItems = cart?.lines.edges || [];
  const totalAmount = cart?.cost.totalAmount;

  const drawerContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-6 h-6" style={{ color: 'var(--color-strawberry-600)' }} />
                <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-neutral-900)' }}>
                  カート
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="カートを閉じる"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-600)' }}>
                    カートは空です
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map(({ node: item }) => {
                    const product = item.merchandise.product;
                    const imageUrl = product.images?.edges[0]?.node.url;

                    return (
                      <div
                        key={item.id}
                        className="flex gap-4 p-4 rounded-2xl border"
                        style={{ borderColor: 'var(--color-neutral-200)' }}
                      >
                        {/* Product Image */}
                        {imageUrl && (
                          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={imageUrl}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <h3
                            className="font-semibold mb-1"
                            style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-900)' }}
                          >
                            {product.title}
                          </h3>
                          {item.merchandise.title !== 'Default Title' && (
                            <p className="text-sm mb-2" style={{ color: 'var(--color-neutral-600)' }}>
                              {item.merchandise.title}
                            </p>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-sm" style={{ color: 'var(--color-neutral-600)' }}>
                              数量: {item.quantity}
                            </span>
                            <span className="font-bold" style={{ color: 'var(--color-strawberry-600)' }}>
                              {formatPrice(
                                item.merchandise.priceV2.amount,
                                item.merchandise.priceV2.currencyCode
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={isLoading}
                          className="p-2 rounded-lg hover:bg-red-50 transition-colors self-start"
                          aria-label="削除"
                        >
                          <Trash2 className="w-5 h-5 text-red-500" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && totalAmount && (
              <div className="border-t p-6 space-y-4">
                <div className="flex items-center justify-between text-lg">
                  <span style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)' }}>
                    合計
                  </span>
                  <span className="text-2xl font-bold" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-strawberry-600)' }}>
                    {formatPrice(totalAmount.amount, totalAmount.currencyCode)}
                  </span>
                </div>

                {/* 備考欄 */}
                <div className="space-y-2">
                  <label 
                    htmlFor="cart-note" 
                    className="block text-sm font-semibold"
                    style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)' }}
                  >
                    ご要望・熨斗など
                  </label>
                  <textarea
                    id="cart-note"
                    value={note}
                    onChange={(e) => setNote(e.target.value.slice(0, maxNoteLength))}
                    maxLength={maxNoteLength}
                    placeholder="熨斗のご希望や配送に関するご要望などをご記入ください（500文字まで）"
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border resize-none focus:outline-none focus:ring-2"
                    style={{
                      borderColor: 'var(--color-neutral-300)',
                      fontFamily: 'var(--font-sans)',
                      color: 'var(--color-neutral-900)',
                      '--tw-ring-color': 'var(--color-strawberry-400)',
                    } as React.CSSProperties}
                  />
                  <div className="flex justify-end text-xs" style={{ color: 'var(--color-neutral-500)' }}>
                    {note.length} / {maxNoteLength}文字
                  </div>
                </div>

                <a
                  href={cart.checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-strawberry-600) 0%, var(--color-strawberry-700) 100%)',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 600,
                    color: 'white'
                  }}
                >
                  <span>購入手続きへ</span>
                  <ExternalLink className="w-5 h-5" />
                </a>

                <p className="text-xs text-center" style={{ color: 'var(--color-neutral-500)' }}>
                  Shopifyのチェックアウトページに移動します
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return typeof window !== 'undefined' 
    ? createPortal(drawerContent, document.body)
    : null;
}
