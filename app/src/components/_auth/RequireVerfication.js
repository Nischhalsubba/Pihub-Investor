import React, { Component } from 'react';
import { connect } from 'react-redux';
import { decodeJwtPayload } from '../../_utils/authToken';

export default ChildComponent => {
  class ComposedComponent extends Component {
    componentDidMount() { this.shouldNavigateAway(); }
    componentDidUpdate() { this.shouldNavigateAway(); }

    shouldNavigateAway() {
      if (!this.props.auth) {
        this.props.history.replace('/login');
        return;
      }
      const payload = decodeJwtPayload(this.props.auth);
      if (payload && Array.isArray(payload.scopes) && payload.scopes[0] === 'unapproved_scope') {
        this.props.history.replace('/account-unverified');
      }
    }

    render() { return <ChildComponent {...this.props} />; }
  }

  return connect(state => ({ auth: state.auth.authenticated }))(ComposedComponent);
};
