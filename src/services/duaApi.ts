// Duas API Service
import axios from 'axios';
import apiClient, { handleApiError } from '@/lib/apiClient';
import { API_ENDPOINTS, API_CONFIG } from '@/config/api';
import { transformDynamoDBArray, transformDynamoDBObject, isDynamoDBFormatted } from '@/utils/dynamoDbTransform';

// Dua data types
export interface Dua {
  id: string;
  title: string;
  arabicText: string;
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
  arabicText: string;
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
  arabicText?: string;
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
  audio?: File;
  status?: 'active' | 'inactive';
}

// 🔑 Utility: normalize response from API
const normalizeDua = (dua: any): Dua => {
  if (isDynamoDBFormatted(dua)) {
    dua = transformDynamoDBObject(dua);
  }

  return {
    ...dua,
     arabicText: dua.arabicText || dua.arabic || '',
    week: parseInt(dua.week) || 0,
    status: dua.status || 'active',
    createdAt: dua.createdAt || new Date().toISOString(),
    updatedAt: dua.updatedAt || new Date().toISOString(),
  } as Dua;
};

// 🔑 Utility: build FormData with arabic → arabicText mapping
const buildFormData = (data: any): FormData => {
  const requiredFields = ['title', 'arabicText', 'week'];
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  const formData = new FormData();

  for (const [key, value] of Object.entries(data)) {
    if (value == null) continue;

    if (value instanceof File) {
      formData.append(key, value);
    } else if (typeof value === 'object') {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  }

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
      const dataWithStatus = { ...duaData, status: 'active' };
      const formData = buildFormData(dataWithStatus);
      for (const pair of formData.entries()) {
          console.log(pair[0], pair[1]);
        }

      // ✅ Log exact payload
      if (API_CONFIG.enableLogging) {
        console.log('📤 Create Dua - Full Payload:');
        console.log('  Title:', duaData.title);
        console.log('  Arabic:', duaData.arabicText);
        console.log('  Week:', duaData.week);
        console.log('  Transcription:', duaData.transcription);
        console.log('  Translation:', duaData.translation);
        console.log('  Audio:', duaData.audio ? `File: ${duaData.audio.name}` : 'None');
      }

      const response = await apiClient.post(API_ENDPOINTS.DUAS, formData, {
  timeout: 60000, //  1 minute for uploads
});


      if (response.data.success && response.data.data?.dua) {
        return normalizeDua(response.data.data.dua);
      }
      throw new Error('Invalid response format from server');
    } catch (error) {
      // ✅ Enhanced error logging
      if (API_CONFIG.enableLogging && axios.isAxiosError(error)) {
        console.error('❌ Create Dua Failed:');
        console.error('  Status:', error.response?.status);
        console.error('  Error:', error.response?.data);
        console.error('  Request URL:', error.config?.url);
        console.error('  Request Method:', error.config?.method);

        // Log what backend actually received (if available in error)
        if (error.response?.data?.received) {
          console.error('  Backend received:', error.response.data.received);
        }
      }
      throw new Error(handleApiError(error));
    }
  },

  // Update dua (strip id + log payload)
  updateDua: async (duaData: UpdateDuaRequest): Promise<Dua> => {
  try {
    if (!duaData.id) {
      throw new Error("ID is required for update");
    }

    // ✅ Build payload EXACTLY as backend expects
    const payload: any = {
      ...duaData,
      week: duaData.week ? String(duaData.week) : undefined,
      status: duaData.status,
    };

    if (API_CONFIG.enableLogging) {
      console.log("📤 Final Update Payload Sent to Backend:", payload);
    }

    const response = await apiClient.patch(
      API_ENDPOINTS.DUAS, 
      payload,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.data?.success) {
      throw new Error(response.data?.message || "Failed to update dua");
    }

    const updated = response.data.data?.dua || response.data.data;
    return normalizeDua(updated);
  } catch (error) {
    console.error("❌ Patch Dua Error:", error);
    throw new Error(handleApiError(error));
  }
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