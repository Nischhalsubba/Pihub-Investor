import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Translator from 'react-translate-component';
import Subheader from '../general/Subheader';
import Spinner from '../general/Spinner';
import { getProductsList } from '../../actions/product';
import { getCreditRequestList } from '../../actions/credits';
import { getInvestedList } from '../../actions/invested';

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

const formatEuro = value => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return '—';
  return new Intl.NumberFormat(Translator.getLocale() === 'de' ? 'de-DE' : 'en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);
};

const validDate = value => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const addMonths = (dateValue, months) => {
  const date = validDate(dateValue);
  const amount = Number(months);
  if (!date || !Number.isFinite(amount)) return null;
  const result = new Date(date.getTime());
  result.setMonth(result.getMonth() + amount);
  return result;
};

const daysUntil = value => {
  const date = value instanceof Date ? value : validDate(value);
  if (!date) return null;
  return Math.ceil((date.getTime() - Date.now()) / 86400000);
};

const formatDate = value => {
  const date = value instanceof Date ? value : validDate(value);
  if (!date) return '—';
  return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
};

class Overview extends Component {
  componentDidMount() {
    this.props.getProductsList(1);
    this.props.getCreditRequestList(1);
    this.props.getInvestedList(1);
  }

  getProducts = () => {
    const list = this.props.products && this.props.products.productsList;
    return list && Array.isArray(list.data) ? list.data.filter(Boolean) : [];
  };

  getRequests = () => {
    const list = this.props.creditRequests && this.props.creditRequests.creditRequests;
    return list && Array.isArray(list.data) ? list.data.filter(Boolean) : [];
  };

  getPositions = () => this.props.investment && Array.isArray(this.props.investment.list) ? this.props.investment.list.filter(Boolean) : [];

  render() {
    const waiting = !this.props.products && !this.props.creditRequests && !this.props.investment;
    if (waiting) return <div className="data-loading" role="status" aria-live="polite"><Spinner /></div>;

    const products = this.getProducts();
    const requests = this.getRequests();
    const positions = this.getPositions();
    const pending = requests.filter(item => toText(item.status) !== 'invested' && toText(item.status) !== 'rejected');
    const urgent = pending.filter(item => { const days = daysUntil(item.deadline); return days !== null && days <= 7; });
    const deployed = positions.reduce((total, item) => total + (Number(item.invested_amount) || 0), 0);
    const requested = products.filter(item => toText(item.status) === 'requested').length;
    const maturities = positions.map(item => ({ item, date: addMonths(item.invested_on, item.duration) })).filter(entry => entry.date).sort((a, b) => a.date - b.date);
    const nextMaturity = maturities.find(entry => entry.date.getTime() >= Date.now());
    const priority = pending.slice().sort((a, b) => {
      const aDate = validDate(a.deadline);
      const bDate = validDate(b.deadline);
      if (!aDate && !bDate) return 0;
      if (!aDate) return 1;
      if (!bDate) return -1;
      return aDate - bDate;
    }).slice(0, 5);

    return (
      <Fragment>
        <Subheader heading="Overview" description="Decisions, deadlines and capital events that deserve attention now." />
        <section className="ap-capital-tape" aria-label="Investor workspace summary" data-motion="metric-grid">
          <article className="ap-metric ap-metric-warning"><span className="ap-metric-label"><i />Pending decisions</span><strong>{pending.length}</strong><small>Visible credit requests</small></article>
          <article className="ap-metric ap-metric-warning"><span className="ap-metric-label"><i />Due within 7 days</span><strong>{urgent.length}</strong><small>Includes overdue items</small></article>
          <article className="ap-metric ap-metric-signal"><span className="ap-metric-label"><i />Deployed capital</span><strong className="ap-metric-money">{formatEuro(deployed)}</strong><small>Visible invested positions</small></article>
          <article className="ap-metric"><span className="ap-metric-label"><i />Next maturity</span><strong className="ap-metric-date">{nextMaturity ? formatDate(nextMaturity.date) : '—'}</strong><small>{nextMaturity ? toText(nextMaturity.item.product_title) || 'Position maturity' : 'No dated position visible'}</small></article>
        </section>

        <div className="overview-grid">
          <section className="overview-panel" aria-labelledby="attention-title">
            <div className="ap-section-rule"><div><strong id="attention-title">Needs attention</strong><span>Earliest visible credit deadlines first</span></div><Link to="/credit-request">Open queue</Link></div>
            {priority.length ? <div className="overview-attention-list">{priority.map((item, index) => {
              const productId = item.product_id || item.id;
              const applicationId = item.application_id || `REQ-${index + 1}`;
              const days = daysUntil(item.deadline);
              const amount = item.requested_amount !== undefined ? item.requested_amount : item.amount;
              return <Link className="overview-attention-row" key={`${productId}-${applicationId}`} to={`/credit-requests/${encodeURIComponent(productId)}/${encodeURIComponent(applicationId)}`}><span><strong>{toText(item.creditor_name) || toText(item.requested_by) || 'Creditor'}</strong><small>{toText(item.product_title) || toText(item.name) || 'Opportunity'}</small></span><span className="ap-mono">{formatEuro(amount)}</span><span className={days !== null && days <= 7 ? 'deadline-state is-urgent' : 'deadline-state'}>{days === null ? 'No deadline' : days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? 'Due today' : `${days}d`}</span><span aria-hidden="true">›</span></Link>;
            })}</div> : <div className="ap-empty ap-empty-compact"><strong>No pending requests in this visible set.</strong><span>The decision queue will surface new submissions here.</span></div>}
          </section>

          <aside className="overview-panel overview-actions" aria-labelledby="workspace-actions-title">
            <div className="ap-section-rule"><div><strong id="workspace-actions-title">Workspace actions</strong><span>Go directly to the next operational task</span></div></div>
            <Link to="/products"><span>Review opportunities</span><b>{products.length} visible</b></Link>
            <Link to="/credit-request"><span>Prioritize credit requests</span><b>{pending.length} pending</b></Link>
            <Link to="/products-invested"><span>Review portfolio exposure</span><b>{positions.length} positions</b></Link>
            <Link to="/opportunities/new"><span>Add opportunity</span><b>New</b></Link>
          </aside>
        </div>

        <section className="overview-panel overview-market" aria-labelledby="book-health-title">
          <div className="ap-section-rule"><div><strong id="book-health-title">Opportunity book</strong><span>Visible status mix for the current first page</span></div><Link to="/products">Open opportunities</Link></div>
          <div className="overview-book-stats"><div><span>Requested</span><strong>{requested}</strong></div><div><span>Approved</span><strong>{products.filter(item => toText(item.status) === 'approved').length}</strong></div><div><span>Invested</span><strong>{products.filter(item => toText(item.status) === 'invested').length}</strong></div><div><span>Visible total</span><strong>{products.length}</strong></div></div>
        </section>
      </Fragment>
    );
  }
}

export default connect(state => ({ products: state.productsList, creditRequests: state.creditRequests, investment: state.investment }), { getProductsList, getCreditRequestList, getInvestedList })(Overview);
