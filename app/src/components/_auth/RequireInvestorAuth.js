import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AUTH_USER } from '../../actions/types';
import { clearStoredToken, getStoredToken, isTokenExpired, normalizeToken } from '../../_utils/authToken';

export default ChildComponent => {
  class ComposedComponent extends Component {
    componentDidMount() { this.shouldNavigateAway(); }
    componentDidUpdate() { this.shouldNavigateAway(); }

    hasValidSession() {
      const reduxToken = normalizeToken(this.props.auth);
      const storedToken = getStoredToken();
      return Boolean(
        reduxToken &&
        storedToken &&
        reduxToken === storedToken &&
        !isTokenExpired(reduxToken)
      );
    }

    shouldNavigateAway() {
      if (this.hasValidSession()) return;

      clearStoredToken();
      if (normalizeToken(this.props.auth)) this.props.clearAuth();
      this.props.history.replace('/login');
    }

    render() {
      // Never flash the protected workspace while an invalid or cleared browser
      // session is being synchronized back into Redux and redirected.
      if (!this.hasValidSession()) return null;
      return <ChildComponent {...this.props} />;
    }
  }

  return connect(
    state => ({ auth: state.auth.authenticated }),
    dispatch => ({ clearAuth: () => dispatch({ type: AUTH_USER, payload: undefined }) })
  )(ComposedComponent);
};
