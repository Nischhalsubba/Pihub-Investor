import React, { Component, Fragment } from 'react';
import Subheader from '../general/Subheader';
import Translate from 'react-translate-component';
import * as actions from '../../actions/product';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Pagination from '../general/Pagination';
import { downloadCsv } from '../../_utils/exportCsv';
import { getTableDensity, setTableDensity } from '../../_utils/workspacePreferences';
import { openContextDrawer, showToast } from '../../_utils/workspaceEvents';

const Translator = require('react-translate-component');
const VIEW_KEY = 'pihub-opportunity-saved-views-v2';
const LEGACY_VIEW_KEY = 'pihub-opportunity-saved-views-v1';
const COLUMN_KEY = 'pihub-opportunity-columns-v1';

const statusOptions = [
  { value: '', label: null },
  { value: 'approved', label: 'label.approved' },
  { value: 'requested', label: 'label.requested' },
  { value: 'invested', label: 'label.invested' },
  { value: 'suspended', label: 'label.suspended' }
];

const columns = [
  { key: 'facility', label: 'Facility' },
  { key: 'industry', label: 'Industry' },
  { key: 'tenor', label: 'Tenor' },
  { key: 'credit', label: 'Credit' },
  { key: 'status', label: 'Status' }
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
  return new Intl.NumberFormat(Translator.getLocale() === 'de' ? 'de-DE' : 'en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);
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

const safePage = value => {
  const page = Number(value);
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
};

const readJson = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
};

const getSavedViews = () => {
  const current = readJson(VIEW_KEY, null);
  if (Array.isArray(current)) return current;
  const legacy = readJson(LEGACY_VIEW_KEY, []);
  return Array.isArray(legacy) ? legacy : [];
};

class ProductsList extends Component {
  constructor(props) {
    super(props);
    const view = this.readView(props.location);
    const storedColumns = readJson(COLUMN_KEY, columns.map(column => column.key));
    this.state = {
      status: view.status,
      product_title: view.product_title,
      selectedId: null,
      savedViewName: '',
      visibleColumns: Array.isArray(storedColumns) && storedColumns.length ? storedColumns : columns.map(column => column.key),
      density: getTableDensity('opportunities'),
      compareIds: []
    };
  }

  componentDidMount() { this.loadView(this.readView()); }

  componentDidUpdate(prevProps) {
    if (prevProps.location.search !== this.props.location.search) {
      const view = this.readView();
      if (view.status !== this.state.status || view.product_title !== this.state.product_title) this.setState({ status: view.status, product_title: view.product_title });
      this.loadView(view);
    }
    if (prevProps.data !== this.props.data) {
      const products = this.getProducts();
      if (products.length && !products.some(product => String(product.id) === String(this.state.selectedId))) this.setState({ selectedId: products[0].id });
      if (!products.length && this.state.selectedId !== null) this.setState({ selectedId: null });
      this.setState(prev => ({ compareIds: prev.compareIds.filter(id => products.some(product => String(product.id) === String(id))) }));
    }
  }

  readView = (location = this.props.location) => {
    const params = new URLSearchParams(location && location.search ? location.search : '');
    const status = params.get('status') || '';
    const allowedStatus = statusOptions.some(option => option.value === status) ? status : '';
    const sort = ['title', 'facility', 'industry', 'tenor', 'credit', 'status'].includes(params.get('sort')) ? params.get('sort') : 'title';
    return { status: allowedStatus, product_title: params.get('q') || '', page: safePage(params.get('page')), sort, dir: params.get('dir') === 'desc' ? 'desc' : 'asc' };
  };

  loadView = view => this.props.getProductsList(view.page, view.status, view.product_title.trim());

  writeView = patch => {
    const next = { ...this.readView(), ...patch };
    const params = new URLSearchParams();
    if (next.status) params.set('status', next.status);
    if (next.product_title && next.product_title.trim()) params.set('q', next.product_title.trim());
    if (safePage(next.page) > 1) params.set('page', String(safePage(next.page)));
    if (next.sort && next.sort !== 'title') params.set('sort', next.sort);
    if (next.dir === 'desc') params.set('dir', 'desc');
    this.props.history.push({ pathname: '/products', search: params.toString() ? `?${params.toString()}` : '' });
  };

  getProducts = () => {
    const source = this.props.data;
    if (!source || !source.productsList || !Array.isArray(source.productsList.data)) return [];
    return source.productsList.data.filter(product => product && typeof product === 'object');
  };

  getIndustries = product => {
    const industries = Array.isArray(product && product.industries) ? product.industries.filter(Boolean) : [];
    return industries.map(industry => localizedText(industry && industry.name !== undefined ? industry.name : industry)).filter(Boolean);
  };

  getService = product => product && product.service ? localizedText(product.service.name !== undefined ? product.service.name : product.service) : '';

  sortValue = (product, key) => {
    if (key === 'title') return localizedText(product.product_title).toLowerCase();
    if (key === 'facility') return this.getService(product).toLowerCase();
    if (key === 'industry') return (this.getIndustries(product)[0] || '').toLowerCase();
    if (key === 'tenor') return Number(product.max_time_duration) || 0;
    if (key === 'credit') return Number(product.max_credit_amount) || 0;
    if (key === 'status') return String(product.status || '');
    return '';
  };

  getSortedProducts = () => {
    const { sort, dir } = this.readView();
    const direction = dir === 'desc' ? -1 : 1;
    return this.getProducts().slice().sort((a, b) => {
      const av = this.sortValue(a, sort);
      const bv = this.sortValue(b, sort);
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * direction;
      return String(av).localeCompare(String(bv)) * direction;
    });
  };

  getSummary = products => ({ visible: products.length, approved: products.filter(product => product.status === 'approved').length, requested: products.filter(product => product.status === 'requested').length, invested: products.filter(product => product.status === 'invested').length });
  handleSearch = event => { event.preventDefault(); this.writeView({ product_title: this.state.product_title, page: 1 }); };
  toggleSort = key => { const view = this.readView(); this.writeView({ sort: key, dir: view.sort === key && view.dir === 'asc' ? 'desc' : 'asc', page: 1 }); };

  toggleColumn = key => {
    this.setState(prev => {
      const present = prev.visibleColumns.includes(key);
      const next = present ? prev.visibleColumns.filter(item => item !== key) : [...prev.visibleColumns, key];
      if (!next.length) return null;
      localStorage.setItem(COLUMN_KEY, JSON.stringify(next));
      return { visibleColumns: next };
    });
  };

  setDensity = density => {
    const next = setTableDensity('opportunities', density);
    this.setState({ density: next });
  };

  saveView = event => {
    event.preventDefault();
    const name = this.state.savedViewName.trim();
    if (!name) return;
    const views = getSavedViews();
    const payload = { name, view: this.readView(), visibleColumns: this.state.visibleColumns, density: this.state.density };
    const next = [...views.filter(item => item && item.name !== name), payload].slice(-12);
    localStorage.setItem(VIEW_KEY, JSON.stringify(next));
    this.setState({ savedViewName: '' });
    showToast(`Saved view “${name}” is ready.`, { type: 'success', title: 'View saved' });
  };

  loadSavedView = event => {
    const name = event.target.value;
    if (!name) return;
    const item = getSavedViews().find(saved => saved && saved.name === name);
    if (item) {
      const visibleColumns = Array.isArray(item.visibleColumns) && item.visibleColumns.length ? item.visibleColumns : this.state.visibleColumns;
      const density = item.density === 'compact' ? 'compact' : 'comfortable';
      localStorage.setItem(COLUMN_KEY, JSON.stringify(visibleColumns));
      setTableDensity('opportunities', density);
      this.setState({ visibleColumns, density });
      this.writeView({ ...item.view, page: 1 });
      showToast(`Loaded “${name}”.`, { type: 'info', title: 'Saved view' });
    }
    event.target.value = '';
  };

  exportVisible = products => downloadCsv('pihub-opportunities.csv', [['Opportunity', 'Facility', 'Industry', 'Min tenor', 'Max tenor', 'Min credit', 'Max credit', 'Status'], ...products.map(product => [localizedText(product.product_title), this.getService(product), this.getIndustries(product).join(' | '), product.min_time_duration, product.max_time_duration, product.min_credit_amount, product.max_credit_amount, statusLabel(product.status)])]);
  selectProduct = product => this.setState({ selectedId: product.id });
  isColumnVisible = key => this.state.visibleColumns.includes(key);

  toggleCompare = product => {
    const id = String(product.id);
    this.setState(prev => {
      if (prev.compareIds.includes(id)) return { compareIds: prev.compareIds.filter(item => item !== id) };
      if (prev.compareIds.length >= 4) {
        showToast('Compare mode supports up to four opportunities at once.', { type: 'info', title: 'Comparison limit' });
        return null;
      }
      return { compareIds: [...prev.compareIds, id] };
    });
  };

  openCompare = () => {
    if (this.state.compareIds.length < 2) return;
    this.props.history.push(`/opportunities/compare?ids=${this.state.compareIds.map(encodeURIComponent).join(',')}`);
  };

  buildActivity = product => {
    const label = statusLabel(product.status);
    return [
      { label: `${label} status`, meta: 'Current workflow state' },
      { label: 'Screening facts available', meta: `${(product.ratings || []).length} rating${(product.ratings || []).length === 1 ? '' : 's'} · ${(product.documents || []).length} document${(product.documents || []).length === 1 ? '' : 's'}` },
      { label: 'Opportunity registered', meta: product.product_code || String(product.id) }
    ];
  };

  openQuickView = product => {
    const collateral = product.collatoral !== undefined ? product.collatoral : product.collateral;
    openContextDrawer({
      kicker: 'Opportunity quick view',
      title: localizedText(product.product_title) || 'Untitled opportunity',
      subtitle: `${this.getService(product) || 'Facility'} · ${this.getIndustries(product).join(', ') || 'Industry not supplied'}`,
      status: product.status,
      facts: [
        { label: 'Credit range', value: `${formatEuro(product.min_credit_amount)}–${formatEuro(product.max_credit_amount)}` },
        { label: 'Tenor', value: `${toDisplayText(product.min_time_duration) || '—'}–${toDisplayText(product.max_time_duration) || '—'} months` },
        { label: 'Minimum creditor sales', value: formatEuro(product.min_sales_creditor) },
        { label: 'Collateral', value: collateral === 1 || collateral === true ? 'Required' : collateral === 0 || collateral === false ? 'Not required' : '—' },
        { label: 'States covered', value: Array.isArray(product.states) ? product.states.length : '—' }
      ],
      activity: this.buildActivity(product),
      href: `/opportunities/${encodeURIComponent(product.id)}`,
      hrefLabel: 'Open full opportunity'
    });
  };

  handleRowKeyDown = (event, product, index) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.selectProduct(product);
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const rows = Array.from(event.currentTarget.parentElement.querySelectorAll('.ap-ledger-row'));
      const nextIndex = event.key === 'ArrowDown' ? Math.min(rows.length - 1, index + 1) : Math.max(0, index - 1);
      if (rows[nextIndex]) rows[nextIndex].focus();
    }
  };

  renderSortHeader = (key, label) => {
    const view = this.readView();
    const active = view.sort === key;
    return <button type="button" className={active ? 'table-sort is-active' : 'table-sort'} onClick={() => this.toggleSort(key)} aria-label={`Sort by ${label}${active ? `, currently ${view.dir}ending` : ''}`}>{label}<span aria-hidden="true">{active ? (view.dir === 'asc' ? '↑' : '↓') : '↕'}</span></button>;
  };

  renderLedgerRows = products => {
    if (!products.length) return <div className="ap-empty"><strong>No opportunities match this view.</strong><span>Adjust the status or search terms and try again.</span></div>;
    return products.map((product, index) => {
      const productId = toDisplayText(product.id);
      const title = localizedText(product.product_title) || 'Untitled product';
      const service = this.getService(product) || '—';
      const industries = this.getIndustries(product);
      const selected = String(product.id) === String(this.state.selectedId);
      const compared = this.state.compareIds.includes(String(product.id));
      return <div className={selected ? 'ap-ledger-row is-selected' : 'ap-ledger-row'} role="row" tabIndex="0" aria-selected={selected} key={productId || `product-${index}`} onClick={() => this.selectProduct(product)} onKeyDown={event => this.handleRowKeyDown(event, product, index)}>
        <span className="ap-row-check" role="cell"><input type="checkbox" checked={compared} aria-label={`Select ${title} for comparison`} onClick={event => event.stopPropagation()} onChange={() => this.toggleCompare(product)} /></span>
        <div className="ap-issuer" role="cell"><Link to={`/opportunities/${encodeURIComponent(product.id)}`} onClick={event => event.stopPropagation()}>{title}</Link><small>{product.product_code || productId || '—'}</small></div>
        {this.isColumnVisible('facility') ? <span role="cell">{service}</span> : null}
        {this.isColumnVisible('industry') ? <span className="ap-sector" role="cell">{industries[0] || '—'}{industries.length > 1 ? <small> +{industries.length - 1}</small> : null}</span> : null}
        {this.isColumnVisible('tenor') ? <span className="ap-mono" role="cell">{toDisplayText(product.min_time_duration) || '—'}–{toDisplayText(product.max_time_duration) || '—'}m</span> : null}
        {this.isColumnVisible('credit') ? <span className="ap-mono" role="cell">{formatEuro(product.min_credit_amount)}–{formatEuro(product.max_credit_amount)}</span> : null}
        {this.isColumnVisible('status') ? <span className={`ap-status ap-status-${product.status || 'neutral'}`} role="cell"><i aria-hidden="true" />{statusLabel(product.status)}</span> : null}
        <span role="cell"><button className="ap-quick-view-btn" type="button" onClick={event => { event.stopPropagation(); this.openQuickView(product); }} aria-label={`Quick view ${title}`} title="Quick view"><i className="bx bx-window-open" aria-hidden="true" /></button></span>
      </div>;
    });
  };

  renderInspector = product => {
    if (!product) return <aside className="ap-inspector"><div className="ap-inspector-empty">Select an opportunity to inspect decision context.</div></aside>;
    const collateral = product.collatoral !== undefined ? product.collatoral : product.collateral;
    const ratings = Array.isArray(product.ratings) ? product.ratings : [];
    const documents = Array.isArray(product.documents) ? product.documents : [];
    const states = Array.isArray(product.states) ? product.states : [];
    return <aside className="ap-inspector" aria-label="Opportunity decision context"><div className="ap-inspector-kicker">Decision context</div><h3>{localizedText(product.product_title) || 'Untitled product'}</h3><div className="ap-inspector-section"><h4>Additional screening facts</h4><div className="ap-data-pair"><span>Minimum creditor sales</span><b>{formatEuro(product.min_sales_creditor)}</b></div><div className="ap-data-pair"><span>Collateral</span><b>{collateral === 1 || collateral === true ? 'Required' : collateral === 0 || collateral === false ? 'Not required' : '—'}</b></div><div className="ap-data-pair"><span>Ratings supplied</span><b>{ratings.length}</b></div><div className="ap-data-pair"><span>Documents</span><b>{documents.length}</b></div><div className="ap-data-pair"><span>States covered</span><b>{states.length || '—'}</b></div></div><button className="btn btn-link" type="button" onClick={() => this.openQuickView(product)}>Quick view</button><Link className="ap-inspector-link" to={`/opportunities/${encodeURIComponent(product.id)}`}>Open full opportunity <span aria-hidden="true">↗</span></Link></aside>;
  };

  render() {
    const pagination = this.props.pagination || {};
    const rawTotalPage = Number(pagination.totalPage || pagination.last_page || pagination.total_pages || 1);
    const totalPage = Number.isFinite(rawTotalPage) && rawTotalPage > 0 ? rawTotalPage : 1;
    const products = this.getSortedProducts();
    const summary = this.getSummary(products);
    const selected = products.find(product => String(product.id) === String(this.state.selectedId)) || products[0] || null;
    const allLabel = Translator.getLocale() === 'de' ? 'Alle' : 'All';
    const view = this.readView();
    const savedViews = getSavedViews();
    const activeFilters = (view.status ? 1 : 0) + (view.product_title ? 1 : 0);
    const gridStyle = { '--ledger-columns': `36px minmax(210px,1.6fr) ${this.isColumnVisible('facility') ? 'minmax(120px,1fr) ' : ''}${this.isColumnVisible('industry') ? 'minmax(120px,1fr) ' : ''}${this.isColumnVisible('tenor') ? '100px ' : ''}${this.isColumnVisible('credit') ? 'minmax(150px,1.1fr) ' : ''}${this.isColumnVisible('status') ? '110px ' : ''}42px` };

    return <Fragment>
      <Subheader heading={<Translate content="label.allproducts" />} description="Review opportunities, screening context and capital parameters from one working view." buttonLabel={<Translate content="button.addnewproduct" />} link="/opportunities/new" />
      <section className="ap-capital-tape" aria-label="Opportunity summary" data-motion="metric-grid"><article className="ap-metric"><span className="ap-metric-label"><i />Visible</span><strong>{summary.visible}</strong><small>Current result page</small></article><article className="ap-metric ap-metric-positive"><span className="ap-metric-label"><i />Approved</span><strong>{summary.approved}</strong><small>Decision complete</small></article><article className="ap-metric ap-metric-warning"><span className="ap-metric-label"><i />Requested</span><strong>{summary.requested}</strong><small>Awaiting review</small></article><article className="ap-metric ap-metric-signal"><span className="ap-metric-label"><i />Invested</span><strong>{summary.invested}</strong><small>Capital deployed</small></article></section>

      <div className="data-toolbar" aria-label="Opportunity view tools">
        <form className="ap-query-line" onSubmit={this.handleSearch} aria-label="Opportunity filters"><div className="ap-query-input"><label className="sr-only" htmlFor="opportunity-search">Search opportunities</label><input id="opportunity-search" type="search" placeholder="Search opportunity, facility or sector" value={this.state.product_title} onChange={event => this.setState({ product_title: event.target.value })} /></div><div className="ap-filter-tabs" role="group" aria-label="Filter by status">{statusOptions.map(option => { const active = this.state.status === option.value; return <button key={option.value || 'all'} type="button" className={active ? 'is-active' : ''} aria-pressed={active} onClick={() => this.writeView({ status: option.value, page: 1 })}>{option.label ? <Translate content={option.label} /> : allLabel}</button>; })}</div><button className="ap-search-submit" type="submit">Search</button></form>
        <div className="data-toolbar-actions">
          {activeFilters ? <button type="button" className="btn btn-link" onClick={() => this.writeView({ status: '', product_title: '', page: 1 })}>Clear filters ({activeFilters})</button> : null}
          {this.state.compareIds.length ? <div className="ap-compare-actions"><button type="button" disabled={this.state.compareIds.length < 2} onClick={this.openCompare}>Compare ({this.state.compareIds.length})</button><button type="button" onClick={() => this.setState({ compareIds: [] })} aria-label="Clear comparison selection"><i className="bx bx-x" aria-hidden="true" /></button></div> : null}
          <div className="ap-density-toggle" role="group" aria-label="Table density"><button type="button" aria-pressed={this.state.density === 'comfortable'} onClick={() => this.setDensity('comfortable')}>Comfortable</button><button type="button" aria-pressed={this.state.density === 'compact'} onClick={() => this.setDensity('compact')}>Compact</button></div>
          <button type="button" className="btn btn-secondary" onClick={() => this.exportVisible(products)}>Export CSV</button>
          <details className="data-menu"><summary>Columns</summary><div>{columns.map(column => <label key={column.key}><input type="checkbox" checked={this.isColumnVisible(column.key)} onChange={() => this.toggleColumn(column.key)} /> {column.label}</label>)}</div></details>
          <details className="data-menu"><summary>Saved views</summary><div><select defaultValue="" onChange={this.loadSavedView}><option value="">Load saved view</option>{savedViews.map(item => <option key={item.name} value={item.name}>{item.name}</option>)}</select><form onSubmit={this.saveView}><input aria-label="Saved view name" value={this.state.savedViewName} onChange={event => this.setState({ savedViewName: event.target.value })} placeholder="View name" /><button type="submit">Save current view</button></form></div></details>
        </div>
      </div>

      <div className="ap-board-grid"><section className={`ap-ledger is-density-${this.state.density}`} role="table" aria-label="Opportunity book" data-motion="table-shell" style={gridStyle}><div className="ap-ledger-caption"><div><strong>Opportunity book</strong><span>{summary.visible} records on this page · use ↑/↓ to move between rows</span></div><small>EUR</small></div><div className="ap-ledger-head" role="row"><span role="columnheader"><span className="sr-only">Compare</span></span><span role="columnheader">{this.renderSortHeader('title', 'Opportunity')}</span>{this.isColumnVisible('facility') ? <span role="columnheader">{this.renderSortHeader('facility', 'Facility')}</span> : null}{this.isColumnVisible('industry') ? <span role="columnheader">{this.renderSortHeader('industry', 'Industry')}</span> : null}{this.isColumnVisible('tenor') ? <span role="columnheader">{this.renderSortHeader('tenor', 'Tenor')}</span> : null}{this.isColumnVisible('credit') ? <span role="columnheader">{this.renderSortHeader('credit', 'Credit')}</span> : null}{this.isColumnVisible('status') ? <span role="columnheader">{this.renderSortHeader('status', 'Status')}</span> : null}<span role="columnheader"><span className="sr-only">Quick view</span></span></div><div className="ap-ledger-body">{this.renderLedgerRows(products)}</div><div className="ap-ledger-pagination"><Pagination totalPage={totalPage} currentPage={view.page} url={page => this.writeView({ page })} /></div></section>{this.renderInspector(selected)}</div>
    </Fragment>;
  }
}

function mapStateToProps(state) { return { data: state.productsList, pagination: state.pagination }; }
export default connect(mapStateToProps, actions)(ProductsList);
