import React, { Component, Fragment } from 'react';

class Approval extends Component {

  componentDidMount(){
    document.title = "Approval"
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
                            <div class="indicator d-flex justify-content-center align-items-center connect"><span>1</span></div>
                            <span class="mt-3">Confirm Email</span>
                            <hr />
                        </div>
                        <div class="indicator-container d-flex flex-column align-items-center">
                            <div class="indicator active d-flex justify-content-center align-items-center"><span>2</span></div>
                            <span class="mt-3">Admin Approval</span>
                        </div>
                        <div class="indicator-container d-flex flex-column align-items-center">
                            <div class="indicator d-flex justify-content-center align-items-center"><span>3</span></div><span
                                class="mt-3">Activation </span>
                        </div>
                    </div>
                    <div class="email-content text-center m-auto"> <img src="/assets/img/icons/admin-approval.png"
                            alt="Mail icon" />
                        <h3>Just one more step, Admin Approval</h3>
                        <p class="w-75 m-auto">Our admin needs to confirm the account first. We will send you an Email when its
                            done</p>
                    </div>
                </div>
            </div>
        </Fragment>
    );
  }
}


export default (Approval);
