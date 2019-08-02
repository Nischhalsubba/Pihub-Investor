import React, { Component, Fragment } from 'react';
import Subheader from '../general/Subheader';
class ProductList extends Component {
  render() {
    return (
      <Fragment>
        <Subheader heading="All Products" buttonLabel="Add New Product" />
        <div className="content-body">
          <table
            className="table tablesaw-stack"
            data-tablesaw-mode="swipe"
            data-tablesaw-minimap="data-tablesaw-minimap"
          >
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Interest</th>
                <th>Minimum Credit Amount</th>
                <th>Available Credit Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {' '}
                  <a href="">IT Investment</a>
                </td>
                <td>
                  <a href="">Health and personal care</a>
                </td>
                <td>10%</td>
                <td>$7186</td>
                <td>$233456</td>
                <td>
                  {' '}
                  <span className="badge badge-warning">Awaiting Approval</span>
                </td>
              </tr>
              <tr>
                <td>
                  {' '}
                  <a href="">IT Investment</a>
                </td>
                <td>
                  <a href="">Health and personal care</a>
                </td>
                <td>10%</td>
                <td>$7186</td>
                <td>$233456</td>
                <td>
                  {' '}
                  <span className="badge badge-warning">Awaiting Approval</span>
                </td>
              </tr>
              <tr>
                <td>
                  {' '}
                  <a href="">IT Investment</a>
                </td>
                <td>
                  <a href="">Health and personal care</a>
                </td>
                <td>10%</td>
                <td>$7186</td>
                <td>$233456</td>
                <td>
                  {' '}
                  <span className="badge badge-warning">Awaiting Approval</span>
                </td>
              </tr>
              <tr>
                <td>
                  {' '}
                  <a href="">IT Investment</a>
                </td>
                <td>
                  <a href="">Health and personal care</a>
                </td>
                <td>10%</td>
                <td>$7186</td>
                <td>$233456</td>
                <td>
                  {' '}
                  <span className="badge badge-warning">Awaiting Approval</span>
                </td>
              </tr>
              <tr>
                <td>
                  {' '}
                  <a href="">IT Investment</a>
                </td>
                <td>
                  <a href="">Health and personal care</a>
                </td>
                <td>10%</td>
                <td>$7186</td>
                <td>$233456</td>
                <td>
                  {' '}
                  <span className="badge badge-warning">Awaiting Approval</span>
                </td>
              </tr>
              <tr>
                <td>
                  {' '}
                  <a href="">IT Investment</a>
                </td>
                <td>
                  <a href="">Health and personal care</a>
                </td>
                <td>10%</td>
                <td>$7186</td>
                <td>$233456</td>
                <td>
                  {' '}
                  <span className="badge badge-warning">Awaiting Approval</span>
                </td>
              </tr>
              <tr>
                <td>
                  {' '}
                  <a href="">IT Investment</a>
                </td>
                <td>
                  <a href="">Health and personal care</a>
                </td>
                <td>10%</td>
                <td>$7186</td>
                <td>$233456</td>
                <td>
                  {' '}
                  <span className="badge badge-success">Approved</span>
                </td>
              </tr>
              <tr>
                <td>
                  {' '}
                  <a href="">IT Investment</a>
                </td>
                <td>
                  <a href="">Health and personal care</a>
                </td>
                <td>10%</td>
                <td>$7186</td>
                <td>$233456</td>
                <td>
                  {' '}
                  <span className="badge badge-danger">Rejected</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Fragment>
    );
  }
}

export default ProductList;
