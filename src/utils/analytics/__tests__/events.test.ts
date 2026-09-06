import { describe, expect, it } from 'vitest';
import { shouldSuppressTracking } from '@/utils/analytics/events';

describe('shouldSuppressTracking', () => {
  it('suppresses tracking for automated browsers (prerender)', () => {
    expect(shouldSuppressTracking({ webdriver: true })).toBe(true);
  });

  it('allows tracking for real visitors', () => {
    expect(shouldSuppressTracking({ webdriver: false })).toBe(false);
  });

  it('allows tracking when the flag is unavailable', () => {
    expect(shouldSuppressTracking(undefined)).toBe(false);
  });
});
