// ── カラーミーCSV型 ──

export interface ColormeProductCsv {
  商品ID: string;
  商品名: string;
  商品説明: string;
  簡易説明: string;
  販売価格: string;
  定価: string;
  型番: string;
  在庫数: string;
  在庫管理: string;
  原価: string;
  商品画像URL: string;
  その他画像1: string;
  その他画像2: string;
  その他画像3: string;
  その他画像4: string;
  その他画像5: string;
  その他画像6: string;
  その他画像7: string;
  その他画像8: string;
  その他画像9: string;
  大カテゴリー: string;
  小カテゴリー: string;
  掲載設定: string;
  ブランド: string;
  [key: string]: string;
}

export interface ColormeCustomerCsv {
  顧客ID: string;
  名前: string;
  フリガナ: string;
  メールアドレス: string;
  電話番号: string;
  郵便番号: string;
  都道府県名: string;
  住所: string;
  メルマガ受信可否: string;
  [key: string]: string;
}

// ── カラーミーAPI型 ──

export interface ColormeSaleDetail {
  product_id: number;
  product_name: string | null;
  pristine_product_full_name?: string;
  price_with_tax: number;
  product_num: number;
  sku: string;
}

export interface ColormeSaleDelivery {
  name: string;
  postal: string;
  pref_name: string;
  address1: string;
  address2: string;
  tel: string;
  delivery_charge: number;
  preferred_date: string | null;
  preferred_period: string | null;
}

export interface ColormeSaleCustomer {
  id: number;
  name: string;
  mail: string;
}

export interface ColormeSale {
  id: number;
  make_date: number;
  customer: ColormeSaleCustomer;
  details: ColormeSaleDetail[];
  sale_deliveries: ColormeSaleDelivery[];
  paid: boolean;
  delivered: boolean;
  total_price: number;
  noshi: string | null;
  memo: string | null;
}

export interface ColormeSalesResponse {
  sales: ColormeSale[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
}

// ── Shopify API型 ──

export interface ShopifyProductPayload {
  product: {
    title: string;
    body_html: string;
    vendor: string;
    product_type: string;
    tags: string;
    status: "active" | "draft";
    variants: Array<{
      price: string;
      compare_at_price?: string;
      sku: string;
      inventory_management: string | null;
    }>;
    images: Array<{ src: string }>;
  };
}

export interface ShopifyCustomerPayload {
  customer: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    note?: string;
    tags?: string;
    send_email_invite: false;
    email_marketing_consent?: {
      state: "subscribed" | "not_subscribed";
      opt_in_level: "single_opt_in" | "confirmed_opt_in" | "unknown";
      consent_updated_at: string;
    };
    addresses: Array<{
      address1: string;
      address2: string;
      city: string;
      province: string;
      zip: string;
      country: string;
      phone?: string;
      first_name: string;
      last_name: string;
    }>;
  };
}

export interface ShopifyOrderPayload {
  order: {
    created_at: string;
    processed_at: string;
    customer?: { id: number };
    line_items: Array<{
      variant_id?: number;
      title: string;
      price: string;
      quantity: number;
    }>;
    shipping_address?: {
      first_name: string;
      last_name: string;
      address1: string;
      address2: string;
      city: string;
      province: string;
      zip: string;
      country: string;
      phone?: string;
    };
    shipping_lines: Array<{
      title: string;
      price: string;
      code: string;
    }>;
    financial_status: "paid" | "pending";
    fulfillment_status: "fulfilled" | null;
    send_receipt: false;
    send_fulfillment_receipt: false;
    inventory_behaviour: "bypass";
    note_attributes: Array<{ name: string; value: string }>;
    note?: string;
  };
}

// ── IDマップ型 ──

export interface IdMap {
  products: Record<string, number>;
  customers: Record<string, number>;
  orders: Record<string, number>;
  variants: Record<string, number>;
  inventoryItems: Record<string, number>;
  locationId?: number;
}
