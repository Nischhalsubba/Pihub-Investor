import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getInvestedList } from '../../actions/invested';
import Subheader from '../general/Subheader';
import Spinner from '../general/Spinner';
import Translate from 'react-translate-component';

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

const formatEuro = value => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return '—';
  return new Intl.NumberFormat(Translator.getLocale() === 'de' ? 'de-DE' : 'en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);
};

const asDate = value => { const date = new Date(value); return Number.isNaN(date.getTime()) ? null : date; };
const addMonths = (value, months) => {
  const date = asDate(value);
  const duration = Number(months);
  if (!date || !Number.isFinite(duration)) return null;
  const result = new Date(date.getTime());
  result.setMonth(result.getMonth() + duration);
  return result;
};
const formatDate = value => { const date = value instanceof Date ? value : asDate(value); if (!date) return '—'; return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`; };

class InvestedList extends Component {
  componentDidMount() { this.props.getInvestedList(); }
  getInvestments = () => {
    if (!this.props.investments) return null;
    const list = Array.isArray(this.props.investments.list) ? this.props.investments.list : [];
    return list.filter(item => item && typeof item === 'object');
  };
  getTotalAllocated = investments => investments.reduce((total, item) => total + (Number(item.invested_amount) || 0), 0);

  renderMaturityLadder = investments => {
    if (!investments.length) return <div className="ap-empty ap-empty-compact"><strong>No invested positions yet.</strong><span>Maturity distribution will appear after capital is deployed.</span></div>;
    const maxDuration = Math.max(1, ...investments.map(item => Number(item.duration) || 0));
    const scaleMax = Math.max(12, Math.ceil(maxDuration / 12) * 12);
    const ticks = [0, .25, .5, .75, 1].map(fraction => Math.round(scaleMax * fraction));
    return <div className="maturity-chart" aria-label={`Maturity scale from 0 to ${scaleMax} months`}>
      <div className="maturity-axis" aria-hidden="true">{ticks.map((tick, index) => <span key={`${tick}-${index}`} style={{ left: `${index * 25}%` }}>{tick}m</span>)}</div>
      <div className="ap-maturity-ladder" role="list">{investments.map((investment, index) => {
        const duration = Number(investment.duration) || 0;
        const amount = Number(investment.invested_amount) || 0;
        const title = toText(investment.product_title) || toText(investment.name) || `Position ${index + 1}`;
        const width = Math.max(2, Math.min(100, (duration / scaleMax) * 100));
        return <div className="ap-maturity-row" role="listitem" key={investment.application_id || investment.product_id || index}><div className="ap-maturity-copy"><strong>{title}</strong><small>{formatEuro(amount)} · {duration || '—'} months</small></div><div className="ap-maturity-track" aria-hidden="true"><i style={{ width: `${width}%` }} /></div><span className="ap-mono">{duration || '—'}m</span></div>;
      })}</div>
      <p className="chart-definition">Bar length encodes contractual tenor against the {scaleMax}-month axis. It does not represent percentage allocation.</p>
    </div>;
  };

  renderRows = (investments, totalAllocated) => {
    if (!investments.length) return <div className="ap-empty"><strong>No invested positions.</strong><span>Converted opportunities will appear in the live book.</span></div>;
    return investments.map((investment, index) => {
      const productId = investment.product_id || investment.id || '';
      const applicationId = investment.application_id || `POS-${index + 1}`;
      const creditorName = toText(investment.creditor_name) || toText(investment.requested_by) || 'Creditor';
      const productTitle = toText(investment.product_title) || toText(investment.name) || 'Untitled product';
      const amount = Number(investment.invested_amount) || 0;
      const share = totalAllocated > 0 ? (amount / totalAllocated) * 100 : 0;
      const maturity = addMonths(investment.invested_on, investment.duration);
      return <Link className="portfolio-row" key={applicationId || `${productId}-${index}`} to={`/positions/${encodeURIComponent(productId)}/${encodeURIComponent(applicationId)}`}><span className="ap-position-main"><strong>{productTitle}</strong><small>{creditorName} · {applicationId}</small></span><span className="ap-mono">{formatDate(investment.invested_on)}</span><span className="ap-mono ap-money">{formatEuro(amount)}</span><span className="ap-mono">{toText(investment.duration) || '—'}m</span><span className="ap-mono">{formatDate(maturity)}</span><span className="ap-mono">{share ? `${share.toFixed(1)}%` : '—'}</span><span className="ap-row-arrow" aria-hidden="true">›</span></Link>;
    });
  };

  render() {
    const investments = this.getInvestments();
    if (investments === null) return <div className="data-loading" role="status" aria-live="polite"><Spinner /></div>;
    const totalAllocated = this.getTotalAllocated(investments);
    const durations = investments.map(item => Number(item.duration)).filter(Number.isFinite);
    const averageDuration = durations.length ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0;
    const largest = investments.reduce((max, item) => Math.max(max, Number(item.invested_amount) || 0), 0);
    const largestShare = totalAllocated > 0 ? (largest / totalAllocated) * 100 : 0;
    const maturities = investments.map(item => ({ item, date: addMonths(item.invested_on, item.duration) })).filter(entry => entry.date).sort((a, b) => a.date - b.date);
    const nextMaturity = maturities.find(entry => entry.date.getTime() >= Date.now());
    const within12Months = maturities.filter(entry => { const months = (entry.date.getTime() - Date.now()) / (30.4375 * 86400000); return months >= 0 && months <= 12; }).length;
    const counterparties = Array.from(new Set(investments.map(item => toText(item.creditor_name) || toText(item.requested_by)).filter(Boolean)));

    return <Fragment>
      <Subheader heading={<Translate content="sidebar.invested_products" />} description="Monitor contractual maturity, concentration and position-level capital exposure." />
      <section className="ap-capital-tape" aria-label="Portfolio summary" data-motion="metric-grid"><article className="ap-metric"><span className="ap-metric-label"><i />Positions</span><strong>{investments.length}</strong><small>Visible investment records</small></article><article className="ap-metric ap-metric-signal"><span className="ap-metric-label"><i />Allocated</span><strong className="ap-metric-money">{formatEuro(totalAllocated)}</strong><small>Total visible capital</small></article><article className="ap-metric"><span className="ap-metric-label"><i />Average tenor</span><strong>{averageDuration || '—'}<em>m</em></strong><small>Contractual duration</small></article><article className="ap-metric ap-metric-warning"><span className="ap-metric-label"><i />Next maturity</span><strong className="ap-metric-date">{nextMaturity ? formatDate(nextMaturity.date) : '—'}</strong><small>{nextMaturity ? toText(nextMaturity.item.product_title) || 'Position' : 'No future maturity visible'}</small></article></section>
      <section className="ap-maturity-panel" data-motion="table-shell"><div className="ap-section-rule"><div><strong>Maturity ladder</strong><span>Contractual tenor shown against an explicit month scale</span></div></div>{this.renderMaturityLadder(investments)}</section>
      <section className="portfolio-facts" aria-label="Portfolio decision facts"><div><span>Largest concentration</span><strong>{largestShare ? `${largestShare.toFixed(1)}%` : '—'}</strong><small>Largest position as share of visible capital</small></div><div><span>Maturing within 12 months</span><strong>{within12Months}</strong><small>Derived from invested date plus tenor</small></div><div><span>Counterparties</span><strong>{counterparties.length}</strong><small>Unique visible creditor names</small></div></section>
      <section className="portfolio-table" aria-label="Invested position book" data-motion="table-shell"><div className="portfolio-head"><span>Position</span><span>Invested</span><span>Capital</span><span>Tenor</span><span>Maturity</span><span>Share</span><span /></div><div>{this.renderRows(investments, totalAllocated)}</div></section>
    </Fragment>;
  }
}

function mapStateToProps(state) { return { investments: state.investment }; }
export default connect(mapStateToProps, { getInvestedList })(InvestedList);
