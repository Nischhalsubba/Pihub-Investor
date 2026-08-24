import React from 'react';

const formatDateTime = value => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || '';
  return new Intl.DateTimeFormat(undefined, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
};

const ActivityTimeline = ({ title = 'Activity', description = 'Recent workflow events for this record.', items = [] }) => (
  <section className="ap-activity-panel" aria-label={title} data-motion="profile-card">
    <header><h2>{title}</h2><p>{description}</p></header>
    {items.length ? <div className="ap-activity-list">{items.map((item, index) => (
      <div className="ap-activity-item" key={item.id || `${item.label}-${index}`}>
        <span className="ap-activity-dot" aria-hidden="true" />
        <span className="ap-activity-copy"><strong>{item.label || 'Workspace event'}</strong>{item.meta ? <span>{item.meta}</span> : null}</span>
        {item.createdAt || item.created_at ? <time dateTime={item.createdAt || item.created_at}>{formatDateTime(item.createdAt || item.created_at)}</time> : null}
      </div>
    ))}</div> : <div className="ap-empty ap-empty-compact"><strong>No activity recorded yet.</strong><span>Workflow changes will appear here as the record progresses.</span></div>}
  </section>
);

export default ActivityTimeline;
