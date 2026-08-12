import {USER_DETAIL} from '../actions/types';

export default function (state = '', action) {
    switch (action.type) {
        case USER_DETAIL:
            return {user: action.payload};
        default:
            return state;
    }
}
