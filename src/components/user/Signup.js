import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { inputField, checkBox } from '../../_formFields';
import * as validation from '../../_utils/validate';
import { signup } from '../../actions/signup';
import { connect } from 'react-redux';
import { compose } from 'redux';
import ReactPhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/dist/style.css'
import Translate from 'react-translate-component';
class Signup extends Component {

  state = { phone: 'a' }
  componentDidUpdate(prevProps) {
    if (this.props.errMsg !== prevProps.errMsg) {
      console.log(this.props.errMsg)
    }
  }
  onSubmit = formProps => {

    this.props.signup(formProps, () => {
      this.props.history.push('/signup/confirm-email');
    });
  };
  handleOnChange = (value) => {
    this.setState({ phone: value })
  };
  displayErrors = errors => {
    return errors.map((err, index) => {
      return (
        <li className="d-flex mb-1" key={index}>
          <img src="assets/img/icons/bx-check-circle.svg" alt="alt" />
          <span className="pl-2 green-text">{err}</span>
        </li>


      );
    })
  }
  render() {
    const { handleSubmit } = this.props;
    return (
      <div className="container-full-width">
        <div className="panel-container">
          <div className="feature-container feature-container--signup">
            <img class="company-logo" src="/assets/img/logo.png" alt="company logo" />

            <div className="feature-sidebar">
              <div className="feature-ours">

                <Translate content='label.theperfect' component="h3" className="feature-ours__sub-title" />
                <Translate content='label.atcredittech' component="h2" className="feature-ours__title" />

              </div>
              <div className="signup-quote">

                <Translate content='label.whycredittech' component="h2" className="signup-quote__title" />

                <Translate content='label.atfirst' component="p" className="signup-quote__content" />
                <p className="signup-quote__name">John Doe</p>
                <Link to="/login" className="btn btn-white">
                  <Translate content='label.whatothers' />
                </Link>
              </div>
            </div>
          </div>
          <div className="main-container">
            <div className="signup-form-container">
              <header className="page-header">
                {/* <h1 className="page-title">
                  Sign Up to Credit Tech as an Investor
                </h1> */}
                <Translate content='label.signupto' component="h1" className="page-title" />
                {/* <p className="page-desc">Enter your details below</p> */}
                <Translate content='label.enteryourdetails' component="p" className="page-desc" />
              </header>
              <form
                className="form-signup"
                onSubmit={handleSubmit(this.onSubmit)}
              >
                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <Field
                        name="fname"
                        type="text"
                        component={inputField}
                        label={<Translate content='label.firstname' />}
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="col">
                    <div className="form-group">
                      <Field
                        name="lname"
                        type="text"
                        component={inputField}
                        label={<Translate content='label.lastname' />}
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <Field
                    name="company_name"
                    type="text"
                    component={inputField}
                    label={<Translate content='label.companyname' />}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <Field
                    name="email"
                    type="email"
                    component={inputField}
                    label={<Translate content='label.emailaddress' />}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <Field
                    name="password"
                    type="password"
                    component={inputField}
                    label={<Translate content='label.password' />}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <Field
                    name="password_confirmation"
                    type="password"
                    component={inputField}
                    label={<Translate content='label.confirmpassword' />}
                    className="form-control"
                  />
                </div>
                <div className="form-group">

                  <Translate content='label.phonenumber' component="label" />
                  <ReactPhoneInput defaultCountry={'de'} regions={'europe'} value={this.state.phone} onChange={(value) => this.setState({ phone: value })} inputExtraProps={{
                    name: 'phone',
                    required: true,
                    autoFocus: true
                  }} />

                </div>

                <Field
                  name="agreed_term"
                  component={checkBox}
                  type="checkbox"
                />
                {this.props.errMsg ? <ul className="p-0 mt-2">{this.displayErrors(this.props.errMsg)}</ul> : null}
                {/* <button className="btn btn-primary btn-form" type="submit">
                  Sign Up Now
                </button> */}
                <Translate content='button.signup' className="btn btn-primary btn-form" type="submit" component="button" />
              </form>
              <br />
              {/* Already have an account ?  */}
              <Translate content="label.alreadyhaveanaccount" />&nbsp;&nbsp;&nbsp;<Link to="/login"><strong><Translate content="label.login" /></strong></Link>
            </div>
          </div>
        </div>
      </div >
    );
  }
}
function validate(values) {
  const errors = {};
  errors.fname = validation.required(values.fname);
  errors.lname = validation.required(values.lname);
  // errors.company_name = validation.required(values.company_name);
  errors.email = validation.email(values.email);

  if (!values.email) {
    errors.email = '* Required';
  }
  errors.password = validation.required(values.password);
  errors.password = validation.password(values.password)
  errors.confirm_password = validation.required(values.password_confirmation);
  if (values.password !== values.password_confirmation) {
    errors.password_confirmation = '* Password Mismatch';
  }
  errors.phone_number = validation.phoneNumber(values.phone_number);
  if (!values.agreed_term) {
    errors.agreed_term = '* Please accept Terms and Conditions';
  }
  return errors;
}
function mapStateToProps(state) {
  return { errMsg: state.errors }
}
export default compose(
  connect(
    mapStateToProps,
    { signup }
  ),
  reduxForm({
    validate,
    form: 'signup'
  })
)(Signup);
