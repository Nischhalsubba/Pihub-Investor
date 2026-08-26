import React from 'react';
import { Link } from 'react-router-dom-v6';
import { DEMO_DEAL, DEMO_MANDATES, euro } from '../../../packages/domain/src/demo-data';
import { getDefaultDemoDestinations } from '../../../packages/platform/src/demo-workflow-store';
import WorkflowJourney from '../../../packages/ui/src/WorkflowJourney';
import { PageHead, Status } from './ui';

const PriorityIcon = () => <span className="ph-priority-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 7h16"/><path d="M7 4 4 7l3 3"/><path d="M20 17H4"/><path d="m17 14 3 3-3 3"/></svg></span>;

export default function AdvisoryOverview() {
  const totalVolume = DEMO_MANDATES.reduce((sum, mandate) => sum + mandate.amount, 0);
  const pipeline = ['Origination', 'Structuring', 'Due diligence', 'Term sheet', 'Documentation', 'Closed'].map(stage => ({ stage, count: DEMO_MANDATES.filter(item => item.stage === stage).length }));
  const maxCount = Math.max(1, ...pipeline.map(item => item.count));
  const execution = [
    { title: 'Confirm lender shortlist', detail: 'Three financing providers remain in the active lender set.', status: 'Today', tone: 'warn' },
    { title: 'Independent valuation sign-off', detail: 'Valuer comments remain open before term-sheet finalization.', status: 'In review', tone: 'warn' },
    { title: 'Refresh sources & uses', detail: 'Update the latest sponsor equity and interest-reserve assumptions.', status: 'Open', tone: '' },
    { title: 'Prepare lender call pack', detail: 'Use the current structure, valuation and DD status.', status: 'Next', tone: '' },
  ];
  const milestones = [
    { date: '25 Aug', title: 'Lender shortlist memo', detail: 'Confirm the active financing-provider set.' },
    { date: '27 Aug', title: 'Sponsor term-sheet comments', detail: 'Resolve remaining commercial comments.' },
    { date: '29 Aug', title: 'Valuation sign-off', detail: 'Close the independent valuation workstream.' },
    { date: '02 Sep', title: 'Documentation kickoff', detail: 'Move into facility documentation after terms align.' },
  ];

  return <>
    <PageHead eyebrow="Advisory / Transaction overview" title="Transaction overview" subtitle="Mandates, structure, counterparties and execution priorities around the same canonical deal record." action={<Link className="ph-button primary" to="/transactions">Open transactions</Link>} />
    <div className="ph-demo">Demo workspace. Advisory state is browser-local and does not claim production transaction persistence, lender publication or shared SSO.</div>
    <div className="ph-focus-row" aria-label="Advisory workspace context"><span className="ph-role-chip is-primary">Advisory mandate</span><span className="ph-role-chip">Owner {DEMO_DEAL.owner}</span><span className="ph-role-chip">{DEMO_DEAL.id} · {DEMO_DEAL.city}</span></div>
    <section className="ph-priority-strip" aria-label="Advisory execution priority"><div className="ph-priority-copy"><PriorityIcon/><span><strong>Term-sheet negotiation is the current execution priority</strong><small>Close sponsor comments, valuation and lender alignment before documentation starts.</small></span></div><Link className="ph-button secondary" to="/execution">Open execution</Link></section>
    <section className="ph-kpi-tape" aria-label="Advisory transaction summary">
      <article className="ph-kpi is-signal"><span className="ph-kpi-label"><i/>Active mandates</span><strong className="ph-kpi-value">{DEMO_MANDATES.length}</strong><span className="ph-kpi-detail">Current advisory pipeline</span></article>
      <article className="ph-kpi"><span className="ph-kpi-label"><i/>Mandated volume</span><strong className="ph-kpi-value is-money">{euro(totalVolume)}</strong><span className="ph-kpi-detail">Visible mandate amount</span></article>
      <article className="ph-kpi is-warning"><span className="ph-kpi-label"><i/>DD workstreams due</span><strong className="ph-kpi-value">2</strong><span className="ph-kpi-detail">Legal and valuation remain open</span></article>
      <article className="ph-kpi is-warning"><span className="ph-kpi-label"><i/>Term sheets negotiating</span><strong className="ph-kpi-value">1</strong><span className="ph-kpi-detail">Sponsor comments due next</span></article>
    </section>
    <div className="ph-dashboard-grid">
      <section className="ph-panel" aria-labelledby="execution-queue-title"><header className="ph-panel-head"><div><strong id="execution-queue-title">Execution queue</strong><span>Operational work that can change transaction timing</span></div><Link to="/tasks">All tasks</Link></header><div className="ph-execution-list">{execution.map(item => <Link className="ph-execution-row" to="/tasks" key={item.title}><span><strong>{item.title}</strong><small>{item.detail}</small></span><Status tone={item.tone}>{item.status}</Status><b>Open</b></Link>)}</div></section>
      <section className="ph-panel" aria-labelledby="pipeline-stage-title"><header className="ph-panel-head"><div><strong id="pipeline-stage-title">Pipeline by stage</strong><span>Mandates currently visible to Advisory</span></div><Link to="/mandates">Mandates</Link></header><div className="ph-pipeline-bars">{pipeline.map(item => <div className="ph-pipeline-row" key={item.stage}><span>{item.stage}</span><div className="ph-pipeline-track" aria-hidden="true"><i style={{ '--width': `${Math.max(item.count ? 18 : 0, (item.count / maxCount) * 100)}%` }}/></div><b>{item.count}</b></div>)}</div></section>
    </div>
    <div className="ph-dashboard-grid is-balanced" style={{ marginTop: 12 }}>
      <section className="ph-panel" aria-labelledby="priority-transaction-title"><header className="ph-panel-head"><div><strong id="priority-transaction-title">Priority transaction</strong><span>Canonical deal context</span></div><Link to="/transactions">Open deal</Link></header><dl className="ph-kv"><dt>Deal</dt><dd>{DEMO_DEAL.id}</dd><dt>Client</dt><dd>{DEMO_DEAL.borrower}</dd><dt>Structure</dt><dd>{DEMO_DEAL.structure}</dd><dt>Amount</dt><dd>{euro(DEMO_DEAL.requestedAmount)}</dd><dt>Pricing</dt><dd>{DEMO_DEAL.pricing}</dd><dt>Security</dt><dd>{DEMO_DEAL.lien}</dd></dl></section>
      <section className="ph-panel" aria-labelledby="advisory-milestones-title"><header className="ph-panel-head"><div><strong id="advisory-milestones-title">Upcoming milestones</strong><span>Execution dates for the current transaction</span></div></header><div className="ph-timeline">{milestones.map(item => <div className="ph-timeline-item" key={item.title}><span className="ph-timeline-date">{item.date}</span><span className="ph-timeline-dot" aria-hidden="true"/><span className="ph-timeline-copy"><strong>{item.title}</strong><small>{item.detail}</small></span></div>)}</div></section>
    </div>
    <WorkflowJourney applicationId="advisory" destinations={getDefaultDemoDestinations(import.meta.env)} />
  </>;
}
