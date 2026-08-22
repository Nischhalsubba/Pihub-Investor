import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isTokenExpired, normalizeToken } from '../../_utils/authToken';

export default ChildComponent => {
  class ComposedComponent extends Component {
    componentDidMount() {
      this.shouldNavigateAway();
    }

    componentDidUpdate() {
      this.shouldNavigateAway();
    }

    shouldNavigateAway() {
      const token = normalizeToken(this.props.auth);
      if (!token) {
        return;
      }

      if (isTokenExpired(token)) {
        localStorage.removeItem('token');
        return;
      }

      this.props.history.replace('/');
    }

    render() {
      return <ChildComponent {...this.props} />;
    }
  }

  function mapStateToProps(state) {
    return {
      auth: state.auth.authenticated
    };
  }

  return connect(mapStateToProps)(ComposedComponent);
};
