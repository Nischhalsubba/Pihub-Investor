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
        localStorage.removeItem('token');
        this.props.history.replace('/login');
        return;
      }

      if (isTokenExpired(token)) {
        localStorage.removeItem('token');
        this.props.history.replace('/login');
      }
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
