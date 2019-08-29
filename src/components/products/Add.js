import React, { Component, Fragment } from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { addProduct } from '../../actions/product';
import Subheader from '../general/Subheader';
import * as validation from '../../_utils/validate';
import germanStates from '../../_german_states';
import city from '../../_german_states/city';
import {
  inputField,
  dropDownField,
  inputSlider,
  renderDropzoneField,
  radioButton
} from '../../_formFields';

const userOptions = [
  {
    label: 'Information Technology',
    value: '1'
  },
  {
    label: 'Construction',
    value: '2'
  },
  {
    label: 'Food and Wines',
    value: '0'
  }
];
class AddProduct extends Component {
  state = { cities: [] };
  componentDidUpdate(prevProps) {
    if (this.props.states !== prevProps.states) {
      this.setState({
        cities: city(this.props.states)
      });
    }
  }
  onSubmit = formProps => {
    console.log(formProps);
    // this.props.addProduct(formProps, () => this.props.history.push('/'));
  };
  renderCredits = credits => {
    return credits.map((credit, id) => {
      return (
        <div class="col-12 col-sm-12 col-md-6">
          <div class="form-group">
            <div class="row align-items-center">
              <div class="col">
                <div class="form-check">
                  <Field
                    class="form-check-input"
                    type="checkbox"
                    name={`rating[${id}]`}
                    id="moodys"
                    component="input"
                  />
                  <label class="form-check-label" for="moodys">
                    {credit.name}
                  </label>
                </div>
              </div>
              <div class="col">
                <Field
                  component="input"
                  class="form-control"
                  type="text"
                  name={`rating[${credit.name}]`}
                  value=""
                />
              </div>
            </div>
          </div>
        </div>
      );
    })

  };
  render() {
    const {
      handleSubmit,
      min_creditValue,
      interestValue,
      credit_amountValue,
      credit,
      time_duration,
      max_credit_amount
    } = this.props;
    return (
      <Fragment>
        <Subheader heading="Add Product" />
        <div className="content-body">
          <form className="form-signup" onSubmit={handleSubmit(this.onSubmit)}>
            <div className="row mt-4">
              <div className="col">
                <div className="form-group">
                  <Field
                    name="product_title"
                    type="text"
                    component={inputField}
                    label="Product Title"
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
                    label="States"
                    validate={validation.required}
                  />
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div class="col-12 col-sm-12 col-md-6">
                <div className="form-group">
                  <Field
                    name="credit_type"
                    component={dropDownField}
                    options={userOptions}
                    label="Credit Type"
                    validate={validation.required}
                  />
                </div>
              </div>
              <div class="col-12 col-sm-12 col-md-6">
                <div class="form-group">
                  <Field
                    name="Country"
                    component={dropDownField}
                    options={this.state.cities}
                    label="Country"
                    validate={validation.required}
                  />
                </div>
              </div>
            </div>
            <div class="row mt-4">
              <div class="col-12 col-sm-12 col-md-6">
                <div class="form-group">
                  <Field
                    name="industry_ids"
                    component={dropDownField}
                    options={userOptions}
                    label="Industry"
                    validate={validation.required}
                  />
                </div>
              </div>
              <div class="col-12 col-sm-12 col-md-6">
                <div class="form-group">
                  <div className="row align-items-end">
                    <Field
                      name="time_duration"
                      type="range"
                      className="w-100"
                      component={inputSlider}
                      label="Time Duration(Months)"
                      id="mincredit-amount"
                      validate={validation.required}
                    />
                    <div className="col col-2">
                      <input
                        className="form-control"
                        type="text"
                        id="mincredit-amount-value"
                        value={time_duration}
                        validate={validation.required}
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
                      label="Minimum Credit Amount"
                      id="mincredit-amount"
                      validate={validation.required}
                    />
                    <div className="col col-2">
                      <input
                        className="form-control"
                        type="text"
                        id="mincredit-amount-value"
                        value={min_creditValue}
                        validate={validation.required}
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
                      label="Maximum Credit Amount"
                      id="mincredit-amount"
                      readOnly
                      validate={validation.required}
                    />
                    <div className="col col-2">
                      <input
                        className="form-control"
                        type="text"
                        id="amount"
                        value={max_credit_amount}
                        validate={validation.required}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row mt-4">
              <div class="col">
                <div class="form-group">
                  <label class="d-block">Rating for Credit</label>
                  <div class="form-check form-check-inline">
                    <Field
                      type="radio"
                      component={radioButton}
                      value="true"
                      name="credit"
                      className="form-check-input"
                      id="credit"
                    />
                    <label class="form-check-label" for="rating-credit-yes">
                      Yes
                    </label>
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
                    <label class="form-check-label" for="rating-credit-no">
                      No
                    </label>
                  </div>
                </div>
              </div>
            </div>
            {credit === 'true' ? (
              <div class="row mt-4">
                <div class="col-12 col-sm-12 col-md-6">
                  <div class="row">{this.renderCredits([{ name: 'bhusan' }, { name: 'Panter' }])}</div>
                </div>
              </div>
            ) : null}
            <div className="row mt-4">
              <div className="col">
                <div className="form-group">
                  <label className="d-block" for="">
                    File Upload
                  </label>
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
                <button className="btn btn-primary btn-form" type="submit">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </Fragment>
    );
  }
}
function mapStateToProps(state) {
  return { errMsg: state.errors };
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

  const interestValue = selector(state, 'interest_rate');
  const credit_amountValue = selector(state, 'amount');

  return {
    states,
    credit,
    min_creditValue,
    interestValue,
    credit_amountValue,
    time_duration,
    max_credit_amount
  };
})(AddProduct);
export default connect(
  mapStateToProps,
  { addProduct }
)(AddProduct);
