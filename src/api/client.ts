import axios, { AxiosInstance, AxiosError } from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies with requests
});

// Add token to request headers
apiClient.interceptors.request.use(
  (config) => {
    // Try to get token from multiple sources
    let token: string | null = null;

    // First try from localStorage (from login page)
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('authToken');

      // If not in localStorage, try to get from cookies
      if (!token) {
        const cookies = document.cookie.split('; ');
        const authCookie = cookies.find((cookie) => cookie.startsWith('authToken='));
        if (authCookie) {
          token = authCookie.split('=')[1];
        }
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    // Only clear tokens and redirect on 401 status code
    // Don't clear on other errors (like 400 with wrong password)
    if (error.response?.status === 401) {
      // Clear tokens only on actual authentication errors
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        document.cookie = 'authToken=; path=/; max-age=0';
        document.cookie = 'refreshToken=; path=/; max-age=0';
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
