import fs from "fs";
import iconv from "iconv-lite";
import { parse } from "csv-parse/sync";

/**
 * CP932エンコードのCSVファイルを読み込み、レコード配列として返す。
 * RFC4180準拠パーサーを使用（改行・カンマを含むフィールドに対応）。
 */
export function readCp932Csv<T extends Record<string, string>>(
  filePath: string,
): T[] {
  const buf = fs.readFileSync(filePath);
  const text = iconv.decode(buf, "CP932");

  const records: T[] = parse(text, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
    bom: true,
  });

  return records;
}
