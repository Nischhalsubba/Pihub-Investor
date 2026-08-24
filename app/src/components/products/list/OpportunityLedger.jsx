import React from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../../general/Pagination';
import { formatEuro, industriesFor, localizedText, serviceFor, statusLabel, toDisplayText } from './opportunityListModel';

const OpportunityLedger = ({ products, visibleColumns, selectedId, compareIds, toggleCompare, selectProduct, openQuickView, renderSortHeader, density, totalPage, page, writeView }) => {
  const visible = key => visibleColumns.includes(key);
  const gridStyle = { '--ledger-columns': `36px minmax(210px,1.6fr) ${visible('facility') ? 'minmax(120px,1fr) ' : ''}${visible('industry') ? 'minmax(120px,1fr) ' : ''}${visible('tenor') ? '100px ' : ''}${visible('credit') ? 'minmax(150px,1.1fr) ' : ''}${visible('status') ? '110px ' : ''}42px` };

  const handleRowKeyDown = (event, product, index) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectProduct(product); return; }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const rows = Array.from(event.currentTarget.parentElement.querySelectorAll('.ap-ledger-row'));
      const nextIndex = event.key === 'ArrowDown' ? Math.min(rows.length - 1, index + 1) : Math.max(0, index - 1);
      if (rows[nextIndex]) rows[nextIndex].focus();
    }
  };

  const rows = products.length ? products.map((product, index) => {
    const productId = toDisplayText(product.id);
    const title = localizedText(product.product_title) || 'Untitled product';
    const service = serviceFor(product) || '—';
    const industries = industriesFor(product);
    const selected = String(product.id) === String(selectedId);
    const compared = compareIds.includes(String(product.id));
    return <div className={selected ? 'ap-ledger-row is-selected' : 'ap-ledger-row'} role="row" tabIndex="0" aria-selected={selected} key={productId || `product-${index}`} onClick={() => selectProduct(product)} onKeyDown={event => handleRowKeyDown(event, product, index)}>
      <span className="ap-row-check" role="cell"><input type="checkbox" checked={compared} aria-label={`Select ${title} for comparison`} onClick={event => event.stopPropagation()} onChange={() => toggleCompare(product)} /></span>
      <div className="ap-issuer" role="cell"><Link to={`/opportunities/${encodeURIComponent(product.id)}`} onClick={event => event.stopPropagation()}>{title}</Link><small>{product.product_code || productId || '—'}</small></div>
      {visible('facility') ? <span role="cell">{service}</span> : null}
      {visible('industry') ? <span className="ap-sector" role="cell">{industries[0] || '—'}{industries.length > 1 ? <small> +{industries.length - 1}</small> : null}</span> : null}
      {visible('tenor') ? <span className="ap-mono" role="cell">{toDisplayText(product.min_time_duration) || '—'}–{toDisplayText(product.max_time_duration) || '—'}m</span> : null}
      {visible('credit') ? <span className="ap-mono" role="cell">{formatEuro(product.min_credit_amount)}–{formatEuro(product.max_credit_amount)}</span> : null}
      {visible('status') ? <span className={`ap-status ap-status-${product.status || 'neutral'}`} role="cell"><i aria-hidden="true" />{statusLabel(product.status)}</span> : null}
      <span role="cell"><button className="ap-quick-view-btn" type="button" onClick={event => { event.stopPropagation(); openQuickView(product); }} aria-label={`Quick view ${title}`} title="Quick view"><i className="bx bx-window-open" aria-hidden="true" /></button></span>
    </div>;
  }) : <div className="ap-empty"><strong>No opportunities match this view.</strong><span>Adjust the status or search terms and try again.</span></div>;

  return <section className={`ap-ledger is-density-${density}`} role="table" aria-label="Opportunity book" data-motion="table-shell" style={gridStyle}>
    <div className="ap-ledger-caption"><div><strong>Opportunity book</strong><span>{products.length} records on this page · use ↑/↓ to move between rows</span></div><small>EUR</small></div>
    <div className="ap-ledger-head" role="row"><span role="columnheader"><span className="sr-only">Compare</span></span><span role="columnheader">{renderSortHeader('title', 'Opportunity')}</span>{visible('facility') ? <span role="columnheader">{renderSortHeader('facility', 'Facility')}</span> : null}{visible('industry') ? <span role="columnheader">{renderSortHeader('industry', 'Industry')}</span> : null}{visible('tenor') ? <span role="columnheader">{renderSortHeader('tenor', 'Tenor')}</span> : null}{visible('credit') ? <span role="columnheader">{renderSortHeader('credit', 'Credit')}</span> : null}{visible('status') ? <span role="columnheader">{renderSortHeader('status', 'Status')}</span> : null}<span role="columnheader"><span className="sr-only">Quick view</span></span></div>
    <div className="ap-ledger-body">{rows}</div>
    <div className="ap-ledger-pagination"><Pagination totalPage={totalPage} currentPage={page} url={nextPage => writeView({ page: nextPage })} /></div>
  </section>;
};

export default OpportunityLedger;
