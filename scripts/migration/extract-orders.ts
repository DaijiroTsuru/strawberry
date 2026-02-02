import fs from "fs";
import { config } from "./config.js";
import { logger } from "./logger.js";
import { ColormeClient } from "./colorme-client.js";

async function main() {
  logger.info("=== カラーミー注文データ抽出開始 ===");

  const client = new ColormeClient();
  const sales = await client.fetchAllSales();

  // データディレクトリを確保
  if (!fs.existsSync(config.paths.dataDir)) {
    fs.mkdirSync(config.paths.dataDir, { recursive: true });
  }

  fs.writeFileSync(config.paths.ordersJson, JSON.stringify(sales, null, 2));
  logger.success(
    `${sales.length} 件の注文データを ${config.paths.ordersJson} に保存しました`,
  );
}

main().catch((err) => {
  logger.error(`注文データ抽出失敗: ${err}`);
  process.exit(1);
});
