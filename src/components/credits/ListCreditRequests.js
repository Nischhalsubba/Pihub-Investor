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
      return <span>Es wurde noch keine Kreditanfrage gestellt</span>;
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

            <Link to={{ pathname: '/product', state: { id: product.product_id } }}> {product.product_title}</Link>
          </td>
          <td>{product.service}</td>
          <td class="text-right-piehub-table">{`${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`}</td>
          {/* <td class="text-right-piehub-table">{product.number_of_request}</td> */}
          <td class="text-right-piehub-table">{`${deadline.getDate()}-${deadline.getMonth() + 1}-${deadline.getFullYear()}`}</td>
          <td class="text-right-piehub-table font-weight-bold">
            €{product.max_credit_amount || 100000}
          </td>
          <td className="text-right-piehub-table font-weight-bold">
            {product.status === 'offer_sent' ? <span className="status-badge status-badge-awaiting"><Translate content='label.AngebotErstellt' /></span>
              : null}
            {product.status === 'rejected' ? <span className="status-badge status-badge-rejected"><Translate content='label.rejected' /></span>
              : null}
            {product.status === 'open' ? <span className="status-badge status-badge-approved"><Translate content='label.ZuBearbeiten' /></span>
              : null}
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
                    <Translate content='column.creditorsname' />
                    {/* Kreditnehmer */}
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
                    data-tablesaw-sortable-col="data-tablesaw-sortable-col"
                    data-tablesaw-priority="persist"
                    scope="col"
                  >
                    <Translate content='column.services' />
                    {/* Kreditart */}
                  </th>
                  <th
                    class="text-right-piehub-table"
                    data-tablesaw-sortable-col="data-tablesaw-sortable-col"
                    scope="col"
                  >
                    <Translate content='column.createdon' />
                  </th>
                  <th
                    class="text-right-piehub-table"
                    data-tablesaw-sortable-col="data-tablesaw-sortable-col"
                    scope="col"
                  >
                    {/* Fristablauf */}
                    <Translate content='label.deadline' />
                  </th>
                  <th
                    class="text-right-piehub-table"
                    data-tablesaw-sortable-col="data-tablesaw-sortable-col"
                    scope="col"
                  >
                    <Translate content='column.investedamount' />
                    {/* Kreditbetrag */}
                  </th>
                  <th
                    class="text-right-piehub-table"
                    data-tablesaw-sortable-col="data-tablesaw-sortable-col"
                    scope="col"
                  >
                    <Translate content='column.status' />
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
