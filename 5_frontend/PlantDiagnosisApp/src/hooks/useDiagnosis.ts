import { useState } from 'react';
import { inferenceService } from '../services/api';
import { DiagnosisResult, TreatmentPlan } from '../types';

export function useDiagnosis() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [treatment, setTreatment] = useState<TreatmentPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const diagnose = async (imageUri: string, cropType: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await inferenceService.diagnose(imageUri, cropType);
      setResult(response.diagnosis);
      setTreatment(response.treatment);
      return response;
    } catch (err: any) {
      setError(err.message || 'Diagnosis failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setTreatment(null);
    setError(null);
  };

  return { diagnose, reset, loading, result, treatment, error };
}