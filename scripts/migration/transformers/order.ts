import type {
  ColormeSale,
  IdMap,
  ShopifyOrderPayload,
} from "../types.js";
import { splitName, toE164, formatZip, unixToIso } from "../helpers.js";

export function transformOrder(
  sale: ColormeSale,
  idMap: IdMap,
): ShopifyOrderPayload {
  const createdAt = unixToIso(sale.make_date);

  // 顧客IDマッピング
  const shopifyCustomerId = idMap.customers[String(sale.customer.id)];

  // 商品明細（商品名が空のものは除外）
  const lineItems = sale.details
    .filter((detail) => {
      // product_name または pristine_product_full_name のいずれかが存在すればOK
      const productName = detail.product_name?.trim() || detail.pristine_product_full_name?.trim();
      return productName && productName.length > 0;
    })
    .map((detail) => {
      const shopifyVariantId = idMap.variants[String(detail.product_id)];
      // product_name がない場合は pristine_product_full_name を使用
      const title = detail.product_name || detail.pristine_product_full_name || "商品名不明";
      return {
        ...(shopifyVariantId ? { variant_id: shopifyVariantId } : {}),
        title,
        price: String(detail.price_with_tax),
        quantity: detail.product_num,
      };
    });

  // 配送先（最初の配送先を使用）
  const delivery = sale.sale_deliveries?.[0];
  let shippingAddress: ShopifyOrderPayload["order"]["shipping_address"];
  const shippingLines: ShopifyOrderPayload["order"]["shipping_lines"] = [];

  if (delivery) {
    const { lastName, firstName } = splitName(delivery.name ?? "");
    const phone = toE164(delivery.tel ?? "");

    shippingAddress = {
      first_name: firstName,
      last_name: lastName,
      address1: delivery.address1 ?? "",
      address2: delivery.address2 ?? "",
      city: "",
      province: delivery.pref_name ?? "",
      zip: formatZip(delivery.postal ?? ""),
      country: "JP",
      ...(phone ? { phone } : {}),
    };

    if (delivery.delivery_charge > 0) {
      shippingLines.push({
        title: "配送料",
        price: String(delivery.delivery_charge),
        code: "shipping",
      });
    }
  }

  // メタデータ
  const noteAttributes: Array<{ name: string; value: string }> = [
    { name: "colorme_order_id", value: String(sale.id) },
  ];
  if (delivery?.preferred_date) {
    noteAttributes.push({
      name: "preferred_date",
      value: delivery.preferred_date,
    });
  }
  if (delivery?.preferred_period) {
    noteAttributes.push({
      name: "preferred_period",
      value: delivery.preferred_period,
    });
  }

  return {
    order: {
      created_at: createdAt,
      processed_at: createdAt,
      ...(shopifyCustomerId ? { customer: { id: shopifyCustomerId } } : {}),
      line_items: lineItems,
      ...(shippingAddress ? { shipping_address: shippingAddress } : {}),
      shipping_lines: shippingLines,
      financial_status: sale.paid ? "paid" : "pending",
      fulfillment_status: sale.delivered ? "fulfilled" : null,
      send_receipt: false as const,
      send_fulfillment_receipt: false as const,
      inventory_behaviour: "bypass" as const,
      note_attributes: noteAttributes,
    },
  };
}
