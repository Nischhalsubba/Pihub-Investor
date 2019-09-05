import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getInvestedList } from '../../actions/invested';
import Subheader from '../general/Subheader';
import Spinner from '../general/Spinner';
import Translate from 'react-translate-component';
class InvestedList extends Component {
    state = { investments: null }
    componentDidMount() {
        this.props.getInvestedList()
    }
    componentDidUpdate(prevProps) {
        if (prevProps.investments !== this.props.investments) {
            console.log(this.props.investments)
            this.setState({ investments: this.props.investments.list })
        }
    }

    renderList = investments => {
        if (investments.length === 0) {
            return <div>You haven't invested on any products yet</div>
        } else {
            return investments.map((investment, index) => {
                var investedDate = new Date(investment.invested_on);
                return (
                    <tr key={index}>
                        <td>
                            <Link to={{
                                pathname: '/creditor/detail',
                                state: { id: investment.creditor_id }
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
                            {investedDate.getDate()}-{investedDate.getMonth() + 1}-{investedDate.getFullYear()}
                        </td>

                        <td className="font-weight-bold text-right-piehub-table">${investment.invested_amount}</td>
                        <td className="font-weight-bold text-right-piehub-table">${investment.duration} Monate</td>
                    </tr>

                );
            })
        }
    }
    render() {
        return (
            <Fragment>
                <Subheader heading={<Translate content='sidebar.invested_products' />} />
                <div className="content-body">
                    <table className="table tablesaw-stack" data-tablesaw-mode="stack"
                        data-tablesaw-minimap="data-tablesaw-minimap">
                        <thead>
                            <tr>
                                <th data-tablesaw-sortable-col="data-tablesaw-sortable-col"><Translate content='column.creditorsname' /></th>
                                <th data-tablesaw-sortable-col="data-tablesaw-sortable-col" data-tablesaw-priority="persist"
                                    scope="col">
                                    {/* <Translate content='column.industry' /> */}
                                    Product Titel
                                    </th>
                                {/* <th className="text-right-piehub-table" data-tablesaw-sortable-col="data-tablesaw-sortable-col"
                                    scope="col"><Translate content='column.services' /></th> */}
                                <th className="text-right-piehub-table" data-tablesaw-sortable-col="data-tablesaw-sortable-col"
                                    scope="col"><Translate content='column.approvedon' /></th>
                                <th className="text-right-piehub-table" data-tablesaw-sortable-col="data-tablesaw-sortable-col"
                                    scope="col">
                                    {/* <Translate content='column.investedamount' /> */}
                                    Kreditbetrag
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
                </div>
            </Fragment>
        );
    }
}
function mapStateToProps(state) {
    return { investments: state.investment }
}
export default connect(mapStateToProps, { getInvestedList })(InvestedList);
