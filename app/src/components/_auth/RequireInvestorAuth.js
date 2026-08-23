import React, { Component } from 'react';
import { connect } from 'react-redux';
import { clearStoredToken, isTokenExpired, normalizeToken } from '../../_utils/authToken';

export default ChildComponent => {
  class ComposedComponent extends Component {
    componentDidMount() { this.shouldNavigateAway(); }
    componentDidUpdate() { this.shouldNavigateAway(); }

    hasValidSession() {
      const token = normalizeToken(this.props.auth);
      return Boolean(token && !isTokenExpired(token));
    }

    shouldNavigateAway() {
      if (!this.hasValidSession()) {
        clearStoredToken();
        // LegacyElement exposes history.replace but intentionally does not
        // expose history.location. Protected HOCs are never mounted on the
        // public login route, so an unconditional replace is both safe and
        // compatible with the React Router v6 adapter.
        this.props.history.replace('/login');
      }
    }

    render() {
      // Never flash the protected workspace while the router is redirecting an
      // invalid or cleared session back to the sign-in screen.
      if (!this.hasValidSession()) return null;
      return <ChildComponent {...this.props} />;
    }
  }

  return connect(state => ({ auth: state.auth.authenticated }))(ComposedComponent);
};
