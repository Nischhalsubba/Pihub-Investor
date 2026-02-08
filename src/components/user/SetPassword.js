import React, { Component, Fragment } from 'react';
import { Field, reduxForm } from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { inputField } from '../../_formFields'
import { changePasswordWithToken } from '../../actions/password';
import * as validation from '../../_utils/validate';
class SetPassword extends Component {
  displayErrors = errors => {
    return errors.map((err, index) => {
      return (
        <li className="d-flex mb-1" key={index}>
          <img src={`${process.env.PUBLIC_URL}/assets/img/icons/bx-check-circle.svg`} alt="alt" />
          <span className="pl-2 green-text">{err}</span>
        </li>


      );
    })
  }
  onSubmit = formProps => {
    formProps.token = this.props.match.params.token;
    this.props.changePasswordWithToken(formProps, () => {
      this.props.history.push('/password-change-success')
    })
  }
  render() {
    const { handleSubmit } = this.props;
    return (
      <Fragment>
        <Fragment>
          <img className="company-logo company-logo-email" src={`${process.env.PUBLIC_URL}/assets/img/logo.png`} alt="company logo" />
          <div className="container-full-height text-centerd d-flex">
            <div className="content m-auto">
              <div className="email-content">
                <div className="w-75 m-auto text-center">
                  <img src={`${process.env.PUBLIC_URL}/assets/img/icons/activated.png`} alt="Mail icon" />
                  <h3>Reset Your Password</h3>
                  {/* <p>Enter an email associated with your account.</p> */}
                </div>
                <div className="w-75 m-auto">
                  <form className="form-signin" onSubmit={handleSubmit(this.onSubmit)}>

                    <div className="form-group text-left w-75">
                      {/* <label htmlFor="email-address">Email Address</label>
                    <input className="form-control" type="email" name="email-address" /> */}
                      <Field
                        type='password'
                        name='password'
                        component={inputField}
                        className='form-control'
                        placeholder='New Password'

                      />
                    </div> <div className="form-group text-left w-75">
                      {/* <label htmlFor="email-address">Email Address</label>
                    <input className="form-control" type="email" name="email-address" /> */}
                      <Field
                        type='password'
                        name='password_confirmation'
                        component={inputField}
                        className='form-control'
                        placeholder='Retype password'
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
function validate(values) {
  const errors = {};

  errors.password = validation.required(values.password);
  errors.password = validation.password(values.password);
  if (values.password !== values.password_confirmation) {
    errors.password_confirmation = '* Pass Mismatch!'
  }
  return errors;
}

export default compose(
  connect(
    null,
    { changePasswordWithToken }
  ),
  reduxForm({
    validate,
    form: 'forgotPassword'
  })
)(SetPassword);
