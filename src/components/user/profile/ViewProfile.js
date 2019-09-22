import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
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
      const { fname, lname, company_name, email, phone_number, status, category, company_logo_link, contact_email_1, contact_email_2, contact_email_3, contact_phone_no_1, contact_phone_no_2, contact_phone_no_3, document_link, contact_name_1, contact_name_2, contact_name_3, facebook_link, linked_in_link, twitter_link, street_address, headquarter, zip_code } = this.props.profile;
      console.log('p', this.props.profile)
      console.log(document_link)
      console.log(company_logo_link)
      return (
        <Fragment>
          <div class="content-head">
            <div class="content-head-left w-50">
              <div class="d-flex company-image">
                <div class="item position-relative">
                  <img src={company_logo_link} alt="alt" width="120px" height="120px" />
                  <img class="verify" src="/assets/img/verify.png" alt="alt" />
                </div>
                <div class="item ml-4">
                  <h2>{company_name}
                    <span class="badge-primary p-2 rounded ml-2">{status === 'approved' ? 'Verified' : 'Unverified'}</span>
                  </h2>
                  <div class="d-flex social-media mt-2">
                    <a href={facebook_link} target="_blank" rel="noopener noreferrer">
                      <img class="mr-3" src="/assets/img/icons/facebook.png" alt="alt" width="25px" height="25px" />
                    </a>
                    <a href={twitter_link} target="_blank" rel="noopener noreferrer">
                      <img class="mr-3" src="/assets/img/icons/twitter.png" alt="alt" width="25px" height="25px" />
                    </a>
                    <a target="_blank" rel="noopener noreferrer" href={twitter_link}>
                      <img src="/assets/img/icons/linkedin.png" alt="alt" width="25px" height="25px" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div class="content-head-right">
              <Link class="btn btn-primary" to='/user/edit-profile'>Edit Profile </Link>
            </div>
          </div>
          <div class="content-body mt-5">
            <div class="d-flex">
              <img src="/assets/img/bx-briefcase.png" alt="" />
              <span class="ml-3 font-weight-bold">Category:{category}</span>
            </div>
            <div class="d-flex mt-4">
              <figure className="m-0">
                <img src="./assets/img/bx-map.png" alt="" />
              </figure>
              <p class="ml-3 font-weight-bold mb-0">{street_address} <br />{headquarter}, {zip_code}</p>
            </div>
            <div class="d-flex mt-4 phone">
              <img src="/assets/img/bx-phone.png" alt="" />
              <div class="d-flex flex-column">
                <h4 class="ml-3 font-weight-bold">{contact_name_2}</h4>
                <span class="ml-3 mb-2">{contact_email_2}</span>
                <span class="ml-3">{contact_phone_no_2 || '+49 9877458547'}</span>
              </div>
            </div>
            <div class="d-flex mt-4">
              <img src="/assets/img/icons/contact-person.png" alt="" width="20px" />
              <span class="ml-3 font-weight-bold">Contact Person</span>
            </div>
            <div class="d-flex mt-4 contact_person">
              <div class="item d-flex flex-column">
                <h5 class="font-weight-normal">{contact_name_1} </h5>
                <span class="mb-2">{contact_email_1}</span>
                <span>{contact_phone_no_1}</span>
              </div>

              <div class="item ml-4 d-flex flex-column">
                <h5 class="font-weight-normal">{contact_name_3} </h5>
                <span class="mb-2">{contact_email_3}</span>
                <span>{contact_phone_no_3}</span>
              </div>
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