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
      <article className="profile-contact" key={`contact-${index}`}>
        <span className="profile-contact-index">{String(index).padStart(2, '0')}</span>
        <div>
          <strong>{name || '—'}</strong>
          {email ? <a href={`mailto:${email}`}>{email}</a> : null}
          {phone ? <a href={`tel:${phone}`}>{phone}</a> : null}
        </div>
      </article>
    );
  };

  render() {
    if (!this.props.profile) {
      return <div className="data-loading" role="status" aria-live="polite"><Spinner /></div>;
    }

    const {
      fname,
      lname,
      company_name,
      email,
      phone_number,
      status,
      category,
      company_logo_link,
      contact_email_1,
      contact_email_2,
      contact_email_3,
      contact_phone_no_1,
      contact_phone_no_2,
      contact_phone_no_3,
      document_link,
      contact_name_1,
      contact_name_2,
      contact_name_3,
      facebook_link,
      linked_in_link,
      twitter_link,
      street_address,
      headquarter,
      zip_code
    } = this.props.profile;

    const isGerman = Translator.getLocale() === 'de';
    const displayName = company_name || [fname, lname].filter(Boolean).join(' ') || 'PiHub Investor';
    const address = [street_address, headquarter, zip_code].filter(Boolean).join(', ');
    const initials = displayName.split(/\s+/).filter(Boolean).slice(0, 2).map(value => value.charAt(0).toUpperCase()).join('');
    const contacts = [
      this.renderContact(contact_name_1, contact_email_1, contact_phone_no_1, 1),
      this.renderContact(contact_name_2, contact_email_2, contact_phone_no_2, 2),
      this.renderContact(contact_name_3, contact_email_3, contact_phone_no_3, 3)
    ].filter(Boolean);

    return (
      <Fragment>
        <Subheader
          heading={isGerman ? 'Profil' : 'Profile'}
          buttonLabel={isGerman ? 'Profil bearbeiten' : 'Edit profile'}
          link="/user/edit-profile"
        />

        <section className="profile-identity" data-motion="table-shell">
          <div className="profile-logo" aria-hidden="true">
            {company_logo_link ? <img src={company_logo_link} alt="" /> : <span>{initials || 'PI'}</span>}
          </div>
          <div className="profile-identity-copy">
            <div className="profile-name-row">
              <h2>{displayName}</h2>
              <span className={status === 'approved' ? 'badge badge-success' : 'badge badge-warning'}>
                {status === 'approved' ? (isGerman ? 'Verifiziert' : 'Verified') : (isGerman ? 'Nicht verifiziert' : 'Unverified')}
              </span>
            </div>
            <div className="profile-primary-meta">
              {category ? <span><i className="bx bx-briefcase" aria-hidden="true" />{category}</span> : null}
              {address ? <span><i className="bx bx-map" aria-hidden="true" />{address}</span> : null}
            </div>
            <div className="profile-social" aria-label="Social profiles">
              {facebook_link ? <a href={facebook_link} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="bx bxl-facebook" aria-hidden="true" /></a> : null}
              {twitter_link ? <a href={twitter_link} target="_blank" rel="noopener noreferrer" aria-label="Twitter"><i className="bx bxl-twitter" aria-hidden="true" /></a> : null}
              {linked_in_link ? <a href={linked_in_link} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i className="bx bxl-linkedin" aria-hidden="true" /></a> : null}
            </div>
          </div>
        </section>

        <div className="profile-layout">
          <section className="profile-panel" aria-labelledby="profile-account-title">
            <div className="profile-panel-header">
              <span>{isGerman ? 'Konto' : 'Account'}</span>
              <h3 id="profile-account-title">{isGerman ? 'Primäre Kontaktdaten' : 'Primary contact'}</h3>
            </div>
            <div className="profile-field-grid">
              <div className="profile-field">
                <span>{isGerman ? 'Name' : 'Name'}</span>
                <strong>{[fname, lname].filter(Boolean).join(' ') || '—'}</strong>
              </div>
              <div className="profile-field">
                <span>Email</span>
                {email ? <a href={`mailto:${email}`}>{email}</a> : <strong>—</strong>}
              </div>
              <div className="profile-field">
                <span>{isGerman ? 'Telefon' : 'Phone'}</span>
                {phone_number ? <a href={`tel:${phone_number}`}>{phone_number}</a> : <strong>—</strong>}
              </div>
              <div className="profile-field">
                <span>{isGerman ? 'Kategorie' : 'Category'}</span>
                <strong>{category || '—'}</strong>
              </div>
            </div>
          </section>

          <section className="profile-panel" aria-labelledby="profile-contacts-title">
            <div className="profile-panel-header">
              <span>{isGerman ? 'Team' : 'Team'}</span>
              <h3 id="profile-contacts-title">{isGerman ? 'Ansprechpartner' : 'Contact people'}</h3>
            </div>
            <div className="profile-contacts">
              {contacts.length ? contacts : <div className="detail-empty">{isGerman ? 'Keine Ansprechpartner hinterlegt.' : 'No contact people are available.'}</div>}
            </div>
          </section>
        </div>

        {document_link ? (
          <section className="profile-document">
            <div>
              <i className="bx bx-file" aria-hidden="true" />
              <span>
                <strong>{isGerman ? 'Unternehmensdokument' : 'Company document'}</strong>
                <small>{isGerman ? 'Hinterlegte Datei öffnen' : 'Open the saved document'}</small>
              </span>
            </div>
            <a className="btn btn-secondary" href={document_link} target="_blank" rel="noopener noreferrer">
              {isGerman ? 'Öffnen' : 'Open'}
            </a>
          </section>
        ) : null}
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return { profile: state.profile };
}

export default connect(mapStateToProps, { getProfile })(ViewProfile);
