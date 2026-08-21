import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { getProductById, deleteProduct, postponeProduct } from '../../actions/product';
import { downloadToken } from '../../actions/download';
import RequestedByList from '../credits/RequestedByList';
import Subheader from '../general/Subheader';
import Translate from 'react-translate-component';
import { ToEuro } from '../general/CurrencyFormatter';

const Translator = require('react-translate-component');

class ViewProduct extends Component {
  componentDidMount() {
    if (!this.props.location.state) {
      this.props.history.push('/products');
      return;
    }
    this.props.getProductById(this.props.location.state.id);
  }

  getLocalizedName = value => {
    if (!value || !value.name) return null;
    return value.name[Translator.getLocale()] || value.name.en || value.name.de || null;
  };

  renderStatus = status => {
    const map = {
      requested: ['badge-warning', 'label.requested'],
      approved: ['badge-success', 'label.approved'],
      rejected: ['badge-danger', 'label.rejected'],
      invested: ['badge-success', 'label.invested'],
      open: ['badge-info', 'label.open'],
      postponed: ['badge-secondary', 'label.postponed'],
      deleted: ['badge-light', 'label.deleted'],
      suspended: ['badge-info', 'label.suspended']
    };
    const value = map[status];
    return value ? <span className={`badge ${value[0]}`}><Translate content={value[1]} /></span> : <span className="badge badge-light">{status || '—'}</span>;
  };

  listNames = values => {
    if (!Array.isArray(values) || !values.length) return '—';
    return values.filter(Boolean).join(', ');
  };

  listIndustries = industries => {
    if (!Array.isArray(industries) || !industries.length) return '—';
    return industries
      .map(industry => this.getLocalizedName(industry))
      .filter(Boolean)
      .join(', ');
  };

  renderRatings = ratings => {
    if (!Array.isArray(ratings) || !ratings.length) {
      return <div className="detail-empty"><Translate content="column.norating" /></div>;
    }
    return ratings.map(rating => (
      <div className="detail-item" key={`${rating.name}-${rating.value}`}>
        <span>{rating.name}</span>
        <strong>{rating.value}</strong>
      </div>
    ));
  };

  renderDocuments = documents => {
    if (!Array.isArray(documents) || !documents.length) {
      return <div className="detail-empty"><Translate content="column.noattachment" /></div>;
    }

    return documents.map((doc, index) => (
      <button
        className="document-row"
        type="button"
        key={`${doc.path || doc.file_name}-${index}`}
        onClick={() => this.props.downloadToken(doc.path, doc.file_name, doc.file_type)}
      >
        <span className="document-icon" aria-hidden="true"><i className="bx bx-file" /></span>
        <span className="document-copy">
          <strong>{doc.file_name}</strong>
          <small>{doc.file_type || 'Document'}</small>
        </span>
        <i className="bx bx-download document-download" aria-hidden="true" />
      </button>
    ));
  };

  handleDelete = id => {
    const message = Translator.getLocale() === 'de'
      ? 'Dieses Produkt wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.'
      : 'Delete this product? This action cannot be undone.';
    if (!window.confirm(message)) return;
    this.props.deleteProduct(id, () => this.props.history.push('/products'));
  };

