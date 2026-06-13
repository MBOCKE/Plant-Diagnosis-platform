export type CropType = 'tomato' | 'banana_plantain';
export type UrgencyLevel = 'monitor' | 'treat_soon' | 'treat_immediately';
export type CaseStatus = 'pending' | 'diagnosed' | 'failed' | 'synced';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  preferredLanguage: 'en' | 'fr';
  location?: string;
}

export interface Diagnosis {
  disease: string;
  scientificName?: string;
  confidence: number;
}

export interface DiagnosisResult {
  primaryDiagnosis: Diagnosis;
  alternativeDiagnoses: Diagnosis[];
  modelUsed: string;
  inferenceTimeMs: number;
}

export interface TreatmentPlan {
  urgency: UrgencyLevel;
  urgencyLabel: string;
  cultural: string[];
  biological: string[];
  chemical: string[];
  precautions: string[];
}

export interface Case {
  id: string;
  cropType: CropType;
  imageUri: string;
  symptomsDescription?: string;
  latitude?: number;
  longitude?: number;
  status: CaseStatus;
  diagnosis?: DiagnosisResult;
  treatment?: TreatmentPlan;
  followUpNotes?: string;
  isOfflineCase: boolean;
  createdAt: string;
}