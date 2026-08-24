import React, { useRef } from 'react';
import { opportunityColumns } from './opportunityListModel';

const OpportunityViewMenu = ({ density, setDensity, visibleColumns, toggleColumn, savedViews, defaultId, savedViewName, setSavedViewName, saveView, loadView, renameView, deleteView, setDefaultView, copyViewLink, exportViews, importViews }) => {
  const fileRef = useRef(null);
  const askRename = item => {
    const next = window.prompt('Rename saved view', item.name);
    if (next && next.trim() && next.trim() !== item.name) renameView(item.id, next.trim());
  };

  const handleImport = async event => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const text = await file.text();
    importViews(text);
    event.target.value = '';
  };

  return <details className="ap-view-menu">
    <summary><i className="bx bx-slider-alt" aria-hidden="true" />View</summary>
    <div className="ap-view-menu-panel">
      <section className="ap-view-section">
        <header><strong>Density</strong><span>Workspace preference</span></header>
        <div className="ap-view-density" role="group" aria-label="Table density"><button type="button" aria-pressed={density === 'comfortable'} onClick={() => setDensity('comfortable')}>Comfortable</button><button type="button" aria-pressed={density === 'compact'} onClick={() => setDensity('compact')}>Compact</button></div>
      </section>
      <section className="ap-view-section">
        <header><strong>Columns</strong><span>Choose decision fields</span></header>
        <div className="ap-view-columns">{opportunityColumns.map(column => <label key={column.key}><input type="checkbox" checked={visibleColumns.includes(column.key)} onChange={() => toggleColumn(column.key)} />{column.label}</label>)}</div>
      </section>
      <section className="ap-view-section">
        <header><strong>Saved views</strong><span>Stored in this browser</span></header>
        <div className="ap-saved-view-list">{savedViews.length ? savedViews.map(item => <div className={`ap-saved-view-item${item.id === defaultId ? ' is-default' : ''}`} key={item.id}><button className="ap-saved-view-copy" type="button" onClick={() => loadView(item)}><strong>{item.name}</strong><span>{item.id === defaultId ? 'Default view · ' : ''}{item.density} density</span></button><div className="ap-saved-view-actions"><button type="button" onClick={() => setDefaultView(item.id)} aria-label={`Set ${item.name} as default`} title="Set default"><i className={item.id === defaultId ? 'bx bxs-star' : 'bx bx-star'} aria-hidden="true" /></button><button type="button" onClick={() => copyViewLink(item)} aria-label={`Copy link for ${item.name}`} title="Copy shareable link"><i className="bx bx-link" aria-hidden="true" /></button><button type="button" onClick={() => askRename(item)} aria-label={`Rename ${item.name}`} title="Rename"><i className="bx bx-edit" aria-hidden="true" /></button><button className="is-danger" type="button" onClick={() => deleteView(item.id)} aria-label={`Delete ${item.name}`} title="Delete"><i className="bx bx-trash" aria-hidden="true" /></button></div></div>) : <div className="ap-empty ap-empty-compact"><strong>No saved views yet.</strong><span>Save the current filters, columns and density below.</span></div>}</div>
        <form className="ap-saved-view-create" onSubmit={saveView}><input aria-label="Saved view name" value={savedViewName} onChange={event => setSavedViewName(event.target.value)} placeholder="Name this view" /><button type="submit">Save view</button></form>
        <div className="ap-saved-view-tools"><button type="button" onClick={exportViews}>Export views</button><button type="button" onClick={() => fileRef.current && fileRef.current.click()}>Import views</button><input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={handleImport} /></div>
      </section>
    </div>
  </details>;
};

export default OpportunityViewMenu;
