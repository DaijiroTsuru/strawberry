import { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { Leaf, Sprout, Shield, Award, ShoppingCart, ArrowLeft, Package } from 'lucide-react';
import { FARM_INFO, SHIPPING } from '@/app/constants/farmInfo';
import { useCart } from '@/app/contexts/CartContext';
import { fetchProductsByCollectionId, ShopifyProduct, formatPrice } from '@/utils/shopify';
import { SEO, createBreadcrumbSchema } from '@/app/components/SEO';

const RICE_COLLECTION_ID = '486421135583';

export function RicePage() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const { buyNow, isLoading: isAddingToCart } = useCart();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Collection IDから商品を取得
        const shopifyProducts = await fetchProductsByCollectionId(RICE_COLLECTION_ID, 20);
        setProducts(shopifyProducts);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    loadProducts();
  }, []);

  const handleAddToCart = async (variantId: string) => {
    try {
      const checkoutUrl = await buyNow(variantId, 1);
      // チェックアウトページにリダイレクト
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Failed to checkout:', error);
    }
  };

  return (
    <div className="min-h-screen">
      <SEO 
        title="無農薬栽培米"
        description="除草剤や農薬を一切使用せず、油粕、米糠、海草、魚粉等12種類に及ぶ有機質肥料を使用して栽培した安心・安全なお米。いかに無農薬で強く美味しいお米をつける稲を育てるかにこだわった津留いちご園のヒノヒカリをお届けします。"
        keywords="無農薬,お米,ヒノヒカリ,有機栽培,玄米,白米,7分づき米,宮崎,西都市,通信販売"
        image="https://cdn.shopify.com/s/files/1/0791/6434/2495/files/01F69287-C88A-464C-9CD4-7CE4CA3CB3C4_1_105_c.jpg?v=1768511100"
        url="/rice"
        structuredData={createBreadcrumbSchema([
          { name: 'ホーム', url: '/' },
          { name: '無農薬栽培米', url: '/rice' },
        ])}
      />
      {/* ヘッダースペース */}
      <div className="h-20 lg:h-24"></div>

      {/* ヒーローセクション */}
      <section className="relative py-20 lg:py-32 px-4 overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--color-harvest-50) 0%, var(--color-neutral-50) 100%)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <a
              href="/"
              className="inline-flex items-center gap-2 mb-8 transition-colors duration-300"
              style={{ color: 'var(--color-neutral-600)', fontFamily: 'var(--font-sans)' }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>ホームに戻る</span>
            </a>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8" style={{ background: 'linear-gradient(135deg, var(--color-harvest-100) 0%, var(--color-harvest-200) 100%)', border: '1px solid var(--color-harvest-300)' }}>
              <Sprout className="w-4 h-4" style={{ color: 'var(--color-harvest-700)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--color-harvest-800)', fontFamily: 'var(--font-sans)', letterSpacing: '0.05em' }}>Rice</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold mb-6" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-neutral-900)', letterSpacing: '0.02em' }}>
              無農薬栽培米
            </h1>
            <p className="text-xl lg:text-2xl mb-8 max-w-3xl" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)', lineHeight: '1.8' }}>
              除草剤や農薬を一切使用せず、油粕、米糠、海草、魚粉等12種類に及ぶ有機質肥料を使用して栽培した安心・安全なお米
            </p>
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid var(--color-harvest-300)', backdropFilter: 'blur(10px)' }}>
              <Package className="w-5 h-5" style={{ color: 'var(--color-harvest-600)' }} />
              <span className="text-base font-medium" style={{ color: 'var(--color-neutral-700)', fontFamily: 'var(--font-sans)' }}>
                いかに無農薬で強く美味しいお米をつける稲を育てるか
              </span>
            </div>
          </motion.div>
        </div>

        {/* 装飾要素 */}
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: 'var(--color-harvest-400)' }}></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: 'var(--color-harvest-300)' }}></div>
      </section>

      {/* お米について */}
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
              <div className="rounded-3xl overflow-hidden shadow-2xl" style={{ aspectRatio: '4/3' }}>
                <img
                  src="https://cdn.shopify.com/s/files/1/0791/6434/2495/files/01F69287-C88A-464C-9CD4-7CE4CA3CB3C4_1_105_c.jpg?v=1768511100"
                  alt="津留農園のお米"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 w-64 h-64 rounded-full -z-10 blur-3xl opacity-20" style={{ background: 'var(--color-harvest-400)' }}></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-neutral-900)' }}>
                津留農園のお米
              </h2>
              <p className="text-lg mb-6" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)', lineHeight: '1.9' }}>
                宮崎の豊かな自然の中で、除草剤や農薬を一切使用せず、12種類の有機質肥料を使って丁寧に育てたお米です。
              </p>
              <p className="text-lg mb-6" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)', lineHeight: '1.9' }}>
                太陽の光をたっぷりと浴びて育った稲穂は、黄金色に輝き、一粒一粒に旨味と栄養が凝縮されています。
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl" style={{ background: 'var(--color-harvest-50)', border: '1px solid var(--color-harvest-200)' }}>
                  <Package className="w-6 h-6 mb-2" style={{ color: 'var(--color-harvest-600)' }} />
                  <p className="font-medium" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-harvest-800)' }}>無農薬栽培</p>
                </div>
                <div className="p-4 rounded-2xl" style={{ background: 'var(--color-harvest-50)', border: '1px solid var(--color-harvest-200)' }}>
                  <Award className="w-6 h-6 mb-2" style={{ color: 'var(--color-harvest-600)' }} />
                  <p className="font-medium" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-harvest-800)' }}>有機質肥料</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="py-20 lg:py-32 px-4" style={{ background: 'var(--color-neutral-50)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-neutral-900)' }}>
              栽培方法へのこだわり
            </h2>
            <p className="text-lg max-w-3xl mx-auto mb-4" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)', lineHeight: '1.9' }}>
              津留いちご園は、手間とコストをかけても、皆様に安全でおいしいお米をご提供したいと願い、丁寧にお米の栽培を行っています。
            </p>
            <p className="text-lg max-w-3xl mx-auto font-semibold" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-harvest-700)', lineHeight: '1.9' }}>
              大事に思っているのは「いかに無農薬で強く美味しいお米をつける稲を育てるか」
            </p>
          </motion.div>

          {/* 比較表 - デスクトップ用 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-20 hidden lg:block"
          >
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden" style={{ border: '1px solid var(--color-neutral-200)' }}>
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'linear-gradient(135deg, var(--color-harvest-600) 0%, var(--color-harvest-700) 100%)' }}>
                    <th className="p-6 text-left font-bold text-lg" style={{ fontFamily: 'var(--font-serif)', color: 'white', width: '30%' }}></th>
                    <th className="p-6 text-center font-bold text-lg" style={{ fontFamily: 'var(--font-serif)', color: 'white', width: '35%' }}>一般の農園</th>
                    <th className="p-6 text-center font-bold text-lg" style={{ fontFamily: 'var(--font-serif)', color: 'white', width: '35%' }}>津留いちご園</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { 
                      label: '種まき', 
                      general: '一箱あたり200g', 
                      tsuru: '一箱あたり80gの薄まき',
                      description: '種まきを薄くすると補植（田植え機が植えそこなった所を人の手で植えていく作業）が大変ですが、しっかりとした苗になり病害虫が減少します。'
                    },
                    { 
                      label: '代かき', 
                      general: '2回', 
                      tsuru: '3回',
                      description: '代かき（田植えのために、田に水を入れて土を砕いてかきならす作業）の回数を増やすと、手間が掛かりますが、雑草の数が減少します。'
                    },
                    { 
                      label: '本田植え付け', 
                      general: '70～80株', 
                      tsuru: '45株',
                      description: '本田植え付け本数を減らすと、収穫量は減少しますが、風通しが良く、しっかりとした草体となり、病害虫に強くなります。'
                    },
                    { 
                      label: '除草剤', 
                      general: '除草剤を使用する', 
                      tsuru: '除草剤を使用しない',
                      description: null
                    },
                    { 
                      label: '肥料', 
                      general: '化学肥料のみ', 
                      tsuru: '油粕、米糠、ケイフン、海草、大豆粕、魚粉、堆肥その他を発酵させ使用',
                      description: '有機肥料を施用すると、肥料代や散布のコストが多くかかりますが、ビタミン・ミネラル・アミノ酸の種類と量が豊富になり、味がよくなります。'
                    },
                    { 
                      label: '農薬散布', 
                      general: '農薬散布を行う', 
                      tsuru: '散布は一切行わない',
                      description: null
                    },
                  ].map((row, index) => (
                    <tr key={index} className="border-t" style={{ borderColor: 'var(--color-neutral-200)' }}>
                      <td className="p-6" style={{ fontFamily: 'var(--font-sans)', background: 'var(--color-neutral-50)' }}>
                        <div className="font-bold mb-2" style={{ color: 'var(--color-neutral-900)' }}>{row.label}</div>
                        {row.description && (
                          <div className="text-xs leading-relaxed" style={{ color: 'var(--color-neutral-600)' }}>{row.description}</div>
                        )}
                      </td>
                      <td className="p-6 text-center" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-600)' }}>
                        {row.general}
                      </td>
                      <td className="p-6 text-center font-semibold" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-harvest-700)', background: 'var(--color-harvest-50)' }}>
                        {row.tsuru}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* 比較カード - モバイル用 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-20 lg:hidden space-y-6"
          >
            {[
              { 
                label: '種まき', 
                general: '一箱あたり200g', 
                tsuru: '一箱あたり80gの薄まき',
                description: '種まきを薄くすると補植（田植え機が植えそこなった所を人の手で植えていく作業）が大変ですが、しっかりとした苗になり病害虫が減少します。'
              },
              { 
                label: '代かき', 
                general: '2回', 
                tsuru: '3回',
                description: '代かき（田植えのために、田に水を入れて土を砕いてかきならす作業）の回数を増やすと、手間が掛かりますが、雑草の数が減少します。'
              },
              { 
                label: '本田植え付け', 
                general: '70～80株', 
                tsuru: '45株',
                description: '本田植え付け本数を減らすと、収穫量は減少しますが、風通しが良く、しっかりとした草体となり、病害虫に強くなります。'
              },
              { 
                label: '除草剤', 
                general: '除草剤を使用する', 
                tsuru: '除草剤を使用しない',
                description: null
              },
              { 
                label: '肥料', 
                general: '化学肥料のみ', 
                tsuru: '油粕、米糠、ケイフン、海草、大豆粕、魚粉、堆肥その他を発酵させ使用',
                description: '有機肥料を施用すると、肥料代や散布のコストが多くかかりますが、ビタミン・ミネラル・アミノ酸の種類と量が豊富になり、味がよくなります。'
              },
              { 
                label: '農薬散布', 
                general: '農薬散布を行う', 
                tsuru: '散布は一切行わない',
                description: null
              },
            ].map((row, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl shadow-lg overflow-hidden"
                style={{ border: '1px solid var(--color-neutral-200)' }}
              >
                <div className="p-4" style={{ background: 'linear-gradient(135deg, var(--color-harvest-600) 0%, var(--color-harvest-700) 100%)' }}>
                  <h3 className="font-bold text-lg text-white" style={{ fontFamily: 'var(--font-serif)' }}>
                    {row.label}
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="p-4 rounded-2xl" style={{ background: 'var(--color-neutral-50)', border: '1px solid var(--color-neutral-200)' }}>
                    <p className="text-xs font-semibold mb-2" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-500)' }}>一般の農園</p>
                    <p className="text-sm" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-700)' }}>{row.general}</p>
                  </div>
                  <div className="p-4 rounded-2xl" style={{ background: 'var(--color-harvest-50)', border: '1px solid var(--color-harvest-200)' }}>
                    <p className="text-xs font-semibold mb-2" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-harvest-600)' }}>津留いちご園</p>
                    <p className="text-sm font-semibold" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-harvest-800)' }}>{row.tsuru}</p>
                  </div>
                  {row.description && (
                    <div className="p-4 rounded-2xl" style={{ background: 'var(--color-neutral-50)', border: '1px solid var(--color-neutral-200)' }}>
                      <p className="text-xs leading-relaxed" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-600)' }}>{row.description}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </motion.div>



          {/* 特徴カード */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
            {[
              { icon: Sprout, title: '薄まき栽培', description: '一箱あたり80gの薄まきで、しっかりとした苗を育成。病害虫に強い健康な稲を育てます' },
              { icon: Leaf, title: '無除草剤', description: '除草剤を使用せず、代かきを3回行うことで雑草を抑制。環境にも優しい栽培方法です' },
              { icon: Shield, title: '無農薬', description: '農薬散布は一切行わず、病害虫に強い栽培方法を実践。安心・安全なお米をお届けします' },
              { icon: Award, title: '有機質肥料', description: '油粕、米糠、海草、魚粉など12種類の有機質肥料を発酵させて使用。栄養豊富で美味しいお米を実現' },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group p-8 rounded-3xl transition-all duration-500 hover:shadow-2xl"
                style={{ background: 'white', border: '1px solid var(--color-neutral-200)' }}
              >
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110" style={{ background: 'linear-gradient(135deg, var(--color-harvest-50) 0%, var(--color-harvest-100) 100%)', border: '1px solid var(--color-harvest-200)' }}>
                  <feature.icon className="w-8 h-8" style={{ color: 'var(--color-harvest-600)' }} />
                </div>
                <h3 className="font-bold text-xl mb-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-neutral-900)' }}>
                  {feature.title}
                </h3>
                <p style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-600)', lineHeight: '1.7' }}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
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
            <p className="text-lg max-w-3xl mx-auto" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-600)', lineHeight: '1.8' }}>
              手間ひまかけて育てた無農薬栽培米を、様々なサイズでご用意しています
            </p>
          </motion.div>

          {isLoadingProducts ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--color-harvest-600)' }}></div>
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

                const imageUrl = product.images.edges[0]?.node.url || 'https://images.unsplash.com/photo-1654086147189-d6363590ab28?w=800';

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
                    <Link
                      to="/product/$handle"
                      params={{ handle: product.handle }}
                      className="block relative overflow-hidden" 
                      style={{ aspectRatio: '1/1' }}
                    >
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
                    </Link>

                    <div className="p-8">
                      <h3 className="font-bold text-2xl mb-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-neutral-900)' }}>
                        {product.title}
                      </h3>
                      <p className="mb-6 line-clamp-3" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-600)', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                        {product.description}
                      </p>

                      {/* 価格表示 */}
                      <div className="mb-6 p-6 rounded-2xl" style={{ background: 'linear-gradient(135deg, var(--color-harvest-50) 0%, var(--color-harvest-100) 100%)', border: '1px solid var(--color-harvest-200)' }}>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-baseline justify-between">
                            <span className="text-sm font-medium" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-600)' }}>価格</span>
                            <div className="flex items-baseline gap-2">
                              <span className="text-4xl font-bold" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-harvest-600)' }}>
                                {formatPrice(variant.priceV2.amount, variant.priceV2.currencyCode)}
                              </span>
                              <span className="text-sm" style={{ color: 'var(--color-neutral-500)' }}>（税込）</span>
                            </div>
                          </div>
                          <div className="flex items-baseline justify-between pt-2 border-t border-harvest-200">
                            <span className="text-sm font-medium" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-neutral-600)' }}>送料</span>
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl font-semibold" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-harvest-600)' }}>
                                {formatPrice(SHIPPING.standardFee.toString(), 'JPY')}
                              </span>
                            </div>
                          </div>
                          {variant.title !== 'Default Title' && (
                            <div className="text-sm font-medium pt-2 border-t border-leaf-200" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-harvest-700)' }}>
                              {variant.title}
                            </div>
                          )}
                          <div className="text-xs pt-2" style={{ color: 'var(--color-neutral-500)' }}>
                            {SHIPPING.note}
                          </div>
                        </div>
                      </div>

                      {/* ボタングループ */}
                      <div className="space-y-3">
                        {/* 購入ボタン */}
                        <button
                          onClick={() => handleAddToCart(variant.id)}
                          disabled={!variant.availableForSale || isAddingToCart}
                          className="group/btn w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full transition-all duration-300 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ 
                            background: 'linear-gradient(135deg, var(--color-harvest-600) 0%, var(--color-harvest-700) 100%)', 
                            fontFamily: 'var(--font-sans)', 
                            fontWeight: 600 
                          }}
                        >
                          <span className="absolute inset-0 bg-gradient-to-r from-[color:var(--color-harvest-700)] to-[color:var(--color-harvest-800)] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></span>
                          <ShoppingCart className="w-5 h-5 text-white relative z-10" />
                          <span className="text-white relative z-10">
                            {!variant.availableForSale ? '売り切れ' : '購入'}
                          </span>
                        </button>

                        {/* 詳細を見るボタン */}
                        <Link
                          to="/product/$handle"
                          params={{ handle: product.handle }}
                          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full transition-all duration-300 border-2"
                          style={{ 
                            borderColor: 'var(--color-harvest-600)',
                            color: 'var(--color-harvest-600)',
                            fontFamily: 'var(--font-sans)',
                            fontWeight: 600,
                            background: 'white'
                          }}
                        >
                          <span>詳細を見る</span>
                          <ArrowLeft className="w-4 h-4 rotate-180" />
                        </Link>
                      </div>
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
                style={{ background: 'linear-gradient(135deg, var(--color-harvest-600) 0%, var(--color-harvest-700) 100%)', color: 'white', fontFamily: 'var(--font-sans)' }}
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