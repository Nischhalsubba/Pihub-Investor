
import { CHANGE_LANGUAGE } from './types';

export const changeLanguage = language => async dispatch=>{
    localStorage.setItem('language', language);
    dispatch({
        type: CHANGE_LANGUAGE,
        payload:language
    });
};