import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getApplicationList } from '../../actions/application';
import { changeStatus } from '../../actions/changeStatus';
import { Link, withRouter } from 'react-router-dom';
import Translate from 'react-translate-component'
class RequestedByList extends Component {
  state = { list: [] };
  componentDidMount() {
    this.props.getApplicationList(this.props.id);
  }
  componentDidUpdate(prevProps) {
    if (this.props.id !== prevProps.id) {
      this.props.getApplicationList(this.props.id);
    }
    if (prevProps.data !== this.props.data) {
      this.setState({ list: this.props.data.list.data });
    }
  }
  renderListOfRequester = (list, name) => {
    if (list.length === 0) {
      return <span>No one has place in any kind of requests yet</span>;
    }
    return list.map((data, index) => {
      return (
        <tr key={index}>
          <td>
            <Link to={{
              pathname: '/application',
              state: { pId: this.props.id, aId: data.id, product: name }
            }}>{data.application_code}</Link>
          </td>
          <td>
            <Link to={{
              pathname: '/application',
              state: { pId: this.props.id, aId: data.id, product: name }
            }}>
              {data.requested_by}
            </Link>
          </td>
          <td>
            <span>{data.deadline}</span>
          </td>
          <td>
            <span>{data.duration} Months</span>
          </td>
          <td class="text-right-piehub-table font-weight-bold">
            €{data.requested_amount}
          </td>
          <td class="text-right-piehub-table font-weight-bold">
            {data.status === 'rejected' ? <span className="badge badge-warning">Abgelehnt</span> : <span className="badge badge-success">In Bearbeitung</span>}
          </td>

          {
            this.props.errMsg ? (
              <small>
                <font />
                {this.props.errMsg.error}
              </small>
            ) : null
          }
        </tr >
      );
    });
  };
  render() {
    return (
      <div class="requests mt-5">
        {/* <h4>Credit Requests</h4> */}
        <Translate content='label.creditrequests' component="h4" />
        <hr />
        <table
          class="table tablesaw-stack"
          data-tablesaw-mode="stack"
          data-tablesaw-minimap="data-tablesaw-minimap"
        >
          <thead>
            <tr>

              <th data-tablesaw-sortable-col="data-tablesaw-sortable-col">
                <Translate content='label.applicationcode' />
              </th>
              <th data-tablesaw-sortable-col="data-tablesaw-sortable-col">
                Kreditorname
               </th>
              <th
                data-tablesaw-sortable-col="data-tablesaw-sortable-col"
                data-tablesaw-priority="persist"
                scope="col"
              >
                {/* <Translate content='label.deadline' /> */}
                Fristablauf
              </th>
              <th
                data-tablesaw-sortable-col="data-tablesaw-sortable-col"
                data-tablesaw-priority="persist"
                scope="col"
              >
                {/* <Translate content='label.time' /> */}
                Laufzeil
              </th>
              <th
                class="text-right-piehub-table"
                data-tablesaw-sortable-col="data-tablesaw-sortable-col"
                scope="col"
              >
                {/* <Translate content='label.requestedamount' /> */}
                Kreditbetrag
              </th>
              <th
                class="text-right-piehub-table"
                data-tablesaw-sortable-col="data-tablesaw-sortable-col"
                scope="col"
              >
                <Translate content='column.status' />
              </th>
              {/* <th
                class="text-right-piehub-table"
                data-tablesaw-sortable-col="data-tablesaw-sortable-col"
                scope="col"
              >
                <Translate content='label.accept'/>
              </th> */}
            </tr>
          </thead>
          <tbody>{this.renderListOfRequester(this.state.list, this.props.name)}</tbody>
        </table>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return { data: state.applicationList, errMsg: state.error };
}
export default connect(
  mapStateToProps,
  { getApplicationList, changeStatus }
)(withRouter(RequestedByList));
