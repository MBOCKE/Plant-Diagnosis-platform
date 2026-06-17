import type { Case } from '../types';

export const mockCases: Case[] = [
  {
    id: '1',
    cropType: 'tomato',
    imageUri: 'mock://case-1',
    symptomsDescription:
      'Dark lesions on leaves with yellowing edges. Infection seems to start from lower foliage.',
    latitude: 43.6045,
    longitude: 3.8801,
    status: 'diagnosed',
    createdAt: '2026-10-15T09:12:00.000Z',
    isOfflineCase: false,
    diagnosis: {
      primaryDiagnosis: {
        disease: 'Early Blight',
        scientificName: 'Alternaria solani',
        confidence: 94,
      },
      alternativeDiagnoses: [
        { disease: 'Late Blight', confidence: 23 },
        { disease: 'Bacterial Spot', confidence: 12 },
      ],
      modelUsed: 'mobilenetv2-v1',
      inferenceTimeMs: 1247,
    },
    treatment: {
      urgency: 'treat_soon',
      urgencyLabel: 'Treat Soon',
      cultural: [
        'Remove infected leaves',
        'Improve air circulation',
        'Avoid overhead watering',
        'Apply mulch',
      ],
      biological: ['Apply Trichoderma to soil', 'Use Bacillus subtilis spray'],
      chemical: ['Copper hydroxide 2g/L every 7-10 days', 'Chlorothalonil as preventive'],
      precautions: ['Wear gloves and mask', '7-day pre-harvest interval', 'Spray early morning'],
    },
    followUpNotes: 'Recheck after 7 days. Keep notes of new lesion spread.',
  },
  {
    id: '2',
    cropType: 'banana_plantain',
    imageUri: 'mock://case-2',
    symptomsDescription:
      'Brown to black streaks on leaves; lesions expand rapidly under humid conditions.',
    latitude: 40.7128,
    longitude: -74.006,
    status: 'diagnosed',
    createdAt: '2026-10-12T15:35:00.000Z',
    isOfflineCase: false,
    diagnosis: {
      primaryDiagnosis: {
        disease: 'Black Sigatoka',
        scientificName: 'Pseudocercospora fijiensis',
        confidence: 89,
      },
      alternativeDiagnoses: [
        { disease: 'Yellow Sigatoka', confidence: 18 },
        { disease: 'Sigatoka leaf spot', confidence: 11 },
      ],
      modelUsed: 'mobilenetv2-v1',
      inferenceTimeMs: 1320,
    },
    treatment: {
      urgency: 'treat_immediately',
      urgencyLabel: 'Treat Immediately',
      cultural: [
        'Remove heavily infected leaves',
        'Reduce plant density for airflow',
        'Avoid water splash onto leaves',
      ],
      biological: ['Apply Trichoderma around the plant base'],
      chemical: [
        'Protective fungicide application as per label',
        'Copper-based spray during peak humidity',
      ],
      precautions: ['Use protective gear', 'Follow pre-harvest interval', 'Do not spray during windy hours'],
    },
    followUpNotes: 'Inspect bunch area and new leaves every 3-4 days.',
  },
  {
    id: '3',
    cropType: 'tomato',
    imageUri: 'mock://case-3',
    symptomsDescription:
      'No visible disease signs. Leaves look uniform in color and texture.',
    status: 'synced',
    createdAt: '2026-10-10T08:05:00.000Z',
    isOfflineCase: true,
    diagnosis: {
      primaryDiagnosis: {
        disease: 'Healthy',
        confidence: 98,
      },
      alternativeDiagnoses: [],
      modelUsed: 'mobilenetv2-v1',
      inferenceTimeMs: 990,
    },
    treatment: {
      urgency: 'monitor',
      urgencyLabel: 'Monitor',
      cultural: ['Keep regular inspection', 'Maintain balanced fertilization'],
      biological: [],
      chemical: [],
      precautions: ['Avoid unnecessary sprays'],
    },
    followUpNotes: 'Continue routine monitoring once per week.',
  },
];

