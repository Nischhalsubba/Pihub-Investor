import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { getApplicationDetail } from '../../actions/application';
import Translate from '../../i18n/Translate';
import { changeStatus } from '../../actions/changeStatus';
import CreditInfo from './CreditInfo';
import ActivityTimeline from '../general/ActivityTimeline';
import { showToast } from '../../_utils/workspaceEvents';

import Translator from '../../i18n/Translate';

class DetailCreditRequest extends Component {
  state = { detail: null, refresh: false };

  componentDidMount() {
    if (!this.props.location.state) { this.props.history.push('/products'); return; }
    this.fetchDetail();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.data !== prevProps.data && this.props.data) this.setState({ detail: this.props.data.detail });
    if (this.state.refresh !== prevState.refresh) this.fetchDetail();
  }

  getIds = () => {
    const state = this.props.location.state || {};
    return { pId: state.pId || state.productId, aId: state.aId || state.appId };
  };

  fetchDetail = () => {
    const { pId, aId } = this.getIds();
    if (pId && aId) this.props.getApplicationDetail(pId, aId);
  };

  changeStatus = status => {
    const isGerman = Translator.getLocale() === 'de';
    const message = status === 'accepted' ? (isGerman ? 'Diese Kreditanfrage annehmen?' : 'Accept this credit request?') : (isGerman ? 'Diese Kreditanfrage ablehnen?' : 'Reject this credit request?');
    if (!window.confirm(message)) return;
    const { pId, aId } = this.getIds();
    this.props.changeStatus(pId, aId, status, () => {
      this.setState({ refresh: !this.state.refresh });
      showToast(status === 'accepted' ? 'Credit request accepted and moved into the portfolio workflow.' : 'Credit request rejected.', { type: status === 'accepted' ? 'success' : 'info', title: 'Decision recorded' });
    });
  };

  activityItems = detail => {
    const status = detail.status || 'requested';
    const items = [
      { id: 'status', label: `Decision state: ${status}`, meta: 'Current credit workflow status' },
      { id: 'deadline', label: 'Decision deadline established', meta: detail.deadline ? new Date(detail.deadline).toLocaleDateString() : 'No deadline supplied' },
      { id: 'request', label: 'Credit request submitted', meta: detail.requested_by || 'Creditor', createdAt: detail.requested_on }
    ];
    if (status === 'accepted') items.unshift({ id: 'accepted', label: 'Credit request accepted', meta: 'The request is eligible for portfolio conversion.' });
    if (status === 'rejected') items.unshift({ id: 'rejected', label: 'Credit request rejected', meta: 'The decision record remains available for audit.' });
    return items;
  };

  render() {
    const detail = this.state.detail;
    if (!detail) return <div className="data-loading" role="status" aria-live="polite"><Translate content="placeholder.justASecond" /></div>;
    const isGerman = Translator.getLocale() === 'de';
    const { status } = detail;

    return <Fragment>
      <CreditInfo location={this.props.location} detail={detail} />
      <ActivityTimeline title={isGerman ? 'Entscheidungsverlauf' : 'Credit activity'} description={isGerman ? 'Zeitlicher Verlauf dieser Kreditanfrage.' : 'Decision and deadline events for this credit request.'} items={this.activityItems(detail)} />
      <section className="decision-panel" aria-label={isGerman ? 'Entscheidung' : 'Decision'}>
        <div className="decision-copy"><span>{isGerman ? 'Entscheidung' : 'Decision'}</span><strong>{isGerman ? 'Kreditanfrage prüfen' : 'Review credit request'}</strong><p>{isGerman ? 'Bestätigen Sie die Anfrage erst nach Prüfung der Beträge, Fristen, Sicherheiten und Unterlagen.' : 'Confirm the request only after reviewing amounts, deadlines, collateral and documents.'}</p></div>
        <div className="decision-actions"><button className="btn btn-danger" type="button" disabled={status === 'rejected'} onClick={() => this.changeStatus('rejected')}><i className="bx bx-x" aria-hidden="true" /><Translate content="label.reject" /></button><button className="btn btn-primary" type="button" disabled={status === 'accepted'} onClick={() => this.changeStatus('accepted')}><i className="bx bx-check" aria-hidden="true" /><Translate content="label.accept" /></button></div>
      </section>
    </Fragment>;
  }
}

function mapStateToProps(state) { return { data: state.applicationDetail }; }
export default connect(mapStateToProps, { getApplicationDetail, changeStatus })(DetailCreditRequest);
