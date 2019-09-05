
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Subheader from '../general/Subheader';
import { getApplicationDetail } from '../../actions/application';
import Translate from 'react-translate-component';
import { changeStatus } from '../../actions/changeStatus';
class DetailCreditRequest extends Component {
  state = { detail: null, refresh: false }
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
    if (this.state.refresh !== prevState.refresh) {
      const { pId, aId } = this.props.location.state;
      this.props.getApplicationDetail(pId, aId);
    }
  }
  renderDocs = docs => {
    if (docs.length === 0) {
      return <span>No attachments available</span>
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
  changeStatus = status => {
    const { pId, aId } = this.props.location.state;

    this.props.changeStatus(pId, aId, status, () => this.setState({ refresh: !this.state.refresh }))
  }
  render() {
    if (this.state.detail) {
      const { requested_by, requested_on, requested_amount, deadline, description, duration, status, documents } = this.state.detail;
      var requestedDate = new Date(requested_on);
      return (
        <Fragment>
          <Subheader heading={this.props.location.state.product} />
          {status === 'rejected' ?
          //  <div class="alert alert-rejected">You rejected this Investment
          <Translate content='label.yourejected' component="div" className="alert alert-rejected"/>
          // </div> 
          : null}


          {status === 'accepted' ? <div class="alert alert-success">Sie haben diese Bewerbung angenommen</div> : null}
          <div class="content-body credit-request">
            <div class="d-flex">
              <div class="col-lg-12 col-xl-8">
                <div class="row justify-content-between w-100">
                  <div class="col-3 p-0">
                    {/* <h6>States</h6> */}
                    <Translate content='label.state' />
                    <span>Berlin</span>
                  </div>
                  <div class="col-3 p-0">
                  <Translate content='label.credittype' />
                    <span>Resolving credit </span>
                  </div>
                  <div class="col-3 p-0">
                  <Translate content='label.country' />
                    <span>Germany</span>
                  </div>
                  <div class="col-3 p-0">
                  <Translate content='label.industries' />
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
                {/* <div class="row justify-content-between w-100 mt-3">
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
                </div> */}
              </div>
              <div class="col-lg-12 col-xl-4 rightbar">
                <div class="amount">
                  {/* <h6>Requested amount of</h6> */}
                  <Translate content='label.requestedamount' />
                  <h2>${requested_amount}</h2>
                </div>
                <div class="investor clearfix mt-5">
                  {/* <h6>Requested By</h6> */}
                  <Translate content='label.requestedby' />
                  <div class="investor-profile d-flex align-items-center">
                    <img src="assets/img/investor-profile.jpg" alt="Investor profile picture" />
                    <a class="ml-2" href="#">{requested_by}</a>
                  </div>
                </div>
                <div class="date mt-5">
                  {/* <h6>Request on</h6> */}
                  <Translate content='label.requeston' />
                  <span>{`${requestedDate.getDate()} - ${requestedDate.getMonth() + 1} - ${requestedDate.getFullYear()}`}</span>
                </div>
                <div class="date mt-5">
                  {/* <h6>Time Duration</h6> */}
                  <Translate content='label.time' />
                  <span>{duration} Months</span>
                </div>
              </div>
            </div>
            <div class="attachments mt-5 mb-5">
              {/* <h4>Attachments</h4> */}
              <Translate content='label.attachments' />
              {this.renderDocs(documents)}
            </div>
            <span class="mt-3">
              <button class="btn btn-success mr-2" disabled={status === 'accepted'}
                onClick={() => this.changeStatus('accepted')}
              >Akzeptieren</button>
              <button class="btn btn-danger" disabled={status === 'rejected'}
                onClick={() => this.changeStatus('rejected')}

              >Ablehnen</button>
            </span>
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
export default connect(mapStateToProps, { getApplicationDetail, changeStatus })(DetailCreditRequest);
