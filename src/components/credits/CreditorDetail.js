
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { uploadFile } from '../../actions/uploadFile'
import { getCreditor, creditorDetail } from '../../actions/creditor';
import { downloadToken } from '../../actions/download';
import Translate from 'react-translate-component';
import Spinner from '../general/Spinner'
import * as validation from '../../_utils/validate';
import { renderDropzoneField } from '../../_formFields';
import { ToEuro } from '../general/CurrencyFormatter';
class CreditorDetail extends Component {
  state = { detail: null, refresh: false }
  componentDidMount() {
    if (!this.props.location.state) {
      return this.props.history.push('/products-invested')
    }
    const { productId, appId } = this.props.location.state;
    // this.props.getCreditor(id, this.callback);
    this.props.creditorDetail(productId, appId, this.callback);
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.data !== prevProps.data) {
      console.log('need', this.props.data.detail)
      this.setState({ detail: this.props.data.detail })
    }
    if (this.state.refresh !== prevState.refresh) {
      // this.props.getCreditor(this.props.location.state.id, this.callback);
      this.props.creditorDetail(this.props.location.state.productId, this.props.location.appId, this.callback);
    }
  }
  callback = () => {
    this.setState({ detail: this.props.data.detail })

  }
  onSubmit = formProps => {

    console.log('form', formProps)
    this.props.uploadFile(formProps, this.props.location.state.pId, this.state.detail.id, () => {
      this.setState({ refresh: !this.state.refresh })
    })

  };
  renderDocs = docs => {
    if (docs.length === 0) {
      return <span>**No attachments available</span>
    } else {
      return docs.map((doc, index) => {
        return (
          <div class="file mb-2">
            <span class="file-name">{doc.type}</span>
            <span class="ml-4 file-size">FileType: {doc.file_type}</span>
            <button className='btn btn-link' onClick={() => this.props.downloadToken(doc.path)}><Translate content='button.download' /></button>
          </div>
        );
      })
    }
  }
  listRating = ratings => {
    if (ratings.length === 0) {
      return <span>**<Translate content='column.norating' /></span>
    } else {
      return ratings.map((rating, index) => {
        return (
          <div class="col-3 p-0">
            <h6>{Object.keys(rating)}</h6><span>{Object.values(rating)}</span>
          </div>
        );
      })
    }
  }
  render() {
    if (this.state.detail) {
      console.log('here', this.state.detail)
      const { creditor, collaterals, county, email, files, financial_needs, industries, nda_requirement, phone_number, rating_for_credit, state, street_address, zip_code, ratings, amount, sales } = this.state.detail;
      const { handleSubmit } = this.props;
      return (
        <Fragment>
          <div class="content-body credit-request">
            <form className="form-signup" onSubmit={handleSubmit(this.onSubmit)}>
              <div class="d-flex">
                <div class="col-lg-12 col-xl-8">
                  <div class="row justify-content-between w-100">
                    <div class="col-3 p-0">
                      {/* <h6>States</h6> */}
                      <Translate content='label.state' component="h6" />
                      <br />
                      <span>{state.name}</span>
                    </div>
                    <div class="col-3 p-0">
                      {/* <Translate content='label.credittype' /> */}
                      <h6> County </h6><br />
                      <span>{county.name} </span>
                    </div>
                    <div class="col-3 p-0">
                      {/* <Translate content='label.county' /> */}
                      <h6>Collateral</h6>
                      <br />
                      {collaterals.map((c, index) => {
                        return <span key={index}>{c.name}</span>

                      })}
                    </div>
                    <div class="col-3 p-0">
                      <Translate content='label.industries' component="h6" />
                      <div class="d-flex flex-wrap justify-content-between flex-column">
                        {industries.map((i, index) => {
                          return <span class="mb-1"><br />{i.name}</span>
                        })}
                      </div>
                    </div>

                  </div>
                  <div class="row justify-content-between w-100 mt-3">
                    <h6 className='w-100'>Ratings</h6>
                  </div>
                  <div class="row justify-content-between w-100 mt-3">
                    {ratings.length > 0 ? this.listRating(ratings) : 'Not Available'}
                  </div>
                </div>
                <div class="col-lg-12 col-xl-4 rightbar">
                  <div class="amount">
                    {/* <h6>Requested amount of</h6> */}
                    {/* <Translate content='label.requestedamount' /> */}
                    <label>Finanzbedar</label>
                    <h2><ToEuro amount={amount}/></h2>
                  </div>
                  <div class="investor clearfix mt-5">
                    {/* <h6>Requested By</h6> */}
                    {/* <Translate content='label.requestedby' /> */}
                    <h6>Gläubiger</h6>
                    <div class="investor-profile d-flex align-items-center">
                      <img src="/assets/img/investor-profile.jpg" alt="Investor profile picture" />
                      <a class="ml-2" href="#">{creditor}</a>
                    </div>
                  </div>
                  <div class="date mt-5">
                    <h6>Email: </h6>
                    {email || 'Not Available'}
                  </div>
                  <div class="date mt-5">
                    <h6>Address</h6>
                    <span>{state.name}</span> <br />

                  </div>
                </div>
              </div>
              <div class="attachments mt-5 mb-5">
                <h4> <Translate content='label.attachments' /></h4>
                {this.renderDocs(files)}
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
        </Fragment >
      );
    } else {
      return <Spinner />
    }

  }


}

function mapStateToProps(state) {
  return { data: state.creditorDetail }
}
CreditorDetail = reduxForm({
  form: 'creditorDetail'
})(CreditorDetail);
export default connect(mapStateToProps, { getCreditor, uploadFile, downloadToken, creditorDetail })(CreditorDetail);
