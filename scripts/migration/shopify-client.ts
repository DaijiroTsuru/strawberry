import { config } from "./config.js";
import { logger } from "./logger.js";
import { sleep } from "./helpers.js";

/**
 * Shopify Admin REST APIクライアント。
 * レート制限管理、リトライ、dry-runモードを提供。
 */
export class ShopifyClient {
  private lastCallAt = 0;

  constructor() {
    if (!config.shopify.storeDomain || !config.shopify.adminApiToken) {
      throw new Error(
        "VITE_SHOPIFY_STORE_DOMAIN と SHOPIFY_ADMIN_API_TOKEN を .env に設定してください",
      );
    }
  }

  private async throttle(): Promise<void> {
    const now = Date.now();
    const elapsed = now - this.lastCallAt;
    if (elapsed < config.shopifyApiInterval) {
      await sleep(config.shopifyApiInterval - elapsed);
    }
    this.lastCallAt = Date.now();
  }

  private checkBucketLimit(headers: Headers): void {
    const limit = headers.get("X-Shopify-Shop-Api-Call-Limit");
    if (limit) {
      const [used, max] = limit.split("/").map(Number);
      if (used / max > 0.8) {
        logger.warn(`APIバケット使用率: ${used}/${max} — 追加待機中`);
      }
    }
  }

  async request<T>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<T> {
    if (config.dryRun) {
      logger.info(`[DRY-RUN] ${method} ${path}`);
      if (body) {
        logger.info(`[DRY-RUN] Payload: ${JSON.stringify(body, null, 2)}`);
      }
      return {} as T;
    }

    await this.throttle();

    const url = `${config.shopify.apiBase}${path}`;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
      try {
        const res = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": config.shopify.adminApiToken,
          },
          body: body ? JSON.stringify(body) : undefined,
        });

        this.checkBucketLimit(res.headers);

        if (res.status === 401 || res.status === 403) {
          const errBody = await res.text();
          throw new Error(
            `Shopify認証エラー (${res.status}): ${errBody} — APIトークンを確認してください`,
          );
        }

        if (res.status === 429 || res.status >= 500) {
          const retryAfter = res.headers.get("Retry-After");
          const waitMs = retryAfter
            ? parseInt(retryAfter, 10) * 1000
            : 1000 * Math.pow(2, attempt);
          logger.warn(
            `Shopify ${res.status}: ${waitMs}ms後にリトライ (${attempt}/${config.maxRetries})`,
          );
          await sleep(waitMs);
          continue;
        }

        if (!res.ok) {
          const errBody = await res.text();
          const err = new Error(
            `Shopify API エラー: ${res.status} ${res.statusText} - ${errBody}`,
          );
          (err as ShopifyApiError).status = res.status;
          (err as ShopifyApiError).body = errBody;
          throw err;
        }

        // 204 No Content
        if (res.status === 204) return {} as T;

        return (await res.json()) as T;
      } catch (err) {
        if (
          err instanceof Error &&
          (err.message.includes("認証エラー") ||
            ((err as ShopifyApiError).status !== undefined &&
              (err as ShopifyApiError).status! < 500 &&
              (err as ShopifyApiError).status !== 429))
        ) {
          throw err;
        }
        lastError = err instanceof Error ? err : new Error(String(err));
        if (attempt < config.maxRetries) {
          const waitMs = 1000 * Math.pow(2, attempt);
          logger.warn(`リトライ ${attempt}/${config.maxRetries}: ${waitMs}ms待機`);
          await sleep(waitMs);
        }
      }
    }

    throw lastError ?? new Error("Shopify APIリクエスト失敗");
  }

  async get<T>(path: string): Promise<T> {
    return this.request<T>("GET", path);
  }

  async post<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>("POST", path, body);
  }

  async put<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>("PUT", path, body);
  }

  /**
   * Shopifyの最初のロケーションIDを取得する（在庫管理に必要）。
   */
  async getLocationId(): Promise<number> {
    const data = await this.get<{ locations: Array<{ id: number }> }>(
      "/locations.json",
    );
    return data.locations[0].id;
  }

  /**
   * メールアドレスで既存顧客を検索する。
   */
  async findCustomerByEmail(
    email: string,
  ): Promise<{ id: number } | null> {
    const data = await this.get<{
      customers: Array<{ id: number }>;
    }>(`/customers/search.json?query=email:${encodeURIComponent(email)}`);
    return data.customers?.[0] ?? null;
  }
}

interface ShopifyApiError extends Error {
  status?: number;
  body?: string;
}
