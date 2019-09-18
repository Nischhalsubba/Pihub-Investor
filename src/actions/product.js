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

export const getProductsList = (page, status, product_title) => async dispatch => {
  try {
    let response;
    if (status && product_title) {
      response = await client.get(`${routes.products}?page=${page}&status=${status}&product_title=${product_title}`);

    } else if (status) {
      response = await client.get(`${routes.products}?page=${page}&status=${status}`);
    } else if (product_title) {
      response = await client.get(`${routes.products}?page=${page}&product_title=${product_title}`);

    } else {
      response = await client.get(`${routes.products}?page=${page}`);
    }

    dispatch({
      type: PRODUCTS_LIST,
      payload: response.data
    });
    dispatch({
      type: PAGINATION,
      payload: response.data.meta
    })
  } catch (e) {
    console.log(e)
    dispatch({
      type: ERROR,
      payload: e.response.data.message
    });
  }
};

export const addProduct = (details, callback) => async dispatch => {
  // Once the data needed are finalized,need to refactor those codes below //
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
    body.set('min_sales_creditor', details.min_sales_creditor)
    details.files.map((file, index) => {
      body.append(`files[${index}]`, file)
    })
    if (details.colatoral === 'true') {
      body.set('collatoral', 1)
    } else {
      body.set('collatoral', 0);
    }
    if (details.credit === 'true') {
      body.set('rating_for_credit', 1)
    } else {
      body.set('rating_for_credit', 0)

    }
    body.set('ratings', details.ratings);
    body.set('min_time_duration', details.min_duration);
    body.set('max_time_duration', details.max_duration);
    // body.append('files[0]', details.files[0]);
    const response = await clientWithForm.post(routes.addProduct, body);
    if (response) {
      callback();
    }
  } catch (e) {
    if (e.response.data.message) {
      dispatch({
        type: ERROR,
        payload: e.response.data.message
      });
    } else {
      dispatch({
        type: ERROR,
        payload: 'Unable to add product now'
      });
    }
  }
};

export const getProductById = id => async dispatch => {
  try {
    const response = await client.get(`${routes.getProductById}/${id}`);
    console.log('foredit', response.data.data)
    // console.log(extractNames(response.data.data.states))
    var detail = response.data.data;
    detail.states = extractNames(response.data.data.states)
    detail.County = extractNames(response.data.data.counties);
    detail.undefined = extractNames(response.data.data.industries);
    detail.services = [{ value: response.data.data.service.id, label: response.data.data.service.name }]

    dispatch({
      type: SINGLE_PRODUCT,
      payload: response.data.data
    });
  } catch (e) {
    dispatch({
      type: ERROR,
      payload: e.response.data.errors
    });
  }
};


export const updateProduct = (details, id, callback) => async dispatch => {
  try {
    var body = new FormData();
    body.set('_method', 'PUT')
    body.set('product_title', details.product_title);
    body.set('state_ids', details.state_ids.toString());
    body.set('county_ids', details.county_ids.toString());
    body.append('industry_ids', details.industry_id.toString());
    body.set('service_id', details.services.value);
    body.set('time_duration', details.time_duration);
    body.set('min_credit_amount', details.min_credit_amount);
    body.set('max_credit_amount', details.max_credit_amount);
    body.set('min_sales_creditor', details.min_sales_creditor)
    if (details.colatoral === 'true') {
      body.set('collatoral', 1)
    } else {
      body.set('collatoral', 0);
    }
    if (details.credit === 'true') {
      body.set('rating_for_credit', 1)
    } else {
      body.set('rating_for_credit', 0)

    }
    body.set('ratings', details.ratings);
    body.append('files[0]', details.files[0]);
    const response = await clientWithForm.post(`${routes.addProduct}/${id}`, body);
    if (response) {
      callback();
    }
  } catch (e) {
    if (e.response.data.message) {
      dispatch({
        type: ERROR,
        payload: e.response.data.message
      });
    } else {
      dispatch({
        type: ERROR,
        payload: 'Unable to edit product now'
      });
    }
  }
}


export const deleteProduct = (id, callback) => async dispatch => {
  try {
    const response = await client.delete(`${routes.addProduct}/${id}`);
    if (response) {
      console.log(response.data);
      callback();
    }
  } catch (e) {
    console.log('error on delete', e)
  }
}


export const postponeProduct = (id, status, callback) => async dispatch => {
  try {
    const response = await client.put(`${routes.products}/${id}/status`, { action: status });
    if (response) {
      callback();
    }
  } catch (e) { }
}