import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Subheader from '../general/Subheader';
import { getCreditRequestList } from '../../actions/credits';
import Pagination from '../general/Pagination';
import Spinner from '../general/Spinner';
import Translate from 'react-translate-component';
import { downloadCsv } from '../../_utils/exportCsv';

const Translator = require('react-translate-component');

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

class ListCreditRequests extends Component {
  state = { selected: {} };
  componentDidMount() { this.props.getCreditRequestList(1); }

  getRows = () => {
    if (!this.props.list || !this.props.list.creditRequests) return null;
    const raw = this.props.list.creditRequests.data;
    return Array.isArray(raw) ? raw.filter(item => item && typeof item === 'object') : [];
  };

  getSortedRows = data => data.slice().sort((a, b) => {
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

  exportRows = rows => downloadCsv('pihub-credit-requests.csv', [['Creditor', 'Opportunity', 'Requested amount', 'Facility', 'Risk', 'Deadline', 'Status'], ...rows.map(item => [toText(item.creditor_name) || toText(item.requested_by), toText(item.product_title) || toText(item.name), requestAmount(item), item.service && item.service.name !== undefined ? toText(item.service.name) : toText(item.service), riskLabel(item), formatDate(item.deadline), statusLabel(toText(item.status))])]);

  renderRows = data => {
    if (!data.length) return <div className="ap-empty"><strong>No credit requests in this view.</strong><span>New submissions will appear in the decision queue.</span></div>;
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
      return <div className="decision-row" role="row" key={key}>
        <span role="cell" className="decision-select"><input type="checkbox" aria-label={`Select ${creditorName} ${productTitle}`} checked={Boolean(this.state.selected[key])} onChange={() => this.toggleSelected(key)} /></span>
        <span role="cell" className="decision-primary"><strong>{creditorName}</strong><small>{applicationId}</small></span>
        <span role="cell" className="decision-primary"><strong>{productTitle}</strong><small>{productId || '—'}</small></span>
        <span role="cell" className="ap-mono ap-money">{formatEuro(requestAmount(item))}</span>
        <span role="cell">{serviceName || '—'}</span>
        <span role="cell" className={riskLabel(item) === 'Not supplied' ? 'decision-risk is-missing' : 'decision-risk'}>{riskLabel(item)}</span>
        <span role="cell"><span className={deadline.className}>{deadline.label}</span></span>
        <span role="cell" className={`ap-status ap-status-${status || 'neutral'}`}><i aria-hidden="true" />{statusLabel(status)}</span>
        <span role="cell"><Link className="row-open-link" to={detailPath} aria-label={`Open ${creditorName} ${productTitle}`}>Open</Link></span>
      </div>;
    });
  };

  render() {
    const rawData = this.getRows();
    if (rawData === null) return <div className="data-loading" role="status" aria-live="polite"><Spinner /></div>;
    const data = this.getSortedRows(rawData);
    const invested = data.filter(item => toText(item.status) === 'invested').length;
    const pending = data.filter(item => !['invested', 'rejected'].includes(toText(item.status))).length;
    const urgent = data.filter(item => !['invested', 'rejected'].includes(toText(item.status)) && deadlineMeta(item.deadline).rank <= 1).length;
    const requestedCapital = data.reduce((total, item) => total + (Number(requestAmount(item)) || 0), 0);
    const meta = this.props.list && this.props.list.creditRequests ? this.props.list.creditRequests.meta || {} : {};
    const rawTotalPage = Number(meta.last_page || meta.totalPage || meta.total_pages || 1);
    const totalPage = Number.isFinite(rawTotalPage) && rawTotalPage > 0 ? rawTotalPage : 1;
    const selectedRows = data.filter((item, index) => this.state.selected[this.rowKey(item, index)]);

    return <Fragment>
      <Subheader heading={<Translate content="label.creditrequests" />} description="Prioritize by deadline, amount and risk context before opening the full decision record." />
      <section className="ap-capital-tape" aria-label="Decision queue summary" data-motion="metric-grid"><article className="ap-metric ap-metric-warning"><span className="ap-metric-label"><i />Pending</span><strong>{pending}</strong><small>Require review</small></article><article className="ap-metric ap-metric-warning"><span className="ap-metric-label"><i />Urgent</span><strong>{urgent}</strong><small>Due within 7 days or overdue</small></article><article className="ap-metric"><span className="ap-metric-label"><i />Requested capital</span><strong className="ap-metric-money">{formatEuro(requestedCapital)}</strong><small>Visible result page</small></article><article className="ap-metric ap-metric-positive"><span className="ap-metric-label"><i />Invested</span><strong>{invested}</strong><small>Converted positions</small></article></section>
      <div className="decision-toolbar"><span>{selectedRows.length ? `${selectedRows.length} selected` : 'Rows are urgency-sorted within the visible page.'}</span><div>{selectedRows.length ? <button className="btn btn-link" type="button" onClick={() => this.setState({ selected: {} })}>Clear selection</button> : null}<button className="btn btn-secondary" type="button" onClick={() => this.exportRows(selectedRows.length ? selectedRows : data)}>{selectedRows.length ? 'Export selected' : 'Export page'}</button></div></div>
      <section className="decision-table" role="table" aria-label="Credit decision queue" data-motion="table-shell"><div className="decision-head" role="row"><span role="columnheader"><span className="sr-only">Select</span></span><span role="columnheader">Creditor</span><span role="columnheader">Opportunity</span><span role="columnheader">Requested</span><span role="columnheader">Facility</span><span role="columnheader">Risk</span><span role="columnheader">Deadline</span><span role="columnheader">Status</span><span role="columnheader"><span className="sr-only">Open</span></span></div><div>{this.renderRows(data)}</div><div className="ap-ledger-pagination"><Pagination totalPage={totalPage} url={page => this.props.getCreditRequestList(page)} /></div></section>
    </Fragment>;
  }
}

function mapStateToProps(state) { return { list: state.creditRequests }; }
export default connect(mapStateToProps, { getCreditRequestList })(ListCreditRequests);
