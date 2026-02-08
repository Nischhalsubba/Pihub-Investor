import client from './index';
import { routes } from './../_api/routes';
import { GET_ALL_STATES, GET_ALL_STATES_WITH_ID, GET_COUNTIES, GET_COUNTIES_NAME } from '../actions/types';
import { extractNames } from '../_utils/misc';
import en from './../_locale/en';
import de from './../_locale/de';
const Translate = require('react-translate-component');

export const getCounties = (arr) => async dispatch => {
  // let arr = [1, 2];
  // let r = id => {
  //   return [client.get(`${routes.getStateCounties}/${id}/counties`)];
  // }
  try {
    let allCounties = [];
    let singleCounty = [];
    await client.all(arr.map(async (a, index) => {
      singleCounty[index] = await client.get(`${routes.getStateCounties}/${a}/counties`);
    }));
    singleCounty.forEach((data) => {
      data.data.data.forEach(city => {
        allCounties.push(city)
      })
    });
    if(allCounties.length > 0 ) {
      let locale = Translate.getLocale();
      let selectAll = {id: 0, name: en.placeholder.selectAll};
      // not the most elegant way to translate in actions @todo fix translation
      if (locale === 'de') {
        selectAll = {id: 0, name: de.placeholder.selectAll};
      }
      allCounties.unshift(selectAll); //prepend select all option
    }
    dispatch({
      type: GET_COUNTIES,
      payload: allCounties
    });
    let countyList = extractNames(allCounties);
    dispatch({
      type: GET_COUNTIES_NAME,
      payload: countyList
    })
  } catch (e) {
    console.log(e);
  }
};


export const getAllState = () => async dispatch => {
  try {
    const response = await client.get(routes.getStateCounties);
    let locale = Translate.getLocale();
    let selectAll = {id: 0, name: en.placeholder.selectAll};
    // not the most elegant way to translate in actions @todo fix translation
    if (locale === 'de') {
      selectAll = {id: 0, name: de.placeholder.selectAll};
    }
    let geographicalStates = response.data.data;
    geographicalStates.unshift(selectAll); //prepend select all option
    dispatch({
      type: GET_ALL_STATES_WITH_ID,
      payload: geographicalStates
    })
    dispatch({
      type: GET_ALL_STATES,
      payload: extractNames(geographicalStates)
    })
  } catch (e) { }
}
