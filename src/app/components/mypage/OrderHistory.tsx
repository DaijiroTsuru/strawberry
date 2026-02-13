import { useState } from 'react';
import { motion } from 'motion/react';
import { Package, ExternalLink, ShoppingCart, AlertCircle } from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';
import { useCart } from '@/app/contexts/CartContext';
import { ShopifyOrder } from '@/utils/shopify-customer';
import { formatPrice } from '@/utils/shopify';

const STATUS_MAP: Record<string, string> = {
  PAID: '支払い済み',
  PENDING: '保留中',
  AUTHORIZED: '承認済み',
  PARTIALLY_PAID: '一部支払い済み',
  PARTIALLY_REFUNDED: '一部返金済み',
  REFUNDED: '返金済み',
  VOIDED: '無効',
  FULFILLED: '発送済み',
  UNFULFILLED: '未発送',
  PARTIALLY_FULFILLED: '一部発送済み',
  IN_PROGRESS: '処理中',
  ON_HOLD: '保留中',
  SCHEDULED: '予約済み',
};

function translateStatus(status: string): string {
  return STATUS_MAP[status] || status;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function OrderHistory() {
  const { customer } = useAuth();
  const { addToCart, openCart } = useCart();
  const [reorderingId, setReorderingId] = useState<string | null>(null);
  const [reorderError, setReorderError] = useState<string | null>(null);

  const orders = customer?.orders.edges.map((e) => e.node) || [];

  const handleReorder = async (order: ShopifyOrder) => {
    setReorderingId(order.id);
    setReorderError(null);

    const variantIds = order.lineItems.edges
      .filter((e) => e.node.variant?.id)
      .map((e) => ({
        variantId: e.node.variant!.id,
        quantity: e.node.quantity,
      }));

    if (variantIds.length === 0) {
      setReorderError('再購入可能な商品がありません');
      setReorderingId(null);
      return;
    }

    let addedCount = 0;
    for (const { variantId, quantity } of variantIds) {
      try {
        await addToCart(variantId, quantity);
        addedCount++;
      } catch {
        // バリアントが存在しない場合はスキップ
      }
    }

    setReorderingId(null);

    if (addedCount > 0) {
      openCart();
    } else {
      setReorderError('商品をカートに追加できませんでした。商品が販売終了の可能性があります。');
    }
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <Package className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--color-neutral-300)' }} />
        <p
          className="text-lg font-medium mb-2"
          style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-600)' }}
        >
          まだ注文履歴がありません
        </p>
        <p className="text-sm" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-500)' }}>
          商品を購入すると、こちらに注文履歴が表示されます。
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reorderError && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl flex items-center gap-3"
          style={{
            background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
            border: '1px solid #fca5a5',
          }}
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#dc2626' }} />
          <p style={{ color: '#991b1b', fontFamily: 'var(--font-sans)', fontWeight: 500 }}>
            {reorderError}
          </p>
        </motion.div>
      )}

      {orders.map((order) => (
        <motion.div
          key={order.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-6 lg:p-8"
          style={{
            background: 'white',
            border: '1px solid var(--color-neutral-200)',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h3
                className="text-lg font-bold"
                style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-900)' }}
              >
                注文 #{order.number}
              </h3>
              <p className="text-sm mt-1" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-500)' }}>
                {formatDate(order.processedAt)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  background: 'var(--color-strawberry-50)',
                  color: 'var(--color-strawberry-700)',
                  border: '1px solid var(--color-strawberry-200)',
                }}
              >
                {translateStatus(order.financialStatus)}
              </span>
              <span
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  background: 'var(--color-neutral-100)',
                  color: 'var(--color-neutral-700)',
                  border: '1px solid var(--color-neutral-200)',
                }}
              >
                {translateStatus(order.fulfillmentStatus)}
              </span>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            {order.lineItems.edges.map(({ node: item }, idx) => (
              <div key={idx} className="flex items-center gap-4">
                {item.variant?.image ? (
                  <img
                    src={item.variant.image.url}
                    alt={item.variant.image.altText || item.title}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                    style={{ border: '1px solid var(--color-neutral-200)' }}
                  />
                ) : (
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--color-neutral-100)' }}
                  >
                    <Package className="w-6 h-6" style={{ color: 'var(--color-neutral-400)' }} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p
                    className="font-medium truncate"
                    style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-900)' }}
                  >
                    {item.title}
                  </p>
                  {item.variant && (
                    <p className="text-sm" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-500)' }}>
                      {item.variant.title !== 'Default Title' && item.variant.title} x {item.quantity}
                    </p>
                  )}
                </div>
                {item.variant && (
                  <p
                    className="font-medium flex-shrink-0"
                    style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-900)' }}
                  >
                    {formatPrice(
                      String(parseFloat(item.variant.price.amount) * item.quantity),
                      item.variant.price.currencyCode
                    )}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div
            className="flex flex-wrap items-center justify-between gap-4 pt-6"
            style={{ borderTop: '1px solid var(--color-neutral-200)' }}
          >
            <p
              className="text-lg font-bold"
              style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-900)' }}
            >
              合計: {formatPrice(order.totalPrice.amount, order.totalPrice.currencyCode)}
            </p>
            <div className="flex items-center gap-3">
              <a
                href={order.statusPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:opacity-80"
                style={{
                  background: 'var(--color-neutral-100)',
                  color: 'var(--color-neutral-700)',
                  border: '1px solid var(--color-neutral-200)',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                <ExternalLink className="w-4 h-4" />
                注文詳細
              </a>
              <button
                onClick={() => handleReorder(order)}
                disabled={reorderingId === order.id}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, var(--color-strawberry-600) 0%, var(--color-strawberry-700) 100%)',
                  color: 'white',
                  fontFamily: 'var(--font-sans)',
                  boxShadow: '0 2px 8px rgba(220, 38, 38, 0.2)',
                }}
              >
                {reorderingId === order.id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    追加中...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    再購入
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
