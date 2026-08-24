import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions/product';
import Subheader from '../../general/Subheader';
import Translate from '../../../i18n/Translate';
import { downloadCsv } from '../../../_utils/exportCsv';
import { getTableDensity, setTableDensity } from '../../../_utils/workspacePreferences';
import { openContextDrawer, showToast } from '../../../_utils/workspaceEvents';
import { deleteSavedView, exportSavedViews, getDefaultSavedView, importSavedViews, readSavedViewStore, renameSavedView, saveSavedView, savedViewShareUrl, setDefaultSavedView } from '../../../_utils/savedViews';
import { formatEuro, industriesFor, localizedText, opportunityColumns, ownerFor, ratingFor, reviewFor, safePage, serviceFor, sortProducts, statusLabel, statusOptions, summaryFor, toDisplayText } from './opportunityListModel';
import OpportunityToolbar from './OpportunityToolbar';
import OpportunityLedger from './OpportunityLedger';
import OpportunityInspector from './OpportunityInspector';

const COLUMN_KEY = 'pihub-opportunity-columns-v1';
const SCOPE = 'opportunities';

const readJson = (key, fallback) => {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; } catch (error) { return fallback; }
};

const downloadJson = (filename, value) => {
  const blob = new Blob([value], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

class OpportunityListPage extends Component {
  constructor(props) {
    super(props);
    const view = this.readView(props.location);
    const storedColumns = readJson(COLUMN_KEY, opportunityColumns.map(column => column.key));
    this.state = {
      status: view.status,
      product_title: view.product_title,
      selectedId: null,
      savedViewName: '',
      visibleColumns: Array.isArray(storedColumns) && storedColumns.length ? storedColumns : opportunityColumns.map(column => column.key),
      density: getTableDensity(SCOPE),
      compareIds: [],
      savedRevision: 0
    };
  }

  componentDidMount() {
    const defaultView = !this.props.location.search ? getDefaultSavedView(SCOPE) : null;
    if (defaultView) this.applySavedView(defaultView);
    else this.loadView(this.readView());
  }

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

  getSortedProducts = () => sortProducts(this.getProducts(), this.readView());
  handleSearch = event => { event.preventDefault(); this.writeView({ product_title: this.state.product_title, page: 1 }); };
  toggleSort = key => { const view = this.readView(); this.writeView({ sort: key, dir: view.sort === key && view.dir === 'asc' ? 'desc' : 'asc', page: 1 }); };

  toggleColumn = key => this.setState(prev => {
    const next = prev.visibleColumns.includes(key) ? prev.visibleColumns.filter(item => item !== key) : [...prev.visibleColumns, key];
    if (!next.length) return null;
    localStorage.setItem(COLUMN_KEY, JSON.stringify(next));
    return { visibleColumns: next };
  });

  setDensity = density => this.setState({ density: setTableDensity(SCOPE, density) });
  refreshSavedViews = () => this.setState(state => ({ savedRevision: state.savedRevision + 1 }));

  saveView = event => {
    event.preventDefault();
    const name = this.state.savedViewName.trim();
    if (!name) return;
    saveSavedView(SCOPE, { name, view: this.readView(), visibleColumns: this.state.visibleColumns, density: this.state.density });
    this.setState({ savedViewName: '' });
    this.refreshSavedViews();
    showToast(`Saved view “${name}” is ready.`, { type: 'success', title: 'View saved' });
  };

  applySavedView = item => {
    if (!item) return;
    const visibleColumns = Array.isArray(item.visibleColumns) && item.visibleColumns.length ? item.visibleColumns : this.state.visibleColumns;
    const density = item.density === 'compact' ? 'compact' : 'comfortable';
    localStorage.setItem(COLUMN_KEY, JSON.stringify(visibleColumns));
    setTableDensity(SCOPE, density);
    this.setState({ visibleColumns, density });
    this.writeView({ ...(item.view || {}), page: 1 });
    showToast(`Loaded “${item.name}”.`, { type: 'info', title: 'Saved view' });
  };

  renameView = (id, name) => { renameSavedView(SCOPE, id, name); this.refreshSavedViews(); showToast('Saved view renamed.', { type: 'success', title: 'View updated' }); };
  deleteView = id => { deleteSavedView(SCOPE, id); this.refreshSavedViews(); showToast('Saved view deleted.', { type: 'info', title: 'View removed' }); };
  setDefaultView = id => { const store = readSavedViewStore(SCOPE); setDefaultSavedView(SCOPE, store.defaultId === id ? null : id); this.refreshSavedViews(); showToast(store.defaultId === id ? 'Default view cleared.' : 'Default view updated.', { type: 'success', title: 'Saved views' }); };

  copyViewLink = item => {
    const url = savedViewShareUrl(item);
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(() => showToast('Shareable view link copied.', { type: 'success', title: 'Link copied' }));
    else window.prompt('Copy this shareable view link', url);
  };

  exportViews = () => downloadJson('pihub-opportunity-views.json', exportSavedViews(SCOPE));
  importViews = raw => { try { importSavedViews(SCOPE, raw); this.refreshSavedViews(); showToast('Saved views imported.', { type: 'success', title: 'Import complete' }); } catch (error) { showToast(error.message || 'Could not import saved views.', { type: 'error', title: 'Import failed' }); } };

  exportVisible = products => downloadCsv('pihub-opportunities.csv', [['Opportunity', 'Facility', 'Industry', 'Owner', 'Risk', 'Min tenor', 'Max tenor', 'Min credit', 'Max credit', 'Status'], ...products.map(product => [localizedText(product.product_title), serviceFor(product), industriesFor(product).join(' | '), ownerFor(product), product.risk_band || ratingFor(product), product.min_time_duration, product.max_time_duration, product.min_credit_amount, product.max_credit_amount, statusLabel(product.status)])]);
  selectProduct = product => this.setState({ selectedId: product.id });

  toggleCompare = product => {
    const id = String(product.id);
    this.setState(prev => {
      if (prev.compareIds.includes(id)) return { compareIds: prev.compareIds.filter(item => item !== id) };
      if (prev.compareIds.length >= 4) { showToast('Compare mode supports up to four opportunities at once.', { type: 'info', title: 'Comparison limit' }); return null; }
      return { compareIds: [...prev.compareIds, id] };
    });
  };

  openCompare = () => { if (this.state.compareIds.length >= 2) this.props.history.push(`/opportunities/compare?ids=${this.state.compareIds.map(encodeURIComponent).join(',')}`); };

  buildActivity = product => [
    { label: `${statusLabel(product.status)} status`, meta: 'Current workflow state' },
    { label: `Owned by ${ownerFor(product)}`, meta: `Risk / rating: ${product.risk_band || ratingFor(product)}` },
    { label: 'Next decision checkpoint', meta: reviewFor(product) },
    { label: 'Opportunity registered', meta: product.product_code || String(product.id) }
  ];

  openQuickView = product => {
    const collateral = product.collatoral !== undefined ? product.collatoral : product.collateral;
    openContextDrawer({
      kicker: 'Opportunity quick view',
      title: localizedText(product.product_title) || 'Untitled opportunity',
      subtitle: `${serviceFor(product) || 'Facility'} · ${industriesFor(product).join(', ') || 'Industry not supplied'}`,
      status: product.status,
      facts: [
        { label: 'Credit range', value: `${formatEuro(product.min_credit_amount)}–${formatEuro(product.max_credit_amount)}` },
        { label: 'Owner', value: ownerFor(product) },
        { label: 'Risk / rating', value: product.risk_band || ratingFor(product) },
        { label: 'Next review', value: reviewFor(product) },
        { label: 'Tenor', value: `${toDisplayText(product.min_time_duration) || '—'}–${toDisplayText(product.max_time_duration) || '—'} months` },
        { label: 'Collateral', value: collateral === 1 || collateral === true ? 'Required' : collateral === 0 || collateral === false ? 'Not required' : '—' }
      ],
      activity: this.buildActivity(product),
      href: `/opportunities/${encodeURIComponent(product.id)}`,
      hrefLabel: 'Open full opportunity'
    });
  };

  renderSortHeader = (key, label) => {
    const view = this.readView();
    const active = view.sort === key;
    return <button type="button" className={active ? 'table-sort is-active' : 'table-sort'} onClick={() => this.toggleSort(key)} aria-label={`Sort by ${label}${active ? `, currently ${view.dir}ending` : ''}`}>{label}<span aria-hidden="true">{active ? (view.dir === 'asc' ? '↑' : '↓') : '↕'}</span></button>;
  };

  render() {
    const pagination = this.props.pagination || {};
    const rawTotalPage = Number(pagination.totalPage || pagination.last_page || pagination.total_pages || 1);
    const totalPage = Number.isFinite(rawTotalPage) && rawTotalPage > 0 ? rawTotalPage : 1;
    const products = this.getSortedProducts();
    const summary = summaryFor(products);
    const selected = products.find(product => String(product.id) === String(this.state.selectedId)) || products[0] || null;
    const view = this.readView();
    const savedStore = readSavedViewStore(SCOPE);
    const activeFilters = (view.status ? 1 : 0) + (view.product_title ? 1 : 0);

    const toolbarProps = {
      status: this.state.status,
      query: this.state.product_title,
      setQuery: product_title => this.setState({ product_title }),
      onSearch: this.handleSearch,
      setStatus: status => this.writeView({ status, page: 1 }),
      activeFilters,
      clearFilters: () => this.writeView({ status: '', product_title: '', page: 1 }),
      compareIds: this.state.compareIds,
      openCompare: this.openCompare,
      clearCompare: () => this.setState({ compareIds: [] }),
      onExport: () => this.exportVisible(products),
      density: this.state.density,
      setDensity: this.setDensity,
      visibleColumns: this.state.visibleColumns,
      toggleColumn: this.toggleColumn,
      savedViews: savedStore.items,
      defaultId: savedStore.defaultId,
      savedViewName: this.state.savedViewName,
      setSavedViewName: savedViewName => this.setState({ savedViewName }),
      saveView: this.saveView,
      loadView: this.applySavedView,
      renameView: this.renameView,
      deleteView: this.deleteView,
      setDefaultView: this.setDefaultView,
      copyViewLink: this.copyViewLink,
      exportViews: this.exportViews,
      importViews: this.importViews
    };

    return <Fragment>
      <Subheader heading={<Translate content="label.allproducts" />} description="Review opportunities, screening context and capital parameters from one working view." buttonLabel={<Translate content="button.addnewproduct" />} link="/opportunities/new" />
      <section className="ap-capital-tape" aria-label="Opportunity summary" data-motion="metric-grid"><article className="ap-metric"><span className="ap-metric-label"><i />Visible</span><strong>{summary.visible}</strong><small>Current result page</small></article><article className="ap-metric ap-metric-positive"><span className="ap-metric-label"><i />Approved</span><strong>{summary.approved}</strong><small>Decision complete</small></article><article className="ap-metric ap-metric-warning"><span className="ap-metric-label"><i />Requested</span><strong>{summary.requested}</strong><small>Awaiting review</small></article><article className="ap-metric ap-metric-signal"><span className="ap-metric-label"><i />Invested</span><strong>{summary.invested}</strong><small>Capital deployed</small></article></section>
      <OpportunityToolbar {...toolbarProps} />
      <div className="ap-board-grid"><OpportunityLedger products={products} visibleColumns={this.state.visibleColumns} selectedId={this.state.selectedId} compareIds={this.state.compareIds} toggleCompare={this.toggleCompare} selectProduct={this.selectProduct} openQuickView={this.openQuickView} renderSortHeader={this.renderSortHeader} density={this.state.density} totalPage={totalPage} page={view.page} writeView={this.writeView} /><OpportunityInspector product={selected} openQuickView={this.openQuickView} /></div>
    </Fragment>;
  }
}

function mapStateToProps(state) { return { data: state.productsList, pagination: state.pagination }; }
export default connect(mapStateToProps, actions)(OpportunityListPage);
