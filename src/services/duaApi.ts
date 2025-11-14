// Duas API Service - FINAL VERSION
import apiClient, { handleApiError } from '@/lib/apiClient';
import { API_ENDPOINTS, API_CONFIG } from '@/config/api';
import { transformDynamoDBArray, transformDynamoDBObject, isDynamoDBFormatted } from '@/utils/dynamoDbTransform';

// ============================================
// EXPORTED TYPE DEFINITIONS
// ============================================

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

// ============================================
// UTILITY FUNCTIONS
// ============================================

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

const buildFormData = (data: any): FormData => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      let fieldKey = key;
      if (key === 'arabic') fieldKey = 'arabicText';

      if (typeof value === 'object' && !(value instanceof File)) {
        formData.append(fieldKey, JSON.stringify(value));
      } else {
        formData.append(fieldKey, value as any);
      }
    }
  });
  return formData;
};

// ============================================
// API FUNCTIONS
// ============================================

export const duasApi = {
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

  getDua: async (id: string): Promise<Dua> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.DUA_DETAIL(id));
      let dua: any = response.data?.data?.dua || response.data.dua || response.data;
      return normalizeDua(dua);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  createDua: async (duaData: CreateDuaRequest): Promise<Dua> => {
    try {
      const formData = buildFormData(duaData);
      
      if (API_CONFIG.enableLogging) {
        console.log('📤 Creating Dua with FormData:');
        for (const [k, v] of formData.entries()) {
          console.log(`  ${k}:`, v instanceof File ? `File(${v.name}, ${v.size} bytes)` : v);
        }
      }

      const response = await apiClient.post(API_ENDPOINTS.DUAS, formData);

      if (API_CONFIG.enableLogging) {
        console.log('✅ Create Response:', response.data);
      }

      if (response.data.success && response.data.data?.dua) {
        return normalizeDua(response.data.data.dua);
      }
      
      throw new Error(response.data.message || 'Invalid response format from server');
    } catch (error: any) {
      console.error('❌ Create Dua Error:', error);
      throw new Error(handleApiError(error));
    }
  },

  updateDua: async (duaData: UpdateDuaRequest): Promise<Dua> => {
    try {
      let payload: any;
      let config: any = {};

      if (duaData.audioKey instanceof File) {
        const formData = new FormData();
        Object.entries(duaData).forEach(([k, v]) => {
          if (v === undefined || v === null) return;
          const key = k === 'arabic' ? 'arabicText' : k;
          formData.append(
            key,
            v instanceof File ? v : typeof v === 'object' ? JSON.stringify(v) : v
          );
        });
        payload = formData;
      } else {
        payload = { ...duaData };
        if ('arabic' in payload) {
          payload.arabicText = payload.arabic;
          delete payload.arabic;
        }
        config.headers = { 'Content-Type': 'application/json' };
      }

      if (API_CONFIG.enableLogging) {
        console.log('📤 Updating Dua:', duaData.id, payload instanceof FormData ? 'FormData' : 'JSON');
      }

      const response = await apiClient.put(
        API_ENDPOINTS.DUA_DETAIL(duaData.id),
        payload,
        config
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update dua');
      }

      let updatedDua = response.data.data?.dua || response.data.data;
      return normalizeDua(updatedDua);
    } catch (error: any) {
      console.error('❌ Update Dua Error:', error);
      throw new Error(handleApiError(error));
    }
  },

  deleteDua: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(API_ENDPOINTS.DUA_DETAIL(id));
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};