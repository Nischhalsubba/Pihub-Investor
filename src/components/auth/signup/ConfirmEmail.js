import React, { Component, Fragment } from 'react';

class ConfirmEmail extends Component {

  componentDidMount(){
    document.title = "Confirm Email"
  }

  render() {
    return (
        <Fragment>
            <img class="company-logo company-logo-email" src="/assets/img/logo.png" alt="company logo" />
            <div class="container-full-height text-centerd d-flex">
                <div class="content m-auto">
                    <div class="email-staging d-flex justify-content-center justify-content-between position-relative mb-5">
                        <span class="line"></span>
                        <div class="indicator-container d-flex flex-column align-items-center">
                            <div class="indicator active d-flex justify-content-center align-items-center connect">
                                <span>1</span></div><span class="mt-3">Confirm Email</span>
                            <hr />
                        </div>
                        <div class="indicator-container d-flex flex-column align-items-center">
                            <div class="indicator d-flex justify-content-center align-items-center"><span>2</span></div><span
                                class="mt-3">Admin Approval</span>
                        </div>
                        <div class="indicator-container d-flex flex-column align-items-center">
                            <div class="indicator d-flex justify-content-center align-items-center"><span>3</span></div><span
                                class="mt-3">Activation </span>
                        </div>
                    </div>
                    <div class="email-content text-center w-75 m-auto"> <img src="/assets/img/icons/Mail.png"
                            alt="Mail icon" />
                        <h3>We've just send you an Email</h3>
                        <p>Your account has been successfully created. Please check your email for the confirmation</p>
                        <span>Didn't recieve an email? <a href="#">Send it again</a></span>
                    </div>
                </div>
            </div>
        </Fragment>
    );
  }
}


export default (ConfirmEmail);
