import { config } from "../config.js";
import type { ColormeProductCsv, ShopifyProductPayload } from "../types.js";

export function transformProduct(
  row: ColormeProductCsv,
): ShopifyProductPayload {
  const price = row["販売価格"] ?? "0";
  const compareAtPrice = row["定価"] ?? "";

  // 画像URL収集（空でないもののみ）
  const images: Array<{ src: string }> = [];
  const mainImage = row["商品画像URL"]?.trim();
  if (mainImage) images.push({ src: mainImage });
  for (let i = 1; i <= 9; i++) {
    const url = row[`その他画像${i}`]?.trim();
    if (url) images.push({ src: url });
  }

  // 在庫管理
  const inventoryManagement =
    row["在庫管理"] === "在庫管理する" ? "shopify" : null;

  // 掲載状態
  const status: "active" | "draft" =
    row["掲載設定"] === "掲載する" ? "active" : "draft";

  // タグ
  const tags: string[] = [];
  if (row["小カテゴリー"]?.trim()) tags.push(row["小カテゴリー"].trim());

  // compare_at_price: 販売価格と異なる場合のみ設定
  const variant: ShopifyProductPayload["product"]["variants"][0] = {
    price,
    sku: row["型番"] ?? "",
    inventory_management: inventoryManagement,
  };
  if (compareAtPrice && compareAtPrice !== price && compareAtPrice !== "0") {
    variant.compare_at_price = compareAtPrice;
  }

  return {
    product: {
      title: row["商品名"] ?? "",
      body_html: row["商品説明"] || row["簡易説明"] || "",
      vendor: row["ブランド"]?.trim() || config.defaultVendor,
      product_type: row["大カテゴリー"] ?? "",
      tags: tags.join(", "),
      status,
      variants: [variant],
      images,
    },
  };
}
