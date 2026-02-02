import fs from "fs";
import { config } from "./config.js";
import { logger } from "./logger.js";
import { readCp932Csv } from "./csv-reader.js";
import { ShopifyClient } from "./shopify-client.js";
import { loadIdMap } from "./id-map.js";
import type {
  ColormeProductCsv,
  ColormeCustomerCsv,
  ColormeSale,
} from "./types.js";
import { unixToIso } from "./helpers.js";

async function main() {
  logger.info("=== 移行検証開始 ===");

  const shopify = new ShopifyClient();
  const idMap = loadIdMap();
  let errors = 0;

  // ── 商品検証 ──
  logger.info("--- 商品検証 ---");
  const products = readCp932Csv<ColormeProductCsv>(config.paths.productCsv);
  for (const row of products) {
    const colormeId = row["商品ID"];
    const shopifyId = idMap.products[colormeId];
    if (!shopifyId) {
      logger.warn(`商品未移行: ${row["商品名"]} [${colormeId}]`);
      errors++;
      continue;
    }

    try {
      const data = await shopify.get<{
        product: {
          title: string;
          variants: Array<{ price: string }>;
          images: Array<{ id: number }>;
        };
      }>(`/products/${shopifyId}.json`);

      const sp = data.product;
      if (sp.title !== row["商品名"]) {
        logger.warn(
          `商品名不一致: "${sp.title}" ≠ "${row["商品名"]}" [${colormeId}]`,
        );
        errors++;
      }
      if (sp.variants[0]?.price !== row["販売価格"]) {
        logger.warn(
          `価格不一致: ${sp.variants[0]?.price} ≠ ${row["販売価格"]} [${colormeId}]`,
        );
        errors++;
      }

      // 画像数チェック
      let expectedImages = 0;
      if (row["商品画像URL"]?.trim()) expectedImages++;
      for (let i = 1; i <= 9; i++) {
        if (row[`その他画像${i}`]?.trim()) expectedImages++;
      }
      if (sp.images.length !== expectedImages) {
        logger.warn(
          `画像数不一致: ${sp.images.length} ≠ ${expectedImages} [${colormeId}]`,
        );
        errors++;
      }
    } catch (err) {
      logger.error(`商品取得失敗: Shopify ID ${shopifyId} - ${err}`);
      errors++;
    }
  }

  // ── 顧客検証 ──
  logger.info("--- 顧客検証 ---");
  const customers = readCp932Csv<ColormeCustomerCsv>(config.paths.customerCsv);
  for (const row of customers) {
    const colormeId = row["顧客ID"];
    const shopifyId = idMap.customers[colormeId];
    if (!shopifyId) {
      logger.warn(`顧客未移行: ${row["名前"]} [${colormeId}]`);
      errors++;
      continue;
    }

    try {
      const data = await shopify.get<{
        customer: { email: string; last_name: string };
      }>(`/customers/${shopifyId}.json`);

      const sc = data.customer;
      if (sc.email !== row["メールアドレス"]) {
        logger.warn(
          `メール不一致: "${sc.email}" ≠ "${row["メールアドレス"]}" [${colormeId}]`,
        );
        errors++;
      }
    } catch (err) {
      logger.error(`顧客取得失敗: Shopify ID ${shopifyId} - ${err}`);
      errors++;
    }
  }

  // ── 注文検証 ──
  logger.info("--- 注文検証 ---");
  if (fs.existsSync(config.paths.ordersJson)) {
    const sales: ColormeSale[] = JSON.parse(
      fs.readFileSync(config.paths.ordersJson, "utf-8"),
    );

    for (const sale of sales) {
      const colormeId = String(sale.id);
      const shopifyId = idMap.orders[colormeId];
      if (!shopifyId) {
        if (sale.total_price > 0) {
          logger.warn(`注文未移行: #${colormeId}`);
          errors++;
        }
        continue;
      }

      try {
        const data = await shopify.get<{
          order: {
            created_at: string;
            financial_status: string;
            fulfillment_status: string | null;
          };
        }>(`/orders/${shopifyId}.json`);

        const so = data.order;
        const expectedDate = unixToIso(sale.make_date).split("T")[0];
        const actualDate = so.created_at.split("T")[0];
        if (actualDate !== expectedDate) {
          logger.warn(
            `注文日不一致: ${actualDate} ≠ ${expectedDate} [#${colormeId}]`,
          );
          errors++;
        }

        const expectedFinancial = sale.paid ? "paid" : "pending";
        if (so.financial_status !== expectedFinancial) {
          logger.warn(
            `支払状態不一致: ${so.financial_status} ≠ ${expectedFinancial} [#${colormeId}]`,
          );
          errors++;
        }

        const expectedFulfillment = sale.delivered ? "fulfilled" : null;
        if (so.fulfillment_status !== expectedFulfillment) {
          logger.warn(
            `配送状態不一致: ${so.fulfillment_status} ≠ ${expectedFulfillment} [#${colormeId}]`,
          );
          errors++;
        }
      } catch (err) {
        logger.error(`注文取得失敗: Shopify ID ${shopifyId} - ${err}`);
        errors++;
      }
    }
  } else {
    logger.warn("注文データファイルが見つかりません。注文検証をスキップ。");
  }

  // ── サマリー ──
  if (errors === 0) {
    logger.success("=== 検証完了: エラーなし ===");
  } else {
    logger.error(`=== 検証完了: ${errors} 件の不一致 ===`);
    process.exit(1);
  }
}

main().catch((err) => {
  logger.error(`検証エラー: ${err}`);
  process.exit(1);
});
