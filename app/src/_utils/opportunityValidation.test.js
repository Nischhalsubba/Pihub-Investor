import { validateOpportunity } from './opportunityValidation';

const valid = {
  product_title: 'Growth facility',
  state_ids: [1],
  county_ids: [11],
  industry_id: [2],
  service_id: 3,
  min_time_duration: 12,
  max_time_duration: 24,
  min_credit_amount: 250000,
  max_credit_amount: 500000,
  min_sales_creditor: 1000000,
  colatoral: 'true',
  credit: 'false',
  ratingValues: {}
};

describe('opportunity validation', () => {
  test('accepts a complete exact-value opportunity', () => {
    expect(validateOpportunity(valid)).toEqual({});
  });

  test('rejects reversed financial ranges and tenor ranges', () => {
    const errors = validateOpportunity({ ...valid, min_time_duration: 36, max_time_duration: 12, min_credit_amount: 600000, max_credit_amount: 500000 });
    expect(errors.max_time_duration).toBeTruthy();
    expect(errors.max_credit_amount).toBeTruthy();
  });

  test('requires an agency rating only when rating is required', () => {
    expect(validateOpportunity({ ...valid, credit: 'true', ratingValues: {} }).ratings).toBeTruthy();
    expect(validateOpportunity({ ...valid, credit: 'true', ratingValues: { 2: 'BBB+' } }).ratings).toBeUndefined();
  });
});
