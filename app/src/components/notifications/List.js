import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { getNotificationList, markAsRead } from '../../actions/notification';
import Translate from 'react-translate-component';
import Subheader from '../general/Subheader';

const Translator = Translate;

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

  markAsRead = (id, isRead) => {
    if (isRead !== 0) return;
    this.props.markAsRead(id, () => this.setState({ refresh: !this.state.refresh }));
  };

  renderNotification = notifications => {
    if (!notifications.length) {
      const isGerman = Translator.getLocale() === 'de';
      return (
        <li className="notification-empty">
          <i className="bx bx-bell-off" aria-hidden="true" />
          <strong>{isGerman ? 'Keine neuen Benachrichtigungen' : 'No new notifications'}</strong>
          <span>{isGerman ? 'Neue Benachrichtigungen erscheinen hier.' : 'New notifications will appear here.'}</span>
        </li>
      );
    }

    return notifications.map(notification => {
      const isUnread = notification.is_read === 0;
      return (
        <li className={isUnread ? 'notification-row is-unread' : 'notification-row'} key={notification.id}>
          <button
            type="button"
            className="notification-button"
            onClick={() => this.markAsRead(notification.id, notification.is_read)}
            disabled={!isUnread}
            aria-label={isUnread ? `${notification.notification}. Mark as read.` : notification.notification}
          >
            <span className="notification-state" aria-hidden="true" />
            <span className="notification-copy">
              <strong>{notification.notification}</strong>
              <small>{isUnread ? (Translator.getLocale() === 'de' ? 'Ungelesen' : 'Unread') : (Translator.getLocale() === 'de' ? 'Gelesen' : 'Read')}</small>
            </span>
            {isUnread ? <i className="bx bx-check notification-action-icon" aria-hidden="true" /> : null}
          </button>
        </li>
      );
    });
  };

  render() {
    const notifications = this.props.list && this.props.list.notificationList
      ? this.props.list.notificationList
      : null;

    return (
      <Fragment>
        <Subheader heading={<Translate content="label.notifications" />} />
        <section className="notification-shell" data-motion="table-shell" aria-label="Notifications">
          <div className="table-caption">
            <div>
              <strong><Translate content="label.notifications" /></strong>
              <span>
                {notifications
                  ? `${notifications.length} ${Translator.getLocale() === 'de' ? 'Einträge' : 'items'}`
                  : (Translator.getLocale() === 'de' ? 'Wird geladen' : 'Loading')}
              </span>
            </div>
          </div>
          {notifications ? (
            <ul className="notification-feed">{this.renderNotification(notifications)}</ul>
          ) : (
            <div className="data-loading" role="status" aria-live="polite"><Translate content="placeholder.justASecond" /></div>
          )}
        </section>
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return { list: state.notificationList };
}

export default connect(mapStateToProps, { getNotificationList, markAsRead })(Notifications);
