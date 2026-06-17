import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  login: async (email: string, password: string) => {
    // TODO: Replace with real API call
    await new Promise(r => setTimeout(r, 500));
    return { user: { id: '1', email, name: 'Jean', preferredLanguage: 'en' as const }, token: 'demo_token' };
  },

  register: async (data: {
    email: string;
    password: string;
    name: string;
    phone?: string;
    preferredLanguage?: 'en' | 'fr';
    location?: any;
  }) => {
    // TODO: Replace with real API call
    await new Promise(r => setTimeout(r, 500));
    return {
      user: {
        id: '1',
        email: data.email,
        name: data.name,
        phone: data.phone,
        preferredLanguage: data.preferredLanguage || 'en' as const,
        location: data.location || null,
      },
      token: 'demo_token',
    };
  },
};

export const inferenceAPI = {
  diagnose: async (imageUri: string, cropType: string) => {
    await new Promise(r => setTimeout(r, 1500));
    return {
      diagnosis: {
        primaryDiagnosis: { disease: 'Early Blight', scientificName: 'Alternaria solani', confidence: 94 },
        alternativeDiagnoses: [{ disease: 'Late Blight', confidence: 23 }, { disease: 'Bacterial Spot', confidence: 12 }],
        modelUsed: 'mobilenetv2-v1',
        inferenceTimeMs: 1247,
      },
      treatment: {
        urgency: 'treat_soon' as const,
        urgencyLabel: 'Treat Soon',
        cultural: ['Remove infected leaves', 'Improve air circulation', 'Avoid overhead watering', 'Apply mulch'],
        biological: ['Apply Trichoderma to soil', 'Use Bacillus subtilis spray'],
        chemical: ['Copper hydroxide 2g/L every 7-10 days', 'Chlorothalonil as preventive'],
        precautions: ['Wear gloves and mask', '7-day pre-harvest interval', 'Spray early morning'],
      },
    };
  },
};

// -----------------------------
// Case / Treatment APIs (TODO)
// -----------------------------
// These are mock-friendly placeholders. Replace mock returns with real HTTP calls when backend endpoints are ready.
//
// Suggested backend wiring (to implement later):
// - GET   /api/cases/me                  -> list all cases for current user
// - GET   /api/cases/:caseId           -> single case details
// - GET   /api/cases/:caseId/treatment -> treatment plan for a case
//
// If your backend route names differ, only update the endpoints below.

export const casesAPI = {
  getUserCases: async () => {
    // TODO: Replace with real API call, e.g.
    // const res = await api.get('/cases/me');
    // return res.data;
    await new Promise(r => setTimeout(r, 250));
    return [] as any[];
  },

  getCaseById: async (caseId: string) => {
    // TODO: Replace with real API call, e.g.
    // const res = await api.get(`/cases/${caseId}`);
    // return res.data;
    await new Promise(r => setTimeout(r, 250));
    return null as any;
  },
};

export const treatmentAPI = {
  getTreatmentByCaseId: async (caseId: string) => {
    // TODO: Replace with real API call, e.g.
    // const res = await api.get(`/cases/${caseId}/treatment`);
    // return res.data;
    await new Promise(r => setTimeout(r, 250));
    return null as any;
  },
};

export default api;

