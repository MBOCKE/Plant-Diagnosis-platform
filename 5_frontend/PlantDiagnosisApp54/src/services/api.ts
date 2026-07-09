import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

function resolveApiBaseUrl() {
  const configuredUrl = process.env.EXPO_PUBLIC_API_URL;
  if (configuredUrl) {
    return configuredUrl.endsWith('/api') ? configuredUrl : `${configuredUrl.replace(/\/$/, '')}/api`;
  }

  const hostUri = Constants.expoConfig?.hostUri || (Constants as any).manifest?.debuggerHost;
  if (hostUri) {
    const host = hostUri.split(':')[0];
    return `http://${host}:3000/api`;
  }

  if (Platform.OS === 'android') return 'http://10.0.2.2:3000/api';
  if (Platform.OS === 'ios') return 'http://127.0.0.1:3000/api';
  return 'http://localhost:3000/api';
}

const API_URL = resolveApiBaseUrl();

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor - attach JWT token
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Service URLs for warm-up
const SERVICES = {
  gateway: 'https://plant-diagnosis-platform.onrender.com',
  auth: 'https://plant-auth-service.onrender.com',
  treatment: 'https://plant-treatment-service.onrender.com',
  case: 'https://plant-case-service.onrender.com',
  inference: 'https://mcGabe-plant-inference.hf.space',
};

// Wake up ALL services in parallel
async function wakeAllServices() {
  console.log('🔄 Waking up all services...');
  const wakeCalls = Object.values(SERVICES).map(url =>
    fetch(`${url}/health`).catch(() => {})
  );
  await Promise.all(wakeCalls);
  console.log('✅ All services pinged');
}

// Response interceptor - retry on sleeping services
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Prevent infinite retry loops
    if (!error.config) return Promise.reject(error);
    error.config.__retryCount = error.config.__retryCount || 0;

    if ((error.response?.status === 502 || error.code === 'ECONNABORTED' || error.code === 'ECONNRESET' || error.code === 'ERR_NETWORK') && error.config.__retryCount < 2) {
      error.config.__retryCount += 1;
      console.log(`⏰ Service sleeping (attempt ${error.config.__retryCount}), waking all services...`);
      await wakeAllServices();
      await new Promise(resolve => setTimeout(resolve, 5000));
      console.log('🔄 Retrying request...');
      return api.request(error.config);
    }
    return Promise.reject(error);
  }
);

function unwrapApiData<T>(payload: any): T {
  return payload?.data ?? payload;
}

function normalizeCase(raw: any) {
  return {
    ...raw,
    id: raw?.id || raw?._id,
    createdAt: raw?.createdAt || raw?.created_at || new Date().toISOString(),
    cropType: raw?.cropType || raw?.crop,
    isOfflineCase: Boolean(raw?.isOfflineCase),
    isArchived: Boolean(raw?.isArchived),
  };
}

export const authAPI = {
  login: async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const payload = unwrapApiData<any>(res.data);
    return { user: payload.user, token: payload.token };
  },

  register: async (data: {
    email: string;
    password: string;
    name: string;
    phone?: string;
    preferredLanguage?: 'en' | 'fr';
    location?: any;
  }) => {
    const res = await api.post('/auth/register', data);
    const payload = unwrapApiData<any>(res.data);
    return {
      user: payload.user,
      token: payload.token,
    };
  },
};

export const inferenceAPI = {
  diagnose: async (imageUri: string, cropType: string) => {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      name: 'image.jpg',
      type: 'image/jpeg',
    } as any);
    formData.append('crop_type', cropType);

    const inferenceRes = await api.post('/inference/predict', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const inferencePayload = unwrapApiData<any>(inferenceRes.data);

    const diagnosis = {
      primaryDiagnosis: inferencePayload.primaryDiagnosis || inferencePayload.diagnosis?.primaryDiagnosis,
      alternativeDiagnoses: inferencePayload.alternativeDiagnoses || inferencePayload.diagnosis?.alternativeDiagnoses || [],
      modelUsed: inferencePayload.modelUsed || inferencePayload.diagnosis?.modelUsed || 'unknown',
      inferenceTimeMs: inferencePayload.inferenceTimeMs || inferencePayload.diagnosis?.inferenceTimeMs || 0,
    };

    let treatment = null;
    if (diagnosis.primaryDiagnosis?.disease) {
      try {
        const treatmentRes = await api.get(`/treatment/${encodeURIComponent(cropType)}/${encodeURIComponent(diagnosis.primaryDiagnosis.disease)}`);
        const treatmentPayload = unwrapApiData<any>(treatmentRes.data);
        treatment = treatmentPayload.treatment || treatmentPayload;
      } catch {
        treatment = {
          urgency: 'treat_soon',
          urgencyLabel: 'Treat Soon',
          cultural: ['Remove infected leaves', 'Improve air circulation', 'Avoid overhead watering'],
          biological: ['Apply Trichoderma to soil'],
          chemical: ['Follow crop-safe fungicide guidance'],
          precautions: ['Wear gloves and mask', 'Follow local agronomic guidance'],
        };
      }
    }

    return {
      diagnosis,
      treatment,
    };
  },
};

export const casesAPI = {
  createCase: async (data: any) => {
    const res = await api.post('/cases', data);
    const payload = unwrapApiData<any>(res.data) || {};
    return payload.case || payload;
  },

  getUserCases: async (params?: { page?: number; limit?: number; cropType?: string; status?: string; search?: string; includeArchived?: boolean }) => {
    const res = await api.get('/cases', { params });
    const payload = unwrapApiData<any>(res.data) || {};
    const cases = Array.isArray(payload.cases) ? payload.cases : Array.isArray(payload) ? payload : [];
    return {
      cases: cases.map(normalizeCase),
      pagination: payload.pagination || { page: 1, limit: cases.length, total: cases.length, pages: 1 },
    };
  },

  getCaseById: async (caseId: string) => {
    const res = await api.get(`/cases/${caseId}`);
    const payload = unwrapApiData<any>(res.data) || {};
    return normalizeCase(payload.case || payload);
  },

  updateCaseNotes: async (caseId: string, notes: string) => {
    const res = await api.put(`/cases/${caseId}/notes`, { notes });
    const payload = unwrapApiData<any>(res.data) || {};
    // backend returns { case: updatedCase } per responseHelper
    return normalizeCase(payload.case || payload);
  },

  deleteCase: async (caseId: string) => {
    const res = await api.delete(`/cases/${caseId}`);
    const payload = unwrapApiData<any>(res.data) || {};
    return Boolean(payload.case || payload.success);
  },
};

export const treatmentAPI = {
  getTreatmentByCaseId: async (caseIdOrCrop: string, diseaseName?: string) => {
    if (diseaseName) {
      const res = await api.get(`/treatment/${encodeURIComponent(caseIdOrCrop)}/${encodeURIComponent(diseaseName)}`);
      const payload = unwrapApiData<any>(res.data) || {};
      return payload.treatment || payload;
    }

    const caseRecord = await casesAPI.getCaseById(caseIdOrCrop);
    if (!caseRecord) return null;

    const resolvedDiseaseName = caseRecord.diagnosis?.primaryDiagnosis?.disease || 'healthy';
    const res = await api.get(`/treatment/${encodeURIComponent(caseRecord.cropType)}/${encodeURIComponent(resolvedDiseaseName)}`);
    const payload = unwrapApiData<any>(res.data) || {};
    return payload.treatment || payload;
  },
};

export default api;

