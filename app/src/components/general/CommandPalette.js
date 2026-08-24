import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { gsap } from 'gsap';
import { getProductsList } from '../../actions/product';
import { getCreditRequestList } from '../../actions/credits';
import { getInvestedList } from '../../actions/invested';
import { getProfile } from '../../actions/profile';
import { getRecentWorkspaceItems, rememberWorkspaceItem } from '../../_utils/workspacePreferences';
import { openShortcutHelp } from '../../_utils/workspaceEvents';

const COMMANDS = [
  { label: 'Overview', meta: 'Open the investor workspace overview.', path: '/dashboard', shortcut: 'O', sequence: 'G O', icon: 'bx bx-pulse', keywords: 'dashboard home overview' },
  { label: 'Opportunity book', meta: 'Browse and manage all opportunities.', path: '/products', shortcut: 'P', sequence: 'G P', icon: 'bx bx-bar-chart-square', keywords: 'products opportunities facilities book' },
  { label: 'Credit requests', meta: 'View and process incoming credit requests.', path: '/credit-request', shortcut: 'C', sequence: 'G C', icon: 'bx bx-receipt', keywords: 'credit requests applications review queue' },
  { label: 'Invested positions', meta: 'Monitor deployed capital and position exposure.', path: '/products-invested', shortcut: 'I', sequence: 'G I', icon: 'bx bx-line-chart', keywords: 'invested portfolio positions exposure' },
  { label: 'Institution profile', meta: 'Manage institutional identity and contacts.', path: '/user/profile', shortcut: 'A', icon: 'bx bx-buildings', keywords: 'profile institution entity account contacts' },
  { label: 'Register opportunity', meta: 'Create a new investment opportunity.', path: '/opportunities/new', shortcut: 'N', sequence: 'N O', icon: 'bx bx-plus', keywords: 'new add create register opportunity product' }
];

const isTypingTarget = target => target && (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable);
const reduceMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const text = value => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (typeof value === 'object') return String(value.en || value.de || value.label || value.title || value.name || '');
  return '';
};
const serviceName = product => product && product.service ? text(product.service.name || product.service) : '';

class CommandPalette extends Component {
  state = { open: false, query: '', activeIndex: 0 };
  inputRef = React.createRef();
  dialogRef = React.createRef();
  previousFocus = null;
  animation = null;
  isClosing = false;
  sequencePrefix = '';
  sequenceTimer = null;

