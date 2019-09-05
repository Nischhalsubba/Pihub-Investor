
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Subheader from '../general/Subheader';
import { getCreditor } from '../../actions/creditor';
import Translate from 'react-translate-component';
import Spinner from '../general/Spinner'
class CreditorDetail extends Component {
  state = { detail: null }
  componentDidMount() {
    if (!this.props.location.state) {
      return this.props.history.push('/products-invested')
    }
    const { id } = this.props.location.state;
    this.props.getCreditor(id);
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.data !== prevProps.data) {
      this.setState({ detail: this.props.data.detail })
    }

  }
  renderDocs = docs => {
    if (docs.length === 0) {
      return <span>**No attachments available</span>
    } else {
      return docs.map((doc, index) => {
        return (
          <div class="file mb-2">
            <span class="file-name">tax payer investment.docx</span>
            <span class="ml-4 file-size">400.5kb</span>
          </div>
        );
      })
    }
  }

  render() {
    if (this.state.detail) {
      console.log('here', this.state.detail)
      const { creditor, collatorals, county, email, files, financial_needs, industries, nda_requirement, phone_number, rating_for_credit, state, street_address, zip_code } = this.state.detail;
      return (
        <Fragment>

          <div class="content-body credit-request">
            <div class="d-flex">
              <div class="col-lg-12 col-xl-8">
                <div class="row justify-content-between w-100">
                  <div class="col-3 p-0">
                    {/* <h6>States</h6> */}
                    <Translate content='label.state' />
                    <br />
                    <span>{state.name}</span>
                  </div>
                  <div class="col-3 p-0">
                    {/* <Translate content='label.credittype' /> */}
                    County <br />
                    <span>{county.name} </span>
                  </div>
                  <div class="col-3 p-0">
                    {/* <Translate content='label.country' /> */}
                    Collateral
                    <br />
                    {collatorals.map((c, index) => {
                      return <span key={index}>{c.name}</span>

                    })}
                  </div>
                  <div class="col-3 p-0">
                    <Translate content='label.industries' />
                    <div class="d-flex flex-wrap justify-content-between flex-column">
                      {industries.map((i, index) => {
                        return <span class="mb-1">{i.name}</span>

                      })}

                    </div>
                  </div>
                </div>

              </div>
              <div class="col-lg-12 col-xl-4 rightbar">
                <div class="amount">
                  {/* <h6>Requested amount of</h6> */}
                  {/* <Translate content='label.requestedamount' /> */}
                  <label>Finanzbedar</label>
                  <h2>${financial_needs}</h2>
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
                  {/* <h6>Request on</h6> */}
                  {/* <Translate content='label.requeston' /> */}
                  {/* <span>{`${requestedDate.getDate()} - ${requestedDate.getMonth() + 1} - ${requestedDate.getFullYear()}`}</span> */}
                  <label>Email: </label>
                  {email}
                </div>
                <div class="date mt-5">
                  <h6>Address</h6>
                  {/* <Translate content='label.time' /> */}
                  <span>{street_address}</span> <br />
                  <span>{zip_code}</span>
                </div>
              </div>
            </div>
            <div class="attachments mt-5 mb-5">
              {/* <h4>Attachments</h4> */}
              <h4> <Translate content='label.attachments' /></h4>
              {this.renderDocs(files)}
            </div>

          </div>
        </Fragment>
      );
    } else {
      return <Spinner />
    }

  }


}
function mapStateToProps(state) {
  return { data: state.creditorDetail }
}
export default connect(mapStateToProps, { getCreditor })(CreditorDetail);
