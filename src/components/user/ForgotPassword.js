import React, { Component, Fragment } from 'react';
import { Field, reduxForm } from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { inputField } from '../../_formFields'
import { getTokenForEmail } from '../../actions/password';
import Translate from 'react-translate-component';
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
          <img className="company-logo company-logo-email" src={`${process.env.PUBLIC_URL}/assets/img/logo.png`} alt="company logo" />
          <div className="container-full-height text-centerd d-flex">
            <div className="content m-auto">
              <div className="email-content text-center w-75 m-auto">
                <img src={`${process.env.PUBLIC_URL}/assets/img/icons/Mail.png`} alt="Mail icon" />
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
            <img className="company-logo company-logo-email" src={`${process.env.PUBLIC_URL}/assets/img/logo.png`} alt="company logo" />
            <div className="container-full-height text-centerd d-flex">
              <div className="content m-auto">
                <div className="email-content">
                  <div className="w-75 m-auto text-center">
                    <img src={`${process.env.PUBLIC_URL}/assets/img/icons/activated.png`} alt="Mail icon" />
                    <h3>
                      <Translate content="label.forgotPassword"/>
                    </h3>
                    <p><Translate content="label.enterEmailForgotten"/></p>
                  </div>
                  <div className="w-75 m-auto">
                    <form className="form-signin" onSubmit={handleSubmit(this.onSubmit)}>
                      <div className="form-group text-left w-75">
                        {/* <label htmlFor="email-address">Email Address</label>
                        <input className="form-control" type="email" name="email-address" /> */}
                        <Field
                          type='email'
                          name='email'
                          component={inputField}
                          className='form-control'
                          placeholder='Email'
                        />
                      </div>
                      {this.props.errMsg ? this.displayErrors(this.props.errMsg) : null}
                      <button className="btn btn-primary btn-form" type="submit">
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
