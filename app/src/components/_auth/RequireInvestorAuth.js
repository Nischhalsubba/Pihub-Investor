import React, {Component} from 'react';
import {connect} from 'react-redux';

function decodeJwtPayload(token) {
    try {
        const payload = token.split('.')[1];
        if (!payload) {
            return null;
        }

        const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
        const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
        const json = decodeURIComponent(
            atob(padded)
                .split('')
                .map(character =>
                    `%${('00' + character.charCodeAt(0).toString(16)).slice(-2)}`
                )
                .join('')
        );

        return JSON.parse(json);
    } catch (error) {
        return null;
    }
}

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
            if (!this.props.auth) {
                this.props.history.push('/login');
            } else {
                const payload = decodeJwtPayload(this.props.auth);
                if (!payload || !payload.exp || (payload.exp * 1000) < Date.now()) {
                    this.props.history.push('/login');
                }
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