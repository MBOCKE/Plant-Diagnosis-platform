import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: { email: string; name: string } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: true,
  user: null,

  login: async (email: string, password: string) => {
    // Simulate API call - TODO: Replace with real auth
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userData = { email, name: email.split('@')[0] };
    
    await AsyncStorage.setItem('auth_token', 'demo_token_123');
    await AsyncStorage.setItem('user_data', JSON.stringify(userData));
    
    set({ isAuthenticated: true, user: userData });
  },

  logout: async () => {
    await AsyncStorage.multiRemove(['auth_token', 'user_data']);
    set({ isAuthenticated: false, user: null });
  },

  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const userData = await AsyncStorage.getItem('user_data');
      
      if (token && userData) {
        set({ isAuthenticated: true, user: JSON.parse(userData), isLoading: false });
      } else {
        set({ isAuthenticated: false, user: null, isLoading: false });
      }
    } catch {
      set({ isAuthenticated: false, user: null, isLoading: false });
    }
  },
}));