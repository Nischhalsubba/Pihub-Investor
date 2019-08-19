import React, { Component, Fragment } from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { addProduct } from '../../actions/product';
import Subheader from '../general/Subheader';
import * as validation from '../../_utils/validate';
import {
  inputField,
  dropDownField,
  inputSlider,
  renderMultiselect,
  renderDropzoneField
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
  onSubmit = formProps => {
    this.props.addProduct(formProps, () => this.props.history.push('/'));
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
                    name="product_details"
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
                    name="category_id"
                    component={dropDownField}
                    options={userOptions}
                    label="Geographical region of Interest"
                    validate={validation.required}
                  />
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
                      name="interest_rate"
                      type="range"
                      className="w-100"
                      component={inputSlider}
                      label="Interest"
                      id="mincredit-amount"
                      readOnly
                      validate={validation.required}
                    />
                    <div className="col col-2">
                      <input
                        className="form-control"
                        type="text"
                        id="amount"
                        value={interestValue}
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
                      name="amount"
                      type="range"
                      className="w-100"
                      component={inputSlider}
                      label="Credit Amount"
                      id="credit-amount"
                      readOnly
                      validate={validation.required}
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
                    validate={validation.required}
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
  const min_creditValue = selector(state, 'min_credit_amount');
  const interestValue = selector(state, 'interest_rate');
  const credit_amountValue = selector(state, 'amount');

  return {
    min_creditValue,
    interestValue,
    credit_amountValue
  };
})(AddProduct);
export default connect(
  mapStateToProps,
  { addProduct }
)(AddProduct);
