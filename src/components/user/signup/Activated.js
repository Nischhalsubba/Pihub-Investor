import React, { Component, Fragment } from 'react';

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
                            <span className="mt-3">Confirm Email</span>
                            <hr />
                        </div>
                        <div className="indicator-container d-flex flex-column align-items-center">
                            <div className="indicator d-flex justify-content-center align-items-center"><span>2</span></div><span
                                className="mt-3">Admin Approval</span>
                        </div>
                        <div className="indicator-container d-flex flex-column align-items-center">
                            <div className="indicator active d-flex justify-content-center align-items-center"><span>3</span></div>
                            <span className="mt-3">Activation </span>
                        </div>
                    </div>
                    <div className="email-content text-center w-75 m-auto"> <img src="/assets/img/icons/activated.png"
                            alt="Mail icon" />
                        <h3>Wow, Welcome to Pihub</h3>
                        <p>Your account has been activated. From now on you can use our service freely</p>
                    </div>
                </div>
            </div>
        </Fragment>
    );
  }
}


export default (SignUpActivated);
