import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

const COMMANDS = [
  { code: 'OB/01', label: 'Opportunity book', meta: 'Products and facilities', path: '/products', key: '1', keywords: 'products opportunities facilities book' },
  { code: 'CR/02', label: 'Credit requests', meta: 'Review and decision queue', path: '/credit-request', key: '2', keywords: 'credit requests applications review queue' },
  { code: 'IP/03', label: 'Invested positions', meta: 'Capital deployment and exposure', path: '/products-invested', key: '3', keywords: 'invested portfolio positions exposure' },
  { code: 'IPR/04', label: 'Institution profile', meta: 'Entity record and contacts', path: '/user/profile', key: '4', keywords: 'profile institution entity account' },
  { code: 'NO/05', label: 'Register opportunity', meta: 'Create a new financing opportunity', path: '/add-product', key: 'N', keywords: 'new add create register opportunity product' }
];

const isTypingTarget = target => {
  if (!target) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
};

class CommandPalette extends Component {
  state = { open: false, query: '', activeIndex: 0 };
  inputRef = React.createRef();

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
    if (!query) return COMMANDS;
    return COMMANDS.filter(command => `${command.code} ${command.label} ${command.meta} ${command.keywords}`.toLowerCase().indexOf(query) !== -1);
  };

  open = () => {
    this.setState({ open: true, query: '', activeIndex: 0 }, () => {
      window.requestAnimationFrame(() => {
        if (this.inputRef.current) this.inputRef.current.focus();
      });
    });
  };

  close = () => this.setState({ open: false, query: '', activeIndex: 0 });

  navigate = command => {
    if (!command) return;
    this.close();
    this.props.history.push(command.path);
  };

  onGlobalKeyDown = event => {
    const modifier = event.metaKey || event.ctrlKey;
    if (modifier && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (this.state.open) this.close();
      else this.open();
      return;
    }

    if (this.state.open) {
      if (event.key === 'Escape') {
        event.preventDefault();
        this.close();
        return;
      }

      const commands = this.getFilteredCommands();
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.setState(state => ({ activeIndex: commands.length ? (state.activeIndex + 1) % commands.length : 0 }));
        return;
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.setState(state => ({ activeIndex: commands.length ? (state.activeIndex - 1 + commands.length) % commands.length : 0 }));
        return;
      }
      if (event.key === 'Enter') {
        event.preventDefault();
        this.navigate(commands[this.state.activeIndex]);
      }
      return;
    }

    if (isTypingTarget(event.target) || event.metaKey || event.ctrlKey || event.altKey) return;
    const quickCommand = COMMANDS.find(command => command.key.toLowerCase() === event.key.toLowerCase());
    if (quickCommand) this.navigate(quickCommand);
  };

  render() {
    if (!this.state.open) return null;
    const commands = this.getFilteredCommands();

    return (
      <div className="ap-command-layer" role="presentation">
        <button className="ap-command-scrim" type="button" aria-label="Close command menu" onClick={this.close} />
        <section className="ap-command" role="dialog" aria-modal="true" aria-label="PiHub command menu">
          <div className="ap-command-search">
            <i className="bx bx-search" aria-hidden="true" />
            <label className="sr-only" htmlFor="pihub-command-search">Search commands</label>
            <input
              ref={this.inputRef}
              id="pihub-command-search"
              value={this.state.query}
              onChange={event => this.setState({ query: event.target.value, activeIndex: 0 })}
              placeholder="Search navigation or action"
              autoComplete="off"
            />
            <kbd>ESC</kbd>
          </div>
          <div className="ap-command-section-label">Navigate</div>
          <div className="ap-command-list" role="listbox" aria-label="Commands">
            {commands.length ? commands.map((command, index) => (
              <button
                type="button"
                key={command.path}
                className={index === this.state.activeIndex ? 'ap-command-row is-active' : 'ap-command-row'}
                onMouseEnter={() => this.setState({ activeIndex: index })}
                onClick={() => this.navigate(command)}
                role="option"
                aria-selected={index === this.state.activeIndex}
              >
                <span className="ap-command-code">{command.code}</span>
                <span className="ap-command-copy"><strong>{command.label}</strong><small>{command.meta}</small></span>
                <kbd>{command.key}</kbd>
              </button>
            )) : <div className="ap-command-empty">No matching command.</div>}
          </div>
          <footer className="ap-command-footer"><span>↑↓ Select</span><span>↵ Open</span><span>Ctrl/Cmd K Toggle</span></footer>
        </section>
      </div>
    );
  }
}

export default withRouter(CommandPalette);
