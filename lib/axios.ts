import axios from 'axios';
import Cookies from 'js-cookie';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5186',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Tự động gắn Token vào Header nếu có
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: Xử lý lỗi response (ví dụ 401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
        // Logic logout tự động nếu token hết hạn (tùy chọn)
        // Cookies.remove('accessToken');
        // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;