import React, { Component, Fragment } from 'react';
import Translate from 'react-translate-component'
class SignUpActivated extends Component {

  componentDidMount(){
    document.title = "Welcome"
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
                            {/* <span className="mt-3">Confirm Email</span> */}
                            <Translate content='label.confirmemail' component="span" className="mt-3" />
                            <hr />
                        </div>
                        <div className="indicator-container d-flex flex-column align-items-center">
                            <div className="indicator d-flex justify-content-center align-items-center"><span>2</span></div>
                            {/* <span
                                className="mt-3">Admin Approval</span> */}
                                <Translate content='label.adminapproval' component="span" className="mt-3" />
                        </div>
                        <div className="indicator-container d-flex flex-column align-items-center">
                            <div className="indicator active d-flex justify-content-center align-items-center"><span>3</span></div>
                            {/* <span className="mt-3">Activation </span> */}
                            <Translate content='label.activation' component="span" className="mt-3" />
                        </div>
                    </div>
                    <div className="email-content text-center w-75 m-auto"> <img src="/assets/img/icons/activated.png"
                            alt="Mail icon" />
                        {/* <h3>Wow, Welcome to Pihub</h3> */}
                        <Translate content='label.wow' component="h3" />
                        {/* <p>Your account has been activated. From now on you can use our service freely</p> */}
                        <Translate content='label.youraccounthasbeen' component="p" />
                    </div>
                </div>
            </div>
        </Fragment>
    );
  }
}


export default (SignUpActivated);
