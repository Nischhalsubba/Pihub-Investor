import React, { Component, Fragment } from 'react';
import Subheader from '../general/Subheader';
import Translate from 'react-translate-component';
import * as actions from '../../actions/product';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Pagination from '../general/Pagination';
import { ToEuro } from '../general/CurrencyFormatter';
const Translator = require('react-translate-component');

class ProductsList extends Component {
  state = { status: null, product_title: '' };

  componentDidMount() {
    this.props.getProductsList();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.status !== this.state.status) {
      this.props.getProductsList(this.props.pagination.currentPage, this.state.status);
    }
  }

  getProducts = () => {
    const source = this.props.data;
    if (!source || !source.productsList || !source.productsList.data) return [];
    return source.productsList.data;
  };

  getSummary = products => ({
    visible: products.length,
    approved: products.filter(product => product.status === 'approved').length,
    requested: products.filter(product => product.status === 'requested').length,
    invested: products.filter(product => product.status === 'invested').length
  });

  renderStatus = status => {
    const map = {
      requested: ['badge-warning', 'label.requested'],
      approved: ['badge-success', 'label.approved'],
      rejected: ['badge-danger', 'label.rejected'],
      invested: ['badge-success', 'label.invested'],
      open: ['badge-info', 'label.open'],
      postponed: ['badge-secondary', 'label.postponed'],
      deleted: ['badge-light', 'label.deleted'],
      suspended: ['badge-info', 'label.suspended']
    };
    const value = map[status];
    return value ? <span className={`badge ${value[0]}`}><Translate content={value[1]} /></span> : <span className="badge badge-light">{status}</span>;
  };

  renderList = products => {
    if (!products.length) {
      return <tr><td colSpan="8"><div className="opportunity-empty"><strong>No matching opportunities</strong><span><Translate content="label.youdonot" /></span></div></td></tr>;
    }

    return products.map(product => (
      <tr key={product.id}>
        <td>
          <Link to={{ pathname: '/product', state: { id: product.id } }}>{product.product_title}</Link>
          <small className="table-secondary-line">Opportunity #{product.id}</small>
        </td>
        <td>{product.service && product.service.name ? product.service.name[Translator.getLocale()] : <Translate content="placeholder.notAvailable" />}</td>
        <td>
          <div className="industry-stack">
            {(product.industries || []).slice(0, 2).map((industry, index) => (
              <span key={`${product.id}-industry-${index}`}>{industry.name ? industry.name[Translator.getLocale()] : <Translate content="placeholder.notAvailable" />}</span>
            ))}
          </div>
        </td>
        <td>{product.min_time_duration} <Translate content="label.months" /></td>
        <td>{product.max_time_duration} <Translate content="label.months" /></td>
        <td><strong className="money-value"><ToEuro amount={product.min_credit_amount} /></strong></td>
        <td><strong className="money-value"><ToEuro amount={product.max_credit_amount} /></strong></td>
        <td>{this.renderStatus(product.status)}</td>
      </tr>
    ));
  };

  render() {
    const { totalPage } = this.props.pagination;
    const products = this.getProducts();
    const summary = this.getSummary(products);

    return (
      <Fragment>
        <Subheader heading={<Translate content="label.allproducts" />} buttonLabel={<Translate content="button.addnewproduct" />} link="/add-product" />

        <section className="opportunity-summary" aria-label="Visible opportunity summary" data-motion="summary-cards">
          <div><span>Visible</span><strong>{summary.visible}</strong><small>Current result set</small></div>
          <div><span>Approved</span><strong>{summary.approved}</strong><small>Ready for review</small></div>
          <div><span>Requested</span><strong>{summary.requested}</strong><small>Awaiting decision</small></div>
          <div><span>Invested</span><strong>{summary.invested}</strong><small>Capital allocated</small></div>
        </section>

        <form className="form-inline my-2 my-lg-0" aria-label="Opportunity filters">
          <div className="filter-field">
            <label htmlFor="opportunity-status">Status</label>
            <select id="opportunity-status" className="form-control" onChange={e => this.setState({ status: e.target.value })}>
              <option value="">All statuses</option>
              <option value="approved">Approved</option><option value="invested">Invested</option><option value="requested">Requested</option>
              <option value="suspended">Suspended</option><option value="canceled">Canceled</option><option value="expired">Expired</option>
            </select>
          </div>
          <div className="filter-field">
            <label htmlFor="opportunity-search">Opportunity</label>
            <input id="opportunity-search" className="form-control" placeholder="Search by product name" value={this.state.product_title} onChange={e => this.setState({ product_title: e.target.value })} />
          </div>
          <Translate content="button.search" component="button" className="btn btn-primary" onClick={e => {
            e.preventDefault();
            this.props.getProductsList(this.props.pagination.currentPage, this.state.status, this.state.product_title);
          }} />
        </form>

        <div className="content-body" data-motion="opportunity-table">
          <div className="table-caption"><div><span>Opportunity register</span><strong>{summary.visible} visible records</strong></div><small>Amounts shown in EUR</small></div>
          <table className="table tablesaw-stack" data-tablesaw-mode="swipe" data-tablesaw-minimap="data-tablesaw-minimap">
            <thead><tr>
              <th><Translate content="column.name" /></th><th><Translate content="label.service" /></th><th><Translate content="label.industries" /></th>
              <th><Translate content="column.minduration" /></th><th><Translate content="column.maxduration" /></th>
              <th><Translate content="column.minimum_credit_amount" /></th><th><Translate content="column.minimum_balance" /></th><th><Translate content="column.status" /></th>
            </tr></thead>
            <tbody>{this.renderList(products)}</tbody>
          </table>
          <Pagination totalPage={totalPage} url={page => this.props.getProductsList(page)} />
        </div>
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return { data: state.productsList, pagination: state.pagination };
}

export default connect(mapStateToProps, actions)(ProductsList);
