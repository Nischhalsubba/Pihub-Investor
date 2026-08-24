import React from 'react';

const interpolate = (format, values = {}) => String(format || '').replace(/%\(([^)]+)\)s|{{\s*([^}]+)\s*}}/g, (match, percentKey, braceKey) => {
  const key = percentKey || braceKey;
  const value = values[key];
  return value === null || value === undefined ? '' : String(value);
});

const Interpolate = ({ component = 'span', format, with: variables, children, ...props }) => {
  const value = interpolate(format === undefined ? children : format, variables || {});
  if (component === null || component === false) return <>{value}</>;
  return React.createElement(component || 'span', props, value);
};

export default Interpolate;
