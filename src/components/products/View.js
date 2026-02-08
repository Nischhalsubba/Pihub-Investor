import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {getProductById, deleteProduct, postponeProduct} from '../../actions/product';
import {downloadToken} from '../../actions/download';
// import Subheader from '../general/Subheader';
import RequestedByList from '../credits/RequestedByList';
import Translate from 'react-translate-component'
import {ToEuro} from '../general/CurrencyFormatter';
import AnimatedCard from '../general/AnimatedCard';
import { motion } from 'framer-motion';
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
                    <span className="mb-1">{industry.name[Translator.getLocale()]}</span>

            );
        })
    }
    listStates = states => {
        if (states.length > 0) {
            return states.map((state, index) => {
                return (
                    <span className="mb-1">{state}<br/></span>

                );
            })
        }

    }
    listRating = ratings => {
        if (ratings.length === 0) {
            return <span>**<Translate content='column.norating'/></span>
        } else {
            return ratings.map((rating, index) => {
                return (
                    <motion.div
                        className="product-info col-6 col-md-3"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03, duration: 0.25 }}
                    >
                        <h6>{rating.name}</h6>
                        <span>{rating.value}</span>
                    </motion.div>
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
                    <AnimatedCard className="content-body product-details">
                        <div className="row product-info-row">
                            <div className="product-info col-6 col-md-3">
                                {/* <h6>Product Title</h6> */}
                                <Translate content='label.producttitle' component="h6"/>
                                <span>{product_title}</span>
                            </div>
                            <div className="product-info col-6 col-md-3">
                                <Translate content='label.service' component="h6"/>
                                <span>{service ? service.name[Translator.getLocale()] : null} </span>
                            </div>
                            <div className="product-info col-6 col-md-3">
                                <Translate content='label.state' component="h6"/>
                                <span>{states ? this.listStates(states) : null}</span>
                            </div>
                            <div className="product-info col-12 col-md-3 text-left text-md-right">
                                {/* <h6>Max Credit Amount</h6> */}
                                <Translate content='label.maxcredit' component="h6"/>
                                <h2><ToEuro amount={max_credit_amount}/></h2>
                            </div>
                        </div>

                        <div className="row product-info-row">
                            <div className="product-info col-6 col-md-3">
                                {/* <Translate content='label.state' component="h6" /> */}
                                <Translate content='label.county' component="h6"/>
                                <span>{states ? this.listStates(County) : null}</span>
                            </div>
                            <div className="product-info col-6 col-md-3">
                                <Translate content='label.industries' component="h6"/>
                                <div className="d-flex flex-wrap justify-content-between flex-column">
                                    {industries ? this.listIndustries(industries) : null}
                                </div>
                            </div>
                            <div className="product-info col-6 col-md-3">
                                <Translate content='label.minimumsales' component="h6"/>
                                <ToEuro amount={min_sales_creditor}/>
                            </div>
                            <div className="product-info col-12 col-md-3 text-left text-md-right">
                                {/* <h6>Max Credit Amount</h6> */}
                                {/* <h6>Mindestkreditbetrag</h6> */}
                                <Translate content='column.minimum_credit_amount' component="h6"/>

                                <h2><ToEuro amount={min_credit_amount}/></h2>
                            </div>
                        </div>

                        <div className="row product-info-row">
                            <div className="product-info col-6 col-md-6">
                                <Translate content='label.Sicherheiten' component="h6"/>
                                <a>{collatoral ? <Translate content='label.yes'/> :
                                    <Translate content='label.no'/>} </a>
                            </div>
                            <div className="product-info col-6 col-md-6 text-left text-md-right">
                                {/* <h6>Time Duration</h6> */}
                                <Translate content='column.minduration' component="h6"/>
                                <span>{min_time_duration} <Translate content='label.months'/> </span>
                            </div>
                        </div>

                        <div className="product-info text-left text-md-right">
                            {/* <h6>Time Duration</h6> */}
                            <Translate content='column.maxduration' component="h6"/>
                            <span>{max_time_duration} <Translate content='label.months'/> </span>
                        </div>

                        <div className="product-info-row row">
                            {ratings ? this.listRating(ratings) : null}
                        </div>
                        <div className="product-info-files product-info">
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
                    </AnimatedCard>
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
