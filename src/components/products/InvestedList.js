import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { getInvestedList } from '../../actions/invested';
import Subheader from '../general/Subheader';
class InvestedList extends Component {
    state = { investments: [] }
    componentDidMount() {
        this.props.getInvestedList()
    }
    componentDidUpdate(prevProps) {
        if (prevProps.investments !== this.props.investments) {
            console.log('%%', this.props.investments);
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
                        <td> {investment.creditor_name}</td>
                        <td>
                            {investment.industries.map((industry, index) => {
                                return <span key={index}>{industry}</span>
                            })}
                        </td>
                        <td className="text-right-piehub-table">{investment.service}</td>
                        <td className="text-right-piehub-table">
                            {investedDate.getDate()}-{investedDate.getMonth() + 1}-{investedDate.getFullYear()}
                        </td>

                        <td className="font-weight-bold text-right-piehub-table">${investment.invested_amount}</td>
                    </tr>
                );
            })
        }
    }
    render() {
        return (
            <Fragment>
                <Subheader heading="Invested Products" />
                <div className="content-body">
                    <table className="table tablesaw-stack" data-tablesaw-mode="stack"
                        data-tablesaw-minimap="data-tablesaw-minimap">
                        <thead>
                            <tr>
                                <th data-tablesaw-sortable-col="data-tablesaw-sortable-col">Creditor Name</th>
                                <th data-tablesaw-sortable-col="data-tablesaw-sortable-col" data-tablesaw-priority="persist"
                                    scope="col">Industry</th>
                                <th className="text-right-piehub-table" data-tablesaw-sortable-col="data-tablesaw-sortable-col"
                                    scope="col">Service</th>
                                <th className="text-right-piehub-table" data-tablesaw-sortable-col="data-tablesaw-sortable-col"
                                    scope="col">Invested On</th>
                                <th className="text-right-piehub-table" data-tablesaw-sortable-col="data-tablesaw-sortable-col"
                                    scope="col">Invested Amount</th>
                            </tr>
                        </thead>
                        <tbody>

                            {this.renderList(this.state.investments)}
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
