import React, { Component, Fragment } from 'react';
import Subheader from '../general/Subheader';
import Translate from 'react-translate-component';
import * as actions from '../../actions/product';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Pagination from '../general/Pagination';
import AnimatedCard from '../general/AnimatedCard';
import { motion } from 'framer-motion';
import { ToEuro } from '../general/CurrencyFormatter';
const Translator = require('react-translate-component');
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
            <td>{product.service.name ? product.service.name[Translator.getLocale()]: <Translate content="placeholder.notAvailable"/> }</td>

            <td>
              {product.industries.map((industry, index) => {
                  if (index < 2) {
                    return index === 0 ? (
                      <span>{industry.name ? industry.name[Translator.getLocale()] : <Translate content="placeholder.notAvailable"/>}</span>
                    ) : (
                      <Link
                        to={{
                          pathname: `/product`,
                          state: { id: product.id }
                        }}
                      >
                        &nbsp;...
                      </Link>
                    );
                  }
                  return null;
              })}
            </td>
            <td>{product.min_time_duration} Monate</td>
            <td>{product.max_time_duration} Monate</td>

            <td><ToEuro amount={product.min_credit_amount} /></td>
            <td><ToEuro amount={product.max_credit_amount} /></td>
            <td>
              {product.status === 'requested' ? <span className="badge badge-warning"><Translate content='label.requested' /></span> : null}
              {product.status === 'approved' ? <span className="badge badge-success"><Translate content='label.approved' /></span> : null}
              {product.status === 'rejected' ? <span className="badge badge-danger"><Translate content='label.rejected' /></span> : null}
              {product.status === 'invested' ? <span className="badge badge-danger"><Translate content='label.invested' /></span> : null}
              {product.status === 'open' ? <span className="badge badge-info"><Translate content='label.open' /></span> : null}
              {product.status === 'postponed' ? <span className="badge badge-secondary"><Translate content='label.postponed' /></span> : null}
              {product.status === 'deleted' ? <span className="badge badge-light"><Translate content='label.deleted' /></span> : null}
              {product.status === 'suspended' ? <span className="badge badge-info"><Translate content='label.suspended' /></span> : null}
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
    const products =
      this.props.data &&
      this.props.data.productsList &&
      this.props.data.productsList.data
        ? this.props.data.productsList.data
        : [];
    const statusCounts = products.reduce(
      (acc, product) => {
        acc.total += 1;
        if (product.status) {
          acc[product.status] = (acc[product.status] || 0) + 1;
        }
        return acc;
      },
      {
        total: 0,
        open: 0,
        approved: 0,
        invested: 0,
        requested: 0,
        suspended: 0
      }
    );
    const summaryItems = [
      { key: 'total', label: <Translate content="summary.totalProducts" />, value: statusCounts.total, tone: 'neutral' },
      { key: 'open', label: <Translate content="summary.openProducts" />, value: statusCounts.open, tone: 'info' },
      { key: 'approved', label: <Translate content="summary.approvedProducts" />, value: statusCounts.approved, tone: 'success' },
      { key: 'requested', label: <Translate content="summary.requestedProducts" />, value: statusCounts.requested, tone: 'warning' }
    ];
    return (
      <Fragment>
        <Subheader
          heading={<Translate content='label.allproducts' />}
          subtitle={<Translate content="summary.productsSubtitle" />}
          actions={
            <Link className="btn btn-primary" to="/add-product">
              <Translate content="button.addnewproduct" />
            </Link>
          }
        />
        <div className="summary-grid">
          {summaryItems.map((item, index) => {
            const percentage = statusCounts.total
              ? Math.round((item.value / statusCounts.total) * 100)
              : 0;
            return (
              <AnimatedCard
                key={item.key}
                className={`summary-card summary-card--${item.tone}`}
                delay={index * 0.04}
              >
                <span className="summary-label">{item.label}</span>
                <span className="summary-value">{item.value}</span>
                <div className="summary-meter" aria-hidden="true">
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                </div>
              </AnimatedCard>
            );
          })}
        </div>
        <form
          className="filter-bar"
          onSubmit={(e) => {
            e.preventDefault();
            this.props.getProductsList(
              this.props.pagination.currentPage,
              this.state.status,
              this.state.product_title
            );
          }}
        >
          <div className="filter-group">
            <label className="filter-label" htmlFor="product-status">
              <Translate content="summary.filterStatus" />
            </label>
            <select
              id="product-status"
              className="form-control"
              onChange={e => this.setState({ status: e.target.value })}
            >
              <option value="" >Alle</option>
              <option value="approved">Approved</option>
              <option value="invested">Invested</option>
              <option value="requested">Requested</option>
              <option value="suspended">Suspended</option>
              <option value="canceled">Canceled</option>
              <option value="expired">Expired</option>

            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label" htmlFor="product-search">
              <Translate content="summary.filterSearch" />
            </label>
            <input
              id="product-search"
              className="form-control"
              placeholder="Suche"
              aria-label="Search"
              value={this.state.product_title}
              onChange={e => this.setState({ product_title: e.target.value })}
            />
          </div>
          <div className="filter-actions">
            <Translate
              content="button.search"
              component="button"
              type="submit"
              className="btn btn-primary"
            />
          </div>
        </form>
        <AnimatedCard className="content-body">
          <table className="table tablesaw-stack" data-tablesaw-mode="swipe" data-tablesaw-minimap="data-tablesaw-minimap">
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

                  <Translate content="column.minimum_balance" />
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
        </AnimatedCard>
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
