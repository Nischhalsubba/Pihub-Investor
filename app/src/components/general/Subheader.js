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

const defaultDescription = pathname => {
  if (pathname === '/' || pathname === '/products') return 'Review opportunities, credit parameters and status from one working view.';
  if (pathname === '/credit-request') return 'Prioritize requests, deadlines and decision-ready submissions.';
  if (pathname === '/products-invested') return 'Monitor deployed capital, maturity and position-level exposure.';
  if (pathname === '/user/profile') return 'Institution identity, access and relationship information.';
  if (pathname === '/user/edit-profile') return 'Maintain institutional identity and relationship information.';
  if (pathname === '/add-product') return 'Register an investable opportunity with complete credit parameters and evidence.';
  if (pathname === '/notifications') return 'Review operational notifications and account activity.';
  return null;
};

const defaultBack = pathname => {
  if (/^\/opportunities\/[^/]+\/edit\/?$/.test(pathname)) {
    const id = pathname.split('/')[2];
    return { to: `/opportunities/${id}`, label: 'Back to opportunity' };
  }
  if (/^\/opportunities\/[^/]+\/?$/.test(pathname)) return { to: '/products', label: 'Back to opportunities' };
  if (/^\/credit-requests\/[^/]+\/[^/]+\/?$/.test(pathname)) return { to: '/credit-request', label: 'Back to credit requests' };
  if (/^\/positions\/[^/]+\/[^/]+\/?$/.test(pathname)) return { to: '/products-invested', label: 'Back to invested positions' };
  if (pathname === '/user/edit-profile') return { to: '/user/profile', label: 'Back to profile' };
  return null;
};

const Subheader = ({ heading, kicker, description, buttonLabel, link, linkState, backTo, backLabel, location }) => {
  const safeHeading = safeContent(heading);
  const safeKicker = safeContent(kicker);
  const safeDescription = safeContent(description) || defaultDescription(location.pathname);
  const safeButtonLabel = safeContent(buttonLabel);
  const back = backTo ? { to: backTo, label: safeContent(backLabel) || 'Back' } : defaultBack(location.pathname);

  return (
    <header className="content-head ap-page-head">
      <div className="content-head-left ap-page-title">
        {back ? <Link className="ap-inspector-link" to={back.to}><span aria-hidden="true">←</span>{back.label}</Link> : null}
        {safeKicker ? <div className="content-head-kicker">{safeKicker}</div> : null}
        <h1 className="content-head__title">{safeHeading}</h1>
        {safeDescription ? <p className="content-head-copy">{safeDescription}</p> : null}
      </div>
      {safeButtonLabel && link ? (
        <div className="content-head-right ap-page-action">
          <Link className="btn btn-primary ap-primary" to={linkState ? { pathname: link, state: linkState } : link}>{safeButtonLabel}</Link>
        </div>
      ) : null}
    </header>
  );
};

export default withRouter(Subheader);
