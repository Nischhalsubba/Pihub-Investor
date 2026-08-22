import React from 'react';
import { Link, withRouter } from 'react-router-dom';

const safeContent = value => {
  if (value === null || value === undefined || value === false) return null;
  if (React.isValidElement(value)) return value;
  if (typeof value === 'string' || typeof value === 'number') return value;
  if (typeof value !== 'object') return String(value);
  const candidates = [value.en, value.de, value.label, value.title, value.name, value.message];
  for (let index = 0; index < candidates.length; index += 1) {
    const candidate = candidates[index];
    if (typeof candidate === 'string' || typeof candidate === 'number') return candidate;
  }
  return null;
};

const metaForPath = pathname => {
  if (pathname === '/' || pathname === '/products' || pathname === '/product' || pathname === '/edit-product') return { number: '01', folio: ['OPPORTUNITY', 'BOOK'], description: 'Review investable facilities, status and credit parameters from one analytical ledger.' };
  if (pathname === '/credit-request' || pathname === '/application') return { number: '02', folio: ['DECISION', 'QUEUE'], description: 'Prioritize credit requests, deadlines and decision-ready submissions.' };
  if (pathname === '/products-invested' || pathname === '/creditor/detail') return { number: '03', folio: ['LIVE', 'BOOK'], description: 'Monitor deployed capital, maturity and position-level exposure.' };
  if (pathname === '/user/profile' || pathname === '/user/edit-profile' || pathname === '/change-password') return { number: '04', folio: ['ENTITY', 'RECORD'], description: 'Institution identity, access and relationship data.' };
  if (pathname === '/add-product') return { number: '05', folio: ['NEW', 'OPPORTUNITY'], description: 'Register an investable facility with complete credit parameters and evidence.' };
  if (pathname === '/notifications') return { number: '06', folio: ['ACTIVITY', 'LOG'], description: 'Workspace notifications and operational activity.' };
  return { number: '00', folio: ['INVESTOR', 'WORKSPACE'], description: null };
};

const Subheader = ({ heading, kicker, description, buttonLabel, link, linkState, location }) => {
  const safeHeading = safeContent(heading);
  const safeKicker = safeContent(kicker);
  const safeDescription = safeContent(description);
  const safeButtonLabel = safeContent(buttonLabel);
  const meta = metaForPath(location.pathname);

  return (
    <div className="content-head ap-page-head" data-motion="page-head">
      <div className="ap-folio" aria-hidden="true"><b>{meta.number}</b><span>{meta.folio[0]}<br />{meta.folio[1]}</span></div>
      <div className="content-head-left ap-page-title">
        {safeKicker ? <div className="content-head-kicker">{safeKicker}</div> : null}
        <h1 className="content-head__title">{safeHeading}</h1>
        <p className="content-head-copy">{safeDescription || meta.description}</p>
      </div>
      {safeButtonLabel && link ? (
        <div className="content-head-right ap-page-action">
          <Link className="btn btn-primary ap-primary" to={linkState ? { pathname: link, state: linkState } : link}>{safeButtonLabel}</Link>
        </div>
      ) : null}
    </div>
  );
};

export default withRouter(Subheader);
