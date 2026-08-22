import React, { Component } from 'react';

class AppErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Keep the failure visible in browser developer tools while preventing
    // React 16 from unmounting the entire application into a blank page.
    console.error('PiHub render error', error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReturnToLogin = () => {
    localStorage.removeItem('token');
    window.location.assign('/login');
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <main
        role="alert"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px',
          background: '#f5f7fb',
          color: '#14213d'
        }}
      >
        <section style={{ maxWidth: '520px', width: '100%' }}>
          <h1 style={{ marginBottom: '12px' }}>We could not open the investor workspace.</h1>
          <p style={{ lineHeight: 1.6 }}>
            Your sign-in may still be valid. Reload the workspace first. If the problem continues,
            return to sign in and try again.
          </p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-primary" onClick={this.handleReload}>
              Reload workspace
            </button>
            <button type="button" className="btn btn-secondary" onClick={this.handleReturnToLogin}>
              Return to sign in
            </button>
          </div>
        </section>
      </main>
    );
  }
}

export default AppErrorBoundary;