  componentDidMount() {
    window.addEventListener('keydown', this.onGlobalKeyDown);
    window.addEventListener('pihub:command-open', this.open);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onGlobalKeyDown);
    window.removeEventListener('pihub:command-open', this.open);
    if (this.animation) this.animation.kill();
    window.clearTimeout(this.sequenceTimer);
  }

  hydrateSearch = () => {
    this.props.getProductsList(1, '', '');
    this.props.getCreditRequestList(1);
    this.props.getInvestedList(1);
    if (!this.props.profile) this.props.getProfile();
  };

  getProducts = () => {
    const list = this.props.products && this.props.products.productsList;
    return list && Array.isArray(list.data) ? list.data.filter(Boolean) : [];
  };

  getRequests = () => {
    const list = this.props.creditRequests && this.props.creditRequests.creditRequests;
    return list && Array.isArray(list.data) ? list.data.filter(Boolean) : [];
  };

  getPositions = () => this.props.investment && Array.isArray(this.props.investment.list) ? this.props.investment.list.filter(Boolean) : [];

  getSearchResults = () => {
    const query = this.state.query.trim().toLowerCase();
    if (!query) return [];
    const items = [];

    this.getProducts().forEach(product => {
      const label = text(product.product_title) || 'Untitled opportunity';
      items.push({ id: `opportunity-${product.id}`, kind: 'Opportunity', icon: 'bx bx-briefcase-alt-2', label, meta: `${serviceName(product) || 'Facility'} · ${text(product.status) || 'Open'}`, path: `/opportunities/${encodeURIComponent(product.id)}`, keywords: `${label} ${serviceName(product)} ${text(product.status)} ${text(product.product_code)}` });
    });

    this.getRequests().forEach((request, index) => {
      const productId = request.product_id || request.id;
      const applicationId = request.application_id || `REQ-${index + 1}`;
      const creditor = text(request.creditor_name) || text(request.requested_by) || 'Creditor';
      const product = text(request.product_title) || text(request.name) || 'Credit request';
      items.push({ id: `credit-${productId}-${applicationId}`, kind: 'Credit request', icon: 'bx bx-receipt', label: creditor, meta: `${product} · ${text(request.status) || 'Pending'}`, path: `/credit-requests/${encodeURIComponent(productId)}/${encodeURIComponent(applicationId)}`, keywords: `${creditor} ${product} ${text(request.status)}` });
    });

    this.getPositions().forEach((position, index) => {
      const productId = position.product_id || position.id;
      const applicationId = position.application_id || `POS-${index + 1}`;
      const product = text(position.product_title) || 'Invested position';
      const creditor = text(position.creditor_name) || 'Portfolio position';
      items.push({ id: `position-${productId}-${applicationId}`, kind: 'Position', icon: 'bx bx-line-chart', label: product, meta: creditor, path: `/positions/${encodeURIComponent(productId)}/${encodeURIComponent(applicationId)}`, keywords: `${product} ${creditor} invested portfolio` });
    });

    const profile = this.props.profile;
    if (profile) {
      const company = text(profile.company_name) || [profile.fname, profile.lname].filter(Boolean).join(' ') || 'Institution profile';
      items.push({ id: 'institution-profile', kind: 'Institution', icon: 'bx bx-buildings', label: company, meta: text(profile.category) || 'Institution profile', path: '/user/profile', keywords: `${company} ${text(profile.email)} ${text(profile.category)} institution profile` });
    }

    return items.filter(item => `${item.label} ${item.meta} ${item.keywords}`.toLowerCase().includes(query)).slice(0, 10);
  };

  getFilteredCommands = () => {
    const query = this.state.query.trim().toLowerCase();
    return query ? COMMANDS.filter(command => `${command.label} ${command.meta} ${command.keywords}`.toLowerCase().includes(query)) : COMMANDS;
  };

  getItems = () => {
    if (this.state.query.trim()) {
      return [...this.getSearchResults().map(item => ({ ...item, itemType: 'result' })), ...this.getFilteredCommands().map(item => ({ ...item, id: `command-${item.path}`, kind: 'Command', itemType: 'command' }))];
    }
    const recent = getRecentWorkspaceItems().map(item => ({ ...item, id: `recent-${item.path}`, kind: item.type === 'page' ? 'Recent page' : 'Recently viewed', icon: item.type === 'opportunity' ? 'bx bx-briefcase-alt-2' : item.type === 'credit' ? 'bx bx-receipt' : item.type === 'position' ? 'bx bx-line-chart' : 'bx bx-history', itemType: 'recent' }));
    return [...recent, ...COMMANDS.map(item => ({ ...item, id: `command-${item.path}`, kind: 'Command', itemType: 'command' }))];
  };

  getFocusable = () => this.dialogRef.current ? Array.from(this.dialogRef.current.querySelectorAll('input,button:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])')).filter(element => !element.hasAttribute('hidden')) : [];

  animateOpen = () => {
    const dialog = this.dialogRef.current;
    const layer = dialog && dialog.closest('.ap-command-layer');
    if (!dialog || !layer || reduceMotion()) return;
    const scrim = layer.querySelector('.ap-command-scrim');
    const rows = dialog.querySelectorAll('.ap-command-row');
    if (this.animation) this.animation.kill();
    this.animation = gsap.timeline({ defaults: { overwrite: 'auto' } });
    if (scrim) this.animation.fromTo(scrim, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.18, ease: 'power2.out' }, 0);
    this.animation.fromTo(dialog, { autoAlpha: 0, y: -14, scale: 0.978, transformOrigin: '50% 0%' }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.32, ease: 'power3.out', clearProps: 'transform,opacity,visibility' }, 0.02);
    if (rows.length) this.animation.fromTo(rows, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.24, stagger: 0.025, ease: 'power2.out', clearProps: 'transform,opacity,visibility' }, 0.08);
  };

  open = event => {
    if (this.state.open || this.isClosing) return;
    const query = event && event.detail && typeof event.detail.query === 'string' ? event.detail.query : '';
    this.previousFocus = document.activeElement;
    this.hydrateSearch();
    this.setState({ open: true, query, activeIndex: 0 }, () => window.requestAnimationFrame(() => {
      this.animateOpen();
      if (this.inputRef.current) this.inputRef.current.focus();
    }));
  };

  finishClose = (focusTarget, afterClose) => {
    this.isClosing = false;
    this.animation = null;
    this.setState({ open: false, query: '', activeIndex: 0 }, () => {
      this.previousFocus = null;
      if (typeof afterClose === 'function') { afterClose(); return; }
      if (focusTarget && focusTarget.focus && document.documentElement.contains(focusTarget)) window.requestAnimationFrame(() => focusTarget.focus());
    });
  };

  close = afterClose => {
    if (!this.state.open || this.isClosing) {
      if (!this.state.open && typeof afterClose === 'function') afterClose();
      return;
    }
    const callback = typeof afterClose === 'function' ? afterClose : null;
    const focusTarget = this.previousFocus;
    const dialog = this.dialogRef.current;
    const layer = dialog && dialog.closest('.ap-command-layer');
    const scrim = layer && layer.querySelector('.ap-command-scrim');
    if (!dialog || reduceMotion()) { this.finishClose(focusTarget, callback); return; }
    this.isClosing = true;
    if (this.animation) this.animation.kill();
    this.animation = gsap.timeline({ defaults: { overwrite: 'auto' }, onComplete: () => this.finishClose(focusTarget, callback) });
    this.animation.to(dialog, { autoAlpha: 0, y: -9, scale: 0.99, duration: 0.15, ease: 'power2.in' }, 0);
    if (scrim) this.animation.to(scrim, { autoAlpha: 0, duration: 0.13, ease: 'power1.in' }, 0.01);
  };

  navigate = item => {
    if (!item || !item.path) return;
    rememberWorkspaceItem({ type: item.kind || item.itemType || 'record', label: item.label, meta: item.meta, path: item.path });
    const go = () => this.props.history.push(item.path);
    if (!this.state.open) go(); else this.close(go);
  };

  trapFocus = event => {
    const focusable = this.getFocusable();
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && (active === first || !this.dialogRef.current.contains(active))) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && active === last) { event.preventDefault(); first.focus(); }
  };

  handleSequence = key => {
    const normalized = key.toLowerCase();
    const routes = { 'g o': '/dashboard', 'g p': '/products', 'g c': '/credit-request', 'g i': '/products-invested', 'n o': '/opportunities/new' };
    if (this.sequencePrefix) {
      const sequence = `${this.sequencePrefix} ${normalized}`;
      this.sequencePrefix = '';
      window.clearTimeout(this.sequenceTimer);
      if (routes[sequence]) { this.props.history.push(routes[sequence]); return true; }
      return false;
    }
    if (normalized === 'g' || normalized === 'n') {
      this.sequencePrefix = normalized;
      window.clearTimeout(this.sequenceTimer);
      this.sequenceTimer = window.setTimeout(() => { this.sequencePrefix = ''; }, 900);
      return true;
    }
    return false;
  };

  onGlobalKeyDown = event => {
    const commandModifier = event.metaKey || event.ctrlKey;
    if (commandModifier && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.state.open ? this.close() : this.open();
      return;
    }

    if (this.state.open) {
      if (event.key === 'Escape') { event.preventDefault(); this.close(); return; }
      if (event.key === 'Tab') { this.trapFocus(event); return; }
      const items = this.getItems();
      if (event.key === 'ArrowDown') { event.preventDefault(); this.setState(state => ({ activeIndex: items.length ? (state.activeIndex + 1) % items.length : 0 })); return; }
      if (event.key === 'ArrowUp') { event.preventDefault(); this.setState(state => ({ activeIndex: items.length ? (state.activeIndex - 1 + items.length) % items.length : 0 })); return; }
      if (event.key === 'Enter') { event.preventDefault(); this.navigate(items[this.state.activeIndex]); }
      return;
    }

    if (isTypingTarget(event.target) || event.metaKey || event.ctrlKey) return;
    if (event.key === '/') { event.preventDefault(); this.open({ detail: { query: '' } }); return; }
    if (event.key === '?') { event.preventDefault(); openShortcutHelp(); return; }
    if (event.altKey) {
      const command = COMMANDS.find(item => item.shortcut.toLowerCase() === event.key.toLowerCase());
      if (command) { event.preventDefault(); this.navigate(command); }
      return;
    }
    if (this.handleSequence(event.key)) event.preventDefault();
  };

  renderRow = (item, index) => (
    <button type="button" key={item.id || item.path} className={index === this.state.activeIndex ? 'ap-command-row is-active' : 'ap-command-row'} onMouseEnter={() => this.setState({ activeIndex: index })} onClick={() => this.navigate(item)}>
      <span className="ap-command-icon" aria-hidden="true"><i className={item.icon || 'bx bx-search-alt'} /></span>
      <span className="ap-command-copy"><strong>{item.label}</strong><small>{item.meta}</small></span>
      <span className="ap-command-kind">{item.kind}</span>
      {item.sequence ? <kbd>{item.sequence}</kbd> : item.itemType === 'command' && item.shortcut ? <kbd>Alt {item.shortcut}</kbd> : null}
    </button>
  );

  render() {
    if (!this.state.open) return null;
    const items = this.getItems();
    const hasQuery = Boolean(this.state.query.trim());
    const resultCount = hasQuery ? this.getSearchResults().length : getRecentWorkspaceItems().length;
    return (
      <div className="ap-command-layer" role="presentation">
        <button className="ap-command-scrim" type="button" aria-label="Close global search" onClick={() => this.close()} />
        <section ref={this.dialogRef} className="ap-command ap-command-global" role="dialog" aria-modal="true" aria-label="PiHub global search and command menu">
          <div className="ap-command-search"><i className="bx bx-search" aria-hidden="true" /><label className="sr-only" htmlFor="pihub-command-search">Search workspace</label><input ref={this.inputRef} id="pihub-command-search" value={this.state.query} onChange={event => this.setState({ query: event.target.value, activeIndex: 0 })} placeholder="Search opportunities, credit requests, positions or actions…" autoComplete="off" /><kbd>Esc</kbd></div>
          <div className="ap-command-section-label">{hasQuery ? `Workspace results${resultCount ? ` · ${resultCount}` : ''}` : (resultCount ? 'Recent and commands' : 'Workspace commands')}</div>
          <div className="ap-command-list" aria-label="Search results and commands">{items.length ? items.map(this.renderRow) : <div className="ap-command-empty"><i className="bx bx-search-alt" aria-hidden="true" /><strong>No matching workspace item.</strong><span>Try a company, opportunity, facility or status.</span></div>}</div>
          <footer className="ap-command-footer"><span>↑↓ navigate</span><span>Enter open</span><button type="button" onClick={openShortcutHelp}>? shortcuts</button></footer>
        </section>
      </div>
    );
  }
}

export default connect(state => ({ products: state.productsList, creditRequests: state.creditRequests, investment: state.investment, profile: state.profile }), { getProductsList, getCreditRequestList, getInvestedList, getProfile })(withRouter(CommandPalette));
