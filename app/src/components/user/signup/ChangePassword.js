import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { inputField } from '../../../_formFields';
import { getTokenForEmail, changePasswordWithToken } from '../../../actions/password';
import * as validation from '../../../_utils/validate';
import Subheader from '../../general/Subheader';

const Translator = require('react-translate-component');

class ChangePassword extends Component {
  state = { step: 'verify', token: null };

  onSubmit = formProps => {
    if (this.state.step === 'verify') {
      this.props.getTokenForEmail({ email: formProps.email }, token => this.setState({ step: 'reset', token }));
      return;
    }

    const payload = {
      password: formProps.password,
      password_confirmation: formProps.password_confirmation,
      token: this.state.token
    };
    this.props.changePasswordWithToken(payload, () => this.props.history.push('/password-change-success'));
  };

  renderErrors = error => {
    if (!error) return null;
    const values = Array.isArray(error) ? error : Object.keys(error).map(key => error[key]).filter(Boolean);
    if (!values.length) return null;
    return <div className="auth-error" role="alert"><ul className="auth-error-list">{values.map((value, index) => <li key={`${value}-${index}`}>{value}</li>)}</ul></div>;
  };

  render() {
    const { handleSubmit } = this.props;
    const isGerman = Translator.getLocale() === 'de';
    const verifyStep = this.state.step === 'verify';

    return (
      <div>
        <Subheader heading={isGerman ? 'Passwort ändern' : 'Change password'} />
        <section className="account-form-panel" data-motion="table-shell">
          <div className="account-form-head">
            <span>{verifyStep ? '01' : '02'}</span>
            <div>
              <h2>{verifyStep ? (isGerman ? 'Konto verifizieren' : 'Verify account') : (isGerman ? 'Neues Passwort' : 'New password')}</h2>
              <p>{verifyStep ? (isGerman ? 'Bestätigen Sie zuerst die E-Mail-Adresse Ihres Kontos.' : 'Confirm the email address associated with your account first.') : (isGerman ? 'Legen Sie anschließend das neue Passwort fest.' : 'Then choose and confirm your new password.')}</p>
            </div>
          </div>
          <form className="account-form-body" onSubmit={handleSubmit(this.onSubmit)} noValidate>
            {verifyStep ? (
              <div className="form-group">
                <Field name="email" type="email" component={inputField} label="Email" className="form-control" autoComplete="email" />
              </div>
            ) : (
              <React.Fragment>
                <div className="form-group">
                  <Field name="password" type="password" component={inputField} label={isGerman ? 'Neues Passwort' : 'New password'} className="form-control" autoComplete="new-password" />
                </div>
                <div className="form-group">
                  <Field name="password_confirmation" type="password" component={inputField} label={isGerman ? 'Passwort bestätigen' : 'Confirm password'} className="form-control" autoComplete="new-password" />
                </div>
              </React.Fragment>
            )}
            {this.renderErrors(this.props.errMsg)}
            <button className="btn btn-primary" type="submit">{verifyStep ? (isGerman ? 'Weiter' : 'Continue') : (isGerman ? 'Passwort speichern' : 'Save password')}</button>
          </form>
        </section>
      </div>
    );
  }
}

function validate(values) {
  const errors = {};
  if (values.email) errors.email = validation.newEmail(values.email);
  if (values.password || values.password_confirmation) {
    errors.password = validation.required(values.password) || validation.password(values.password);
    if (!values.password_confirmation) errors.password_confirmation = '* Required';
    else if (values.password !== values.password_confirmation) errors.password_confirmation = '* Password Mismatch';
  }
  return errors;
}

function mapStateToProps(state) {
  return { errMsg: state.errors || state.error };
}

export default compose(
  connect(mapStateToProps, { getTokenForEmail, changePasswordWithToken }),
  reduxForm({ validate, form: 'changePassword' })
)(ChangePassword);
