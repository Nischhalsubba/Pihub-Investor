const configuredApiUrl = (process.env.REACT_APP_API_URL || '').trim().replace(/\/$/, '');
const isSafeApiUrl = /^https:\/\//i.test(configuredApiUrl) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(configuredApiUrl);

// Demo builds are intercepted in the Axios adapter. Live builds require an
// explicit HTTPS API URL (localhost HTTP is allowed for development). We no
// longer fall back to the retired diagonal.solutions backend.
const API_URL = isSafeApiUrl ? configuredApiUrl : '/api-unconfigured';

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
  getApplicationList: `${API_URL}/investor/products`,
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
