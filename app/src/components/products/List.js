import React, { Component, Fragment } from 'react';
import Subheader from '../general/Subheader';
import Translate from 'react-translate-component';
import * as actions from '../../actions/product';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Pagination from '../general/Pagination';

const Translator = require('react-translate-component');

const statusOptions = [
  { value: '', label: null },
  { value: 'approved', label: 'label.approved' },
  { value: 'requested', label: 'label.requested' },
  { value: 'invested', label: 'label.invested' },
  { value: 'suspended', label: 'label.suspended' }
];

const toDisplayText = value => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  return '';
};

const localizedText = value => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (typeof value === 'object') {
    const locale = Translator.getLocale();
    const candidates = [value[locale], value.en, value.de, value.label, value.name, value.title];
    for (let index = 0; index < candidates.length; index += 1) {
      const candidate = candidates[index];
      if (typeof candidate === 'string' || typeof candidate === 'number') return String(candidate);
    }
  }
  return '';
};

const formatEuro = value => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return '—';
  return new Intl.NumberFormat(Translator.getLocale() === 'de' ? 'de-DE' : 'en-IE', {
    style: 'currency', currency: 'EUR', maximumFractionDigits: 0
  }).format(amount);
};

const statusLabel = status => {
  const locale = Translator.getLocale();
  const labels = {
    approved: locale === 'de' ? 'Genehmigt' : 'Approved',
    requested: locale === 'de' ? 'Angefragt' : 'Requested',
    invested: locale === 'de' ? 'Investiert' : 'Invested',
    suspended: locale === 'de' ? 'Ausgesetzt' : 'Suspended',
    rejected: locale === 'de' ? 'Abgelehnt' : 'Rejected',
    open: locale === 'de' ? 'Offen' : 'Open'
  };
  return labels[status] || status || '—';
};

class ProductsList extends Component {
  state = { status: '', product_title: '', selectedId: null };

  componentDidMount() {
    this.props.getProductsList();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.status !== this.state.status) {
      this.props.getProductsList(1, this.state.status, this.state.product_title);
    }

