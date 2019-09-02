import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { confirmEmail } from '../../../actions/confirmEmail';
import { withRouter } from 'react-router-dom';
class Approval extends Component {

    componentDidMount() {
        document.title = "Approval"
        const { hash } = this.props.match.params;
        this.props.confirmEmail(hash, () => {
            this.props.history.push('/signup/activated')
        });
    }

    render() {
        return (
            <Fragment>
                <img className="company-logo company-logo-email" src="/assets/img/logo.png" alt="company logo" />
                <div className="container-full-height text-centerd d-flex">
                    <div className="content m-auto">
                        <div className="email-staging d-flex justify-content-center justify-content-between position-relative mb-5">
                            <span className="line"></span>
                            <div className="indicator-container d-flex flex-column align-items-center">
                                <div className="indicator d-flex justify-content-center align-items-center connect"><span>1</span></div>
                                <span className="mt-3">Confirm Email</span>
                                <hr />
                            </div>
                            <div className="indicator-container d-flex flex-column align-items-center">
                                <div className="indicator active d-flex justify-content-center align-items-center"><span>2</span></div>
                                <span className="mt-3">Admin Approval</span>
                            </div>
                            <div className="indicator-container d-flex flex-column align-items-center">
                                <div className="indicator d-flex justify-content-center align-items-center"><span>3</span></div><span
                                    className="mt-3">Activation </span>
                            </div>
                        </div>
                        <div className="email-content text-center m-auto"> <img src="/assets/img/icons/admin-approval.png"
                            alt="Mail icon" />
                            <h3>Just one more step, Admin Approval</h3>
                            <p className="w-75 m-auto">Our admin needs to confirm the account first. We will send you an Email when its
                            done</p>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}


export default connect(null, { confirmEmail })(withRouter(Approval));
