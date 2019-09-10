import React, { Component, Fragment } from 'react';
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux';
import { getProfile } from '../../../actions/profile'

import Subheader from '../../general/Subheader'
import { inputField } from '../../../_formFields/'
class EditProfile extends Component {
  componentDidMount() {
    this.props.getProfile();
  }
  onSubmit = formProps => {
    console.log(formProps)
  }
  render() {
    console.log('edit', this.props.initialValues);
    const { handleSubmit } = this.props;

    return (
      <Fragment>
        <Subheader buttonLabel="Change Profile Picture" />
        <div class="content-body">
          <form className="form-signup" onSubmit={handleSubmit(this.onSubmit)}>
            <div class="row mt-4">
              <div class="col-12 col-sm-12 col-md-6">
                <div class="form-group">

                  <Field
                    name='fname'
                    type='text'
                    component={inputField}
                    label='First Name'
                    className='form-control'
                  />
                </div>
              </div>
              <div class="col-12 col-sm-12 col-md-6">
                <div class="form-group">

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
            <div class="row mt-4">
              <div class="col-12 col-sm-12 col-md-12">
                <div class="form-group">

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
            <div class="row mt-4">
              <div class="col-12 col-sm-12 col-md-12">
                <div class="form-group">

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
            <div class="row mt-4">
              <div class="col-12 col-sm-12 col-md-12">
                <div class="form-group">
                  {/* <label>Email Address</label>
                  <input class="form-control" type="email" name="email" placeholder="dinohwang@gmail.com" /> */}
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

            <div class="row mt-4">
              <div class="col-12 col-sm-12 col-md-12">
                <div class="form-group">
                  <label>Phone Number</label>
                  <div class="row">
                    <div class="col-1">
                      <select class="form-control states">
                        <option value=" ">DE</option>
                        <option value="Advertisement/Online Marketing">US</option>
                        <option value="Advertisement/Marketing">UK</option>
                        <option value="Advertisement/Offine Marketing">AUS</option>
                      </select>
                    </div>
                    <div class="col-11">
                      <input class="form-control" type="number" name="email" placeholder="+49 123 456 789" />

                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row mt-4">
              <div class="col-4 col-sm-12 col-md-4">
                <label for="">Contact Person</label>
                <div class="form-group">
                  <input class="mb-2 form-control" type="text" name="full-name" placeholder="Ria Quirin" />
                  <input class="mb-2 form-control" type="email" name="email" placeholder="Ria@yahoo.com" />
                  <input class="form-control" type="number" name="email" placeholder="+49 123 456 789" />
                </div>
              </div>
              <div class="col-4 col-sm-12 col-md-4">
                <label for="">Contact Person</label>
                <div class="form-group">
                  <input class="mb-2 form-control" type="text" name="full-name" placeholder="Meine Ferdi " />
                  <input class="mb-2 form-control" type="email" name="email" placeholder="Meine@yahoo.com" />
                  <input class="form-control" type="number" name="email" placeholder="+49 9877458547" />
                </div>
              </div>
              <div class="col-4 col-sm-12 col-md-4">
                <label for="">Contact Person</label>
                <div class="form-group">
                  <input class="mb-2 form-control" type="text" name="full-name" placeholder="Rosa Renata" />
                  <input class="mb-2 form-control" type="email" name="email" placeholder="Rosa@yahoo.com" />
                  <input class="form-control" type="number" name="email" placeholder="+49 123 456 789" />
                </div>
              </div>
            </div>
            <div class="row mt-4">
              <div class="col-12 col-sm-12 col-md-12">
                <label for="">Social Media</label>
                <div class="form-group d-flex align-items-center">
                  <label class="m-0" for="">Facebook</label>
                  <input class="ml-2 form-control" type="text" name="company-name" placeholder="https://www.facebook.com/officialdino" />
                </div>
                <div class="form-group d-flex align-items-center">
                  <label class="m-0" for="">Twitter</label>
                  <input class="ml-4 form-control" type="text" name="company-name" placeholder="https://www.twitter.com/officialdino" />
                </div>
                <div class="form-group d-flex align-items-center">
                  <label class="m-0" for="">Linkedin</label>
                  <input class="ml-3 form-control" type="text" name="company-name" placeholder="https://www.linkedin.com/officialdino" />
                </div>
              </div>
            </div>
            <div class="row mt-4">
              <div class="col-12 col-sm-12 col-md-12">
                <div class="form-group">
                  <label>Your short info</label>
                  <textarea name="" cols="30" rows="5" placeholder="Born in small family, worked my way to this point, now an entrepreneur helping startup touch the sky"></textarea>
                </div>
              </div>
            </div>
            <button class="btn btn-primary" >Update</button>
          </form>
        </div>
      </Fragment >
    );
  }
}
// function mapStateToProps(state) {
//   return { initialValues: state.profile }
// }
// export default reduxForm({
//   form: 'editProfile',
//   enableReinitialize: true

// })(connect(mapStateToProps, { getProfile })(EditProfile));


EditProfile = reduxForm({
  form: 'editProfile' // a unique identifier for this form
})(EditProfile)

// You have to connect() to any reducers that you wish to connect to yourself
EditProfile = connect(
  state => ({
    initialValues: state.profile // pull initial values from account reducer
  }),
  { getProfile } // bind account loading action creator
)(EditProfile)

export default EditProfile