import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { inputField } from '../../_formFields';
import * as validation from '../../_utils/validate';
import * as actions from '../../actions/login';
import Translate from 'react-translate-component';
import AuthShell from './AuthShell';

const Translator = require('react-translate-component');

class Login extends Component {
  onSubmit = formProps => {
    this.props.signin(formProps, () => this.props.history.push('/'));
  };

  render() {
    const { handleSubmit } = this.props;
    const isGerman = Translator.getLocale() === 'de';

    return (
      <AuthShell
        eyebrow={isGerman ? 'Sicherer Investorenzugang' : 'Secure investor access'}
        title={<Translate content="label.login" />}
        description={<Translate content="label.enteryouremail" />}
        visualEyebrow={isGerman ? 'Kapitalentscheidungen, klar strukturiert' : 'Capital decisions, structured clearly'}
        visualTitle={isGerman ? 'Ein Arbeitsbereich für Kredite, Chancen und Portfolioentscheidungen.' : 'One workspace for credit, opportunities and portfolio decisions.'}
        visualDescription={isGerman ? 'Prüfen Sie relevante Daten, verfolgen Sie Anfragen und behalten Sie investierte Positionen ohne unnötige visuelle Ablenkung im Blick.' : 'Review relevant data, track requests and monitor invested positions without unnecessary visual noise.'}
        proofItems={[
          { label: isGerman ? 'Chancen' : 'Opportunities' },
          { label: isGerman ? 'Kreditanfragen' : 'Credit requests' },
          { label: 'Portfolio' }
        ]}
      >
        <form className="form-signin" onSubmit={handleSubmit(this.onSubmit)} noValidate>
          <div className="form-group">
            <Field
              name="email"
              type="email"
              component={inputField}
              label={<Translate content="label.emailaddress" />}
              className="form-control"
              validate={[validation.newEmail, validation.required]}
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <Field
              name="password"
              type="password"
              component={inputField}
              label={<Translate content="label.password" />}
              className="form-control"
              validate={validation.required}
              autoComplete="current-password"
            />
          </div>

          {this.props.errorMessage ? <div className="auth-error" role="alert">{this.props.errorMessage}</div> : null}

          <div className="auth-meta">
            <Link to="/forgot-password"><Translate content="label.forgotPassword" /></Link>
          </div>

          <Translate content="label.login" component="button" className="btn btn-primary btn-form" type="submit" />
        </form>

        <div className="auth-foot">
          <Translate content="label.ifyoudont" />&nbsp;
          <Link to="/signup"><strong><Translate content="label.here" /></strong></Link>
        </div>
      </AuthShell>
    );
  }
}

function mapStateToProps(state) {
  return { errorMessage: state.auth.errorMessage };
}

export default compose(
  connect(mapStateToProps, actions),
  reduxForm({ form: 'login' })
)(Login);
