import { CREDIT_REQUESTS_LIST } from '../actions/types';

export default function(state = null, action) {
  switch (action.type) {
    case CREDIT_REQUESTS_LIST:
      return { ...state, creditRequests: action.payload };
    default:
      return state;
  }
}
