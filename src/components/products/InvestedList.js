import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getInvestedList } from '../../actions/invested';
import Subheader from '../general/Subheader';
import Spinner from '../general/Spinner';
import Translate from 'react-translate-component';
import { ToEuro } from '../general/CurrencyFormatter';
import AnimatedCard from '../general/AnimatedCard';
import { motion } from 'framer-motion';
class InvestedList extends Component {
    state = { investments: null }
    componentDidMount() {
        this.props.getInvestedList()
    }
    componentDidUpdate(prevProps) {
        if (prevProps.investments !== this.props.investments) {
            this.setState({ investments: this.props.investments.list })
        }
    }

    renderList = investments => {
        if (investments.length === 0) {
            return <div>
                <Translate content="placeholder.noActiveProduct"/>
            </div>
        } else {
            return investments.map((investment, index) => {
                var investedDate = new Date(investment.invested_on);
                return (
                    <tr key={index}>
                        <td>
                            <Link to={{
                                pathname: '/creditor/detail',
                                state: { pId: investment.product_id, aId: investment.application_id }
                            }}> {investment.creditor_name}</Link>
                        </td>
                        <td>
                            <Link to={{
                                pathname: '/product',
                                state: { id: investment.product_id }
                            }}>  {investment.product_title}</Link>
                        </td>
                        {/* <td className="text-right-piehub-table">{investment.service}</td> */}
                        <td className="text-right-piehub-table">
                            {investedDate.getDate()}.{investedDate.getMonth() + 1}.{investedDate.getFullYear()}
                        </td>

                        <td className="font-weight-bold text-right-piehub-table"><ToEuro amount={investment.invested_amount} /></td>
                        <td className="font-weight-bold text-right-piehub-table">{investment.duration} Monate</td>
                    </tr>

                );
            })
        }
    }
    render() {
        const investments = this.state.investments || [];
        const investedCount = investments.length;
        const totalAmount = investments.reduce((sum, investment) => sum + (investment.invested_amount || 0), 0);
        const averageDuration = investedCount
            ? Math.round(
                investments.reduce((sum, investment) => sum + (investment.duration || 0), 0) / investedCount
            )
            : 0;
        return (
            <Fragment>
                <Subheader
                    heading={<Translate content='sidebar.invested_products' />}
                    subtitle={<Translate content="summary.investedSubtitle" />}
                />
                <div className="summary-grid">
                    {[
                        {
                            key: 'count',
                            label: <Translate content="summary.totalInvested" />,
                            value: investedCount,
                            tone: 'neutral'
                        },
                        {
                            key: 'amount',
                            label: <Translate content="summary.totalAmount" />,
                            value: <ToEuro amount={totalAmount} />,
                            tone: 'success'
                        },
                        {
                            key: 'duration',
                            label: <Translate content="summary.averageDuration" />,
                            value: (
                                <span>
                                    {averageDuration} <Translate content="label.months" />
                                </span>
                            ),
                            tone: 'info'
                        }
                    ].map((item, index) => (
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
                                    animate={{ width: investedCount ? '100%' : '0%' }}
                                    transition={{ duration: 0.4, ease: 'easeOut' }}
                                />
                            </div>
                        </AnimatedCard>
                    ))}
                </div>
                <AnimatedCard className="content-body">
                    <table className="table tablesaw-stack" data-tablesaw-mode="stack"
                        data-tablesaw-minimap="data-tablesaw-minimap">
                        <thead>
                            <tr>
                                <th data-tablesaw-sortable-col="data-tablesaw-sortable-col">

                                    {/* Kreditnehmer */}
                                    <Translate content='column.creditorsname' />
                                </th>
                                <th data-tablesaw-sortable-col="data-tablesaw-sortable-col" data-tablesaw-priority="persist"
                                    scope="col">
                                    <Translate content='column.productname' />
                                    {/* Produktname */}
                                </th>
                                {/* <th className="text-right-piehub-table" data-tablesaw-sortable-col="data-tablesaw-sortable-col"
                                    scope="col"><Translate content='column.services' /></th> */}
                                <th className="text-right-piehub-table" data-tablesaw-sortable-col="data-tablesaw-sortable-col"
                                    scope="col"><Translate content='column.approvedon' /></th>
                                <th className="text-right-piehub-table" data-tablesaw-sortable-col="data-tablesaw-sortable-col"
                                    scope="col">
                                    <Translate content='column.investedamount' />
                                    {/* Kreditbetrag */}
                                </th>
                                <th className="text-right-piehub-table" data-tablesaw-sortable-col="data-tablesaw-sortable-col"
                                    scope="col">
                                    <Translate content='column.duration' />

                                </th>
                            </tr>
                        </thead>
                        <tbody>

                            {this.state.investments ? this.renderList(this.state.investments) : <Spinner />}
                        </tbody>
                    </table>
                </AnimatedCard>
            </Fragment>
        );
    }
}
function mapStateToProps(state) {
    return { investments: state.investment }
}
export default connect(mapStateToProps, { getInvestedList })(InvestedList);
