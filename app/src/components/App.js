import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Sidebar from './general/Sidebar';
import Header from './general/Header';
import CommandPalette from './general/CommandPalette';
import { clearError } from '../actions/clearError';

const errorText = value => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.filter(Boolean).join(' ');
  if (typeof value === 'object') return errorText(value.message || value.errors || value.error);
  return String(value);
};

class App extends Component {
  mainRef = React.createRef();

  componentDidMount() {
    window.addEventListener('pihub:session-expired', this.handleSessionExpired);
    this.signalRouteReady();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.props.clearError();
      if (this.mainRef.current) {
        try {
          this.mainRef.current.focus({ preventScroll: true });
        } catch (error) {
          this.mainRef.current.focus();
        }
      }
      this.signalRouteReady();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('pihub:session-expired', this.handleSessionExpired);
  }

  handleSessionExpired = () => {
    this.props.history.replace('/login?reason=session-expired');
  };

  signalRouteReady = () => {
    window.requestAnimationFrame(() => window.dispatchEvent(new CustomEvent('pihub:route-ready')));
  };

  renderGlobalError = () => {
    const message = errorText(this.props.globalError);
    if (!message) return null;
    return (
      <section className="alert alert-danger ap-global-error" role="alert" aria-live="assertive">
        <div>
          <strong>We couldn't complete that request.</strong>
          <span>{message}</span>
        </div>
        <div className="ap-global-error-actions">
          <button className="btn btn-outline-danger" type="button" onClick={() => window.location.reload()}>Retry page</button>
          <button className="btn btn-link" type="button" onClick={this.props.clearError}>Dismiss</button>
        </div>
      </section>
    );
  };

  render() {
    return (
      <div className="workspace-shell ct-container ap-shell">
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <Sidebar />
        <div className="main-content main-content--padded ap-workspace">
          <Header />
          <main id="main-content" className="workspace-main ap-main" ref={this.mainRef} tabIndex="-1">
            {this.renderGlobalError()}
            {this.props.children}
          </main>
        </div>
        <CommandPalette />
      </div>
    );
  }
}

const ConnectedApp = connect(state => ({ globalError: state.errors }), { clearError })(App);
export default withRouter(ConnectedApp);
