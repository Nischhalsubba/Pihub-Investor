import React, { Component, Fragment } from 'react';
import Subheader from '../general/Subheader';
import Translate from 'react-translate-component';
import * as actions from '../../actions/product';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Pagination from '../general/Pagination';
class ProductsList extends Component {
  state = { status: null, product_title: '' }
  componentDidMount() {
    this.props.getProductsList();
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.status !== this.state.status) {
      this.props.getProductsList(this.props.pagination.currentPage, this.state.status)
    }

  }

  renderList = productsObject => {
    if (productsObject && productsObject.productsList.data.length > 0) {
      let products = productsObject.productsList.data;
      return products.map((product, index) => {
        console.log(product)
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
            <td>{product.service.name}</td>

            <td>
              {product.industries.map((industry, index) => {
                return <span>{industry.name}</span>
              })}
            </td>
            <td>{product.min_time_duration} Monate</td>
            <td>{product.max_time_duration} Monate</td>

            <td>€{product.min_credit_amount}</td>
            <td>€{product.max_credit_amount}</td>
            <td>
              {product.status === 'requested' ? <span className="badge badge-warning"><Translate content='label.requested' /></span> : null}
              {product.status === 'approved' ? <span className="badge badge-success"><Translate content='label.approved' /></span> : null}
              {product.status === 'rejected' ? <span className="badge badge-danger"><Translate content='label.rejected' /></span> : null}
              {product.status === 'invested' ? <span className="badge badge-danger"><Translate content='label.invested' /></span> : null}
            </td>

          </tr>
        );
      });
    } else {
      /*@todo handle empty conditions properly with designed layout*/
      return (
        <tr>
          <td>
            {/* You do not have any products yet! */}
            <Translate content='label.youdonot' />
          </td>
        </tr>
      );
    }
  };

  render() {
    const { totalPage } = this.props.pagination;
    return (
      <Fragment>
        <Subheader
          heading={<Translate content='label.allproducts' />}
          buttonLabel={<Translate content='button.addnewproduct' />}
          link="/add-product"
        />
        <form class="form-inline my-2 my-lg-0">

          <select className="form-control mr-sm-2" onChange={e => this.setState({ status: e.target.value })}>
            <option value="" >Alle</option>
            <option value="approved">Approved</option>
            <option value="invested">Invested</option>
            <option value="requested">Requested</option>
            <option value="suspended">Suspended</option>
            <option value="canceled">Canceled</option>
            <option value="expired">Exprired</option>

          </select>
          <input class="form-control mr-sm-2" placeholder="Suche" aria-label="Search"
            value={this.state.product_title}
            onChange={e => this.setState({ product_title: e.target.value })}
          />
          {/* <button >Search</button> */}

          <Translate content='button.search' component="button" className="btn btn-primary mr-sm-2" onClick={(e) => {
            e.preventDefault();
            this.props.getProductsList(this.props.pagination.currentPage, this.state.status, this.state.product_title)
          }
          } />
        </form>
        <div className="content-body">
          <table class="table tablesaw-stack" data-tablesaw-mode="swipe" data-tablesaw-minimap="data-tablesaw-minimap">
            <thead>
              <tr>
                <th>
                  <Translate content="column.name" />
                </th>
                <th>
                  <Translate content="label.service" />
                </th>
                <th>
                  <Translate content="label.industries" />
                </th>
                <th>
                  <Translate content="column.minduration" />
                </th>
                <th>
                  <Translate content="column.maxduration" />
                </th>
                <th>
                  <Translate content="column.minimum_credit_amount" />
                </th>
                <th>

                  <Translate content="column.mindestbetrag" />
                </th>
                <th>
                  <Translate content="column.status" />
                </th>
                {/* <th>
                <Translate content="column.edit" />
                </th> */}
              </tr>
            </thead>
            <tbody>{this.renderList(this.props.data)}</tbody>
          </table>
          <Pagination totalPage={totalPage} url={(page) => this.props.getProductsList(page)} />
        </div>
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return { data: state.productsList, pagination: state.pagination };
}

export default connect(
  mapStateToProps,
  actions
)(ProductsList);
