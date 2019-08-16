import React, { Component, Fragment } from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';

import Subheader from '../general/Subheader';
import {
  inputField,
  dropDownField,
  inputSlider,
  renderMultiselect
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
class EditProduct extends Component {
  render() {
    const {
      handleSubmit,
      min_creditValue,
      interestValue,
      credit_amountValue
    } = this.props;
    return (
      <Fragment>
        <Subheader heading="Edit Product" />
        <div className="content-body">
          <form className="form-signup" action="signin.html">
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
                  <div className="d-none" id="tpl">
                    <div className="dz-preview dz-file-preview">
                      <div className="dz-progress">
                        <span className="dz-upload" data-dz-uploadprogress="" />
                      </div>
                      <div className="dz-details">
                        <div className="dz-filename" />
                        <span data-dz-name="" />
                        <div className="dz-size" data-dz-size="" />
                        <img src="removebutton.png" alt="X" data-dz-remove="" />
                      </div>
                    </div>
                  </div>
                  <div className="file-upload-display" />
                  <div className="border-dotted">
                    <div className="position-relative" id="file_dropzone">
                      <div className="dz-message needsclick w-25 position-absolute">
                        <img
                          className="d-block m-auto"
                          src="/assets/img/icons/bx-cloud-upload.png"
                          alt=""
                        />
                        <div className="text-center mt-3">
                          <a className="font-weight-bold" href="">
                            Add file{' '}
                          </a>
                          <span>
                            or drop files here
                            {/* <input className="d-none" type="file" name="" /> */}
                            {/* <Field
                              name="profile_pic"
                              component="input"
                              type="file"
                            /> */}
                          </span>
                        </div>
                      </div>
                      <div className="fallback">
                        {/* <input name="file" type="file" multiple="" /> */}
                        <Field
                          name="profile_pic"
                          component="input"
                          type="file"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col">
                <button className="btn btn-primary btn-form" type="submit">
                  Update
                </button>
              </div>
            </div>
          </form>
        </div>
      </Fragment>
    );
  }
}

EditProduct = reduxForm({
  form: 'EditProduct'
})(EditProduct);

const selector = formValueSelector('EditProduct');
EditProduct = connect(state => {
  const min_creditValue = selector(state, 'min_credit');
  const interestValue = selector(state, 'interest');
  const credit_amountValue = selector(state, 'credit_amount');

  return {
    min_creditValue,
    interestValue,
    credit_amountValue
  };
})(EditProduct);

export default EditProduct;
