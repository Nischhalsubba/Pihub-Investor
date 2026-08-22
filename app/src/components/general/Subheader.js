import React from 'react';
import { Link } from 'react-router-dom';

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

const Subheader = ({ heading, kicker, description, buttonLabel, link, linkState }) => {
  const safeHeading = safeContent(heading);
  const safeKicker = safeContent(kicker);
  const safeDescription = safeContent(description);
  const safeButtonLabel = safeContent(buttonLabel);

  return (
    <div className="content-head" data-motion="page-head">
      <div className="content-head-left">
        {safeKicker ? <div className="content-head-kicker">{safeKicker}</div> : null}
        <h1 className="content-head__title">{safeHeading}</h1>
        {safeDescription ? <p className="content-head-copy">{safeDescription}</p> : null}
      </div>
      {safeButtonLabel && link ? (
        <div className="content-head-right">
          <Link className="btn btn-primary" to={linkState ? { pathname: link, state: linkState } : link}>{safeButtonLabel}</Link>
        </div>
      ) : null}
    </div>
  );
};

export default Subheader;
