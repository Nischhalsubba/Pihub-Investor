import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Subheader from '../general/Subheader';
import { getCreditRequestList } from '../../actions/credits';
import Pagination from '../general/Pagination';
class ListCreditRequests extends Component {
  componentDidMount() {
    this.props.getCreditRequestList(1);
  }

  renderData = data => {
    if (data.length === 0) {
      return <span>You dont have any credit requests yet</span>;
    }
    return data.map((product, index) => {
      let date = new Date(product.requested_on);
      return (
        <tr key={index}>
          <td>
            {' '}
            <Link to={{ pathname: '/product', state: { id: product.id } }}>
              {product.product_name}
            </Link>
          </td>
          <td>
            <Link>{product.region_of_interest}</Link>
          </td>
          <td class="text-right-piehub-table">{`${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`}</td>
          <td class="text-right-piehub-table">{product.number_of_request}</td>
          <td class="text-right-piehub-table font-weight-bold">
            ${product.total_budget}
          </td>
        </tr>
      );
    });
  };
  render() {
    if (this.props.list) {
      const {
        creditRequests: { data }
      } = this.props.list;

      return (
        <Fragment>
          <Subheader heading="Credit Request" />
          <div class="content-body">
            <table
              class="table tablesaw-stack"
              data-tablesaw-mode="stack"
              data-tablesaw-minimap="data-tablesaw-minimap"
            >
              <thead>
                <tr>
                  <th data-tablesaw-sortable-col="data-tablesaw-sortable-col">
                    Product Name
                  </th>
                  <th
                    data-tablesaw-sortable-col="data-tablesaw-sortable-col"
                    data-tablesaw-priority="persist"
                    scope="col"
                  >
                    Region of interest
                  </th>
                  <th
                    class="text-right-piehub-table"
                    data-tablesaw-sortable-col="data-tablesaw-sortable-col"
                    scope="col"
                  >
                    Created on
                  </th>
                  <th
                    class="text-right-piehub-table"
                    data-tablesaw-sortable-col="data-tablesaw-sortable-col"
                    scope="col"
                  >
                    Numbers of Request
                  </th>
                  <th
                    class="text-right-piehub-table"
                    data-tablesaw-sortable-col="data-tablesaw-sortable-col"
                    scope="col"
                  >
                    Total Budget
                  </th>
                </tr>
              </thead>
              <tbody>{this.renderData(data)}</tbody>
            </table>
            <Pagination url="creditRequest" />
          </div>
        </Fragment>
      );
    } else {
      return <span>Just a second</span>;
    }
  }
}
function mapStateToProps(state) {
  return { list: state.creditRequests };
}
export default connect(
  mapStateToProps,
  { getCreditRequestList }
)(ListCreditRequests);
