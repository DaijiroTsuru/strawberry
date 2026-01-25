import { useEffect } from 'react';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  structuredData?: object;
}

const DEFAULT_SEO = {
  siteName: '津留いちご園',
  defaultTitle: '津留いちご園｜久留米、筑後のいちご狩り【通信販売で全国配送も承ります】',
  defaultDescription: '福岡県筑後市の津留いちご園では、こだわりの栽培で新鮮ないちごと安心安全なお米をお届けしています。朝摘みの「かおり野」いちごと、12種類の有機質肥料で育てた無農薬栽培米を全国へ通信販売。いちご狩り体験も実施中。',
  defaultKeywords: 'いちご狩り,久留米,筑後,いちご,かおり野,無農薬米,有機栽培,お米,福岡,筑後市,通信販売,オンラインショップ',
  defaultImage: 'https://cdn.shopify.com/s/files/1/0791/6434/2495/files/723E7A30-ABBC-4701-9CAB-224F116EF19C_1_105_c.jpg?v=1768511539',
  siteUrl: 'https://www.tsuru-strawberry-farm.com',
};

export function SEO({
  title,
  description = DEFAULT_SEO.defaultDescription,
  keywords = DEFAULT_SEO.defaultKeywords,
  image = DEFAULT_SEO.defaultImage,
  url,
  type = 'website',
  structuredData,
}: SEOProps) {
  const pageTitle = title 
    ? `${title} | ${DEFAULT_SEO.siteName}` 
    : DEFAULT_SEO.defaultTitle;
  
  const pageUrl = url 
    ? `${DEFAULT_SEO.siteUrl}${url}` 
    : DEFAULT_SEO.siteUrl;

  useEffect(() => {
    // ページタイトルの設定
    document.title = pageTitle;

    // メタタグの設定
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // 基本メタタグ
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);

    // OGP (Open Graph Protocol)
    updateMetaTag('og:title', pageTitle, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', pageUrl, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', DEFAULT_SEO.siteName, true);
    updateMetaTag('og:locale', 'ja_JP', true);

    // Twitter Card
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', pageTitle);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);

    // 構造化データ (JSON-LD)
    if (structuredData) {
      let script = document.querySelector('script[type="application/ld+json"]');
      
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      
      script.textContent = JSON.stringify(structuredData);
    }

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', pageUrl);

  }, [pageTitle, description, keywords, image, pageUrl, type, structuredData]);

  return null;
}

// 構造化データのヘルパー関数
export const createOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: '津留いちご園',
  url: DEFAULT_SEO.siteUrl,
  logo: DEFAULT_SEO.defaultImage,
  description: DEFAULT_SEO.defaultDescription,
  address: {
    '@type': 'PostalAddress',
    addressRegion: '福岡県',
    addressLocality: '筑後市',
    addressCountry: 'JP',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+81-942-53-1038',
    contactType: 'customer service',
    areaServed: 'JP',
    availableLanguage: 'Japanese',
  }
});

export const createProductSchema = (product: {
  name: string;
  description: string;
  image: string;
  price: string;
  currency: string;
  availability: string;
  url: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description: product.description,
  image: product.image,
  offers: {
    '@type': 'Offer',
    price: product.price,
    priceCurrency: product.currency,
    availability: `https://schema.org/${product.availability}`,
    url: product.url,
  },
  brand: {
    '@type': 'Brand',
    name: '津留いちご園',
  },
});

export const createLocalBusinessSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': DEFAULT_SEO.siteUrl,
  name: '津留いちご園',
  image: DEFAULT_SEO.defaultImage,
  description: DEFAULT_SEO.defaultDescription,
  url: DEFAULT_SEO.siteUrl,
  telephone: '+81-942-53-1038',
  priceRange: '¥¥',
  address: {
    '@type': 'PostalAddress',
    addressRegion: '福岡県',
    addressLocality: '筑後市',
    addressCountry: 'JP',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 33.22603439554186,
    longitude: 130.46901652672733,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '09:00',
      closes: '17:00',
    },
  ],
});

export const createBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `${DEFAULT_SEO.siteUrl}${item.url}`,
  })),
});
