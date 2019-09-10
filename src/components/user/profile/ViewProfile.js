import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import { getProfile } from '../../../actions/profile';
import Spinner from '../../general/Spinner';
class ViewProfile extends Component {
  componentDidMount() {
    this.props.getProfile()
  }
  render() {
    if (!this.props.profile) {
      return <Spinner />
    } else {
      const { fname, lname, company_name, email, phone_number, status } = this.props.profile;
      return (
        <Fragment>
          <div class="content-head">
            <div class="content-head-left">
              <div class="row">
                <div class="col-2 position-relative"><img src="/assets/img/profile-picture.png" alt="alt" /><img class="verify" src="/assets/img/verify.png" alt="alt" /></div>
                <div class="col-10">
                  <h2>{fname} {lname}<span class="badge-primary p-2 rounded ml-2">{status === 'approved' ? 'Verified' : 'Unverified'}</span></h2><span class="mt-2">Darmstadth, Germany</span>
                  <p class="mt-2">Born in small family, worked my way to this point, now an entrepreneur helping startup touch the sky</p>
                  <div class="d-flex social-media">
                    <a href="#" target="_blank" rel="noopener noreferrer"><img class="mr-3" src="/assets/img/icons/facebook.png" alt="alt" width="25px" height="25px" /></a>
                    <a href="#" target="_blank" rel="noopener noreferrer"><img class="mr-3" src="/assets/img/icons/twitter.png" alt="alt" width="25px" height="25px" /></a>
                    <a href="#" target="_blank" rel="noopener noreferrer"><img src="/assets/img/icons/linkedin.png" alt="alt" width="25px" height="25px" /></a>
                  </div>
                </div>
              </div>
            </div>
            <div class="content-head-right"><a class="btn btn-primary" href="add-new-products.html">Edit Profile   </a></div>
          </div>
          <div class="content-body mt-5">
            <div class="d-flex"><img src="./assets/img/bx-briefcase.png" alt="" /><span class="ml-3 font-weight-bold">{company_name} </span></div>
            <div class="d-flex mt-4"><img src="./assets/img/bx-map.png" alt="" /><span class="ml-3 font-weight-bold">Darmstadth, Germany</span></div>
            <div class="d-flex mt-4"><img src="./assets/img/bx-phone.png" alt="" /><span class="ml-3 font-weight-bold">{phone_number || 'Not available'}<span class="badge-primary p-2 rounded ml-2 mb-2">Hidden</span></span>
            </div>
            <div class="d-flex mt-4"><img src="./assets/img/bx-envelope.png" alt="" /><span class="ml-3 font-weight-bold">{email}<span class="badge-primary p-2 rounded ml-2 mb-2">Hidden</span></span>
            </div>
            <div class="d-flex mt-4"><img src="./assets/img/icons/headquarter.png" alt="" /><span class="ml-3 font-weight-bold">Millbrook Lea Street , 64283</span></div>
            <div class="d-flex mt-4"><img src="./assets/img/icons/contact-person.png" alt="" width="20px" /><span class="ml-3 font-weight-bold">Contact Person</span></div>
            <div class="d-flex mt-4 contact_person">
              <div class="item d-flex flex-column">
                <h4>Ria Quirin </h4><span class="mb-2">Ria@yahoo.com</span><span>+49 301234567</span></div>
              <div class="item ml-4 d-flex flex-column">
                <h4>Meine Ferdi </h4><span class="mb-2">Meine@yahoo.com</span><span>+49 9877458547</span></div>
              <div class="item ml-4 d-flex flex-column">
                <h4>Rosa Renata </h4><span class="mb-2">Rosa@yahoo.com</span><span>+49 9877458547</span></div>
            </div>
          </div>
        </Fragment>
      );
    }

  }
}

function mapStateToProps(state) {
  return { profile: state.profile }
}
export default connect(mapStateToProps, { getProfile })(ViewProfile);