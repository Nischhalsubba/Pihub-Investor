import React, { Fragment, Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { inputField } from '../../../_formFields'
class ChangePassword extends Component {
  onSubmit = formProps => {
    console.log(formProps)
  }
  render() {
    const { handleSubmit } = this.props;
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

export default reduxForm(
  {
    form: 'changePassword'
  }
)(ChangePassword);
