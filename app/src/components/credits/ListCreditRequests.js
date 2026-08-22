import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Subheader from '../general/Subheader';
import { getCreditRequestList } from '../../actions/credits';
import Pagination from '../general/Pagination';
import Spinner from '../general/Spinner';
import Translate from 'react-translate-component';
import { dDigit } from '../../_utils/misc';

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
  const map = {
    requested: locale === 'de' ? 'Angefragt' : 'Requested',
    invested: locale === 'de' ? 'Investiert' : 'Invested',
    approved: locale === 'de' ? 'Genehmigt' : 'Approved',
    rejected: locale === 'de' ? 'Abgelehnt' : 'Rejected',
    postponed: locale === 'de' ? 'Verschoben' : 'Postponed'
  };
  return map[status] || status || '—';
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

  getRows = () => {
    if (!this.props.list || !this.props.list.creditRequests) return null;
    const raw = this.props.list.creditRequests.data;
    return Array.isArray(raw) ? raw.filter(item => item && typeof item === 'object') : [];
  };

  getNearestDeadline = data => {
    const valid = data.map(item => new Date(item.deadline)).filter(date => !Number.isNaN(date.getTime()) && date.getTime() >= Date.now()).sort((a, b) => a - b);
    return valid[0] || null;
  };

  renderRows = data => {
    if (!data.length) return <div className="ap-empty"><i className="bx bx-receipt" aria-hidden="true" /><strong>No credit requests in this view.</strong><span>New submissions will appear in the decision queue.</span></div>;

    return data.map((product, index) => {
      const status = toText(product.status);
      const detailPath = status === 'invested' ? '/creditor/detail' : '/application';
      const productId = product.product_id || product.id || '';
      const applicationId = product.application_id || `REQ-${index + 1}`;
      const productTitle = toText(product.product_title) || toText(product.name) || 'Untitled product';
      const creditorName = toText(product.creditor_name) || toText(product.requested_by) || 'Creditor';
      const serviceName = product.service && product.service.name !== undefined ? toText(product.service.name) : toText(product.service);
      const detailState = status === 'invested'
        ? { productId, appId: applicationId, pId: productId, aId: applicationId }
        : { pId: productId, aId: applicationId, product: productTitle };

      return (
        <Link className="ap-queue-row" key={applicationId || `${productId}-${index}`} to={{ pathname: detailPath, state: detailState }}>
          <span className="ap-queue-id">{String(index + 1).padStart(2, '0')}</span>
          <span className="ap-queue-primary"><strong>{creditorName}</strong><small>{applicationId}</small></span>
          <span className="ap-queue-primary"><strong>{productTitle}</strong><small>{productId || '—'}</small></span>
          <span>{serviceName || '—'}</span>
          <span className="ap-mono">{this.formatDate(product.created_on)}</span>
          <span className="ap-mono">{this.formatDate(product.deadline)}</span>
          <span className={`ap-status ap-status-${status || 'neutral'}`}><i aria-hidden="true" />{statusLabel(status)}</span>
          <span className="ap-row-arrow" aria-hidden="true">›</span>
        </Link>
      );
    });
  };

  render() {
    const data = this.getRows();
    if (data === null) return <div className="data-loading" role="status" aria-live="polite"><Spinner /></div>;

    const invested = data.filter(item => toText(item.status) === 'invested').length;
    const pending = data.filter(item => toText(item.status) !== 'invested').length;
    const services = Array.from(new Set(data.map(item => item.service && item.service.name !== undefined ? toText(item.service.name) : toText(item.service)).filter(Boolean)));
    const nearest = this.getNearestDeadline(data);

    return (
      <Fragment>
        <Subheader heading={<Translate content="label.creditrequests" />} />

        <section className="ap-capital-tape" aria-label="Decision queue summary" data-motion="metric-grid">
          <article className="ap-metric"><span className="ap-metric-label"><i />Requests</span><strong>{data.length}</strong><small>On this page</small></article>
          <article className="ap-metric ap-metric-warning"><span className="ap-metric-label"><i />Pending</span><strong>{pending}</strong><small>Require review</small></article>
          <article className="ap-metric ap-metric-positive"><span className="ap-metric-label"><i />Invested</span><strong>{invested}</strong><small>Converted positions</small></article>
          <article className="ap-metric ap-metric-signal"><span className="ap-metric-label"><i />Nearest deadline</span><strong className="ap-metric-date">{nearest ? this.formatDate(nearest) : '—'}</strong><small>Next dated submission</small></article>
        </section>

        <div className="ap-queue-layout">
          <section className="ap-queue" aria-label="Credit decision queue" data-motion="table-shell">
            <div className="ap-section-rule"><div><strong>Decision queue</strong><span>{data.length} active records</span></div><small>CR/02</small></div>
            <div className="ap-queue-head"><span>#</span><span>Creditor</span><span>Opportunity</span><span>Facility</span><span>Created</span><span>Deadline</span><span>Status</span><span /></div>
            <div className="ap-queue-body">{this.renderRows(data)}</div>
            <div className="ap-ledger-pagination"><Pagination url="creditRequest" /></div>
          </section>

          <aside className="ap-analysis-rail" aria-label="Queue intelligence">
            <h3>Queue intelligence</h3>
            <div className="ap-analysis-block"><span className="ap-analysis-label">Pending decisions</span><strong>{pending}</strong><p>Requests on this page that have not yet converted to invested positions.</p></div>
            <div className="ap-analysis-block"><span className="ap-analysis-label">Nearest deadline</span><strong className="ap-analysis-text">{nearest ? this.formatDate(nearest) : 'None dated'}</strong><p>Earliest future deadline visible in the current queue.</p></div>
            <div className="ap-analysis-block"><span className="ap-analysis-label">Facilities represented</span><strong>{services.length}</strong><p>{services.length ? services.join(' · ') : 'No classified facilities in this result set.'}</p></div>
            <div className="ap-analysis-block"><span className="ap-analysis-label">Investment conversions</span><strong>{invested}</strong><p>Records already represented as invested positions.</p></div>
          </aside>
        </div>
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return { list: state.creditRequests };
}

export default connect(mapStateToProps, { getCreditRequestList })(ListCreditRequests);
