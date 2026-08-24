const dispatch = (name, detail) => {
  if (typeof window === 'undefined' || typeof window.CustomEvent !== 'function') return;
  window.dispatchEvent(new CustomEvent(name, { detail }));
};

export const openCommandPalette = detail => dispatch('pihub:command-open', detail || {});
export const openNotificationDrawer = () => dispatch('pihub:notifications-open', {});
export const closeNotificationDrawer = () => dispatch('pihub:notifications-close', {});
export const openShortcutHelp = () => dispatch('pihub:shortcuts-open', {});
export const openContextDrawer = detail => dispatch('pihub:context-open', detail || {});
export const closeContextDrawer = () => dispatch('pihub:context-close', {});

export const showToast = (message, options = {}) => dispatch('pihub:toast', {
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  type: options.type || 'info',
  title: options.title || '',
  message: String(message || ''),
  duration: Number.isFinite(Number(options.duration)) ? Number(options.duration) : 4200
});
