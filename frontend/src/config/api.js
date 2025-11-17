// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // User endpoints
  USER: {
    ADD: `${API_BASE_URL}/user/add`,
    LOGIN: `${API_BASE_URL}/user/authenticate`,
    GET_ALL: `${API_BASE_URL}/user/getall`,
    GET_BY_ID: `${API_BASE_URL}/user/getbyid`,
    DELETE: (id) => `${API_BASE_URL}/user/delete/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/user/update/${id}`,
  },

  // Product endpoints
  PRODUCT: {
    ADD: `${API_BASE_URL}/product/add`,
    GET_ALL: `${API_BASE_URL}/product/getall`,
    GET_BY_ID: (id) => `${API_BASE_URL}/product/getbyid/${id}`,
    GET_BY_SELLER: (id) => `${API_BASE_URL}/product/getbyseller/${id}`,
    DELETE: (id) => `${API_BASE_URL}/product/delete/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/product/update/${id}`,
  },

  // Seller endpoints
  SELLER: {
    ADD: `${API_BASE_URL}/seller/add`,
    LOGIN: `${API_BASE_URL}/seller/authenticate`,
    GET_ALL: `${API_BASE_URL}/seller/getall`,
    GET_BY_ID: `${API_BASE_URL}/seller/getbyid`,
    DELETE: (id) => `${API_BASE_URL}/seller/delete/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/seller/update/${id}`,
  },

  // Admin endpoints
  ADMIN: {
    ADD: `${API_BASE_URL}/admin/add`,
    LOGIN: `${API_BASE_URL}/admin/authenticate`,
    GET_ALL: `${API_BASE_URL}/admin/getall`,
    GET_BY_ID: `${API_BASE_URL}/admin/getbyid`,
  },

  // Order endpoints
  ORDER: {
    ADD: `${API_BASE_URL}/order/add`,
    GET_ALL: `${API_BASE_URL}/order/getall`,
    GET_BY_USER: (id) => `${API_BASE_URL}/order/getbyuser/${id}`,
    GET_BY_ID: (id) => `${API_BASE_URL}/order/getbyid/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/order/update/${id}`,
  },

  // Review endpoints
  REVIEW: {
    ADD: `${API_BASE_URL}/review/add`,
    GET_BY_PRODUCT: (id) => `${API_BASE_URL}/review/getbyproduct/${id}`,
  },

  // Contact & Feedback
  CONTACT: {
    ADD: `${API_BASE_URL}/contact/add`,
  },

  FEEDBACK: {
    ADD: `${API_BASE_URL}/feedback/add`,
  },

  // Payment
  PAYMENT: {
    CREATE_INTENT: `${API_BASE_URL}/create-payment-intent`,
    RETRIEVE_INTENT: `${API_BASE_URL}/retrieve-payment-intent`,
  },

  // Static files
  UPLOADS: `${API_BASE_URL}/`,
};

export default API_BASE_URL;
