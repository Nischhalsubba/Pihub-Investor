import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { getNotificationList, markAsRead } from '../../actions/notification';
class Notifications extends Component {
  state = { refresh: false };
  componentDidMount() {
    document.title = 'Notifications';
    this.props.getNotificationList(1);
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.refresh !== this.state.refresh) {
      this.props.getNotificationList(1);
    }
  }
  renderNotification = notifications => {
    if (notifications.length === 0) {
      return <span>You dont have any new notifications</span>;
    }
    return notifications.map((notification, index) => {
      let color;
      notification.is_read === 0 ? (color = 'sucess') : (color = 'wait');
      return (
        <Fragment key={index}>
          <li
            className="notification-item d-flex flex-row align-items-top mb-3 pb-3"
            onClick={() =>
              this.markAsRead(notification.id, notification.is_read)
            }
          >
            <div className={`status ${color} mr-4`} />
            <div className="title">
              <p className="wait">{notification.notification}</p>
              <div className="time">20 Minutes ago</div>
            </div>
          </li>
        </Fragment>
      );
    });
  };
  markAsRead = (id, is_read) => {
    if (is_read !== 0) {
      return;
    } else {
      this.props.markAsRead(id, () => {
        this.setState({ refresh: !this.state.refresh });
      });
    }
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
  { getNotificationList, markAsRead }
)(Notifications);
