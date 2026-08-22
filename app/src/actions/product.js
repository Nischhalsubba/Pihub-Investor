import client from './index';
import clientWithForm from './formDataRequest';
import { routes } from './../_api/routes';
import { extractNames } from '../_utils/misc';
import {
  PRODUCTS_LIST,
  ERROR,
  SINGLE_PRODUCT,
  PAGINATION
} from './types';

const getErrorMessage = (error, fallback) => {
  if (error && error.response && error.response.data) {
    const data = error.response.data;
    if (typeof data.message === 'string') return data.message;
    if (typeof data.error === 'string') return data.error;
    if (typeof data.errors === 'string') return data.errors;
  }
  return fallback;
};

const normalizeProductsPayload = rawData => {
  const root = rawData && typeof rawData === 'object' ? rawData : {};
  let list = [];
  let meta = {};

  if (Array.isArray(rawData)) {
    list = rawData;
  } else if (Array.isArray(root.data)) {
    list = root.data;
    meta = root.meta && typeof root.meta === 'object' ? root.meta : {};
  } else if (root.data && typeof root.data === 'object') {
    if (Array.isArray(root.data.data)) {
      list = root.data.data;
    } else if (Array.isArray(root.data.products)) {
      list = root.data.products;
    }
    meta = root.data.meta && typeof root.data.meta === 'object'
      ? root.data.meta
      : root.meta && typeof root.meta === 'object'
        ? root.meta
        : {};
  } else if (Array.isArray(root.products)) {
    list = root.products;
    meta = root.meta && typeof root.meta === 'object' ? root.meta : {};
  }

  return Object.assign({}, root, { data: list.filter(Boolean), meta });
};

export const getProductsList = (page, status, product_title) => async dispatch => {
  try {
    let response;
    if (status && product_title) {
      response = await client.get(`${routes.products}?page=${page || 1}&status=${status}&product_title=${encodeURIComponent(product_title)}`);
    } else if (status) {
      response = await client.get(`${routes.products}?page=${page || 1}&status=${status}`);
    } else if (product_title) {
      response = await client.get(`${routes.products}?page=${page || 1}&product_title=${encodeURIComponent(product_title)}`);
    } else {
      response = await client.get(`${routes.products}?page=${page || 1}`);
    }

    const payload = normalizeProductsPayload(response ? response.data : null);
    dispatch({
      type: PRODUCTS_LIST,
      payload
    });
    dispatch({
      type: PAGINATION,
      payload: payload.meta || {}
    });
  } catch (e) {
    dispatch({
      type: PRODUCTS_LIST,
      payload: { data: [], meta: {} }
    });
    dispatch({
      type: PAGINATION,
      payload: {}
    });
    dispatch({
      type: ERROR,
      payload: getErrorMessage(e, 'Unable to load products right now.')
    });
  }
};

export const addProduct = (details, callback) => async dispatch => {
  try {
    var body = new FormData();
    body.set('product_title', details.product_title);
    body.set('state_ids', details.state_ids.toString());
    body.set('county_ids', details.county_ids.toString());
    body.append('industry_ids', details.industry_id.toString());
    body.set('service_id', details.services.value);
    body.set('time_duration', details.time_duration);
    body.set('min_credit_amount', details.min_credit_amount);
    body.set('max_credit_amount', details.max_credit_amount);
    body.set('min_sales_creditor', details.min_sales_creditor);
    if(details.files){
      details.files.map((file, index) => {
        body.append(`files[${index}]`, file);
        return file;
      });
    }else{
      body.append('files', null);
    }

    if (details.colatoral === 'true') {
      body.set('collatoral', 1);
    } else {
      body.set('collatoral', 0);
    }
    if (details.credit === 'true') {
      body.set('rating_for_credit', 1);
    } else {
      body.set('rating_for_credit', 0);
    }
    body.set('ratings', JSON.stringify(details.ratings));
    body.set('min_time_duration', details.min_duration);
    body.set('max_time_duration', details.max_duration);

    const response = await clientWithForm.post(routes.addProduct, body);
    if (response) {
      callback();
    }
  } catch (e) {
    dispatch({
      type: ERROR,
      payload: getErrorMessage(e, 'Unable to add product now')
    });
  }
};

export const getProductById = id => async dispatch => {
  try {
    const response = await client.get(`${routes.getProductById}/${id}`);
    let detail = response.data.data;
    detail.states = extractNames(response.data.data.states);
    detail.County = extractNames(response.data.data.counties);
    detail.undefined = extractNames(response.data.data.industries);
    detail.services = [{ value: response.data.data.service.id, label: response.data.data.service.name }];
    dispatch({
      type: SINGLE_PRODUCT,
      payload: response.data.data
    });
  } catch (e) {
    dispatch({
      type: ERROR,
      payload: getErrorMessage(e, 'Unable to load product details.')
    });
  }
};

export const updateProduct = (details, id, callback) => async dispatch => {
  try {
    var body = new FormData();
    body.set('_method', 'PUT');
    body.set('product_title', details.product_title);
    body.set('state_ids', details.state_ids.toString());
    if (details.county_ids.length === 0) {
      var countyId = [];
      details.counties.map(county => {
        countyId.push(county.id);
        return county;
      });
      body.set('county_ids', countyId.toString());
    } else {
      body.set('county_ids', details.county_ids.toString());
    }
    if (details.industry_id.length === 0) {
      var industryId = [];
      details.industries.map(industry => {
        industryId.push(industry.id);
        return industry;
      });
      body.set('industry_ids', industryId.toString());
    } else {
      body.append('industry_ids', details.industry_id.toString());
    }
    if (Array.isArray(details.services)) {
      body.set('service_id', details.services[0].value);
    } else {
      body.set('service_id', details.services.value);
    }
    body.set('min_credit_amount', details.min_credit_amount);
    body.set('max_credit_amount', details.max_credit_amount);
    body.set('min_sales_creditor', details.min_sales_creditor);
    body.set('min_time_duration', details.min_time_duration);
    body.set('max_time_duration', details.max_time_duration);

    if (details.colatoral === 'true') {
      body.set('collatoral', 1);
    } else {
      body.set('collatoral', 0);
    }
    if (details.credit === 'true') {
      body.set('rating_for_credit', 1);
    } else {
      body.set('rating_for_credit', 0);
    }
    body.append('ratings', JSON.stringify(details.ratings));
    if (details.files) {
      details.files.map((file, index) => {
        body.append(`files[${index}]`, file);
        return file;
      });
    } else {
      body.append('files[0]', null);
    }
    const response = await clientWithForm.post(`${routes.addProduct}/${id}`, body);
    if (response) {
      callback();
    }
  } catch (e) {
    dispatch({
      type: ERROR,
      payload: getErrorMessage(e, 'Unable to edit product now')
    });
  }
};

export const deleteProduct = (id, callback) => async dispatch => {
  try {
    const response = await client.delete(`${routes.addProduct}/${id}`);
    if (response) {
      callback();
    }
  } catch (e) {
    dispatch({
      type: ERROR,
      payload: getErrorMessage(e, 'Unable to delete product now')
    });
  }
};

export const postponeProduct = (id, status, callback) => async dispatch => {
  try {
    const response = await client.put(`${routes.products}/${id}/status`, { action: status });
    if (response) {
      callback();
    }
  } catch (e) {
    dispatch({
      type: ERROR,
      payload: getErrorMessage(e, 'Unable to update product status now')
    });
  }
};
