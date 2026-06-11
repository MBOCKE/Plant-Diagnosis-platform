import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiResponse, AuthResponse, LoginRequest, RegisterRequest, Case, DiagnosisResult, TreatmentPlan } from '../types';

// Base URL - change this to your backend URL
const BASE_URL = __DEV__
  ? 'http://localhost:3000/api'
  : 'https://your-production-api.com/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============================================
// AUTH SERVICE
// ============================================

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    // TODO: Replace with real API call
    // const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
    // return response.data.data!;
    
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      user: { id: '1', email: data.email, name: data.email.split('@')[0], preferredLanguage: 'en' },
      token: 'demo_token_123',
    };
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    // TODO: Replace with real API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      user: { id: '1', email: data.email, name: data.name, preferredLanguage: data.preferredLanguage || 'en' },
      token: 'demo_token_123',
    };
  },

  logout: async (): Promise<void> => {
    await AsyncStorage.multiRemove(['auth_token', 'user_data']);
  },
};

// ============================================
// INFERENCE SERVICE
// ============================================

export const inferenceService = {
  diagnose: async (imageUri: string, cropType: string): Promise<{ caseId: string; diagnosis: DiagnosisResult; treatment: TreatmentPlan }> => {
    // TODO: Replace with real API call using FormData
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      caseId: `case_${Date.now()}`,
      diagnosis: {
        primaryDiagnosis: { disease: 'Early Blight', scientificName: 'Alternaria solani', confidence: 94 },
        alternativeDiagnoses: [
          { disease: 'Late Blight', scientificName: 'Phytophthora infestans', confidence: 23 },
          { disease: 'Bacterial Spot', scientificName: 'Xanthomonas campestris', confidence: 12 },
        ],
        allPredictions: [],
        modelUsed: 'tomato-mobilenetv2-v1',
        inferenceTimeMs: 1247,
      },
      treatment: {
        urgency: 'treat_soon',
        urgencyLabel: 'Treat Soon',
        cultural: ['Remove infected leaves', 'Improve air circulation', 'Avoid overhead watering', 'Apply mulch'],
        biological: ['Apply Trichoderma to soil', 'Use Bacillus subtilis spray'],
        chemical: ['Copper hydroxide 2g/L every 7-10 days', 'Chlorothalonil as preventive'],
        precautions: ['Wear gloves and mask', '7-day pre-harvest interval', 'Spray early morning'],
      },
    };
  },
};

// ============================================
// CASE SERVICE
// ============================================

export const caseService = {
  getCases: async (page = 1, limit = 10): Promise<Case[]> => {
    // TODO: Replace with real API call
    return [];
  },

  getCase: async (caseId: string): Promise<Case | null> => {
    // TODO: Replace with real API call
    return null;
  },

  deleteCase: async (caseId: string): Promise<void> => {
    // TODO: Replace with real API call
  },
};