import React, { Component, Fragment } from 'react';
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux';
import { getProfile, editProfile } from '../../../actions/profile'
import Translate from 'react-translate-component'

import Subheader from '../../general/Subheader'
import { inputField, renderDropzoneField } from '../../../_formFields/'
class EditProfile extends Component {
	componentDidMount() {
		this.props.getProfile();
	}
	onSubmit = formProps => {
		console.log('xx', formProps)
		this.props.editProfile(formProps, () => this.props.history.push('/user/profile'))
	}
	render() {
		const { handleSubmit } = this.props;

		return (
			<Fragment>
				<Subheader buttonLabel="Change Profile Picture" />
				<div class="content-body">
					<form className="form-signup" onSubmit={handleSubmit(this.onSubmit)}>
						<div class="row mt-4">
							<div class="col-12 col-sm-12 col-md-12">
								<div class="form-group">
									<Field
										name="company_name"
										type="text"
										component={inputField}
										label="Company Name"
										className="form-control"
									/>
								</div>
							</div>
						</div>

						<div class="row mt-4">
							<div class="col-12 col-sm-12 col-md-12">
								<div class="form-group">
									<Field
										name="headquarter"
										type="text"
										component={inputField}
										label="Headquarter"
										className="form-control"
									/>
								</div>
							</div>
						</div>

						<div class="row mt-4">
							<div class="col-12 col-sm-6 col-md-6">
								<div class="form-group">
									<Field
										name="street_address"
										type="text"
										component={inputField}
										label="Street Address"
										className="form-control"
									/>
								</div>
							</div>
							<div class="col-12 col-sm-6 col-md-6">
								<div class="form-group">
									<Field
										name="zip_code"
										type="text"
										component={inputField}
										label="Zip/Postal Code"
										className="form-control"
									/>
								</div>
							</div>
						</div>

						{/* <div class="row mt-4">
							<div class="col-12 col-sm-12 col-md-12">
								<div class="form-group">
									<Field
										name="email"
										type="email"
										component={inputField}
										label="Email"
										className="form-control"
									/>
								</div>
							</div>
						</div> */}

						<div class="row mt-4">
							<div class="col-12 col-sm-12 col-md-12">
								<div class="form-group">
									<label>Investor Categories</label>
									<Field name="category" component="select" className='form-control'>
										<option value="bank">Bank</option>
										<option value="sparkasse">Sparkasse</option>
										<option value="kreditfons">Kreditfons</option>
										<option value="family-office">Family Office</option>
									</Field>
								</div>
							</div>
						</div>


						<div class="row mt-4">
							<div class="col-4 col-sm-12 col-md-4">
								<label for="">Contact Person</label>
								<div class="form-group">

									<Field
										name="contact_name_1"
										type="text"
										component={inputField}
										className="form-control"
									/>
									<Field
										name="contact_email_1"
										type="email"
										component={inputField}
										className="form-control"
									/>

									<Field
										name="contact_phone_no_1"
										type="text"
										component={inputField}
										className="form-control"
									/>
								</div>
							</div>
							<div class="col-4 col-sm-12 col-md-4">
								<label for="">Contact Person</label>
								<div class="form-group">
									<Field
										name="contact_name_2"
										type="text"
										component={inputField}
										className="form-control"
									/>
									<Field
										name="contact_email_2"
										type="email"
										component={inputField}
										className="form-control"
									/>

									<Field
										name="contact_phone_no_2"
										type="text"
										component={inputField}
										className="form-control"
									/>
								</div>
							</div>
							<div class="col-4 col-sm-12 col-md-4">
								<label for="">Contact Person</label>
								<div class="form-group">
									<Field
										name="contact_name_3"
										type="text"
										component={inputField}
										className="form-control"
									/>
									<Field
										name="contact_email_3"
										type="email"
										component={inputField}
										className="form-control"
									/>

									<Field
										name="contact_phone_no_3"
										type="text"
										component={inputField}
										className="form-control"
									/>
								</div>
							</div>
						</div>
						<div class="row mt-4">
							<div class="col-12 col-sm-12 col-md-12">
								<label for="">Social Media</label>
								<div class="form-group d-flex align-items-center">
									<label class="m-0" for="">
										Facebook &nbsp;&nbsp;
									</label>
									<Field
										name="facebook_link"
										type="text"
										component={inputField}
										className="ml-2 form-control"
									/>

								</div>
								<div class="form-group d-flex align-items-center">
									<label class="m-0" for="">
										Twitter &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									</label>

									<Field
										name="twitter_link"
										type="text"
										component={inputField}
										className="ml-2 form-control"
									/>
								</div>
								<div class="form-group d-flex align-items-center">
									<label class="m-0" for="">
										Linkedin &nbsp;&nbsp;&nbsp;&nbsp;
									</label>
									<Field
										name="linked_in_link"
										type="text"
										component={inputField}
										className="ml-2 form-control"
									/>

								</div>
							</div>
						</div>
						<div className="row mt-4">
							<div className="col">
								<div className="form-group">
									<strong> <Translate content='label.fileupload' component="label" /></strong>
									<Field
										name="document"
										component={renderDropzoneField}
										type="file"
									// validate={validation.required}
									/>
									{/* {files ? this.displayFiles(files) : null} */}
								</div>
							</div>
						</div>
						<button class="btn btn-primary">Update</button>
					</form>
				</div>
			</Fragment>
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