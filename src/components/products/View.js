import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getProductById } from '../../actions/product';
// import Subheader from '../general/Subheader';
import RequestedByList from '../credits/RequestedByList';
import Translate from 'react-translate-component'
class ViewProduct extends Component {
  componentDidMount() {
    if (!this.props.location.state) {
      return this.props.history.push('/products');
    }
    this.props.getProductById(this.props.location.state.id);
  }
  listIndustries = industries => {
    return industries.map((industry, index) => {
      return (
        <a class="mb-1" href="#">{industry.name}</a>

      );
    })
  }
  listStates = states => {
    if (states.length > 0) {
      return states.map((state, index) => {
        return (
          <a class="mb-1" href="#">{state}<br /></a>

        );
      })
    }

  }
  listRating = ratings => {
    if (ratings.length === 0) {
      return <span>**<Translate content='column.norating' /></span>
    } else {
      return ratings.map((rating, index) => {
        console.log(rating)
        return (
          <div class="col-3 p-0">
            <h6>{rating.name}</h6>
            <span>{rating.value}</span>
          </div>

        );
      })
    }
  }
  render() {
    if (this.props.product) {
      const {
        product: {
          id,
        investor,
        product_code,
        max_credit_amount,
        min_credit_amount,
        industries,
        status,
        min_time_duration,
        max_time_duration,
        product_title,
        service,
        states,
        ratings, County
        }
      } = this.props.product;
      console.log('detail', this.props.product.product);
      return (
        <Fragment>
          <div className="content-head">
            <div className="content-head-left">
              {/* <h1 className="content-head__title">Produktdetail</h1> */}
              <Translate content='label.Produktdetail' component="h1" className="content-head__title" />
            </div>
            <div className="content-head-right">
              <Link to={{
                pathname: '/edit-product',
                state: { id: id }
              }}
                className="btn btn-primary"
              >
                <Translate content='button.Produktbearbeiten' />

              </Link>
            </div>
          </div>
          <div class="content-body credit-request">
            <div class="d-flex">
              <div class="col-lg-12 col-xl-8">
                <div class="row justify-content-between w-100">
                  <div class="col-3 p-0">
                    {/* <h6>Product Title</h6> */}
                    <Translate content='label.producttitle' component="h6" />
                    <a href="#">{product_title}</a>
                  </div>
                  <div class="col-3 p-0">
                    <Translate content='label.service' component="h6" />
                    <a >{service ? service.name : null} </a>
                  </div>
                  <div class="col-3 p-0">
                    <Translate content='label.state' component="h6" />
                    <a >{states ? this.listStates(states) : null}</a>
                  </div>
                  <div class="col-3 p-0">
                    {/* <Translate content='label.state' component="h6" /> */}
                    <h6>County</h6>
                    <a >{states ? this.listStates(County) : null}</a>
                  </div>
                  <div class="col-3 p-0">
                    <Translate content='label.industries' component="h6" />
                    <div class="d-flex flex-wrap justify-content-between flex-column">
                      {industries ? this.listIndustries(industries) : null}
                    </div>
                  </div>

                </div>


                <div class="row justify-content-between w-100 mt-3">
                  {ratings ? this.listRating(ratings) : null}
                </div>
              </div>
              <div class="col-lg-12 col-xl-4 rightbar">
                <div class="amount">
                  {/* <h6>Max Credit Amount</h6> */}
                  <Translate content='label.maxcredit' component="h6" />
                  <h2>€{max_credit_amount}</h2>
                </div>
                <div class="amount">
                  {/* <h6>Max Credit Amount</h6> */}
                  {/* <h6>Mindestkreditbetrag</h6> */}
                  <Translate content='column.minimum_credit_amount' component="h6" />

                  <h2>€{min_credit_amount}</h2>
                </div>

                <div class="date mt-5">
                  {/* <h6>Time Duration</h6> */}
                  <Translate content='column.minduration' component="h6" />
                  <a href="#">{min_time_duration} <Translate content='label.months' /> </a>
                </div>
                <div class="date mt-5">
                  {/* <h6>Time Duration</h6> */}
                  <Translate content='column.maxduration' component="h6" />
                  <a href="#">{max_time_duration} <Translate content='label.months' /> </a>
                </div>
              </div>
            </div>
            <div class="attachments">
              {/* <h4>Attachments</h4> */}
              <Translate content='label.attachments' component="h6" />
              <div class="file mb-2">
                <span class="file-name">tax payer investment.docx</span>
                <span class="ml-4 file-size">400.5kb</span>
              </div>
              <div class="file">
                <span class="file-name">investment agreement.pdf</span>
                <span class="ml-4 file-size">322.2kb</span>
              </div>
            </div>
            {id ? <RequestedByList id={id} name={product_title} /> : null}
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
