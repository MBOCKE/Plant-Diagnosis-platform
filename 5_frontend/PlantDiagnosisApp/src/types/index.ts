// ============================================
// CORE TYPES
// ============================================

export type CropType = 'tomato' | 'banana_plantain';

export type UrgencyLevel = 'monitor' | 'treat_soon' | 'treat_immediately';

export type CaseStatus = 'pending' | 'diagnosed' | 'failed' | 'synced';

// ============================================
// USER
// ============================================

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  preferredLanguage: 'en' | 'fr';
  location?: string;
}

// ============================================
// DIAGNOSIS
// ============================================

export interface Diagnosis {
  disease: string;
  scientificName?: string;
  confidence: number;
}

export interface DiagnosisResult {
  primaryDiagnosis: Diagnosis;
  alternativeDiagnoses: Diagnosis[];
  allPredictions: Diagnosis[];
  modelUsed: string;
  inferenceTimeMs: number;
}

// ============================================
// TREATMENT
// ============================================

export interface TreatmentPlan {
  urgency: UrgencyLevel;
  urgencyLabel: string;
  cultural: string[];
  biological: string[];
  chemical: string[];
  precautions: string[];
}

// ============================================
// CASE
// ============================================

export interface CaseImage {
  uri: string;
  uploadedAt: string;
}

export interface Case {
  id: string;
  userId: string;
  cropType: CropType;
  images: CaseImage[];
  symptomsDescription?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  status: CaseStatus;
  diagnosis?: DiagnosisResult;
  treatment?: TreatmentPlan;
  followUpNotes?: string;
  isOfflineCase: boolean;
  createdAt: string;
  syncedAt?: string;
}

// ============================================
// API
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
  preferredLanguage?: 'en' | 'fr';
}

export interface AuthResponse {
  user: User;
  token: string;
}