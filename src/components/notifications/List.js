import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { getNotificationList } from '../../actions/notification';
class Notifications extends Component {
  componentDidMount() {
    document.title = 'Notifications';
    this.props.getNotificationList(1);
  }
  renderNotification = notifications => {
    if (notifications.length === 0) {
      return <span>You dont have any new notifications</span>;
    }
    return notifications.map((notification, index) => {
      return (
        <li className="notification-item d-flex flex-row align-items-top mb-3 pb-3">
          <div className="status wait mr-4" />
          <div className="title">
            <p className="wait">
              Your product "IT Information" needs more information
            </p>
            <div className="time">20 Minutes ago</div>
          </div>
        </li>
      );
    });
  };
  render() {
    if (this.props.list) {
      return (
        <Fragment>
          <div className="content-head">
            <div className="content-head-left">
              <h1 className="content-head__title">Notifications</h1>
            </div>
          </div>
          <div className="content-body mt-2">
            <ul className="notification p-0">
              {this.props.list.notificationList
                ? this.renderNotification(this.props.list.notificationList)
                : null}
            </ul>
          </div>
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <div className="content-head">
            <div className="content-head-left">
              <h1 className="content-head__title">Notifications</h1>
            </div>
          </div>
          <div className="content-body mt-2">
            <ul className="notification p-0">
              <span>Just a second</span>
            </ul>
          </div>
        </Fragment>
      );
    }
  }
}

function mapStateToProps(state) {
  return { list: state.notificationList };
}
export default connect(
  mapStateToProps,
  { getNotificationList }
)(Notifications);
