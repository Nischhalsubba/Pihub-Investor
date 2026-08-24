import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Subheader from '../general/Subheader';
import { getProductsList } from '../../actions/product';
import { getCreditRequestList } from '../../actions/credits';
import { getInvestedList } from '../../actions/invested';
import { getProfile } from '../../actions/profile';

const text = value => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (typeof value === 'object') return String(value.en || value.de || value.label || value.title || value.name || '');
  return '';
};
const money = value => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return '—';
  return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);
};
const date = value => { const result = new Date(value); return Number.isNaN(result.getTime()) ? null : result; };
const daysUntil = value => { const target = date(value); return target ? Math.ceil((target.getTime() - Date.now()) / 86400000) : null; };
const formatDate = value => { const target = value instanceof Date ? value : date(value); return target ? new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(target) : '—'; };

const PipelineChart = ({ products }) => {
  const counts = products.reduce((result, product) => { const status = product.status || 'other'; result[status] = (result[status] || 0) + 1; return result; }, {});
  const total = Math.max(products.length, 1);
  const groups = [
    ['Requested', 'requested', counts.requested || 0],
    ['Approved', 'approved', counts.approved || 0],
    ['Invested', 'invested', counts.invested || 0],
    ['Other', 'other', products.length - (counts.requested || 0) - (counts.approved || 0) - (counts.invested || 0)]
  ];
  return <div><div className="ap-pipeline-strip" role="img" aria-label={groups.map(([label, , count]) => `${label} ${count}`).join(', ')}>{groups.map(([label, key, count]) => count ? <span key={key} className={`is-${key}`} style={{ '--segment': count }} title={`${label}: ${count} of ${total}`} /> : null)}</div><div className="ap-pipeline-legend">{groups.filter(([, , count]) => count > 0).map(([label, key, count]) => <div key={key}><span>{label}</span><b>{count} · {Math.round((count / total) * 100)}%</b></div>)}</div></div>;
};

const BarList = ({ rows, formatter = value => String(value) }) => {
  const max = Math.max(1, ...rows.map(row => Number(row.value) || 0));
  return <div className="ap-bar-list">{rows.length ? rows.map(row => <div className="ap-bar-row" key={row.label}><span>{row.label}</span><div className="ap-bar-track" aria-hidden="true"><i style={{ '--bar-width': `${Math.max(3, ((Number(row.value) || 0) / max) * 100)}%` }} /></div><b>{formatter(row.value)}</b></div>) : <div className="ap-empty ap-empty-compact"><strong>No data yet.</strong><span>This view will populate as the workspace records activity.</span></div>}</div>;
};

const CapitalTrend = ({ positions }) => {
  const events = positions.slice().sort((a, b) => (date(a.invested_on)?.getTime() || 0) - (date(b.invested_on)?.getTime() || 0));
  let cumulative = 0;
  const points = events.map((position, index) => {
    cumulative += Number(position.invested_amount !== undefined ? position.invested_amount : position.amount) || 0;
    return { x: events.length === 1 ? 50 : (index / Math.max(1, events.length - 1)) * 100, amount: cumulative, label: text(position.product_title) || `Position ${index + 1}` };
  });
  const max = Math.max(1, ...points.map(point => point.amount));
  const polyline = points.map(point => `${point.x},${90 - (point.amount / max) * 72}`).join(' ');
  return <div className="ap-capital-trend"><svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label={`Cumulative deployed capital ${money(cumulative)} across ${events.length} funding events`}><line x1="0" y1="90" x2="100" y2="90" /><line x1="0" y1="54" x2="100" y2="54" /><line x1="0" y1="18" x2="100" y2="18" /><polyline points={polyline || '0,90'} /></svg><div className="ap-trend-summary"><strong>{money(cumulative)}</strong><span>{events.length} funding event{events.length === 1 ? '' : 's'} in the visible portfolio</span></div></div>;
};

class Overview extends Component {
  componentDidMount() {
    this.props.getProductsList(1, '', '');
    this.props.getCreditRequestList(1);
    this.props.getInvestedList(1);
    if (!this.props.profile) this.props.getProfile();
  }

