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
  return new Intl.NumberFormat(Translator.getLocale() === 'de' ? 'de-DE' : 'en-IE', {
    style: 'currency', currency: 'EUR', maximumFractionDigits: 0
  }).format(amount);
};

class InvestedList extends Component {
  componentDidMount() {
    this.props.getInvestedList();
  }

  getInvestments = () => {
    if (!this.props.investments) return null;
    const list = Array.isArray(this.props.investments.list) ? this.props.investments.list : [];
    return list.filter(item => item && typeof item === 'object');
  };

  getTotalAllocated = investments => investments.reduce((total, investment) => {
    const amount = Number(investment.invested_amount);
    return total + (Number.isFinite(amount) ? amount : 0);
  }, 0);

  formatDate = value => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
  };

  renderMaturityLadder = investments => {
    if (!investments.length) return <div className="ap-empty ap-empty-compact"><strong>No invested positions yet.</strong><span>Maturity distribution will appear after capital is deployed.</span></div>;
    const maxDuration = Math.max(1, ...investments.map(item => Number(item.duration) || 0));
    const maxAmount = Math.max(1, ...investments.map(item => Number(item.invested_amount) || 0));

    return (
      <div className="ap-maturity-ladder" role="list" aria-label="Position maturity and allocation">
        {investments.map((investment, index) => {
          const duration = Number(investment.duration) || 0;
          const amount = Number(investment.invested_amount) || 0;
          const title = toText(investment.product_title) || toText(investment.name) || `Position ${index + 1}`;
          const durationWidth = Math.max(4, (duration / maxDuration) * 100);
          const amountOpacity = .34 + (amount / maxAmount) * .66;
          return (
            <div className="ap-maturity-row" role="listitem" key={investment.application_id || investment.product_id || index}>
              <div className="ap-maturity-copy"><strong>{title}</strong><small>{formatEuro(amount)} · {duration || '—'} months</small></div>
              <div className="ap-maturity-track" aria-hidden="true"><i style={{ width: `${durationWidth}%`, opacity: amountOpacity }} /></div>
              <span className="ap-mono">{duration || '—'}m</span>
            </div>
          );
        })}
      </div>
    );
  };

  renderRows = investments => {
    if (!investments.length) return <div className="ap-empty"><i className="bx bx-line-chart" aria-hidden="true" /><strong>No invested positions.</strong><span>Converted opportunities will appear in the live book.</span></div>;
    return investments.map((investment, index) => {
      const productId = investment.product_id || investment.id || '';
      const applicationId = investment.application_id || `POS-${index + 1}`;
      const creditorName = toText(investment.creditor_name) || toText(investment.requested_by) || 'Creditor';
      const productTitle = toText(investment.product_title) || toText(investment.name) || 'Untitled product';
      return (
        <Link className="ap-position-row" key={applicationId || `${productId}-${index}`} to={{ pathname: '/creditor/detail', state: { pId: productId, aId: applicationId, productId, appId: applicationId } }}>
          <span className="ap-position-main"><strong>{productTitle}</strong><small>{creditorName} · {applicationId}</small></span>
          <span className="ap-mono">{this.formatDate(investment.invested_on)}</span>
          <span className="ap-mono ap-money">{formatEuro(investment.invested_amount)}</span>
          <span className="ap-mono">{toText(investment.duration) || '—'}m</span>
          <span className="ap-status ap-status-invested"><i aria-hidden="true" />Invested</span>
          <span className="ap-row-arrow" aria-hidden="true">›</span>
        </Link>
      );
    });
  };

  render() {
    const investments = this.getInvestments();
    if (investments === null) return <div className="data-loading" role="status" aria-live="polite"><Spinner /></div>;

    const totalAllocated = this.getTotalAllocated(investments);
    const durations = investments.map(item => Number(item.duration)).filter(Number.isFinite);
    const averageDuration = durations.length ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0;
    const largest = investments.reduce((max, item) => Math.max(max, Number(item.invested_amount) || 0), 0);

    return (
      <Fragment>
        <Subheader heading={<Translate content="sidebar.invested_products" />} />

        <section className="ap-capital-tape" aria-label="Portfolio summary" data-motion="metric-grid">
          <article className="ap-metric"><span className="ap-metric-label"><i />Positions</span><strong>{investments.length}</strong><small>Investment records</small></article>
          <article className="ap-metric ap-metric-signal"><span className="ap-metric-label"><i />Allocated</span><strong className="ap-metric-money">{formatEuro(totalAllocated)}</strong><small>Total visible capital</small></article>
          <article className="ap-metric"><span className="ap-metric-label"><i />Average tenor</span><strong>{averageDuration || '—'}<em>m</em></strong><small>Across visible positions</small></article>
          <article className="ap-metric ap-metric-positive"><span className="ap-metric-label"><i />Largest position</span><strong className="ap-metric-money">{formatEuro(largest)}</strong><small>Current concentration peak</small></article>
        </section>

        <div className="ap-position-layout">
          <div className="ap-position-main-column">
            <section className="ap-maturity-panel" data-motion="table-shell">
              <div className="ap-section-rule"><div><strong>Maturity ladder</strong><span>Tenor length with allocation intensity</span></div><small>MONTHS</small></div>
              {this.renderMaturityLadder(investments)}
            </section>

            <section className="ap-position-list" data-motion="table-shell">
              <div className="ap-position-head"><span>Position</span><span>Invested on</span><span>Capital</span><span>Tenor</span><span>Status</span><span /></div>
              <div>{this.renderRows(investments)}</div>
            </section>
          </div>

          <aside className="ap-analysis-rail" aria-label="Exposure notes">
            <h3>Exposure notes</h3>
            <div className="ap-analysis-block"><span className="ap-analysis-label">Visible positions</span><strong>{investments.length}</strong><p>Number of investment records currently represented in this view.</p></div>
            <div className="ap-analysis-block"><span className="ap-analysis-label">Average tenor</span><strong>{averageDuration || '—'}{averageDuration ? 'm' : ''}</strong><p>Simple average of the duration field across visible positions.</p></div>
            <div className="ap-analysis-block"><span className="ap-analysis-label">Largest position</span><strong className="ap-analysis-text">{formatEuro(largest)}</strong><p>Largest single visible invested amount, useful for a quick concentration check.</p></div>
            <div className="ap-analysis-block"><span className="ap-analysis-label">Total allocated</span><strong className="ap-analysis-text">{formatEuro(totalAllocated)}</strong><p>Sum of invested amounts in the current dataset.</p></div>
          </aside>
        </div>
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return { investments: state.investment };
}

export default connect(mapStateToProps, { getInvestedList })(InvestedList);
