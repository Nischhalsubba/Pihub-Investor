import { PAGINATION } from '../actions/types';

export default function (state = { totalPage: 1, curretPage: 1 }, action) {
  switch (action.type) {
    case PAGINATION:
      return { ...state, totalPage: action.payload.last_page, currentPage: action.payload.current_page };

    default:
      return state;
  }
}