  products = () => this.props.products && this.props.products.productsList && Array.isArray(this.props.products.productsList.data) ? this.props.products.productsList.data.filter(Boolean) : [];
  requests = () => this.props.creditRequests && this.props.creditRequests.creditRequests && Array.isArray(this.props.creditRequests.creditRequests.data) ? this.props.creditRequests.creditRequests.data.filter(Boolean) : [];
  positions = () => this.props.investment && Array.isArray(this.props.investment.list) ? this.props.investment.list.filter(Boolean) : [];
  deadline = request => request.deadline || request.decision_deadline || request.expiry_date;
  amount = request => Number(request.requested_amount !== undefined ? request.requested_amount : request.amount) || 0;
  investedAmount = position => Number(position.invested_amount !== undefined ? position.invested_amount : position.amount) || 0;

  getIndustryRows = (products, positions) => {
    const totals = new Map();
    positions.forEach(position => {
      const product = products.find(item => String(item.id) === String(position.product_id || position.id)) || {};
      const industries = Array.isArray(product.industries) && product.industries.length ? product.industries : [{ name: 'Other' }];
      const amount = this.investedAmount(position) / industries.length;
      industries.forEach(industry => { const name = text(industry.name || industry) || 'Other'; totals.set(name, (totals.get(name) || 0) + amount); });
    });
    return Array.from(totals.entries()).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
  };

  getMaturityRows = positions => {
    const buckets = [{ label: '≤12 months', value: 0 }, { label: '13–24 months', value: 0 }, { label: '25–36 months', value: 0 }, { label: '37+ months', value: 0 }];
    positions.forEach(position => { const duration = Number(position.duration || position.max_time_duration || 0); const index = duration <= 12 ? 0 : duration <= 24 ? 1 : duration <= 36 ? 2 : 3; buckets[index].value += 1; });
    return buckets;
  };

  getRoleFocus = () => {
    const profile = this.props.profile || {};
    const roles = [...(Array.isArray(profile.roles) ? profile.roles : []), ...(Array.isArray(profile.permissions) ? profile.permissions : [])].filter(Boolean);
    const unique = Array.from(new Set(roles.map(String)));
    const primary = unique.find(role => /credit/i.test(role)) || unique.find(role => /portfolio/i.test(role)) || unique.find(role => /admin/i.test(role)) || 'Investor workspace';
    return { primary, roles: unique.length ? unique : ['Investor workspace'] };
  };

