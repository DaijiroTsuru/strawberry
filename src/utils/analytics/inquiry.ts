/**
 * 問い合わせ種別。Gmail側の分類器と同一のタクソノミーを使う
 * （設計書 §2.4 / 両データソースを突き合わせるため）。
 */
export type InquiryType =
  | 'strawberry_picking'
  | 'wholesale'
  | 'ec_rice'
  | 'ec_strawberry'
  | 'access'
  | 'other';

/**
 * 判定は上から順に評価し、最初に一致したものを返す。
 * 実測（2026-01〜04 / 115件）で77.4%がいちご狩りであるため最優先。
 * 「玄米を購入したい」のように購入語とお米語が同居するため、
 * お米・卸を汎用の購入語より先に評価する。
 */
const RULES: Array<[InquiryType, string[]]> = [
  ['strawberry_picking', ['いちご狩り', 'イチゴ狩り', '苺狩り', 'いちごがり']],
  ['wholesale', ['卸', '業務用', '仕入', '法人', '取引']],
  ['ec_rice', ['お米', '玄米', '白米', 'ヒノヒカリ', '精米', '分づき', 'もち米', 'ブレンド米', '小もち', '中米', '米']],
  ['ec_strawberry', ['いちごの購入', '購入', '注文', '通販', '発送', '配送', '在庫']],
  ['access', ['アクセス', '営業時間', '駐車', '場所', '道順', '定休日', '営業日', '行き方', '住所', '地図']],
];

export function classifyInquiry(subject: string, message: string): InquiryType {
  const haystack = `${subject} ${message}`;
  for (const [type, keywords] of RULES) {
    if (keywords.some((word) => haystack.includes(word))) return type;
  }
  return 'other';
}
