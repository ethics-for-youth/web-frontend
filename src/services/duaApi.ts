// Duas API Service
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
  week: string;
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
}

export interface UpdateDuaRequest {
  id: string;
  title?: string;
  arabic?: string;
  week?: string;
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
  // Map arabicText -> arabic
  if (dua.arabicText && !dua.arabic) {
    dua.arabic = dua.arabicText;
  }
  return dua as Dua;
};

// 🔑 Utility: build FormData with arabic → arabicText mapping
const buildFormData = (data: any): FormData => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      let fieldKey = key;
      if (key === 'arabic') fieldKey = 'arabicText'; // map for backend

      if (typeof value === 'object' && !(value instanceof File)) {
        formData.append(fieldKey, JSON.stringify(value));
      } else {
        formData.append(fieldKey, value as any);
      }
    }
  });
  return formData;
};

export const duasApi = {
  // Get all duas
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

  // Get single dua
  getDua: async (id: string): Promise<Dua> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.DUA_DETAIL(id));
      let dua: any = response.data?.data?.dua || response.data.dua || response.data;
      return normalizeDua(dua);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Create dua
  createDua: async (duaData: CreateDuaRequest): Promise<Dua> => {
    try {
      const formData = buildFormData(duaData);

      const response = await apiClient.post(API_ENDPOINTS.DUAS, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        return normalizeDua(response.data.data.dua);
      }
      throw new Error('Invalid response format from server');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Update dua
  updateDua: async (duaData: UpdateDuaRequest): Promise<Dua> => {
    const response = await apiClient.patch(API_ENDPOINTS.DUAS, duaData, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to update dua');
    }

    return normalizeDua(response.data.data.dua);
  },

  // Delete dua
  deleteDua: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(API_ENDPOINTS.DUA_DETAIL(id));
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};
