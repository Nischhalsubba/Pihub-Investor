import React, { Component, Fragment } from 'react';
import Subheader from '../general/Subheader';
import Translate from 'react-translate-component';
import * as actions from '../../actions/product';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Pagination from '../general/Pagination';
class ProductsList extends Component {
  state = { status: null }
  componentDidMount() {
    this.props.getProductsList();
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.status !== this.state.status) {
      this.props.getProductsList(this.props.pagination.currentPage, this.state.status)
    }
  }
  renderList = productsObject => {
    if (productsObject && productsObject.productsList.data.length > 0) {
      let products = productsObject.productsList.data;
      return products.map((product, index) => {
        return (
          <tr key={product.id}>
            <td>
              <Link
                to={{
                  pathname: `/product`,
                  state: { id: product.id }
                }}
              >
                {product.product_title}
              </Link>
            </td>
            <td>
              {product.industries.map((industry, index) => {
                return <span>{industry.name}</span>
              })}
            </td>
            <td>{product.service}</td>
            <td>{product.time_duration} Months</td>

            <td>{product.min_credit_amount}</td>
            <td>{product.max_credit_amount}</td>
            <td>
              {product.status === 'aproved' ? <span className="badge badge-waiting">{product.status}</span> : <span className="badge badge-warning">{product.status}</span>

              }
            </td>
          </tr>
        );
      });
    } else {
      /*@todo handle empty conditions properly with designed layout*/
      return (
        <tr>
          <td>You do not have any products yet!</td>
        </tr>
      );
    }
  };

  render() {
    const { totalPage } = this.props.pagination;
    return (
      <Fragment>
        <Subheader
          heading="All Products"
          buttonLabel="Add New Product"
          link="/add-product"
        />
        <form class="form-inline my-2 my-lg-0">
          {/* <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>
          <button class="btn btn-primary">Search</button> */}
          <select className="form-control mr-sm-2" onChange={e => this.setState({ status: e.target.value })}>
            <option >Search By Status</option>
            <option value="approved">Approved</option>
            <option value="invested">Invested</option>
            <option value="requested">Requested</option>
            <option value="suspended">Suspended</option>
            <option value="canceled">Canceled</option>
            <option value="expired">Exprired</option>

          </select>
        </form>
        <div className="content-body">
          <table
            className="table tablesaw-stack"
            data-tablesaw-mode="swipe"
            data-tablesaw-minimap="data-tablesaw-minimap"
          >
            <thead>
              <tr>
                <th>
                  <Translate content="column.name" />
                </th>
                <th>
                  <Translate content="column.category" />
                </th>
                <th>
                  Industries
                </th>
                <th>
                  Duration
                </th>
                <th>
                  <Translate content="column.minimum_credit_amount" />
                </th>
                <th>
                  Mindestbetrag
                </th>
                <th>
                  <Translate content="column.status" />
                </th>
              </tr>
            </thead>
            <tbody>{this.renderList(this.props.data)}</tbody>
          </table>
          <Pagination totalPage={totalPage} url={(page) => this.props.getProductsList(page)} />
        </div>
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return { data: state.productsList, pagination: state.pagination };
}

export default connect(
  mapStateToProps,
  actions
)(ProductsList);
