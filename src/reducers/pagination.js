import { PAGINATION } from '../actions/types';

export default function (state = { totalPage: 1 }, action) {
  switch (action.type) {
    case PAGINATION:
      return { ...state, totalPage: action.payload };

    default:
      return state;
  }
}
