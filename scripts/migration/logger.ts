import fs from "fs";
import path from "path";
import { config } from "./config.js";

const logDir = path.dirname(config.paths.logFile);

function ensureDir() {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
}

function timestamp(): string {
  return new Date().toISOString();
}

function write(level: string, msg: string) {
  const line = `[${timestamp()}] [${level}] ${msg}`;
  console.log(line);
  try {
    ensureDir();
    fs.appendFileSync(config.paths.logFile, line + "\n");
  } catch {
    // ログファイル書き込み失敗は無視
  }
}

export const logger = {
  info(msg: string) {
    write("INFO", msg);
  },
  warn(msg: string) {
    write("WARN", msg);
  },
  error(msg: string) {
    write("ERROR", msg);
  },
  success(msg: string) {
    write("OK", msg);
  },
};
