import client from './index';
import clientWithForm from './formDataRequest';
import { routes } from './../_api/routes';
import {
  PRODUCTS_LIST_ERROR,
  PRODUCTS_LIST,
  ERROR,
  SINGLE_PRODUCT
} from './types';

export const getProductsList = () => async dispatch => {
  try {
    const response = await client.get(routes.products);
    console.log('axn', response.data.data);
    dispatch({
      type: PRODUCTS_LIST,
      payload: response.data
    });
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
    body.set('product_details', details.product_details);
    body.set('category_id', details.category_id.value);
    body.set('min_credit_amount', details.min_credit_amount);
    body.set('amount', details.amount);
    body.set('interest_rate', details.interest_rate);
    body.set('valid_from', '12.12.2019');
    body.set('valid_until', '12.12.2222');
    body.set('interested_domain', 'Health');
    body.set('region_of_interest', 'IT');
    body.set('tags', details.tags[0]);
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
