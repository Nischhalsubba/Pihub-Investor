import { CHANGE_LANGUAGE } from '../actions/types';

const initialState = localStorage.getItem('language') || 'de' || navigator.language.split('-')[0]
export default function (state = initialState, action) {
    switch (action.type) {
        case CHANGE_LANGUAGE:
            return action.payload;

        default:
            return state;
    }
}