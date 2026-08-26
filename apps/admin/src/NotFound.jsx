import React from 'react';
import { Link } from 'react-router-dom-v6';
import { Card, PageHead, Status } from '../../../packages/ui/src/Primitives';

export default function NotFound() {
  return <div className="ph-page-shell">
    <PageHead eyebrow="Admin / 404" title="Page not found" subtitle="The requested Admin destination does not exist or is no longer available." />
    <Card title="Recover safely" action={<Status tone="warn">404</Status>}>
      <div className="ph-empty"><strong>Nothing is available at this address.</strong><span>Return to platform governance rather than leaving the user on a dead route.</span><Link className="ph-button primary" to="/">Return to Admin overview</Link></div>
    </Card>
  </div>;
}
