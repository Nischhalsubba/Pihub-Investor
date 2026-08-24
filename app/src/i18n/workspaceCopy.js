import { getLocale } from '../_utils/locale';

export const WORKSPACE_COPY = {
  en: {
    search: 'Search', view: 'View', exportCsv: 'Export CSV', density: 'Density', columns: 'Columns', savedViews: 'Saved views', browserScope: 'Stored in this browser', comfortable: 'Comfortable', compact: 'Compact', chooseFields: 'Choose decision fields', noSavedViews: 'No saved views yet.', saveHint: 'Save the current filters, columns and density below.', nameView: 'Name this view', saveView: 'Save view', exportViews: 'Export views', importViews: 'Import views', clearFilters: 'Clear filters', all: 'All', owner: 'Owner', risk: 'Risk', nextReview: 'Next review', expectedYield: 'Expected yield'
  },
  de: {
    search: 'Suchen', view: 'Ansicht', exportCsv: 'CSV exportieren', density: 'Dichte', columns: 'Spalten', savedViews: 'Gespeicherte Ansichten', browserScope: 'In diesem Browser gespeichert', comfortable: 'Komfortabel', compact: 'Kompakt', chooseFields: 'Entscheidungsfelder auswählen', noSavedViews: 'Noch keine gespeicherten Ansichten.', saveHint: 'Speichern Sie die aktuellen Filter, Spalten und die Dichte.', nameView: 'Ansicht benennen', saveView: 'Ansicht speichern', exportViews: 'Ansichten exportieren', importViews: 'Ansichten importieren', clearFilters: 'Filter löschen', all: 'Alle', owner: 'Verantwortlich', risk: 'Risiko', nextReview: 'Nächste Prüfung', expectedYield: 'Erwartete Rendite'
  }
};

export const workspaceTextFor = (locale, key) => (WORKSPACE_COPY[locale] && WORKSPACE_COPY[locale][key]) || WORKSPACE_COPY.en[key] || key;
export const workspaceText = key => workspaceTextFor(getLocale(), key);
