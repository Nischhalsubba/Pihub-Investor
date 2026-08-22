import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Subheader from '../general/Subheader';
import Spinner from '../general/Spinner';
import OpportunityForm from './OpportunityForm';
import { getProductById, updateProduct } from '../../actions/product';
import { clearError } from '../../actions/clearError';

class EditProduct extends Component {
  componentDidMount() {
    const productId = this.getProductId();
    if (!productId) {
      this.props.history.replace('/products');
      return;
    }
    this.props.clearError();
    this.props.getProductById(productId);
  }

  getProductId = () => {
    const routeId = this.props.match && this.props.match.params && this.props.match.params.productId;
    const stateId = this.props.location && this.props.location.state && this.props.location.state.id;
    return routeId || stateId || null;
  };

  handleCommit = (values, onProgress) => {
    const productId = this.getProductId();
    return this.props.updateProduct(
      values,
      productId,
      () => this.props.history.push(`/opportunities/${encodeURIComponent(productId)}`),
      onProgress
    );
  };

  render() {
    const productId = this.getProductId();
    const product = this.props.product;
    if (!product || !product.id || String(product.id) !== String(productId)) {
      return <div className="data-loading" role="status" aria-live="polite"><Spinner /></div>;
    }

    return (
      <Fragment>
        <Subheader heading="Edit opportunity" description="Update screening parameters carefully; changes affect how this opportunity is evaluated and surfaced." />
        <OpportunityForm mode="edit" productId={productId} initialValues={product} onCommit={this.handleCommit} />
      </Fragment>
    );
  }
}

export default connect(
  state => ({ product: state.singleProduct && state.singleProduct.product }),
  { getProductById, updateProduct, clearError }
)(EditProduct);
