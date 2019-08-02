import React, { Component } from 'react';
import Sidebar from './components/general/Sidebar';
import Header from './components/general/Header';
class App extends Component {
  render() {
    return (
      <div class="container-full-height ct-container">
        <Sidebar />
        <div class="main-content main-content--padded">
          <Header />
          {this.props.children}
        </div>
      </div>
    );
  }
}
export default App;
