/**
 * 日本語名前を姓・名に分割する。
 * スペース（全角・半角）で区切れない場合は全体を姓として返す。
 */
export function splitName(fullName: string): {
  lastName: string;
  firstName: string;
} {
  const trimmed = fullName.trim();
  // 全角スペースまたは半角スペースで分割
  const parts = trimmed.split(/[\s　]+/);
  if (parts.length >= 2) {
    return { lastName: parts[0], firstName: parts.slice(1).join(" ") };
  }
  return { lastName: trimmed, firstName: "" };
}

/**
 * 日本の電話番号をE.164形式に変換する。
 * "090-1234-5678" → "+819012345678"
 * 既に+81の場合はそのまま返す。空文字の場合はundefinedを返す。
 */
export function toE164(phone: string): string | undefined {
  if (!phone || !phone.trim()) return undefined;
  let cleaned = phone.replace(/[-\s()（）ー－]/g, "");
  if (cleaned.startsWith("+81")) return cleaned;
  if (cleaned.startsWith("0")) {
    cleaned = "+81" + cleaned.slice(1);
  }
  return cleaned || undefined;
}

/**
 * 郵便番号をハイフン付き7桁にフォーマットする。
 * "8610000" → "861-0000", "861-0000" → "861-0000"
 */
export function formatZip(zip: string): string {
  const digits = zip.replace(/[-ー－\s]/g, "");
  if (digits.length === 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }
  return zip;
}

/**
 * 住所文字列をaddress1（町名番地）とaddress2（建物名等）に分割する。
 * 全角スペースで建物名を分割。なければaddress2は空文字。
 */
export function splitAddress(address: string): {
  address1: string;
  address2: string;
} {
  const idx = address.indexOf("　");
  if (idx > 0) {
    return {
      address1: address.slice(0, idx),
      address2: address.slice(idx + 1),
    };
  }
  return { address1: address, address2: "" };
}

/**
 * UNIXタイムスタンプをISO8601文字列に変換する。
 */
export function unixToIso(unixTimestamp: number): string {
  return new Date(unixTimestamp * 1000).toISOString();
}

/**
 * 指定ミリ秒待機する。
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
