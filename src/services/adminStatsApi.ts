// Admin Stats API Service
import apiClient, { handleApiError } from '@/lib/apiClient';
import { API_ENDPOINTS, API_CONFIG } from '@/config/api';
import { transformDynamoDBObject, isDynamoDBFormatted } from '@/utils/dynamoDbTransform';

// Admin stats data types based on your API spec
export interface AdminStats {
  overview: {
    totalEvents: number;
    totalCompetitions: number;
    totalVolunteers: number;
    totalParticipants: number;
    totalCourses: number;
    totalRegistrations: number;
    totalMessages: number;
  };
  events: {
    total: number;
    active: number;
    upcoming: number;
  };
  competitions: {
    total: number;
    upcoming: number;
  };
  volunteers: {
    total: number;
  };
  courses: {
    total: number;
  };
  registrations: {
    total: number;
    recent: number;
  };
  messages: {
    total: number;
    pending: number;
    byType: {
      feedback: number;
      'thank-you': number;
      suggestion: number;
      complaint: number;
      general: number;
    };
  };
}

export interface AdminStatsResponse {
  stats: AdminStats;
  lastUpdated: string;
}

export const adminStatsApi = {
  // Get admin dashboard statistics
  getAdminStats: async (): Promise<AdminStatsResponse> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN_STATS);
      
      if (API_CONFIG.enableLogging) {
        console.log('Admin Stats API Response:', response.data);
      }
      
      // According to API spec: { success: boolean, message: string, data: { stats: AdminStats, lastUpdated: string } }
      if (response.data.success && response.data.data) {
        let statsData = response.data.data;
        
        // Transform DynamoDB data if needed
        if (isDynamoDBFormatted(statsData)) {
          if (API_CONFIG.enableLogging) {
            console.log('Transforming DynamoDB formatted admin stats data');
          }
          statsData = transformDynamoDBObject(statsData);
        }
        
        return {
          stats: statsData.stats,
          lastUpdated: statsData.lastUpdated
        };
      } else {
        throw new Error('Invalid admin stats response format');
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};