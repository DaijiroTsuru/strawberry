import { config } from "./config.js";
import { logger } from "./logger.js";
import { readCp932Csv } from "./csv-reader.js";
import { ShopifyClient } from "./shopify-client.js";
import { loadIdMap, setMapping } from "./id-map.js";
import { transformCustomer } from "./transformers/customer.js";
import type { ColormeCustomerCsv } from "./types.js";

export async function migrateCustomers() {
  logger.info("=== 顧客移行開始 ===");
  if (config.dryRun) logger.info("[DRY-RUN モード]");

  const rows = readCp932Csv<ColormeCustomerCsv>(config.paths.customerCsv);
  logger.info(`CSV読込: ${rows.length} 顧客`);

  // 名前フィルタが指定されている場合はフィルタリング
  const filteredRows = config.nameFilter
    ? rows.filter((row) => row["名前"]?.includes(config.nameFilter))
    : rows;
  
  if (config.nameFilter) {
    logger.info(`名前フィルタ適用 ("${config.nameFilter}"): ${filteredRows.length}/${rows.length} 顧客`);
  }

  const shopify = new ShopifyClient();
  const idMap = loadIdMap();

  let created = 0;
  let skipped = 0;
  let linked = 0;

  for (const row of filteredRows) {
    const colormeId = row["顧客ID"];
    if (!colormeId) {
      logger.warn("顧客IDが空の行をスキップ");
      skipped++;
      continue;
    }

    // レジューム: 既に移行済みならスキップ
    if (idMap.customers[colormeId]) {
      logger.info(`スキップ（移行済み）: ${row["名前"]} [${colormeId}]`);
      skipped++;
      continue;
    }

    const payload = transformCustomer(row);
    logger.info(`変換: ${payload.customer.last_name} ${payload.customer.first_name}`);

    if (config.dryRun) {
      created++;
      continue;
    }

    try {
      const result = await shopify.post<{
        customer: { id: number };
      }>("/customers.json", payload);

      setMapping(idMap, "customers", colormeId, result.customer.id);
      logger.success(
        `作成: ${row["名前"]} → Shopify ID ${result.customer.id}`,
      );
      created++;
    } catch (err) {
      // 422 = メールアドレス重複。既存顧客を検索してリンク
      if (err instanceof Error && err.message.includes("422")) {
        const email = row["メールアドレス"]?.trim();
        if (email) {
          try {
            const existing = await shopify.findCustomerByEmail(email);
            if (existing) {
              setMapping(idMap, "customers", colormeId, existing.id);
              logger.info(
                `重複メール: ${email} → 既存Shopify ID ${existing.id} にリンク`,
              );
              linked++;
              continue;
            }
          } catch (searchErr) {
            logger.error(`顧客検索エラー: ${email} - ${searchErr}`);
          }
        }
      }
      logger.error(
        `顧客作成失敗: ${row["名前"]} [${colormeId}] - ${err}`,
      );
    }
  }

  logger.success(
    `=== 顧客移行完了: 作成=${created}, リンク=${linked}, スキップ=${skipped} ===`,
  );
}

// 直接実行時
if (
  process.argv[1]?.includes("migrate-customers")
) {
  migrateCustomers().catch((err) => {
    logger.error(`顧客移行エラー: ${err}`);
    process.exit(1);
  });
}
