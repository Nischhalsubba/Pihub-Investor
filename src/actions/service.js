import client from './index';
import { routes } from './../_api/routes';
import { GET_SERVICE } from './types';
import { splitService } from '../_utils/misc'

export const getServiceList = () => async dispatch => {
  try {
    const response = await client.get(routes.getService);
    const service = splitService(response.data.data);
    dispatch({
      type: GET_SERVICE,
      payload: service
    })
  } catch (e) {
    console.log(e)
  }
}