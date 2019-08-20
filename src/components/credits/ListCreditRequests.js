import React, { Component, Fragment } from 'react';
import Subheader from '../general/Subheader';
class ListCreditRequests extends Component {
  renderData = data => {
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
            <tbody>{this.renderData()}</tbody>
          </table>
        </div>
      </Fragment>
    );
  }
}

export default ListCreditRequests;
