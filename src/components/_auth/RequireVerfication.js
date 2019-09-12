import React, { Component } from 'react';
import { connect } from 'react-redux';
import jwt from "jsonwebtoken";

export default ChildComponent => {
  class ComposedComponent extends Component {
    componentDidMount() {
      this.shouldNavigateAway();
    }

    componentDidUpdate() {
      this.shouldNavigateAway();
    }

    // shouldNavigateAway() {
    //     // give false condition
    //     if (!this.props.auth) {
    //         this.props.history.push('/login');
    //     } else {
    //         const {exp} = jwt.decode(this.props.auth);
    //         if ((exp * 1000) < Date.now()) {
    //             this.props.history.push('/login');
    //         }
    //     }
    // }
    shouldNavigateAway() {
      const { scopes } = jwt.decode(this.props.auth);
      if (scopes[0] === 'unapproved_scope') {
        this.props.history.push('/account-unverified');
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
