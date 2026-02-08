import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { confirmEmail } from '../../../actions/confirmEmail';
import { withRouter, Link } from 'react-router-dom';
import Translate from 'react-translate-component'
class Approval extends Component {
    state = { invalid: false }
    componentDidMount() {
        document.title = "Approval"
        const { hash } = this.props.match.params;
        this.props.confirmEmail(hash, () => {
            this.props.history.push('/signup/activated')
        }, () => this.setState({ invalid: true }));
    }

    render() {
        if (!this.state.invalid) {
            return (
                <Fragment>
                    <Link to="/signup"> <img className="company-logo company-logo-email" src={`${process.env.PUBLIC_URL}/assets/img/logo.png`} alt="company logo" /></Link>
                    <div className="container-full-height text-centerd d-flex">
                        <div className="content m-auto">
                            <div className="email-staging d-flex justify-content-center justify-content-between position-relative mb-5">
                                <span className="line"></span>
                                <div className="indicator-container d-flex flex-column align-items-center">
                                    <div className="indicator d-flex justify-content-center align-items-center connect"><span>1</span></div>
                                    {/* <span className="mt-3">Confirm Email</span> */}
                                    <Translate content='label.confirmemail' component="span" className="mt-3" />
                                    <hr />
                                </div>
                                <div className="indicator-container d-flex flex-column align-items-center">
                                    <div className="indicator active d-flex justify-content-center align-items-center"><span>2</span></div>
                                    {/* <span className="mt-3">Admin Approval</span> */}
                                    <Translate content='label.adminapproval' component="span" className="mt-3" />
                                </div>
                                <div className="indicator-container d-flex flex-column align-items-center">
                                    <div className="indicator d-flex justify-content-center align-items-center"><span>3</span></div>
                                    {/* <span
                                        className="mt-3">Activation </span> */}
                                        <Translate content='label.activation' component="span" className="mt-3" />
                                </div>
                            </div>
                            <div className="email-content text-center m-auto"> <img src={`${process.env.PUBLIC_URL}/assets/img/icons/admin-approval.png`}
                                alt="Mail icon" />
                                {/* <h3>Just one more step, Admin Approval</h3> */}
                                <Translate content='label.justonemore' component="h3" />
                                {/* <p className="w-75 m-auto">Our admin needs to confirm the account first. We will send you an Email when its
                                done</p> */}
                                <Translate content='label.ouradminneed' component="p" className="w-75 m-auto" />
                            </div>
                        </div>
                    </div>
                </Fragment>
            );
        } else {
            return (
                <Fragment>
                    <Link to="/signup">
                        <img className="company-logo company-logo-email" src={`${process.env.PUBLIC_URL}/assets/img/logo.png`} alt="company logo" /></Link>
                    <div className="container-full-height text-centerd d-flex">
                        <div className="content m-auto">
                            {/* <div className="email-staging d-flex justify-content-center justify-content-between position-relative mb-5">
                                <span className="line"></span>
                                
                              
                             
                            </div> */}
                            <div className="email-content text-center m-auto"> <img src={`${process.env.PUBLIC_URL}/assets/img/icons/admin-approval.png`}
                                alt="Mail icon" />
                                {/* <h3>We cant verify your email address.</h3> */}
                                <Translate content='label.wecant' component="h3" />
                                {/* <p className="w-75 m-auto">The confirmation link has expired. </p><p>You can ask for a new validation link here.</p> */}
                                <Translate content='label.theconfirm' component="p" className="w-75 m-auto" />
                                <Translate content='label.youcanask' component="p" />
                            </div>
                        </div>
                    </div>
                </Fragment>
            );

        }

    }
}


export default connect(null, { confirmEmail })(withRouter(Approval));
