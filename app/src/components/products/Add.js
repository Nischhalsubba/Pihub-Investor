import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Subheader from '../general/Subheader';
import OpportunityForm from './OpportunityForm';
import { addProduct } from '../../actions/product';
import { clearError } from '../../actions/clearError';

class AddProduct extends Component {
  componentDidMount() {
    this.props.clearError();
  }

  handleCommit = (values, onProgress) => this.props.addProduct(
    values,
    () => this.props.history.push('/products'),
    onProgress
  );

  render() {
    return (
      <Fragment>
        <Subheader heading="Add opportunity" description="Register an investable opportunity with exact underwriting parameters and supporting evidence." />
        <OpportunityForm mode="create" onCommit={this.handleCommit} />
      </Fragment>
    );
  }
}

export default connect(null, { addProduct, clearError })(AddProduct);
