import { config as dotenvConfig } from "dotenv";
import path from "path";

dotenvConfig({ path: path.resolve(process.cwd(), ".env") });

const args = process.argv.slice(2);

const storeDomain = process.env.SHOPIFY_ADMIN_STORE_DOMAIN ?? "";
const dataDir = path.resolve(process.cwd(), "scripts/migration/data");

// --name-filter=津留美穂 のような引数から名前フィルタを取得
const nameFilterArg = args.find((arg) => arg.startsWith("--name-filter="));
const nameFilter = nameFilterArg ? nameFilterArg.split("=")[1] : "";

export const config = {
  dryRun: args.includes("--dry-run"),
  includeZeroOrders: args.includes("--include-zero-orders"),
  nameFilter,

  shopify: {
    storeDomain,
    adminApiToken: process.env.SHOPIFY_ADMIN_API_TOKEN ?? "",
    apiBase: `https://${storeDomain}/admin/api/2025-01`,
  },

  colorme: {
    clientId: process.env.COLORME_CLIENT_ID ?? "",
    clientSecret: process.env.COLORME_CLIENT_SECRET ?? "",
    accessToken: process.env.COLORME_ACCESS_TOKEN ?? "",
    apiBase: "https://api.shop-pro.jp/v1",
    oauthAuthorizeUrl: "https://api.shop-pro.jp/oauth/authorize",
    oauthTokenUrl: "https://api.shop-pro.jp/oauth/token",
    redirectUri: "http://localhost:3000/callback",
    scope: "read_sales",
  },

  paths: {
    productCsv: path.resolve(process.cwd(), "product.csv"),
    customerCsv: path.resolve(process.cwd(), "customer.csv"),
    dataDir,
    ordersJson: path.join(dataDir, "colorme-orders.json"),
    idMapJson: path.join(dataDir, "id-map.json"),
    logFile: path.join(dataDir, "migration.log"),
  },

  shopifyApiInterval: 550,
  colormeApiInterval: 500,
  maxRetries: 3,
  defaultVendor: "津留いちご園",
};
