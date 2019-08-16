import React, { Component, Fragment } from 'react';

class Notifications extends Component {

  componentDidMount(){
    document.title = "Notifications"
  }

  render() {
    return (
        <Fragment>
            <div className="content-head">
                <div className="content-head-left">
                    <h1 className="content-head__title">Notifications</h1>
                </div>
            </div>
            <div className="content-body mt-2">
                <ul className="notification p-0">
                    <li className="notification-item d-flex flex-row align-items-top mb-3 pb-3">
                        <div className="status wait mr-4"></div>
                        <div className="title">
                            <p className="wait">Your product "IT Information" needs more information</p>
                            <div className="time">20 Minutes ago</div>
                        </div>
                    </li>
                    <li className="notification-item d-flex flex-row align-items-top mb-3 pb-3">
                        <div className="status sucess mr-4"></div>
                        <div className="title">
                            <p className="wait">Your product "IT Information" needs more information</p>
                            <div className="time">2 days ago</div>
                        </div>
                    </li>
                    <li className="notification-item d-flex flex-row align-items-top mb-3 pb-3">
                        <div className="status stop mr-4"></div>
                        <div className="title">
                            <p className="wait">Your product "IT Information" needs more information</p>
                            <div className="time">on August 3</div>
                        </div>
                    </li>
                    <li className="notification-item d-flex flex-row align-items-top mb-3 pb-3">
                        <div className="status wait mr-4"></div>
                        <div className="title">
                            <p className="wait">Your product "IT Information" needs more information</p>
                            <div className="time">20 Minutes ago</div>
                        </div>
                    </li>
                    <li className="notification-item d-flex flex-row align-items-top mb-3 pb-3">
                        <div className="status sucess mr-4"></div>
                        <div className="title">
                            <p className="wait">Your product "IT Information" needs more information</p>
                            <div className="time">2 days ago</div>
                        </div>
                    </li>
                    <li className="notification-item d-flex flex-row align-items-top mb-3 pb-3">
                        <div className="status stop mr-4"></div>
                        <div className="title">
                            <p className="wait">Your product "IT Information" needs more information</p>
                            <div className="time">on August 3</div>
                        </div>
                    </li>
                </ul>
            </div>            
        </Fragment>
    );
  }
}


export default (Notifications);
