import { PAGINATION } from '../actions/types';

export default function (state = { totalPage: 1, currentPage: 1 }, action) {
  switch (action.type) {
    case PAGINATION: {
      const payload = action.payload && typeof action.payload === 'object' ? action.payload : {};
      const totalPage = Number(payload.last_page || payload.total_pages || payload.totalPage);
      const currentPage = Number(payload.current_page || payload.currentPage);

      return {
        ...state,
        totalPage: Number.isFinite(totalPage) && totalPage > 0 ? totalPage : 1,
        currentPage: Number.isFinite(currentPage) && currentPage > 0 ? currentPage : 1
      };
    }
    default:
      return state;
  }
}
