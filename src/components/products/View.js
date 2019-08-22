import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { getProductById } from '../../actions/product';
import Subheader from '../general/Subheader';
import RequestedByList from '../credits/RequestedByList';
class ViewProduct extends Component {
  componentDidMount() {
    if (!this.props.location.state) {
      return this.props.history.push('/products');
    }
    this.props.getProductById(this.props.location.state.id);
  }
  render() {
    if (this.props.product) {
      const {
        product: {
          investor,
          product_code,
          amount,
          valid_from,
          valid_until,
          status
        }
      } = this.props.product;
      return (
        <Fragment>
          <Subheader heading={product_code} />
          <div class="content-body credit-request">
            <div class="row justify-content-between w-100">
              <div class="col-lg-12 col-xl-8">
                <p>
                  Some text ** No description in response so this is just a
                  placeholder **
                </p>
                <div class="row mt-5 credit-request-stat">
                  <div class="col col md-4">
                    <h4>Interest</h4>
                    <p>{amount}%</p>
                  </div>
                  <div class="col col md-4 stat-alignment-right">
                    <h4>Minimum Credit amount</h4>
                    <p>${amount}</p>
                  </div>
                  <div class="col col md-4 stat-alignment-right">
                    <h4>Region of interest</h4>
                    <p>Information Technology</p>
                  </div>
                </div>
              </div>
              <div class="col-lg-12 col-xl-4 rightbar">
                <div class="amount">
                  <h6>Investment available of</h6>
                  <h2>${amount}</h2>
                  <p class="font-italic">taxes may apply as per country</p>
                </div>
                <div class="investor clearfix mt-5">
                  <h6>Investor</h6>
                  <div class="investor-profile d-flex align-items-center">
                    <img
                      src="assets/img/investor-profile.jpg"
                      alt="Investor profile picture"
                    />
                    <a class="ml-2" href="#">
                      {investor}
                    </a>
                  </div>
                </div>
                <div class="date date-created mt-5">
                  <h6>Created on</h6>
                  <a href="#">{valid_from}</a>
                </div>
                <div class="date date-expire mt-5">
                  <h6>Expires on</h6>
                  <a href="#">{valid_until}</a>
                </div>
              </div>
            </div>
            <div class="attachments mt-4">
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
            <RequestedByList />
          </div>
        </Fragment>
      );
    } else {
      return <div>Just a sec</div>;
    }
  }
}
function mapStateToProps(state) {
  return { product: state.singleProduct };
}
export default connect(
  mapStateToProps,
  { getProductById }
)(ViewProduct);
