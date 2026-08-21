import React, { Component, Fragment } from 'react';
import Subheader from '../general/Subheader';
import Translate from 'react-translate-component';
import * as actions from '../../actions/product';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Pagination from '../general/Pagination';
import { ToEuro } from '../general/CurrencyFormatter';

const Translator = require('react-translate-component');

const statusOptions = [
  { value: '', label: null },
  { value: 'approved', label: 'label.approved' },
  { value: 'requested', label: 'label.requested' },
  { value: 'invested', label: 'label.invested' },
  { value: 'suspended', label: 'label.suspended' }
];

class ProductsList extends Component {
  state = { status: '', product_title: '' };

  componentDidMount() {
    this.props.getProductsList();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.status !== this.state.status) {
      this.props.getProductsList(1, this.state.status, this.state.product_title);
    }
  }

  getProducts = () => {
    const source = this.props.data;
    if (!source || !source.productsList || !Array.isArray(source.productsList.data)) return [];
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
    return value
      ? <span className={`badge ${value[0]}`}><Translate content={value[1]} /></span>
      : <span className="badge badge-light">{status || '—'}</span>;
  };

  renderIndustries = product => (
    <div className="industry-stack">
      {(product.industries || []).slice(0, 2).map((industry, index) => (
        <span key={`${product.id}-industry-${index}`}>
          {industry.name ? industry.name[Translator.getLocale()] : <Translate content="placeholder.notAvailable" />}
        </span>
      ))}
      {(product.industries || []).length > 2 ? <small>+{product.industries.length - 2}</small> : null}
    </div>
  );

  renderList = products => {
    if (!products.length) {
      return (
        <tr>
          <td colSpan="6">
            <div className="data-empty">
              <i className="bx bx-search-alt" aria-hidden="true" />
              <strong><Translate content="label.youdonot" /></strong>
              <span>Adjust the status or search filter to review another result set.</span>
            </div>
          </td>
        </tr>
      );
    }

    return products.map(product => (
      <tr key={product.id}>
        <td>
          <Link className="entity-title" to={{ pathname: '/product', state: { id: product.id } }}>
            {product.product_title}
          </Link>
          <small className="entity-meta">#{product.id}</small>
        </td>
        <td>
          {product.service && product.service.name
            ? product.service.name[Translator.getLocale()]
            : <Translate content="placeholder.notAvailable" />}
        </td>
        <td>{this.renderIndustries(product)}</td>
        <td className="data-nowrap">
          <span className="mono-value">{product.min_time_duration}–{product.max_time_duration}</span>{' '}
          <Translate content="label.months" />
        </td>
        <td className="data-nowrap">
          <span className="money-range"><ToEuro amount={product.min_credit_amount} /> <span>–</span> <ToEuro amount={product.max_credit_amount} /></span>
        </td>
        <td>{this.renderStatus(product.status)}</td>
      </tr>
    ));
  };

  handleSearch = event => {
    event.preventDefault();
    this.props.getProductsList(1, this.state.status, this.state.product_title.trim());
  };

  render() {
    const { totalPage } = this.props.pagination;
    const products = this.getProducts();
    const summary = this.getSummary(products);
    const allLabel = Translator.getLocale() === 'de' ? 'Alle' : 'All';

    return (
      <Fragment>
        <Subheader
          heading={<Translate content="label.allproducts" />}
          buttonLabel={<Translate content="button.addnewproduct" />}
          link="/add-product"
        />

        <section className="metric-grid" aria-label="Current result summary" data-motion="metric-grid">
          <article className="metric-card">
            <span className="metric-label">{Translator.getLocale() === 'de' ? 'Sichtbar' : 'Visible'}</span>
            <strong>{summary.visible}</strong>
            <small>{Translator.getLocale() === 'de' ? 'Aktuelle Ergebnisse' : 'Current results'}</small>
          </article>
          <article className="metric-card metric-card-success">
            <span className="metric-label"><Translate content="label.approved" /></span>
            <strong>{summary.approved}</strong>
            <small>{Translator.getLocale() === 'de' ? 'Genehmigt' : 'Approved'}</small>
          </article>
          <article className="metric-card metric-card-warning">
            <span className="metric-label"><Translate content="label.requested" /></span>
            <strong>{summary.requested}</strong>
            <small>{Translator.getLocale() === 'de' ? 'Zur Prüfung' : 'Awaiting review'}</small>
          </article>
          <article className="metric-card metric-card-info">
            <span className="metric-label"><Translate content="label.invested" /></span>
            <strong>{summary.invested}</strong>
            <small>{Translator.getLocale() === 'de' ? 'Investiert' : 'Invested'}</small>
          </article>
        </section>

        <form className="workspace-toolbar" onSubmit={this.handleSearch} aria-label="Opportunity filters">
          <div className="toolbar-search">
            <label className="sr-only" htmlFor="opportunity-search">Search opportunities</label>
            <i className="bx bx-search" aria-hidden="true" />
            <input
              id="opportunity-search"
              className="form-control"
              type="search"
              placeholder={Translator.getLocale() === 'de' ? 'Produkte durchsuchen' : 'Search opportunities'}
              value={this.state.product_title}
              onChange={event => this.setState({ product_title: event.target.value })}
            />
          </div>

          <div className="status-segments" role="group" aria-label="Filter by status">
            {statusOptions.map(option => {
              const isActive = this.state.status === option.value;
              return (
                <button
                  key={option.value || 'all'}
                  type="button"
                  className={isActive ? 'status-segment is-active' : 'status-segment'}
                  aria-pressed={isActive}
                  onClick={() => this.setState({ status: option.value })}
                >
                  {option.label ? <Translate content={option.label} /> : allLabel}
                </button>
              );
            })}
          </div>

          <Translate content="button.search" component="button" type="submit" className="btn btn-primary toolbar-submit" />
        </form>

        <section className="table-shell" data-motion="table-shell" aria-label="Opportunity results">
          <div className="table-caption">
            <div>
              <strong>{Translator.getLocale() === 'de' ? 'Produkte' : 'Opportunities'}</strong>
              <span>{summary.visible} {Translator.getLocale() === 'de' ? 'Ergebnisse auf dieser Seite' : 'results on this page'}</span>
            </div>
            <small>EUR</small>
          </div>
          <div className="table-scroll">
            <table className="table" data-tablesaw-mode="stack">
              <thead>
                <tr>
                  <th><Translate content="column.name" /></th>
                  <th><Translate content="label.service" /></th>
                  <th><Translate content="label.industries" /></th>
                  <th><Translate content="column.duration" /></th>
                  <th>{Translator.getLocale() === 'de' ? 'Kreditspanne' : 'Credit range'}</th>
                  <th><Translate content="column.status" /></th>
                </tr>
              </thead>
              <tbody>{this.renderList(products)}</tbody>
            </table>
          </div>
          <Pagination totalPage={totalPage} url={page => this.props.getProductsList(page, this.state.status, this.state.product_title.trim())} />
        </section>
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return { data: state.productsList, pagination: state.pagination };
}

export default connect(mapStateToProps, actions)(ProductsList);
