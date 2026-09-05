/**
 * Google Analytics イベント送信ユーティリティ
 *
 * イベント所有権ポリシー（docs/plans/2026-09-05-improvement-loop-design.md §6.2）:
 * begin_checkout / add_shipping_info / add_payment_info / purchase は
 * Shopify の Google & YouTube チャネル連携が送信する。
 * これらを自社サイトから送信してはならない（二重計上になる）。
 */

import { normalizePath } from './paths';
import type { GaItem } from './items';
import { classifyInquiry } from './inquiry';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

/**
 * 自動操作ブラウザ（プリレンダリングのPuppeteer等）からの送信を抑止する。
 * これがないと scripts/prerender.ts の実行が全ルートの page_view を偽造する。
 */
export function shouldSuppressTracking(
  nav: { webdriver?: boolean } | undefined
): boolean {
  return nav?.webdriver === true;
}

export function isTrackingSuppressed(): boolean {
  if (typeof navigator === 'undefined') return true;
  return shouldSuppressTracking(navigator);
}

/**
 * カスタムイベントを送信
 */
export function sendGAEvent(
  eventName: string,
  eventParams?: Record<string, unknown>
) {
  if (isTrackingSuppressed()) return;

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
  message?: string;
}) {
  const inquiryType = classifyInquiry(formData.subject ?? '', formData.message ?? '');

  sendGAEvent('contact_form_submit', {
    event_category: 'engagement',
    event_label: formData.subject || 'お問い合わせ',
    inquiry_type: inquiryType,
    value: 1,
  });

  sendGAEvent('generate_lead', {
    currency: 'JPY',
    value: 0,
    inquiry_type: inquiryType,
  });
}

/**
 * Shopifyカート追加イベント
 */
export function trackAddToCart(item: GaItem) {
  sendGAEvent('add_to_cart', {
    currency: 'JPY',
    value: (item.price ?? 0) * item.quantity,
    items: [item],
  });
}

/**
 * 外部リンククリック。
 * 電話・メールとイベント名を分けている理由:
 * event_category / event_label は未登録のカスタムパラメータであり
 * GA4レポートで分解できないため（設計書 §6.3 項目7）。
 */
export function trackExternalLinkClick(url: string, linkText?: string) {
  sendGAEvent('outbound_click', {
    link_url: url,
    link_text: linkText || url,
  });
}

/**
 * 電話番号クリック。いちご狩り予約の主要導線。
 */
export function trackPhoneClick(phoneNumber: string) {
  sendGAEvent('phone_click', {
    phone_number: phoneNumber,
  });
}

export function trackEmailClick(email: string) {
  sendGAEvent('email_click', {
    email_domain: email.split('@')[1] ?? '',
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

  if (typeof window !== 'undefined' && window.gtag && !isTrackingSuppressed()) {
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
    callback();
  }

  return false;
}

/**
 * いちご狩り電話予約トラッキング（電話リンククリック時）
 */
export function trackStrawberryPickingPhoneReservation(phoneNumber: string) {
  trackPhoneClick(phoneNumber);
  trackStrawberryPickingConversion();
}

/**
 * ページビューを送信する。
 * index.html で send_page_view: false としているため、初回表示・ルート遷移とも
 * このアプリ側から送信する。
 */
export function trackPageView(pathname: string, title?: string) {
  const path = normalizePath(pathname);
  sendGAEvent('page_view', {
    page_path: path,
    page_location: `${window.location.origin}${path}${window.location.search}`,
    page_title: title ?? document.title,
  });
}

/**
 * 商品詳細の表示。view_item がないと商品ページ→カートの転換率が測れない。
 */
export function trackViewItem(item: GaItem) {
  sendGAEvent('view_item', {
    currency: 'JPY',
    value: item.price ?? 0,
    items: [item],
  });
}

/**
 * 商品一覧の表示。
 */
export function trackViewItemList(items: GaItem[], listName: string) {
  sendGAEvent('view_item_list', {
    item_list_name: listName,
    items,
  });
}

/**
 * カートドロワーの表示。
 * begin_checkout は Shopify が所有するため、ここでは送信しない（設計書 §6.2）。
 */
export function trackViewCart(items: GaItem[], value: number) {
  sendGAEvent('view_cart', {
    currency: 'JPY',
    value,
    items,
  });
}

export function trackRemoveFromCart(item: GaItem) {
  sendGAEvent('remove_from_cart', {
    currency: 'JPY',
    value: (item.price ?? 0) * item.quantity,
    items: [item],
  });
}
