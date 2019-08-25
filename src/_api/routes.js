const API_URL = process.env.REACT_APP_API_URL;
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
  changeStatusOfRequest: `${API_URL}/application`
};
