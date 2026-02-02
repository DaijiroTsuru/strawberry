import fs from "fs";
import { config } from "./config.js";
import type { IdMap } from "./types.js";

const emptyMap: IdMap = {
  products: {},
  customers: {},
  orders: {},
  variants: {},
  inventoryItems: {},
};

function ensureDir() {
  const dir = config.paths.dataDir;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function loadIdMap(): IdMap {
  try {
    if (fs.existsSync(config.paths.idMapJson)) {
      const data = fs.readFileSync(config.paths.idMapJson, "utf-8");
      return { ...emptyMap, ...JSON.parse(data) };
    }
  } catch {
    // ファイル破損時は空マップで開始
  }
  return { ...emptyMap };
}

export function saveIdMap(map: IdMap): void {
  ensureDir();
  fs.writeFileSync(config.paths.idMapJson, JSON.stringify(map, null, 2));
}

/**
 * IDマッピングを追加して即座にファイルに保存する。
 * スクリプト中断時のレジューム機能を提供する。
 */
export function setMapping(
  map: IdMap,
  category: keyof Omit<IdMap, "locationId">,
  colormeId: string,
  shopifyId: number,
): void {
  (map[category] as Record<string, number>)[colormeId] = shopifyId;
  saveIdMap(map);
}
