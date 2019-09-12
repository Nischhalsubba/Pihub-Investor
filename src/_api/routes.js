// const API_URL = process.env.REACT_APP_API_URL;
let API_URL = 'http://api.credittech.diagonal.solutions/api'
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
  passwordReset: `${API_URL}/password-reset-token`
};
