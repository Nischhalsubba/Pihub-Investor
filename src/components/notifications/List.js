import React, { Component, Fragment } from 'react';

class Notifications extends Component {

  componentDidMount(){
    document.title = "Notifications"
  }

  render() {
    return (
        <Fragment>
            <div class="content-head">
                <div class="content-head-left">
                    <h1 class="content-head__title">Notifications</h1>
                </div>
            </div>
            <div class="content-body mt-2">
                <ul class="notification p-0">
                    <li class="notification-item d-flex flex-row align-items-top mb-3 pb-3">
                        <div class="status wait mr-4"></div>
                        <div class="title">
                            <p class="wait">Your product "IT Information" needs more information</p>
                            <div class="time">20 Minutes ago</div>
                        </div>
                    </li>
                    <li class="notification-item d-flex flex-row align-items-top mb-3 pb-3">
                        <div class="status sucess mr-4"></div>
                        <div class="title">
                            <p class="wait">Your product "IT Information" needs more information</p>
                            <div class="time">2 days ago</div>
                        </div>
                    </li>
                    <li class="notification-item d-flex flex-row align-items-top mb-3 pb-3">
                        <div class="status stop mr-4"></div>
                        <div class="title">
                            <p class="wait">Your product "IT Information" needs more information</p>
                            <div class="time">on August 3</div>
                        </div>
                    </li>
                    <li class="notification-item d-flex flex-row align-items-top mb-3 pb-3">
                        <div class="status wait mr-4"></div>
                        <div class="title">
                            <p class="wait">Your product "IT Information" needs more information</p>
                            <div class="time">20 Minutes ago</div>
                        </div>
                    </li>
                    <li class="notification-item d-flex flex-row align-items-top mb-3 pb-3">
                        <div class="status sucess mr-4"></div>
                        <div class="title">
                            <p class="wait">Your product "IT Information" needs more information</p>
                            <div class="time">2 days ago</div>
                        </div>
                    </li>
                    <li class="notification-item d-flex flex-row align-items-top mb-3 pb-3">
                        <div class="status stop mr-4"></div>
                        <div class="title">
                            <p class="wait">Your product "IT Information" needs more information</p>
                            <div class="time">on August 3</div>
                        </div>
                    </li>
                </ul>
            </div>            
        </Fragment>
    );
  }
}


export default (Notifications);
