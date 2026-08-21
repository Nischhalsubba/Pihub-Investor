import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { inputField } from '../../_formFields';
import * as validation from '../../_utils/validate';
import * as actions from '../../actions/login';
import Translate from 'react-translate-component';

const Translator = require('react-translate-component');

class Login extends Component {
  onSubmit = formProps => {
    this.props.signin(formProps, () => this.props.history.push('/'));
  };

  render() {
    const { handleSubmit } = this.props;
    const isGerman = Translator.getLocale() === 'de';

    return (
      <main className="auth-world">
        <section className="auth-form-panel" aria-labelledby="login-title">
          <div className="auth-card" data-motion="auth-card">
            <Link className="auth-brand" to="/login" aria-label="PiHub Investor">
              <span className="auth-brand-logo" aria-hidden="true">
                <img src="/assets/img/logo.png" alt="" />
              </span>
              <strong>PiHub Investor</strong>
            </Link>

            <div className="auth-eyebrow">{isGerman ? 'Sicherer Investorenzugang' : 'Secure investor access'}</div>
            <Translate content="label.login" component="h1" className="page-title" id="login-title" />
            <Translate content="label.enteryouremail" component="p" className="page-desc" />

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
          </div>
        </section>

        <aside className="auth-visual" aria-hidden="true">
          <canvas id="capital-field" />
          <div className="auth-visual-copy" data-motion="auth-visual-copy">
            <span>{isGerman ? 'Kapitalentscheidungen, klar strukturiert' : 'Capital decisions, structured clearly'}</span>
            <h2>{isGerman ? 'Ein Arbeitsbereich für Kredite, Chancen und Portfolioentscheidungen.' : 'One workspace for credit, opportunities and portfolio decisions.'}</h2>
            <p>{isGerman ? 'Prüfen Sie die relevanten Daten, verfolgen Sie Anfragen und behalten Sie investierte Positionen ohne unnötige visuelle Ablenkung im Blick.' : 'Review the relevant data, track requests and monitor invested positions without unnecessary visual noise.'}</p>
            <div className="auth-proof">
              <div><strong>01</strong><small>{isGerman ? 'Chancen' : 'Opportunities'}</small></div>
              <div><strong>02</strong><small>{isGerman ? 'Kreditanfragen' : 'Credit requests'}</small></div>
              <div><strong>03</strong><small>{isGerman ? 'Portfolio' : 'Portfolio'}</small></div>
            </div>
          </div>
        </aside>
      </main>
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
