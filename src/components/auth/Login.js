import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { inputField } from '../formFields';
import * as validation from '../../utils/validate';
class Login extends Component {
  onSubmit = formProps => {
    console.log(formProps);
  };
  render() {
    const { handleSubmit } = this.props;

    return (
      <div className="container-fluid container-full-height">
        <div className="row container-full-height">
          <div className="signin-form-container col-md-6">
            <div className="singin-container">
              <header className="page-header">
                <h1 className="page-title">Login</h1>
                <p className="page-desc">
                  Enter your email address and password
                </p>
              </header>
              <form
                className="form-signin"
                onSubmit={handleSubmit(this.onSubmit)}
              >
                <div className="form-group">
                  <Field
                    name="email_address"
                    type="text"
                    component={inputField}
                    label="Email Address"
                    className="form-control"
                    validate={[validation.email, validation.required]}
                  />
                </div>
                <div className="form-group">
                  <Field
                    name="password"
                    type="password"
                    component={inputField}
                    label="Password"
                    className="form-control"
                    validate={validation.required}
                  />
                </div>
                <button className="btn btn-primary btn-form" type="submit">
                  Login{' '}
                </button>
              </form>
            </div>
          </div>
          <div className="signin-banner-container col-md-6">
            <div className="signin-banner">
              <header className="signin-banner__header">
                <h2 className="signin-banner__title">Perfect Investment</h2>
                <p className="signin-banner__desc">
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                  diam nonumy eirmod tempor invidunt ut labore et dolore magna.
                </p>
              </header>
              <img
                className="signin-banner__thumb"
                src="/assets/img/signin-image.png"
                alt="Perfect Investment"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default reduxForm({
  form: 'login'
})(Login);
