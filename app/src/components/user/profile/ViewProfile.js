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
      return (
        <Fragment>
          <div className="content-head">
            <div className="content-head-left w-50">
              <div className="d-flex company-image">
                <div className="item position-relative">
                  <img src={company_logo_link} alt="alt" width="120px" height="120px" />
                  <img className="verify" src="/assets/img/verify.png" alt="alt" />
                </div>
                <div className="item ml-4">
                  <h2>{company_name}
                    <span className="badge-primary p-2 rounded ml-2">{status === 'approved' ? 'Verified' : 'Unverified'}</span>
                  </h2>
                  <div className="d-flex social-media mt-2">
                    <a href={facebook_link} target="_blank" rel="noopener noreferrer">
                      <img className="mr-3" src="/assets/img/icons/facebook.png" alt="alt" width="25px" height="25px" />
                    </a>
                    <a href={twitter_link} target="_blank" rel="noopener noreferrer">
                      <img className="mr-3" src="/assets/img/icons/twitter.png" alt="alt" width="25px" height="25px" />
                    </a>
                    <a target="_blank" rel="noopener noreferrer" href={twitter_link}>
                      <img src="/assets/img/icons/linkedin.png" alt="alt" width="25px" height="25px" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="content-head-right">
              <Link className="btn btn-primary" to='/user/edit-profile'>Edit Profile </Link>
            </div>
          </div>
          <div className="content-body mt-5">
            <div className="d-flex">
              <img src="/assets/img/bx-briefcase.png" alt="" />
              <span className="ml-3 font-weight-bold">Category:{category}</span>
            </div>
            <div className="d-flex mt-4">
              <figure className="m-0">
                <img src="./assets/img/bx-map.png" alt="" />
              </figure>
              <p className="ml-3 font-weight-bold mb-0">{street_address} <br />{headquarter}, {zip_code}</p>
            </div>
            <div className="d-flex mt-4 phone">
              <img src="/assets/img/bx-phone.png" alt="" />
              <div className="d-flex flex-column">
                <h4 className="ml-3 font-weight-bold">{contact_name_2}</h4>
                <span className="ml-3 mb-2">{contact_email_2}</span>
                <span className="ml-3">{contact_phone_no_2 || '+49 9877458547'}</span>
              </div>
            </div>
            <div className="d-flex mt-4">
              <img src="/assets/img/icons/contact-person.png" alt="" width="20px" />
              <span className="ml-3 font-weight-bold">Contact Person</span>
            </div>
            <div className="d-flex mt-4 contact_person">
              <div className="item d-flex flex-column">
                <h5 className="font-weight-normal">{contact_name_1} </h5>
                <span className="mb-2">{contact_email_1}</span>
                <span>{contact_phone_no_1}</span>
              </div>

              <div className="item ml-4 d-flex flex-column">
                <h5 className="font-weight-normal">{contact_name_3} </h5>
                <span className="mb-2">{contact_email_3}</span>
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