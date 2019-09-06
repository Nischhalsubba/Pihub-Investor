import {CHANGE_LANGUAGE} from '../actions/types';

const initialState=  'de' || localStorage.getItem('language') ||navigator.language.split('-')[0]
export default function(state= initialState, action){
    switch (action.type){
        case CHANGE_LANGUAGE:
            return action.payload;

        default:
            return state;    
    }
}