import React, { Component, Fragment } from 'react';
import Subheader from '../general/Subheader';
import Translate from 'react-translate-component';
import * as actions from '../../actions/product';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class ProductsList extends Component {
  componentDidMount() {
    this.props.getProductsList();
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
                {product.product_code}
              </Link>
            </td>
            <td>
              <a href="">{product.investor}</a>
            </td>
            <td>10%</td>
            <td>{product.min_credit_amount}</td>
            <td>{product.amount}</td>
            <td>
              {' '}
              <span className="badge badge-warning">{product.status}</span>
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
    console.log('pr', this.props.data);
    return (
      <Fragment>
        <Subheader
          heading="All Products"
          buttonLabel="Add New Product"
          link="/add-product"
        />
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
                  <Translate content="column.interest" />
                </th>
                <th>
                  <Translate content="column.minimum_credit_amount" />
                </th>
                <th>
                  <Translate content="column.available_credit_amount" />
                </th>
                <th>
                  <Translate content="column.status" />
                </th>
              </tr>
            </thead>
            <tbody>{this.renderList(this.props.data)}</tbody>
          </table>
        </div>
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return { data: state.productsList };
}

export default connect(
  mapStateToProps,
  actions
)(ProductsList);
