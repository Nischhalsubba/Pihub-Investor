import React, { Component, Fragment } from 'react';
import { Field, reduxForm, formValueSelector, FieldArray } from 'redux-form';

import { connect } from 'react-redux';
import { addProduct } from '../../actions/product';
import { getIndustryList } from '../../actions/industry';
import { getServiceList } from '../../actions/service';
import Subheader from '../general/Subheader';
import * as validation from '../../_utils/validate';
import germanStates from '../../_german_states';
import city from '../../_german_states/city';
import industries from '../../_utils/industries';
import getIndustryId from '../../_utils/getIndustryId';
import Translate from 'react-translate-component'
import { extractNames, extractId } from '../../_utils/misc';

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
  state = { cities: [], ratings: [], rating_value: [], grade: '', cityNames: [], services: [], industries: [] };
  componentDidMount() {
    this.props.getIndustryList();
    this.props.getServiceList();
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
    // console.log(extractId(formProps.County, this.state.cities))
    this.setState({ rating_value: filteredArr });
    if (formProps.undefined[0] === 'Select All') {
      formProps.industry_id = getIndustryId(this.props.industry.list, null);
    } else {
      formProps.industry_id = getIndustryId(this.props.industry.list, formProps.undefined);
    }

    formProps.ratings = this.state.rating_value;
    if (formProps.County[0] === 'Select All') {
      formProps.county_ids = extractId(null, this.state.cities);
    } else {
      formProps.county_ids = extractId(formProps.County, this.state.cities);

    }
    // console.log('form', formProps)
    this.props.addProduct(formProps, () => this.props.history.push('/products'))
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
            <input pattern="[a-cA-C]{1}"
              type="text" name={`rating_value[${credit.id}]`}
              onChange={(e) => this.setState({
                rating_value: [...this.state.rating_value, { id: credit.id, value: e.target.value }]
              })
              }
              title="Grade must be either A,B or C"
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
      industry
    } = this.props;
    console.log(this.state.industries.names)
    return (
      <Fragment>
        <Subheader heading={<Translate content='button.addnewproduct' />} />
        <div className="content-body">
          <form className="form-signup" onSubmit={handleSubmit(this.onSubmit)}>
            <div className="row mt-4">
              <div className="col">
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
              <div className="col">
                <div className="form-group">
                  <Field
                    name="states"
                    component={dropDownField}
                    options={germanStates}
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
                  <div className="row align-items-end">
                    <Field
                      name="time_duration"
                      type="range"
                      className="w-100"
                      component={inputSlider}
                      label={<Translate content='label.timeduration' />}
                      id="time-duration"
                      validate={validation.required}
                      max="60"
                      min="3"
                    />
                    <div className="col col-2">
                      <input
                        className="form-control"
                        type="text"
                        id="mincredit-amount-value"
                        value={time_duration}
                        validate={validation.required}
                        placeholder="3"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mt-4">
              <div className="col">
                <div className="form-group">
                  <div className="row align-items-end">
                    <Field
                      name="min_credit_amount"
                      type="range"
                      className="w-100"
                      component={inputSlider}
                      label={<Translate content='label.mincredit' />}
                      id="mincredit-amount"
                      validate={validation.required}
                      min="1"
                      max="100"

                    />
                    <div className="col col-2">
                      <input
                        className="form-control"
                        type="text"
                        id="mincredit-amount-value"
                        value={min_creditValue}
                        validate={validation.required}
                        placeholder="$0"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="form-group">
                  <div className="row align-items-end">
                    <Field
                      name="max_credit_amount"
                      type="range"
                      className="w-100"
                      component={inputSlider}
                      label={<Translate content='label.maxcredit' />}
                      id="mincredit-amount"
                      readOnly
                      validate={validation.required}
                      min="1"
                      max="100"
                    />
                    <div className="col col-2">
                      <input
                        className="form-control"
                        type="text"
                        id="amount"
                        value={max_credit_amount}
                        validate={validation.required}
                        placeholder="$0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="row mt-4">
              <div class="col">
                <div class="form-group">
                  {/* <label class="d-block">Rating for Credit</label> */}
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

            <div class="row mt-4">
              <div class="col">
                <div class="form-group">
                  {/* <label class="d-block">Sicherheiten</label> */}
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

            <div className="row mt-4">
              <div className="col">
                <div className="form-group">
                  <Translate content='label.fileupload' component="label" className="d-block" />
                  <Field
                    name="files"
                    component={renderDropzoneField}
                    type="file"
                    validate={validation.required}
                  />
                </div>
              </div>
            </div>

            {this.props.errMsg ? (
              <small>
                <font color="red">{this.props.errMsg.errors}</font>
              </small>
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
  return { errMsg: state.errors, industry: state.industryList, service: state.service, language: state.language };
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

  return {
    states,
    credit,
    min_creditValue,
    interestValue,
    credit_amountValue,
    time_duration,
    max_credit_amount,
    colatoral
  };
})(AddProduct);
export default connect(
  mapStateToProps,
  { addProduct, getIndustryList, getServiceList }
)(AddProduct);
