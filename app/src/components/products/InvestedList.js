import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getInvestedList } from '../../actions/invested';
import Subheader from '../general/Subheader';
import Spinner from '../general/Spinner';
import Translate from 'react-translate-component';
import { ToEuro } from '../general/CurrencyFormatter';

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

class InvestedList extends Component {
  state = { investments: null };

  componentDidMount() {
    this.props.getInvestedList();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.investments !== this.props.investments && this.props.investments) {
      const list = Array.isArray(this.props.investments.list) ? this.props.investments.list : [];
      this.setState({ investments: list.filter(item => item && typeof item === 'object') });
    }
  }

  getTotalAllocated = investments => investments.reduce((total, investment) => {
    const amount = Number(investment.invested_amount);
    return total + (Number.isFinite(amount) ? amount : 0);
  }, 0);

  formatDate = value => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
  };

  renderList = investments => {
    if (!investments.length) {
      return (
        <tr>
          <td colSpan="5">
            <div className="data-empty">
              <i className="bx bx-line-chart" aria-hidden="true" />
              <strong><Translate content="placeholder.noActiveProduct" /></strong>
              <span>{Translator.getLocale() === 'de' ? 'Investierte Positionen erscheinen hier.' : 'Invested positions will appear here.'}</span>
            </div>
          </td>
        </tr>
      );
    }

    return investments.map((investment, index) => {
      const productId = investment.product_id || investment.id || '';
      const applicationId = investment.application_id || `DEMO-APP-${index + 1}`;
      const creditorName = toText(investment.creditor_name) || toText(investment.requested_by) || 'Demo creditor';
      const productTitle = toText(investment.product_title) || toText(investment.name) || 'Untitled product';
      const rowKey = applicationId || `${productId}-${index}`;

      return (
        <tr key={rowKey}>
          <td>
            <Link className="entity-title" to={{ pathname: '/creditor/detail', state: { pId: productId, aId: applicationId, productId, appId: applicationId } }}>
              {creditorName}
            </Link>
          </td>
          <td>
            <Link to={{ pathname: '/product', state: { id: productId } }}>{productTitle}</Link>
            {productId ? <small className="entity-meta">#{productId}</small> : null}
          </td>
          <td className="data-nowrap mono-value">{this.formatDate(investment.invested_on)}</td>
          <td className="data-nowrap money-value"><ToEuro amount={investment.invested_amount} /></td>
          <td className="data-nowrap"><span className="mono-value">{toText(investment.duration) || '—'}</span> <Translate content="label.months" /></td>
        </tr>
      );
    });
  };

  render() {
    const investments = this.state.investments;
    const totalAllocated = investments ? this.getTotalAllocated(investments) : 0;

    return (
      <Fragment>
        <Subheader heading={<Translate content="sidebar.invested_products" />} />

        {investments ? (
          <section className="metric-grid metric-grid-compact" aria-label="Portfolio summary" data-motion="metric-grid">
            <article className="metric-card">
              <span className="metric-label">{Translator.getLocale() === 'de' ? 'Positionen' : 'Positions'}</span>
              <strong>{investments.length}</strong>
              <small>{Translator.getLocale() === 'de' ? 'Aktive Einträge' : 'Investment records'}</small>
            </article>
            <article className="metric-card metric-card-info metric-card-wide">
              <span className="metric-label"><Translate content="column.investedamount" /></span>
              <strong className="metric-money"><ToEuro amount={totalAllocated} /></strong>
              <small>{Translator.getLocale() === 'de' ? 'Gesamt in dieser Ansicht' : 'Total in this view'}</small>
            </article>
          </section>
        ) : null}

        {!investments ? (
          <div className="data-loading" role="status" aria-live="polite"><Spinner /></div>
        ) : (
          <section className="table-shell" data-motion="table-shell" aria-label="Portfolio positions">
            <div className="table-caption">
              <div>
                <strong>{Translator.getLocale() === 'de' ? 'Portfolio' : 'Portfolio positions'}</strong>
                <span>{investments.length} {Translator.getLocale() === 'de' ? 'Einträge' : 'records'}</span>
              </div>
              <small>EUR</small>
            </div>
            <div className="table-scroll">
              <table className="table" data-tablesaw-mode="stack">
                <thead>
                  <tr>
                    <th><Translate content="column.creditorsname" /></th>
                    <th><Translate content="column.productname" /></th>
                    <th><Translate content="column.approvedon" /></th>
                    <th><Translate content="column.investedamount" /></th>
                    <th><Translate content="column.duration" /></th>
                  </tr>
                </thead>
                <tbody>{this.renderList(investments)}</tbody>
              </table>
            </div>
          </section>
        )}
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return { investments: state.investment };
}

export default connect(mapStateToProps, { getInvestedList })(InvestedList);
