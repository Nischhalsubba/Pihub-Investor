const configuredApiUrl = (process.env.REACT_APP_API_URL || '').trim().replace(/\/$/, '');
const productionFallback = '/credittech-api';
const developmentFallback = 'http://api.credittech.diagonal.solutions/api';

// Keep the API endpoint deployment-configurable. In production, only use a
// configured absolute API URL when it is HTTPS so the browser never creates a
// mixed-content request. If no live HTTPS endpoint is configured, use the
// same-origin Vercel proxy as a compatibility fallback.
const API_URL =
  process.env.NODE_ENV === 'production'
    ? configuredApiUrl.indexOf('https://') === 0
      ? configuredApiUrl
      : productionFallback
    : configuredApiUrl || developmentFallback;

export const routes = {
  login: `${API_URL}/login`,
  signup: `${API_URL}/register`,
  products: `${API_URL}/investor/products`,
  getProductById: `${API_URL}/investor/product`,
  addProduct: `${API_URL}/investor/product`,
  listCreditRequests: `${API_URL}/investor/credit-requested-products`,
  getNotificationList: `${API_URL}/me/notifications`,
  countNotification: `${API_URL}/me/notification/count-new`,
  markAsRead: `${API_URL}/me/notification/read`,
  changeStatusOfRequest: `${API_URL}/investor/products`,
  getIndustryList: `${API_URL}/industries`,
  getApplicationList: `${API_URL}/investor/products`, // few of the routes look the same but dont delete them yet
  getApplicationDetail: `${API_URL}/investor/products`,
  investedList: `${API_URL}/investor/invested-products`,
  emailVerification: `${API_URL}/email-verification`,
  getCreditorDetail: `${API_URL}/investor/creditor-detail`,
  uploadFile: `${API_URL}/investor/products`,
  getProfile: `${API_URL}/me`,
  getService: `${API_URL}/services`,
  passwordReset: `${API_URL}/password-reset-token`,
  changePasswordWithToken: `${API_URL}/change-password-with-token`,
  downloadToken: `${API_URL}/download-token`,
  downloadFile: `${API_URL}/download`,
  getStateCounties: `${API_URL}/states`,
  creditorDetail: `${API_URL}/investor/products`
};
