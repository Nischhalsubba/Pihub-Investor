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
                  Industries
                </th>
                <th>
                  Duration
                </th>
                <th>
                  <Translate content="column.minimum_credit_amount" />
                </th>
                <th>
                  Maximum Credit Amount
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
