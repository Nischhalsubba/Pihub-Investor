import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {getProductById, deleteProduct, postponeProduct} from '../../actions/product';
import {downloadToken} from '../../actions/download';
// import Subheader from '../general/Subheader';
import RequestedByList from '../credits/RequestedByList';
import Translate from 'react-translate-component'
import {ToEuro} from '../general/CurrencyFormatter';
const Translator = require('react-translate-component');
class ViewProduct extends Component {
    componentDidMount() {
        if (!this.props.location.state) {
            return this.props.history.push('/products');
        }
        this.props.getProductById(this.props.location.state.id);
    }

    listIndustries = industries => {
        return industries.map((industry, index) => {
            return (
                <a className="mb-1" href="#">{industry.name[Translator.getLocale()]}</a>

            );
        })
    }
    listStates = states => {
        if (states.length > 0) {
            return states.map((state, index) => {
                return (
                    <a className="mb-1" href="#">{state}<br/></a>

                );
            })
        }

    }
    listRating = ratings => {
        if (ratings.length === 0) {
            return <span>**<Translate content='column.norating'/></span>
        } else {
            return ratings.map((rating, index) => {
                console.log(rating)
                return (
                    <div className="col-3 p-0">
                        <h6>{rating.name}</h6>
                        <span>{rating.value}</span>
                    </div>

                );
            })
        }
    }
    showAttachments = documents => {
        if (documents.length === 0) {
            return (
                <span>No Attachments Available</span>
            );
        } else {
            return documents.map((doc, index) => {
                // console.log(doc)
                return (
                    <div className="file mb-2" key={index}>
                        <span className="file-name"><button className='btn btn-link'
                                                        onClick={() => this.props.downloadToken(doc.path, doc.file_name, doc.file_type)}>{doc.file_name}</button></span>
                        {/*<span className="ml-4 file-size">Type: {doc.type}</span>*/}
                    </div>
                );
            })
        }
    }

