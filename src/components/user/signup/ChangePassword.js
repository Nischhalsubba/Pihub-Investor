import React, { Fragment, Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { inputField } from '../../../_formFields'
import { getTokenForEmail, changePasswordWithToken } from '../../../actions/password';
import * as validation from '../../../_utils/validate';
class ChangePassword extends Component {
  state = { submit: false, token: null }
  displayErrors = errors => {
    return errors.map((err, index) => {
      return (
        <li class="d-flex mb-1" key={index}>
          <img src="assets/img/icons/bx-check-circle.svg" alt="alt" />
          <span class="pl-2 green-text">{err}</span>
        </li>


      );
    })
  }
  onSubmit = formProps => {
    if (!this.state.submit) {
      this.props.getTokenForEmail(formProps, (token) => {
        this.setState({ submit: true, token: token })
      })
    } else {
      formProps.token = this.state.token
      this.props.changePasswordWithToken(formProps, () => {
        this.props.history.push('/password-change-success')
      })
    }
  }
  render() {
    const { handleSubmit } = this.props;
    if (!this.state.submit) {
      return (
        <Fragment>
          <img class="company-logo company-logo-email" src="./assets/img/logo.png" alt="company logo" />
          <div class="container-full-height text-centerd d-flex">
            <div class="content m-auto">
              <div class="email-content">
                <div class="w-75 m-auto text-center">
                  <img src="./assets/img/icons/activated.png" alt="Mail icon" />
                  <h3>Change Password ?</h3>
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
      );
    } else {
      return (
        <Fragment>
          <img class="company-logo company-logo-email" src="./assets/img/logo.png" alt="company logo" />
          <div class="container-full-height text-centerd d-flex">
            <div class="content m-auto">
              <div class="email-content">
                <div class="w-75 m-auto text-center">
                  <img src="./assets/img/icons/activated.png" alt="Mail icon" />
                  <h3>Reset Your Password</h3>
                  {/* <p>Enter an email associated with your account.</p> */}
                </div>
                <div class="w-75 m-auto">
                  <form class="form-signin" onSubmit={handleSubmit(this.onSubmit)}>

                    <div class="form-group text-left w-75">
                      {/* <label for="email-address">Email Address</label>
                    <input class="form-control" type="email" name="email-address" /> */}
                      <Field
                        type='password'
                        name='password'
                        component={inputField}
                        className='form-control'
                        placeholder='New Password'

                      />
                    </div> <div class="form-group text-left w-75">
                      {/* <label for="email-address">Email Address</label>
                    <input class="form-control" type="email" name="email-address" /> */}
                      <Field
                        type='password'
                        name='password_confirmation'
                        component={inputField}
                        className='form-control'
                        placeholder='Retype password'
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
      );
    }
  }
}
function validate(values) {

  const errors = {};
  errors.email = validation.newEmail(values.email);

  errors.password = validation.required(values.password);
  errors.password = validation.password(values.password);
  if (values.password !== values.password_confirmation) {
    errors.password_confirmation = '* Pass Mismatch!'
  }
}
function mapStateToProps(state) {
  return { errMsg: state.errors }
}


export default compose(
  connect(
    mapStateToProps,
    { getTokenForEmail, changePasswordWithToken }
  ),
  reduxForm({
    validate,
    form: 'changePassword'
  })
)(ChangePassword);
