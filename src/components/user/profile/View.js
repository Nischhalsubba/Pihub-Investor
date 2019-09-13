import React, { Fragment } from 'react';

export default props => {
  return (
    <Fragment>
      <div class="content-head">
        <div class="content-head-left w-50">
          <div class="d-flex company-image">
            <div class="item position-relative">
              <img src="/assets/img/vw.png" alt="alt" width="120px" height="120px" />
              <img class="verify" src="/assets/img/verify.png" alt="alt" />
            </div>
            <div class="item ml-4">
              <h2>Volkswagen Group
                <span class="badge-primary p-2 rounded ml-2">Verified</span>
              </h2>
              <span>Wolfsburg, Germany</span>
              <div class="d-flex social-media mt-2">
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <img class="mr-3" src="/assets/img/icons/facebook.png" alt="alt" width="25px" height="25px" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <img class="mr-3" src="/assets/img/icons/twitter.png" alt="alt" width="25px" height="25px" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <img src="/assets/img/icons/linkedin.png" alt="alt" width="25px" height="25px" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="content-head-right">
          <a class="btn btn-primary" href="add-new-products.html">Edit Profile </a>
        </div>
      </div>
      <div class="content-body mt-5">
        <div class="d-flex">
          <img src="./assets/img/bx-briefcase.png" alt="" />
          <span class="ml-3 font-weight-bold">Sparkasse</span>
        </div>
        <div class="d-flex mt-4">
          <img src="./assets/img/bx-map.png" alt="" />
          <span class="ml-3 font-weight-bold">Darmstadth, Germany</span>
        </div>
        <div class="d-flex mt-4 phone">
          <img src="./assets/img/bx-phone.png" alt="" />
          <div class="d-flex flex-column">
            <h4 class="ml-3 font-weight-bold">Rosa Renata</h4>
            <span class="ml-3 mb-2">Rosa@yahoo.com</span>
            <span class="ml-3">+49 9877458547</span>
          </div>
        </div>
        <div class="d-flex mt-4">
          <img src="./assets/img/icons/contact-person.png" alt="" width="20px" />
          <span class="ml-3 font-weight-bold">Contact Person</span>
        </div>
        <div class="d-flex mt-4 contact_person">
          <div class="item d-flex flex-column">
            <h5 class="font-weight-normal">Ria Quirin </h5>
            <span class="mb-2">Ria@yahoo.com</span>
            <span>+49 301234567</span>
          </div>
          <div class="item ml-4 d-flex flex-column">
            <h5 class="font-weight-normal">Meine Ferdi </h5>
            <span class="mb-2">Meine@yahoo.com</span>
            <span>+49 9877458547</span>
          </div>
        </div>
      </div>
    </Fragment >
  );
}