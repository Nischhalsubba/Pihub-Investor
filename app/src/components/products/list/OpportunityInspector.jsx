import React from 'react';
import { Link } from 'react-router-dom';
import { formatEuro, localizedText, ownerFor, ratingFor, reviewFor } from './opportunityListModel';

const OpportunityInspector = ({ product, openQuickView }) => {
  if (!product) return <aside className="ap-inspector"><div className="ap-inspector-empty">Select an opportunity to inspect decision context.</div></aside>;
  const collateral = product.collatoral !== undefined ? product.collatoral : product.collateral;
  const documents = Array.isArray(product.documents) ? product.documents : [];
  const states = Array.isArray(product.states) ? product.states : [];
  return <aside className="ap-inspector" aria-label="Opportunity decision context">
    <div className="ap-inspector-kicker">Decision context</div>
    <h3>{localizedText(product.product_title) || 'Untitled product'}</h3>
    <div className="ap-decision-meta"><div><span>Risk / rating</span><strong>{product.risk_band || ratingFor(product)}</strong></div><div><span>Owner</span><strong>{ownerFor(product)}</strong></div><div><span>Next review</span><strong>{reviewFor(product)}</strong></div></div>
    <div className="ap-inspector-section"><h4>Screening facts</h4><div className="ap-data-pair"><span>Minimum creditor sales</span><b>{formatEuro(product.min_sales_creditor)}</b></div><div className="ap-data-pair"><span>Collateral</span><b>{collateral === 1 || collateral === true ? 'Required' : collateral === 0 || collateral === false ? 'Not required' : '—'}</b></div><div className="ap-data-pair"><span>Documents</span><b>{documents.length}</b></div><div className="ap-data-pair"><span>States covered</span><b>{states.length || '—'}</b></div></div>
    <button className="btn btn-link" type="button" onClick={() => openQuickView(product)}>Quick view</button>
    <Link className="ap-inspector-link" to={`/opportunities/${encodeURIComponent(product.id)}`}>Open full opportunity <span aria-hidden="true">↗</span></Link>
  </aside>;
};

export default OpportunityInspector;
