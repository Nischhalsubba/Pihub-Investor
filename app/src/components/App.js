import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Sidebar from './general/Sidebar';
import Header from './general/Header';

class App extends Component {
  mainRef = React.createRef();

  componentDidMount() {
    this.signalRouteReady();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
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

  signalRouteReady = () => {
    window.requestAnimationFrame(() => {
      window.dispatchEvent(new CustomEvent('pihub:route-ready'));
    });
  };

  render() {
    return (
      <div className="workspace-shell ct-container">
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <Sidebar />
        <div className="main-content main-content--padded">
          <Header />
          <main id="main-content" className="workspace-main" ref={this.mainRef} tabIndex="-1">
            {this.props.children}
          </main>
        </div>
      </div>
    );
  }
}

export default withRouter(App);
