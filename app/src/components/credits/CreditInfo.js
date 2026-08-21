import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Subheader from '../general/Subheader';
import { getApplicationDetail } from '../../actions/application';
import Translate from 'react-translate-component';
import { ToEuro } from '../general/CurrencyFormatter';
import { dDigit } from '../../_utils/misc';
import { matchesInvestorStatus } from '../../_status';
import { downloadToken } from '../../actions/download';

const Translator = require('react-translate-component');

class CreditInfo extends Component {
  state = { detail: null };

  componentDidMount() {
    if (this.props.detail) {
      this.setState({ detail: this.props.detail });
      return;
    }
    this.fetchDetail();
  }

  componentDidUpdate(prevProps) {
    if (this.props.detail !== prevProps.detail && this.props.detail) {
      this.setState({ detail: this.props.detail });
      return;
    }
    if (!this.props.detail && this.props.data !== prevProps.data && this.props.data) {
      this.setState({ detail: this.props.data.detail });
    }
  }

  fetchDetail = () => {
    if (!this.props.location || !this.props.location.state) return;
    let { pId, aId } = this.props.location.state;
    if (!pId || !aId) {
      const { appId, productId } = this.props.location.state;
      pId = productId;
      aId = appId;
    }
    if (pId && aId) this.props.getApplicationDetail(pId, aId);
  };

  getName = value => {
    if (!value) return '—';
    if (typeof value.name === 'string') return value.name;
    if (value.name && typeof value.name === 'object') {
      return value.name[Translator.getLocale()] || value.name.en || value.name.de || '—';
    }
    if (typeof value === 'string') return value;
    return '—';
  };

