import React from 'react';
import { Link } from 'react-router-dom';

const NoMatch = () => (
  <section className="ap-empty" aria-labelledby="not-found-title">
    <span className="ap-mono">404</span>
    <strong id="not-found-title">This workspace page does not exist.</strong>
    <span>The address may be outdated, or the resource may have moved. Your session and previous workspace data have not been changed.</span>
    <Link to="/products" className="btn btn-primary">Return to opportunities</Link>
  </section>
);

export default NoMatch;
