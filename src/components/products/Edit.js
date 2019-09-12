import React, { Component, Fragment } from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { getProductById } from '../../actions/product';
import { getIndustryList } from '../../actions/industry'
import Subheader from '../general/Subheader';
import * as validation from '../../_utils/validate';
import germanStates from '../../_german_states';
import city from '../../_german_states/city';
import industries from '../../_utils/industries';
import getIndustryId from '../../_utils/getIndustryId';
import Translate from 'react-translate-component'
import {
  inputField,
  dropDownField,
  inputSlider,
  renderDropzoneField,
  radioButton,
  renderMultiselect
} from '../../_formFields';

const userOptions = [
  'Corporate loan',
  'Purchase financing / Finetrading',
  'Stocktrading',
  "Acquisition/ Takeover financing",
  'Project financing',
  'Mezzanine financing',
];
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
  state = { cities: [], ratings: [], rating_value: [], grade: '' };
  componentDidMount() {
    if (!this.props.location.state) {
      // Redirect to list page if therer is no id of product to be fetched availabel
      return this.props.history.push('/products')
    }
    this.props.getProductById(this.props.location.state.id)
    this.props.getIndustryList();
  }
  componentDidUpdate(prevProps, prevState) {

    if (this.props.states !== prevProps.states) {
      this.setState({
        cities: city(this.props.states)
      });
    }
    if (this.props.initialValues !== prevProps.initialValues) {
      console.log(this.props.initialValues);
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
    formProps.industry_id = getIndustryId(this.props.industry.list, formProps.undefined);
    formProps.ratings = this.state.rating_value;
    this.props.addProduct(formProps, () => this.props.history.push('/products'))
  };

  rC = (credits) => {
    return credits.map((credit, index) => {
      return (
        <div className="rating d-flex justify-content-between align-content-center flex-wrap mt-3">
          <div className="rating-item">
            <div className="col-10">
              <input className="mr-2" type="checkbox" name={credit.id} value="" onChange={() => this.setState({ ratings: [...this.state.ratings, credit.id] })}
              />{credit.name}
            </div>
            <input pattern="[a-cA-C]{1}"
              type="text" name={`rating_value[${credit.id}]`}
              onChange={(e) => this.setState({
                rating_value: [...this.state.rating_value, { id: credit.id, value: e.target.value }]
              })
              }
              title="Grade must be either A,B or C"
            />
          </div>
        </div>
      )
    })

  }
  render() {
    const {
      handleSubmit,
      min_creditValue,
      credit,
      time_duration,
      max_credit_amount
    } = this.props;
    return (
      <Fragment>
        <Subheader heading={<Translate content='label.editproducts' />}/>
        <div className="content-body">
          <form className="form-signup"
            onSubmit={handleSubmit(this.onSubmit)}
          >
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
                  />
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-12 col-sm-12 col-md-6">
                <div className="form-group">
                  <Field
                    name="credit_type"
                    component={dropDownField}
                    options={industries}
                    label={<Translate content='label.service' />}
                    validate={validation.required}
                  />
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-6">
                <div className="form-group">
                  <Field
                    name="County"
                    component={dropDownField}
                    options={this.state.cities}
                    label={<Translate content='label.country' />}
                    validate={validation.required}
                  />
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-12 col-sm-12 col-md-6">

                <Field
                  component={renderMultiselect}
                  label={<Translate content='column.industry' />}
                  data={userOptions}
                  className="form-group" />
              </div>
              <div className="col-12 col-sm-12 col-md-6">
                <div className="form-group">
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
                        placeholder={this.props.initialValues.time_duration}
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
                        defaultValue={this.props.initialValues.min_credit_amount}
                        placeholder={this.props.initialValues.min_credit_amount}

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
                      min="25000"
                      max="5000000"
                    />
                    <div className="col col-2">
                      <input
                        className="form-control"
                        type="text"
                        id="amount"
                        value={max_credit_amount}
                        validate={validation.required}
                        defaultValue={this.props.initialValues.max_credit_amount}
                        placeholder={this.props.initialValues.max_credit_amount}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col">
                <div className="form-group">
                  {/* <label className="d-block">Rating for Credit</label> */}
                  {<Translate content='label.rating' component="label" className="d-block" />}
                  <div className="form-check form-check-inline">
                    <Field
                      type="radio"
                      component={radioButton}
                      value="true"
                      name="credit"
                      className="form-check-input"
                      id="credit"
                    />
                    {/* <label className="form-check-label" for="rating-credit-yes">
                      Yes
                      </label> */}
                      <Translate content='label.yes' component='label' className="form-check-label" for="rating-credit-yes" />
                  </div>
                  <div className="form-check form-check-inline">
                    <Field
                      type="radio"
                      component={radioButton}
                      value="false"
                      name="credit"
                      className="form-check-input"
                      id="credit"
                    />
                    {/* <label className="form-check-label" for="rating-credit-no">
                      No
                      </label> */}
                      <Translate content='label.no' component='label' className="form-check-label" for="rating-credit-no" />
                  </div>
                </div>
              </div>
              {credit === 'true' ? (
                <div className="rating d-flex justify-content-between align-content-center flex-wrap mt-3">
                  <div className="row">{this.rC(credits)}</div>
                </div>
              ) : null}
            </div>

            <div className="row mt-4">
              <div className="col">
                <div className="form-group">
                  {/* <label className="d-block" for="">
                    File Upload
                    </label> */}
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
                {/* <button className="btn btn-primary btn-form" type="submit">
                  Submit
                  </button> */}
                  <Translate content='button.submit' component="button"  className="btn btn-primary btn-form" type="submit" />
              </div>
            </div>
          </form>
        </div>
      </Fragment>
    );


  }
}
function mapStateToProps(state) {
  return { errMsg: state.errors, industry: state.industryList, initialValues: state.singleProduct.product };
}

EditProduct = reduxForm({
  form: 'editProduct',
  enableReinitialize: true
})(EditProduct);

const selector = formValueSelector('EditProduct');
EditProduct = connect(state => {
  const time_duration = selector(state, 'time_duration');
  const states = selector(state, 'states');
  const credit = selector(state, 'credit');
  const min_creditValue = selector(state, 'min_credit_amount');
  const max_credit_amount = selector(state, 'max_credit_amount');

  return {
    states,
    credit,
    min_creditValue,

    time_duration,
    max_credit_amount
  };
})(EditProduct);
export default connect(
  mapStateToProps,
  { getProductById, getIndustryList }
)(EditProduct);
