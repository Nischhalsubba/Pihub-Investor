import React, { Fragment } from 'react';
import Subheader from './../general/Subheader';

import Translator from '../../i18n/Translate';

const AppliedList = () => {
  const isGerman = Translator.getLocale() === 'de';

  return (
    <Fragment>
      <Subheader heading={isGerman ? 'Anträge' : 'Applications'} />
      <section className="table-shell" data-motion="table-shell" aria-label={isGerman ? 'Anträge' : 'Applications'}>
        <div className="table-caption">
          <div>
            <strong>{isGerman ? 'Anträge' : 'Applications'}</strong>
            <span>{isGerman ? 'Keine Live-Daten in dieser Ansicht verfügbar' : 'No live records are available in this view'}</span>
          </div>
        </div>
        <div className="data-empty">
          <i className="bx bx-file" aria-hidden="true" />
          <strong>{isGerman ? 'Keine Antragsdaten verfügbar' : 'No application data available'}</strong>
          <span>{isGerman ? 'Diese Ansicht zeigt erst Einträge, wenn sie mit einer Live-Datenquelle verbunden ist.' : 'This view will show records when it is connected to a live data source.'}</span>
        </div>
      </section>
    </Fragment>
  );
};

export default AppliedList;