    if (prevProps.data !== this.props.data) {
      const products = this.getProducts();
      if (products.length && !products.some(product => String(product.id) === String(this.state.selectedId))) {
        this.setState({ selectedId: products[0].id });
      }
    }
  }

  getProducts = () => {
    const source = this.props.data;
    if (!source || !source.productsList || !Array.isArray(source.productsList.data)) return [];
    return source.productsList.data.filter(product => product && typeof product === 'object');
  };

  getSummary = products => ({
    visible: products.length,
    approved: products.filter(product => product.status === 'approved').length,
    requested: products.filter(product => product.status === 'requested').length,
    invested: products.filter(product => product.status === 'invested').length
  });

  getIndustries = product => {
    const industries = Array.isArray(product && product.industries) ? product.industries.filter(Boolean) : [];
    return industries.map(industry => localizedText(industry && industry.name !== undefined ? industry.name : industry)).filter(Boolean);
  };

  getService = product => product && product.service
    ? localizedText(product.service.name !== undefined ? product.service.name : product.service)
    : '';

  handleSearch = event => {
    event.preventDefault();
    this.props.getProductsList(1, this.state.status, this.state.product_title.trim());
  };

  selectProduct = product => this.setState({ selectedId: product.id });

  renderLedgerRows = products => {
    if (!products.length) {
      return <div className="ap-empty"><i className="bx bx-search-alt" aria-hidden="true" /><strong>No opportunities match this view.</strong><span>Adjust the status or search terms and try again.</span></div>;
    }

    return products.map((product, index) => {
      const productId = toDisplayText(product.id);
      const title = localizedText(product.product_title) || toDisplayText(product.product_title) || 'Untitled product';
      const service = this.getService(product) || '—';
      const industries = this.getIndustries(product);
      const location = Array.isArray(product.states) && product.states[0] ? localizedText(product.states[0].name || product.states[0]) : '';
      const selected = String(product.id) === String(this.state.selectedId);
      return (
        <div
          className={selected ? 'ap-ledger-row is-selected' : 'ap-ledger-row'}
          role="row"
          tabIndex="0"
          aria-selected={selected}
          key={productId || `product-${index}`}
          onClick={() => this.selectProduct(product)}
          onKeyDown={event => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              this.selectProduct(product);
            }
          }}
        >
          <div className="ap-issuer" role="cell">
            <Link to={{ pathname: '/product', state: { id: product.id } }} onClick={event => event.stopPropagation()}>{title}</Link>
            <small>{product.product_code || productId || '—'}{location ? ` / ${location}` : ''}</small>
          </div>
          <span role="cell">{service}</span>
          <span className="ap-sector" role="cell"><i aria-hidden="true" />{industries[0] || '—'}{industries.length > 1 ? <small> +{industries.length - 1}</small> : null}</span>
          <span className="ap-mono" role="cell">{toDisplayText(product.min_time_duration) || '—'}–{toDisplayText(product.max_time_duration) || '—'}m</span>
          <span className="ap-mono" role="cell">{formatEuro(product.min_credit_amount)}–{formatEuro(product.max_credit_amount)}</span>
          <span className={`ap-status ap-status-${product.status || 'neutral'}`} role="cell"><i aria-hidden="true" />{statusLabel(product.status)}</span>
          <span className="ap-row-arrow" aria-hidden="true">›</span>
        </div>
      );
    });
  };

  renderInspector = product => {
    if (!product) {
      return <aside className="ap-inspector"><div className="ap-inspector-empty">Select an opportunity to inspect its credit parameters.</div></aside>;
    }
    const title = localizedText(product.product_title) || 'Untitled product';
    const industries = this.getIndustries(product);
    const collateral = product.collatoral !== undefined ? product.collatoral : product.collateral;
    const collateralLabel = collateral === 1 || collateral === true ? 'Required' : collateral === 0 || collateral === false ? 'Not required' : '—';

    return (
      <aside className="ap-inspector" aria-label="Opportunity analysis">
        <div className="ap-inspector-kicker">Selected opportunity</div>
        <h3>{title}</h3>
        <div className="ap-inspector-id">{product.product_code || product.id || '—'}</div>
        <div className="ap-inspector-section">
          <h4>Capital parameters</h4>
          <div className="ap-data-pair"><span>Credit band</span><b>{formatEuro(product.min_credit_amount)}–{formatEuro(product.max_credit_amount)}</b></div>
          <div className="ap-data-pair"><span>Tenor</span><b>{toDisplayText(product.min_time_duration) || '—'}–{toDisplayText(product.max_time_duration) || '—'}m</b></div>
          <div className="ap-data-pair"><span>Minimum creditor sales</span><b>{formatEuro(product.min_sales_creditor)}</b></div>
          <div className="ap-data-pair"><span>Collateral</span><b>{collateralLabel}</b></div>
        </div>
        <div className="ap-inspector-section">
          <h4>Classification</h4>
          <div className="ap-data-pair"><span>Facility</span><b>{this.getService(product) || '—'}</b></div>
          <div className="ap-data-pair"><span>Industry</span><b>{industries.join(', ') || '—'}</b></div>
          <div className="ap-data-pair"><span>Status</span><b className={`ap-text-${product.status || 'neutral'}`}>{statusLabel(product.status)}</b></div>
        </div>
        <Link className="ap-inspector-link" to={{ pathname: '/product', state: { id: product.id } }}>Open full opportunity <span aria-hidden="true">↗</span></Link>
      </aside>
    );
  };

  render() {
    const pagination = this.props.pagination || {};
    const totalPage = Number(pagination.totalPage) > 0 ? Number(pagination.totalPage) : 1;
    const products = this.getProducts();
    const summary = this.getSummary(products);
    const selected = products.find(product => String(product.id) === String(this.state.selectedId)) || products[0] || null;
    const allLabel = Translator.getLocale() === 'de' ? 'Alle' : 'All';

    return (
      <Fragment>
        <Subheader heading={<Translate content="label.allproducts" />} buttonLabel={<Translate content="button.addnewproduct" />} link="/add-product" />

        <section className="ap-capital-tape" aria-label="Opportunity summary" data-motion="metric-grid">
          <article className="ap-metric"><span className="ap-metric-label"><i />Visible</span><strong>{summary.visible}</strong><small>Current result set</small></article>
          <article className="ap-metric ap-metric-positive"><span className="ap-metric-label"><i />Approved</span><strong>{summary.approved}</strong><small>Decision complete</small></article>
          <article className="ap-metric ap-metric-warning"><span className="ap-metric-label"><i />Requested</span><strong>{summary.requested}</strong><small>Awaiting review</small></article>
          <article className="ap-metric ap-metric-signal"><span className="ap-metric-label"><i />Invested</span><strong>{summary.invested}</strong><small>Capital deployed</small></article>
        </section>

        <form className="ap-query-line" onSubmit={this.handleSearch} aria-label="Opportunity filters">
          <span className="ap-query-index" aria-hidden="true">QRY</span>
          <div className="ap-query-input"><i className="bx bx-search" aria-hidden="true" /><label className="sr-only" htmlFor="opportunity-search">Search opportunities</label><input id="opportunity-search" type="search" placeholder="Search opportunity, facility or sector" value={this.state.product_title} onChange={event => this.setState({ product_title: event.target.value })} /></div>
          <div className="ap-filter-tabs" role="group" aria-label="Filter by status">
            {statusOptions.map(option => {
              const active = this.state.status === option.value;
              return <button key={option.value || 'all'} type="button" className={active ? 'is-active' : ''} aria-pressed={active} onClick={() => this.setState({ status: option.value })}>{option.label ? <Translate content={option.label} /> : allLabel}</button>;
            })}
          </div>
          <button className="ap-search-submit" type="submit">SEARCH</button>
        </form>

        <div className="ap-board-grid">
          <section className="ap-ledger" role="table" aria-label="Opportunity book" data-motion="table-shell">
            <div className="ap-ledger-caption"><div><strong>Opportunity book</strong><span>{summary.visible} records on this page</span></div><small>EUR</small></div>
            <div className="ap-ledger-head" role="row"><span>Opportunity</span><span>Facility</span><span>Industry</span><span>Tenor</span><span>Credit</span><span>Status</span><span /></div>
            <div className="ap-ledger-body">{this.renderLedgerRows(products)}</div>
            <div className="ap-ledger-pagination"><Pagination totalPage={totalPage} url={page => this.props.getProductsList(page, this.state.status, this.state.product_title.trim())} /></div>
          </section>
          {this.renderInspector(selected)}
        </div>
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return { data: state.productsList, pagination: state.pagination };
}

export default connect(mapStateToProps, actions)(ProductsList);
