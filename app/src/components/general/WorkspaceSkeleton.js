import React from 'react';

const SkeletonLine = ({ width = '100%', className = '' }) => (
  <span className={`workspace-skeleton-line${className ? ` ${className}` : ''}`} style={{ width }} />
);

const WorkspaceSkeleton = ({ compact = false }) => (
  <div className={`workspace-skeleton${compact ? ' is-compact' : ''}`} role="status" aria-live="polite" aria-label="Loading workspace">
    <span className="sr-only">Loading workspace…</span>
    <div className="workspace-skeleton-visual" aria-hidden="true">
      <div className="workspace-skeleton-head">
        <SkeletonLine width="30%" className="is-title" />
        <SkeletonLine width="48%" />
      </div>
      <div className="workspace-skeleton-metrics">
        {[0, 1, 2, 3].map(item => (
          <div className="workspace-skeleton-metric" key={item}>
            <SkeletonLine width="38%" className="is-label" />
            <SkeletonLine width="34%" className="is-value" />
            <SkeletonLine width="58%" />
          </div>
        ))}
      </div>
      <div className="workspace-skeleton-grid">
        <div className="workspace-skeleton-card is-primary">
          <SkeletonLine width="24%" className="is-section" />
          <SkeletonLine width="52%" />
          {[0, 1, 2, 3].map(item => (
            <div className="workspace-skeleton-row" key={item}>
              <SkeletonLine width={`${42 + item * 5}%`} />
              <SkeletonLine width="18%" />
            </div>
          ))}
        </div>
        <div className="workspace-skeleton-card is-secondary">
          <SkeletonLine width="44%" className="is-section" />
          <SkeletonLine width="66%" />
          {[0, 1, 2].map(item => <SkeletonLine width={`${76 - item * 8}%`} key={item} />)}
        </div>
      </div>
    </div>
  </div>
);

export default WorkspaceSkeleton;
