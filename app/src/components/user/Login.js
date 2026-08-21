import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { inputField } from '../../_formFields';
import * as validation from '../../_utils/validate';
import * as actions from '../../actions/login';
import Translate from 'react-translate-component';

class Login extends Component {
  onSubmit = formProps => {
    this.props.signin(formProps, () => this.props.history.push('/'));
  };

  render() {
    const { handleSubmit } = this.props;
    return (
      <main className="auth-world">
        <section className="auth-form-panel">
          <div className="auth-card" data-motion="auth-card">
            <div className="auth-brand">
              <div className="sidebar-mark" aria-hidden="true">P</div>
              <strong>PiHub Investor</strong>
            </div>
            <div className="auth-eyebrow">Private capital workspace</div>
            <Translate content="label.login" component="h1" className="page-title" />
            <Translate content="label.enteryouremail" component="p" className="page-desc" />

            <form className="form-signin" onSubmit={handleSubmit(this.onSubmit)}>
              <div className="form-group">
                <Field name="email" type="text" component={inputField} label={<Translate content="label.emailaddress" />} className="form-control" validate={[validation.newEmail, validation.required]} />
              </div>
              <div className="form-group">
                <Field name="password" type="password" component={inputField} label={<Translate content="label.password" />} className="form-control" validate={validation.required} />
              </div>
              {this.props.errorMessage ? <div className="auth-error" role="alert">{this.props.errorMessage}</div> : null}
              <div className="auth-meta">
                <Link to="/forgot-password"><Translate content="label.forgotPassword" /></Link>
              </div>
              <Translate content="label.login" component="button" className="btn btn-primary btn-form" type="submit" />
            </form>

            <div className="auth-foot">
              <Translate content="label.ifyoudont" />&nbsp;<Link to="/signup"><strong><Translate content="label.here" /></strong></Link>
            </div>
          </div>
        </section>

        <aside className="auth-visual" aria-label="Investment intelligence visual">
          <canvas id="capital-field" aria-hidden="true" />
          <div className="auth-visual-copy" data-motion="auth-visual-copy">
            <span>Capital, made legible</span>
            <h2>See the structure behind every opportunity.</h2>
            <p>A focused environment for reviewing products, credit ranges, exposure and decisions without the visual noise of ordinary admin software.</p>
            <div className="auth-proof" aria-hidden="true">
              <div><strong>01</strong><small>Opportunity view</small></div>
              <div><strong>02</strong><small>Credit control</small></div>
              <div><strong>03</strong><small>Portfolio clarity</small></div>
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
