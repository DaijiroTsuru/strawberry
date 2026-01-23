import { useState, useEffect } from 'react';
import { Link, useParams } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { ShoppingCart, Check, AlertCircle, ArrowLeft } from 'lucide-react';
import { useCart } from '@/app/contexts/CartContext';
import { fetchProductByHandle, ShopifyProduct, formatPrice } from '@/utils/shopify';

/**
 * 商品Handleから商品詳細ページを表示
 * URLパラメータ: /product/{handle}
 * 
 * 使用例:
 * /product/strawberry-500g
 */
export function ProductByHandlePage() {
  const { handle } = useParams({ from: '/product/$handle' });
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart, isLoading: isAddingToCart, error: cartError } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        if (handle) {
          const data = await fetchProductByHandle(handle);
          setProduct(data);
        }
      } catch (error) {
        console.error('Failed to load product:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProduct();
  }, [handle]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    const selectedVariant = product.variants.edges[selectedVariantIndex]?.node;
    if (!selectedVariant) return;

    try {
      await addToCart(selectedVariant.id, 1);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div 
            className="inline-block w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mb-4"
            style={{ borderColor: 'var(--color-strawberry-600)' }}
          ></div>
          <p style={{ color: 'var(--color-neutral-600)' }}>商品を読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--color-neutral-400)' }} />
          <p className="text-xl mb-4" style={{ color: 'var(--color-neutral-600)' }}>
            商品が見つかりませんでした
          </p>
          <Link
            to="/strawberries"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full"
            style={{ 
              background: 'var(--color-strawberry-600)', 
              color: 'white',
              fontFamily: 'var(--font-sans)'
            }}
          >
            <ArrowLeft className="w-5 h-5" />
            商品一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  const selectedVariant = product.variants.edges[selectedVariantIndex]?.node;
  const mainImage = product.images.edges[selectedImageIndex]?.node.url || '';

  return (
    <div className="min-h-screen">
      {/* ヘッダースペース */}
      <div className="h-20 lg:h-24"></div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* 戻るボタン */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            to="/strawberries"
            className="inline-flex items-center gap-2 transition-colors duration-300"
            style={{ color: 'var(--color-neutral-600)', fontFamily: 'var(--font-sans)' }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>商品一覧に戻る</span>
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* 商品画像 */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl bg-white">
              <img
                src={mainImage}
                alt={product.title}
                className="w-full aspect-square object-cover"
              />
            </div>

            {/* 画像サムネイル */}
            {product.images.edges.length > 1 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {product.images.edges.slice(0, 4).map((image, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
                      selectedImageIndex === index 
                        ? 'ring-4 ring-strawberry-500 scale-95' 
                        : 'hover:opacity-80'
                    }`}
                  >
                    <img
                      src={image.node.url}
                      alt={image.node.altText || `${product.title} ${index + 1}`}
                      className="w-full aspect-square object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* 商品情報 */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 
              className="text-4xl lg:text-5xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-neutral-900)' }}
            >
              {product.title}
            </h1>

            {/* 価格表示 */}
            <div 
              className="mb-8 p-6 rounded-2xl"
              style={{ 
                background: 'linear-gradient(135deg, var(--color-strawberry-50) 0%, var(--color-strawberry-100) 100%)',
                border: '1px solid var(--color-strawberry-200)'
              }}
            >
              <div className="flex items-baseline gap-3">
                <span 
                  className="text-5xl font-bold"
                  style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-strawberry-600)' }}
                >
                  {selectedVariant && formatPrice(
                    selectedVariant.priceV2.amount,
                    selectedVariant.priceV2.currencyCode
                  )}
                </span>
                <span className="text-lg" style={{ color: 'var(--color-neutral-500)' }}>
                  （税込）
                </span>
              </div>
            </div>

            {/* バリアント選択 */}
            {product.variants.edges.length > 1 && (
              <div className="mb-8">
                <label 
                  className="block text-sm font-semibold mb-3"
                  style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)' }}
                >
                  サイズ・オプション
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {product.variants.edges.map((variant, index) => {
                    const isSelected = index === selectedVariantIndex;
                    const isAvailable = variant.node.availableForSale;
                    
                    return (
                      <button
                        key={variant.node.id}
                        onClick={() => setSelectedVariantIndex(index)}
                        disabled={!isAvailable}
                        className="p-4 rounded-xl border-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          borderColor: isSelected 
                            ? 'var(--color-strawberry-600)' 
                            : 'var(--color-neutral-300)',
                          background: isSelected 
                            ? 'var(--color-strawberry-50)' 
                            : 'white',
                          fontFamily: 'var(--font-sans)',
                          fontWeight: isSelected ? 600 : 400
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
                  style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)' }}
                >
                  {selectedVariant.availableForSale 
                    ? `在庫あり ${selectedVariant.quantityAvailable ? `(${selectedVariant.quantityAvailable}個)` : ''}`
                    : '在庫切れ'
                  }
                </span>
              </div>
            )}

            {/* カートに追加ボタン */}
            <button
              onClick={handleAddToCart}
              disabled={!selectedVariant?.availableForSale || isAddingToCart || addedToCart}
              className="w-full flex items-center justify-center gap-3 px-8 py-5 rounded-full transition-all duration-300 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold mb-8"
              style={{ 
                background: addedToCart 
                  ? 'linear-gradient(135deg, rgb(34, 197, 94) 0%, rgb(22, 163, 74) 100%)'
                  : 'linear-gradient(135deg, var(--color-strawberry-600) 0%, var(--color-strawberry-700) 100%)',
                color: 'white',
                fontFamily: 'var(--font-sans)'
              }}
            >
              {addedToCart ? (
                <>
                  <Check className="w-6 h-6" />
                  <span>カートに追加しました</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-6 h-6" />
                  <span>
                    {selectedVariant?.availableForSale ? 'カートに追加' : '在庫切れ'}
                  </span>
                </>
              )}
            </button>

            {/* エラー表示 */}
            {cartError && (
              <div 
                className="mb-6 p-4 rounded-lg flex items-center gap-3"
                style={{ background: 'rgb(254, 242, 242)', color: 'rgb(185, 28, 28)' }}
              >
                <AlertCircle className="w-5 h-5" />
                <span>{cartError}</span>
              </div>
            )}

            {/* 商品説明 */}
            <div 
              className="prose prose-lg"
              style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)' }}
            >
              <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--color-neutral-900)' }}>
                商品説明
              </h3>
              <p style={{ lineHeight: '1.8' }}>
                {product.description}
              </p>
            </div>

            {/* 商品情報メタデータ */}
            <div className="mt-8 p-6 rounded-2xl" style={{ background: 'var(--color-neutral-50)' }}>
              <h4 className="font-semibold mb-4" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-900)' }}>
                商品情報
              </h4>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt style={{ color: 'var(--color-neutral-600)' }}>商品ID</dt>
                  <dd className="font-mono text-sm" style={{ color: 'var(--color-neutral-900)' }}>
                    {product.id.split('/').pop()}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt style={{ color: 'var(--color-neutral-600)' }}>商品コード</dt>
                  <dd className="font-mono text-sm" style={{ color: 'var(--color-neutral-900)' }}>
                    {product.handle}
                  </dd>
                </div>
                {selectedVariant && (
                  <div className="flex justify-between">
                    <dt style={{ color: 'var(--color-neutral-600)' }}>バリアントID</dt>
                    <dd className="font-mono text-sm" style={{ color: 'var(--color-neutral-900)' }}>
                      {selectedVariant.id.split('/').pop()}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
