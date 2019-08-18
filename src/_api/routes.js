const API_URL = process.env.REACT_APP_API_URL;
console.log(API_URL);
export const routes = {
  login: `${API_URL}/login`,
  signup: `${API_URL}/register`,
  products: `${API_URL}/investor/products`
};
