import fs from "fs";
import { config } from "./config.js";
import { logger } from "./logger.js";
import { ShopifyClient } from "./shopify-client.js";
import { loadIdMap, setMapping } from "./id-map.js";
import { transformOrder } from "./transformers/order.js";
import type { ColormeSale } from "./types.js";

export async function migrateOrders() {
  logger.info("=== 注文移行開始 ===");
  if (config.dryRun) logger.info("[DRY-RUN モード]");

  if (!fs.existsSync(config.paths.ordersJson)) {
    logger.error(
      `注文データが見つかりません: ${config.paths.ordersJson}\n先に npm run migrate:extract を実行してください。`,
    );
    process.exit(1);
  }

  const sales: ColormeSale[] = JSON.parse(
    fs.readFileSync(config.paths.ordersJson, "utf-8"),
  );
  logger.info(`注文データ読込: ${sales.length} 件`);

  // 名前フィルタが指定されている場合は配送先名または顧客名でフィルタリング
  const filteredSales = config.nameFilter
    ? sales.filter((sale) => {
        const deliveryName = sale.sale_deliveries?.[0]?.name || "";
        const customerName = sale.customer?.name || "";
        return deliveryName.includes(config.nameFilter) || customerName.includes(config.nameFilter);
      })
    : sales;
  
  if (config.nameFilter) {
    logger.info(`名前フィルタ適用 ("${config.nameFilter}"): ${filteredSales.length}/${sales.length} 件`);
  }

  const shopify = new ShopifyClient();
  const idMap = loadIdMap();

  let created = 0;
  let skipped = 0;

  for (const sale of filteredSales) {
    const colormeId = String(sale.id);

    // レジューム: 既に移行済みならスキップ
    if (idMap.orders[colormeId]) {
      logger.info(`スキップ（移行済み）: 注文 #${colormeId}`);
      skipped++;
      continue;
    }

    // 金額0の注文をスキップ（フラグで含めることも可能）
    if (sale.total_price === 0 && !config.includeZeroOrders) {
      logger.info(`スキップ（金額0）: 注文 #${colormeId}`);
      skipped++;
      continue;
    }

    const payload = transformOrder(sale, idMap);
    
    // 商品明細が空の場合はエラー表示
    if (!payload.order.line_items || payload.order.line_items.length === 0) {
      logger.error(`商品明細なし: 注文 #${colormeId}`);
      logger.error(`元データの明細数: ${sale.details.length}`);
      logger.error(`生成されたpayload: ${JSON.stringify(payload, null, 2)}`);
      logger.error(`元データdetails: ${JSON.stringify(sale.details, null, 2)}`);
      continue;
    }
    
    logger.info(
      `変換: 注文 #${colormeId} (${payload.order.line_items.length}明細, ${sale.total_price}円)`,
    );

    if (config.dryRun) {
      created++;
      continue;
    }

    try {
      const result = await shopify.post<{
        order: { id: number };
      }>("/orders.json", payload);

      setMapping(idMap, "orders", colormeId, result.order.id);
      logger.success(
        `作成: 注文 #${colormeId} → Shopify ID ${result.order.id}`,
      );
      created++;
    } catch (err) {
      logger.error(`注文作成失敗: #${colormeId} - ${err}`);
    }
  }

  logger.success(
    `=== 注文移行完了: 作成=${created}, スキップ=${skipped} ===`,
  );
}

// 直接実行時
if (
  process.argv[1]?.includes("migrate-orders")
) {
  migrateOrders().catch((err) => {
    logger.error(`注文移行エラー: ${err}`);
    process.exit(1);
  });
}
