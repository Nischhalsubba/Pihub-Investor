import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { inputField } from '../../_formFields';
import { changePasswordWithToken } from '../../actions/password';
import * as validation from '../../_utils/validate';
import AuthShell from './AuthShell';

const Translator = require('react-translate-component');

class SetPassword extends Component {
  onSubmit = formProps => {
    const payload = { ...formProps, token: this.props.match.params.token };
    this.props.changePasswordWithToken(payload, () => this.props.history.push('/password-change-success'));
  };

  renderError = error => {
    if (!error) return null;
    const values = Array.isArray(error) ? error : Object.keys(error).map(key => error[key]).filter(Boolean);
    if (!values.length) return null;
    return <div className="auth-error" role="alert"><ul className="auth-error-list">{values.map((value, index) => <li key={`${value}-${index}`}>{value}</li>)}</ul></div>;
  };

  render() {
    const { handleSubmit } = this.props;
    const isGerman = Translator.getLocale() === 'de';

    return (
      <AuthShell
        eyebrow={isGerman ? 'Kontowiederherstellung' : 'Account recovery'}
        title={isGerman ? 'Neues Passwort festlegen' : 'Set a new password'}
        description={isGerman ? 'Wählen Sie ein neues Passwort und bestätigen Sie es, um den Kontozugang wiederherzustellen.' : 'Choose a new password and confirm it to restore account access.'}
        visualEyebrow={isGerman ? 'Sicherer Zugang' : 'Secure access'}
        visualTitle={isGerman ? 'Ein kontrollierter Schritt zurück in Ihren Arbeitsbereich.' : 'One controlled step back into your workspace.'}
        visualDescription={isGerman ? 'Die Änderung betrifft Ihre Zugangsdaten, nicht Ihre Produkte, Anfragen oder investierten Positionen.' : 'The change affects your credentials, not your products, requests or invested positions.'}
        proofItems={[{ label: isGerman ? 'Passwort' : 'Password' }, { label: isGerman ? 'Bestätigen' : 'Confirm' }, { label: isGerman ? 'Anmelden' : 'Sign in' }]}
      >
        <form className="form-signin" onSubmit={handleSubmit(this.onSubmit)} noValidate>
          <div className="form-group">
            <Field
              type="password"
              name="password"
              component={inputField}
              className="form-control"
              label={isGerman ? 'Neues Passwort' : 'New password'}
              autoComplete="new-password"
            />
          </div>
          <div className="form-group">
            <Field
              type="password"
              name="password_confirmation"
              component={inputField}
              className="form-control"
              label={isGerman ? 'Passwort bestätigen' : 'Confirm password'}
              autoComplete="new-password"
            />
          </div>
          {this.renderError(this.props.errMsg)}
          <button className="btn btn-primary btn-form" type="submit">{isGerman ? 'Passwort speichern' : 'Save password'}</button>
        </form>
      </AuthShell>
    );
  }
}

function validate(values) {
  const errors = {};
  errors.password = validation.required(values.password) || validation.password(values.password);
  if (!values.password_confirmation) errors.password_confirmation = '* Required';
  else if (values.password !== values.password_confirmation) errors.password_confirmation = '* Password Mismatch';
  return errors;
}

function mapStateToProps(state) {
  return { errMsg: state.errors || state.error };
}

export default compose(
  connect(mapStateToProps, { changePasswordWithToken }),
  reduxForm({ validate, form: 'setPassword' })
)(SetPassword);
