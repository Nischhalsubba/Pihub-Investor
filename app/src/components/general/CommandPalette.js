import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

const COMMANDS = [
  { label: 'Opportunity book', meta: 'Browse and manage all opportunities.', path: '/products', shortcut: 'P', icon: 'bx bx-bar-chart-square', keywords: 'products opportunities facilities book' },
  { label: 'Credit requests', meta: 'View and process incoming credit requests.', path: '/credit-request', shortcut: 'C', icon: 'bx bx-receipt', keywords: 'credit requests applications review queue' },
  { label: 'Invested positions', meta: 'Monitor deployed capital and position exposure.', path: '/products-invested', shortcut: 'I', icon: 'bx bx-line-chart', keywords: 'invested portfolio positions exposure' },
  { label: 'Institution profile', meta: 'Manage institutional identity and contacts.', path: '/user/profile', shortcut: 'A', icon: 'bx bx-buildings', keywords: 'profile institution entity account contacts' },
  { label: 'Register opportunity', meta: 'Create a new investment opportunity.', path: '/opportunities/new', shortcut: 'N', icon: 'bx bx-plus', keywords: 'new add create register opportunity product' }
];

const isTypingTarget = target => target && (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable);

class CommandPalette extends Component {
  state = { open: false, query: '', activeIndex: 0 };
  inputRef = React.createRef();
  dialogRef = React.createRef();
  previousFocus = null;

  componentDidMount() {
    window.addEventListener('keydown', this.onGlobalKeyDown);
    window.addEventListener('pihub:command-open', this.open);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onGlobalKeyDown);
    window.removeEventListener('pihub:command-open', this.open);
  }

  getFilteredCommands = () => {
    const query = this.state.query.trim().toLowerCase();
    return query ? COMMANDS.filter(command => `${command.label} ${command.meta} ${command.keywords}`.toLowerCase().includes(query)) : COMMANDS;
  };

  getFocusable = () => this.dialogRef.current
    ? Array.from(this.dialogRef.current.querySelectorAll('input,button:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])')).filter(element => !element.hasAttribute('hidden'))
    : [];

  open = () => {
    if (this.state.open) return;
    this.previousFocus = document.activeElement;
    this.setState({ open: true, query: '', activeIndex: 0 }, () => window.requestAnimationFrame(() => this.inputRef.current && this.inputRef.current.focus()));
  };

  close = () => {
    if (!this.state.open) return;
    const focusTarget = this.previousFocus;
    this.setState({ open: false, query: '', activeIndex: 0 }, () => {
      this.previousFocus = null;
      if (focusTarget && focusTarget.focus && document.documentElement.contains(focusTarget)) window.requestAnimationFrame(() => focusTarget.focus());
    });
  };

  navigate = command => {
    if (!command) return;
    this.close();
    this.props.history.push(command.path);
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
      const commands = this.getFilteredCommands();
      if (event.key === 'ArrowDown') { event.preventDefault(); this.setState(state => ({ activeIndex: commands.length ? (state.activeIndex + 1) % commands.length : 0 })); return; }
      if (event.key === 'ArrowUp') { event.preventDefault(); this.setState(state => ({ activeIndex: commands.length ? (state.activeIndex - 1 + commands.length) % commands.length : 0 })); return; }
      if (event.key === 'Enter') { event.preventDefault(); this.navigate(commands[this.state.activeIndex]); }
      return;
    }

    if (isTypingTarget(event.target) || !event.altKey || event.metaKey || event.ctrlKey) return;
    const command = COMMANDS.find(item => item.shortcut.toLowerCase() === event.key.toLowerCase());
    if (command) { event.preventDefault(); this.navigate(command); }
  };

  render() {
    if (!this.state.open) return null;
    const commands = this.getFilteredCommands();
    return (
      <div className="ap-command-layer" role="presentation">
        <button className="ap-command-scrim" type="button" aria-label="Close command menu" onClick={this.close} />
        <section ref={this.dialogRef} className="ap-command" role="dialog" aria-modal="true" aria-label="PiHub command menu">
          <div className="ap-command-search"><i className="bx bx-search" aria-hidden="true" /><label className="sr-only" htmlFor="pihub-command-search">Search commands</label><input ref={this.inputRef} id="pihub-command-search" value={this.state.query} onChange={event => this.setState({ query: event.target.value, activeIndex: 0 })} placeholder="Search navigation or action…" autoComplete="off" /><kbd>Esc</kbd></div>
          <div className="ap-command-section-label">Workspace commands</div>
          <div className="ap-command-list" aria-label="Commands">
            {commands.length ? commands.map((command, index) => (
              <button type="button" key={command.path} className={index === this.state.activeIndex ? 'ap-command-row is-active' : 'ap-command-row'} onMouseEnter={() => this.setState({ activeIndex: index })} onClick={() => this.navigate(command)}>
                <span className="ap-command-icon" aria-hidden="true"><i className={command.icon} /></span>
                <span className="ap-command-copy"><strong>{command.label}</strong><small>{command.meta}</small></span>
                <kbd>Alt {command.shortcut}</kbd>
              </button>
            )) : <div className="ap-command-empty">No matching command.</div>}
          </div>
          <footer className="ap-command-footer"><span>↑↓ navigate</span><span>Enter select</span><span>Ctrl/Cmd K toggle</span></footer>
        </section>
      </div>
    );
  }
}

export default withRouter(CommandPalette);
