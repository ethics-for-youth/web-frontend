// Duas API Service
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
    // urdu?: string;
  };
  translation?: {
    english?: string;
    hindi?: string;
    urdu?: string;
    romanUrdu?: string;
  };
  audioUrl?: string; // URL to audio file
//   image?: string; // URL to image
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
    // urdu?: string;
  };
  translation?: {
    english?: string;
    hindi?: string;
    urdu?: string;
    romanUrdu?: string;
  };
  audioKey?: File;
//   image?: File;
}

export interface UpdateDuaRequest {
  title?: string;
  arabicText?: string;
  week?: number;
  transcription?: {
    english?: string;
    hindi?: string;
    // urdu?: string;
  };
  translation?: {
    english?: string;
    hindi?: string;
    urdu?: string;
    romanUrdu?: string;
  };
  audioKey?: File;
//   image?: File;
  status?: 'active' | 'inactive';
}

export const duasApi = {
  // Get all duas
  getDuas: async (): Promise<Dua[]> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.DUAS);

      if (API_CONFIG.enableLogging) {
        console.log('Duas API Response:', response.data);
      }

      let duas: Dua[] = [];

      if (response.data.success && response.data.data && Array.isArray(response.data.data.duas)) {
        duas = response.data.data.duas;
      } else if (Array.isArray(response.data)) {
        duas = response.data;
      } else {
        console.error('Unexpected duas API response:', response.data);
        return [];
      }

      if (duas.length > 0 && isDynamoDBFormatted(duas[0])) {
        return transformDynamoDBArray(duas);
      }

      return duas;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get single dua by ID
  getDua: async (id: string): Promise<Dua> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.DUA_DETAIL(id));
      let dua: Dua;

      if (response.data.success && response.data.data && response.data.data.dua) {
        dua = response.data.data.dua;
      } else if (response.data.dua) {
        dua = response.data.dua;
      } else {
        dua = response.data;
      }

      if (isDynamoDBFormatted(dua)) {
        return transformDynamoDBObject(dua);
      }

      return dua;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Create new dua (multipart/form-data)
  createDua: async (duaData: CreateDuaRequest): Promise<Dua> => {
    try {
      const formData = new FormData();
      Object.entries(duaData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (typeof value === 'object' && !(value instanceof File)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value as any);
          }
        }
      });

      const response = await apiClient.post(API_ENDPOINTS.DUAS, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success && response.data.data && response.data.data.dua) {
        const dua = response.data.data.dua;
        if (isDynamoDBFormatted(dua)) {
          return transformDynamoDBObject(dua);
        }
        return dua;
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Update dua (multipart/form-data for file support)
  updateDua: async (id: string, duaData: UpdateDuaRequest): Promise<Dua> => {
    try {
      const formData = new FormData();
      Object.entries(duaData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (typeof value === 'object' && !(value instanceof File)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value as any);
          }
        }
      });

      const response = await apiClient.put(API_ENDPOINTS.DUA_DETAIL(id), formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success && response.data.data && response.data.data.dua) {
        const dua = response.data.data.dua;
        if (isDynamoDBFormatted(dua)) {
          return transformDynamoDBObject(dua);
        }
        return dua;
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
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
