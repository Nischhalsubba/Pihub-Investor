import { useCallback, useEffect, useState } from 'react';
import { getLocale, localeEventName } from '../_utils/locale';
import { workspaceTextFor } from './workspaceCopy';

const useWorkspaceCopy = () => {
  const [locale, setLocale] = useState(() => getLocale());
  useEffect(() => {
    const refresh = event => setLocale((event.detail && event.detail.locale) || getLocale());
    window.addEventListener(localeEventName, refresh);
    return () => window.removeEventListener(localeEventName, refresh);
  }, []);
  return useCallback(key => workspaceTextFor(locale, key), [locale]);
};

export default useWorkspaceCopy;
