import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Subheader from '../general/Subheader';
import { getCreditRequestList } from '../../actions/credits';
import Pagination from '../general/Pagination';
import Spinner from '../general/Spinner';
import Translate from 'react-translate-component';
import { downloadCsv } from '../../_utils/exportCsv';
import { getTableDensity, setTableDensity } from '../../_utils/workspacePreferences';
import { openContextDrawer, showToast } from '../../_utils/workspaceEvents';

const Translator = Translate;
const VIEW_KEY = 'pihub-credit-saved-views-v1';

const toText = value => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (typeof value !== 'object') return '';
  const locale = Translator.getLocale();
  const candidates = [value[locale], value.en, value.de, value.label, value.title, value.name];
  for (let index = 0; index < candidates.length; index += 1) {
    const candidate = candidates[index];
    if (typeof candidate === 'string' || typeof candidate === 'number') return String(candidate);
  }
  return '';
};

const statusLabel = status => {
  const locale = Translator.getLocale();
  const map = { requested: locale === 'de' ? 'Angefragt' : 'Requested', invested: locale === 'de' ? 'Investiert' : 'Invested', approved: locale === 'de' ? 'Genehmigt' : 'Approved', rejected: locale === 'de' ? 'Abgelehnt' : 'Rejected', postponed: locale === 'de' ? 'Verschoben' : 'Postponed' };
  return map[status] || status || '—';
};

const formatEuro = value => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return '—';
  return new Intl.NumberFormat(Translator.getLocale() === 'de' ? 'de-DE' : 'en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);
};

