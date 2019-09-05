import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Subheader from '../general/Subheader';
import { getCreditRequestList } from '../../actions/credits';
import Pagination from '../general/Pagination';
import Spinner from '../general/Spinner';
import Translate from 'react-translate-component'
class ListCreditRequests extends Component {
  componentDidMount() {
    this.props.getCreditRequestList(1);
  }

  renderData = data => {
    if (data.length === 0) {
      return <span>You dont have any credit requests yet</span>;
    }
    return data.map((product, index) => {
      let date = new Date(product.created_on);
      let deadline = new Date(product.deadline);
      return (
        <tr key={index}>
          <td>
            {' '}
            <Link to={{ pathname: '/creditor/detail', state: { id: product.creditor_id } }}>
              {product.creditor_name}
            </Link>
          </td>
          <td>
            {product.product_title}
          </td>
          <td class="text-right-piehub-table">{`${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`}</td>
          <td class="text-right-piehub-table">{product.number_of_request}</td>
          <td class="text-right-piehub-table font-weight-bold">
            ${product.max_credit_amount}
          </td>
          <td class="text-right-piehub-table">{`${deadline.getDate()}-${deadline.getMonth() + 1}-${deadline.getFullYear()}`}</td>
        </tr>
      );
    });
  };
  render() {
    if (this.props.list) {
      const {
        creditRequests: { data }
      } = this.props.list;
      console.log(this.props.list)
      return (
        <Fragment>
          <Subheader heading={<Translate content='label.creditrequests' />} />
          <div class="content-body">
            <table
              class="table tablesaw-stack"
              data-tablesaw-mode="stack"
              data-tablesaw-minimap="data-tablesaw-minimap"
            >
              <thead>
                <tr>
                  <th data-tablesaw-sortable-col="data-tablesaw-sortable-col">
                    {/* <Translate content='column.productname' /> */}
                    Kreditnehmer
                  </th>
                  <th
                    data-tablesaw-sortable-col="data-tablesaw-sortable-col"
                    data-tablesaw-priority="persist"
                    scope="col"
                  >
                    {/* <Translate content='column.industry' /> */}
                    <Translate content='column.productname' />

                  </th>
                  <th
                    class="text-right-piehub-table"
                    data-tablesaw-sortable-col="data-tablesaw-sortable-col"
                    scope="col"
                  >
                    {/* <Translate content='column.createdon' /> */}
                    Bestätigt am
                  </th>
                  <th
                    class="text-right-piehub-table"
                    data-tablesaw-sortable-col="data-tablesaw-sortable-col"
                    scope="col"
                  >
                    {/* <Translate content='column.numberofrequest' /> */}
                  </th>
                  <th
                    class="text-right-piehub-table"
                    data-tablesaw-sortable-col="data-tablesaw-sortable-col"
                    scope="col"
                  >
                    {/* <Translate content='label.maxcredit' /> */}
                    Kreditbetrag
                  </th>
                  <th
                    class="text-right-piehub-table"
                    data-tablesaw-sortable-col="data-tablesaw-sortable-col"
                    scope="col"
                  >
                    Laufzelt
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
      return <Spinner />
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
