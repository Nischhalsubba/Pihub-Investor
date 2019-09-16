import React, { Component, Fragment } from 'react';
import { Field, reduxForm } from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { inputField } from '../../_formFields'
import { getTokenForEmail } from '../../actions/password';
class ForgotPassword extends Component {
  state = { submit: false, email: null }
  onSubmit = formProps => {
    this.props.getTokenForEmail(formProps, () => {
      this.setState({ submit: true, email: formProps.email })
    })
  }
  render() {
    const { handleSubmit } = this.props;
    if (this.state.submit) {
      return (
        <Fragment>
          <img class="company-logo company-logo-email" src="./assets/img/logo.png" alt="company logo" />
          <div class="container-full-height text-centerd d-flex">
            <div class="content m-auto">
              <div class="email-content text-center w-75 m-auto">
                <img src="./assets/img/icons/mail.png" alt="Mail icon" />
                <h3>We just sent you an email</h3>
                <p>An Email with an instructions to reset your email has been sent to
                 <b>{this.state.email}</b>
                </p>
              </div>
            </div>
          </div>
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <Fragment>
            <img class="company-logo company-logo-email" src="./assets/img/logo.png" alt="company logo" />
            <div class="container-full-height text-centerd d-flex">
              <div class="content m-auto">
                <div class="email-content">
                  <div class="w-75 m-auto text-center">
                    <img src="./assets/img/icons/activated.png" alt="Mail icon" />
                    <h3>Forgot Password ?</h3>
                    <p>Enter an email associated with your account.</p>
                  </div>
                  <div class="w-75 m-auto">
                    <form class="form-signin" onSubmit={handleSubmit(this.onSubmit)}>
                      <div class="form-group text-left w-75">
                        {/* <label for="email-address">Email Address</label>
                        <input class="form-control" type="email" name="email-address" /> */}
                        <Field
                          type='email'
                          name='email'
                          component={inputField}
                          className='form-control'
                          placeholder='Email'
                        />
                      </div>
                      {this.props.errMsg ? this.displayErrors(this.props.errMsg) : null}
                      <button class="btn btn-primary btn-form" type="submit">
                        Submit
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </Fragment>
        </Fragment>
      );
    }

  }
}


export default compose(
  connect(
    null,
    { getTokenForEmail }
  ),
  reduxForm({
    form: 'forgotPassword'
  })
)(ForgotPassword);
