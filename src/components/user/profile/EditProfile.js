import React, { Component, Fragment } from 'react';
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux';
import { getProfile, editProfile } from '../../../actions/profile'

import Subheader from '../../general/Subheader'
import { inputField } from '../../../_formFields/'
class EditProfile extends Component {
  componentDidMount() {
    this.props.getProfile();
  }
  onSubmit = formProps => {
    this.props.editProfile(formProps, () => this.props.history.push('/user/profile'))
  }
  render() {
    const { handleSubmit } = this.props;

    return (
      <Fragment>
        <Subheader buttonLabel="Change Profile Picture" />
        <div className="content-body">
          <form className="form-signup" onSubmit={handleSubmit(this.onSubmit)}>
            <div className="row mt-4">
              <div className="col-12 col-sm-12 col-md-6">
                <div className="form-group">

                  <Field
                    name='fname'
                    type='text'
                    component={inputField}
                    label='First Name'
                    className='form-control'
                  />
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-6">
                <div className="form-group">

                  <Field
                    name='lname'
                    type='text'
                    component={inputField}
                    label='Last Name'
                    className='form-control'
                  />
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-12 col-sm-12 col-md-12">
                <div className="form-group">

                  <Field
                    name='headquarter'
                    type='text'
                    component={inputField}
                    label='Headquarter'
                    className='form-control'
                  />
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-12 col-sm-12 col-md-12">
                <div className="form-group">

                  <Field
                    name='company_name'
                    type='text'
                    component={inputField}
                    label='Company Name'
                    className='form-control'
                  />
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-12 col-sm-12 col-md-12">
                <div className="form-group">
                  {/* <label>Email Address</label>
                  <input className="form-control" type="email" name="email" placeholder="dinohwang@gmail.com" /> */}
                  <Field
                    name='email'
                    type='email'
                    component={inputField}
                    label='Email'
                    className='form-control'
                  />
                </div>
              </div>
            </div>

            <div className="row mt-4">
              <div className="col-12 col-sm-12 col-md-12">
                <div className="form-group">
                  <label>Phone Number</label>
                  <div className="row">
                    <div className="col-1">
                      <select className="form-control states">
                        <option value=" ">DE</option>
                        <option value="Advertisement/Online Marketing">US</option>
                        <option value="Advertisement/Marketing">UK</option>
                        <option value="Advertisement/Offine Marketing">AUS</option>
                      </select>
                    </div>
                    <div className="col-11">
                      <input className="form-control" type="number" name="email" placeholder="+49 123 456 789" />

                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-4 col-sm-12 col-md-4">
                <label for="">Contact Person</label>
                <div className="form-group">
                  <input className="mb-2 form-control" type="text" name="full-name" placeholder="Ria Quirin" />
                  <input className="mb-2 form-control" type="email" name="email" placeholder="Ria@yahoo.com" />
                  <input className="form-control" type="number" name="email" placeholder="+49 123 456 789" />
                </div>
              </div>
              <div className="col-4 col-sm-12 col-md-4">
                <label for="">Contact Person</label>
                <div className="form-group">
                  <input className="mb-2 form-control" type="text" name="full-name" placeholder="Meine Ferdi " />
                  <input className="mb-2 form-control" type="email" name="email" placeholder="Meine@yahoo.com" />
                  <input className="form-control" type="number" name="email" placeholder="+49 9877458547" />
                </div>
              </div>
              <div className="col-4 col-sm-12 col-md-4">
                <label for="">Contact Person</label>
                <div className="form-group">
                  <input className="mb-2 form-control" type="text" name="full-name" placeholder="Rosa Renata" />
                  <input className="mb-2 form-control" type="email" name="email" placeholder="Rosa@yahoo.com" />
                  <input className="form-control" type="number" name="email" placeholder="+49 123 456 789" />
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-12 col-sm-12 col-md-12">
                <label for="">Social Media</label>
                <div className="form-group d-flex align-items-center">
                  <label className="m-0" for="">Facebook</label>
                  <input className="ml-2 form-control" type="text" name="company-name" placeholder="https://www.facebook.com/officialdino" />
                </div>
                <div className="form-group d-flex align-items-center">
                  <label className="m-0" for="">Twitter</label>
                  <input className="ml-4 form-control" type="text" name="company-name" placeholder="https://www.twitter.com/officialdino" />
                </div>
                <div className="form-group d-flex align-items-center">
                  <label className="m-0" for="">Linkedin</label>
                  <input className="ml-3 form-control" type="text" name="company-name" placeholder="https://www.linkedin.com/officialdino" />
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-12 col-sm-12 col-md-12">
                <div className="form-group">
                  <label>Your short info</label>
                  <textarea name="" cols="30" rows="5" placeholder="Born in small family, worked my way to this point, now an entrepreneur helping startup touch the sky"></textarea>
                </div>
              </div>
            </div>
            <button className="btn btn-primary" >Update</button>
          </form>
        </div>
      </Fragment >
    );
  }
}


EditProfile = reduxForm({
  form: 'editProfile'
})(EditProfile)

EditProfile = connect(
  state => ({
    initialValues: state.profile
  }),
  { getProfile, editProfile }
)(EditProfile)

export default EditProfile