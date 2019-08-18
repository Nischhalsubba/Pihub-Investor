import React, { Component, Fragment } from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';

import Subheader from '../general/Subheader';
import {
  inputField,
  dropDownField,
  inputSlider,
  renderMultiselect,
  renderDropzoneField
} from '../../_formFields';

const userOptions = [
  {
    label: 'Erika',
    value: '4e4cf51f-b406-413a-ae46-2cf06c7aabff'
  },
  {
    label: 'Julia',
    value: 'edad97c7-f2dc-4198-91a9-8f20c7bc67b2'
  },
  {
    label: 'Sarah',
    value: '57d3578a-3583-4290-8bae-596a4da81a8d'
  }
];
class AddProduct extends Component {
  onSubmit = formProps => {
    console.log(formProps);
  };
  render() {
    const {
      handleSubmit,
      min_creditValue,
      interestValue,
      credit_amountValue
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
                  />
                </div>
              </div>
              <div className="col">
                <div className="form-group">
                  <Field
                    name="geographical_interest"
                    component={dropDownField}
                    options={userOptions}
                    label="Geographical region of Interest"
                  />
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col">
                <div className="form-group">
                  <div className="row align-items-end">
                    <Field
                      name="min_credit"
                      type="range"
                      className="w-100"
                      component={inputSlider}
                      label="Minimum Credit Amount"
                      id="mincredit-amount"
                    />
                    <div className="col col-2">
                      <input
                        className="form-control"
                        type="text"
                        id="mincredit-amount-value"
                        value={min_creditValue}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="form-group">
                  <div className="row align-items-end">
                    <Field
                      name="interest"
                      type="range"
                      className="w-100"
                      component={inputSlider}
                      label="Interest"
                      id="mincredit-amount"
                      readOnly
                    />
                    <div className="col col-2">
                      <input
                        className="form-control"
                        type="text"
                        id="mincredit-amount-value"
                        value={interestValue}
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
                      name="credit_amount"
                      type="range"
                      className="w-100"
                      component={inputSlider}
                      label="Credit Amount"
                      id="credit-amount"
                      readOnly
                    />
                    <div className="col col-2">
                      <input
                        className="form-control"
                        type="text"
                        id="credit-amount-value"
                        data-prefix="$"
                        value={credit_amountValue}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="form-group">
                  <Field
                    name="tags"
                    component={renderMultiselect}
                    data={['Guitar', 'Cycling', 'Hiking']}
                    label="Tags"
                    className="form-control"
                    id="tags"
                  />
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col">
                <div className="form-group">
                  <label className="d-block" for="">
                    File Upload
                  </label>
                  <Field
                    name="profile_pic"
                    component={renderDropzoneField}
                    type="file"
                  />
                </div>
              </div>
            </div>
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

AddProduct = reduxForm({
  form: 'addProduct'
})(AddProduct);

const selector = formValueSelector('addProduct');
AddProduct = connect(state => {
  const min_creditValue = selector(state, 'min_credit');
  const interestValue = selector(state, 'interest');
  const credit_amountValue = selector(state, 'credit_amount');

  return {
    min_creditValue,
    interestValue,
    credit_amountValue
  };
})(AddProduct);

export default AddProduct;
