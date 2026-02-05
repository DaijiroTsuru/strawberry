/**
 * BEAFセクションで使用するUnsplash画像URL
 * いちご商品詳細ページの訴求セクション用
 * 日本人に馴染みのある画像を選定（いちご以外）
 */
export const BEAF_IMAGES = {
  benefit: {
    /** 贈り物・ギフト - 上品なギフトボックス */
    gift: 'https://cdn.shopify.com/s/files/1/0791/6434/2495/files/9A4DE0CA-825F-461E-A57E-9F5D3BD3605A_1_105_c.jpg?v=1770284900',
    /** 笑顔・喜び - 家族の幸せな時間 */
    smile: 'https://cdn.shopify.com/s/files/1/0791/6434/2495/files/190022146_f38b32b0-c876-4645-a924-35effff31dea.png?v=1770284683',
    /** 届いてすぐ - 家族が届いた箱を開ける喜び */
    delivery: 'https://cdn.shopify.com/s/files/1/0791/6434/2495/files/9A4DE0CA-825F-461E-A57E-9F5D3BD3605A_1_105_c.png?v=1770284188',
  },
  evidence: {
    /** 土耕栽培 - 豊かな土壌 */
    soil: 'https://cdn.shopify.com/s/files/1/0791/6434/2495/files/BF505AEB-863F-43B0-A37D-FB5EB8200E36_1_105_c.jpg?v=1768511100',
  },
} as const;

export type BeafImageCategory = keyof typeof BEAF_IMAGES;
