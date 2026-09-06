import { describe, expect, it } from 'vitest';
import { classifyInquiry } from '@/utils/analytics/inquiry';

describe('classifyInquiry', () => {
  it('classifies the picking dropdown value', () => {
    expect(classifyInquiry('いちご狩りについて', '')).toBe('strawberry_picking');
  });

  it('classifies picking mentioned only in the message body', () => {
    expect(classifyInquiry('その他', '苺狩りの予約をしたいです')).toBe('strawberry_picking');
  });

  it('classifies a rice enquiry even when it uses purchase wording', () => {
    expect(classifyInquiry('その他', '玄米を購入したいのですが')).toBe('ec_rice');
  });

  it('classifies farm-specific rice product names, not just generic rice words', () => {
    expect(classifyInquiry('その他', 'ブレンド米を購入したいです')).toBe('ec_rice');
  });

  it('classifies the strawberry purchase dropdown value', () => {
    expect(classifyInquiry('いちごの購入について', '')).toBe('ec_strawberry');
  });

  it('classifies a wholesale enquiry', () => {
    expect(classifyInquiry('その他', '業務用で卸していただけますか')).toBe('wholesale');
  });

  it('classifies an access enquiry', () => {
    expect(classifyInquiry('アクセス・営業時間について', '')).toBe('access');
  });

  it('falls back to other', () => {
    expect(classifyInquiry('その他', 'こんにちは')).toBe('other');
  });

  it('prefers picking over purchase wording when both appear', () => {
    expect(classifyInquiry('その他', 'いちご狩りの後に購入もできますか')).toBe('strawberry_picking');
  });
});
