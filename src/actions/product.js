import client from './index'
import {routes} from './../_api/routes'
import {PRODUCTS_LIST_ERROR, PRODUCTS_LIST} from "./types";

export const getProductList = () => async dispatch => {
    try {
        const response = await client.get(routes.products);
        dispatch({
            type: PRODUCTS_LIST,
            payload: response.data.data
        });
    } catch (e) {
        dispatch({
            type: PRODUCTS_LIST_ERROR,
            payload: `${e}.`
        });
    }
};