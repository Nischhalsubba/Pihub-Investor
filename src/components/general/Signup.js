import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { inputField, checkBox } from '../formFields';
import * as validation from '../../utils/validate';
class Signup extends Component {
  onSubmit = formProps => {
    console.log(formProps);
  };
  render() {
    const { handleSubmit } = this.props;

    return (
      <div class="container-full-width">
        <div class="panel-container">
          <div class="feature-container feature-container--signup">
            <div class="feature-sidebar">
              <div class="feature-ours">
                <h3 class="feature-ours__sub-title">The Perfect Investment</h3>
                <h2 class="feature-ours__title">
                  At Credittech you can easily find creditor and make an
                  investment
                </h2>
              </div>
              <div class="signup-quote">
                <h2 class="signup-quote__title">Why Credit Tech?</h2>
                <p class="signup-quote__content">
                  At first I Invested little and by time pass I Invested to the
                  sector I like and Credit Tech takes me right there
                </p>
                <p class="signup-quote__name">John Doe</p>
                <a class="btn btn-white">What others say?</a>
              </div>
            </div>
          </div>
          <div class="main-container">
            <div class="signup-form-container">
              <header class="page-header">
                <h1 class="page-title">
                  Sign Up to Credit Tech as an Investor{' '}
                </h1>
                <p class="page-desc">Enter your details below</p>
              </header>
              <form class="form-signup" onSubmit={handleSubmit(this.onSubmit)}>
                <div class="row">
                  <div class="col">
                    <div class="form-group">
                      <Field
                        name="first_name"
                        type="text"
                        component={inputField}
                        label="First Name"
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div class="col">
                    <div class="form-group">
                      <Field
                        name="last_name"
                        type="text"
                        component={inputField}
                        label="Last Name"
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <Field
                    name="company_name"
                    type="text"
                    component={inputField}
                    label="Company Name"
                    className="form-control"
                  />
                </div>
                <div class="form-group">
                  <Field
                    name="email_address"
                    type="email"
                    component={inputField}
                    label="Email Address"
                    className="form-control"
                  />
                </div>
                <div class="form-group">
                  <Field
                    name="password"
                    type="password"
                    component={inputField}
                    label="Password"
                    className="form-control"
                  />
                </div>
                <div class="form-group">
                  <Field
                    name="confirm_password"
                    type="password"
                    component={inputField}
                    label="Confirm Password"
                    className="form-control"
                  />
                </div>
                <div class="form-group">
                  <Field
                    name="phone_number"
                    type="text"
                    component={inputField}
                    label="Phone Number"
                    className="form-control"
                  />
                </div>

                <Field
                  name="agreed_term"
                  component={checkBox}
                  type="checkbox"
                />
                <button class="btn btn-primary btn-form" type="submit">
                  Sign Up Now
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
function validate(values) {
  const errors = {};
  errors.first_name = validation.required(values.first_name);
  errors.last_name = validation.required(values.last_name);
  errors.company_name = validation.required(values.company_name);
  errors.email_address = validation.email(values.email_address);

  if (!values.email_address) {
    errors.email_address = '* Required';
  }
  errors.password = validation.required(values.password);
  errors.confirm_password = validation.required(values.confirm_password);
  if (values.password !== values.confirm_password) {
    errors.confirm_password = '* Password Mismatch';
  }
  errors.phone_number = validation.phoneNumber(values.phone_number);
  if (!values.agreed_term) {
    errors.agreed_term = '* Please accept Terms and Conditions';
  }
  return errors;
}

export default reduxForm({ validate, form: 'signUp' })(Signup);
