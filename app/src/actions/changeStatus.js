import client from './index';
import { routes } from './../_api/routes';
import { CLEAR_ERROR, ERROR } from './types';
import { getApiErrorMessage } from '../_utils/api';

const CREDIT_DECISIONS = new Set(['accepted', 'rejected']);

export const isAllowedCreditDecision = status => CREDIT_DECISIONS.has(status);

const normalizeIdentifier = value => {
  if (value === null || value === undefined) return '';
  return String(value).trim();
};

export const changeStatus = (pId, aId, status, callback) => async dispatch => {
  dispatch({ type: CLEAR_ERROR });

  const productId = normalizeIdentifier(pId);
  const applicationId = normalizeIdentifier(aId);
  if (!productId || !applicationId || !isAllowedCreditDecision(status)) {
    dispatch({
      type: ERROR,
      payload: 'This credit decision could not be submitted because the request is incomplete or invalid.'
    });
    return false;
  }

  try {
    const response = await client.put(
      `${routes.changeStatusOfRequest}/${encodeURIComponent(productId)}/applications/${encodeURIComponent(applicationId)}`,
      { status }
    );
    if (!response) return false;
    if (typeof callback === 'function') callback();
    return true;
  } catch (error) {
    dispatch({
      type: ERROR,
      payload: getApiErrorMessage(error, 'Unable to record this credit decision right now.')
    });
    return false;
  }
};
