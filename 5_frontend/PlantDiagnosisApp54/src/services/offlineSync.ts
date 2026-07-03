import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

import type { CropType, Case } from '../types';

export type OfflineCasePayload = {
  // backend expects these fields (from Case model)
  localId: string; // client-side only; backend ignores
  cropType: CropType;
  imageUri: string;
  symptomsDescription?: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
};

const OFFLINE_QUEUE_KEY = 'offline_case_queue_v1';

function normalizeQueueItem(item: OfflineCasePayload): OfflineCasePayload {
  return {
    localId: item.localId,
    cropType: item.cropType,
    imageUri: item.imageUri,
    symptomsDescription: item.symptomsDescription,
    latitude: item.latitude,
    longitude: item.longitude,
    createdAt: item.createdAt,
  };
}

export async function getOfflineQueue(): Promise<OfflineCasePayload[]> {
  const raw = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as OfflineCasePayload[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeQueueItem);
  } catch {
    return [];
  }
}

export async function enqueueOfflineCase(caseData: OfflineCasePayload): Promise<void> {
  const queue = await getOfflineQueue();
  const next = [...queue, normalizeQueueItem(caseData)];
  await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(next));
}

export async function clearOfflineQueue(): Promise<void> {
  await AsyncStorage.removeItem(OFFLINE_QUEUE_KEY);
}

export async function removeOfflineItemsByIds(localIds: string[]): Promise<void> {
  if (localIds.length === 0) return;
  const queue = await getOfflineQueue();
  const keep = queue.filter(q => !localIds.includes(q.localId));
  await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(keep));
}

export async function getPendingOfflineCount(): Promise<number> {
  const queue = await getOfflineQueue();
  return queue.length;
}

export async function syncOfflineCases(): Promise<{ syncedCount: number }> {
  const queue = await getOfflineQueue();
  if (queue.length === 0) return { syncedCount: 0 };

  // Backend endpoint: POST /api/cases/sync
  // In case-service routes it expects: { cases: [...] }
  // It will create Mongoose Case docs for each entry.
  const res = await api.post('/cases/sync', {
    cases: queue.map(item => ({
      // backend Case schema requires: cropType, imageUri, status is set by service
      cropType: item.cropType,
      imageUri: item.imageUri,
      symptomsDescription: item.symptomsDescription,
      location: {
        type: 'Point',
        coordinates: [item.longitude ?? 0, item.latitude ?? 0],
      },
      // store createdAt so sorting makes sense
      createdAt: item.createdAt,
    })),
  });

  // if request succeeded, remove all synced items
  const localIds = queue.map(q => q.localId);
  await removeOfflineItemsByIds(localIds);

  // res shape: success helper returns { message, data: { cases } }
  return { syncedCount: localIds.length };
}

