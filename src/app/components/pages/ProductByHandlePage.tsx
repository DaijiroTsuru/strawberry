import { useState, useEffect } from 'react';
import { Link, useParams } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { ShoppingCart, AlertCircle, ArrowLeft } from 'lucide-react';
import { useCart } from '@/app/contexts/CartContext';
import { fetchProductByHandle, ShopifyProduct, formatPrice } from '@/utils/shopify';
import { SEO, createProductSchema, createBreadcrumbSchema } from '@/app/components/SEO';
import { trackAddToCart, trackBeginCheckout } from '@/utils/analytics';

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
  const { buyNow, isLoading: isAddingToCart, error: cartError } = useCart();

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
      // Google Analytics: カート追加イベント（エラーが発生しても継続）
      try {
        trackAddToCart({
          productName: product.title,
          variantName: selectedVariant.title,
          price: selectedVariant.priceV2?.amount ? parseFloat(selectedVariant.priceV2.amount) : undefined,
        });
      } catch (gaError) {
        console.warn('GA tracking error (add_to_cart):', gaError);
      }
      
      const checkoutUrl = await buyNow(selectedVariant.id, 1);
      
      // Google Analytics: チェックアウト開始イベント（エラーが発生しても継続）
      try {
        trackBeginCheckout([{
          item_name: product.title,
          item_variant: selectedVariant.title,
          price: selectedVariant.priceV2?.amount ? parseFloat(selectedVariant.priceV2.amount) : undefined,
          quantity: 1,
        }]);
      } catch (gaError) {
        console.warn('GA tracking error (begin_checkout):', gaError);
      }
      
      // チェックアウトページにリダイレクト
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Failed to checkout:', error);
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
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full"
            style={{ 
              background: 'var(--color-strawberry-600)', 
              color: 'white',
              fontFamily: 'var(--font-sans)'
            }}
          >
            <ArrowLeft className="w-5 h-5" />
            ホームに戻る
          </Link>
        </div>
      </div>
    );
  }

  const selectedVariant = product.variants.edges[selectedVariantIndex]?.node;
  const mainImage = product.images.edges[selectedImageIndex]?.node.url || '';

  // コレクションに基づいて戻るリンクを決定
  const getBackLink = () => {
    const collections = product.collections?.edges || [];
    
    // 米のコレクションID
    const riceCollectionId = 'gid://shopify/Collection/486421135583';
    // いちごのコレクションID  
    const strawberryCollectionId = 'gid://shopify/Collection/486373589215';
    
    // コレクションIDでチェック
    if (collections.some(c => c.node.id === riceCollectionId)) {
      return { to: '/rice', label: 'お米一覧に戻る' };
    }
    if (collections.some(c => c.node.id === strawberryCollectionId)) {
      return { to: '/strawberries', label: 'いちご一覧に戻る' };
    }
    
    // コレクションハンドルでもチェック
    const collectionHandles = collections.map(c => c.node.handle);
    if (collectionHandles.includes('rice') || collectionHandles.includes('kome')) {
      return { to: '/rice', label: 'お米一覧に戻る' };
    }
    if (collectionHandles.includes('strawberries') || collectionHandles.includes('ichigo')) {
      return { to: '/strawberries', label: 'いちご一覧に戻る' };
    }
    
    // デフォルトはいちご
    return { to: '/strawberries', label: '商品一覧に戻る' };
  };

  const backLink = getBackLink();

  const productImage = product.images.edges[0]?.node.url || '';
  const productPrice = selectedVariant?.priceV2.amount || '0';

  return (
    <div className="min-h-screen">
      <SEO 
        title={product.title}
        description={product.description || `${product.title}の商品詳細ページです。津留いちご園の厳選商品をご覧ください。`}
        keywords={`${product.title},${handle},通信販売,オンラインショップ,津留いちご園`}
        image={productImage}
        url={`/product/${handle}`}
        type="product"
        structuredData={{
          '@context': 'https://schema.org',
          '@graph': [
            createProductSchema({
              name: product.title,
              description: product.description,
              image: productImage,
              price: productPrice,
              currency: 'JPY',
              availability: selectedVariant?.availableForSale ? 'InStock' : 'OutOfStock',
              url: `/product/${handle}`,
            }),
            createBreadcrumbSchema([
              { name: 'ホーム', url: '/' },
              { name: '商品一覧', url: backLink.to },
              { name: product.title, url: `/product/${handle}` },
            ]),
          ],
        }}
      />
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
            to={backLink.to}
            className="inline-flex items-center gap-2 transition-colors duration-300"
            style={{ color: 'var(--color-neutral-600)', fontFamily: 'var(--font-sans)' }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{backLink.label}</span>
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
              <div className="flex items-baseline gap-3 mb-4">
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
              
              {/* 配送料情報 */}
              <div className="pt-4 border-t" style={{ borderColor: 'var(--color-strawberry-200)' }}>
                {backLink.to === '/strawberries' ? (
                  <>
                    <p className="text-sm font-semibold mb-1" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-strawberry-700)' }}>
                      鮮度保持便（クール便・梱包材込）：
                    </p>
                    <p className="text-sm mb-2" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)' }}>
                      九州 1,550円／九州外 2,300円（一律）
                    </p>
                    <p className="text-xs" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-500)' }}>
                      ※農園から冷蔵で直送します
                    </p>
                  </>
                ) : backLink.to === '/rice' ? (
                  <p className="text-sm font-semibold" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-strawberry-700)' }}>
                    配送料として 九州 1,500円／九州外 2,000円（一律）
                  </p>
                ) : null}
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
                    ? `在庫あり`
                    : '在庫切れ'
                  }
                </span>
              </div>
            )}

            {/* 購入ボタン */}
            <button
              onClick={handleAddToCart}
              disabled={!selectedVariant?.availableForSale || isAddingToCart}
              className="w-full flex items-center justify-center gap-3 px-8 py-5 rounded-full transition-all duration-300 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold mb-8"
              style={{ 
                background: 'linear-gradient(135deg, var(--color-strawberry-600) 0%, var(--color-strawberry-700) 100%)',
                color: 'white',
                fontFamily: 'var(--font-sans)'
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
                className="mb-6 p-4 rounded-lg flex items-center gap-3"
                style={{ background: 'rgb(254, 242, 242)', color: 'rgb(185, 28, 28)' }}
              >
                <AlertCircle className="w-5 h-5" />
                <span>{cartError}</span>
              </div>
            )}

            {/* 商品説明 */}
            <div 
              className="prose prose-lg max-w-none"
              style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)' }}
            >
              <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--color-neutral-900)' }}>
                商品説明
              </h3>
              <div 
                style={{ lineHeight: '1.8' }}
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
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