const dateValue = value => { const date = new Date(value); return Number.isNaN(date.getTime()) ? null : date; };
const formatDate = value => { const date = value instanceof Date ? value : dateValue(value); if (!date) return '—'; return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`; };

const deadlineMeta = value => {
  const date = dateValue(value);
  if (!date) return { rank: 4, label: 'No deadline', className: 'deadline-state' };
  const days = Math.ceil((date.getTime() - Date.now()) / 86400000);
  if (days < 0) return { rank: 0, label: `${Math.abs(days)}d overdue`, className: 'deadline-state is-overdue' };
  if (days === 0) return { rank: 0, label: 'Due today', className: 'deadline-state is-overdue' };
  if (days <= 7) return { rank: 1, label: `${days}d · ${formatDate(date)}`, className: 'deadline-state is-urgent' };
  if (days <= 30) return { rank: 2, label: `${days}d · ${formatDate(date)}`, className: 'deadline-state is-soon' };
  return { rank: 3, label: formatDate(date), className: 'deadline-state' };
};

const requestAmount = item => item.requested_amount !== undefined ? item.requested_amount : item.amount;
const riskLabel = item => toText(item.risk_rating) || toText(item.rating) || (Array.isArray(item.ratings) && item.ratings[0] ? toText(item.ratings[0].value || item.ratings[0]) : '') || 'Not supplied';
const readJson = (key, fallback) => { try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; } catch (error) { return fallback; } };

class ListCreditRequests extends Component {
  state = { selected: {}, density: getTableDensity('credit-requests'), query: '', statusFilter: 'all', urgency: 'all', savedViewName: '' };
  componentDidMount() { this.props.getCreditRequestList(1); }

  getRows = () => {
    if (!this.props.list || !this.props.list.creditRequests) return null;
    const raw = this.props.list.creditRequests.data;
    return Array.isArray(raw) ? raw.filter(item => item && typeof item === 'object') : [];
  };

  filterRows = data => {
    const query = this.state.query.trim().toLowerCase();
    return data.filter(item => {
      const status = toText(item.status);
      if (this.state.statusFilter !== 'all' && status !== this.state.statusFilter) return false;
      if (this.state.urgency === 'urgent' && deadlineMeta(item.deadline).rank > 1) return false;
      if (query) {
        const haystack = [toText(item.creditor_name), toText(item.requested_by), toText(item.product_title), toText(item.name), item.service && item.service.name !== undefined ? toText(item.service.name) : toText(item.service), riskLabel(item)].join(' ').toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  };

  getSortedRows = data => this.filterRows(data).slice().sort((a, b) => {
    const aMeta = deadlineMeta(a.deadline);
    const bMeta = deadlineMeta(b.deadline);
    if (aMeta.rank !== bMeta.rank) return aMeta.rank - bMeta.rank;
    const aDate = dateValue(a.deadline);
    const bDate = dateValue(b.deadline);
    if (aDate && bDate && aDate.getTime() !== bDate.getTime()) return aDate - bDate;
    return (Number(requestAmount(b)) || 0) - (Number(requestAmount(a)) || 0);
  });

  rowKey = (item, index) => String(item.application_id || `${item.product_id || item.id || 'request'}-${index}`);
  toggleSelected = key => this.setState(prev => ({ selected: { ...prev.selected, [key]: !prev.selected[key] } }));
  setDensity = density => this.setState({ density: setTableDensity('credit-requests', density) });

  exportRows = rows => downloadCsv('pihub-credit-requests.csv', [['Creditor', 'Opportunity', 'Requested amount', 'Facility', 'Risk', 'Deadline', 'Status'], ...rows.map(item => [toText(item.creditor_name) || toText(item.requested_by), toText(item.product_title) || toText(item.name), requestAmount(item), item.service && item.service.name !== undefined ? toText(item.service.name) : toText(item.service), riskLabel(item), formatDate(item.deadline), statusLabel(toText(item.status))])]);

  saveView = event => {
    event.preventDefault();
    const name = this.state.savedViewName.trim();
    if (!name) return;
    const views = readJson(VIEW_KEY, []);
    const view = { name, query: this.state.query, statusFilter: this.state.statusFilter, urgency: this.state.urgency, density: this.state.density };
    localStorage.setItem(VIEW_KEY, JSON.stringify([...views.filter(item => item && item.name !== name), view].slice(-12)));
    this.setState({ savedViewName: '' });
    showToast(`Saved credit view “${name}”.`, { type: 'success', title: 'View saved' });
  };

  loadView = event => {
    const name = event.target.value;
    if (!name) return;
    const view = readJson(VIEW_KEY, []).find(item => item && item.name === name);
    if (view) {
      const density = setTableDensity('credit-requests', view.density || 'comfortable');
      this.setState({ query: view.query || '', statusFilter: view.statusFilter || 'all', urgency: view.urgency || 'all', density });
      showToast(`Loaded “${name}”.`, { title: 'Saved view' });
    }
    event.target.value = '';
  };

  openQuickView = (item, index) => {
    const status = toText(item.status);
    const productId = item.product_id || item.id || '';
    const applicationId = item.application_id || `REQ-${index + 1}`;
    const creditor = toText(item.creditor_name) || toText(item.requested_by) || 'Creditor';
    const product = toText(item.product_title) || toText(item.name) || 'Credit request';
    const detailPath = status === 'invested' ? `/positions/${encodeURIComponent(productId)}/${encodeURIComponent(applicationId)}` : `/credit-requests/${encodeURIComponent(productId)}/${encodeURIComponent(applicationId)}`;
    const deadline = deadlineMeta(item.deadline);
    openContextDrawer({
      kicker: status === 'invested' ? 'Invested position' : 'Credit request quick view',
      title: creditor,
      subtitle: product,
      status,
      facts: [
        { label: 'Requested capital', value: formatEuro(requestAmount(item)) },
        { label: 'Facility', value: item.service && item.service.name !== undefined ? toText(item.service.name) : toText(item.service) || '—' },
        { label: 'Risk', value: riskLabel(item) },
        { label: 'Deadline', value: deadline.label },
        { label: 'Application', value: applicationId }
      ],
      activity: [
        { label: `${statusLabel(status)} state`, meta: 'Current decision status' },
        { label: 'Request submitted', meta: formatDate(item.created_on || item.requested_on) },
        { label: 'Decision deadline set', meta: deadline.label }
      ],
      href: detailPath,
      hrefLabel: status === 'invested' ? 'Open position' : 'Open full credit request'
    });
  };

  handleRowKey = (event, item, index) => {
    if (event.key === 'Enter') { event.preventDefault(); this.openQuickView(item, index); return; }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const rows = Array.from(event.currentTarget.parentElement.querySelectorAll('.decision-row'));
      const nextIndex = event.key === 'ArrowDown' ? Math.min(rows.length - 1, index + 1) : Math.max(0, index - 1);
      if (rows[nextIndex]) rows[nextIndex].focus();
    }
  };

  renderRows = data => {
    if (!data.length) return <div className="ap-empty"><strong>No credit requests match this view.</strong><span>Clear a filter or wait for a new submission to enter the queue.</span></div>;
    return data.map((item, index) => {
      const status = toText(item.status);
      const productId = item.product_id || item.id || '';
      const applicationId = item.application_id || `REQ-${index + 1}`;
      const key = this.rowKey(item, index);
      const productTitle = toText(item.product_title) || toText(item.name) || 'Untitled product';
      const creditorName = toText(item.creditor_name) || toText(item.requested_by) || 'Creditor';
      const serviceName = item.service && item.service.name !== undefined ? toText(item.service.name) : toText(item.service);
      const detailPath = status === 'invested' ? `/positions/${encodeURIComponent(productId)}/${encodeURIComponent(applicationId)}` : `/credit-requests/${encodeURIComponent(productId)}/${encodeURIComponent(applicationId)}`;
      const deadline = deadlineMeta(item.deadline);
      const risk = riskLabel(item);
      return <div className="decision-row" role="row" tabIndex="0" key={key} onKeyDown={event => this.handleRowKey(event, item, index)}>
        <span role="cell" className="decision-select" data-label="Select"><input type="checkbox" aria-label={`Select ${creditorName} ${productTitle}`} checked={Boolean(this.state.selected[key])} onChange={() => this.toggleSelected(key)} /></span>
        <span role="cell" className="decision-primary decision-creditor" data-label="Creditor"><strong>{creditorName}</strong><small>{applicationId}</small></span>
        <span role="cell" className="decision-primary decision-opportunity" data-label="Opportunity"><strong>{productTitle}</strong><small>{productId || '—'}</small></span>
        <span role="cell" className="ap-mono ap-money" data-label="Requested">{formatEuro(requestAmount(item))}</span>
        <span role="cell" data-label="Facility">{serviceName || '—'}</span>
        <span role="cell" className={risk === 'Not supplied' ? 'decision-risk is-missing' : 'decision-risk'} data-label="Risk">{risk}</span>
        <span role="cell" data-label="Deadline"><span className={deadline.className}>{deadline.label}</span></span>
        <span role="cell" className={`ap-status ap-status-${status || 'neutral'}`} data-label="Status"><i aria-hidden="true" />{statusLabel(status)}</span>
        <span role="cell" className="decision-open" data-label="Action"><button className="ap-quick-view-btn" type="button" onClick={() => this.openQuickView(item, index)} aria-label={`Quick view ${creditorName} ${productTitle}`} title="Quick view"><i className="bx bx-window-open" aria-hidden="true" /></button><Link className="row-open-link" to={detailPath} aria-label={`Open ${creditorName} ${productTitle}`}>Open</Link></span>
      </div>;
    });
  };

  render() {
    const rawData = this.getRows();
    if (rawData === null) return <div className="data-loading" role="status" aria-live="polite"><Spinner /></div>;
    const allData = this.getSortedRows(rawData);
    const data = allData;
    const invested = data.filter(item => toText(item.status) === 'invested').length;
    const pending = data.filter(item => !['invested', 'rejected'].includes(toText(item.status))).length;
    const urgent = data.filter(item => !['invested', 'rejected'].includes(toText(item.status)) && deadlineMeta(item.deadline).rank <= 1).length;
    const requestedCapital = data.reduce((total, item) => total + (Number(requestAmount(item)) || 0), 0);
    const meta = this.props.list && this.props.list.creditRequests ? this.props.list.creditRequests.meta || {} : {};
    const rawTotalPage = Number(meta.last_page || meta.totalPage || meta.total_pages || 1);
    const totalPage = Number.isFinite(rawTotalPage) && rawTotalPage > 0 ? rawTotalPage : 1;
    const selectedRows = data.filter((item, index) => this.state.selected[this.rowKey(item, index)]);
    const views = readJson(VIEW_KEY, []);

    return <Fragment>
      <Subheader heading={<Translate content="label.creditrequests" />} description="Prioritize by deadline, amount and risk context before opening the full decision record." />
      <section className="ap-capital-tape" aria-label="Decision queue summary" data-motion="metric-grid"><article className="ap-metric ap-metric-warning"><span className="ap-metric-label"><i />Pending</span><strong>{pending}</strong><small>Require review</small></article><article className="ap-metric ap-metric-warning"><span className="ap-metric-label"><i />Urgent</span><strong>{urgent}</strong><small>Due within 7 days or overdue</small></article><article className="ap-metric"><span className="ap-metric-label"><i />Requested capital</span><strong className="ap-metric-money">{formatEuro(requestedCapital)}</strong><small>Filtered result page</small></article><article className="ap-metric ap-metric-positive"><span className="ap-metric-label"><i />Invested</span><strong>{invested}</strong><small>Converted positions</small></article></section>
      <div className="decision-toolbar ap-credit-view-toolbar">
        <div className="ap-credit-filter-row"><label className="sr-only" htmlFor="credit-search">Search credit requests</label><input id="credit-search" type="search" value={this.state.query} onChange={event => this.setState({ query: event.target.value })} placeholder="Search creditor, opportunity, facility or risk" /><select aria-label="Filter credit requests by status" value={this.state.statusFilter} onChange={event => this.setState({ statusFilter: event.target.value })}><option value="all">All statuses</option><option value="requested">Requested</option><option value="invested">Invested</option><option value="rejected">Rejected</option></select><button type="button" className={this.state.urgency === 'urgent' ? 'btn btn-secondary is-active' : 'btn btn-link'} onClick={() => this.setState(state => ({ urgency: state.urgency === 'urgent' ? 'all' : 'urgent' }))}>Urgent only</button></div>
        <div className="data-toolbar-actions">{selectedRows.length ? <span>{selectedRows.length} selected</span> : <span>{data.length} visible · urgency-sorted</span>}{selectedRows.length ? <button className="btn btn-link" type="button" onClick={() => this.setState({ selected: {} })}>Clear selection</button> : null}<div className="ap-density-toggle" role="group" aria-label="Credit queue density"><button type="button" aria-pressed={this.state.density === 'comfortable'} onClick={() => this.setDensity('comfortable')}>Comfortable</button><button type="button" aria-pressed={this.state.density === 'compact'} onClick={() => this.setDensity('compact')}>Compact</button></div><details className="data-menu"><summary>Saved views</summary><div><select defaultValue="" onChange={this.loadView}><option value="">Load saved view</option>{views.map(view => <option key={view.name} value={view.name}>{view.name}</option>)}</select><form onSubmit={this.saveView}><input aria-label="Credit saved view name" value={this.state.savedViewName} onChange={event => this.setState({ savedViewName: event.target.value })} placeholder="View name" /><button type="submit">Save current view</button></form></div></details><button className="btn btn-secondary" type="button" onClick={() => this.exportRows(selectedRows.length ? selectedRows : data)}>{selectedRows.length ? 'Export selected' : 'Export page'}</button></div>
      </div>
      <section className={`decision-table is-density-${this.state.density}`} role="table" aria-label="Credit decision queue" data-motion="table-shell">
        <div className="decision-scroll" tabIndex="0" role="region" aria-label="Credit decision records">
          <div className="decision-head" role="row"><span role="columnheader"><span className="sr-only">Select</span></span><span role="columnheader">Creditor</span><span role="columnheader">Opportunity</span><span role="columnheader">Requested</span><span role="columnheader">Facility</span><span role="columnheader">Risk</span><span role="columnheader">Deadline</span><span role="columnheader">Status</span><span role="columnheader"><span className="sr-only">Actions</span></span></div>
          <div>{this.renderRows(data)}</div>
        </div>
        <div className="ap-ledger-pagination"><Pagination totalPage={totalPage} url={page => this.props.getCreditRequestList(page)} /></div>
      </section>
    </Fragment>;
  }
}

function mapStateToProps(state) { return { list: state.creditRequests }; }
export default connect(mapStateToProps, { getCreditRequestList })(ListCreditRequests);
