import React, { Component } from 'react';
import Sidebar from './general/Sidebar';
import Header from './general/Header';
// import Pagination from './general/Pagination';
class App extends Component {
  render() {
    return (
      <div className="container-full-height ct-container">
        <Sidebar />
        <div className="main-content main-content--padded">
          <Header />
          {this.props.children}
          {/* <Pagination /> */}
        </div>
      </div>
    );
  }
}
export default App;
