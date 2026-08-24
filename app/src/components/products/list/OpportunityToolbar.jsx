import React from 'react';
import Translate from '../../../i18n/Translate';
import { workspaceText } from '../../../i18n/workspaceCopy';
import { statusOptions } from './opportunityListModel';
import OpportunityViewMenu from './OpportunityViewMenu';

const OpportunityToolbar = props => {
  const { status, query, setQuery, onSearch, setStatus, activeFilters, clearFilters, compareIds, openCompare, clearCompare, onExport } = props;
  return <div className="data-toolbar" aria-label="Opportunity view tools">
    <form className="ap-query-line" onSubmit={onSearch} aria-label="Opportunity filters">
      <div className="ap-query-input"><label className="sr-only" htmlFor="opportunity-search">Search opportunities</label><input id="opportunity-search" type="search" placeholder="Search opportunity, facility or sector" value={query} onChange={event => setQuery(event.target.value)} /></div>
      <div className="ap-filter-tabs" role="group" aria-label="Filter by status">{statusOptions.map(option => { const active = status === option.value; return <button key={option.value || 'all'} type="button" className={active ? 'is-active' : ''} aria-pressed={active} onClick={() => setStatus(option.value)}>{option.labelKey ? <Translate content={option.labelKey} /> : workspaceText('all')}</button>; })}</div>
      <button className="ap-search-submit" type="submit">{workspaceText('search')}</button>
    </form>
    <div className="data-toolbar-actions">
      {activeFilters ? <button type="button" className="btn btn-link" onClick={clearFilters}>{workspaceText('clearFilters')} ({activeFilters})</button> : null}
      {compareIds.length ? <div className="ap-compare-actions"><button type="button" disabled={compareIds.length < 2} onClick={openCompare}>Compare ({compareIds.length})</button><button type="button" onClick={clearCompare} aria-label="Clear comparison selection"><i className="bx bx-x" aria-hidden="true" /></button></div> : null}
      <button type="button" className="btn btn-secondary" onClick={onExport}><i className="bx bx-download" aria-hidden="true" /> {workspaceText('exportCsv')}</button>
      <OpportunityViewMenu {...props} />
    </div>
  </div>;
};

export default OpportunityToolbar;
