
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
      return <span><Translate content='column.noattachment' /></span>
    } else {
      return docs.map((doc, index) => {
        return (
          <div class="file mb-2">
            <span class="file-name">File {index + 1}</span>
            <span class="ml-4 file-size">Type: {doc.type}</span>
          </div>
        );
      })
    }
  }
  showCollaterals = collaterals => {
    if (collaterals.length === 0) {
      return <div>Not Available</div>
    } else {
      return collaterals.map((collat, index) => {
        return <span key={index}>{collat.name} <br /></span>
      })
    }
  }
  changeStatus = status => {
    const { pId, aId } = this.props.location.state;

    this.props.changeStatus(pId, aId, status, () => this.setState({ refresh: !this.state.refresh }))
  }
  render() {
    if (this.state.detail) {
      const { requested_by, requested_on, amount, deadline, description, duration, status, files, time_duration, collaterals, state } = this.state.detail;
      var requestedDate = new Date(requested_on);
      return (
        <Fragment>
          <Subheader heading={this.props.location.state.product} />


          {status === 'rejected' ? <div class="alert alert-rejected"><Translate content='column.appreject' /></div> : null}

          {status === 'accepted' ? <div class="alert alert-success"><Translate content='column.appaccept' /></div> : null}
          <div class="content-body credit-request">
            <div class="d-flex">
              <div class="col-lg-12 col-xl-8">
                <div class="row justify-content-between w-100">
                  <div class="col-3 p-0">
                    {/* <h6>States</h6> */}
                    <h6> <Translate content='label.state' /></h6>
                    <span>{state ? state.name : null}</span>
                  </div>
                  <div class="col-3 p-0">
                    <h6> <Translate content='column.credittype' /></h6>
                    <span>Resolving credit </span>
                  </div>
                  <div class="col-3 p-0">
                    <h6><Translate content='label.country' /></h6>
                    <span>Germany</span>
                  </div>
                  <div class="col-3 p-0">
                    <h6><Translate content='label.industries' /></h6>
                    <div class="d-flex flex-wrap justify-content-between flex-column">
                      {collaterals ? this.showCollaterals(collaterals) : null}
                    </div>
                  </div>
                </div>

              </div>
              <div class="col-lg-12 col-xl-4 rightbar">
                <div class="amount">
                  {/* <h6>Requested amount of</h6> */}
                  <h6>  <Translate content='label.requestedamount' /></h6>
                  <h2>€{amount}</h2>
                </div>
                <div class="investor clearfix mt-5">
                  {/* <h6>Requested By</h6> */}
                  <h6> <Translate content='column.requestedby' /></h6>
                  <div class="investor-profile d-flex align-items-center">
                    <img src="assets/img/investor-profile.jpg" alt="Investor profile picture" />
                    <a class="ml-2">{requested_by}</a>
                  </div>
                </div>
                <div class="date mt-5">
                  {/* <h6>Request on</h6> */}
                  <h6> <Translate content='column.requeston' /></h6>
                  <span>{`${requestedDate.getDate()} - ${requestedDate.getMonth() + 1} - ${requestedDate.getFullYear()}`}</span>
                </div>
                <div class="date mt-5">
                  {/* <h6>Time Duration</h6> */}
                  <h6>  <Translate content='label.time' /></h6>
                  <span>{time_duration} Monate</span>
                </div>
                <div class="date mt-5">
                  {/* <h6>Time Duration</h6> */}
                  <h6>  Status</h6>
                  <span>{status}</span>
                </div>
              </div>
            </div>
            <div class="attachments mt-5 mb-5">
              {/* <h4>Attachments</h4> */}
              <h6><Translate content='label.attachments' /></h6>
              {this.renderDocs(files)}
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