  formatDate = value => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return `${dDigit(date.getDate())}.${dDigit(date.getMonth() + 1)}.${date.getFullYear()}`;
  };

  renderNameValue = values => {
    if (!Array.isArray(values) || !values.length) return <div className="detail-empty"><Translate content="placeholder.notAvailable" /></div>;
    return values.map((item, index) => (
      <div className="detail-item" key={`${item.name || 'item'}-${index}`}>
        <span>{item.name || '—'}</span>
        <strong>{item.value || '—'}</strong>
      </div>
    ));
  };

  renderIndustries = industries => {
    if (!Array.isArray(industries) || !industries.length) return '—';
    return industries.map(item => this.getName(item)).filter(Boolean).join(', ');
  };

  renderDocs = docs => {
    if (!Array.isArray(docs) || !docs.length) return <div className="detail-empty"><Translate content="column.noattachment" /></div>;
    return docs.map((doc, index) => (
      <button
        className="document-row"
        type="button"
        key={`${doc.path || doc.file_name}-${index}`}
        onClick={() => this.props.downloadToken(doc.path, doc.file_name, doc.file_type)}
      >
        <span className="document-icon" aria-hidden="true"><i className="bx bx-file" /></span>
        <span className="document-copy"><strong>{doc.file_name || `File ${index + 1}`}</strong><small>{doc.file_type || 'Document'}</small></span>
        <i className="bx bx-download document-download" aria-hidden="true" />
      </button>
    ));
  };

  renderStatus = status => {
    const meta = matchesInvestorStatus[status];
    return meta
      ? <span className={`badge ${meta.class}`}><Translate content={meta.translation_key} /></span>
      : <span className="badge badge-light">{status || '—'}</span>;
  };

  render() {
    const detail = this.props.detail || this.state.detail;
    if (!detail) return <div className="data-loading" role="status" aria-live="polite"><Translate content="placeholder.justASecond" /></div>;

    const {
      requested_by,
      requested_on,
      amount,
      deadline,
      description,
      payment_after,
      sales,
      status,
      application_files,
      time_duration,
      collaterals,
      state,
      county,
      nda_requirement,
      service,
      industries,
      ratings
    } = detail;

    const isGerman = Translator.getLocale() === 'de';
    const productName = this.props.location && this.props.location.state ? this.props.location.state.product : null;

    return (
      <Fragment>
        {this.props.showHeader !== false ? <Subheader heading={productName || (isGerman ? 'Kreditanfrage' : 'Credit request')} /> : null}

        {status === 'rejected' ? <div className="alert alert-danger"><Translate content="column.appreject" /></div> : null}
        {status === 'accepted' ? <div className="alert alert-success"><Translate content="column.appaccept" /></div> : null}

        <section className="detail-hero" data-motion="metric-grid" aria-label="Credit request summary">
          <article><span><Translate content="label.requestedamount" /></span><strong className="detail-money"><ToEuro amount={amount} /></strong></article>
          <article><span><Translate content="label.time" /></span><strong><span className="mono-value">{time_duration || '—'}</span> <Translate content="label.months" /></strong></article>
          <article><span><Translate content="label.deadline" /></span><strong className="mono-value">{this.formatDate(deadline)}</strong></article>
          <article><span><Translate content="label.status" /></span><strong>{this.renderStatus(status)}</strong></article>
        </section>

        <div className="detail-layout">
          <section className="detail-panel" data-motion="table-shell" aria-labelledby="credit-overview-title">
            <div className="detail-panel-header"><div><span>{isGerman ? 'Anfrage' : 'Request'}</span><h2 id="credit-overview-title">{isGerman ? 'Kreditdetails' : 'Credit details'}</h2></div></div>
            <div className="detail-grid">
              <div className="detail-item"><span><Translate content="label.state" /></span><strong>{this.getName(state)}</strong></div>
              <div className="detail-item"><span><Translate content="label.county" /></span><strong>{this.getName(county)}</strong></div>
              <div className="detail-item"><span><Translate content="column.credittype" /></span><strong>{this.getName(service)}</strong></div>
              <div className="detail-item"><span><Translate content="label.salesAmount" /></span><strong className="mono-value"><ToEuro amount={sales} /></strong></div>
              <div className="detail-item"><span><Translate content="label.industries" /></span><strong>{this.renderIndustries(industries)}</strong></div>
              <div className="detail-item"><span><Translate content="column.requestedby" /></span><strong>{requested_by || '—'}</strong></div>
              <div className="detail-item"><span><Translate content="column.requeston" /></span><strong className="mono-value">{this.formatDate(requested_on)}</strong></div>
              <div className="detail-item"><span><Translate content="label.deadlineForPayment" /></span><strong className="mono-value">{this.formatDate(payment_after)}</strong></div>
              <div className="detail-item"><span><Translate content="label.nda" /></span><strong>{nda_requirement ? <Translate content="label.yes" /> : <Translate content="label.no" />}</strong></div>
              <div className="detail-item"><span><Translate content="label.reasons" /></span><strong>{description || '—'}</strong></div>
            </div>
          </section>

          <aside className="detail-side-stack">
            <section className="detail-panel" aria-labelledby="ratings-credit-title">
              <div className="detail-panel-header"><div><span>{isGerman ? 'Risiko' : 'Risk'}</span><h2 id="ratings-credit-title"><Translate content="label.ratingForCredit" /></h2></div></div>
              <div className="detail-grid detail-grid-single">{this.renderNameValue(ratings)}</div>
            </section>

            <section className="detail-panel" aria-labelledby="collateral-title">
              <div className="detail-panel-header"><div><span>{isGerman ? 'Sicherheiten' : 'Security'}</span><h2 id="collateral-title"><Translate content="label.collaterals" /></h2></div></div>
              <div className="detail-grid detail-grid-single">{this.renderNameValue(collaterals)}</div>
            </section>

            <section className="detail-panel" aria-labelledby="application-files-title">
              <div className="detail-panel-header"><div><span>{isGerman ? 'Unterlagen' : 'Files'}</span><h2 id="application-files-title"><Translate content="label.attachments" /></h2></div></div>
              <div className="document-list">{this.renderDocs(application_files)}</div>
            </section>
          </aside>
        </div>
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return { data: state.applicationDetail };
}

export default connect(mapStateToProps, { getApplicationDetail, downloadToken })(CreditInfo);
