import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import { getProfile } from '../../../actions/profile';
import Spinner from '../../general/Spinner';
import Subheader from '../../general/Subheader';

const Translator = require('react-translate-component');

const valueText = value => {
  if (value === null || value === undefined || value === '') return 'Not supplied';
  if (Array.isArray(value)) return value.length ? value.join(', ') : 'Not supplied';
  if (typeof value === 'object') {
    const locale = Translator.getLocale();
    return value[locale] || value.en || value.de || value.label || value.name || 'Not supplied';
  }
  return String(value);
};

class ViewProfile extends Component {
  componentDidMount() { this.props.getProfile(); }

  renderContact = (name, email, phone, index) => {
    if (!name && !email && !phone) return null;
    return <article className="ap-person" key={`contact-${index}`}><div><strong>{name || 'Unnamed contact'}</strong>{email ? <a href={`mailto:${email}`}>{email}</a> : null}{phone ? <a href={`tel:${phone}`}>{phone}</a> : null}</div></article>;
  };

  renderAudit = audit => {
    if (!Array.isArray(audit) || !audit.length) return <div className="ap-note">No audit history is supplied by the current API.</div>;
    return audit.slice(0, 5).map((item, index) => <div className="governance-event" key={item.id || index}><strong>{valueText(item.action || item.title)}</strong><span>{valueText(item.created_at || item.date)}</span></div>);
  };

  render() {
    if (!this.props.profile) return <div className="data-loading" role="status" aria-live="polite"><Spinner /></div>;
    const profile = this.props.profile;
    const { fname, lname, company_name, email, phone_number, status, category, company_logo_link, contact_email_1, contact_email_2, contact_email_3, contact_phone_no_1, contact_phone_no_2, contact_phone_no_3, document_link, contact_name_1, contact_name_2, contact_name_3, linked_in_link, street_address, headquarter, zip_code } = profile;
    const isGerman = Translator.getLocale() === 'de';
    const displayName = company_name || [fname, lname].filter(Boolean).join(' ') || 'PiHub Investor';
    const personName = [fname, lname].filter(Boolean).join(' ') || '—';
    const address = [street_address, headquarter, zip_code].filter(Boolean).join(', ');
    const initials = displayName.split(/\s+/).filter(Boolean).slice(0, 2).map(value => value.charAt(0).toUpperCase()).join('');
    const contacts = [this.renderContact(contact_name_1, contact_email_1, contact_phone_no_1, 1), this.renderContact(contact_name_2, contact_email_2, contact_phone_no_2, 2), this.renderContact(contact_name_3, contact_email_3, contact_phone_no_3, 3)].filter(Boolean);
    const verified = status === 'approved';
    const compliance = profile.compliance_status || profile.kyc_status || (verified ? 'Verification complete' : 'Review pending');
    const permissions = profile.permissions || profile.roles || profile.scopes;
    const activeSessions = profile.active_sessions !== undefined ? profile.active_sessions : profile.session_count;
    const institutionId = profile.institution_id || profile.legal_entity_id || profile.registration_number;
    const complianceDocs = Array.isArray(profile.compliance_documents) ? profile.compliance_documents : [];

    return <Fragment>
      <Subheader heading={isGerman ? 'Institutionelles Profil' : 'Institution profile'} description="Identity, relationship, governance and compliance information for this investor workspace." buttonLabel={isGerman ? 'Profil bearbeiten' : 'Edit profile'} link="/user/edit-profile" />
      <div className="institution-grid">
        <section className="ap-identity-sheet" data-motion="table-shell"><div className="ap-identity-hero"><div className="ap-identity-mark" aria-hidden="true">{company_logo_link ? <img src={company_logo_link} alt="" /> : <span>{initials || 'PI'}</span>}</div><div className="ap-identity-name"><h2>{displayName}</h2><p>{category || (isGerman ? 'Institutioneller Investor' : 'Institutional investor')}{headquarter ? ` · ${headquarter}` : ''}</p></div><div className={verified ? 'ap-verified' : 'ap-verified is-pending'}><i aria-hidden="true" />{verified ? (isGerman ? 'VERIFIZIERT' : 'VERIFIED') : (isGerman ? 'PRÜFUNG' : 'PENDING')}</div></div><div className="ap-identity-data"><div className="ap-identity-cell"><label>{isGerman ? 'Juristische Person' : 'Legal entity'}</label><strong>{displayName}</strong></div><div className="ap-identity-cell"><label>{isGerman ? 'Primärer Kontakt' : 'Primary contact'}</label><strong>{personName}</strong></div><div className="ap-identity-cell"><label>Email</label>{email ? <a href={`mailto:${email}`}>{email}</a> : <strong>—</strong>}</div><div className="ap-identity-cell"><label>{isGerman ? 'Telefon' : 'Telephone'}</label>{phone_number ? <a className="ap-mono" href={`tel:${phone_number}`}>{phone_number}</a> : <strong>—</strong>}</div><div className="ap-identity-cell"><label>{isGerman ? 'Hauptsitz' : 'Headquarters'}</label><strong>{address || '—'}</strong></div><div className="ap-identity-cell"><label>{isGerman ? 'Entitätskategorie' : 'Entity category'}</label><strong>{category || '—'}</strong></div></div>{(linked_in_link || document_link) ? <div className="ap-profile-links">{linked_in_link ? <a href={linked_in_link} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a> : null}{document_link ? <a href={document_link} target="_blank" rel="noopener noreferrer">Company document ↗</a> : null}</div> : null}</section>
        <aside className="institution-side" aria-label="Institution relationships and governance"><section className="ap-profile-module"><h3>{isGerman ? 'Beziehungsteam' : 'Relationship team'}</h3><div className="ap-profile-people">{contacts.length ? contacts : <div className="ap-note">{isGerman ? 'Keine Ansprechpartner hinterlegt.' : 'No relationship contacts are available.'}</div>}</div></section><section className="ap-profile-module governance-module"><h3>{isGerman ? 'Governance und Zugriff' : 'Governance & access'}</h3><div className="ap-data-pair"><span>Verification</span><b>{verified ? 'Verified' : 'Pending'}</b></div><div className="ap-data-pair"><span>Institution identifier</span><b>{valueText(institutionId)}</b></div><div className="ap-data-pair"><span>Permissions / roles</span><b>{valueText(permissions)}</b></div><div className="ap-data-pair"><span>Active sessions</span><b>{valueText(activeSessions)}</b></div></section></aside>
      </div>
      <div className="governance-grid"><section className="ap-profile-module"><h3>{isGerman ? 'Compliance' : 'Compliance & verification'}</h3><div className="ap-data-pair"><span>Status</span><b>{valueText(compliance)}</b></div><div className="ap-data-pair"><span>Compliance documents</span><b>{complianceDocs.length || (document_link ? 1 : 'Not supplied')}</b></div><div className="ap-data-pair"><span>Last security review</span><b>{valueText(profile.last_security_review)}</b></div></section><section className="ap-profile-module"><h3>{isGerman ? 'Auditverlauf' : 'Audit history'}</h3>{this.renderAudit(profile.audit_history)}</section></div>
    </Fragment>;
  }
}

function mapStateToProps(state) { return { profile: state.profile }; }
export default connect(mapStateToProps, { getProfile })(ViewProfile);
