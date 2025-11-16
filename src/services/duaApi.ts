// Duas API Service
import axios from 'axios';
import apiClient, { handleApiError } from '@/lib/apiClient';
import { API_ENDPOINTS, API_CONFIG } from '@/config/api';
import { transformDynamoDBArray, transformDynamoDBObject, isDynamoDBFormatted } from '@/utils/dynamoDbTransform';

// Dua data types
export interface Dua {
  id: string;
  title: string;
  arabic: string;
  week: number;
  transcription?: {
    english?: string;
    hindi?: string;
  };
  translation?: {
    english?: string;
    hindi?: string;
    urdu?: string;
    romanUrdu?: string;
  };
  audioUrl?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CreateDuaRequest {
  title: string;
  arabic: string;
  week: number;
  transcription?: {
    english?: string;
    hindi?: string;
  };
  translation?: {
    english?: string;
    hindi?: string;
    urdu?: string;
    romanUrdu?: string;
  };
  audio?: File;
}

export interface UpdateDuaRequest {
  id: string;
  title?: string;
  arabic?: string;
  week?: number;
  transcription?: {
    english?: string;
    hindi?: string;
  };
  translation?: {
    english?: string;
    hindi?: string;
    urdu?: string;
    romanUrdu?: string;
  };
  audioKey?: File;
  status?: 'active' | 'inactive';
}

// 🔑 Utility: normalize response from API
const normalizeDua = (dua: any): Dua => {
  if (isDynamoDBFormatted(dua)) {
    dua = transformDynamoDBObject(dua);
  }

  return {
    ...dua,
    arabic: dua.arabic || '',
    week: parseInt(dua.week) || 0,
    status: dua.status || 'active',
    createdAt: dua.createdAt || new Date().toISOString(),
    updatedAt: dua.updatedAt || new Date().toISOString(),
  } as Dua;
};

// 🔑 Utility: build FormData with arabic → arabicText mapping
const buildFormData = (data: any): FormData => {
  // Validate required fields for create
  if (!data.title || !data.arabic || !data.week) {
    throw new Error('Missing required fields: title, arabic, week');
  }

  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    let fieldKey = key;
    if (key === 'arabic') fieldKey = 'arabicText';

    if (value instanceof File) {
      formData.append(fieldKey, value);
    } else if (typeof value === 'object') {
      formData.append(fieldKey, JSON.stringify(value));
    } else {
      formData.append(fieldKey, String(value));
    }
  });

  return formData;
};

export const duasApi = {
  // Get all duas (unchanged)
  getDuas: async (): Promise<Dua[]> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.DUAS);

      if (API_CONFIG.enableLogging) {
        console.log('Duas API Response:', response.data);
      }

      let duas: any[] = [];
      if (response.data.success && response.data.data?.duas) {
        duas = response.data.data.duas;
      } else if (Array.isArray(response.data)) {
        duas = response.data;
      }

      return duas.map(normalizeDua);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get single dua (unchanged)
  getDua: async (id: string): Promise<Dua> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.DUA_DETAIL(id));
      let dua: any = response.data?.data?.dua || response.data.dua || response.data;
      return normalizeDua(dua);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Create dua (added status default + logging)
  createDua: async (duaData: CreateDuaRequest): Promise<Dua> => {
    try {
      // Ensure status for create
      const dataWithStatus = { ...duaData, status: 'active' };
      const formData = buildFormData(dataWithStatus);

      // Log FormData for debug (remove in prod)
      if (API_CONFIG.enableLogging) {
        console.log('📤 Create FormData payload:');
        for (const [k, v] of formData.entries()) {
          console.log(`  ${k}:`, v);
        }
      }

      const response = await apiClient.post(API_ENDPOINTS.DUAS, formData); // No headers—auto multipart

      if (response.data.success && response.data.data?.dua) {
        return normalizeDua(response.data.data.dua);
      }
      throw new Error('Invalid response format from server');
    } catch (error) {
      // Log full error for debugging
      if (API_CONFIG.enableLogging && axios.isAxiosError(error)) {
        console.error('❌ Full Create Error Response:', error.response?.data);
      }
      throw new Error(handleApiError(error));
    }
  },

  // Update dua (strip id + log payload)
  updateDua: async (duaData: UpdateDuaRequest): Promise<Dua> => {
    let payload: any = { ...duaData };

    // 🔧 FIX: Always strip id from body (redundant, can cause validation 400s)
    delete payload.id;

    let headers = { 'Content-Type': 'application/json' };

    // If audio is updated, send FormData instead
    if (duaData.audioKey instanceof File) {
      const formData = new FormData();
      Object.entries(payload).forEach(([k, v]) => {
        if (v === undefined || v === null || v === '') return; // Skip empties
        const key = k === 'arabic' ? 'arabicText' : k;

        // 🔧 FIXED: Type-safe append with narrowing
        if (v instanceof File) {
          formData.append(key, v);
        } else if (typeof v === 'object') {
          try {
            formData.append(key, JSON.stringify(v));
          } catch (stringifyErr) {
            console.warn(`⚠️ Skipped appending ${key}: JSON.stringify failed`, stringifyErr);
          }
        } else if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
          formData.append(key, String(v)); // Coerce to string
        } else {
          console.warn(`⚠️ Skipped invalid append for ${key}:`, typeof v);
        }
      });
      payload = formData;
      headers = { 'Content-Type': 'multipart/form-data' };

      // Log FormData (now works for non-create too)
      if (API_CONFIG.enableLogging) {
        console.log('📤 Update FormData payload:');
        for (const [key, value] of formData.entries()) {
          console.log(`  ${key}:`, value);
        }
      }
    } else {
      // JSON payload – map arabic → arabicText
      if ('arabic' in payload) {
        payload.arabicText = payload.arabic;
        delete payload.arabic;
      }

      // Log JSON payload
      if (API_CONFIG.enableLogging) {
        console.log('📤 Update JSON payload:', payload);
      }
    }

    const response = await apiClient.put(
      API_ENDPOINTS.DUA_DETAIL(duaData.id),
      payload,
      { headers }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to update dua');
    }
    let updatedDua = response.data.data?.dua || response.data.data;
    return normalizeDua(updatedDua);
  },

  // Delete dua (added optional empty body + logging)
  deleteDua: async (id: string): Promise<void> => {
    try {
      if (API_CONFIG.enableLogging) {
        console.log(`🗑️ Deleting Dua ID: ${id}`);
      }
      // 🔧 Some backends expect a body for DELETE (rare, but fixes weird 400s)
      // ✅ STANDARD DELETE:
      await apiClient.delete(API_ENDPOINTS.DUA_DETAIL(id));
    } catch (error) {
      // Log full error
      if (API_CONFIG.enableLogging && axios.isAxiosError(error)) {
        console.error('❌ Full Delete Error Response:', error.response?.data);
      }
      throw new Error(handleApiError(error));
    }
  },
};