  render() {
    if (!this.props.product) {
      return <div className="data-loading" role="status" aria-live="polite"><Translate content="placeholder.justASecond" /></div>;
    }

    const {
      id,
      product_code,
      collatoral,
      max_credit_amount,
      min_credit_amount,
      industries,
      status,
      min_time_duration,
      max_time_duration,
      product_title,
      service,
      states,
      ratings,
      County,
      documents,
      min_sales_creditor
    } = this.props.product;

    const isGerman = Translator.getLocale() === 'de';

    return (
      <Fragment>
        {status === 'deleted' ? <div className="alert alert-danger" role="status"><Translate content="label.deletedmsg" /></div> : null}
        {status === 'postponed' ? <div className="alert alert-warning" role="status"><Translate content="label.postponedmsg" /></div> : null}

        <Subheader
          heading={product_title || <Translate content="label.Produktdetail" />}
          kicker={isGerman ? 'Produktdetail' : 'Product detail'}
          description={product_code ? `${isGerman ? 'Produktcode' : 'Product code'}: ${product_code}` : null}
          buttonLabel={status !== 'deleted' ? <Translate content="button.Produktbearbeiten" /> : null}
          link={status !== 'deleted' ? '/edit-product' : null}
          linkState={{ id }}
        />

        <section className="detail-hero" data-motion="metric-grid" aria-label="Product summary">
          <article>
            <span><Translate content="column.status" /></span>
            <strong className="detail-status-value">{this.renderStatus(status)}</strong>
          </article>
          <article>
            <span><Translate content="column.minimum_credit_amount" /></span>
            <strong className="detail-money"><ToEuro amount={min_credit_amount} /></strong>
          </article>
          <article>
            <span><Translate content="label.maxcredit" /></span>
            <strong className="detail-money"><ToEuro amount={max_credit_amount} /></strong>
          </article>
          <article>
            <span><Translate content="column.duration" /></span>
            <strong><span className="mono-value">{min_time_duration}–{max_time_duration}</span> <Translate content="label.months" /></strong>
          </article>
        </section>

        <div className="detail-layout">
          <section className="detail-panel" data-motion="table-shell" aria-labelledby="product-overview-title">
            <div className="detail-panel-header">
              <div>
                <span>{isGerman ? 'Struktur' : 'Structure'}</span>
                <h2 id="product-overview-title">{isGerman ? 'Produktübersicht' : 'Product overview'}</h2>
              </div>
            </div>
            <div className="detail-grid">
              <div className="detail-item">
                <span><Translate content="label.service" /></span>
                <strong>{this.getLocalizedName(service) || '—'}</strong>
              </div>
              <div className="detail-item">
                <span><Translate content="label.state" /></span>
                <strong>{this.listNames(states)}</strong>
              </div>
              <div className="detail-item">
                <span><Translate content="label.county" /></span>
                <strong>{this.listNames(County)}</strong>
              </div>
              <div className="detail-item">
                <span><Translate content="label.industries" /></span>
                <strong>{this.listIndustries(industries)}</strong>
              </div>
              <div className="detail-item">
                <span><Translate content="label.minimumsales" /></span>
                <strong className="mono-value"><ToEuro amount={min_sales_creditor} /></strong>
              </div>
              <div className="detail-item">
                <span><Translate content="label.Sicherheiten" /></span>
                <strong>{collatoral ? <Translate content="label.yes" /> : <Translate content="label.no" />}</strong>
              </div>
            </div>
          </section>

          <aside className="detail-side-stack">
            <section className="detail-panel" aria-labelledby="ratings-title">
              <div className="detail-panel-header">
                <div>
                  <span>{isGerman ? 'Risiko' : 'Risk'}</span>
                  <h2 id="ratings-title"><Translate content="label.rating" /></h2>
                </div>
              </div>
              <div className="detail-grid detail-grid-single">{this.renderRatings(ratings)}</div>
            </section>

            <section className="detail-panel" aria-labelledby="documents-title">
              <div className="detail-panel-header">
                <div>
                  <span>{isGerman ? 'Unterlagen' : 'Files'}</span>
                  <h2 id="documents-title"><Translate content="label.attachments" /></h2>
                </div>
              </div>
              <div className="document-list">{this.renderDocuments(documents)}</div>
            </section>
          </aside>
        </div>

        {status !== 'deleted' ? (
          <section className="detail-actions" aria-label="Product actions">
            <div>
              <strong>{isGerman ? 'Produktaktionen' : 'Product actions'}</strong>
              <span>{isGerman ? 'Statusänderungen wirken sich auf die Verfügbarkeit dieses Produkts aus.' : 'Status changes affect the availability of this product.'}</span>
            </div>
            <div className="detail-actions-buttons">
              {status !== 'postponed' ? (
                <button className="btn btn-warning" type="button" onClick={() => this.props.postponeProduct(id, 'postpone', () => this.props.history.push('/products'))}>
                  <Translate content="button.postpone" />
                </button>
              ) : (
                <button className="btn btn-secondary" type="button" onClick={() => this.props.postponeProduct(id, 'undo_postpone', () => this.props.history.push('/products'))}>
                  <Translate content="button.undopostpone" />
                </button>
              )}
              <button className="btn btn-danger" type="button" onClick={() => this.handleDelete(id)}>
                <Translate content="button.delete" />
              </button>
            </div>
          </section>
        ) : null}

        {id ? <div className="detail-related"><RequestedByList id={id} name={product_title} /></div> : null}
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return { product: state.singleProduct };
}

export default connect(mapStateToProps, { getProductById, deleteProduct, postponeProduct, downloadToken })(ViewProduct);
