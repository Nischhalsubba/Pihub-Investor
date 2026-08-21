import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Subheader from '../general/Subheader';
import { getCreditRequestList } from '../../actions/credits';
import Pagination from '../general/Pagination';
import Spinner from '../general/Spinner';
import Translate from 'react-translate-component';
import { dDigit } from '../../_utils/misc';
import { matchesInvestorStatus } from '../../_status';

const Translator = require('react-translate-component');

class ListCreditRequests extends Component {
  componentDidMount() {
    this.props.getCreditRequestList(1);
  }

  formatDate = value => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return `${dDigit(date.getDate())}.${dDigit(date.getMonth() + 1)}.${date.getFullYear()}`;
  };

  renderStatus = status => {
    const meta = matchesInvestorStatus[status];
    if (!meta) return <span className="badge badge-light">{status || '—'}</span>;
    return <span className={`badge ${meta.class}`}><Translate content={meta.translation_key} /></span>;
  };

  renderData = data => {
    if (!data.length) {
      return (
        <tr>
          <td colSpan="6">
            <div className="data-empty">
              <i className="bx bx-receipt" aria-hidden="true" />
              <strong><Translate content="placeholder.noCreditRequests" /></strong>
              <span>{Translator.getLocale() === 'de' ? 'Neue Kreditanfragen erscheinen hier.' : 'New credit requests will appear here.'}</span>
            </div>
          </td>
        </tr>
      );
    }

    return data.map(product => {
      const detailPath = product.status === 'invested' ? '/creditor/detail' : '/application';
      const detailState = product.status === 'invested'
        ? { productId: product.product_id, appId: product.application_id }
        : { pId: product.product_id, aId: product.application_id, product: product.name };
      const rowKey = product.application_id || `${product.product_id}-${product.created_on}`;

      return (
        <tr key={rowKey}>
          <td>
            <Link className="entity-title" to={{ pathname: detailPath, state: detailState }}>{product.creditor_name}</Link>
            {product.application_id ? <small className="entity-meta">#{product.application_id}</small> : null}
          </td>
          <td>
            <Link to={{ pathname: '/product', state: { id: product.product_id } }}>{product.product_title}</Link>
            <small className="entity-meta">#{product.product_id}</small>
          </td>
          <td>{product.service ? product.service.name[Translator.getLocale()] : <Translate content="placeholder.notAvailable" />}</td>
          <td className="data-nowrap mono-value">{this.formatDate(product.created_on)}</td>
          <td className="data-nowrap mono-value">{this.formatDate(product.deadline)}</td>
          <td>{this.renderStatus(product.status)}</td>
        </tr>
      );
    });
  };

  render() {
    if (!this.props.list || !this.props.list.creditRequests) {
      return <div className="data-loading" role="status" aria-live="polite"><Spinner /></div>;
    }

    const data = this.props.list.creditRequests.data || [];
    const invested = data.filter(item => item.status === 'invested').length;

    return (
      <Fragment>
        <Subheader heading={<Translate content="label.creditrequests" />} />

        <section className="metric-grid metric-grid-compact" aria-label="Credit request summary" data-motion="metric-grid">
          <article className="metric-card">
            <span className="metric-label">{Translator.getLocale() === 'de' ? 'Anfragen' : 'Requests'}</span>
            <strong>{data.length}</strong>
            <small>{Translator.getLocale() === 'de' ? 'Auf dieser Seite' : 'On this page'}</small>
          </article>
          <article className="metric-card metric-card-success">
            <span className="metric-label"><Translate content="label.invested" /></span>
            <strong>{invested}</strong>
            <small>{Translator.getLocale() === 'de' ? 'Abgeschlossene Investitionen' : 'Converted to investment'}</small>
          </article>
        </section>

        <section className="table-shell" data-motion="table-shell" aria-label="Credit requests">
          <div className="table-caption">
            <div>
              <strong><Translate content="label.creditrequests" /></strong>
              <span>{data.length} {Translator.getLocale() === 'de' ? 'Ergebnisse auf dieser Seite' : 'results on this page'}</span>
            </div>
          </div>
          <div className="table-scroll">
            <table className="table" data-tablesaw-mode="stack">
              <thead>
                <tr>
                  <th><Translate content="column.creditorsname" /></th>
                  <th><Translate content="column.productname" /></th>
                  <th><Translate content="column.services" /></th>
                  <th><Translate content="column.createdon" /></th>
                  <th><Translate content="label.deadline" /></th>
                  <th><Translate content="column.status" /></th>
                </tr>
              </thead>
              <tbody>{this.renderData(data)}</tbody>
            </table>
          </div>
          <Pagination url="creditRequest" />
        </section>
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return { list: state.creditRequests };
}

export default connect(mapStateToProps, { getCreditRequestList })(ListCreditRequests);
