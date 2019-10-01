import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import Subheader from '../general/Subheader';
import {getApplicationDetail} from '../../actions/application';
import Translate from 'react-translate-component';
import {changeStatus} from '../../actions/changeStatus';
import {ToEuro} from "../general/CurrencyFormatter";
import {dDigit} from '../../_utils/misc'
import {matchesInvestorStatus} from "../../_status";
import {downloadToken} from '../../actions/download';

class DetailCreditRequest extends Component {
    state = {detail: null, refresh: false}

    componentDidMount() {
        if (!this.props.location.state) {
            return this.props.history.push('/products')
        }
        let {pId, aId} = this.props.location.state;
        if (!pId || !aId) {
            const {appId,productId} = this.props.location.state;
            pId = productId;
            aId = appId;
        }
        this.props.getApplicationDetail(pId, aId);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.data !== prevProps.data) {
            this.setState({detail: this.props.data.detail})
        }
        if (this.state.refresh !== prevState.refresh) {
            const {pId, aId} = this.props.location.state;
            this.props.getApplicationDetail(pId, aId);
        }
    }

    renderDocs = docs => {
        if (docs.length === 0) {
            return <span><Translate content='column.noattachment'/></span>
        } else {
            return docs.map((doc, index) => {
                return (
                    <div className="file mb-2">
                        <span className="file-name">{doc.file_name}</span>
                        <span className="ml-4 file-size">FileType: {doc.file_type}</span>
                        <button className='btn btn-link' onClick={() => this.props.downloadToken(doc.path)}><Translate
                            content='button.download'/></button>
                    </div>
                );
            })
        }
    }

    /**
     * Loop through collection to show objects display properties
     **/
    showCollections = collection => {
        if (collection.length === 0) {
            return <div>Not Available</div>
        } else {
            return collection.map((object, index) => {
                return <span key={index}>{object.name} <br/></span>
            })
        }
    }

    showNameValuePair = (arrayOfObjects) => {
        if (arrayOfObjects.length === 0) {
            return <p className="product__info">Not available</p>
        } else {
            return arrayOfObjects.map((object, index) => {
                return <div className="col-3 col-md-6 col-sm-12 col-lg-3 p-0">
                    <h6 >{object.name}</h6>
                    <p >{object.value}</p>
                </div>
            })
        }

    }
    changeStatus = status => {
        const {pId, aId} = this.props.location.state;

        this.props.changeStatus(pId, aId, status, () => this.setState({refresh: !this.state.refresh}))
    }

    render() {
        if (this.state.detail) {
            const {
                requested_by,
                requested_on,
                amount,
                deadline,
                description,
                duration,
                payment_after,
                sales,
                status, application_files,
                time_duration, collaterals,
                state, county, nda_requirement,
                service, industries, rating_for_credit, ratings
            } = this.state.detail;
            let requestedDate = new Date(requested_on);
            let deadlineDate = new Date(deadline);
            let paymentDate = new Date(payment_after);
            return (
                <Fragment>
                    <Subheader heading={this.props.location.state.product}/>


                    {status === 'rejected' ?
                        <div className="alert alert-rejected"><Translate content='column.appreject'/></div> : null}

                    {status === 'accepted' ?
                        <div className="alert alert-success"><Translate content='column.appaccept'/></div> : null}
<<<<<<< HEAD
                    <div className="content-body credit-request product-details">
                        <div className="row product-info-row">
                            <div className="product-info col-6 col-md-3">
                                <h6><Translate content='label.state'/></h6>
                                <span>{state ? state.name : null}</span>
                            </div>
                            <div className="product-info col-6 col-md-3">
                                <h6><Translate content='label.county'/></h6>
                                <span>{county ? county.name : null}</span>
                            </div>
                            <div className="product-info col-6 col-md-3">
                                <h6><Translate content='column.credittype'/></h6>
                                <span>{service ? service.name : null}</span>
                            </div>
                            <div className="product-info col-12 col-md-3 text-left text-md-right">
                                {/* <h6>Requested amount of</h6> */}
                                <h6><Translate content='label.requestedamount'/></h6>
                                <h2><ToEuro amount={amount}/></h2>
                            </div>
                        </div>
=======
                    <div className="content-body credit-request">
                        <div className="d-flex">
                            <div className="col-lg-12 col-xl-8">
                                <div className="row justify-content-between w-100 mt-5 pl-3">
                                    <div className="col-3 col-md-6 col-sm-12 col-lg-3 p-0">
                                        {/* <h6>States</h6> */}
                                        <h6><Translate content='label.state'/></h6>
                                        <span>{state ? state.name : null}</span>
                                    </div>
                                    <div className="col-3 col-md-6 col-sm-12 col-lg-3 p-0">
                                        <h6><Translate content='label.county'/></h6>
                                        <span>{county ? county.name : null}</span>
                                    </div>
                                    <div className="col-3 col-md-6 col-sm-12 col-lg-3 p-0">
                                        <h6><Translate content='column.credittype'/></h6>
                                        <span>{service ? service.name : null}</span>
                                    </div>
                                    <div className="col-3 col-md-6 col-sm-12 col-lg-3 p-0">
                                        <h6><Translate content='label.industries'/></h6>
                                        <div className="d-flex flex-wrap justify-content-between flex-column">
                                            {industries ? this.showCollections(industries) : null}
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-between w-100 mt-5 pl-3">
                                    <div className="col-10 p-0">
                                        <h6><Translate content='label.reasons'/></h6>
                                        <span>{description}</span>
                                    </div>
                                </div>
                                <div className="row justify-content-between w-100 mt-5 credit-request-content pl-3">
                                    <div className="col-3 col-md-6 col-sm-12 col-lg-3 p-0">
                                        {/* <h6>States</h6> */}
                                        <h6><Translate content='label.salesAmount'/></h6>
                                        <span><ToEuro amount={sales}/></span>
                                    </div>
                                    <div className="col-3 col-md-6 col-sm-12 col-lg-3 p-0">
                                        <h6><Translate content='label.collaterals'/></h6>
                                        <span>{this.showNameValuePair(collaterals)}</span>
                                    </div>
                                </div>
                                <div className="row justify-content-between w-100 mt-5 credit-request-content pl-3">
                                    <div className="col-3 col-md-6 col-sm-12 col-lg-3 p-0">
                                        <h6><Translate content='label.deadline'/></h6>
                                        <span>{dDigit(deadlineDate.getDate())}.{`${dDigit(deadlineDate.getMonth() + 1)}.${deadlineDate.getFullYear()}`}</span>
                                    </div>
                                    <div className="col-3 col-md-6 col-sm-12 col-lg-3 p-0">
                                        <h6><Translate content='label.deadlineForPayment'/></h6>
                                        <span>{dDigit(paymentDate.getDate())}.{`${dDigit(paymentDate.getMonth() + 1)}.${paymentDate.getFullYear()}`}</span>
                                    </div>
                                    {!nda_requirement ? <div className="col-3 col-md-6 col-sm-12 col-lg-3 p-0">
                                        <h6><Translate content='label.nda'/></h6><span><Translate content='label.yes'/></span>
                                    </div> : <Fragment></Fragment>}
>>>>>>> 6361bcf97deb3ba548d965487213be3d384472af

                        <div className="reason-description product-info">
                            <h6><Translate content='label.reasons'/></h6>
                            <span>{description}</span>
                        </div>

                        <div className="row product-info-row">
                            <div className="product-info col-6 col-md-3">
                                <h6><Translate content='label.industries'/></h6>
                                <div className="d-flex flex-wrap justify-content-between flex-column">
                                    {industries ? this.showCollections(industries) : null}
                                </div>
<<<<<<< HEAD
                            </div>
                            <div className="product-info col-6 col-md-3">
                                {/* <h6>States</h6> */}
                                <h6><Translate content='label.salesAmount'/></h6>
                                <span><ToEuro amount={sales}/></span>
                            </div>
                            <div className="product-info col-6 col-md-3">
                                <h6><Translate content='label.collaterals'/></h6>
                                <span>{this.showNameValuePair(collaterals)}</span>
                            </div>

                            <div className="product-info col-6 col-md-3 text-left text-md-right">
                                <h6><Translate content='column.requestedby'/></h6>
                                <div className="product-info-user">
                                    {/* <img src="assets/img/investor-profile.jpg" alt="Investor profile picture" /> */}
                                    <a href="">{requested_by}</a>
=======
                                <div className="row justify-content-between w-100 mt-5 credit-request-content pl-3">
                                    <h6 className="w-100"><Translate content='label.ratingForCredit'/></h6>
                                    {this.showNameValuePair(ratings)}
>>>>>>> 6361bcf97deb3ba548d965487213be3d384472af
                                </div>
                            </div>
                        </div>

                        <div className="row product-info-row">
                            <div className="product-info col-6 col-md-3">
                                <h6><Translate content='label.deadline'/></h6>
                                <span>{dDigit(deadlineDate.getDate())}.{`${dDigit(deadlineDate.getMonth() + 1)}.${deadlineDate.getFullYear()}`}</span>
                            </div>
                            <div className="product-info col-6 col-md-3">
                                <h6><Translate content='label.deadlineForPayment'/></h6>
                                <span>{dDigit(paymentDate.getDate())}.{`${dDigit(paymentDate.getMonth() + 1)}.${paymentDate.getFullYear()}`}</span>
                            </div>
                            {!nda_requirement ? <div className="product-info col-6 col-md-3">
                                <h6><Translate content='label.nda'/></h6><span><Translate content='label.yes'/></span>
                            </div> : <Fragment></Fragment>}

                            <div className="product-info col-6 col-md-3 text-left text-md-right">
                                <h6><Translate content='column.requeston'/></h6>
                                <span>{dDigit(requestedDate.getDate())}.{`${dDigit(requestedDate.getMonth() + 1)}.${requestedDate.getFullYear()}`}</span>
                            </div>
                        </div>
                        
                        <div className="product-info-row row">
                            <div className="product-info col-6 col-md-6">
                                <h6><Translate content='label.ratingForCredit'/></h6>
                                {this.showNameValuePair(ratings)}
                            </div>

                            <div className="product-info col-6 col-md-6 text-left text-md-right">
                                {/* <h6>Time Duration</h6> */}
                                <h6><Translate content='label.time'/></h6>
                                <span>{time_duration} Monate</span>
                            </div>
                        </div>
                        
                        <div className="product-info-row">
                            <div className="product-info text-left text-md-right">
                                {/* <h6>Time Duration</h6> */}
                                <h6><Translate content='label.status'/></h6>
                                <span><Translate content={matchesInvestorStatus[status].translation_key}/></span>
                            </div>
                        </div>
<<<<<<< HEAD
                        <div className="product-info-files product-info">
                            <h4 className="product__file-name"><Translate content='label.attachments'/></h4>
                            {this.renderDocs(application_files)}
                        </div>
=======
                        <div className="row justify-content-between w-100 mt-4 pl-3">
                        <div className="attachments mt-5 mb-5">
                            <h4><Translate content='label.attachments'/></h4>
                            {this.renderDocs(application_files)}
                        </div>
                        </div>
                        {/* <span className="mt-3">
              <button className="btn btn-success mr-2" disabled={status === 'accepted'}
                onClick={() => this.changeStatus('accepted')}
              ><Translate content="label.accept"/></button>
              <button className="btn btn-danger" disabled={status === 'rejected'}
                onClick={() => this.changeStatus('rejected')}

              ><Translate content="label.reject"/> </button>
            </span> */}
>>>>>>> 6361bcf97deb3ba548d965487213be3d384472af
                    </div>
                </Fragment>
            );
        } else {
            return <div><Translate content="placeholder.justASecond"/></div>
        }

    }
}

function mapStateToProps(state) {
    return {data: state.applicationDetail}
}

export default connect(mapStateToProps, {getApplicationDetail, changeStatus, downloadToken})(DetailCreditRequest);
