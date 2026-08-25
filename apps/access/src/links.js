import { sanitizeAppOrigin } from '../../../packages/platform/src/application-registry';
export const getWorkspaceLinks = env => ({
  investor: sanitizeAppOrigin(env.VITE_INVESTOR_APP_URL),
  borrower: sanitizeAppOrigin(env.VITE_BORROWER_APP_URL),
  advisory: sanitizeAppOrigin(env.VITE_ADVISORY_APP_URL),
  admin: sanitizeAppOrigin(env.VITE_ADMIN_APP_URL)
});
