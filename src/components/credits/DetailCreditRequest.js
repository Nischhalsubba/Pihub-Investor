import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Subheader from '../general/Subheader';

class DetailCreditRequest extends Component {
  componentDidMount() {
    // get the id of the product and send request//
  }
  renderTableData = data => {
    return (
      <tr>
        <td>
          {' '}
          <a href="">Reprehenderit Marshall</a>
        </td>
        <td>
          <a href="">07/04/1927</a>
        </td>
        <td class="text-right-piehub-table font-weight-bold">$238638</td>
        <td class="text-right-piehub-table">
          <a class="mr-1" href="">
            <img src="assets/img/icons/bx-check-circle.svg" alt="accepted" />
          </a>
          <a href="">
            {' '}
            <img src="assets/img/icons/bx-x-circle.svg" alt="rejected" />
          </a>
        </td>
      </tr>
    );
  };
  render() {
    return (
      <Fragment>
        <Subheader heading="Credit Request on IT investment" />
        <div class="content-body credit-request">
          <div class="row justify-content-between w-100">
            <div class="col-lg-12 col-xl-8">
              <p>
                In computer programming, a placeholder is a character, word, or
                string of characters that may be used to take up space until
                such a time that the space is needed. For example, a programmer
                may know that she needs a certain number of values or variables,
                but doesn't yet know what to input. She can use a placeholder as
                a temporary solution until a proper value or variable can be
                assigned.
              </p>
              <p>
                A placeholder in programming code may also be used to indicate
                where specific code needs to be added, but the programmer has
                not yet written the code. The placeholder reminds the programmer
                where to add the code, or it can be include to let other
                programmers know that additional code still needs to be added
                any programmer in general.
              </p>
              <p>
                Placeholders may also be commented out to prevent the computer
                program from executing part of the code.Alternatively referred
                to as dummy text or filler text, placeholder text is text that
                temporarily "holds a place" in a document for the purpose of
                typesetting and layout. It may be used to preview fonts, spoof
                an e-mail spam filter, or reserve a specific place on a web page
                or other document for images, text, or some other object. For
                example, the designer of an online newsletter may have a
                template that they fill with dummy text so they can get an idea
                of how the layout of a page looks. One of the most common filler
                texts is lorem ipsum
              </p>
              <p>
                Placeholders may also be commented out to prevent the computer
                program from executing part of the code.Alternatively referred
                to as dummy text or filler text, placeholder text is text that
                temporarily "holds a place" in a document for the purpose of
                typesetting and layout. It may be used to preview fonts, spoof
                an e-mail spam filter, or reserve a specific place on a web page
                or other document for images, text, or some other object. For
                example, the designer of an online newsletter may have a
                template that they fill with dummy text so they can get an idea
                of how the layout of a page looks. One of the most common filler
                texts is lorem ipsum
              </p>
              <div class="row mt-5 credit-request-stat">
                <div class="col col md-4">
                  <h4>Interest</h4>
                  <p>10%</p>
                </div>
                <div class="col col md-4 stat-alignment-right">
                  <h4>Minimum Credit amount</h4>
                  <p>$4500</p>
                </div>
                <div class="col col md-4 stat-alignment-right">
                  <h4>Region of interest</h4>
                  <p>Information Technology</p>
                </div>
              </div>
            </div>
            <div class="col-lg-12 col-xl-4 rightbar">
              <div class="amount">
                <h6>Investment available of</h6>
                <h2>$400,000</h2>
                <p class="font-italic">taxes may apply as per country</p>
              </div>
              <div class="investor clearfix mt-5">
                <h6>Investor</h6>
                <div class="investor-profile d-flex align-items-center">
                  <img
                    src="assets/img/investor-profile.jpg"
                    alt="Investor profile picture"
                  />
                  <a class="ml-2" href="#">
                    John Doe
                  </a>
                </div>
              </div>
              <div class="date date-created mt-5">
                <h6>Created on</h6>
                <a href="#">Jan 23, 2019</a>
              </div>
              <div class="date date-expire mt-5">
                <h6>Expies on</h6>
                <a href="#">April 1, 2019</a>
              </div>
            </div>
          </div>
          <div class="attachments mt-4">
            <h4>Attachments</h4>
            <div class="file mb-2">
              <span class="file-name">tax payer investment.docx</span>
              <span class="ml-4 file-size">400.5kb</span>
            </div>
            <div class="file">
              <span class="file-name">investment agreement.pdf</span>
              <span class="ml-4 file-size">322.2kb</span>
            </div>
          </div>
          <div class="requests mt-5">
            <h4>Credit Requests</h4>
            <hr />
            <table
              class="table tablesaw-stack"
              data-tablesaw-mode="stack"
              data-tablesaw-minimap="data-tablesaw-minimap"
            >
              <thead>
                <tr>
                  <th data-tablesaw-sortable-col="data-tablesaw-sortable-col">
                    Requested By
                  </th>
                  <th
                    data-tablesaw-sortable-col="data-tablesaw-sortable-col"
                    data-tablesaw-priority="persist"
                    scope="col"
                  >
                    Requested On
                  </th>
                  <th
                    class="text-right-piehub-table"
                    data-tablesaw-sortable-col="data-tablesaw-sortable-col"
                    scope="col"
                  >
                    Requested Amount
                  </th>
                  <th
                    class="text-right-piehub-table"
                    data-tablesaw-sortable-col="data-tablesaw-sortable-col"
                    scope="col"
                  >
                    Accept/Decline
                  </th>
                </tr>
              </thead>
              <tbody>{this.renderTableData()}</tbody>
            </table>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default connect()(DetailCreditRequest);
