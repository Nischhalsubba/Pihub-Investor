import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {Field, formValueSelector, reduxForm} from 'redux-form';
import {uploadFile} from '../../actions/uploadFile'
import {getCreditor, creditorDetail} from '../../actions/creditor';
import {downloadToken} from '../../actions/download';
import Translate from 'react-translate-component';
import Spinner from '../general/Spinner'
import * as validation from '../../_utils/validate';
import {renderDropzoneField} from '../../_formFields';
import {ToEuro} from '../general/CurrencyFormatter';
import CreditInfo from './CreditInfo';

class CreditorDetail extends Component {
    state = {detail: null, refresh: false}

    componentDidMount() {
        if (!this.props.location.state) {
            return this.props.history.push('/products-invested')
        }
        let {pId, aId} = this.props.location.state;
        if (!pId || !aId) {
            const {appId,productId} = this.props.location.state;
            pId = productId;
            aId = appId;
        }
        this.props.creditorDetail(pId, aId, this.callback);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.data !== prevProps.data) {
            this.setState({detail: this.props.data.detail})
        }
        if (this.state.refresh !== prevState.refresh) {
            this.props.creditorDetail(this.props.location.state.pId, this.props.location.state.aId, this.callback);
        }
    }

    callback = () => {
        this.setState({detail: this.props.data.detail})

    }
    onSubmit = formProps => {

        this.props.uploadFile(formProps, this.props.location.state.pId, this.props.location.state.aId, () => {
            this.setState({refresh: !this.state.refresh})
        })

    };
    renderDocs = docs => {
        if (docs.length === 0) {
            return <span><Translate content='column.noattachment'/></span>
        } else {
            return docs.map((doc, index) => {
                return (
                    <div class="file mb-2">
                        <span class="file-name">{doc.file_name}</span>
                        <span class="ml-4 file-size">FileType: {doc.file_type}</span>
                        <button className='btn btn-link' onClick={() => this.props.downloadToken(doc.path)}><Translate
                            content='button.download'/></button>
                    </div>
                );
            })
        }
    }

    displayFiles = files => {
        return files.map((file, index) => {
            return <span key={index}>{file.name} <br/></span>
        })
    }

    render() {
        const {files} = this.props;
        if (this.state.detail) {
            console.log('details', this.state.detail)
            const {handleSubmit} = this.props;
            return (
                <Fragment>
                    <div class="content-body credit-request">

                        <form className="form-signup" onSubmit={handleSubmit(this.onSubmit)}>
                            <CreditInfo location={this.props.location}/>
                            <div className="row mt-4">
                                <div className="col">
                                    <div className="form-group">
                                        <Translate content='label.fileupload' component="label" className="d-block"/>
                                        <Field
                                            name="files"
                                            component={renderDropzoneField}
                                            type="file"
                                            validate={validation.required}
                                        />
                                        {files ? this.displayFiles(files) : null}
                                        {this.state.detail.investor_files ? this.renderDocs(this.state.detail.investor_files): '' }
                                    </div>
                                </div>
                            </div>
                            {this.props.errMsg ? (
                                <small>
                                    <font color="red">{this.props.errMsg.errors}</font>
                                </small>
                            ) : null}
                            <div className="row mt-4">
                                <div className="col">
                                    <Translate content='button.submit' component="button"
                                               className="btn btn-primary btn-form" type="submit"/>
                                </div>
                            </div>
                        </form>
                    </div>
                </Fragment>
            );
        } else {
            return <Spinner/>
        }

    }


}

function mapStateToProps(state) {
    return {data: state.creditorDetail}
}

CreditorDetail = reduxForm({
    form: 'creditorDetail'
})(CreditorDetail);

const selector = formValueSelector('creditorDetail');
CreditorDetail = connect(state => {
    const files = selector(state, 'files')
    return {
        files
    };
})(CreditorDetail);
export default connect(mapStateToProps, {getCreditor, uploadFile, downloadToken, creditorDetail})(CreditorDetail);
