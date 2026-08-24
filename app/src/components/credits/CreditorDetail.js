import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { uploadFile } from '../../actions/uploadFile';
import { creditorDetail } from '../../actions/creditor';
import { downloadToken } from '../../actions/download';
import Translate from '../../i18n/Translate';
import Spinner from '../general/Spinner';
import CreditInfo from './CreditInfo';

import Translator from '../../i18n/Translate';
const MAX_FILE_SIZE = 8 * 1024 * 1024;
const ALLOWED_TYPES = ['application/pdf', 'image/png', 'image/jpeg'];

class CreditorDetail extends Component {
  state = { detail: null, refresh: false, files: [], fileError: '', submitting: false };

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

  handleFiles = event => {
    const files = Array.from(event.target.files || []);
    const invalid = files.find(file => !ALLOWED_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE);
    if (invalid) {
      this.setState({ files: [], fileError: `${invalid.name} must be a PDF, PNG or JPG no larger than 8 MB.` });
      event.target.value = '';
      return;
    }
    this.setState({ files, fileError: '' });
  };

  onSubmit = async event => {
    event.preventDefault();
    if (!this.state.files.length) {
      this.setState({ fileError: 'Choose at least one file to upload.' });
      return;
    }
    const { pId, aId } = this.getIds();
    this.setState({ submitting: true, fileError: '' });
    const ok = await this.props.uploadFile({ files: this.state.files }, pId, aId, () => {
      this.setState(state => ({ files: [], refresh: !state.refresh }));
    });
    this.setState({ submitting: false });
    if (!ok) this.setState({ fileError: 'The upload could not be completed. Your selected files remain available to retry.' });
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

  renderSelectedFiles = () => {
    if (!this.state.files.length) return null;
    return (
      <div className="selected-files" aria-live="polite">
        {this.state.files.map((file, index) => <span key={`${file.name}-${index}`}><i className="bx bx-file" aria-hidden="true" />{file.name}</span>)}
      </div>
    );
  };

  render() {
    const detail = this.state.detail;
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
            <form className="investor-upload" onSubmit={this.onSubmit} noValidate>
              <div className="investor-upload-field">
                <label htmlFor="investor-file-upload"><Translate content="label.fileupload" /></label>
                <input
                  id="investor-file-upload"
                  className="form-control"
                  type="file"
                  multiple
                  accept="application/pdf,image/png,image/jpeg,.pdf,.png,.jpg,.jpeg"
                  onChange={this.handleFiles}
                  aria-describedby="investor-file-help investor-file-error"
                />
                <small id="investor-file-help">PDF, PNG or JPG, up to 8 MB per file. Upload only documents appropriate for this position.</small>
                {this.renderSelectedFiles()}
                {this.state.fileError ? <span className="field-error" id="investor-file-error" role="alert">{this.state.fileError}</span> : null}
              </div>

              {this.props.errMsg ? <div className="auth-error" role="alert">{typeof this.props.errMsg === 'string' ? this.props.errMsg : 'The upload could not be completed.'}</div> : null}

              <button className="btn btn-primary" type="submit" disabled={this.state.submitting}>
                {this.state.submitting ? (isGerman ? 'WIRD HOCHGELADEN…' : 'UPLOADING…') : (isGerman ? 'HOCHLADEN' : 'UPLOAD FILES')}
              </button>
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

function mapStateToProps(state) {
  return {
    data: state.creditorDetail,
    errMsg: state.errors
  };
}

export default connect(mapStateToProps, { uploadFile, downloadToken, creditorDetail })(CreditorDetail);
