import React, { Component, Fragment } from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';

import Subheader from '../general/Subheader';
import {
  inputField,
  dropDownField,
  inputSlider,
  renderMultiselect
} from './../formFields';

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
        <div class="content-body">
          <form class="form-signup" action="signin.html">
            <div class="row mt-4">
              <div class="col">
                <div class="form-group">
                  <Field
                    name="product_title"
                    type="text"
                    component={inputField}
                    label="Product Title"
                    className="form-control"
                  />
                </div>
              </div>
              <div class="col">
                <div class="form-group">
                  <Field
                    name="geographical_interest"
                    component={dropDownField}
                    options={userOptions}
                    label="Geographical region of Interest"
                  />
                </div>
              </div>
            </div>
            <div class="row mt-4">
              <div class="col">
                <div class="form-group">
                  <div class="row align-items-end">
                    <Field
                      name="min_credit"
                      type="range"
                      className="w-100"
                      component={inputSlider}
                      label="Minimum Credit Amount"
                      id="mincredit-amount"
                    />
                    <div class="col col-2">
                      <input
                        class="form-control"
                        type="text"
                        id="mincredit-amount-value"
                        value={min_creditValue}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="col">
                <div class="form-group">
                  <div class="row align-items-end">
                    <Field
                      name="interest"
                      type="range"
                      className="w-100"
                      component={inputSlider}
                      label="Interest"
                      id="mincredit-amount"
                      readOnly
                    />
                    <div class="col col-2">
                      <input
                        class="form-control"
                        type="text"
                        id="mincredit-amount-value"
                        value={interestValue}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row mt-4">
              <div class="col">
                <div class="form-group">
                  <div class="row align-items-end">
                    <Field
                      name="credit_amount"
                      type="range"
                      className="w-100"
                      component={inputSlider}
                      label="Credit Amount"
                      id="credit-amount"
                      readOnly
                    />
                    <div class="col col-2">
                      <input
                        class="form-control"
                        type="text"
                        id="credit-amount-value"
                        data-prefix="$"
                        value={credit_amountValue}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="col">
                <div class="form-group">
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
            <div class="row mt-4">
              <div class="col">
                <div class="form-group">
                  <label class="d-block" for="">
                    File Upload
                  </label>
                  <div class="d-none" id="tpl">
                    <div class="dz-preview dz-file-preview">
                      <div class="dz-progress">
                        <span class="dz-upload" data-dz-uploadprogress="" />
                      </div>
                      <div class="dz-details">
                        <div class="dz-filename" />
                        <span data-dz-name="" />
                        <div class="dz-size" data-dz-size="" />
                        <img src="removebutton.png" alt="X" data-dz-remove="" />
                      </div>
                    </div>
                  </div>
                  <div class="file-upload-display" />
                  <div class="border-dotted">
                    <div class="position-relative" id="file_dropzone">
                      <div class="dz-message needsclick w-25 position-absolute">
                        <img
                          class="d-block m-auto"
                          src="/assets/img/icons/bx-cloud-upload.png"
                          alt=""
                        />
                        <div class="text-center mt-3">
                          <a class="font-weight-bold" href="">
                            Add file{' '}
                          </a>
                          <span>
                            or drop files here
                            {/* <input class="d-none" type="file" name="" /> */}
                            {/* <Field
                              name="profile_pic"
                              component="input"
                              type="file"
                            /> */}
                          </span>
                        </div>
                      </div>
                      <div class="fallback">
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
            <div class="row mt-4">
              <div class="col">
                <button class="btn btn-primary btn-form" type="submit">
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
