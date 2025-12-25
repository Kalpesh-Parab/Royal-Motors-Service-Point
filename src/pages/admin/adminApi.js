import axios from 'axios';

const API = axios.create({
  baseURL: 'https://royal-backend-1-hzkn.onrender.com' || 'http://localhost:5000',
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
