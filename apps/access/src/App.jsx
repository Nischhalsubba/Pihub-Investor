import React from 'react';
import { APPLICATIONS } from '../../../packages/platform/src/application-registry';
import { getWorkspaceLinks } from './links';

const copy = {
  investor: { eyebrow: 'CAPITAL PROVIDERS', title: 'Investor / Lender', description: 'Review opportunities, underwrite risk, make credit decisions and monitor funded positions.' },
  borrower: { eyebrow: 'FINANCING', title: 'Borrower / Origination', description: 'Submit financing information, provide documents, answer requests and follow progress through closing.' },
  advisory: { eyebrow: 'TRANSACTIONS', title: 'Advisory / Structuring', description: 'Manage mandates, financing structures, counterparties, due diligence and execution milestones.' },
  admin: { eyebrow: 'CONTROL PLANE', title: 'Admin / Compliance', description: 'Manage organizations, user access, compliance state and platform audit context.' },
};

const ids = ['investor', 'borrower', 'advisory', 'admin'];

export default function App() {
  const links = getWorkspaceLinks(import.meta.env);
  return (
    <main className="access-world">
      <section className="access-main">
        <header className="access-head">
          <div className="ph-brand access-brand"><span className="ph-brandmark">PH</span><span>PiHub</span></div>
          <span className="ph-status">Access gateway</span>
        </header>
        <div className="ph-eyebrow">PIHUB PLATFORM</div>
        <h1 className="ph-title">Choose your workspace</h1>
        <p className="ph-subtitle">Each PiHub workspace is an independently built application. This gateway never copies browser tokens between applications and does not grant authorization by itself.</p>
        <div className="ph-demo">Frontend gateway only. Production single sign-on still requires the server-managed session and authorization contract documented for the platform.</div>
        <div className="access-grid">
          {ids.map(id => {
            const app = APPLICATIONS[id];
            const item = copy[id];
            const href = links[id];
            return <article className="access-card" key={id}>
              <div className="ph-eyebrow">{item.eyebrow}</div>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              <div className="access-card-foot">
                <span className={`ph-status ${href ? 'good' : 'warn'}`}>{href ? 'Configured' : 'Origin not configured'}</span>
                {href ? <a className="ph-button primary" href={href}>Open {app.label}</a> : <button className="ph-button" type="button" disabled>Not connected</button>}
              </div>
            </article>;
          })}
        </div>
      </section>
      <aside className="access-side" aria-hidden="true">
        <div>
          <div className="ph-eyebrow">ONE PLATFORM, SEPARATE RELEASE SURFACES</div>
          <h2>Shared business truth without shared frontend failure domains.</h2>
          <p>Borrower, Investor and Advisory remain the three business modules. Admin and Access support the platform around them.</p>
        </div>
      </aside>
    </main>
  );
}
