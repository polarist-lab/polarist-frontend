import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auth API methods
export const authAPI = {
  // Separated Google OAuth flows
  googleSignup: (guestId?: string) => {
    const guestParam = guestId ? `?guest_id=${encodeURIComponent(guestId)}` : '';
    window.location.href = `${API_BASE_URL}/auth/google/signup${guestParam}`;
  },

  googleSignin: () => {
    window.location.href = `${API_BASE_URL}/auth/google/signin`;
  },

  // Legacy method (keep for backward compatibility if needed)
  googleAuth: () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  },

  // Mock login for testing (remove in production)
  mockLogin: () => {
    window.location.href = `${API_BASE_URL}/auth/mock-login`;
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
  
  logout: async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
    const response = await api.get('/auth/logout');
    return response.data;
  },

  // Guest data migration
  migrateGuestData: async (guestId: string) => {
    const response = await api.post(`/auth/migrate-guest-data?guest_id=${encodeURIComponent(guestId)}`);
    return response.data;
  },
};

// Users API methods
export const usersAPI = {
  getMe: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
};