import React, { Component, Fragment } from 'react';
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux';
import { getProfile, editProfile } from '../../../actions/profile'
import Translate from 'react-translate-component'

import Subheader from '../../general/Subheader'
import { inputField, renderDropzoneField } from '../../../_formFields/'
class EditProfile extends Component {
	state = { file: null, pic: null }
	componentDidMount() {
		this.props.getProfile();
	}
	componentDidUpdate(prevProps, prevState) {
		if (this.state.file !== prevState.file) {
			this.setState({
				pic: URL.createObjectURL(this.state.file)
			})
		}
	}
	onSubmit = formProps => {
		if (this.state.file) {
			formProps.company_logo = this.state.file;
		}
		this.props.editProfile(formProps, () => this.props.history.push('/user/profile'))
	}
	render() {
		const { handleSubmit } = this.props;

		return (
			<Fragment>
				{/* <Subheader buttonLabel="Change Profile Picture" /> */}

				<div className="content-head">
					<div className="content-head-left w-100">
						<div className="d-flex align-items-center">
							<div className="item position-relative">
								{this.props.initialValues ? <Fragment>
									<img src={this.state.pic || this.props.initialValues.company_logo_link || null} alt="alt" width="120px" height="120px" />
									<img className="verify" src={`${process.env.PUBLIC_URL}/assets/img/verify.png`} alt="alt" />
								</Fragment>
									: null
								}
							</div>
							<div className="item ml-4 position-relative">
								<input className="btn btn-outline-light position-absolute z-index-1" type="file" accept="image/x-png,image/gif,image/jpeg" name="" onChange={e => this.setState({ file: e.target.files[0] })} />
								{/* <span className="btn btn-outline-light position-absolute">Change profile picture</span> */}
							</div>
						</div>
					</div>
				</div>
				<div className="content-body">
					<form className="form-signup" onSubmit={handleSubmit(this.onSubmit)}>
						<div className="row mt-4">
							<div className="col-12 col-sm-12 col-md-12">
								<div className="form-group">
									<Field
										name="company_name"
										type="text"
										component={inputField}
										label="Company Name"
										className="form-control"
										placeholder="Company Name inc."
									/>
								</div>
							</div>
						</div>

						<div className="row mt-4">
							<div className="col-12 col-sm-12 col-md-12">
								<div className="form-group">
									<Field
										name="headquarter"
										type="text"
										component={inputField}
										label="Headquarter"
										className="form-control"
										placeholder="Berlin"
									/>
								</div>
							</div>
						</div>

						<div className="row mt-4">
							<div className="col-12 col-sm-6 col-md-6">
								<div className="form-group">
									<Field
										name="street_address"
										type="text"
										component={inputField}
										label="Street Address"
										className="form-control"
										placeholder='Hight Street'
									/>
								</div>
							</div>
							<div className="col-12 col-sm-6 col-md-6">
								<div className="form-group">
									<Field
										name="zip_code"
										type="text"
										component={inputField}
										label="Zip/Postal Code"
										className="form-control"
										placeholder="SE18 1EA"
									/>
								</div>
							</div>
						</div>
						<div className="row mt-4">
							<div className="col-12 col-sm-12 col-md-12">
								<div className="form-group">
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


						<div className="row mt-4">
							<div className="col-4 col-sm-12 col-md-4">
								<label htmlFor="">Contact Person</label>
								<div className="form-group">

									<Field
										name="contact_name_1"
										type="text"
										component={inputField}
										className="form-control"
										placeholder='Contact Name'
									/>
									<Field
										name="contact_email_1"
										type="email"
										component={inputField}
										className="form-control"
										placeholder="contact@email.com"
									/>

									<Field
										name="contact_phone_no_1"
										type="text"
										component={inputField}
										className="form-control"
										placeholder="+1 1234567890"
									/>
								</div>
							</div>
							<div className="col-4 col-sm-12 col-md-4">
								<label htmlFor="">Contact Person</label>
								<div className="form-group">
									<Field
										name="contact_name_2"
										type="text"
										component={inputField}
										className="form-control"
										placeholder='Contact Name-2'
									/>
									<Field
										name="contact_email_2"
										type="email"
										component={inputField}
										className="form-control"
										placeholder="contact2@email.com"

									/>

									<Field
										name="contact_phone_no_2"
										type="text"
										component={inputField}
										className="form-control"
										placeholder="+1 1234567890"

									/>
								</div>
							</div>
							<div className="col-4 col-sm-12 col-md-4">
								<label htmlFor="">Contact Person</label>
								<div className="form-group">
									<Field
										name="contact_name_3"
										type="text"
										component={inputField}
										className="form-control"
										placeholder='Contact Name -3'

									/>
									<Field
										name="contact_email_3"
										type="email"
										component={inputField}
										className="form-control"
										placeholder="contact3@email.com"

									/>

									<Field
										name="contact_phone_no_3"
										type="text"
										component={inputField}
										className="form-control"
										placeholder="+1 1234567890"

									/>
								</div>
							</div>
						</div>
						<div className="row mt-4">
							<div className="col-12 col-sm-12 col-md-12">
								<label htmlFor="">Social Media</label>
								<div className="form-group d-flex align-items-center">
									<label className="m-0" htmlFor="">
										Facebook &nbsp;&nbsp;
									</label>
									<Field
										name="facebook_link"
										type="text"
										component={inputField}
										className="ml-2 form-control"
										placeholder="https://www.facebook.com/"
									/>

								</div>
								<div className="form-group d-flex align-items-center">
									<label className="m-0" htmlFor="">
										Twitter &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									</label>

									<Field
										name="twitter_link"
										type="text"
										component={inputField}
										className="ml-2 form-control"
										placeholder="https://www.twitter.com/"

									/>
								</div>
								<div className="form-group d-flex align-items-center">
									<label className="m-0" htmlFor="">
										Linkedin &nbsp;&nbsp;&nbsp;&nbsp;
									</label>
									<Field
										name="linked_in_link"
										type="text"
										component={inputField}
										className="ml-2 form-control"
										placeholder="https://www.linkedin.com/"

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
										className="file-uploader file-uploader--small dropzone"
									/>
									{/* {files ? this.displayFiles(files) : null} */}
								</div>
							</div>
						</div>
						<button className="btn btn-primary">Update</button>
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
