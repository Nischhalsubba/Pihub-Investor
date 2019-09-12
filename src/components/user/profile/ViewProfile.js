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
      const { fname, lname, company_name, email, phone_number, status } = this.props.profile;
      return (
        <Fragment>
          <div className="content-head">
            <div className="content-head-left">
              <div className="row">
                <div className="col-2 position-relative"><img src="/assets/img/profile-picture.png" alt="alt" /><img className="verify" src="/assets/img/verify.png" alt="alt" /></div>
                <div className="col-10">
                  <h2>{fname} {lname}<span className="badge-primary p-2 rounded ml-2">{status === 'approved' ? 'Verified' : 'Unverified'}</span></h2><span className="mt-2">Darmstadth, Germany</span>
                  <p className="mt-2">Born in small family, worked my way to this point, now an entrepreneur helping startup touch the sky</p>
                  <div className="d-flex social-media">
                    <a href="#" target="_blank" rel="noopener noreferrer"><img className="mr-3" src="/assets/img/icons/facebook.png" alt="alt" width="25px" height="25px" /></a>
                    <a href="#" target="_blank" rel="noopener noreferrer"><img className="mr-3" src="/assets/img/icons/twitter.png" alt="alt" width="25px" height="25px" /></a>
                    <a href="#" target="_blank" rel="noopener noreferrer"><img src="/assets/img/icons/linkedin.png" alt="alt" width="25px" height="25px" /></a>
                  </div>
                </div>
              </div>
            </div>
            <div className="content-head-right"><Link to='user/edit-profile' className="btn btn-primary" href="add-new-products.html">Edit Profile   </Link></div>
          </div>
          <div className="content-body mt-5">
            <div className="d-flex"><img src="./assets/img/bx-briefcase.png" alt="" /><span className="ml-3 font-weight-bold">{company_name} </span></div>
            <div className="d-flex mt-4"><img src="./assets/img/bx-map.png" alt="" /><span className="ml-3 font-weight-bold">Darmstadth, Germany</span></div>
            <div className="d-flex mt-4"><img src="./assets/img/bx-phone.png" alt="" /><span className="ml-3 font-weight-bold">{phone_number || 'Not available'}<span className="badge-primary p-2 rounded ml-2 mb-2">Hidden</span></span>
            </div>
            <div className="d-flex mt-4"><img src="./assets/img/bx-envelope.png" alt="" /><span className="ml-3 font-weight-bold">{email}<span className="badge-primary p-2 rounded ml-2 mb-2">Hidden</span></span>
            </div>
            <div className="d-flex mt-4"><img src="./assets/img/icons/headquarter.png" alt="" /><span className="ml-3 font-weight-bold">Millbrook Lea Street , 64283</span></div>
            <div className="d-flex mt-4"><img src="./assets/img/icons/contact-person.png" alt="" width="20px" /><span className="ml-3 font-weight-bold">Contact Person</span></div>
            <div className="d-flex mt-4 contact_person">
              <div className="item d-flex flex-column">
                <h4>Ria Quirin </h4><span className="mb-2">Ria@yahoo.com</span><span>+49 301234567</span></div>
              <div className="item ml-4 d-flex flex-column">
                <h4>Meine Ferdi </h4><span className="mb-2">Meine@yahoo.com</span><span>+49 9877458547</span></div>
              <div className="item ml-4 d-flex flex-column">
                <h4>Rosa Renata </h4><span className="mb-2">Rosa@yahoo.com</span><span>+49 9877458547</span></div>
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