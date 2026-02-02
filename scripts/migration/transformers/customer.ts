import type { ColormeCustomerCsv, ShopifyCustomerPayload } from "../types.js";
import { splitName, toE164, formatZip, splitAddress } from "../helpers.js";

export function transformCustomer(
  row: ColormeCustomerCsv,
): ShopifyCustomerPayload {
  const { lastName, firstName } = splitName(row["名前"] ?? "");
  const phone = toE164(row["電話番号"] ?? "");
  const zip = formatZip(row["郵便番号"] ?? "");
  const { address1, address2 } = splitAddress(row["住所"] ?? "");

  // フリガナを備考に保存
  const notes: string[] = [];
  if (row["フリガナ"]?.trim()) {
    notes.push(`フリガナ: ${row["フリガナ"].trim()}`);
  }

  // メルマガ受信設定
  const emailMarketingState =
    row["メルマガ受信可否"] === "受信する" ? "subscribed" : "not_subscribed";

  const customer: ShopifyCustomerPayload["customer"] = {
    first_name: firstName,
    last_name: lastName,
    email: row["メールアドレス"] ?? "",
    send_email_invite: false as const,
    email_marketing_consent: {
      state: emailMarketingState as "subscribed" | "not_subscribed",
      opt_in_level: emailMarketingState === "subscribed" ? "single_opt_in" : "unknown",
      consent_updated_at: new Date().toISOString(),
    },
    addresses: [
      {
        first_name: firstName,
        last_name: lastName,
        address1,
        address2,
        city: "",
        province: row["都道府県名"] ?? "",
        zip,
        country: "JP",
        ...(phone ? { phone } : {}),
      },
    ],
  };

  if (phone) customer.phone = phone;
  if (notes.length > 0) customer.note = notes.join("\n");

  return { customer };
}