    render() {
        if (this.props.product) {
            const {
                product: {
                    id,
                    investor,
                    product_code,
                    collatoral,
                    max_credit_amount,
                    min_credit_amount,
                    industries,
                    status,
                    min_time_duration,
                    max_time_duration,
                    product_title,
                    service,
                    states,
                    ratings,
                    County,
                    documents,
                    min_sales_creditor
                }
            } = this.props.product;
            // console.log('service', service);
            return (
                <Fragment>
                    {status === 'deleted' ?
                        <div className="alert alert-rejected"><Translate content='label.deletedmsg'/></div> : null}
                    {status === 'postponed' ?
                        <div className="alert alert-secondary"><Translate content='label.postponedmsg'/></div> : null}
                    <div className="content-head">
                        <div className="content-head-left">
                            {/* <h1 className="content-head__title">Produktdetail</h1> */}
                            <Translate content='label.Produktdetail' component="h1" className="content-head__title"/>
                        </div>
                        {status !== 'deleted' ? <div className="content-head-right">
                            <Link to={{
                                pathname: '/edit-product',
                                state: {id: id}
                            }}
                                  className="btn btn-primary"
                            >
                                <Translate content='button.Produktbearbeiten'/>

                            </Link>
                        </div> : null}

                    </div>
                    <div className="content-body credit-request">
                        <div className="d-flex">
                            <div className="col-lg-12 col-xl-8">
                                <div className="row justify-content-between w-100">
                                    <div className="col-2 p-0">
                                        {/* <h6>Product Title</h6> */}
                                        <Translate content='label.producttitle' component="h6"/>
                                        <a href="#">{product_title}</a>
                                    </div>
                                    <div className="col-2 p-0">
                                        <Translate content='label.service' component="h6"/>
                                        <a>{service ? service.name[Translator.getLocale()] : null} </a>
                                    </div>
                                    <div className="col-2 p-0">
                                        <Translate content='label.state' component="h6"/>
                                        <a>{states ? this.listStates(states) : null}</a>
                                    </div>
                                    <div className="col-2 p-0">
                                        {/* <Translate content='label.state' component="h6" /> */}
                                        <Translate content='label.county' component="h6"/>
                                        <a>{states ? this.listStates(County) : null}</a>
                                    </div>
                                    <div className="col-2 p-0">
                                        <Translate content='label.industries' component="h6"/>
                                        <div className="d-flex flex-wrap justify-content-between flex-column">
                                            {industries ? this.listIndustries(industries) : null}
                                        </div>
                                    </div>

                                </div>

                                <div className="row justify-content-between w-100 mt-5">
                                    <div className="col-2 p-0">
                                        <Translate content='label.minimumsales' component="h6"/>
                                        <ToEuro amount={min_sales_creditor}/>
                                    </div>
                                    <div className="col-2 p-0">
                                        <Translate content='label.Sicherheiten' component="h6"/>
                                        <a>{collatoral ? <Translate content='label.yes'/> :
                                            <Translate content='label.no'/>} </a>
                                    </div>

                                </div>


                                <div className="row justify-content-between w-100 mt-5">
                                    {ratings ? this.listRating(ratings) : null}
                                </div>
                            </div>
                            <div className="col-lg-12 col-xl-4 rightbar">
                                <div className="amount">
                                    {/* <h6>Max Credit Amount</h6> */}
                                    <Translate content='label.maxcredit' component="h6"/>
                                    <h2><ToEuro amount={max_credit_amount}/></h2>
                                </div>
                                <div className="amount mt-5">
                                    {/* <h6>Max Credit Amount</h6> */}
                                    {/* <h6>Mindestkreditbetrag</h6> */}
                                    <Translate content='column.minimum_credit_amount' component="h6"/>

                                    <h2><ToEuro amount={min_credit_amount}/></h2>
                                </div>

                                <div className="date mt-5">
                                    {/* <h6>Time Duration</h6> */}
                                    <Translate content='column.minduration' component="h6"/>
                                    <a href="#">{min_time_duration} <Translate content='label.months'/> </a>
                                </div>
                                <div className="date mt-5">
                                    {/* <h6>Time Duration</h6> */}
                                    <Translate content='column.maxduration' component="h6"/>
                                    <a href="#">{max_time_duration} <Translate content='label.months'/> </a>
                                </div>
                            </div>
                        </div>
                        <div className="attachments">
                            {/* <h4>Attachments</h4> */}
                            <Translate content='label.attachments' component="h6"/>
                            {/* <div className="file mb-2">
                <span className="file-name">tax payer investment.docx</span>
                <span className="ml-4 file-size">400.5kb</span>
              </div>
              <div className="file">
                <span className="file-name">investment agreement.pdf</span>
                <span className="ml-4 file-size">322.2kb</span>
              </div> */}
                            {documents ? this.showAttachments(documents) : null}
                        </div>
                        {status !== 'deleted' ?
                            <Fragment>
                                <button className='btn btn-danger'
                                        onClick={() => this.props.deleteProduct(id, () => this.props.history.push('/products'))}>
                                    <Translate content='button.delete'/></button>
                                &nbsp;&nbsp;
                                {status !== 'postponed' ?
                                    <button
                                        className='btn btn-warning'
                                        onClick={() => this.props.postponeProduct(id, "postpone", () => {
                                            this.props.history.push('/products')
                                        })}
                                    ><Translate content='button.postpone'/></button>
                                    :
                                    <button
                                        className='btn btn-warning'
                                        onClick={() => this.props.postponeProduct(id, "undo_postpone", () => {
                                            this.props.history.push('/products')
                                        })}
                                    ><Translate content='button.undopostpone'/></button>
                                }

                            </Fragment>
                            : null}


                        {id ? <RequestedByList id={id} name={product_title}/> : null}
                    </div>
                </Fragment>
            );
        } else {
            return <div><Translate content="placeholder.justASecond"/></div>;
        }
    }
}

function mapStateToProps(state) {
    return {product: state.singleProduct};
}

export default connect(
    mapStateToProps,
    {getProductById, deleteProduct, postponeProduct, downloadToken}
)(ViewProduct);
