import React, { Component, Fragment } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { getProfile, editProfile } from '../../../actions/profile';
import Translate from 'react-translate-component';
import Subheader from '../../general/Subheader';
import { inputField, renderDropzoneField } from '../../../_formFields/';

const Translator = require('react-translate-component');

class EditProfile extends Component {
  state = { file: null, previewUrl: null };

  componentDidMount() {
    this.props.getProfile();
  }

  componentWillUnmount() {
    if (this.state.previewUrl) URL.revokeObjectURL(this.state.previewUrl);
  }

  onFileChange = event => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    if (this.state.previewUrl) URL.revokeObjectURL(this.state.previewUrl);
    this.setState({ file, previewUrl: URL.createObjectURL(file) });
  };

  onSubmit = formProps => {
    const payload = { ...formProps };
    if (this.state.file) payload.company_logo = this.state.file;
    this.props.editProfile(payload, () => this.props.history.push('/user/profile'));
  };

  renderContactFields = index => {
    const isGerman = Translator.getLocale() === 'de';
    return (
      <fieldset className="profile-edit-contact" key={index}>
        <legend>{isGerman ? `Ansprechpartner ${index}` : `Contact ${index}`}</legend>
        <Field
          name={`contact_name_${index}`}
          type="text"
          component={inputField}
          label={isGerman ? 'Name' : 'Name'}
          className="form-control"
          autoComplete="name"
        />
        <Field
          name={`contact_email_${index}`}
          type="email"
          component={inputField}
          label="Email"
          className="form-control"
          autoComplete="email"
        />
        <Field
          name={`contact_phone_no_${index}`}
          type="tel"
          component={inputField}
          label={isGerman ? 'Telefon' : 'Phone'}
          className="form-control"
          autoComplete="tel"
        />
      </fieldset>
    );
  };

  render() {
    const { handleSubmit, initialValues } = this.props;
    const isGerman = Translator.getLocale() === 'de';
    const logo = this.state.previewUrl || (initialValues && initialValues.company_logo_link);
    const companyName = initialValues && initialValues.company_name ? initialValues.company_name : 'PiHub';
    const initials = companyName.split(/\s+/).filter(Boolean).slice(0, 2).map(value => value.charAt(0).toUpperCase()).join('');

    return (
      <Fragment>
        <Subheader heading={isGerman ? 'Profil bearbeiten' : 'Edit profile'} />

        <form className="profile-edit-form" onSubmit={handleSubmit(this.onSubmit)}>
          <section className="profile-edit-logo-panel">
            <div className="profile-logo" aria-hidden="true">
              {logo ? <img src={logo} alt="" /> : <span>{initials || 'PI'}</span>}
            </div>
            <div>
              <strong>{isGerman ? 'Unternehmenslogo' : 'Company logo'}</strong>
              <span>{isGerman ? 'PNG, JPG oder GIF. Das Bild wird nur nach dem Speichern übernommen.' : 'PNG, JPG or GIF. The image is applied when you save the profile.'}</span>
              <label className="btn btn-secondary profile-file-button">
                <i className="bx bx-upload" aria-hidden="true" />
                {isGerman ? 'Bild auswählen' : 'Choose image'}
                <input type="file" accept="image/png,image/gif,image/jpeg" onChange={this.onFileChange} />
              </label>
            </div>
          </section>

          <section className="profile-edit-section" aria-labelledby="company-section-title">
            <div className="profile-edit-section-head">
              <span>01</span>
              <div>
                <h2 id="company-section-title">{isGerman ? 'Unternehmen' : 'Company'}</h2>
                <p>{isGerman ? 'Grundlegende Unternehmens- und Standortdaten.' : 'Core company and location information.'}</p>
              </div>
            </div>
            <div className="profile-edit-grid">
              <div className="profile-edit-field profile-edit-field-wide">
                <Field name="company_name" type="text" component={inputField} label={isGerman ? 'Unternehmensname' : 'Company name'} className="form-control" />
              </div>
              <div className="profile-edit-field">
                <Field name="headquarter" type="text" component={inputField} label={isGerman ? 'Hauptsitz' : 'Headquarters'} className="form-control" />
              </div>
              <div className="profile-edit-field">
                <Field name="category" component="select" className="form-control">
                  <option value="bank">Bank</option>
                  <option value="sparkasse">Sparkasse</option>
                  <option value="kreditfons">Kreditfons</option>
                  <option value="family-office">Family Office</option>
                </Field>
                <span className="profile-edit-helper">{isGerman ? 'Investorenkategorie' : 'Investor category'}</span>
              </div>
              <div className="profile-edit-field">
                <Field name="street_address" type="text" component={inputField} label={isGerman ? 'Straße' : 'Street address'} className="form-control" autoComplete="street-address" />
              </div>
              <div className="profile-edit-field">
                <Field name="zip_code" type="text" component={inputField} label={isGerman ? 'Postleitzahl' : 'Postal code'} className="form-control" autoComplete="postal-code" />
              </div>
            </div>
          </section>

          <section className="profile-edit-section" aria-labelledby="contacts-section-title">
            <div className="profile-edit-section-head">
              <span>02</span>
              <div>
                <h2 id="contacts-section-title">{isGerman ? 'Ansprechpartner' : 'Contacts'}</h2>
                <p>{isGerman ? 'Pflegen Sie nur Personen, die für Investitions- oder Kreditprozesse relevant sind.' : 'Keep only the people relevant to investment or credit workflows.'}</p>
              </div>
            </div>
            <div className="profile-edit-contacts">
              {[1, 2, 3].map(this.renderContactFields)}
            </div>
          </section>

          <section className="profile-edit-section" aria-labelledby="links-section-title">
            <div className="profile-edit-section-head">
              <span>03</span>
              <div>
                <h2 id="links-section-title">{isGerman ? 'Links und Dokumente' : 'Links and documents'}</h2>
                <p>{isGerman ? 'Optionale öffentliche Profile und Unternehmensunterlagen.' : 'Optional public profiles and company documentation.'}</p>
              </div>
            </div>
            <div className="profile-edit-grid">
              <div className="profile-edit-field">
                <Field name="facebook_link" type="url" component={inputField} label="Facebook" className="form-control" placeholder="https://facebook.com/..." />
              </div>
              <div className="profile-edit-field">
                <Field name="twitter_link" type="url" component={inputField} label="Twitter" className="form-control" placeholder="https://twitter.com/..." />
              </div>
              <div className="profile-edit-field profile-edit-field-wide">
                <Field name="linked_in_link" type="url" component={inputField} label="LinkedIn" className="form-control" placeholder="https://linkedin.com/..." />
              </div>
              <div className="profile-edit-field profile-edit-field-wide">
                <strong className="profile-edit-upload-label"><Translate content="label.fileupload" /></strong>
                <Field name="document" component={renderDropzoneField} type="file" className="file-uploader file-uploader--small dropzone" />
              </div>
            </div>
          </section>

          <div className="profile-edit-actions">
            <button className="btn btn-primary" type="submit">{isGerman ? 'Änderungen speichern' : 'Save changes'}</button>
          </div>
        </form>
      </Fragment>
    );
  }
}

EditProfile = reduxForm({
  form: 'editProfile',
  enableReinitialize: true
})(EditProfile);

EditProfile = connect(
  state => ({ initialValues: state.profile }),
  { getProfile, editProfile }
)(EditProfile);

export default EditProfile;
