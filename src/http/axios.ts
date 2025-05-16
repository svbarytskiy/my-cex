import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.binance.com/api/v3', 
  timeout: 5000, 
  headers: {
    'Content-Type': 'application/json',
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      console.error('Не авторизовано!');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;