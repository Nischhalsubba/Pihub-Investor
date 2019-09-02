
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Subheader from '../general/Subheader';
import { getApplicationDetail } from '../../actions/application';
class DetailCreditRequest extends Component {
  state = { detail: null }
  componentDidMount() {
    if (!this.props.location.state) {
      return this.props.history.push('/products')
    }
    const { pId, aId } = this.props.location.state;
    this.props.getApplicationDetail(pId, aId);
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.data !== prevProps.data) {
      console.log('here', this.props.data)
      this.setState({ detail: this.props.data.detail })
    }
  }
  render() {
    if (this.state.detail) {
      const { requested_by, requested_on, requested_amount, deadline, description, duration, status } = this.state.detail;
      var requestedDate = new Date(requested_on);
      return (
        <Fragment>
          <Subheader heading="Credit Request on IT investment" />
          <div class="content-body credit-request">
            <div class="d-flex">
              <div class="col-lg-12 col-xl-8">
                <div class="row justify-content-between w-100">
                  <div class="col-3 p-0">
                    <h6>States</h6>
                    <a href="#">Berlin</a>
                  </div>
                  <div class="col-3 p-0">
                    <h6>Credit Type</h6>
                    <a href="#">Resolving credit </a>
                  </div>
                  <div class="col-3 p-0">
                    <h6>County</h6>
                    <a href="#">Germany</a>
                  </div>
                  <div class="col-3 p-0">
                    <h6>Industres</h6>
                    <div class="d-flex flex-wrap justify-content-between flex-column">
                      <a class="mb-1" href="#">Service Industry</a>
                      <a class="mb-1" href="#">Administration and office work</a>
                      <a class="mb-1" href="#">Banking and financial services </a>
                      <a class="mb-1" href="#">Marketing, advertising and PR</a>
                      <a class="mb-1" href="#">Healthcare</a>
                      <a class="mb-1" href="#">Tourism, hotel and gastronomy</a>
                    </div>
                  </div>
                </div>
                <div class="row justify-content-between w-100 mt-3">
                  <div class="col-3 p-0">
                    <h6>Creditrre form</h6>
                    <span>AAA</span>
                  </div>
                  <div class="col-3 p-0">
                    <h6>Standard & Poors</h6>
                    <span>A+</span>
                  </div>
                  <div class="col-3 p-0">
                    <h6>Bank/Andere</h6>
                    <span>AAA+</span>
                  </div>
                  <div class="col-3 p-0">
                    <h6>Bank/Andere</h6>
                    <span>AAA+</span>
                  </div>
                </div>
              </div>
              <div class="col-lg-12 col-xl-4 rightbar">
                <div class="amount">
                  <h6>Requested amount of</h6>
                  <h2>${requested_amount}</h2>
                </div>
                <div class="investor clearfix mt-5">
                  <h6>Requested By</h6>
                  <div class="investor-profile d-flex align-items-center">
                    <img src="assets/img/investor-profile.jpg" alt="Investor profile picture" />
                    <a class="ml-2" href="#">{requested_by}</a>
                  </div>
                </div>
                <div class="date mt-5">
                  <h6>Request on</h6>
                  <span>{`${requestedDate.getDate()} - ${requestedDate.getMonth() + 1} - ${requestedDate.getFullYear()}`}</span>
                </div>
              </div>
            </div>
            <div class="attachments mt-5 mb-5">
              <h4>Attachments</h4>
              <div class="file mb-2">
                <span class="file-name">tax payer investment.docx</span>
                <span class="ml-4 file-size">400.5kb</span>
              </div>
              <div class="file">
                <span class="file-name">investment agreement.pdf</span>
                <span class="ml-4 file-size">322.2kb</span>
              </div>
            </div>
            {/* <span class="mt-3">
            <a class="btn btn-option" href="#">Accepted</a>
          </span> */}
          </div>
        </Fragment>
      );
    } else {
      return <div>Just a sec !!</div>
    }

  }
}
function mapStateToProps(state) {
  return { data: state.applicationDetail }
}
export default connect(mapStateToProps, { getApplicationDetail })(DetailCreditRequest);
