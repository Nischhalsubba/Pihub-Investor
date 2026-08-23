import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AUTH_USER } from '../../actions/types';
import { clearStoredToken, getStoredToken, isTokenExpired, normalizeToken } from '../../_utils/authToken';

export default ChildComponent => {
  class ComposedComponent extends Component {
    componentDidMount() { this.shouldNavigateAway(); }
    componentDidUpdate() { this.shouldNavigateAway(); }

    hasValidStoredSession() {
      const storedToken = getStoredToken();
      return Boolean(storedToken && !isTokenExpired(storedToken));
    }

    shouldNavigateAway() {
      const reduxToken = normalizeToken(this.props.auth);
      const storedToken = getStoredToken();

      if (!storedToken || isTokenExpired(storedToken)) {
        clearStoredToken();
        if (reduxToken) this.props.clearAuth();
        return;
      }

      if (reduxToken && reduxToken === storedToken) {
        this.props.history.replace('/dashboard');
      }
    }

    render() {
      // Do not flash the login form when a valid authenticated session exists.
      if (this.hasValidStoredSession() && normalizeToken(this.props.auth)) return null;
      return <ChildComponent {...this.props} />;
    }
  }

  return connect(
    state => ({ auth: state.auth.authenticated }),
    dispatch => ({ clearAuth: () => dispatch({ type: AUTH_USER, payload: undefined }) })
  )(ComposedComponent);
};
