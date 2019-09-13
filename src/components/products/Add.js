import React, { Component, Fragment } from 'react';
import { Field, reduxForm, formValueSelector, FieldArray } from 'redux-form';

import { connect } from 'react-redux';
import { addProduct } from '../../actions/product';
import { getIndustryList } from '../../actions/industry';
import { getServiceList } from '../../actions/service';
import { clearError } from '../../actions/clearError';
import Subheader from '../general/Subheader';
import * as validation from '../../_utils/validate';
import germanStates from '../../_german_states';
import city from '../../_german_states/city';
import Translate from 'react-translate-component'
import { extractNames, extractId, getId } from '../../_utils/misc';

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
class AddProduct extends Component {
  state = { cities: [], ratings: [], rating_value: [], grade: '', cityNames: [], services: [], industries: [], states: [] };
  componentDidMount() {
    this.props.clearError();
    this.props.getIndustryList();
    this.props.getServiceList();
    this.setState({
      states: extractNames(germanStates)
    })
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.states !== prevProps.states) {
      this.setState({
        cities: city(this.props.states)
      }, () => {
        var c = extractNames(this.state.cities)
        this.setState({ cityNames: c });
      }
      )
    };
    if (this.props.service !== prevProps.service) {
      this.setState({ services: this.props.service })
    };
    if (this.props.industry !== prevProps.industry) {
      this.setState({ industries: this.props.industry })
    }
  }

  onSubmit = formProps => {
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
      formProps.county_ids = extractId(null, this.state.cities);
    } else {
      formProps.county_ids = extractId(formProps.County, this.state.cities);

    }
    if (formProps.states === 'Select All') {
      formProps.state_ids = extractId(null, germanStates);
    } else {
      formProps.state_ids = extractId(formProps.states, germanStates);

    }
    this.props.addProduct(formProps, () => this.props.history.push('/products'))
  };

  creditRatings = (credits) => {
    return credits.map((credit, index) => {
      return (
        // <div class="rating d-flex justify-content-between align-content-center flex-wrap mt-3">
        <div class="rating-item">
          <div class="col-9">
            {/* <label>Ratingagentur</label> */}
            {index === 0 || index === 1 ? <Translate content='label.Ratingagentur' component="label" /> : null}
            <br />
            <input class="mr-2" type="checkbox" name={credit.id} value="" onChange={() => this.setState({ ratings: [...this.state.ratings, credit.id] })}
            />{credit.name}
          </div>
          <div class="col-9">
            {index === 0 || index === 1 ? <Translate content='label.Kreditrating' component='label' /> : null}
            <input pattern="[a-cA-C]{1}"
              type="text" name={`rating_value[${credit.id}]`}
              onChange={(e) => this.setState({
                rating_value: [...this.state.rating_value, { id: credit.id, value: e.target.value }]
              })
              }
              title="Grade must be either A,B or C"
              class="col-3 form-control text-center"
              placeholder='A/B/C'
            /></div>
        </div >
        // </div>
      )
    })
  }
  renderCreditTitle = (credits) => {
    return credits.map((credit, index) => {
      return (
        // <div class="rating d-flex justify-content-between align-content-center flex-wrap mt-3">
        <div class="rating-item">
          <div class="col-9">
            {/* <label>Ratingagentur</label> */}
            {/* <Translate content='label.Ratingagentur' component="label" /> */}
            <br />
            <input class="mr-2" type="checkbox" name={credit.id} value="" onChange={() => this.setState({ ratings: [...this.state.ratings, credit.id] })}
            />{credit.name}
          </div>
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
    return (
      <Fragment>
        <Subheader heading={<Translate content='button.addnewproduct' />} />
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
                  placeholder="select tags"
                />
              </div>
              <div class="col-12 col-sm-12 col-md-6">
                <div class="form-group">
                  <label for="amount">
                    <strong><Translate content='label.timeduration' /></strong>
                  </label>
                  <div class="d-flex align-items-center">

                    <Field
                      name="time_duration"
                      type="range"
                      className="w-100"
                      component={inputSlider}
                      // label={<Translate content='label.timeduration' />}
                      id="time-duration"
                      validate={validation.required}
                      max="60"
                      min="3"
                    />
                    {/* <div class="col-12 col-sm-12 col-md-6"> */}
                    &nbsp;&nbsp;<input
                      className="form-control col-md-3 col-sm-4 col-4 ml-2 text-center"
                      type="text"
                      id="mincredit-amount-value"
                      value={time_duration}
                      validate={validation.required}
                      placeholder="3 Monate"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* </div> */}

            <div className="row mt-4">
              <div className="col-12 col-sm-12 col-md-6">
                <div className="form-group">
                  <label for="amount">
                    <strong> <Translate content='label.mincredit' /></strong>
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
                      min="25000"
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
                    <strong> <Translate content='label.maxcredit' /></strong>
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
                      min="25000"
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
                    <strong>  <Translate content='label.minimumsales' /></strong>

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
                  <strong><Translate content='label.Sicherheiten' component='label' className="d-block" /></strong>
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
                  <strong><Translate content='label.rating' component="label" class="d-block" /></strong>
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
                  <strong> <Translate content='label.fileupload' component="label" /></strong>
                  <Field
                    name="files"
                    component={renderDropzoneField}
                    type="file"
                    validate={validation.required}
                  />
                  {files ? <strong>Filename: {files[0].name}</strong> : null}
                </div>
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
  return { errMsg: state.errors, industry: state.industryList, service: state.service, language: state.language, verified: state.scope };
}

AddProduct = reduxForm({
  form: 'addProduct'
})(AddProduct);

const selector = formValueSelector('addProduct');
AddProduct = connect(state => {
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
})(AddProduct);
export default connect(
  mapStateToProps,
  { addProduct, getIndustryList, getServiceList, clearError }
)(AddProduct);
