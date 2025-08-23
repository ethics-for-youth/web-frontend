// Messages API Service
import apiClient, { handleApiError } from '@/lib/apiClient';
import { API_ENDPOINTS, API_CONFIG } from '@/config/api';
import { transformDynamoDBArray, transformDynamoDBObject, isDynamoDBFormatted } from '@/utils/dynamoDbTransform';

// Message data types based on your API spec
export interface Message {
  id: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  messageType: 'feedback' | 'thank-you' | 'suggestion' | 'complaint' | 'general';
  subject?: string;
  content: string;
  isPublic?: boolean;
  status: 'new' | 'read' | 'responded' | 'archived';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateMessageRequest {
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  messageType: 'feedback' | 'thank-you' | 'suggestion' | 'complaint' | 'general';
  subject?: string;
  content: string;
  isPublic?: boolean;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  tags?: string[];
}

export interface MessageFilters {
  admin?: boolean;
  messageType?: 'feedback' | 'thank-you' | 'suggestion' | 'complaint' | 'general';
  status?: 'new' | 'read' | 'responded' | 'archived';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
}

export const messagesApi = {
  // Submit a message
  createMessage: async (messageData: CreateMessageRequest): Promise<{ messageId: string }> => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.MESSAGES, messageData);
      
      if (API_CONFIG.enableLogging) {
        console.log('Message API Response:', response.data);
      }
      
      // According to API spec: { success: boolean, message: string, data: { message: Message } }
      if (response.data.success && response.data.data && response.data.data.message) {
        return { messageId: response.data.data.message.id };
      } else {
        throw new Error('Message submission failed or invalid response format');
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get all messages with filtering
  getMessages: async (filters?: MessageFilters): Promise<Message[]> => {
    try {
      const params = new URLSearchParams();
      
      if (filters?.admin) params.append('admin', 'true');
      if (filters?.messageType) params.append('messageType', filters.messageType);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.priority) params.append('priority', filters.priority);

      const url = params.toString() ? `${API_ENDPOINTS.MESSAGES}?${params.toString()}` : API_ENDPOINTS.MESSAGES;
      const response = await apiClient.get(url);
      
      if (API_CONFIG.enableLogging) {
        console.log('Messages API Response:', response.data);
      }

      let messages: Message[] = [];
      
      // According to API spec: { success: boolean, message: string, data: { messages: [], count: number } }
      if (response.data.success && response.data.data && Array.isArray(response.data.data.messages)) {
        messages = response.data.data.messages;
      } else if (Array.isArray(response.data)) {
        messages = response.data;
      } else {
        console.error('Unexpected messages API response:', response.data);
        return [];
      }

      // Transform DynamoDB data if needed
      if (messages.length > 0 && isDynamoDBFormatted(messages[0])) {
        if (API_CONFIG.enableLogging) {
          console.log('Transforming DynamoDB formatted messages data');
        }
        return transformDynamoDBArray(messages);
      }

      return messages;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};