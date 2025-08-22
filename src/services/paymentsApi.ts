import apiClient, { handleApiError } from '@/lib/apiClient';
import { 
  PaymentOrderRequest, 
  PaymentOrderResponse, 
  PaymentErrorResponse 
} from '@/types';

export class PaymentError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'PaymentError';
  }
}

export const createPaymentOrder = async (
  orderData: PaymentOrderRequest
): Promise<PaymentOrderResponse['data']> => {
  try {
    const response = await apiClient.post<PaymentOrderResponse>(
      '/payments/create-order',
      orderData
    );

    if (!response.data.success) {
      throw new PaymentError(
        response.data.message || 'Failed to create payment order',
        'API_ERROR'
      );
    }

    return response.data.data;
  } catch (error) {
    console.error('Payment order creation failed:', error);
    
    if (error instanceof PaymentError) {
      throw error;
    }

    const errorMessage = handleApiError(error);
    throw new PaymentError(errorMessage, 'NETWORK_ERROR');
  }
};

export const generateReceiptId = (prefix: string = 'efy'): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${random}`;
};