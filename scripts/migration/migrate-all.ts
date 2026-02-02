import { logger } from "./logger.js";
import { migrateProducts } from "./migrate-products.js";
import { migrateCustomers } from "./migrate-customers.js";
import { migrateOrders } from "./migrate-orders.js";

async function main() {
  logger.info("========================================");
  logger.info("  カラーミー → Shopify 全体移行開始");
  logger.info("========================================");

  const start = Date.now();

  await migrateProducts();
  await migrateCustomers();
  await migrateOrders();

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  logger.success(`========================================`);
  logger.success(`  全体移行完了 (${elapsed}秒)`);
  logger.success(`========================================`);
}

main().catch((err) => {
  logger.error(`全体移行エラー: ${err}`);
  process.exit(1);
});
