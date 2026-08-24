import React, { Fragment, useEffect, useState } from 'react';
import { getLocale, translate } from '../_utils/locale';

const LOCALE_EVENT = 'pihub:locale-changed';

const useLocaleRevision = () => {
  const [, setRevision] = useState(0);
  useEffect(() => {
    const refresh = () => setRevision(value => value + 1);
    window.addEventListener(LOCALE_EVENT, refresh);
    return () => window.removeEventListener(LOCALE_EVENT, refresh);
  }, []);
};

const Translate = ({ content, component = 'span', with: variables, children, ...props }) => {
  useLocaleRevision();
  const value = content ? translate(content, variables) : children;
  if (component === null || component === false || component === Fragment) return <>{value}</>;
  return React.createElement(component || 'span', props, value);
};

Translate.getLocale = getLocale;
Translate.translate = translate;

export default Translate;
