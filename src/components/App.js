import React, { Component } from 'react';
import Sidebar from './general/Sidebar';
import Header from './general/Header';
// import Pagination from './general/Pagination';
class App extends Component {
  render() {
    return (
      <div className="container-full-height ct-container">
        <a className="screen-reader-text skip-link" href="#main-content">
          Skip to content
        </a>
        <Sidebar />
        <main id="main-content" className="main-content main-content--padded" tabIndex="-1">
          <Header />
          {this.props.children}
          {/* <Pagination /> */}
        </main>
      </div>
    );
  }
}
export default App;
