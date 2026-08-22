import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link, Prompt } from 'react-router-dom';
import Subheader from '../../general/Subheader';
import Spinner from '../../general/Spinner';
import { getProfile, editProfile } from '../../../actions/profile';

const PROFILE_FIELDS = [
  'company_name', 'headquarter', 'category', 'street_address', 'zip_code',
  'contact_name_1', 'contact_email_1', 'contact_phone_no_1',
  'contact_name_2', 'contact_email_2', 'contact_phone_no_2',
  'contact_name_3', 'contact_email_3', 'contact_phone_no_3',
  'linked_in_link', 'facebook_link', 'twitter_link'
];

const blankForm = profile => PROFILE_FIELDS.reduce((result, field) => {
  result[field] = profile && profile[field] !== undefined && profile[field] !== null ? profile[field] : '';
  return result;
}, {});

class EditProfile extends Component {
  state = {
    form: null,
    companyLogo: null,
    previewUrl: null,
    document: [],
    dirty: false,
    isSubmitting: false,
    uploadProgress: 0,
    statusMessage: '',
    errors: {}
  };

  componentDidMount() {
    this.mounted = true;
    this.props.getProfile();
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  }

  componentDidUpdate(prevProps) {
    if (this.props.profile !== prevProps.profile && this.props.profile && !this.state.form) {
      this.setState({ form: blankForm(this.props.profile) });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
    if (this.state.previewUrl) URL.revokeObjectURL(this.state.previewUrl);
  }

  handleBeforeUnload = event => {
    if (!this.state.dirty || this.state.isSubmitting) return;
    event.preventDefault();
    event.returnValue = '';
  };

  update = (field, value) => this.setState(prev => ({
    form: { ...prev.form, [field]: value },
    dirty: true,
    statusMessage: '',
    errors: { ...prev.errors, [field]: undefined }
  }));

  handleLogo = event => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    if (!/^image\/(png|jpeg|gif)$/.test(file.type) || file.size > 4 * 1024 * 1024) {
      this.setState(prev => ({ errors: { ...prev.errors, company_logo: 'Use a PNG, JPG or GIF up to 4 MB.' } }));
      event.target.value = '';
      return;
    }
    if (this.state.previewUrl) URL.revokeObjectURL(this.state.previewUrl);
    this.setState({ companyLogo: file, previewUrl: URL.createObjectURL(file), dirty: true });
  };

  handleDocuments = event => {
    const files = Array.from(event.target.files || []);
    const oversized = files.find(file => file.size > 8 * 1024 * 1024);
    if (oversized) {
      this.setState(prev => ({ errors: { ...prev.errors, document: `${oversized.name} is larger than 8 MB.` } }));
      event.target.value = '';
      return;
    }
    this.setState(prev => ({ document: files, dirty: true, errors: { ...prev.errors, document: undefined } }));
  };

  validate = () => {
    const errors = {};
    const form = this.state.form || {};
    if (!String(form.company_name || '').trim()) errors.company_name = 'Company name is required.';
    if (!String(form.headquarter || '').trim()) errors.headquarter = 'Headquarters is required.';
    ['contact_email_1', 'contact_email_2', 'contact_email_3'].forEach(field => {
      const value = String(form[field] || '').trim();
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errors[field] = 'Enter a valid email address.';
    });
    this.setState({ errors });
    return errors;
  };

  focusFirstError = errors => {
    const field = Object.keys(errors)[0];
    const node = field && document.getElementById(`profile-${field}`);
    if (node && node.focus) node.focus();
  };

  handleSubmit = async event => {
    event.preventDefault();
    const errors = this.validate();
    if (Object.keys(errors).length) {
      this.focusFirstError(errors);
      return;
    }

    const payload = {
      ...this.props.profile,
      ...this.state.form,
      document: this.state.document,
      ...(this.state.companyLogo ? { company_logo: this.state.companyLogo } : {})
    };

    this.setState({ isSubmitting: true, uploadProgress: 0, statusMessage: 'Saving profile…' });
    const ok = await this.props.editProfile(
      payload,
      () => this.props.history.push('/user/profile'),
      progress => { if (this.mounted) this.setState({ uploadProgress: progress }); }
    );
    if (!this.mounted) return;
    if (ok === false) this.setState({ isSubmitting: false, statusMessage: 'Save failed. Your changes remain on this page.' });
  };

