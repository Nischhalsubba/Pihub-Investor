import client from './index';
import { routes } from './../_api/routes';
import { GET_INDUSTRY, GET_INDUSTRY_NAME } from '../actions/types';
import { splitIndustries } from '../_utils/misc';
import en from "../_locale/en";
import de from "../_locale/de";
const Translate = require('react-translate-component');

export const getIndustryList = () => async dispatch => {
  try {
    const response = await client.get(
      `${routes.getIndustryList}`
    );
    console.log('indus', response.data.data);
    var industries = splitIndustries(response.data.data);
    dispatch({
      type: GET_INDUSTRY_NAME,
      payload: industries
    })
    dispatch({
      type: GET_INDUSTRY,
      payload: response.data.data
    });
  } catch (e) {
    console.log(e);
    // dispatch({
    //   type: ERROR,
    //   payload: `${e}.`
    // });
  }
};
