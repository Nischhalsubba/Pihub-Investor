import React, {Component} from 'react';
import {connect} from 'react-redux';

export default ChildComponent => {
    class ComposedComponent extends Component {
        componentDidMount() {
            this.shouldNavigateAway();
        }

        componentDidUpdate() {
            this.shouldNavigateAway();
        }

        shouldNavigateAway() {
            // give false condition
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
