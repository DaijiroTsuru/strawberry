import { describe, expect, it } from 'vitest';
import { toGaItem, categoryOf } from '@/utils/analytics/items';

const product = { title: 'いちご かおり野 特秀', handle: 'ichigo-kaorino' };

describe('toGaItem', () => {
  it('builds an item from a product and its variant', () => {
    const item = toGaItem(product, {
      id: 'gid://shopify/ProductVariant/123',
      title: '化粧箱入 500g',
      priceV2: { amount: '3800.0' },
    });

    expect(item).toEqual({
      item_id: 'gid://shopify/ProductVariant/123',
      item_name: 'いちご かおり野 特秀',
      item_variant: '化粧箱入 500g',
      price: 3800,
      quantity: 1,
    });
  });

  it('falls back to the product handle when no variant exists', () => {
    const item = toGaItem(product, undefined);
    expect(item.item_id).toBe('ichigo-kaorino');
    expect(item.item_variant).toBeUndefined();
    expect(item.price).toBeUndefined();
  });

  it('attaches a category and quantity when given', () => {
    const item = toGaItem(product, undefined, { category: 'strawberry', quantity: 3 });
    expect(item.item_category).toBe('strawberry');
    expect(item.quantity).toBe(3);
  });

  it('omits price when the amount is not a number', () => {
    const item = toGaItem(product, {
      id: 'v1',
      priceV2: { amount: 'not-a-number' },
    });
    expect(item.price).toBeUndefined();
  });
});

describe('categoryOf', () => {
  const withCollection = (id: string) => ({
    collections: { edges: [{ node: { id: `gid://shopify/Collection/${id}` } }] },
  });

  it('detects the strawberry collection', () => {
    expect(categoryOf(withCollection('486373589215'))).toBe('strawberry');
  });

  it('detects the rice collection', () => {
    expect(categoryOf(withCollection('486421135583'))).toBe('rice');
  });

  it('returns undefined when the product has no known collection', () => {
    expect(categoryOf(withCollection('999'))).toBeUndefined();
    expect(categoryOf({})).toBeUndefined();
  });
});
