
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Subheader from '../general/Subheader';
import { getApplicationDetail } from '../../actions/application';
import Translate from 'react-translate-component';
import { changeStatus } from '../../actions/changeStatus';
import { ToEuro } from "../general/CurrencyFormatter";
import { dDigit } from '../../_utils/misc'
import Moment from 'react-moment';
import CreditInfo from './CreditInfo';
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

  /**
   * Loop through collection to show objects display properties
   **/
  showCollections = collection => {
    if (collection.length === 0) {
      return <div>Not Available</div>
    } else {
      return collection.map((object, index) => {
        return <span key={index}>{object.name} <br /></span>
      })
    }
  }
  /**
   * @params = {
   *     Boolean ratingForCredit,
   *     Array creditRatings
   * }
   * Render Credit Ratings
   **/
  renderCreditRatings = (ratingForCredit, creditRatings) => {

    if (ratingForCredit) {
      return (
        <Fragment>
          <div className="row justify-content-between w-100 mt-5">
            <div className="col-2 p-0">
              <h6>Creditrre form</h6><span>AAA</span>
            </div>
            <div className="col-2 p-0">
              <h6>Standard & Poors</h6><span>A+</span>
            </div>
            <div className="col-2 p-0">
              <h6>Moody's</h6><span>AAA+</span>
            </div>
            <div className="col-2 p-0">
              <h6>Euler Hermes</h6><span>AAA+</span>
            </div>
          </div>
          <div className="row justify-content-between w-100 mt-3">
            <div className="col-3 p-0">
              <h6>Euler Hermes</h6><span>AAA+</span>
            </div>
            <div className="col-3 p-0">
              <h6>Bank/Andere</h6><span>AAA+</span>
            </div>
          </div>
        </Fragment>


      )
    }
  }
  changeStatus = status => {
    const { pId, aId } = this.props.location.state;

    this.props.changeStatus(pId, aId, status, () => this.setState({ refresh: !this.state.refresh }))
  }
  render() {

    if (this.state.detail) {
      const {
        id,
        requested_by,
        requested_on,
        amount,
        deadline,
        description,
        duration,
        status, files,
        time_duration, collaterals,
        state, county,
        service, industries, rating_for_credit, ratings } = this.state.detail;
      var requestedDate = new Date(requested_on);

      return (
        <Fragment>
          {/* <Subheader heading={this.props.location.state.product} /> */}
          {<CreditInfo location={this.props.location} />}

          <span class="mt-3">
            <button class="btn btn-success mr-2" disabled={status === 'accepted'}
              onClick={() => this.changeStatus('accepted')}
            ><Translate content="label.accept" /></button>
            <button class="btn btn-danger" disabled={status === 'rejected'}
              onClick={() => this.changeStatus('rejected')}

            ><Translate content="label.reject" /> </button>
          </span>

        </Fragment>
      );
    } else {
      return <div><Translate content="placeholder.justASecond" /></div>
    }

  }
}
function mapStateToProps(state) {
  return { data: state.applicationDetail }
}
export default connect(mapStateToProps, { getApplicationDetail, changeStatus })(DetailCreditRequest);
