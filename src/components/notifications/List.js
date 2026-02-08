import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { getNotificationList, markAsRead } from '../../actions/notification';
import Translate from 'react-translate-component'
import { motion } from 'framer-motion';
import AnimatedCard from '../general/AnimatedCard';

const listVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.04, delayChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 }
};
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
      return (
        <li className="notification-empty">
          <Translate content='label.youdont' />
        </li>
      );
      //  <span>You dont have any new notifications</span>;
    }
    return notifications.map((notification, index) => {
      let color;
      notification.is_read === 0 ? (color = 'sucess') : (color = 'wait');
      return (
        <Fragment key={index}>
          <motion.li
            className="notification-item d-flex flex-row align-items-top mb-3 pb-3"
            onClick={() =>
              this.markAsRead(notification.id, notification.is_read)
            }
            variants={itemVariants}
            whileHover={{ x: 2 }}
          >
            <div className={`status ${color} mr-4`} />
            <div className="title">
              <p className="wait">{notification.notification}</p>
              <div className="time">20 Minutes ago</div>
            </div>
          </motion.li>
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
              {/* <h1 className="content-head__title">Notifications</h1> */}
              <Translate content='label.notifications' component="h1" className="content-head__title" />
            </div>
          </div>
          <AnimatedCard className="content-body mt-2">
            <motion.ul className="notification p-0" variants={listVariants} initial="hidden" animate="visible">
              {this.props.list.notificationList
                ? this.renderNotification(this.props.list.notificationList)
                : null}
            </motion.ul>
          </AnimatedCard>
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <div className="content-head">
            <div className="content-head-left">
            <Translate content='label.notifications' component="h1" className="content-head__title" />
            </div>
          </div>
          <AnimatedCard className="content-body mt-2">
            <motion.ul className="notification p-0" variants={listVariants} initial="hidden" animate="visible">
              <span><Translate content="placeholder.justASecond"/></span>
            </motion.ul>
          </AnimatedCard>
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
