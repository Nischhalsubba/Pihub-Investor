import {PRODUCTS_LIST, PRODUCTS_LIST_ERROR} from '../actions/types';

export default function(state = null, action) {
    switch (action.type) {
        case PRODUCTS_LIST:
            return { ...state, productsList: action.payload };
        case PRODUCTS_LIST_ERROR:
            return {...state, errorMessage: action.payload};
        default:
            return state;
    }
}
