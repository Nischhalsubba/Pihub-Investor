import React, { Component } from 'react';
import Sidebar from './components/general/Sidebar';
class App extends Component {
  render() {
    return (
      <div class="container-full-height ct-container">
        <Sidebar />
        {this.props.children}
      </div>
    );
  }
}
export default App;
