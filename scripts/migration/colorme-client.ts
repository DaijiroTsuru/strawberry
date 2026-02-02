import { config } from "./config.js";
import { logger } from "./logger.js";
import { sleep } from "./helpers.js";
import type { ColormeSalesResponse } from "./types.js";

/**
 * カラーミーショップ REST APIクライアント。
 * レート制限（120req/min）に対応。
 */
export class ColormeClient {
  private accessToken: string;

  constructor() {
    this.accessToken = config.colorme.accessToken;
    if (!this.accessToken) {
      throw new Error(
        "COLORME_ACCESS_TOKEN が設定されていません。先に npm run migrate:auth を実行してください。",
      );
    }
  }

  private async request<T>(path: string, params?: URLSearchParams): Promise<T> {
    const url = new URL(`${config.colorme.apiBase}${path}`);
    if (params) {
      url.search = params.toString();
    }

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(
        `カラーミーAPI エラー: ${res.status} ${res.statusText} - ${body}`,
      );
    }

    return res.json() as Promise<T>;
  }

  /**
   * 全注文データをページネーションで取得する。
   */
  async fetchAllSales(): Promise<ColormeSalesResponse["sales"]> {
    const allSales: ColormeSalesResponse["sales"] = [];
    const limit = 100;
    let offset = 0;

    logger.info("カラーミーAPIから注文データを取得開始...");

    while (true) {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
        make_date_min: "2020-01-01",
        make_date_max: new Date().toISOString().split('T')[0]
      });

      const data = await this.request<ColormeSalesResponse>(
        "/sales.json",
        params,
      );

      allSales.push(...data.sales);
      logger.info(
        `取得: ${allSales.length}/${data.meta.total} 件 (offset=${offset})`,
      );

      if (allSales.length >= data.meta.total) break;

      offset += limit;
      await sleep(config.colormeApiInterval);
    }

    logger.success(`全 ${allSales.length} 件の注文データを取得完了`);
    return allSales;
  }
}
