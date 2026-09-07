import { describe, expect, test } from 'vitest';
import { isAllowedCreditDecision } from './changeStatus';
import { isAllowedProductStatusAction } from './product';

describe('financial action integrity', () => {
  test('credit decisions are limited to the workflow states rendered by the review UI', () => {
    expect(isAllowedCreditDecision('accepted')).toBe(true);
    expect(isAllowedCreditDecision('rejected')).toBe(true);
    expect(isAllowedCreditDecision('approved')).toBe(false);
    expect(isAllowedCreditDecision('deleted')).toBe(false);
    expect(isAllowedCreditDecision('')).toBe(false);
  });

  test('product availability mutations are limited to postpone and undo', () => {
    expect(isAllowedProductStatusAction('postpone')).toBe(true);
    expect(isAllowedProductStatusAction('undo_postpone')).toBe(true);
    expect(isAllowedProductStatusAction('delete')).toBe(false);
    expect(isAllowedProductStatusAction('invested')).toBe(false);
    expect(isAllowedProductStatusAction('')).toBe(false);
  });
});
