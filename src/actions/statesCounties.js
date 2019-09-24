import client from './index';
import { routes } from './../_api/routes';
import { GET_ALL_STATES, GET_ALL_STATES_WITH_ID, GET_COUNTIES, GET_COUNTIES_NAME } from '../actions/types';
import { extractNames, extractIdCounty, renameKeys } from '../_utils/misc';
export const getCounties = (arr) => async dispatch => {
  // let arr = [1, 2];
  // let r = id => {
  //   return [client.get(`${routes.getStateCounties}/${id}/counties`)];
  // }
  try {
    var allCounties = [];
    var singleCounty = [];
    await client.all(arr.map(async (a, index) => {
      singleCounty[index] = await client.get(`${routes.getStateCounties}/${a}/counties`);
    }));
    singleCounty.map((data, index) => {
      return data.data.data.map(city => {
        allCounties.push(city)
      })
    });
    dispatch({
      type: GET_COUNTIES,
      payload: allCounties
    })
    console.log(allCounties)
    console.log(extractNames(allCounties));
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
    console.log('j', renameKeys({ name: 'label' }, response.data.data))
    dispatch({
      type: GET_ALL_STATES_WITH_ID,
      payload: response.data.data
    })
    dispatch({
      type: GET_ALL_STATES,
      payload: extractNames(response.data.data)
    })
  } catch (e) { }
}