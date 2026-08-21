import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { inputField, checkBox } from '../../_formFields';
import * as validation from '../../_utils/validate';
import { signup } from '../../actions/signup';
import { clearError } from '../../actions/clearError';
import { connect } from 'react-redux';
import { compose } from 'redux';
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/dist/style.css';
import Translate from 'react-translate-component';
import AuthShell from './AuthShell';

const Translator = require('react-translate-component');

class Signup extends Component {
  state = { phone: '', phoneError: null };

  componentDidMount() {
    this.props.clearError();
  }

  onSubmit = formProps => {
    const isGerman = Translator.getLocale() === 'de';
    if (!this.state.phone) {
      this.setState({ phoneError: isGerman ? 'Bitte geben Sie eine Telefonnummer ein.' : 'Please enter a phone number.' });
      return;
    }

    const payload = { ...formProps, phone_number: this.state.phone };
    this.props.signup(payload, () => this.props.history.push('/signup/confirm-email'));
  };

  displayErrors = errors => {
    if (!errors) return null;
    const values = Array.isArray(errors) ? errors : Object.keys(errors).map(key => errors[key]).filter(Boolean);
    if (!values.length) return null;
    return (
      <div className="auth-error" role="alert">
        <ul className="auth-error-list">
          {values.map((error, index) => <li key={`${error}-${index}`}>{error}</li>)}
        </ul>
      </div>
    );
  };

  render() {
    const { handleSubmit } = this.props;
    const isGerman = Translator.getLocale() === 'de';

    return (
      <AuthShell
        wide
        eyebrow={isGerman ? 'Investorenzugang erstellen' : 'Create investor access'}
        title={<Translate content="label.signupto" />}
        description={<Translate content="label.enteryourdetails" />}
        visualEyebrow={isGerman ? 'Ein Zugang, ein Arbeitsbereich' : 'One account, one workspace'}
        visualTitle={isGerman ? 'Von der Kreditanfrage bis zur investierten Position.' : 'From credit request to invested position.'}
        visualDescription={isGerman ? 'PiHub bündelt produktbezogene Prüfungen, Anfragen und Portfoliopositionen in einem konsistenten Arbeitsbereich.' : 'PiHub keeps product review, requests and portfolio positions in one consistent workspace.'}
        proofItems={[
          { label: isGerman ? 'Prüfen' : 'Review' },
          { label: isGerman ? 'Entscheiden' : 'Decide' },
          { label: isGerman ? 'Verfolgen' : 'Track' }
        ]}
      >
        <form className="form-signin auth-signup-form" onSubmit={handleSubmit(this.onSubmit)} noValidate>
          <div className="auth-form-grid">
            <div className="form-group">
              <Field name="fname" type="text" component={inputField} label={<Translate content="label.firstname" />} className="form-control" autoComplete="given-name" />
            </div>
            <div className="form-group">
              <Field name="lname" type="text" component={inputField} label={<Translate content="label.lastname" />} className="form-control" autoComplete="family-name" />
            </div>
          </div>

          <div className="form-group">
            <Field name="company_name" type="text" component={inputField} label={<Translate content="label.companyname" />} className="form-control" autoComplete="organization" />
          </div>
          <div className="form-group">
            <Field name="email" type="email" component={inputField} label={<Translate content="label.emailaddress" />} className="form-control" autoComplete="email" />
          </div>

          <div className="auth-form-grid">
            <div className="form-group">
              <Field name="password" type="password" component={inputField} label={<Translate content="label.password" />} className="form-control" autoComplete="new-password" />
            </div>
            <div className="form-group">
              <Field name="password_confirmation" type="password" component={inputField} label={<Translate content="label.confirmpassword" />} className="form-control" autoComplete="new-password" />
            </div>
          </div>

          <div className="form-group auth-phone-field">
            <Translate content="label.phonenumber" component="label" />
            <ReactPhoneInput
              defaultCountry="de"
              regions="europe"
              value={this.state.phone}
              onChange={phone => this.setState({ phone, phoneError: null })}
              inputExtraProps={{ name: 'phone_number', required: true, autoComplete: 'tel' }}
            />
            {this.state.phoneError ? <div className="error-text" role="alert">{this.state.phoneError}</div> : null}
          </div>

          <div className="auth-terms"><Field name="agreed_term" component={checkBox} type="checkbox" /></div>

          {this.displayErrors(this.props.errMsg)}
          <Translate content="button.signup" className="btn btn-primary btn-form" type="submit" component="button" />
        </form>

        <div className="auth-foot">
          <Translate content="label.alreadyhaveanaccount" />&nbsp;
          <Link to="/login"><strong><Translate content="label.login" /></strong></Link>
        </div>
      </AuthShell>
    );
  }
}

function validate(values) {
  const errors = {};
  errors.fname = validation.required(values.fname);
  errors.lname = validation.required(values.lname);
  errors.email = values.email ? validation.newEmail(values.email) : '* Required';
  errors.password = validation.required(values.password) || validation.password(values.password);
  if (!values.password_confirmation) errors.password_confirmation = '* Required';
  else if (values.password !== values.password_confirmation) errors.password_confirmation = '* Password Mismatch';
  if (!values.agreed_term) errors.agreed_term = '* Please accept Terms and Conditions';
  return errors;
}

function mapStateToProps(state) {
  return { errMsg: state.errors };
}

export default compose(
  connect(mapStateToProps, { signup, clearError }),
  reduxForm({ validate, form: 'signup' })
)(Signup);
