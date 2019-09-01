import client from './index';
import clientWithForm from './formDataRequest';
import { routes } from './../_api/routes';
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
    body.set('state_id', details.states.value);
    body.set('county_ids', details.Country.id);
    body.append('industry_ids', details.industry_id);
    body.set('service_id', details.services.value);
    body.set('time_duration', details.time_duration);
    body.set('min_credit_amount', details.min_credit_amount);
    body.set('max_credit_amount', details.max_credit_amount);
    if (details.credit === 'true') {
      body.set('rating_for_credit', 1)
    } else {
      body.set('rating_for_credit', 0)

    }
    // body.set('rating_for_credit', details.credit === 'true');
    body.set('ratings', details.ratings);
    body.append('files[0]', details.files[0]);
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
    dispatch({
      type: SINGLE_PRODUCT,
      payload: response.data.data
    });
  } catch (e) {
    console.log(e);
  }
};
