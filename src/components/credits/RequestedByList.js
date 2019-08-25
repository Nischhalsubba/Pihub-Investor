import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getProductsList } from '../../actions/product';
import { changeStatus } from '../../actions/changeStatus';

class RequestedByList extends Component {
  state = { list: [] };
  componentDidMount() {
    this.props.getProductsList();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.setState({ list: this.props.data.productsList.data });
    }
  }
  renderListOfRequester = list => {
    if (list.length === 0) {
      return <span>No one has place in any kind of requests yet</span>;
    }
    return list.map((data, index) => {
      return (
        <tr key={index}>
          <td>
            {' '}
            <a href="">{data.investor}</a>
          </td>
          <td>
            <a href="">{data.valid_from}</a>
          </td>
          <td class="text-right-piehub-table font-weight-bold">
            ${data.min_credit_amount}
          </td>
          <td class="text-right-piehub-table">
            <span
              class="mr-1"
              onClick={() => this.props.changeStatus(data.id, 'accepted')}
            >
              <img src="assets/img/icons/bx-check-circle.svg" alt="accepted" />
            </span>
            <span onClick={() => this.props.changeStatus(data.id, 'rejected')}>
              {' '}
              <img src="assets/img/icons/bx-x-circle.svg" alt="rejected" />
            </span>
          </td>
          {this.props.errMsg ? (
            <small>
              <font />
              {this.props.errMsg.error}
            </small>
          ) : null}
        </tr>
      );
    });
  };
  render() {
    return (
      <div class="requests mt-5">
        <h4>Credit Requests</h4>
        <hr />
        <table
          class="table tablesaw-stack"
          data-tablesaw-mode="stack"
          data-tablesaw-minimap="data-tablesaw-minimap"
        >
          <thead>
            <tr>
              <th data-tablesaw-sortable-col="data-tablesaw-sortable-col">
                Requested By
              </th>
              <th
                data-tablesaw-sortable-col="data-tablesaw-sortable-col"
                data-tablesaw-priority="persist"
                scope="col"
              >
                Requested On
              </th>
              <th
                class="text-right-piehub-table"
                data-tablesaw-sortable-col="data-tablesaw-sortable-col"
                scope="col"
              >
                Requested Amount
              </th>
              <th
                class="text-right-piehub-table"
                data-tablesaw-sortable-col="data-tablesaw-sortable-col"
                scope="col"
              >
                Accept/Decline
              </th>
            </tr>
          </thead>
          <tbody>{this.renderListOfRequester(this.state.list)}</tbody>
        </table>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return { data: state.productsList, errMsg: state.error };
}
export default connect(
  mapStateToProps,
  { getProductsList, changeStatus }
)(RequestedByList);
