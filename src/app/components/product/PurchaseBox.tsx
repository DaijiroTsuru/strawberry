import { motion } from 'motion/react';
import { ShoppingCart, AlertCircle } from 'lucide-react';
import type { ShopifyProduct } from '@/utils/shopify';
import { formatPrice } from '@/utils/shopify';

interface PurchaseBoxProps {
  product: ShopifyProduct;
  selectedVariantIndex: number;
  onVariantChange: (index: number) => void;
  onAddToCart: () => void;
  isAddingToCart: boolean;
  cartError: string | null;
  isStrawberry: boolean;
  /** ページ下部のCTAとして表示する場合 */
  isBottomCTA?: boolean;
}

/**
 * 購入ボックスコンポーネント
 * 商品名、価格、バリアント選択、在庫情報、購入ボタンを含む
 */
export function PurchaseBox({
  product,
  selectedVariantIndex,
  onVariantChange,
  onAddToCart,
  isAddingToCart,
  cartError,
  isStrawberry,
  isBottomCTA = false,
}: PurchaseBoxProps) {
  const selectedVariant = product.variants.edges[selectedVariantIndex]?.node;

  if (isBottomCTA) {
    return (
      <section
        className="py-16 lg:py-24 px-4"
        style={{
          background:
            'linear-gradient(180deg, var(--color-neutral-50) 0%, var(--color-strawberry-50) 100%)',
        }}
      >
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <p
              className="text-lg mb-2"
              style={{
                fontFamily: 'var(--font-sans)',
                color: 'var(--color-strawberry-600)',
              }}
            >
              ご注文はこちらから
            </p>
            <h2
              className="text-2xl lg:text-3xl font-bold"
              style={{
                fontFamily: 'var(--font-serif)',
                color: 'var(--color-neutral-900)',
              }}
            >
              {product.title}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="bg-white rounded-3xl p-6 lg:p-8 shadow-xl"
            style={{ border: '1px solid var(--color-neutral-200)' }}
          >
            <PurchaseBoxContent
              product={product}
              selectedVariant={selectedVariant}
              selectedVariantIndex={selectedVariantIndex}
              onVariantChange={onVariantChange}
              onAddToCart={onAddToCart}
              isAddingToCart={isAddingToCart}
              cartError={cartError}
              isStrawberry={isStrawberry}
            />
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <PurchaseBoxContent
      product={product}
      selectedVariant={selectedVariant}
      selectedVariantIndex={selectedVariantIndex}
      onVariantChange={onVariantChange}
      onAddToCart={onAddToCart}
      isAddingToCart={isAddingToCart}
      cartError={cartError}
      isStrawberry={isStrawberry}
    />
  );
}

interface PurchaseBoxContentProps {
  product: ShopifyProduct;
  selectedVariant: ShopifyProduct['variants']['edges'][0]['node'] | undefined;
  selectedVariantIndex: number;
  onVariantChange: (index: number) => void;
  onAddToCart: () => void;
  isAddingToCart: boolean;
  cartError: string | null;
  isStrawberry: boolean;
}

function PurchaseBoxContent({
  product,
  selectedVariant,
  selectedVariantIndex,
  onVariantChange,
  onAddToCart,
  isAddingToCart,
  cartError,
  isStrawberry,
}: PurchaseBoxContentProps) {
  return (
    <>
      {/* 価格表示 */}
      <div
        className="mb-6 p-6 rounded-2xl"
        style={{
          background:
            'linear-gradient(135deg, var(--color-strawberry-50) 0%, var(--color-strawberry-100) 100%)',
          border: '1px solid var(--color-strawberry-200)',
        }}
      >
        <div className="flex items-baseline gap-3 mb-4">
          <span
            className="text-4xl lg:text-5xl font-bold"
            style={{
              fontFamily: 'var(--font-serif)',
              color: 'var(--color-strawberry-600)',
            }}
          >
            {selectedVariant &&
              formatPrice(
                selectedVariant.priceV2.amount,
                selectedVariant.priceV2.currencyCode
              )}
          </span>
          <span
            className="text-lg"
            style={{ color: 'var(--color-neutral-500)' }}
          >
            （税込）
          </span>
        </div>

        {/* 配送料情報 */}
        <div
          className="pt-4 border-t"
          style={{ borderColor: 'var(--color-strawberry-200)' }}
        >
          {isStrawberry ? (
            <>
              <p
                className="text-sm font-semibold mb-1"
                style={{
                  fontFamily: 'var(--font-sans)',
                  color: 'var(--color-strawberry-700)',
                }}
              >
                鮮度保持便（クール便・梱包材込）：
              </p>
              <p
                className="text-sm mb-2"
                style={{
                  fontFamily: 'var(--font-sans)',
                  color: 'var(--color-neutral-700)',
                }}
              >
                九州 1,550円／九州外 2,300円（一律）
              </p>
              <p
                className="text-xs"
                style={{
                  fontFamily: 'var(--font-sans)',
                  color: 'var(--color-neutral-500)',
                }}
              >
                ※農園から冷蔵で直送します
              </p>
            </>
          ) : (
            <p
              className="text-sm font-semibold"
              style={{
                fontFamily: 'var(--font-sans)',
                color: 'var(--color-strawberry-700)',
              }}
            >
              配送料として 九州 1,500円／九州外 2,000円（一律）
            </p>
          )}
        </div>
      </div>

      {/* バリアント選択 */}
      {product.variants.edges.length > 1 && (
        <div className="mb-6">
          <label
            className="block text-sm font-semibold mb-3"
            style={{
              fontFamily: 'var(--font-sans)',
              color: 'var(--color-neutral-700)',
            }}
          >
            サイズ・オプション
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {product.variants.edges.map((variant, index) => {
              const isSelected = index === selectedVariantIndex;
              const isAvailable = variant.node.availableForSale;

              return (
                <button
                  key={variant.node.id}
                  onClick={() => onVariantChange(index)}
                  disabled={!isAvailable}
                  className="p-3 lg:p-4 rounded-xl border-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base"
                  style={{
                    borderColor: isSelected
                      ? 'var(--color-strawberry-600)'
                      : 'var(--color-neutral-300)',
                    background: isSelected ? 'var(--color-strawberry-50)' : 'white',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: isSelected ? 600 : 400,
                  }}
                >
                  {variant.node.title}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 在庫状況 */}
      {selectedVariant && (
        <div className="mb-6 flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              selectedVariant.availableForSale ? 'bg-green-500' : 'bg-red-500'
            }`}
          ></div>
          <span
            className="text-sm font-medium"
            style={{
              fontFamily: 'var(--font-sans)',
              color: 'var(--color-neutral-700)',
            }}
          >
            {selectedVariant.availableForSale ? '在庫あり' : '在庫切れ'}
          </span>
        </div>
      )}

      {/* 購入ボタン */}
      <button
        onClick={onAddToCart}
        disabled={!selectedVariant?.availableForSale || isAddingToCart}
        className="w-full flex items-center justify-center gap-3 px-8 py-5 rounded-full transition-all duration-300 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
        style={{
          background:
            'linear-gradient(135deg, var(--color-strawberry-600) 0%, var(--color-strawberry-700) 100%)',
          color: 'white',
          fontFamily: 'var(--font-sans)',
        }}
      >
        <ShoppingCart className="w-6 h-6" />
        <span>
          {selectedVariant?.availableForSale ? '購入' : '在庫切れ'}
        </span>
      </button>

      {/* エラー表示 */}
      {cartError && (
        <div
          className="mt-4 p-4 rounded-lg flex items-center gap-3"
          style={{ background: 'rgb(254, 242, 242)', color: 'rgb(185, 28, 28)' }}
        >
          <AlertCircle className="w-5 h-5" />
          <span>{cartError}</span>
        </div>
      )}
    </>
  );
}
