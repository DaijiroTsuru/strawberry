import { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { Sparkles, Package, ShoppingCart, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { FARM_INFO } from '@/app/constants/farmInfo';
import { useCart } from '@/app/contexts/CartContext';
import { fetchProductsByCollectionId, ShopifyProduct, formatPrice } from '@/utils/shopify';

// CollectionID: 486373589215 から商品を取得
const STRAWBERRY_COLLECTION_ID = '486373589215';

export function StrawberriesPage() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [addedToCart, setAddedToCart] = useState<string | null>(null);
  const { addToCart, isLoading: isAddingToCart, error: cartError } = useCart();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Collection IDから商品を取得
        const shopifyProducts = await fetchProductsByCollectionId(STRAWBERRY_COLLECTION_ID, 20);
        setProducts(shopifyProducts);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    loadProducts();
  }, []);

  const handleAddToCart = async (variantId: string, productId: string) => {
    try {
      await addToCart(variantId, 1);
      setAddedToCart(productId);
      setTimeout(() => setAddedToCart(null), 3000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* ヘッダースペース */}
      <div className="h-20 lg:h-24"></div>

      {/* ヒーローセクション */}
      <section className="relative py-20 lg:py-32 px-4 overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--color-strawberry-50) 0%, var(--color-neutral-50) 100%)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 mb-8 transition-colors duration-300"
              style={{ color: 'var(--color-neutral-600)', fontFamily: 'var(--font-sans)' }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>ホームに戻る</span>
            </Link>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8" style={{ background: 'linear-gradient(135deg, var(--color-strawberry-100) 0%, var(--color-strawberry-200) 100%)', border: '1px solid var(--color-strawberry-300)' }}>
              <Sparkles className="w-4 h-4" style={{ color: 'var(--color-strawberry-700)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--color-strawberry-800)', fontFamily: 'var(--font-sans)', letterSpacing: '0.05em' }}>Strawberries</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold mb-6" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-neutral-900)', letterSpacing: '0.02em' }}>
              厳選いちご
            </h1>
            <p className="text-xl lg:text-2xl mb-8 max-w-3xl" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)', lineHeight: '1.8' }}>
              その日の朝に収穫した新鮮な「{FARM_INFO.features.strawberryVariety}」を、真心込めてお届けします
            </p>
          </motion.div>
        </div>

        {/* 装飾要素 */}
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: 'var(--color-strawberry-400)' }}></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: 'var(--color-strawberry-300)' }}></div>
      </section>

      {/* かおり野について */}
      <section className="py-20 lg:py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl" style={{ aspectRatio: '4/5' }}>
                <img
                  src="https://images.unsplash.com/photo-1464454709131-ffd692591ee5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                  alt="かおり野いちご"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 w-64 h-64 rounded-full -z-10 blur-3xl opacity-20" style={{ background: 'var(--color-strawberry-400)' }}></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-neutral-900)' }}>
                「{FARM_INFO.features.strawberryVariety}」の魅力
              </h2>
              <p className="text-lg mb-6" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)', lineHeight: '1.9' }}>
                上品な香りとあっさりとしたみずみずしい甘さがある人気のブランドいちご。大粒なのに糖度が高く酸味が少ないのが特徴です。
              </p>
              <p className="text-lg mb-6" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)', lineHeight: '1.9' }}>
                朝の光を浴びて赤く輝くいちごを一粒ずつ丁寧に手摘みし、その日のうちにお客様へお届けしています。
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl" style={{ background: 'var(--color-strawberry-50)', border: '1px solid var(--color-strawberry-200)' }}>
                  <Package className="w-6 h-6 mb-2" style={{ color: 'var(--color-strawberry-600)' }} />
                  <p className="font-medium" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-strawberry-800)' }}>朝摘み新鮮</p>
                </div>
                <div className="p-4 rounded-2xl" style={{ background: 'var(--color-strawberry-50)', border: '1px solid var(--color-strawberry-200)' }}>
                  <Sparkles className="w-6 h-6 mb-2" style={{ color: 'var(--color-strawberry-600)' }} />
                  <p className="font-medium" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-strawberry-800)' }}>糖度が高い</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 商品一覧セクション */}
      <section className="py-20 lg:py-32 px-4" style={{ background: 'var(--color-neutral-50)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-neutral-900)' }}>
              商品ラインナップ
            </h2>
          </motion.div>

          {isLoadingProducts ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--color-strawberry-600)' }}></div>
              <p className="mt-4" style={{ color: 'var(--color-neutral-600)' }}>商品を読み込み中...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p style={{ color: 'var(--color-neutral-600)' }}>現在、販売可能な商品はありません</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => {
                const variant = product.variants.edges[0]?.node;
                if (!variant) return null;

                const imageUrl = product.images.edges[0]?.node.url || 'https://images.unsplash.com/photo-1559483526-22d5a63adc24?w=800';
                const isAdded = addedToCart === product.id;

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                  >
                    {/* 商品画像 */}
                    <div className="relative overflow-hidden" style={{ aspectRatio: '16/10' }}>
                      <img
                        src={imageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* 在庫状況バッジ */}
                      {!variant.availableForSale && (
                        <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-red-500 text-white text-sm font-semibold">
                          売り切れ
                        </div>
                      )}
                    </div>

                    <div className="p-8">
                      <h3 className="font-bold text-2xl mb-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-neutral-900)' }}>
                        {product.title}
                      </h3>
                      <p className="mb-6 line-clamp-3" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-600)', lineHeight: '1.7' }}>
                        {product.description}
                      </p>

                      {/* 価格表示 */}
                      <div className="mb-6 p-6 rounded-2xl" style={{ background: 'linear-gradient(135deg, var(--color-strawberry-50) 0%, var(--color-strawberry-100) 100%)', border: '1px solid var(--color-strawberry-200)' }}>
                        <div className="flex items-baseline justify-between">
                          <span className="text-sm font-medium" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-600)' }}>価格</span>
                          <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-strawberry-600)' }}>
                              {formatPrice(variant.priceV2.amount, variant.priceV2.currencyCode)}
                            </span>
                            <span className="text-sm" style={{ color: 'var(--color-neutral-500)' }}>（税込）</span>
                          </div>
                        </div>
                      </div>

                      {/* ボタングループ */}
                      <div className="space-y-3">
                        {/* カートに追加ボタン */}
                        <button
                          onClick={() => handleAddToCart(variant.id, product.id)}
                          disabled={!variant.availableForSale || isAddingToCart || isAdded}
                          className="group/btn w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full transition-all duration-300 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ 
                            background: isAdded 
                              ? 'linear-gradient(135deg, rgb(34, 197, 94) 0%, rgb(22, 163, 74) 100%)'
                              : 'linear-gradient(135deg, var(--color-strawberry-600) 0%, var(--color-strawberry-700) 100%)', 
                            fontFamily: 'var(--font-sans)', 
                            fontWeight: 600 
                          }}
                        >
                          <span className="absolute inset-0 bg-gradient-to-r from-[color:var(--color-strawberry-700)] to-[color:var(--color-strawberry-800)] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></span>
                          {isAdded ? (
                            <>
                              <Check className="w-5 h-5 text-white relative z-10" />
                              <span className="text-white relative z-10">カートに追加しました</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-5 h-5 text-white relative z-10" />
                              <span className="text-white relative z-10">
                                {!variant.availableForSale ? '売り切れ' : 'カートに追加'}
                              </span>
                            </>
                          )}
                        </button>

                        {/* 詳細を見るボタン */}
                        <Link
                          to="/product/$handle"
                          params={{ handle: product.handle }}
                          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full transition-all duration-300 border-2"
                          style={{ 
                            borderColor: 'var(--color-strawberry-600)',
                            color: 'var(--color-strawberry-600)',
                            fontFamily: 'var(--font-sans)',
                            fontWeight: 600,
                            background: 'white'
                          }}
                        >
                          <span>詳細を見る</span>
                          <ArrowLeft className="w-4 h-4 rotate-180" />
                        </Link>
                      </div>

                      {/* エラー表示 */}
                      {cartError && (
                        <div className="mt-4 p-3 rounded-lg flex items-center gap-2 text-sm" style={{ background: 'rgb(254, 242, 242)', color: 'rgb(185, 28, 28)' }}>
                          <AlertCircle className="w-4 h-4" />
                          <span>{cartError}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* お問い合わせCTA */}
      <section id="contact" className="py-20 lg:py-32 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-neutral-900)' }}>
              ご注文・お問い合わせ
            </h2>
            <p className="text-lg mb-8" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-600)', lineHeight: '1.8' }}>
              お電話、メールにてご注文を承っております
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`tel:${FARM_INFO.contact.phone}`}
                className="px-8 py-4 rounded-full transition-all duration-300 text-lg font-semibold"
                style={{ background: 'linear-gradient(135deg, var(--color-strawberry-600) 0%, var(--color-strawberry-700) 100%)', color: 'white', fontFamily: 'var(--font-sans)' }}
              >
                電話で注文
              </a>
              <a
                href={`mailto:${FARM_INFO.contact.email}`}
                className="px-8 py-4 rounded-full transition-all duration-300 text-lg font-semibold"
                style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--color-neutral-700)', fontFamily: 'var(--font-sans)', border: '2px solid var(--color-neutral-300)' }}
              >
                メールで注文
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}