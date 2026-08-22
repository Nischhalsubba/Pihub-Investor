import React, { Component } from 'react';
import { connect } from 'react-redux';

class Pagination extends Component {
  state = { currentPage: 1 };

  componentDidUpdate(prevProps, prevState) {
    const totalPage = this.getTotalPage();

    if (this.state.currentPage > totalPage) {
      this.setState({ currentPage: totalPage });
      return;
    }

    if (this.state.currentPage !== prevState.currentPage && typeof this.props.url === 'function') {
      this.props.url(this.state.currentPage);
    }
  }

  getTotalPage = () => {
    const parsed = Number(this.props.totalPage);
    return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;
  };

  goTo = page => {
    const totalPage = this.getTotalPage();
    const nextPage = Math.min(totalPage, Math.max(1, Number(page) || 1));
    if (nextPage !== this.state.currentPage) this.setState({ currentPage: nextPage });
  };

  getVisiblePages = () => {
    const totalPage = this.getTotalPage();
    const current = this.state.currentPage;
    if (totalPage <= 5) return Array.from({ length: totalPage }, (_, index) => index + 1);

    const pages = [1, current - 1, current, current + 1, totalPage]
      .filter(page => page >= 1 && page <= totalPage);
    return Array.from(new Set(pages)).sort((a, b) => a - b);
  };

  render() {
    const totalPage = this.getTotalPage();
    const { currentPage } = this.state;
    const pages = this.getVisiblePages();

    return (
      <div className="content-footer">
        <nav className="nav-content" aria-label="Pagination">
          <ul className="pagination">
            <li className={currentPage === 1 ? 'page-item disabled' : 'page-item'}>
              <button type="button" className="page-link" aria-label="Previous page" disabled={currentPage === 1} onClick={() => this.goTo(currentPage - 1)}>
                <i className="bx bx-chevron-left" aria-hidden="true" />
              </button>
            </li>
            {pages.map((page, index) => {
              const previousPage = pages[index - 1];
              const showGap = previousPage && page - previousPage > 1;
              return (
                <React.Fragment key={page}>
                  {showGap ? <li className="page-item disabled" aria-hidden="true"><span className="page-link">…</span></li> : null}
                  <li className={currentPage === page ? 'page-item active' : 'page-item'}>
                    <button type="button" className="page-link" aria-label={`Page ${page}`} aria-current={currentPage === page ? 'page' : undefined} onClick={() => this.goTo(page)}>{page}</button>
                  </li>
                </React.Fragment>
              );
            })}
            <li className={currentPage === totalPage ? 'page-item disabled' : 'page-item'}>
              <button type="button" className="page-link" aria-label="Next page" disabled={currentPage === totalPage} onClick={() => this.goTo(currentPage + 1)}>
                <i className="bx bx-chevron-right" aria-hidden="true" />
              </button>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}

export default connect()(Pagination);
