import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import Subheader from '../general/Subheader';
import {getCreditRequestList} from '../../actions/credits';
import Pagination from '../general/Pagination';
import Spinner from '../general/Spinner';
import Translate from 'react-translate-component'
import {dDigit} from '../../_utils/misc';
import {matchesInvestorStatus} from '../../_status'
import AnimatedCard from '../general/AnimatedCard';
import { motion } from 'framer-motion';
const Translator = require('react-translate-component');

class ListCreditRequests extends Component {
    componentDidMount() {
        this.props.getCreditRequestList(1);
    }

    renderData = data => {
        if (data.length === 0) {
            return <span><Translate content="placeholder.noCreditRequests"/> </span>;
        }
        return data.map((product, index) => {
            let date = new Date(product.created_on);
            let deadline = new Date(product.deadline);
            return (
                <tr key={index}>
                    <td>
                        {' '}
                        {product.status === 'invested' ?
                            <Link to={{
                                pathname: '/creditor/detail', state:
                                    {
                                        productId: product.product_id,
                                        appId: product.application_id
                                    }
                            }}>
                                {product.creditor_name}
                            </Link>
                            :
                            <Link to={{
                                pathname: '/application',
                                state: {pId: product.product_id, aId: product.application_id, product: product.name}
                            }}>
                                {product.creditor_name}
                            </Link>
                        }
                    </td>
                    <td>

                        <Link
                            to={{pathname: '/product', state: {id: product.product_id}}}> {product.product_title}</Link>
                    </td>
                    <td>{product.service ? product.service.name[Translator.getLocale()] : <Translate content="placeholder.notAvailable"/>}</td>
                    <td>{`${dDigit(date.getDate())}.${dDigit(date.getMonth() + 1)}.${date.getFullYear()}`}</td>
                    {/* <td className="text-right-piehub-table">{product.number_of_request}</td> */}
                    <td className="text-md-right text-left">{`${dDigit(deadline.getDate())}.${dDigit(deadline.getMonth() + 1)}.${deadline.getFullYear()}`}</td>
                    {/* <td className="text-right-piehub-table font-weight-bold">
            €{product.max_credit_amount || 100000}
          </td> */}
                    <td className="text-right-piehub-table font-weight-bold">
            <span className={`badge ${matchesInvestorStatus[product.status].class}`}>
              <Translate content={matchesInvestorStatus[product.status].translation_key}/>
            </span>
                    </td>
                </tr>
            );
        });
    };

    render() {
        if (this.props.list) {
            const {
                creditRequests: {data}
            } = this.props.list;
            const statusCounts = (data || []).reduce(
                (acc, item) => {
                    acc.total += 1;
                    if (item.status) {
                        acc[item.status] = (acc[item.status] || 0) + 1;
                    }
                    return acc;
                },
                {
                    total: 0,
                    open: 0,
                    approved: 0,
                    invested: 0,
                    requested: 0
                }
            );
            const summaryItems = [
                { key: 'total', label: <Translate content="summary.totalRequests" />, value: statusCounts.total, tone: 'neutral' },
                { key: 'open', label: <Translate content="summary.openRequests" />, value: statusCounts.open, tone: 'info' },
                { key: 'approved', label: <Translate content="summary.approvedRequests" />, value: statusCounts.approved, tone: 'success' },
                { key: 'invested', label: <Translate content="summary.investedRequests" />, value: statusCounts.invested, tone: 'warning' }
            ];
            return (
                <Fragment>
                    <Subheader
                        heading={<Translate content='label.creditrequests'/>}
                        subtitle={<Translate content="summary.creditRequestsSubtitle" />}
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
                    <AnimatedCard className="content-body">
                        <table
                            className="table tablesaw-stack"
                            data-tablesaw-mode="stack"
                            data-tablesaw-minimap="data-tablesaw-minimap"
                        >
                            <thead>
                            <tr>
                                <th data-tablesaw-sortable-col="data-tablesaw-sortable-col">
                                    <Translate content='column.creditorsname'/>
                                    {/* Kreditnehmer */}
                                </th>
                                <th
                                    data-tablesaw-sortable-col="data-tablesaw-sortable-col"
                                    data-tablesaw-priority="persist"
                                    scope="col"
                                >
                                    {/* <Translate content='column.industry' /> */}
                                    <Translate content='column.productname'/>

                                </th>
                                <th
                                    data-tablesaw-sortable-col="data-tablesaw-sortable-col"
                                    data-tablesaw-priority="persist"
                                    scope="col"
                                >
                                    <Translate content='column.services'/>
                                    {/* Kreditart */}
                                </th>
                                <th
                                    data-tablesaw-sortable-col="data-tablesaw-sortable-col"
                                    data-tablesaw-priority="persist"
                                    scope="col"
                                >
                                    <Translate
                                        content='column.createdon'/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </th>
                                <th
                                    className="text-md-right text-left"
                                    data-tablesaw-sortable-col="data-tablesaw-sortable-col"
                                    scope="col"
                                >
                                    {/* Fristablauf */}
                                    <Translate content='label.deadline'/>
                                </th>
                                {/* <th
                    className="text-right-piehub-table"
                    data-tablesaw-sortable-col="data-tablesaw-sortable-col"
                    scope="col"
                  >
                    <Translate content='column.investedamount' />
                  </th> */}
                                <th
                                    className="text-right-piehub-table"
                                    data-tablesaw-sortable-col="data-tablesaw-sortable-col"
                                    scope="col"
                                >
                                    <Translate content='column.status'/>
                                </th>
                            </tr>
                            </thead>
                            <tbody>{this.renderData(data)}</tbody>
                        </table>
                        <Pagination
                            totalPage={
                                this.props.list.creditRequests.meta
                                    ? this.props.list.creditRequests.meta.last_page
                                    : 1
                            }
                            url={(page) => this.props.getCreditRequestList(page)}
                        />
                    </AnimatedCard>
                </Fragment>
            );
        } else {
            return <Spinner/>
        }
    }
}

function mapStateToProps(state) {
    return {list: state.creditRequests};
}

export default connect(
    mapStateToProps,
    {getCreditRequestList}
)(ListCreditRequests);
