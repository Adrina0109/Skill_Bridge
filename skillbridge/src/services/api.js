import axios from 'axios';


let API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
try {
  
  API_BASE_URL = API_BASE_URL.replace(/\/+$/, '');
  if (!API_BASE_URL.endsWith('/api')) {
    API_BASE_URL = API_BASE_URL + '/api';
  }
} catch (e) {
  
  API_BASE_URL = 'http://localhost:8080/api';
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token added to request:', token.substring(0, 20) + '...');
    } else {
      console.warn('⚠️ No token found in localStorage. Please login first.');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.error('Authentication failed');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export const generateRoadmap = async (data) => {
  try {
    const response = await api.post('/ai/generate', data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      'Failed to generate learning roadmap. Please try again.'
    );
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      'Registration failed. Please try again.'
    );
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      'Login failed. Please check your credentials.'
    );
  }
};

export default api;
