export type GaItem = {
  item_id: string;
  item_name: string;
  item_variant?: string;
  item_category?: string;
  price?: number;
  quantity: number;
};

type ProductLike = { title: string; handle?: string };
type VariantLike = { id: string; title?: string; priceV2?: { amount?: string } };

/**
 * Shopifyの商品・バリアントをGA4のitem形式へ変換する。
 * item_id はバリアントIDを優先する（同一商品の重量違いを区別するため）。
 */
export function toGaItem(
  product: ProductLike,
  variant: VariantLike | undefined,
  options: { category?: string; quantity?: number } = {}
): GaItem {
  const amount = variant?.priceV2?.amount;
  const price = amount === undefined ? NaN : Number.parseFloat(amount);

  const item: GaItem = {
    item_id: variant?.id ?? product.handle ?? product.title,
    item_name: product.title,
    quantity: options.quantity ?? 1,
  };

  if (variant?.title) item.item_variant = variant.title;
  if (options.category) item.item_category = options.category;
  if (Number.isFinite(price)) item.price = price;

  return item;
}

/** ShopifyのコレクションID。StrawberriesPage.tsx / RicePage.tsx と同じ値。 */
export const STRAWBERRY_COLLECTION_ID = '486373589215';
export const RICE_COLLECTION_ID = '486421135583';

type WithCollections = {
  collections?: { edges: Array<{ node: { id: string } }> };
};

/**
 * 商品のカテゴリを collections から導出する。
 *
 * /product/$handle は動的ルートでいちご・お米の双方を配信するため、
 * ページ側でカテゴリを固定してはならない（お米をstrawberryと誤ラベルする）。
 * 一覧ページは自分のコレクションを指定して取得しているためカテゴリを知っており、
 * 呼び出し側で明示指定する。一覧の取得クエリは collections を返さないため、
 * この関数は商品詳細ページ専用である。
 */
export function categoryOf(product: WithCollections): string | undefined {
  const ids = product.collections?.edges.map((e) => e.node.id) ?? [];
  if (ids.some((id) => id.includes(STRAWBERRY_COLLECTION_ID))) return 'strawberry';
  if (ids.some((id) => id.includes(RICE_COLLECTION_ID))) return 'rice';
  return undefined;
}
