import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import { getProfile } from '../../../actions/profile';
import Spinner from '../../general/Spinner';
import Subheader from '../../general/Subheader';
import { isDemoMode } from '../../../_utils/demoMode';
import { withCompleteDemoProfile } from '../../../_utils/demoProfileData';

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

const formatDate = value => {
  if (!value) return 'Not supplied';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return valueText(value);
  return new Intl.DateTimeFormat(Translator.getLocale() === 'de' ? 'de-DE' : 'en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

const titleCase = value => String(value || '')
  .replace(/[-_]+/g, ' ')
  .replace(/\b\w/g, letter => letter.toUpperCase());

const contactInitials = name => String(name || 'Contact')
  .split(/\s+/)
  .filter(Boolean)
  .slice(0, 2)
  .map(part => part.charAt(0).toUpperCase())
  .join('');

class ViewProfile extends Component {
  componentDidMount() { this.props.getProfile(); }

  renderContact = (name, role, email, phone, index) => {
    if (!name && !email && !phone) return null;
    const displayName = name || 'Relationship contact';
    return (
      <article className="profile-v3-person" key={`contact-${index}`} data-motion="profile-person">
        <div className="profile-v3-person-mark" aria-hidden="true">{contactInitials(displayName)}</div>
        <div className="profile-v3-person-copy">
          <strong>{displayName}</strong>
          <span>{role || 'Relationship contact'}</span>
          <div className="profile-v3-person-links">
            {email ? <a href={`mailto:${email}`}><i className="bx bx-envelope" aria-hidden="true" /><span>{email}</span></a> : null}
            {phone ? <a href={`tel:${phone}`}><i className="bx bx-phone" aria-hidden="true" /><span>{phone}</span></a> : null}
          </div>
        </div>
      </article>
    );
  };

  renderAudit = audit => {
    if (!Array.isArray(audit) || !audit.length) return <div className="profile-v3-empty">No audit history is supplied by the current API.</div>;
    return audit.slice(0, 6).map((item, index) => (
      <div className="profile-v3-audit-event" key={item.id || index}>
        <div className="profile-v3-audit-marker" aria-hidden="true"><i className="bx bx-check" /></div>
        <div className="profile-v3-audit-copy">
          <strong>{valueText(item.action || item.title)}</strong>
          <span>{item.actor ? `${valueText(item.actor)} · ` : ''}{formatDate(item.created_at || item.date)}</span>
        </div>
      </div>
    ));
  };

  renderDocument = (item, index) => {
    const document = typeof item === 'string' ? { name: item } : (item || {});
    return (
      <div className="profile-v3-document" key={document.id || document.name || index}>
        <div className="profile-v3-document-icon" aria-hidden="true"><i className="bx bx-file" /></div>
        <div className="profile-v3-document-copy">
          <strong>{valueText(document.name || document.title || `Compliance document ${index + 1}`)}</strong>
          <span>{document.reviewed_at ? `Reviewed ${formatDate(document.reviewed_at)}` : 'Available in institution record'}</span>
        </div>
        <span className="profile-v3-document-status">{valueText(document.status || 'Verified')}</span>
      </div>
    );
  };

  render() {
    if (!this.props.profile) return <div className="data-loading" role="status" aria-live="polite"><Spinner /></div>;

    const profile = isDemoMode() ? withCompleteDemoProfile(this.props.profile) : this.props.profile;
    const {
      fname, lname, company_name, email, phone_number, status, category, company_logo_link,
      contact_email_1, contact_email_2, contact_email_3,
      contact_phone_no_1, contact_phone_no_2, contact_phone_no_3,
      contact_name_1, contact_name_2, contact_name_3,
      linked_in_link, document_link, street_address, headquarter, zip_code
    } = profile;
    const isGerman = Translator.getLocale() === 'de';
    const displayName = company_name || [fname, lname].filter(Boolean).join(' ') || 'PiHub Investor';
    const personName = [fname, lname].filter(Boolean).join(' ') || 'Not supplied';
    const address = [street_address, headquarter, zip_code].filter(Boolean).join(', ');
    const initials = displayName.split(/\s+/).filter(Boolean).slice(0, 2).map(value => value.charAt(0).toUpperCase()).join('');
    const verified = status === 'approved';
    const categoryLabel = titleCase(category || (isGerman ? 'Institutioneller Investor' : 'Institutional investor'));
    const compliance = profile.compliance_status || profile.kyc_status || (verified ? 'Verification complete' : 'Review pending');
    const permissions = profile.permissions || profile.roles || profile.scopes;
    const activeSessions = profile.active_sessions !== undefined ? profile.active_sessions : profile.session_count;
    const institutionId = profile.institution_id || profile.legal_entity_id || profile.registration_number;
    const complianceDocs = Array.isArray(profile.compliance_documents) ? profile.compliance_documents : [];
    const contacts = [
      this.renderContact(contact_name_1, profile.contact_role_1, contact_email_1, contact_phone_no_1, 1),
      this.renderContact(contact_name_2, profile.contact_role_2, contact_email_2, contact_phone_no_2, 2),
      this.renderContact(contact_name_3, profile.contact_role_3, contact_email_3, contact_phone_no_3, 3)
    ].filter(Boolean);

    return (
      <Fragment>
        <Subheader
          heading={isGerman ? 'Institutionelles Profil' : 'Institution profile'}
          description="Identity, relationship, governance and compliance information for this investor workspace."
          buttonLabel={isGerman ? 'Profil bearbeiten' : 'Edit profile'}
          link="/user/edit-profile"
        />

        <div className="institution-profile-v3">
          <section className="profile-v3-hero" data-motion="profile-hero" aria-label="Institution summary">
            <div className="profile-v3-identity">
              <div className="profile-v3-logo" aria-hidden="true">
                {company_logo_link ? <img src={company_logo_link} alt="" /> : <span>{initials || 'PI'}</span>}
              </div>
              <div className="profile-v3-identity-copy">
                <div className="profile-v3-eyebrow">Institution record</div>
                <h2>{displayName}</h2>
                <p>{categoryLabel}{headquarter ? ` · ${headquarter}` : ''}</p>
              </div>
            </div>

            <div className="profile-v3-hero-status">
              <span className={verified ? 'profile-v3-badge is-verified' : 'profile-v3-badge is-pending'}>
                <i className={verified ? 'bx bx-check-circle' : 'bx bx-time-five'} aria-hidden="true" />
                {verified ? (isGerman ? 'Verifiziert' : 'Verified') : (isGerman ? 'Prüfung' : 'Pending review')}
              </span>
              <span className="profile-v3-badge is-neutral"><i className="bx bx-building-house" aria-hidden="true" />{categoryLabel}</span>
            </div>

            <div className="profile-v3-summary-grid">
              <div><span>Institution ID</span><strong className="ap-mono">{valueText(institutionId)}</strong></div>
              <div><span>Primary contact</span><strong>{personName}</strong></div>
              <div><span>Compliance</span><strong>{valueText(compliance)}</strong></div>
              <div><span>Last review</span><strong>{formatDate(profile.last_security_review)}</strong></div>
            </div>

            {(linked_in_link || document_link) ? (
              <div className="profile-v3-hero-links">
                {linked_in_link ? <a href={linked_in_link} target="_blank" rel="noopener noreferrer"><i className="bx bxl-linkedin-square" aria-hidden="true" />LinkedIn</a> : null}
                {document_link ? <a href={document_link} target="_blank" rel="noopener noreferrer"><i className="bx bx-file" aria-hidden="true" />Institution document</a> : null}
              </div>
            ) : null}
          </section>

          <div className="profile-v3-layout">
            <div className="profile-v3-main">
              <section className="profile-v3-card" data-motion="profile-card" aria-labelledby="institution-details-title">
                <div className="profile-v3-card-head">
                  <div>
                    <span className="profile-v3-kicker">Identity</span>
                    <h3 id="institution-details-title">Institution details</h3>
                    <p>Legal identity and operating contact details used across the workspace.</p>
                  </div>
                </div>
                <div className="profile-v3-detail-grid">
                  <div className="profile-v3-detail"><span>Legal entity</span><strong>{displayName}</strong></div>
                  <div className="profile-v3-detail"><span>Registration number</span><strong className="ap-mono">{valueText(profile.registration_number)}</strong></div>
                  <div className="profile-v3-detail"><span>Primary email</span>{email ? <a href={`mailto:${email}`}>{email}</a> : <strong>Not supplied</strong>}</div>
                  <div className="profile-v3-detail"><span>Telephone</span>{phone_number ? <a href={`tel:${phone_number}`}>{phone_number}</a> : <strong>Not supplied</strong>}</div>
                  <div className="profile-v3-detail profile-v3-detail-wide"><span>Registered address</span><strong>{address || 'Not supplied'}</strong></div>
                  <div className="profile-v3-detail"><span>Headquarters</span><strong>{valueText(headquarter)}</strong></div>
                  <div className="profile-v3-detail"><span>Investor category</span><strong>{categoryLabel}</strong></div>
                </div>
              </section>

              <section className="profile-v3-card" data-motion="profile-card" aria-labelledby="compliance-title">
                <div className="profile-v3-card-head profile-v3-card-head-split">
                  <div>
                    <span className="profile-v3-kicker">Risk & compliance</span>
                    <h3 id="compliance-title">Compliance & verification</h3>
                    <p>Current verification posture, controls and supporting institutional evidence.</p>
                  </div>
                  <span className="profile-v3-health"><i className="bx bx-shield-quarter" aria-hidden="true" />{valueText(profile.risk_rating || 'Low risk')}</span>
                </div>
                <div className="profile-v3-control-grid">
                  <div><i className="bx bx-badge-check" aria-hidden="true" /><span>KYC status</span><strong>{valueText(compliance)}</strong></div>
                  <div><i className="bx bx-lock-alt" aria-hidden="true" /><span>MFA</span><strong>{profile.mfa_enabled ? 'Enabled' : 'Not supplied'}</strong></div>
                  <div><i className="bx bx-log-in-circle" aria-hidden="true" /><span>SSO provider</span><strong>{valueText(profile.sso_provider)}</strong></div>
                  <div><i className="bx bx-calendar-check" aria-hidden="true" /><span>Verified since</span><strong>{formatDate(profile.verified_at)}</strong></div>
                </div>
                <div className="profile-v3-documents" aria-label="Compliance documents">
                  <div className="profile-v3-subhead"><strong>Compliance documents</strong><span>{complianceDocs.length} on record</span></div>
                  {complianceDocs.length ? complianceDocs.slice(0, 4).map(this.renderDocument) : <div className="profile-v3-empty">No compliance documents are supplied by the current API.</div>}
                </div>
              </section>

              <section className="profile-v3-card" data-motion="profile-card" aria-labelledby="audit-title">
                <div className="profile-v3-card-head">
                  <div>
                    <span className="profile-v3-kicker">Activity</span>
                    <h3 id="audit-title">Audit history</h3>
                    <p>Recent governance and security events associated with the institution.</p>
                  </div>
                </div>
                <div className="profile-v3-audit-list">{this.renderAudit(profile.audit_history)}</div>
              </section>
            </div>

            <aside className="profile-v3-side" aria-label="Institution relationships and governance">
              <section className="profile-v3-card" data-motion="profile-card" aria-labelledby="relationship-team-title">
                <div className="profile-v3-card-head">
                  <div>
                    <span className="profile-v3-kicker">People</span>
                    <h3 id="relationship-team-title">Relationship team</h3>
                    <p>People responsible for investment, operations and compliance coordination.</p>
                  </div>
                </div>
                <div className="profile-v3-people">{contacts.length ? contacts : <div className="profile-v3-empty">No relationship contacts are available.</div>}</div>
              </section>

              <section className="profile-v3-card" data-motion="profile-card" aria-labelledby="governance-title">
                <div className="profile-v3-card-head">
                  <div>
                    <span className="profile-v3-kicker">Access</span>
                    <h3 id="governance-title">Governance & access</h3>
                    <p>Workspace identity, role scope and session posture.</p>
                  </div>
                </div>
                <div className="profile-v3-governance-list">
                  <div><span><i className="bx bx-check-shield" aria-hidden="true" />Verification</span><strong>{verified ? 'Verified' : 'Pending'}</strong></div>
                  <div><span><i className="bx bx-id-card" aria-hidden="true" />Institution identifier</span><strong className="ap-mono">{valueText(institutionId)}</strong></div>
                  <div><span><i className="bx bx-user-check" aria-hidden="true" />Permissions / roles</span><strong>{valueText(permissions)}</strong></div>
                  <div><span><i className="bx bx-devices" aria-hidden="true" />Active sessions</span><strong>{valueText(activeSessions)}</strong></div>
                  <div><span><i className="bx bx-time" aria-hidden="true" />Last sign-in</span><strong>{formatDate(profile.last_login_at || profile.last_login)}</strong></div>
                  <div><span><i className="bx bx-task" aria-hidden="true" />Onboarding</span><strong>{valueText(profile.onboarding_status)}</strong></div>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </Fragment>
    );
  }
}

function mapStateToProps(state) { return { profile: state.profile }; }
export default connect(mapStateToProps, { getProfile })(ViewProfile);
