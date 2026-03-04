import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingCart, Trash2, ExternalLink, Minus, Plus } from 'lucide-react';
import { useCart } from '@/app/contexts/CartContext';
import { formatPrice } from '@/utils/shopify';
import { useState, useEffect } from 'react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeItem, updateQuantity, updateCartNote, isLoading } = useCart();
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
                    const allocations = item.discountAllocations || [];
                    const hasCartDiscount = allocations.length > 0;
                    const lineTotalAmount = item.cost?.totalAmount;
                    const unitPrice = parseFloat(item.merchandise.priceV2.amount);
                    const lineTotal = lineTotalAmount
                      ? parseFloat(lineTotalAmount.amount)
                      : unitPrice * item.quantity;
                    const currencyCode = item.merchandise.priceV2.currencyCode;

                    return (
                      <div
                        key={item.id}
                        className="p-4 rounded-2xl border"
                        style={{ borderColor: 'var(--color-neutral-200)' }}
                      >
                        {/* 上段: 画像 + 商品名 + 削除ボタン */}
                        <div className="flex gap-3 mb-3">
                          {imageUrl && (
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={imageUrl}
                                alt={product.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3
                              className="font-semibold text-sm sm:text-base leading-tight"
                              style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-900)' }}
                            >
                              {product.title}
                            </h3>
                            {item.merchandise.title !== 'Default Title' && (
                              <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--color-neutral-600)' }}>
                                {item.merchandise.title}
                              </p>
                            )}
                            {item.quantity > 1 && (
                              <p className="text-xs mt-0.5" style={{ color: 'var(--color-neutral-500)' }}>
                                単価: {formatPrice(String(unitPrice), currencyCode)}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            disabled={isLoading}
                            className="p-1.5 rounded-lg hover:bg-red-50 transition-colors self-start flex-shrink-0"
                            aria-label="削除"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>

                        {/* 下段: 数量セレクター + 小計 */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                if (item.quantity <= 1) {
                                  removeItem(item.id);
                                } else {
                                  updateQuantity(item.id, item.quantity - 1);
                                }
                              }}
                              disabled={isLoading}
                              className="w-8 h-8 flex items-center justify-center rounded-full border transition-colors hover:bg-gray-100 disabled:opacity-50"
                              style={{ borderColor: 'var(--color-neutral-300)' }}
                              aria-label="数量を減らす"
                            >
                              <Minus className="w-3.5 h-3.5" style={{ color: 'var(--color-neutral-600)' }} />
                            </button>
                            <span
                              className="w-8 text-center text-sm font-semibold"
                              style={{ color: 'var(--color-neutral-900)' }}
                            >
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={isLoading}
                              className="w-8 h-8 flex items-center justify-center rounded-full border transition-colors hover:bg-gray-100 disabled:opacity-50"
                              style={{ borderColor: 'var(--color-neutral-300)' }}
                              aria-label="数量を増やす"
                            >
                              <Plus className="w-3.5 h-3.5" style={{ color: 'var(--color-neutral-600)' }} />
                            </button>
                          </div>
                          <div className="flex flex-col items-end gap-0.5">
                            {hasCartDiscount && (
                              <span className="text-xs line-through" style={{ color: 'var(--color-neutral-400)' }}>
                                {formatPrice(String(unitPrice * item.quantity), currencyCode)}
                              </span>
                            )}
                            <span className="font-bold text-sm sm:text-base" style={{ color: 'var(--color-strawberry-600)' }}>
                              {formatPrice(String(lineTotal), currencyCode)}
                            </span>
                            {hasCartDiscount && (
                              <div className="flex flex-col gap-0.5">
                                {allocations.map((alloc: any, idx: number) => (
                                  <span key={idx} className="text-xs font-medium" style={{ color: 'var(--color-strawberry-500)' }}>
                                    {alloc.title ? `${alloc.title}適用` : `割引 -${formatPrice(alloc.discountedAmount.amount, alloc.discountedAmount.currencyCode)}`}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && totalAmount && (
              <div className="border-t p-6 space-y-4">
                {cart.cost.subtotalAmount && totalAmount && parseFloat(cart.cost.subtotalAmount.amount) > parseFloat(totalAmount.amount) && (
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: 'var(--color-strawberry-600)' }}>割引合計</span>
                    <span className="font-bold" style={{ color: 'var(--color-strawberry-600)' }}>
                      -{formatPrice(
                        String(parseFloat(cart.cost.subtotalAmount.amount) - parseFloat(totalAmount.amount)),
                        totalAmount.currencyCode
                      )}
                    </span>
                  </div>
                )}
                {cartItems.some(({ node }) => node.discountAllocations && node.discountAllocations.length > 0) && (
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--color-neutral-500)' }}>
                    ※ 割引は併用できないため、カート内で一部の割引のみが適用されます。チェックアウト時に最もお得な割引が自動で適用されます。
                  </p>
                )}
                <div className="flex items-center justify-between text-lg">
                  <span style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)' }}>
                    合計
                  </span>
                  <span className="text-2xl font-bold" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-strawberry-600)' }}>
                    {formatPrice(totalAmount.amount, totalAmount.currencyCode)}
                  </span>
                </div>

                {(() => {
                  const packageCount = cartItems.reduce((sum, { node }) => sum + node.quantity, 0);
                  if (packageCount < 2) return null;
                  return (
                    <div
                      className="flex items-start gap-2 p-3 rounded-lg text-sm"
                      style={{ backgroundColor: 'var(--color-neutral-100)', color: 'var(--color-neutral-700)' }}
                    >
                      <span className="flex-shrink-0 mt-0.5">📦</span>
                      <div>
                        <p className="font-semibold">{packageCount}梱包での配送になります</p>
                        <p className="mt-1 text-xs" style={{ color: 'var(--color-neutral-500)' }}>
                          ※送料は梱包数分かかります。正確な送料はチェックアウト時に確定します。
                        </p>
                      </div>
                    </div>
                  );
                })()}

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
