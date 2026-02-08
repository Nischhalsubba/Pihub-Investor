import React, { Component, Fragment } from 'react';
import Subheader from './../general/Subheader';
import Translate from 'react-translate-component'
class AppliedList extends Component {
  render() {
    return (
      <Fragment>
        <Subheader heading={<Translate content='label.productswithapplication' />}/>
        <div className="content-body">
          <table
            className="table tablesaw-stack"
            data-tablesaw-mode="swipe"
            data-tablesaw-minimap="data-tablesaw-minimap"
          >
            <thead>
              <tr>
                <th><Translate content='column.name' /></th>
                <th><Translate content='column.category' /></th>
                <th><Translate content='column.interest' /></th>
                <th><Translate content='label.mincredit' /></th>
                <th><Translate content='column.available_credit_amount' /></th>
                <th><Translate content='column.status' /></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {' '}
                  <span>IT Investment</span>
                </td>
                <td>
                  <span>Health and personal care</span>
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
                  <span>IT Investment</span>
                </td>
                <td>
                  <span>Health and personal care</span>
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
                  <span>IT Investment</span>
                </td>
                <td>
                  <span>Health and personal care</span>
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
                  <span>IT Investment</span>
                </td>
                <td>
                  <span>Health and personal care</span>
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
                  <span>IT Investment</span>
                </td>
                <td>
                  <span>Health and personal care</span>
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
                  <span>IT Investment</span>
                </td>
                <td>
                  <span>Health and personal care</span>
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
                  <span>IT Investment</span>
                </td>
                <td>
                  <span>Health and personal care</span>
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
                  <span>IT Investment</span>
                </td>
                <td>
                  <span>Health and personal care</span>
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

export default AppliedList;
