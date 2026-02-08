import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import Sidebar from './general/Sidebar';
import Header from './general/Header';
import PageTransition from './general/PageTransition';
// import Pagination from './general/Pagination';
const App = ({ children, location }) => {

  useEffect(() => {
    document.body.setAttribute('data-portal', 'investor');
  }, []);

  const routeKey = location ? location.pathname : 'page';

  return (
    <div className="container-full-height ct-container">
      <a className="screen-reader-text skip-link" href="#main-content">
        Skip to content
      </a>
      <Sidebar />
      <main id="main-content" className="main-content main-content--padded" tabIndex="-1">
        <Header />
        <PageTransition routeKey={routeKey}>{children}</PageTransition>
        {/* <Pagination /> */}
      </main>
    </div>
  );
};

export default withRouter(App);
