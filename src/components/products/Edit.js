
import React, { Component, Fragment } from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import InputRange from 'react-input-range';

import { connect } from 'react-redux';
import { updateProduct } from '../../actions/product';
import { getProductById } from '../../actions/product';
import { getIndustryList } from '../../actions/industry';
import { downloadToken } from '../../actions/download';
import { getServiceList } from '../../actions/service';
import { getCounties, getAllState } from '../../actions/statesCounties';

import Subheader from '../general/Subheader';
import * as validation from '../../_utils/validate';
import germanStates from '../../_german_states';
import Translate from 'react-translate-component'
import { extractNames, extractId, getId, extractIdForName, extractIdCounty } from '../../_utils/misc';

import {
  inputField,
  dropDownField,
  inputSlider,
  renderDropzoneField,
  radioButton,
  renderMultiselect
} from '../../_formFields';


const credits = [
  {
    "id": 1,
    "name": "Creditreform"
  },
  {
    "id": 2,
    "name": "Fitch"
  },
  {
    "id": 3,
    "name": "Moody's"
  },
  {
    "id": 4,
    "name": "Euler Hermes"
  },
  {
    "id": 5,
    "name": "Standard & Poors"
  },
  {
    "id": 6,
    "name": "Bank/Andere"
  }
]
class EditProduct extends Component {
  state = { cities: [], ratings: [], rating_value: [], grade: '', cityNames: [], services: [], industries: [], states: [], statesWithId: [], value: { min: 15, max: 50 }, existing_file_id: [] };
  componentDidMount() {
    if (!this.props.location.state) {
      // Redirect to list page if therer is no id of product to be fetched availabel
      return this.props.history.push('/products')
    }
    this.props.getProductById(this.props.location.state.id)
    this.props.getIndustryList();
    this.props.getServiceList();
    this.props.getCounties();
    this.props.getAllState();
    // this.setState({
    //   states: extractNames(germanStates)
    // })
  }
  componentDidUpdate(prevProps, prevState) {
    // if (this.props.states !== prevProps.states) {
    //   this.setState({
    //     cities: city(this.props.states)
    //   }, () => {
    //     var c = extractNames(this.state.cities)
    //     this.setState({ cityNames: c });
    //   }
    //   )
    // };
    if (prevProps.allStates !== this.props.allStates) {
      this.setState({ states: this.props.allStates.list, statesWithId: this.props.allStates.all })
    }
    if (this.props.states !== prevProps.states) {
      this.props.getCounties(extractIdForName(this.props.states, this.state.statesWithId))
    };
    if (this.props.service !== prevProps.service) {
      this.setState({ services: this.props.service })
    };
    if (this.props.industry !== prevProps.industry) {
      this.setState({ industries: this.props.industry })
    }
    if (this.props.county !== prevProps.county) {
      this.setState({
        cities: this.props.county.list,
        cityNames: this.props.county.name
      })
    }
    if (this.props.initialValues !== prevProps.initialValues) {
      var existingFile = [];
      if (Array.isArray(this.props.initialValues.documents)) {
        this.props.initialValues.documents.map((doc) => {
          existingFile.push(doc.id)
        })
      }
      this.setState({ existing_file_id: existingFile })
      this.setState({
        value: {
          min: this.props.initialValues.min_time_duration,
          max: this.props.initialValues.max_time_duration
        }
      })
    }
  }
  showFiles = files => {
    if (files.lenght === 0) {
      return <span>No Attachments Available</span>
    } else {
      return files.map((file, index) => {
        return (
          <div class="file mb-2">
            <span class="file-name">File {index + 1}</span>
            {/* <span class="ml-4 file-size">FileType: {file.file_type}</span> */}
            <span className='btn btn-link' onClick={() => this.props.downloadToken(file.path)}><Translate content='button.download' /></span>
          </div>
        )

      })
    }
  }
  onSubmit = formProps => {
    console.log('ex', this.state.existing_file_id)
    // To delete duplicate keys while adding credit ratings
    const filteredArr = this.state.rating_value.reverse().reduce((acc, current) => {
      const x = acc.find(item => item.id === current.id);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
    this.setState({ rating_value: filteredArr });
    if (formProps.undefined[0] === 'Select All') {
      formProps.industry_id = getId(this.props.industry.list, null);
    } else {
      formProps.industry_id = getId(this.props.industry.list, formProps.undefined, this.props.language);
    }

    formProps.ratings = this.state.rating_value;
    if (formProps.County[0] === 'Select All') {
      formProps.county_ids = extractIdCounty(null, this.state.cities);
    } else {
      console.log('?', this.state.cities);
      console.log(formProps.County);
      formProps.county_ids = extractIdCounty(formProps.County, this.state.cities);
      console.log(formProps.county_ids);
    }
    if (formProps.states === 'Select All') {
      // formProps.state_ids = extractId(null, germanStates);
      formProps.state_ids = extractIdForName(null, this.state.statesWithId);

    } else {
      // formProps.state_ids = extractId(formProps.states, germanStates);
      formProps.state_ids = extractIdForName(formProps.states, this.state.statesWithId);
    }
    formProps.min_time_duration = this.state.value.min;
    formProps.max_time_duration = this.state.value.max;
    console.log(formProps);
    this.props.updateProduct(formProps, this.props.location.state.id, () => this.props.history.push({ pathname: '/product', state: { id: this.props.location.state.id } }))
  };

  creditRatings = (credits) => {
    return credits.map((credit, index) => {
      return (
        // <div class="rating d-flex justify-content-between align-content-center flex-wrap mt-3">
        <div class="rating-item">
          <div class="col-9">
            {/* <label>Ratingagentur</label> */}
            <Translate content='label.Ratingagentur' component="label" />
            <br />
            <input class="mr-2" type="checkbox" name={credit.id} value="" onChange={() => this.setState({ ratings: [...this.state.ratings, credit.id] })}
            />{credit.name}
          </div>
          <div class="col-9">
            {/* <label>Kreditrating</label> */}
            <Translate content='label.Kreditrating' component="label" />
            <br />
            <input
              type="text" name={`rating_value[${credit.id}]`}
              onChange={(e) => this.setState({
                rating_value: [...this.state.rating_value, { id: credit.id, value: e.target.value }]
              })
              }
              class="col-3 form-control text-center"
            /></div>
        </div>
        // </div>
      )
    })

  }
  render() {
    const {
      handleSubmit,
      min_creditValue,
      credit,
      time_duration,
      max_credit_amount,
      min_sales_creditor,
      files
    } = this.props;
    console.log(this.props.initialValues)
    return (
      <Fragment>
        <Subheader heading={<Translate content='button.edit' />} />
        <div className="content-body">
          <form className="form-signup" onSubmit={handleSubmit(this.onSubmit)}>
            <div className="row mt-4">
              <div class="col-12 col-sm-12 col-md-6">
                <div className="form-group">
                  <Field
                    name="product_title"
                    type="text"
                    component={inputField}
                    label={<Translate content='label.producttitle' />}
                    className="form-control"
                    validate={validation.required}
                  />
                </div>
              </div>
              <div class="col-12 col-sm-12 col-md-6">
                <div className="form-group">
                  <Field
                    name="states"
                    component={renderMultiselect}
                    data={this.state.states}
                    label={<Translate content='label.state' />}
                    validate={validation.required}
                    placeholder={<Translate content='placeholder.select' />}
                  />
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div class="col-12 col-sm-12 col-md-6">
                <div className="form-group">
                  <Field
                    name="services"
                    component={dropDownField}
                    options={this.state.services[`${this.props.language}`]}
                    label={<Translate content='label.service' />}
                    validate={validation.required}
                    placeholder={<Translate content='placeholder.select' />}
                  />
                </div>
              </div>
              <div class="col-12 col-sm-12 col-md-6">
                <div class="form-group">
                  <Field
                    name="County"
                    component={renderMultiselect}
                    data={this.state.cityNames}
                    label={<Translate content='label.country' />}
                    // validate={validation.required}
                    placeholder="select tags"
                  />
                </div>
              </div>
            </div>
            <div class="row mt-4">
              <div class="col-12 col-sm-12 col-md-6">

                <Field
                  component={renderMultiselect}
                  label={<Translate content='label.industries' />}
                  data={this.state.industries.names ? this.state.industries.names[`${this.props.language}`] : []}
                  className="form-group"

                />
              </div>

              <div class="col-12 col-sm-12 col-md-6">
                <div class="form-group">
                  <label for="amount">
                    <strong><Translate content='label.timeduration' /></strong>
                  </label>
                  <div class="d-flex align-items-center">
                    <input
                      className="form-control col-md-3 col-sm-4 col-4 ml-2 text-center"
                      type="text"
                      id="mincredit-amount-value"
                      // value={time_duration}
                      value={this.state.value.min}
                      validate={validation.required}
                      placeholder="3 Monate"
                    />&nbsp;&nbsp;
                    <InputRange
                      maxValue={60}
                      minValue={12}
                      value={this.state.value}
                      onChange={value => this.setState({ value })} />
                    {/* <div class="col-12 col-sm-12 col-md-6"> */}
                    &nbsp;&nbsp;<input
                      className="form-control col-md-3 col-sm-4 col-4 ml-2 text-center"
                      type="text"
                      id="mincredit-amount-value"
                      // value={time_duration}
                      value={this.state.value.max}
                      validate={validation.required}
                      placeholder="3 Monate"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="row mt-4">
              <div className="col-12 col-sm-12 col-md-6">
                <div className="form-group">
                  <label for="amount">
                    <Translate content='label.mincredit' />
                  </label>
                  <div class="d-flex align-items-center">

                    <Field
                      name="min_credit_amount"
                      type="range"
                      className="position-relative w-100"
                      component={inputSlider}
                      // label={<Translate content='label.mincredit' />}
                      id="mincredit-amount"
                      validate={validation.required}
                      min="250000"
                      max="5000000"

                    />
                    €<input
                      className="form-control col-md-3 col-sm-4 col-4 ml-2 text-center"
                      type="text"
                      id="mincredit-amount-value"
                      value={min_creditValue}
                      validate={validation.required}
                      placeholder="€0.0"
                    />
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-6">
                <div className="form-group">
                  <label for="amount">
                    <Translate content='label.maxcredit' />
                  </label>
                  <div class="d-flex align-items-center">

                    <Field
                      name="max_credit_amount"
                      type="range"
                      className="w-100"
                      component={inputSlider}
                      // label={<Translate content='label.maxcredit' />}
                      id="mincredit-amount"
                      readOnly
                      validate={validation.required}
                      min="250000"
                      max="5000000"
                    />
                    €<input
                      className="form-control col-md-3 col-sm-4 col-4 ml-2 text-center"
                      type="text"
                      id="amount"
                      value={max_credit_amount}
                      validate={validation.required}
                      placeholder="€0.0"
                    />
                  </div>
                </div>
              </div>
            </div>


            <div class="row mt-4">
              <div className="col-12 col-sm-12 col-md-6">
                <div className="form-group">
                  {/* <div className="row align-items-end"> */}
                  <label for="amount">
                    <Translate content='label.minimumsales' />
                  </label>
                  <div class="d-flex align-items-center">
                    <Field
                      name="min_sales_creditor"
                      type="range"
                      className="w-100"
                      component={inputSlider}
                      id="mincredit-amount"
                      validate={validation.required}
                      min="0"
                      max="50000000"

                    />
                    €<input
                      className="form-control col-md-3 col-sm-4 col-4 ml-2 text-center"
                      type="text"
                      id="mincredit-amount-value"
                      value={min_sales_creditor}
                      validate={validation.required}
                      placeholder="€0.0"
                    />
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-6">
                <div class="form-group">
                  <Translate content='label.Sicherheiten' component='label' className="d-block" />
                  <div class="form-check form-check-inline">
                    <Field
                      type="radio"
                      component={radioButton}
                      value="true"
                      name="colatoral"
                      className="form-check-input"
                      id="credit"
                    />
                    <Translate content='label.yes' component='label' class="form-check-label" for="rating-credit-yes" />
                  </div>
                  <div class="form-check form-check-inline">
                    <Field
                      type="radio"
                      component={radioButton}
                      value="false"
                      name="colatoral"
                      className="form-check-input"
                      id="credit"
                    />
                    <Translate content='label.no' component='label' class="form-check-label" for="rating-credit-no" />
                  </div>
                </div>
              </div>
            </div>
            <div class="row mt-4">
              <div class="col">
                <div class="form-group">
                  <Translate content='label.rating' component="label" class="d-block" />
                  <div class="form-check form-check-inline">
                    <Field
                      type="radio"
                      component={radioButton}
                      value="true"
                      name="credit"
                      className="form-check-input"
                      id="credit"
                    />
                    <Translate content='label.yes' component='label' class="form-check-label" for="rating-credit-yes" />
                  </div>
                  <div class="form-check form-check-inline">
                    <Field
                      type="radio"
                      component={radioButton}
                      value="false"
                      name="credit"
                      className="form-check-input"
                      id="credit"
                    />
                    <Translate content='label.no' component='label' class="form-check-label" for="rating-credit-no" />
                  </div>
                </div>
              </div>
              {credit === 'true' ? (
                <div class="rating d-flex justify-content-between align-content-center flex-wrap mt-3">
                  <div className="row">{this.creditRatings(credits)}</div>
                </div>
                // </div>
              ) : null}


            </div>



            <div className="row mt-4">
              <div className="col">
                <div className="form-group">
                  <Translate content='label.fileupload' component="label" className="d-block" />
                  <Field
                    name="files"
                    component={renderDropzoneField}
                    type="file"
                  />
                  {files ? <strong>Filename: {files[0].name}</strong> : null}
                </div>
                {this.props.initialValues.documents ? this.showFiles(this.props.initialValues.documents) : null}
              </div>
            </div>

            {this.props.errMsg ? (
              <li class="d-flex mb-1" >
                <img src="assets/img/icons/bx-check-circle.svg" alt="alt" />
                <span class="pl-2 green-text">{this.props.errMsg}</span>
              </li>

            ) : null}
            <div className="row mt-4">
              <div className="col">
                <Translate content='button.submit' component="button" className="btn btn-primary btn-form" type="submit" />
              </div>
            </div>
          </form>
        </div>
      </Fragment>
    );
  }
}
function mapStateToProps(state) {
  return { errMsg: state.errors, industry: state.industryList, service: state.service, language: state.language, initialValues: state.singleProduct.product, allStates: state.allStates, county: state.county };
}

EditProduct = reduxForm({
  form: 'editProduct',
  enableReinitialize: true
})(EditProduct);

const selector = formValueSelector('editProduct');
EditProduct = connect(state => {
  const time_duration = selector(state, 'time_duration');
  const states = selector(state, 'states');
  const credit = selector(state, 'credit');
  const min_creditValue = selector(state, 'min_credit_amount');
  const max_credit_amount = selector(state, 'max_credit_amount');
  const colatoral = selector(state, 'colatoral');
  const interestValue = selector(state, 'interest_rate');
  const credit_amountValue = selector(state, 'amount');
  const min_sales_creditor = selector(state, 'min_sales_creditor')
  const files = selector(state, 'files')
  return {
    states,
    credit,
    min_creditValue,
    interestValue,
    credit_amountValue,
    time_duration,
    max_credit_amount,
    min_sales_creditor,
    colatoral,
    files
  };
})(EditProduct);
export default connect(
  mapStateToProps,
  { updateProduct, getIndustryList, getServiceList, getProductById, downloadToken, getCounties, getAllState }
)(EditProduct);
