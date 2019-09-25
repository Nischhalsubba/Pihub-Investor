import React, { Component, Fragment } from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import InputRange from 'react-input-range';
// import ReactTooltip from 'react-tooltip';
import Tooltip from 'react-tooltip-lite';

import { connect } from 'react-redux';
import { addProduct } from '../../actions/product';
import { getIndustryList } from '../../actions/industry';
import { getServiceList } from '../../actions/service';
import { getCounties, getAllState } from '../../actions/statesCounties';
import { clearError } from '../../actions/clearError';
import Subheader from '../general/Subheader';
import * as validation from '../../_utils/validate';
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
class AddProduct extends Component {
  state = { cities: [], ratings: [], rating_value: [], grade: '', cityNames: [], services: [], industries: [], states: [], statesWithId: [], value: { min: 15, max: 50 } };
  componentDidMount() {
    this.props.clearError();
    this.props.getIndustryList();
    this.props.getServiceList();
    this.props.getCounties();
    this.props.getAllState();

  }
  componentDidUpdate(prevProps, prevState) {
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
    console.log(this.state.rating_value)
    if (formProps.undefined[0] === 'Select All') {
      formProps.industry_id = getId(this.props.industry.list, null);
    } else {
      formProps.industry_id = getId(this.props.industry.list, formProps.undefined, this.props.language);
    }

    formProps.ratings = this.state.rating_value;
    formProps.min_duration = this.state.value.min;
    formProps.max_duration = this.state.value.max;
    if (formProps.County[0] === 'Select All') {
      formProps.county_ids = extractIdCounty(null, this.state.cities);
    } else {
      formProps.county_ids = extractIdCounty(formProps.County, this.state.cities);

    }
    // console.log(this.state.statesWithId)
    if (formProps.states === 'Select All') {
      formProps.state_ids = extractIdForName(null, this.state.statesWithId);
    } else {
      formProps.state_ids = extractIdForName(formProps.states, this.state.statesWithId);

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
            <input
              type="text" name={`rating_value[${credit.id}]`}
              onChange={(e) => this.setState({
                rating_value: [...this.state.rating_value, { rating_id: credit.id, value: e.target.value }]
              })
              }

              class="col-3 form-control text-center"

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
  displayFiles = files => {
    return files.map((file, index) => {
      return <span key={index}>{file.name} <br /></span >
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
                  <label for="amount" data-tip data-for='product'>
                    <strong>                  <Tooltip content='Product'>
                      <Translate content='label.producttitle' data-tip data-for='product' />                  </Tooltip>
                    </strong>
                  </label>
                  {/* <ReactTooltip id='product'>
                    <span>Give a product name</span>
                  </ReactTooltip> */}
                  <Field
                    name="product_title"
                    type="text"
                    component={inputField}
                    // label={<Translate content='label.producttitle' />}
                    className="form-control"
                    validate={validation.required}
                  />
                </div>
              </div>
              <div class="col-12 col-sm-12 col-md-6">
                <div className="form-group">
                  <label for="amount" data-tip data-for='state'>
                    <strong> <Translate content='label.state' data-tip data-for='state' /></strong>
                  </label>
                  {/* <ReactTooltip id='state'>
                    <span>Select states.</span>
                  </ReactTooltip> */}
                  <Field
                    name="states"
                    component={renderMultiselect}
                    data={this.state.states}
                    // label={<Translate content='label.state' />}
                    validate={validation.required}
                    placeholder={<Translate content='placeholder.select' />}
                  />
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div class="col-12 col-sm-12 col-md-6">
                <div className="form-group">
                  <label for="amount" data-tip data-for='service'>
                    <strong> <Translate content='label.service' data-tip data-for='service' /></strong>
                  </label>
                  {/* <ReactTooltip id='service'>
                    <span>Select a relevant service.</span>
                  </ReactTooltip> */}
                  <Field
                    name="services"
                    component={dropDownField}
                    options={this.state.services[`${this.props.language}`]}
                    // label={<Translate content='label.service' />}
                    validate={validation.required}
                    placeholder={<Translate content='placeholder.select' />}
                  />
                </div>
              </div>
              <div class="col-12 col-sm-12 col-md-6">
                <div class="form-group">
                  <label for="amount" data-tip data-for='county'>
                    <strong> <Translate content='label.country' data-tip data-for='service' /></strong>
                  </label>
                  {/* <ReactTooltip id='county'>
                    <span>Select one or more counties.</span>
                  </ReactTooltip> */}
                  <Field
                    name="County"
                    component={renderMultiselect}
                    data={this.state.cityNames}
                    // label={<Translate content='label.country' />}
                    // validate={validation.required}
                    placeholder="select tags"
                  />
                </div>
              </div>
            </div>
            <div class="row mt-4">
              <div class="col-12 col-sm-12 col-md-6">
                <label for="amount" data-tip data-for='industry'>
                  <strong> <Translate content='label.industries' /></strong>
                </label>
                {/* <ReactTooltip id='industry'>
                  <span>Select relevent industry.You can select more than one.</span>
                </ReactTooltip> */}
                <Field
                  component={renderMultiselect}
                  // label={<Translate content='label.industries' />}
                  data={this.state.industries.names ? this.state.industries.names[`${this.props.language}`] : []}
                  className="form-group"
                  placeholder="select"
                />
              </div>
              <div class="col-12 col-sm-12 col-md-6">
                <div class="form-group">
                  <label for="amount" data-tip data-for='time-duration'>
                    <strong><Translate content='label.timeduration' /></strong>
                  </label>
                  <div class="d-flex align-items-center">
                    {/* <ReactTooltip id='time-duration'>
                      <span>Time dutaion from 12 Months to 60 Months</span>
                    </ReactTooltip> */}

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
            {/* </div> */}

            <div className="row mt-4">
              <div className="col-12 col-sm-12 col-md-6">
                <div className="form-group">
                  <label for="amount" data-tip data-for='min-credit'>
                    <strong> <Translate content='label.mincredit' /></strong>
                  </label>
                  {/* <ReactTooltip id='min-credit'>
                    <span>Minimum Credit Amount from 250k to 5m</span>
                  </ReactTooltip> */}
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
                      step="10000"

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
                  <label for="amount" data-tip data-for='max-credit'>
                    <strong> <Translate content='label.maxcredit' /></strong>
                  </label>
                  {/* <ReactTooltip id='max-credit'>
                    <span>Maximum Credit Amount from 250k to 5m and should be more than the min. credit amount</span>
                  </ReactTooltip> */}
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
                      step="10000"
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
                  <label for="amount" data-tip data-for='min-sales'>
                    <strong>  <Translate content='label.minimumsales' /></strong>
                  </label>
                  {/* <ReactTooltip id='min-sales' >
                    <span>Minimum Sales Credit from 0 to 50M</span>
                  </ReactTooltip> */}
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
                      step="100000"

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
                  <strong>
                    <Translate content='label.Sicherheiten' component='label' className="d-block" data-tip data-for='collateral' />
                  </strong>
                  {/* <ReactTooltip id='collateral' >
                    <span>Select yes if collateral is needed.</span>
                  </ReactTooltip> */}
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
                  <strong><Translate content='label.rating' component="label" class="d-block" data-tip data-for='rating' /></strong>
                  {/* <ReactTooltip id='rating' >
                    <span>Select Yes if rating is required.</span>
                  </ReactTooltip> */}
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
                  <strong> <Translate content='label.fileupload' component="label" data-tip data-for='files' /></strong>
                  {/* <ReactTooltip id='files'>
                    <span>Upload necessary documents.</span>
                  </ReactTooltip> */}
                  <Field
                    name="files"
                    component={renderDropzoneField}
                    type="file"
                  // validate={validation.required}
                  />
                  {files ? this.displayFiles(files) : null}
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
  return { errMsg: state.errors, industry: state.industryList, service: state.service, language: state.language, verified: state.scope, allStates: state.allStates, county: state.county };
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
  { addProduct, getIndustryList, getServiceList, clearError, getCounties, getAllState }
)(AddProduct);