  render() {
    const products = this.products();
    const requests = this.requests();
    const positions = this.positions();
    const pending = requests.filter(request => !['invested', 'accepted', 'rejected'].includes(String(request.status || '').toLowerCase()));
    const dueSoon = pending.filter(request => { const days = daysUntil(this.deadline(request)); return days !== null && days <= 7; });
    const deployed = positions.reduce((sum, position) => sum + this.investedAmount(position), 0);
    const maturities = positions.map(position => ({ position, date: date(position.maturity_date || position.maturity || position.deadline) })).filter(item => item.date).sort((a, b) => a.date - b.date);
    const nextMaturity = maturities[0];
    const visibleStatuses = { requested: products.filter(product => product.status === 'requested').length, approved: products.filter(product => product.status === 'approved').length, invested: products.filter(product => product.status === 'invested').length };
    const attention = pending.slice().sort((a, b) => { const ad = date(this.deadline(a)); const bd = date(this.deadline(b)); if (!ad) return 1; if (!bd) return -1; return ad - bd; }).slice(0, 4);
    const role = this.getRoleFocus();
    const industries = this.getIndustryRows(products, positions);
    const maturityRows = this.getMaturityRows(positions);

    return <Fragment>
      <Subheader heading="Overview" description="Decisions, deadlines and capital events that deserve attention now." />
      <div className="ap-role-focus" aria-label="Role-aware workspace focus"><span className="ap-role-chip is-primary"><i className="bx bx-target-lock" aria-hidden="true" />Focus: {role.primary}</span>{role.roles.slice(0, 4).map(item => <span className="ap-role-chip" key={item}>{item}</span>)}</div>
      <section className="ap-capital-tape" aria-label="Workspace summary" data-motion="metric-grid">
        <article className="ap-metric ap-metric-warning"><span className="ap-metric-label"><i />Pending decisions</span><strong>{pending.length}</strong><small>Visible credit requests</small><span className="ap-kpi-delta">{requests.length} total decision records</span></article>
        <article className="ap-metric ap-metric-warning"><span className="ap-metric-label"><i />Due within 7 days</span><strong>{dueSoon.length}</strong><small>Includes overdue items</small><span className={`ap-kpi-delta${dueSoon.length ? ' is-warning' : ' is-positive'}`}>{dueSoon.length ? 'Review queue now' : 'No immediate deadline pressure'}</span></article>
        <article className="ap-metric ap-metric-signal"><span className="ap-metric-label"><i />Deployed capital</span><strong className="ap-metric-money">{money(deployed)}</strong><small>{positions.length} visible invested position{positions.length === 1 ? '' : 's'}</small><span className="ap-kpi-delta is-positive">Across {industries.length || 0} portfolio sector{industries.length === 1 ? '' : 's'}</span></article>
        <article className="ap-metric"><span className="ap-metric-label"><i />Next maturity</span><strong className="ap-metric-date">{nextMaturity ? formatDate(nextMaturity.date) : '—'}</strong><small>{nextMaturity ? text(nextMaturity.position.product_title) || 'Invested position' : 'No maturity supplied'}</small><span className="ap-kpi-delta">{positions.length ? `${Math.max(...positions.map(item => Number(item.duration || 0)))}m longest visible tenor` : 'No funded tenor yet'}</span></article>
      </section>

      <div className="overview-grid">
        <section className="overview-panel" aria-labelledby="attention-title" data-motion="table-shell"><header><div><strong id="attention-title">Needs attention</strong><span>Earliest visible credit deadlines first</span></div><Link to="/credit-request">Open queue</Link></header>{attention.length ? <div className="overview-attention-list">{attention.map((request, index) => { const productId = request.product_id || request.id || `request-${index}`; const appId = request.application_id || `APP-${index + 1}`; const days = daysUntil(this.deadline(request)); return <Link className="overview-attention-row" to={`/credit-requests/${encodeURIComponent(productId)}/${encodeURIComponent(appId)}`} key={`${productId}-${appId}`}><span><strong>{text(request.creditor_name) || text(request.requested_by) || 'Creditor'}</strong><small>{text(request.product_title) || 'Credit request'}</small></span><b>{money(this.amount(request))}</b><em>{days === null ? 'No deadline' : days < 0 ? `${Math.abs(days)}d overdue` : `${days}d`}</em><i aria-hidden="true">›</i></Link>; })}</div> : <div className="ap-empty ap-empty-compact"><strong>No pending decision needs attention.</strong><span>The queue is clear for the current view.</span></div>}</section>
        <section className="overview-panel overview-actions" aria-labelledby="actions-title"><header><div><strong id="actions-title">Workspace actions</strong><span>Go directly to the next operational task</span></div></header><Link to="/products"><span>Review opportunities</span><small>{products.length} visible</small></Link><Link to="/credit-request"><span>Prioritize credit requests</span><small>{pending.length} pending</small></Link><Link to="/products-invested"><span>Review portfolio exposure</span><small>{positions.length} positions</small></Link><Link to="/opportunities/new"><span>Add opportunity</span><small>New</small></Link></section>
      </div>

      <section className="overview-panel overview-book" aria-labelledby="book-title" data-motion="metric-grid"><header><div><strong id="book-title">Opportunity book</strong><span>Visible status mix for the current first page</span></div><Link to="/products">Open opportunities</Link></header><div className="overview-book-grid"><div><span>Requested</span><b>{visibleStatuses.requested}</b></div><div><span>Approved</span><b>{visibleStatuses.approved}</b></div><div><span>Invested</span><b>{visibleStatuses.invested}</b></div><div><span>Visible total</span><b>{products.length}</b></div></div></section>

      <div className="ap-analytics-grid" aria-label="Portfolio analytics">
        <section className="ap-analytics-card" data-motion="profile-card"><header><strong>Opportunity pipeline</strong><span>Status composition across the visible opportunity book.</span></header><PipelineChart products={products} /></section>
        <section className="ap-analytics-card" data-motion="profile-card"><header><strong>Deployed capital progression</strong><span>Cumulative funding across visible investment events.</span></header><CapitalTrend positions={positions} /></section>
        <section className="ap-analytics-card" data-motion="profile-card"><header><strong>Portfolio concentration</strong><span>Deployed capital grouped by opportunity industry.</span></header><BarList rows={industries} formatter={money} /></section>
        <section className="ap-analytics-card" data-motion="profile-card"><header><strong>Maturity distribution</strong><span>Visible positions grouped by contractual tenor.</span></header><BarList rows={maturityRows} formatter={value => `${value} position${value === 1 ? '' : 's'}`} /></section>
      </div>
    </Fragment>;
  }
}

function mapStateToProps(state) { return { products: state.productsList, creditRequests: state.creditRequests, investment: state.investment, profile: state.profile }; }
export default connect(mapStateToProps, { getProductsList, getCreditRequestList, getInvestedList, getProfile })(Overview);
