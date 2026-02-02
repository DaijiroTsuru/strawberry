import http from "http";
import fs from "fs";
import path from "path";
import { config } from "./config.js";
import { logger } from "./logger.js";

/**
 * カラーミーショップ OAuth認可フロー。
 * 1. ローカルHTTPサーバーを起動
 * 2. ブラウザで認可URLを開く
 * 3. コールバックで認可コードを受け取る
 * 4. アクセストークンを取得して .env に保存
 */
async function main() {
  if (!config.colorme.clientId || !config.colorme.clientSecret) {
    logger.error(
      "COLORME_CLIENT_ID と COLORME_CLIENT_SECRET を .env に設定してください",
    );
    process.exit(1);
  }

  const authorizeUrl =
    `${config.colorme.oauthAuthorizeUrl}` +
    `?client_id=${encodeURIComponent(config.colorme.clientId)}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent(config.colorme.scope)}` +
    `&redirect_uri=${encodeURIComponent(config.colorme.redirectUri)}`;

  logger.info("OAuth認可サーバーを起動中...");

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost:3000");

    if (url.pathname !== "/callback") {
      res.writeHead(404);
      res.end("Not Found");
      return;
    }

    const code = url.searchParams.get("code");
    if (!code) {
      res.writeHead(400);
      res.end("認可コードが見つかりません");
      return;
    }

    logger.info("認可コードを受信。アクセストークンを取得中...");

    try {
      const tokenRes = await fetch(config.colorme.oauthTokenUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: config.colorme.clientId,
          client_secret: config.colorme.clientSecret,
          code,
          grant_type: "authorization_code",
          redirect_uri: config.colorme.redirectUri,
        }),
      });

      if (!tokenRes.ok) {
        const errBody = await tokenRes.text();
        throw new Error(`トークン取得失敗: ${tokenRes.status} ${errBody}`);
      }

      const tokenData = (await tokenRes.json()) as { access_token: string };
      const accessToken = tokenData.access_token;

      // .env ファイルにトークンを書き込む
      const envPath = path.resolve(process.cwd(), ".env");
      let envContent = "";
      if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, "utf-8");
      }

      if (envContent.includes("COLORME_ACCESS_TOKEN=")) {
        envContent = envContent.replace(
          /COLORME_ACCESS_TOKEN=.*/,
          `COLORME_ACCESS_TOKEN=${accessToken}`,
        );
      } else {
        envContent += `\nCOLORME_ACCESS_TOKEN=${accessToken}\n`;
      }

      fs.writeFileSync(envPath, envContent);

      logger.success("アクセストークンを .env に保存しました");

      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(
        "<html><body><h1>認可完了</h1><p>このページを閉じてください。</p></body></html>",
      );

      // サーバーを停止
      server.close(() => {
        logger.info("認可サーバーを停止しました");
        process.exit(0);
      });
    } catch (err) {
      logger.error(`トークン取得エラー: ${err}`);
      res.writeHead(500);
      res.end("トークン取得に失敗しました");
    }
  });

  server.listen(3000, () => {
    logger.info(`認可サーバー起動: http://localhost:3000`);
    logger.info(`\n以下のURLをブラウザで開いて認可してください:\n${authorizeUrl}\n`);

    // macOSの場合ブラウザを自動で開く
    import("child_process").then(({ exec }) => {
      exec(`open "${authorizeUrl}"`);
    });
  });
}

main().catch((err) => {
  logger.error(`認可フロー失敗: ${err}`);
  process.exit(1);
});
