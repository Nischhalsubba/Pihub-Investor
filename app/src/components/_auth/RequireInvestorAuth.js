import React, { Component } from 'react';
import { connect } from 'react-redux';
import { clearStoredToken, isTokenExpired, normalizeToken } from '../../_utils/authToken';

export default ChildComponent => {
  class ComposedComponent extends Component {
    componentDidMount() { this.shouldNavigateAway(); }
    componentDidUpdate() { this.shouldNavigateAway(); }

    shouldNavigateAway() {
      const token = normalizeToken(this.props.auth);
      if (!token || isTokenExpired(token)) {
        clearStoredToken();
        this.props.history.replace('/login');
      }
    }

    render() { return <ChildComponent {...this.props} />; }
  }

  return connect(state => ({ auth: state.auth.authenticated }))(ComposedComponent);
};
