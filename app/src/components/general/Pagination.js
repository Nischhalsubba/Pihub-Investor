import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getProductsList } from '../../actions/product';
class Pagination extends Component {
  state = { currentPage: 1 }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.currentPage !== prevState.currentPage) {
      this.props.url(this.state.currentPage)
    }
  }
  render() {
    const { totalPage } = this.props;
    const { currentPage } = this.state;
    return (
      <div className="content-footer">
        <nav className="nav-content">
          <ul className="pagination">
            <li className="page-item">
              <button className="page-link" onClick={() => {
                if (currentPage > 1)
                  this.setState({ currentPage: currentPage - 1 })
              }}>
                <i className="bx bx-chevron-left" />
              </button>
            </li>
            <li className={currentPage === 1 ? `page-item active` : 'page-item'}>
              <button className="page-link" onClick={() => this.setState({ currentPage: 1 })}>
                1
                </button>
            </li>
            {totalPage > 1 ? <li className={currentPage === 2 ? `page-item active` : 'page-item'}>
              <button className="page-link" onClick={() => this.setState({ currentPage: 2 })}>
                2
                </button>
            </li> : null}

            {totalPage > 2 ? <li className={currentPage === 3 ? `page-item active` : 'page-item'}>
              <button className="page-link" onClick={() => this.setState({ currentPage: 3 })}>
                3
                </button>
            </li> : null}

            {totalPage > 3 ? <li className="page-item">
              <button className="page-link" >
                <i className="bx bx-chevron-right" />
              </button>
            </li> : null}

          </ul>
        </nav>
      </div>
    );

  }
}

export default connect(null, { getProductsList })(Pagination);