import React, { Component, Fragment } from 'react';
import client from '../../actions/index';
import { routes } from '../../_api/routes';
import Subheader from '../general/Subheader';

const Translator = require('react-translate-component');

const text = value => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (typeof value !== 'object') return '';
  const locale = Translator.getLocale();
  return String(value[locale] || value.en || value.de || value.label || value.title || value.name || '');
};

const listText = values => (Array.isArray(values) ? values : []).map(value => text(value && value.name !== undefined ? value.name : value)).filter(Boolean).join(', ') || '—';
const money = value => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return '—';
  return new Intl.NumberFormat(Translator.getLocale() === 'de' ? 'de-DE' : 'en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);
};
const titleCase = value => String(value || '—').replace(/[-_]+/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase());

class CompareOpportunities extends Component {
  state = { loading: true, products: [], error: '' };

  componentDidMount() { this.load(); }
  componentDidUpdate(prevProps) { if (prevProps.location.search !== this.props.location.search) this.load(); }

  getIds = () => {
    const params = new URLSearchParams(this.props.location.search || '');
    return (params.get('ids') || '').split(',').map(value => decodeURIComponent(value.trim())).filter(Boolean).slice(0, 4);
  };

  load = async () => {
    const ids = this.getIds();
    if (ids.length < 2) {
      this.setState({ loading: false, products: [], error: 'Select at least two opportunities to compare.' });
      return;
    }
    this.setState({ loading: true, error: '' });
    try {
      const responses = await Promise.all(ids.map(id => client.get(`${routes.getProductById}/${encodeURIComponent(id)}`)));
      const products = responses.map(response => response && response.data && response.data.data).filter(item => item && typeof item === 'object');
      this.setState({ loading: false, products, error: products.length >= 2 ? '' : 'The selected opportunities could not all be loaded.' });
    } catch (error) {
      this.setState({ loading: false, products: [], error: 'Unable to load comparison data right now.' });
    }
  };

  remove = id => {
    const ids = this.getIds().filter(value => String(value) !== String(id));
    if (ids.length < 2) { this.props.history.push('/products'); return; }
    this.props.history.replace(`/opportunities/compare?ids=${ids.map(encodeURIComponent).join(',')}`);
  };

  value = (product, key) => {
    const collateral = product.collatoral !== undefined ? product.collatoral : product.collateral;
    if (key === 'facility') return product.service ? text(product.service.name || product.service) : '—';
    if (key === 'industry') return listText(product.industries);
    if (key === 'geography') return listText(product.states);
    if (key === 'tenor') return `${product.min_time_duration ?? '—'}–${product.max_time_duration ?? '—'} months`;
    if (key === 'credit') return `${money(product.min_credit_amount)}–${money(product.max_credit_amount)}`;
    if (key === 'sales') return money(product.min_sales_creditor);
    if (key === 'collateral') return collateral === 1 || collateral === true ? 'Required' : collateral === 0 || collateral === false ? 'Not required' : '—';
    if (key === 'ratings') return Array.isArray(product.ratings) && product.ratings.length ? product.ratings.map(rating => `${text(rating.name) || 'Rating'} ${text(rating.value)}`.trim()).join(', ') : '—';
    if (key === 'documents') return Array.isArray(product.documents) ? String(product.documents.length) : '0';
    if (key === 'status') return titleCase(product.status);
    return '—';
  };

  render() {
    if (this.state.loading) return <div className="data-loading" role="status" aria-live="polite">Loading comparison…</div>;
    const products = this.state.products;
    const rows = [
      ['Facility', 'facility'],
      ['Industry', 'industry'],
      ['Geography', 'geography'],
      ['Tenor', 'tenor'],
      ['Credit range', 'credit'],
      ['Minimum creditor sales', 'sales'],
      ['Collateral', 'collateral'],
      ['Ratings', 'ratings'],
      ['Documents', 'documents'],
      ['Status', 'status']
    ];

    return <Fragment>
      <Subheader heading="Compare opportunities" kicker="Decision support" description="Review underwriting parameters side by side before opening the full opportunity records." />
      <div className="ap-compare-page">
        {this.state.error ? <div className="auth-error" role="alert">{this.state.error}</div> : null}
        {products.length >= 2 ? <>
          <div className="ap-compare-toolbar"><span><strong>{products.length} opportunities</strong><br /><small>Up to four opportunities can be compared at once.</small></span><button className="btn btn-secondary" type="button" onClick={() => this.props.history.push('/products')}>Back to opportunity book</button></div>
          <section className="ap-compare-table" data-motion="table-shell">
            <table aria-label="Opportunity comparison"><thead><tr><th scope="col">Attribute</th>{products.map(product => <th scope="col" key={product.id}><strong>{text(product.product_title) || 'Untitled opportunity'}</strong><small>{product.product_code || product.id}</small><button className="ap-compare-remove" type="button" onClick={() => this.remove(product.id)} aria-label={`Remove ${text(product.product_title) || product.id} from comparison`}><i className="bx bx-x" aria-hidden="true" /></button></th>)}</tr></thead><tbody>{rows.map(([label, key]) => <tr key={key}><th scope="row">{label}</th>{products.map(product => <td key={`${product.id}-${key}`}>{this.value(product, key)}</td>)}</tr>)}</tbody></table>
          </section>
          <div className="ap-compare-open-grid">{products.map(product => <button type="button" className="btn btn-link" key={product.id} onClick={() => this.props.history.push(`/opportunities/${encodeURIComponent(product.id)}`)}>Open {text(product.product_title) || product.id} <span aria-hidden="true">↗</span></button>)}</div>
        </> : null}
      </div>
    </Fragment>;
  }
}

export default CompareOpportunities;