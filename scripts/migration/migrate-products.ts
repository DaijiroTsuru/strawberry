import { config } from "./config.js";
import { logger } from "./logger.js";
import { readCp932Csv } from "./csv-reader.js";
import { ShopifyClient } from "./shopify-client.js";
import { loadIdMap, setMapping } from "./id-map.js";
import { transformProduct } from "./transformers/product.js";
import type { ColormeProductCsv } from "./types.js";

export async function migrateProducts() {
  logger.info("=== 商品移行開始 ===");
  if (config.dryRun) logger.info("[DRY-RUN モード]");

  const rows = readCp932Csv<ColormeProductCsv>(config.paths.productCsv);
  logger.info(`CSV読込: ${rows.length} 商品`);

  const shopify = new ShopifyClient();
  const idMap = loadIdMap();

  // ロケーションID取得（在庫設定に必要）
  if (!config.dryRun && !idMap.locationId) {
    idMap.locationId = await shopify.getLocationId();
    logger.info(`ロケーションID: ${idMap.locationId}`);
  }

  let created = 0;
  let skipped = 0;

  for (const row of rows) {
    const colormeId = row["商品ID"];
    if (!colormeId) {
      logger.warn("商品IDが空の行をスキップ");
      skipped++;
      continue;
    }

    // レジューム: 既に移行済みならスキップ
    if (idMap.products[colormeId]) {
      logger.info(`スキップ（移行済み）: ${row["商品名"]} [${colormeId}]`);
      skipped++;
      continue;
    }

    const payload = transformProduct(row);
    logger.info(`変換: ${payload.product.title}`);

    if (config.dryRun) {
      created++;
      continue;
    }

    try {
      const result = await shopify.post<{
        product: {
          id: number;
          variants: Array<{
            id: number;
            inventory_item_id: number;
          }>;
        };
      }>("/products.json", payload);

      if (!result || !result.product) {
        logger.error(`商品作成失敗: レスポンスが空 - ${row["商品名"]} [${colormeId}]`);
        continue;
      }

      const shopifyProductId = result.product.id;
      const variant = result.product.variants?.[0];
      
      if (!variant) {
        logger.error(`商品作成失敗: バリアントが見つかりません - ${row["商品名"]} [${colormeId}]`);
        logger.error(`  variants配列: ${JSON.stringify(result.product.variants)}`);
        continue;
      }
      
      const shopifyVariantId = variant.id;
      const inventoryItemId = variant.inventory_item_id;

      setMapping(idMap, "products", colormeId, shopifyProductId);
      setMapping(idMap, "variants", colormeId, shopifyVariantId);
      setMapping(idMap, "inventoryItems", colormeId, inventoryItemId);

      // 在庫数設定
      const stock = parseInt(row["在庫数"] ?? "0", 10);
      if (row["在庫管理"] === "在庫管理する" && idMap.locationId) {
        await shopify.post("/inventory_levels/set.json", {
          location_id: idMap.locationId,
          inventory_item_id: inventoryItemId,
          available: stock,
        });
        logger.info(`  在庫設定: ${stock}`);
      }

      // 原価設定
      const cost = row["原価"]?.trim();
      if (cost && cost !== "0") {
        await shopify.put(`/inventory_items/${inventoryItemId}.json`, {
          inventory_item: { cost },
        });
        logger.info(`  原価設定: ${cost}`);
      }

      logger.success(
        `作成: ${payload.product.title} → Shopify ID ${shopifyProductId}`,
      );
      created++;
    } catch (err) {
      logger.error(
        `商品作成失敗: ${row["商品名"]} [${colormeId}] - ${err}`,
      );
    }
  }

  logger.success(
    `=== 商品移行完了: 作成=${created}, スキップ=${skipped} ===`,
  );
}

// 直接実行時
if (
  process.argv[1]?.includes("migrate-products")
) {
  migrateProducts().catch((err) => {
    logger.error(`商品移行エラー: ${err}`);
    process.exit(1);
  });
}
