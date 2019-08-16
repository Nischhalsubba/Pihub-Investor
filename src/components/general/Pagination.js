import React from 'react';

export default props => {
  return (
    <div className="content-footer">
      <nav className="nav-content">
        <ul className="pagination">
          <li className="page-item">
            <a className="page-link" href="">
              <i className="bx bx-chevron-left" />
            </a>
          </li>
          <li className="page-item active">
            <a className="page-link" href="">
              1
            </a>
          </li>
          <li className="page-item">
            <a className="page-link" href="">
              2
            </a>
          </li>
          <li className="page-item">
            <a className="page-link" href="">
              3
            </a>
          </li>
          <li className="page-item">
            <a className="page-link" href="">
              <i className="bx bx-chevron-right" />
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};
