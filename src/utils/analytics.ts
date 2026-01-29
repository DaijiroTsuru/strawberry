/**
 * Google Analytics イベント送信ユーティリティ
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

/**
 * カスタムイベントを送信
 */
export function sendGAEvent(
  eventName: string,
  eventParams?: Record<string, any>
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
    console.log('GA Event sent:', eventName, eventParams);
  } else {
    console.warn('Google Analytics is not loaded');
  }
}

/**
 * お問い合わせフォーム送信イベント
 */
export function trackContactFormSubmission(formData: {
  subject?: string;
  email?: string;
}) {
  sendGAEvent('contact_form_submit', {
    event_category: 'engagement',
    event_label: formData.subject || 'お問い合わせ',
    value: 1,
  });
  
  // コンバージョンイベント（GA4のコンバージョンに設定可能）
  sendGAEvent('generate_lead', {
    currency: 'JPY',
    value: 0,
  });
}

/**
 * Shopify購入完了イベント
 */
export function trackShopifyPurchase(orderData?: {
  orderId?: string;
  revenue?: number;
  items?: Array<{ name: string; price: number; quantity: number }>;
}) {
  sendGAEvent('purchase', {
    transaction_id: orderData?.orderId || 'unknown',
    value: orderData?.revenue || 0,
    currency: 'JPY',
    items: orderData?.items || [],
  });
}

/**
 * Shopifyカート追加イベント
 */
export function trackAddToCart(item: {
  productName: string;
  variantName?: string;
  price?: number;
}) {
  sendGAEvent('add_to_cart', {
    event_category: 'ecommerce',
    event_label: item.productName,
    value: item.price || 0,
    currency: 'JPY',
    items: [
      {
        item_name: item.productName,
        item_variant: item.variantName,
        price: item.price,
        quantity: 1,
      },
    ],
  });
}

/**
 * Shopifyチェックアウト開始イベント
 */
export function trackBeginCheckout(items?: Array<any>) {
  sendGAEvent('begin_checkout', {
    event_category: 'ecommerce',
    items: items || [],
  });
}

/**
 * 外部リンククリックイベント
 */
export function trackExternalLinkClick(url: string, linkText?: string) {
  sendGAEvent('click', {
    event_category: 'external_link',
    event_label: linkText || url,
    value: url,
  });
}

/**
 * 電話番号クリックイベント
 */
export function trackPhoneClick(phoneNumber: string) {
  sendGAEvent('click', {
    event_category: 'contact',
    event_label: 'phone_click',
    value: phoneNumber,
  });
}

/**
 * メールクリックイベント
 */
export function trackEmailClick(email: string) {
  sendGAEvent('click', {
    event_category: 'contact',
    event_label: 'email_click',
    value: email,
  });
}

/**
 * Google広告コンバージョンイベント - いちご狩り予約・問い合わせ
 */
export function trackStrawberryPickingConversion(url?: string) {
  const callback = function () {
    if (typeof url !== 'undefined') {
      window.location.href = url;
    }
  };

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      'send_to': 'AW-17913747934/_9PYCI30zO4bEN6z-N1C',
      'value': 2000.0,
      'currency': 'JPY',
      'transaction_id': '',
      'event_callback': callback
    });
    console.log('Google Ads Conversion tracked: Strawberry Picking');
  } else {
    console.warn('Google Ads tracking is not loaded');
    // gtagが読み込まれていなくてもコールバックは実行
    callback();
  }

  return false;
}

/**
 * いちご狩り電話予約トラッキング（電話リンククリック時）
 */
export function trackStrawberryPickingPhoneReservation(phoneNumber: string) {
  // Google Analyticsイベント
  trackPhoneClick(phoneNumber);
  
  // Google広告コンバージョン
  trackStrawberryPickingConversion();
}
