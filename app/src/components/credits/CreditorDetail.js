import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Field, formValueSelector, reduxForm } from 'redux-form';
import { uploadFile } from '../../actions/uploadFile';
import { creditorDetail } from '../../actions/creditor';
import { downloadToken } from '../../actions/download';
import Translate from 'react-translate-component';
import Spinner from '../general/Spinner';
import * as validation from '../../_utils/validate';
import { renderDropzoneField } from '../../_formFields';
import CreditInfo from './CreditInfo';

const Translator = require('react-translate-component');

class CreditorDetail extends Component {
  state = { detail: null, refresh: false };

  componentDidMount() {
    if (!this.props.location.state) {
      this.props.history.push('/products-invested');
      return;
    }
    this.fetchDetail();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.data !== prevProps.data && this.props.data) {
      this.setState({ detail: this.props.data.detail });
    }
    if (this.state.refresh !== prevState.refresh) this.fetchDetail();
  }

  getIds = () => {
    const state = this.props.location.state || {};
    return {
      pId: state.pId || state.productId,
      aId: state.aId || state.appId
    };
  };

  fetchDetail = () => {
    const { pId, aId } = this.getIds();
    if (pId && aId) this.props.creditorDetail(pId, aId, this.onDetailLoaded);
  };

  onDetailLoaded = () => {
    if (this.props.data) this.setState({ detail: this.props.data.detail });
  };

  onSubmit = formProps => {
    const { pId, aId } = this.getIds();
    this.props.uploadFile(formProps, pId, aId, () => this.setState({ refresh: !this.state.refresh }));
  };

  renderDocs = docs => {
    if (!Array.isArray(docs) || !docs.length) {
      return <div className="detail-empty"><Translate content="column.noattachment" /></div>;
    }

    return docs.map((doc, index) => (
      <button
        className="document-row"
        type="button"
        key={`${doc.path || doc.file_name}-${index}`}
        onClick={() => this.props.downloadToken(doc.path, doc.file_name, doc.file_type)}
      >
        <span className="document-icon" aria-hidden="true"><i className="bx bx-file" /></span>
        <span className="document-copy"><strong>{doc.file_name || `File ${index + 1}`}</strong><small>{doc.file_type || 'Document'}</small></span>
        <i className="bx bx-download document-download" aria-hidden="true" />
      </button>
    ));
  };

  renderSelectedFiles = files => {
    if (!Array.isArray(files) || !files.length) return null;
    return (
      <div className="selected-files" aria-live="polite">
        {files.map((file, index) => <span key={`${file.name}-${index}`}><i className="bx bx-file" aria-hidden="true" />{file.name}</span>)}
      </div>
    );
  };

  render() {
    const detail = this.state.detail;
    const { handleSubmit, files } = this.props;
    const isGerman = Translator.getLocale() === 'de';

    if (!detail) return <div className="data-loading" role="status" aria-live="polite"><Spinner /></div>;

    return (
      <Fragment>
        <CreditInfo location={this.props.location} detail={detail} />

        <section className="investor-files-panel" aria-labelledby="investor-files-title">
          <div className="investor-files-head">
            <div>
              <span>{isGerman ? 'Dokumente' : 'Documents'}</span>
              <h2 id="investor-files-title"><Translate content="label.investorAttachments" /></h2>
              <p>{isGerman ? 'Laden Sie nur Unterlagen hoch, die zu dieser Investitionsposition gehören.' : 'Upload only documents that belong to this invested position.'}</p>
            </div>
          </div>

          <div className="investor-files-layout">
            <form className="investor-upload" onSubmit={handleSubmit(this.onSubmit)}>
              <div className="investor-upload-field">
                <Translate content="label.fileupload" component="label" />
                <Field
                  name="files"
                  component={renderDropzoneField}
                  type="file"
                  validate={validation.required}
                  className="file-uploader file-uploader--small dropzone"
                />
                {this.renderSelectedFiles(files)}
              </div>

              {this.props.errMsg ? <div className="auth-error" role="alert">{this.props.errMsg.errors}</div> : null}

              <Translate content="button.submit" component="button" className="btn btn-primary" type="submit" />
            </form>

            <div className="investor-documents">
              <div className="investor-documents-label">{isGerman ? 'Vorhandene Dateien' : 'Existing files'}</div>
              <div className="document-list">{this.renderDocs(detail.investor_files)}</div>
            </div>
          </div>
        </section>
      </Fragment>
    );
  }
}

CreditorDetail = reduxForm({ form: 'creditorDetail' })(CreditorDetail);

const selector = formValueSelector('creditorDetail');

function mapStateToProps(state) {
  return {
    data: state.creditorDetail,
    files: selector(state, 'files'),
    errMsg: state.error
  };
}

export default connect(mapStateToProps, { uploadFile, downloadToken, creditorDetail })(CreditorDetail);
