// 津留いちご園の実際の情報
export const FARM_INFO = {
  name: '津留いちご園',
  address: {
    postal: '〒833-0053',
    full: '福岡県筑後市大字西牟田2821-2',
    note: '八女ICより約20分'
  },
  contact: {
    phone: '0942-53-1038',
    mobile: '070-5071-9155',
    fax: '0942-53-1182',
    email: 'tsuruichigoen@herb.ocn.ne.jp'
  },
  googleMaps: {
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3345.123!2d130.123!3d33.123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDA3JzM0LjAiTiAxMzDCsDA3JzIyLjAiRQ!5e0!3m2!1sja!2sjp!4v1234567890',
    location: {
      lat: 33.2156,
      lng: 130.4728
    }
  },
  features: {
    strawberryVariety: 'かおり野',
    cultivationMethod: '土耕栽培',
    fertilizers: [
      '油粕', '米糠', '海藻', '魚粉', '黒砂糖', 'ニッケ', 'イオウ'
    ],
    motto: '除草剤や農薬を一切使用せず、12種類の有機質肥料で栽培'
  }
};

// いちご狩り料金
export const STRAWBERRY_PICKING = {
  note: '※いちご狩りは要予約です。まずはご連絡下さい。',
  footwearNote: '※足下の土が緩んでいる事がありますので、靴はスニーカーや長靴等をおすすめいたします。',
  pricing: [
    {
      period: '12月〜2月',
      adult: 2000,
      child: 1000,
      takeaway: 300
    },
    {
      period: '3月',
      adult: 1900,
      child: 950,
      takeaway: 275
    },
    {
      period: '4月〜',
      adult: 1800,
      child: 900,
      takeaway: 250
    }
  ]
};

// Shopify商品情報（実際のShopify商品IDを後で設定）
export const PRODUCTS = {
  strawberries: [
    {
      id: 'premium-strawberry-500g',
      shopifyId: '', // 実際のShopify商品IDを設定
      name: '厳選いちご（特秀）500g',
      description: '化粧箱入り。贈答用として最高級のいちごを一粒ずつ丁寧に箱詰め。',
      image: '/images/premium-strawberry.jpg',
      category: 'strawberry',
      pricing: [
        { month: '12月', price: 2000 },
        { month: '1月', price: 1800 },
        { month: '2月-5月', price: 1600 }
      ]
    },
    {
      id: 'select-strawberry-300g-2pack',
      shopifyId: '', // 実際のShopify商品IDを設定
      name: '厳選いちご（秀）300g×2パック',
      description: '厳選したいちごを2パックセットで。',
      image: '/images/select-strawberry.jpg',
      category: 'strawberry',
      pricing: [
        { month: '12月', price: 2000 },
        { month: '1月', price: 1800 },
        { month: '2月-5月', price: 1600 }
      ]
    },
    {
      id: 'strawberry-300g-4pack',
      shopifyId: '', // 実際のShopify商品IDを設定
      name: 'いちご 300g×4パック',
      description: '大きいものから小さいものまでいろいろな粒が含まれています。',
      image: '/images/strawberry-4pack.jpg',
      category: 'strawberry',
      pricing: [
        { month: '12月', price: 3200 },
        { month: '1月', price: 2800 },
        { month: '2月-5月', price: 2400 }
      ]
    },
    {
      id: 'frozen-strawberry-600g',
      shopifyId: '', // 実際のShopify商品IDを設定
      name: '冷凍いちご 600g',
      description: '大きいものから小さいものまでいろいろな粒が含まれています。',
      image: '/images/frozen-strawberry.jpg',
      category: 'strawberry',
      pricing: [
        { month: '通年', price: 500 }
      ]
    }
  ],
  rice: [
    {
      id: 'hinohikari-brown-5kg',
      shopifyId: '',
      name: 'ヒノヒカリ 玄米 5kg',
      description: '除草剤や農薬を一切使用せず、12種類の有機質肥料で栽培したお米。',
      image: '/images/rice-brown.jpg',
      category: 'rice',
      price: 3750
    },
    {
      id: 'hinohikari-7bu-5kg',
      shopifyId: '',
      name: 'ヒノヒカリ 7分づき 5kg',
      description: '栄養価と食べやすさのバランスが良い7分づき。',
      image: '/images/rice-7bu.jpg',
      category: 'rice',
      price: 3800
    },
    {
      id: 'hinohikari-white-5kg',
      shopifyId: '',
      name: 'ヒノヒカリ 白米 5kg',
      description: '無農薬栽培の安全でおいしい白米。',
      image: '/images/rice-white.jpg',
      category: 'rice',
      price: 3800
    },
    {
      id: 'hinohikari-small-5kg',
      shopifyId: '',
      name: 'ヒノヒカリ 中米（小粒）白米 5kg',
      description: 'お手頃価格の中米（小粒）。',
      image: '/images/rice-small.jpg',
      category: 'rice',
      price: 2300
    },
    {
      id: 'blend-rice-5kg',
      shopifyId: '',
      name: 'ブレンド米 白米 5kg',
      description: '白米と中米（小粒）のブレンド。',
      image: '/images/rice-blend.jpg',
      category: 'rice',
      price: 3050
    }
  ],
  mochi: [
    {
      id: 'small-mochi-300g',
      shopifyId: '',
      name: '小もち 300g',
      description: '無農薬で育てたもち米を使用。手作りして真空パックに詰めてお届け。',
      image: '/images/mochi.jpg',
      category: 'mochi',
      price: 500
    },
    {
      id: 'mochigome-5kg',
      shopifyId: '',
      name: 'もち米（無農薬米）5kg',
      description: '無農薬栽培のもち米。',
      image: '/images/mochigome.jpg',
      category: 'mochi',
      price: 3800
    }
  ],
  miso: [
    {
      id: 'additive-free-miso-1kg',
      shopifyId: '',
      name: '無添加味噌 1kg',
      description: '有機肥料のみを使用した無農薬米、五島灘の塩、国産の大豆を使用。',
      image: '/images/miso.jpg',
      category: 'miso',
      price: 1100
    }
  ]
};

// 送料設定（一律）
export const SHIPPING = {
  standardFee: 2300,
  note: '※離島につきましてはお取り扱いしておりません。'
};
