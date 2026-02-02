import { config as dotenvConfig } from "dotenv";
dotenvConfig();

const accessToken = process.env.COLORME_ACCESS_TOKEN;

async function testAPI() {
  console.log("Testing カラーミーAPI...\n");
  
  // ショップ情報を取得
  try {
    const shopRes = await fetch("https://api.shop-pro.jp/v1/shop.json", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    const shopData = await shopRes.json();
    console.log("✅ ショップ情報:", JSON.stringify(shopData, null, 2));
  } catch (err) {
    console.error("❌ ショップ情報取得エラー:", err);
  }

  // 注文データを取得（様々なパラメータパターンを試す）
  console.log("\n--- パターン1: パラメータなし ---");
  try {
    const salesRes1 = await fetch("https://api.shop-pro.jp/v1/sales.json?limit=10", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    const salesData1 = await salesRes1.json();
    console.log("結果:", JSON.stringify(salesData1, null, 2));
  } catch (err) {
    console.error("エラー:", err);
  }

  console.log("\n--- パターン2: make_date_min/max ---");
  try {
    const params2 = new URLSearchParams({
      limit: "10",
      make_date_min: "2020-01-01",
      make_date_max: new Date().toISOString().split('T')[0]
    });
    const salesRes2 = await fetch(`https://api.shop-pro.jp/v1/sales.json?${params2}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    const salesData2 = await salesRes2.json();
    console.log("結果:", JSON.stringify(salesData2, null, 2));
  } catch (err) {
    console.error("エラー:", err);
  }

  console.log("\n--- パターン3: フィールド指定 ---");
  try {
    const params3 = new URLSearchParams({
      limit: "10",
      fields: "id,make_date,total_price"
    });
    const salesRes3 = await fetch(`https://api.shop-pro.jp/v1/sales.json?${params3}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    const salesData3 = await salesRes3.json();
    console.log("結果:", JSON.stringify(salesData3, null, 2));
  } catch (err) {
    console.error("エラー:", err);
  }
}

testAPI();