  field = (name, label, props = {}) => {
    const form = this.state.form || {};
    const error = this.state.errors[name];
    const { wrapperClassName = '', ...inputProps } = props;
    return (
      <div className={`profile-edit-field ${wrapperClassName}`.trim()}>
        <label htmlFor={`profile-${name}`}>{label}</label>
        <input
          id={`profile-${name}`}
          className="form-control"
          value={form[name] || ''}
          onChange={event => this.update(name, event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `profile-${name}-error` : undefined}
          {...inputProps}
        />
        {error ? <span className="field-error" id={`profile-${name}-error`} role="alert">{error}</span> : null}
      </div>
    );
  };

  renderContact = index => (
    <fieldset className="profile-edit-contact" key={index}>
      <legend>Contact {index}</legend>
      {this.field(`contact_name_${index}`, 'Name', { autoComplete: 'name' })}
      {this.field(`contact_email_${index}`, 'Email', { type: 'email', autoComplete: 'email' })}
      {this.field(`contact_phone_no_${index}`, 'Phone', { type: 'tel', autoComplete: 'tel' })}
    </fieldset>
  );

  render() {
    if (!this.state.form || !this.props.profile) return <div className="data-loading" role="status" aria-live="polite"><Spinner /></div>;

    const logo = this.state.previewUrl || this.props.profile.company_logo_link;
    const companyName = this.state.form.company_name || 'PiHub';
    const initials = companyName.split(/\s+/).filter(Boolean).slice(0, 2).map(value => value.charAt(0).toUpperCase()).join('');
    const errorCount = Object.keys(this.state.errors).filter(key => this.state.errors[key]).length;

    return (
      <Fragment>
        <Subheader heading="Edit profile" description="Maintain institutional identity, relationship contacts and review documents." />
        <form className="profile-edit-form" onSubmit={this.handleSubmit} noValidate>
          <Prompt when={this.state.dirty && !this.state.isSubmitting} message="You have unsaved profile changes. Leave this page?" />

          {errorCount ? <div className="auth-error form-error-summary" role="alert"><strong>{errorCount} field{errorCount === 1 ? '' : 's'} need attention.</strong></div> : null}

          <section className="profile-edit-logo-panel" aria-labelledby="company-logo-title">
            <div className="profile-logo" aria-hidden="true">{logo ? <img src={logo} alt="" /> : <span>{initials || 'PI'}</span>}</div>
            <div>
              <strong id="company-logo-title">Company logo</strong>
              <span>PNG, JPG or GIF up to 4 MB. The image changes only after you save.</span>
              <label className="btn btn-secondary profile-file-button">Choose image<input type="file" accept="image/png,image/gif,image/jpeg" onChange={this.handleLogo} /></label>
              {this.state.errors.company_logo ? <span className="field-error" role="alert">{this.state.errors.company_logo}</span> : null}
            </div>
          </section>

          <section className="profile-edit-section" aria-labelledby="profile-company-title">
            <div className="profile-edit-section-head"><div><h2 id="profile-company-title">Company</h2><p>Core legal and location information used throughout the investor workspace.</p></div></div>
            <div className="profile-edit-grid">
              {this.field('company_name', 'Company name *', { wrapperClassName: 'profile-edit-field-wide' })}
              {this.field('headquarter', 'Headquarters *')}
              <div className="profile-edit-field">
                <label htmlFor="profile-category">Investor category</label>
                <select id="profile-category" className="form-control" value={this.state.form.category || 'bank'} onChange={event => this.update('category', event.target.value)}>
                  <option value="bank">Bank</option>
                  <option value="sparkasse">Sparkasse</option>
                  <option value="kreditfons">Credit fund</option>
                  <option value="family-office">Family office</option>
                </select>
              </div>
              {this.field('street_address', 'Street address', { autoComplete: 'street-address' })}
              {this.field('zip_code', 'Postal code', { autoComplete: 'postal-code' })}
            </div>
          </section>

          <section className="profile-edit-section" aria-labelledby="profile-contacts-title">
            <div className="profile-edit-section-head"><div><h2 id="profile-contacts-title">Relationship contacts</h2><p>Keep only people who are relevant to investment, credit or operational workflows.</p></div></div>
            <div className="profile-edit-contacts profile-edit-contacts-vertical">{[1, 2, 3].map(this.renderContact)}</div>
          </section>

          <section className="profile-edit-section" aria-labelledby="profile-links-title">
            <div className="profile-edit-section-head"><div><h2 id="profile-links-title">Links and documents</h2><p>Operationally relevant public identity and supporting documentation.</p></div></div>
            <div className="profile-edit-grid">
              {this.field('linked_in_link', 'LinkedIn', { type: 'url', placeholder: 'https://linkedin.com/company/…', wrapperClassName: 'profile-edit-field-wide' })}
              <div className="profile-edit-field profile-edit-field-wide">
                <label htmlFor="profile-document">Company documents <span className="optional-label">Optional</span></label>
                <input id="profile-document" className="form-control" type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg" onChange={this.handleDocuments} />
                <span className="profile-edit-helper">Maximum 8 MB per file. Upload only documentation appropriate for the institution record.</span>
                {this.state.document.length ? <div className="selected-files">{this.state.document.map(file => <span key={`${file.name}-${file.lastModified}`}>{file.name}</span>)}</div> : null}
                {this.state.errors.document ? <span className="field-error" role="alert">{this.state.errors.document}</span> : null}
                {this.state.isSubmitting && this.state.document.length ? <progress className="upload-progress" max="100" value={this.state.uploadProgress}>{this.state.uploadProgress}%</progress> : null}
              </div>
              <details className="profile-edit-field profile-edit-field-wide secondary-links">
                <summary>Optional social links</summary>
                <p className="profile-edit-helper">These are secondary profile references and do not affect investment workflows.</p>
                <div className="profile-edit-grid">
                  {this.field('facebook_link', 'Facebook', { type: 'url', placeholder: 'https://facebook.com/…' })}
                  {this.field('twitter_link', 'X / Twitter', { type: 'url', placeholder: 'https://x.com/…' })}
                </div>
              </details>
            </div>
          </section>

          <div className="profile-edit-actions">
            <div className="form-action-status" role="status" aria-live="polite">{this.state.statusMessage}</div>
            <Link className="btn btn-link" to="/user/profile">Cancel</Link>
            <button className="btn btn-primary" type="submit" disabled={this.state.isSubmitting}>{this.state.isSubmitting ? 'Saving…' : 'Save changes'}</button>
          </div>
        </form>
      </Fragment>
    );
  }
}

export default connect(state => ({ profile: state.profile }), { getProfile, editProfile })(EditProfile);
