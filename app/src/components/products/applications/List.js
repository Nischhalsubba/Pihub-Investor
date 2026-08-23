import React from 'react';
import Subheader from '../../general/Subheader';
import { getLocale } from '../../../_utils/locale';

const ListApplication = () => {
  const isGerman = getLocale() === 'de';

  return (
    <div>
      <Subheader heading={isGerman ? 'Produktanträge' : 'Product applications'} />
      <section className="table-shell" data-motion="table-shell">
        <div className="table-caption">
          <div>
            <strong>{isGerman ? 'Produktanträge' : 'Product applications'}</strong>
            <span>{isGerman ? 'Keine Live-Datenquelle für diese Route konfiguriert' : 'No live data source is configured for this route'}</span>
          </div>
        </div>
        <div className="data-empty">
          <i className="bx bx-file" aria-hidden="true" />
          <strong>{isGerman ? 'Keine Antragsdaten verfügbar' : 'No application data available'}</strong>
          <span>{isGerman ? 'Verwenden Sie die Kreditanfragen, um aktive Anträge zu prüfen.' : 'Use Credit Requests to review active applications.'}</span>
        </div>
      </section>
    </div>
  );
};

export default ListApplication;
