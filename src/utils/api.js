import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          localStorage.setItem('access_token', access);

          // Retry the original request
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
  verifyEmail: (token) => api.post(`/auth/verify-email/${token}/`),
  passwordResetRequest: (data) => api.post('/auth/password-reset-request/', data),
  passwordResetConfirm: (data) => api.post('/auth/password-reset-confirm/', data),
  getUserInfo: () => api.get('/auth/user-info/'),
  updateProfile: (data) => api.put('/auth/profile/', data),
  changePassword: (data) => api.post('/auth/change-password/', data),
};

// Products API
export const productsAPI = {
  getProducts: (params) => api.get('/products/', { params }),
  getProduct: (id) => api.get(`/products/${id}/`),
  searchProducts: (params) => api.get('/products/search/', { params }),
  getFeaturedProducts: () => api.get('/products/featured/'),
  getCategories: () => api.get('/products/categories/'),
  getBrands: () => api.get('/products/brands/'),
  getTags: () => api.get('/products/tags/'),
  createProduct: (data) => api.post('/products/', data),
  updateProduct: (id, data) => api.put(`/products/${id}/`, data),
  deleteProduct: (id) => api.delete(`/products/${id}/`),
  getProductReviews: (id) => api.get(`/products/${id}/reviews/`),
  createProductReview: (id, data) => api.post(`/products/${id}/reviews/`, data),
  getProductStats: (id) => api.get(`/products/${id}/stats/`),
};

// Cart API
export const cartAPI = {
  getCart: () => api.get('/cart/'),
  addToCart: (data) => api.post('/cart/add/', data),
  updateCartItem: (itemId, data) => api.put(`/cart/update/${itemId}/`, data),
  removeFromCart: (itemId) => api.delete(`/cart/remove/${itemId}/`),
  clearCart: () => api.delete('/cart/clear/'),
  getCartSummary: () => api.get('/cart/summary/'),
};

// Wishlist API
export const wishlistAPI = {
  getWishlist: () => api.get('/products/wishlist/'),
  addToWishlist: (data) => api.post('/products/wishlist/', data),
  removeFromWishlist: (id) => api.delete(`/products/wishlist/${id}/`),
  toggleWishlist: (productId) => api.post(`/products/wishlist/toggle/${productId}/`),
};

// Orders API
export const ordersAPI = {
  getOrders: () => api.get('/orders/'),
  getOrder: (id) => api.get(`/orders/${id}/`),
  createOrder: (data) => api.post('/orders/', data),
  updateOrderStatus: (id, data) => api.put(`/orders/${id}/status/`, data),
  getOrderStats: () => api.get('/orders/stats/'),
  getSellerStats: () => api.get('/orders/seller-stats/'),
  getAdminStats: () => api.get('/orders/admin-stats/'),
  getShippingAddresses: () => api.get('/orders/shipping-addresses/'),
  createShippingAddress: (data) => api.post('/orders/shipping-addresses/', data),
  updateShippingAddress: (id, data) => api.put(`/orders/shipping-addresses/${id}/`, data),
  deleteShippingAddress: (id) => api.delete(`/orders/shipping-addresses/${id}/`),
};

export default api;





