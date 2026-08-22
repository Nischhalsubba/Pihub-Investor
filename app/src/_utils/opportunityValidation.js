export const validateOpportunity = value => {
  const form = value || {};
  const errors = {};
  const minTenor = Number(form.min_time_duration);
  const maxTenor = Number(form.max_time_duration);
  const minCredit = Number(form.min_credit_amount);
  const maxCredit = Number(form.max_credit_amount);
  const minSales = Number(form.min_sales_creditor);

  if (!String(form.product_title || '').trim()) errors.product_title = 'Opportunity title is required.';
  if (!Array.isArray(form.state_ids) || !form.state_ids.length) errors.state_ids = 'Select at least one state.';
  if (!Array.isArray(form.county_ids) || !form.county_ids.length) errors.county_ids = 'Select at least one county.';
  if (!Array.isArray(form.industry_id) || !form.industry_id.length) errors.industry_id = 'Select at least one industry.';
  if (!form.service_id) errors.service_id = 'Select a facility type.';
  if (!Number.isFinite(minTenor) || minTenor < 1) errors.min_time_duration = 'Minimum tenor must be at least 1 month.';
  if (!Number.isFinite(maxTenor) || maxTenor < minTenor) errors.max_time_duration = 'Maximum tenor must be greater than or equal to minimum tenor.';
  if (!Number.isFinite(minCredit) || minCredit <= 0) errors.min_credit_amount = 'Minimum credit must be greater than zero.';
  if (!Number.isFinite(maxCredit) || maxCredit < minCredit) errors.max_credit_amount = 'Maximum credit must be greater than or equal to minimum credit.';
  if (!Number.isFinite(minSales) || minSales < 0) errors.min_sales_creditor = 'Minimum creditor sales cannot be negative.';
  if (!form.colatoral) errors.colatoral = 'Choose whether collateral is required.';
  if (!form.credit) errors.credit = 'Choose whether a credit rating is required.';

  if (form.credit === 'true') {
    const ratings = Object.keys(form.ratingValues || {}).filter(key => String(form.ratingValues[key] || '').trim());
    if (!ratings.length) errors.ratings = 'Enter at least one agency rating when credit rating is required.';
  }

  return errors;
};
