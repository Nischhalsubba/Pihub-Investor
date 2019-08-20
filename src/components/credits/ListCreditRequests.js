import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Subheader from '../general/Subheader';
import { getCreditRequestList } from '../../actions/credits';
class ListCreditRequests extends Component {
  componentDidMount() {
    this.props.getCreditRequestList(1);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.list !== this.props.list) {
      console.log('data arrived', this.props.list.creditRequests.data);
    }
  }
  renderData = data => {
    if (data.length === 0) {
      return <span>You dont have any credit requests yet</span>;
    }
    return (
      <tr>
        <td>
          {' '}
          <a href="">Reprehenderit Marshall</a>
        </td>
        <td>
          <a href="">Health and personal care</a>
        </td>
        <td class="text-right-piehub-table">07/04/1927</td>
        <td class="text-right-piehub-table">2</td>
        <td class="text-right-piehub-table font-weight-bold">$238638</td>
      </tr>
    );
  };
  render() {
    if (this.props.list) {
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
              <tbody>
                {this.renderData(this.props.list.creditRequests.data)}
              </tbody>
            </table>
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
