import client from './index';
import clientWithForm from './formDataRequest';
import { routes } from './../_api/routes';
import { isDemoMode } from '../_utils/demoMode';
import { getApiErrorMessage, normalizePagedCollection } from '../_utils/api';
import {
  CLEAR_ERROR,
  ERROR,
  PAGINATION,
  PRODUCTS_LIST,
  SINGLE_PRODUCT
} from './types';

const toDisplayText = value => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (typeof value !== 'object') return '';
  const candidates = [value.en, value.de, value.label, value.name, value.title];
  for (let index = 0; index < candidates.length; index += 1) {
    const candidate = candidates[index];
    if (typeof candidate === 'string' || typeof candidate === 'number') return String(candidate);
  }
  return '';
};

const extractDisplayNames = list => {
  if (!Array.isArray(list)) return [];
  return list.map(item => {
    if (item && typeof item === 'object' && item.label !== undefined) return toDisplayText(item.label);
    if (item && typeof item === 'object' && item.name !== undefined) return toDisplayText(item.name);
    return toDisplayText(item);
  }).filter(Boolean);
};

const asArray = value => Array.isArray(value) ? value : value === null || value === undefined ? [] : [value];
const idsFrom = values => asArray(values).map(value => value && typeof value === 'object' ? value.id : value).filter(value => value !== null && value !== undefined && value !== '');
const csv = values => idsFrom(values).join(',');

const resolveServiceId = services => {
  const service = Array.isArray(services) ? services[0] : services;
  if (service && typeof service === 'object') return service.value !== undefined ? service.value : service.id;
  return service;
};

const appendFiles = (body, files) => {
  const list = asArray(files).filter(Boolean);
  list.forEach((file, index) => body.append(`files[${index}]`, file));
  if (!list.length) body.append('files[0]', '');
};

const buildProductFormData = (details, { update = false } = {}) => {
  const source = details || {};
  const body = new FormData();
  if (update) body.set('_method', 'PUT');

  const stateIds = source.state_ids && source.state_ids.length ? source.state_ids : source.states;
  const countyIds = source.county_ids && source.county_ids.length ? source.county_ids : source.counties || source.County;
  const industryIds = source.industry_id && source.industry_id.length ? source.industry_id : source.industries;
  const minDuration = source.min_time_duration !== undefined ? source.min_time_duration : source.min_duration;
  const maxDuration = source.max_time_duration !== undefined ? source.max_time_duration : source.max_duration;

  body.set('product_title', source.product_title || '');
  body.set('state_ids', csv(stateIds));
  body.set('county_ids', csv(countyIds));
  body.set('industry_ids', csv(industryIds));
  body.set('service_id', resolveServiceId(source.services) || '');
  body.set('min_credit_amount', source.min_credit_amount || 0);
  body.set('max_credit_amount', source.max_credit_amount || 0);
  body.set('min_sales_creditor', source.min_sales_creditor || 0);
  body.set('collatoral', source.colatoral === true || source.colatoral === 'true' || source.collatoral === 1 ? 1 : 0);
  body.set('rating_for_credit', source.credit === true || source.credit === 'true' ? 1 : 0);
  body.set('ratings', JSON.stringify(Array.isArray(source.ratings) ? source.ratings : []));
  body.set('min_time_duration', minDuration || 0);
  body.set('max_time_duration', maxDuration || 0);
  appendFiles(body, source.files);
  return body;
};

export const getProductsList = (page, status, productTitle) => async dispatch => {
  dispatch({ type: CLEAR_ERROR });
  const params = {
    page: page || 1,
    ...(status ? { status } : {}),
    ...(productTitle ? { product_title: productTitle } : {})
  };

  try {
    // The legacy in-browser demo adapter currently parses the URL directly.
    // Real API traffic uses Axios params so encoding and query composition are centralized.
    const response = isDemoMode()
      ? await client.get(`${routes.products}?${new URLSearchParams(params).toString()}`)
      : await client.get(routes.products, { params });
    const payload = normalizePagedCollection(response && response.data, ['products']);
    dispatch({ type: PRODUCTS_LIST, payload });
    dispatch({ type: PAGINATION, payload: payload.meta || {} });
  } catch (error) {
    dispatch({ type: PRODUCTS_LIST, payload: { data: [], meta: {} } });
    dispatch({ type: PAGINATION, payload: {} });
    dispatch({ type: ERROR, payload: getApiErrorMessage(error, 'Unable to load products right now.') });
  }
};

export const addProduct = (details, callback) => async dispatch => {
  dispatch({ type: CLEAR_ERROR });
  try {
    const response = await clientWithForm.post(routes.addProduct, buildProductFormData(details));
    if (response) callback();
  } catch (error) {
    dispatch({ type: ERROR, payload: getApiErrorMessage(error, 'Unable to add product right now.') });
  }
};

export const getProductById = id => async dispatch => {
  dispatch({ type: CLEAR_ERROR });
  try {
    const response = await client.get(`${routes.getProductById}/${encodeURIComponent(id)}`);
    const raw = response && response.data && response.data.data;
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('Product detail response is empty.');

    dispatch({
      type: SINGLE_PRODUCT,
      payload: {
        ...raw,
        product_title: toDisplayText(raw.product_title) || 'Untitled product',
        states: extractDisplayNames(raw.states),
        County: extractDisplayNames(raw.counties),
        // Temporary compatibility for the legacy Edit component. Batch B removes
        // the unnamed redux-form field and this accidental key entirely.
        undefined: extractDisplayNames(raw.industries),
        services: raw.service
          ? [{ value: raw.service.id, label: toDisplayText(raw.service.name) || toDisplayText(raw.service) || 'Service' }]
          : []
      }
    });
  } catch (error) {
    dispatch({ type: ERROR, payload: getApiErrorMessage(error, 'Unable to load product details.') });
  }
};

export const updateProduct = (details, id, callback) => async dispatch => {
  dispatch({ type: CLEAR_ERROR });
  try {
    const response = await clientWithForm.post(
      `${routes.addProduct}/${encodeURIComponent(id)}`,
      buildProductFormData(details, { update: true })
    );
    if (response) callback();
  } catch (error) {
    dispatch({ type: ERROR, payload: getApiErrorMessage(error, 'Unable to edit product right now.') });
  }
};

export const deleteProduct = (id, callback) => async dispatch => {
  dispatch({ type: CLEAR_ERROR });
  try {
    const response = await client.delete(`${routes.addProduct}/${encodeURIComponent(id)}`);
    if (response) callback();
  } catch (error) {
    dispatch({ type: ERROR, payload: getApiErrorMessage(error, 'Unable to delete product right now.') });
  }
};

export const postponeProduct = (id, status, callback) => async dispatch => {
  dispatch({ type: CLEAR_ERROR });
  try {
    const response = await client.put(`${routes.products}/${encodeURIComponent(id)}/status`, { action: status });
    if (response) callback();
  } catch (error) {
    dispatch({ type: ERROR, payload: getApiErrorMessage(error, 'Unable to update product status right now.') });
  }
};
