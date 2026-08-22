import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import { getProfile } from '../../../actions/profile';
import Spinner from '../../general/Spinner';
import Subheader from '../../general/Subheader';

const Translator = require('react-translate-component');

class ViewProfile extends Component {
  componentDidMount() {
    this.props.getProfile();
  }

  renderContact = (name, email, phone, index) => {
    if (!name && !email && !phone) return null;
    return (
      <article className="ap-person" key={`contact-${index}`}>
        <span className="ap-person-id">{String(index).padStart(2, '0')}</span>
        <div><strong>{name || '—'}</strong>{email ? <a href={`mailto:${email}`}>{email}</a> : null}{phone ? <a href={`tel:${phone}`}>{phone}</a> : null}</div>
      </article>
    );
  };

  render() {
    if (!this.props.profile) return <div className="data-loading" role="status" aria-live="polite"><Spinner /></div>;

    const {
      fname, lname, company_name, email, phone_number, status, category, company_logo_link,
      contact_email_1, contact_email_2, contact_email_3, contact_phone_no_1, contact_phone_no_2,
      contact_phone_no_3, document_link, contact_name_1, contact_name_2, contact_name_3,
      facebook_link, linked_in_link, twitter_link, street_address, headquarter, zip_code
    } = this.props.profile;

    const isGerman = Translator.getLocale() === 'de';
    const displayName = company_name || [fname, lname].filter(Boolean).join(' ') || 'PiHub Investor';
    const personName = [fname, lname].filter(Boolean).join(' ') || '—';
    const address = [street_address, headquarter, zip_code].filter(Boolean).join(', ');
    const initials = displayName.split(/\s+/).filter(Boolean).slice(0, 2).map(value => value.charAt(0).toUpperCase()).join('');
    const contacts = [
      this.renderContact(contact_name_1, contact_email_1, contact_phone_no_1, 1),
      this.renderContact(contact_name_2, contact_email_2, contact_phone_no_2, 2),
      this.renderContact(contact_name_3, contact_email_3, contact_phone_no_3, 3)
    ].filter(Boolean);
    const verified = status === 'approved';

    return (
      <Fragment>
        <Subheader heading={isGerman ? 'Institutionelles Profil' : 'Institution profile'} buttonLabel={isGerman ? 'Profil bearbeiten' : 'Edit profile'} link="/user/edit-profile" />

        <div className="ap-profile-layout">
          <section className="ap-identity-sheet" data-motion="table-shell">
            <div className="ap-identity-hero">
              <div className="ap-identity-mark" aria-hidden="true">
                {company_logo_link ? <img src={company_logo_link} alt="" /> : <span>{initials || 'PI'}</span>}
              </div>
              <div className="ap-identity-name">
                <h2>{displayName}</h2>
                <p>{category || (isGerman ? 'Institutioneller Investor' : 'Institutional investor')}{headquarter ? ` · ${headquarter}` : ''}</p>
              </div>
              <div className={verified ? 'ap-verified' : 'ap-verified is-pending'}><i aria-hidden="true" />{verified ? (isGerman ? 'VERIFIZIERT' : 'VERIFIED') : (isGerman ? 'PRÜFUNG' : 'PENDING')}</div>
            </div>

            <div className="ap-identity-data">
              <div className="ap-identity-cell"><label>{isGerman ? 'Juristische Person' : 'Legal entity'}</label><strong>{displayName}</strong></div>
              <div className="ap-identity-cell"><label>{isGerman ? 'Primärer Kontakt' : 'Primary contact'}</label><strong>{personName}</strong></div>
              <div className="ap-identity-cell"><label>Email</label>{email ? <a href={`mailto:${email}`}>{email}</a> : <strong>—</strong>}</div>
              <div className="ap-identity-cell"><label>{isGerman ? 'Telefon' : 'Telephone'}</label>{phone_number ? <a className="ap-mono" href={`tel:${phone_number}`}>{phone_number}</a> : <strong>—</strong>}</div>
              <div className="ap-identity-cell"><label>{isGerman ? 'Hauptsitz' : 'Headquarters'}</label><strong>{address || '—'}</strong></div>
              <div className="ap-identity-cell"><label>{isGerman ? 'Entitätskategorie' : 'Entity category'}</label><strong>{category || '—'}</strong></div>
            </div>

            {(facebook_link || twitter_link || linked_in_link) ? (
              <div className="ap-profile-links" aria-label="Institution links">
                {linked_in_link ? <a href={linked_in_link} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a> : null}
                {twitter_link ? <a href={twitter_link} target="_blank" rel="noopener noreferrer">Twitter ↗</a> : null}
                {facebook_link ? <a href={facebook_link} target="_blank" rel="noopener noreferrer">Facebook ↗</a> : null}
              </div>
            ) : null}
          </section>

          <aside className="ap-profile-side" aria-label="Institution relationships">
            <section className="ap-profile-module">
              <h3>{isGerman ? 'Beziehungsteam' : 'Relationship team'}</h3>
              <div className="ap-profile-people">{contacts.length ? contacts : <div className="ap-note">{isGerman ? 'Keine Ansprechpartner hinterlegt.' : 'No relationship contacts are available.'}</div>}</div>
            </section>
            <section className="ap-profile-module">
              <h3>{isGerman ? 'Kontostatus' : 'Account status'}</h3>
              <div className="ap-data-pair"><span>{isGerman ? 'Verifizierung' : 'Verification'}</span><b>{verified ? (isGerman ? 'VERIFIZIERT' : 'VERIFIED') : (isGerman ? 'AUSSTEHEND' : 'PENDING')}</b></div>
              <div className="ap-data-pair"><span>{isGerman ? 'Kategorie' : 'Category'}</span><b>{category || '—'}</b></div>
              <div className="ap-data-pair"><span>{isGerman ? 'Hauptsitz' : 'Headquarters'}</span><b>{headquarter || '—'}</b></div>
            </section>
            {document_link ? (
              <section className="ap-profile-module">
                <h3>{isGerman ? 'Unternehmensdokument' : 'Company document'}</h3>
                <a className="ap-inspector-link" href={document_link} target="_blank" rel="noopener noreferrer">{isGerman ? 'Dokument öffnen' : 'Open document'} <span aria-hidden="true">↗</span></a>
              </section>
            ) : null}
          </aside>
        </div>
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return { profile: state.profile };
}

export default connect(mapStateToProps, { getProfile })(ViewProfile);
