import { SINGLE_PRODUCT } from '../actions/types';

export default function(state = null, action) {
  switch (action.type) {
    case SINGLE_PRODUCT:
      return { ...state, product: action.payload };
    default:
      return state;
  }
}
