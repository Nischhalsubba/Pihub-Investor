import client from './index';
import clientWithForm from './formDataRequest';
import { routes } from './../_api/routes';
import { PRODUCTS_LIST_ERROR, PRODUCTS_LIST, ERROR } from './types';

export const getProductsList = () => async dispatch => {
  try {
    const response = await client.get(routes.products);
    dispatch({
      type: PRODUCTS_LIST,
      payload: response.data
    });
  } catch (e) {
    dispatch({
      type: PRODUCTS_LIST_ERROR,
      payload: `${e}.`
    });
  }
};

export const addProduct = (details, callback) => async dispatch => {
  try {
    console.log(details);
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
