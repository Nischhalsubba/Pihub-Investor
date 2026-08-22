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
    const normalizedStatus = toText(status);
    const meta = matchesInvestorStatus[normalizedStatus];
    if (!meta) return <span className="badge badge-light">{normalizedStatus || '—'}</span>;
    return <span className={`badge ${meta.class}`}><Translate content={meta.translation_key} /></span>;
  };

  renderData = data => {
    const rows = Array.isArray(data) ? data.filter(item => item && typeof item === 'object') : [];
    if (!rows.length) {
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

    return rows.map((product, index) => {
      const status = toText(product.status);
      const detailPath = status === 'invested' ? '/creditor/detail' : '/application';
      const productId = product.product_id || product.id || '';
      const applicationId = product.application_id || `DEMO-APP-${index + 1}`;
      const productTitle = toText(product.product_title) || toText(product.name) || 'Untitled product';
      const creditorName = toText(product.creditor_name) || toText(product.requested_by) || 'Demo creditor';
      const serviceName = product.service && product.service.name !== undefined
        ? toText(product.service.name)
        : toText(product.service);
      const detailState = status === 'invested'
        ? { productId, appId: applicationId, pId: productId, aId: applicationId }
        : { pId: productId, aId: applicationId, product: productTitle };
      const rowKey = applicationId || `${productId}-${index}`;

      return (
        <tr key={rowKey}>
          <td>
            <Link className="entity-title" to={{ pathname: detailPath, state: detailState }}>{creditorName}</Link>
            {applicationId ? <small className="entity-meta">#{applicationId}</small> : null}
          </td>
          <td>
            <Link to={{ pathname: '/product', state: { id: productId } }}>{productTitle}</Link>
            {productId ? <small className="entity-meta">#{productId}</small> : null}
          </td>
          <td>{serviceName || <Translate content="placeholder.notAvailable" />}</td>
          <td className="data-nowrap mono-value">{this.formatDate(product.created_on)}</td>
          <td className="data-nowrap mono-value">{this.formatDate(product.deadline)}</td>
          <td>{this.renderStatus(status)}</td>
        </tr>
      );
    });
  };

  render() {
    if (!this.props.list || !this.props.list.creditRequests) {
      return <div className="data-loading" role="status" aria-live="polite"><Spinner /></div>;
    }

    const rawData = this.props.list.creditRequests.data;
    const data = Array.isArray(rawData) ? rawData.filter(item => item && typeof item === 'object') : [];
    const invested = data.filter(item => toText(item.status) === 'invested').length;

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
