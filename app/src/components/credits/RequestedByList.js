import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getApplicationList } from '../../actions/application';
import { Link, withRouter } from 'react-router-dom';
import Translate from 'react-translate-component';
import { ToEuro } from '../general/CurrencyFormatter';
import { dDigit } from '../../_utils/misc';
import { matchesInvestorStatus } from '../../_status';

const Translator = Translate;

class RequestedByList extends Component {
  state = { list: [] };

  componentDidMount() {
    this.props.getApplicationList(this.props.id);
  }

  componentDidUpdate(prevProps) {
    if (this.props.id !== prevProps.id) this.props.getApplicationList(this.props.id);
    if (prevProps.data !== this.props.data && this.props.data && this.props.data.list) {
      this.setState({ list: this.props.data.list.data || [] });
    }
  }

  formatDate = value => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return `${dDigit(date.getDate())}.${dDigit(date.getMonth() + 1)}.${date.getFullYear()}`;
  };

  renderStatus = status => {
    const meta = matchesInvestorStatus[status];
    return meta
      ? <span className={`badge ${meta.class}`}><Translate content={meta.translation_key} /></span>
      : <span className="badge badge-light">{status || '—'}</span>;
  };

  renderList = (list, name) => {
    if (!list.length) {
      return (
        <tr>
          <td colSpan="5">
            <div className="data-empty data-empty-compact">
              <strong><Translate content="placeholder.noCreditRequests" /></strong>
            </div>
          </td>
        </tr>
      );
    }

    return list.map(data => {
      const target = data.status === 'invested'
        ? { pathname: '/creditor/detail', state: { productId: this.props.id, appId: data.id } }
        : { pathname: '/application', state: { pId: this.props.id, aId: data.id, product: name } };

      return (
        <tr key={data.id}>
          <td><Link className="entity-title" to={target}>{data.requested_by}</Link><small className="entity-meta">#{data.id}</small></td>
          <td className="data-nowrap mono-value">{this.formatDate(data.deadline)}</td>
          <td className="data-nowrap"><span className="mono-value">{data.duration}</span> <Translate content="label.months" /></td>
          <td className="data-nowrap money-value"><ToEuro amount={data.requested_amount} /></td>
          <td>{this.renderStatus(data.status)}</td>
        </tr>
      );
    });
  };

  render() {
    const isGerman = Translator.getLocale() === 'de';
    const list = this.state.list;

    return (
      <section className="table-shell requested-by-shell" data-motion="table-shell" aria-label={isGerman ? 'Kreditanfragen' : 'Credit requests'}>
        <div className="table-caption">
          <div>
            <strong><Translate content="label.creditrequests" /></strong>
            <span>{list.length} {isGerman ? 'Anfragen für dieses Produkt' : 'requests for this product'}</span>
          </div>
          <small>EUR</small>
        </div>
        <div className="table-scroll">
          <table className="table" data-tablesaw-mode="stack">
            <thead>
              <tr>
                <th><Translate content="label.Kreditorname" /></th>
                <th><Translate content="label.deadline" /></th>
                <th><Translate content="label.timeduration" /></th>
                <th><Translate content="column.requestedamount" /></th>
                <th><Translate content="column.status" /></th>
              </tr>
            </thead>
            <tbody>{this.renderList(list, this.props.name)}</tbody>
          </table>
        </div>
        {this.props.errMsg && this.props.errMsg.error ? <div className="inline-error" role="alert">{this.props.errMsg.error}</div> : null}
      </section>
    );
  }
}

function mapStateToProps(state) {
  return { data: state.applicationList, errMsg: state.error };
}

export default connect(mapStateToProps, { getApplicationList })(withRouter(RequestedByList));
