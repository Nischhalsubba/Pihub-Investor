import React, { Component, Fragment } from 'react';
import Subheader from '../general/Subheader';
class InvestedList extends Component {
    render() {
        return (
            <Fragment>
                <Subheader heading="Invested Products" buttonLabel="Add New Product" />
                <div className="content-body">
                    <table className="table tablesaw-stack" data-tablesaw-mode="stack"
                        data-tablesaw-minimap="data-tablesaw-minimap">
                        <thead>
                            <tr>
                                <th data-tablesaw-sortable-col="data-tablesaw-sortable-col">Name</th>
                                <th data-tablesaw-sortable-col="data-tablesaw-sortable-col" data-tablesaw-priority="persist"
                                    scope="col">Region of interest</th>
                                <th className="text-right-piehub-table" data-tablesaw-sortable-col="data-tablesaw-sortable-col"
                                    scope="col">Interest</th>
                                <th className="text-right-piehub-table" data-tablesaw-sortable-col="data-tablesaw-sortable-col"
                                    scope="col">Creditor</th>
                                <th className="text-right-piehub-table" data-tablesaw-sortable-col="data-tablesaw-sortable-col"
                                    scope="col">Invested on</th>
                                <th className="text-right-piehub-table" data-tablesaw-sortable-col="data-tablesaw-sortable-col"
                                    scope="col">Invested Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* <tr>
                            <td> <a href="">Reprehenderit Marshall</a></td>
                            <td><a href="">Health and personal care</a></td>
                            <td className="text-right-piehub-table">10%</td>
                            <td className="text-right-piehub-table">Grok</td>
                            <td className="text-right-piehub-table">07/04/1927</td>
                            <td className="font-weight-bold text-right-piehub-table">$238638</td>
                        </tr>
                        <tr>
                            <td> <a href="">Fugiat Valdez</a></td>
                            <td><a href="">Home and garden</a></td>
                            <td className="text-right-piehub-table">10%</td>
                            <td className="text-right-piehub-table">Rotodyne</td>
                            <td className="text-right-piehub-table">05/12/1983</td>
                            <td className="font-weight-bold text-right-piehub-table">$706045</td>
                        </tr>
                        <tr>
                            <td> <a href="">Excepteur Miles</a></td>
                            <td><a href="">Vehicle sales</a></td>
                            <td className="text-right-piehub-table">10%</td>
                            <td className="text-right-piehub-table">Sensate</td>
                            <td className="text-right-piehub-table">08/08/1921</td>
                            <td className="font-weight-bold text-right-piehub-table">$946652</td>
                        </tr>
                        <tr>
                            <td> <a href="">Tempor Barber</a></td>
                            <td><a href="">Computers, accessories, and services</a></td>
                            <td className="text-right-piehub-table">10%</td>
                            <td className="text-right-piehub-table">Flexigen</td>
                            <td className="text-right-piehub-table">26/08/1949</td>
                            <td className="font-weight-bold text-right-piehub-table">$462551</td>
                        </tr>
                        <tr>
                            <td> <a href="">IT Investment</a></td>
                            <td><a href="">Health and personal care</a></td>
                            <td className="text-right-piehub-table">10%</td>
                            <td className="text-right-piehub-table">Flexigen</td>
                            <td className="text-right-piehub-table">26/08/1949</td>
                            <td className="font-weight-bold text-right-piehub-table">$462551</td>
                        </tr>
                        <tr>
                            <td> <a href="">Officia Gamble</a></td>
                            <td><a href="">Education</a></td>
                            <td className="text-right-piehub-table">10%</td>
                            <td className="text-right-piehub-table">Radiantix</td>
                            <td className="text-right-piehub-table">19/10/1992</td>
                            <td className="font-weight-bold text-right-piehub-table">$720742</td>
                        </tr>
                        <tr>
                            <td> <a href="">Consectetur Castaneda</a></td>
                            <td><a href="">Electronics and telecom</a></td>
                            <td className="text-right-piehub-table">10%</td>
                            <td className="text-right-piehub-table">Corporana</td>
                            <td className="text-right-piehub-table">01/02/1952</td>
                            <td className="font-weight-bold text-right-piehub-table">$412816</td>
                        </tr>
                        <tr>
                            <td> <a href="">Labore Ryan</a></td>
                            <td><a href="">Financial services and products</a></td>
                            <td className="text-right-piehub-table">10%</td>
                            <td className="text-right-piehub-table">Ramjob</td>
                            <td className="text-right-piehub-table">05/12/1997</td>
                            <td className="font-weight-bold text-right-piehub-table">$531958</td>
                        </tr>
                        <tr>
                            <td> <a href="">Fugiat Hendricks</a></td>
                            <td><a href="">Gifts and flowers</a></td>
                            <td className="text-right-piehub-table">10%</td>
                            <td className="text-right-piehub-table">Quilk</td>
                            <td className="text-right-piehub-table">25/12/2012</td>
                            <td className="font-weight-bold text-right-piehub-table">$671290</td>
                        </tr>
                        <tr>
                            <td> <a href="">Tempor Kelly</a></td>
                            <td><a href="">Government</a></td>
                            <td className="text-right-piehub-table">10%</td>
                            <td className="text-right-piehub-table">Roughies</td>
                            <td className="text-right-piehub-table">17/09/1971</td>
                            <td className="font-weight-bold text-right-piehub-table">$636436</td>
                        </tr> */}
                            You haven't invested on any products yet.
                    </tbody>
                    </table>
                </div>
            </Fragment>
        );
    }
}

export default InvestedList;
