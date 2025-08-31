import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { createPaymentOrder, generateReceiptId, PaymentError } from '@/services/paymentsApi';
import {
  PaymentUserDetails,
  PaymentItemDetails,
  RazorpayResponse,
  RazorpayOptions
} from '@/types';

interface PaymentButtonProps {
  amount: number;
  currency?: string;
  userDetails: PaymentUserDetails;
  itemDetails: PaymentItemDetails;
  onSuccess?: (response: RazorpayResponse) => void;
  onFailure?: (error: Error) => void;
  onCancel?: () => void;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  amount,
  currency = 'INR',
  userDetails,
  itemDetails,
  onSuccess,
  onFailure,
  onCancel,
  className = '',
  children = 'Pay Now',
  disabled = false
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createOrder = async () => {
    try {
      const receipt_prefix = itemDetails?.itemType
        ? `${itemDetails.itemType}_reg`
        : 'event_reg';

      const receipt = generateReceiptId(receipt_prefix);

      const orderData = {
        amount,
        currency,
        receipt,
        userId: userDetails.id,
        itemId: itemDetails.id,
        itemType: itemDetails.itemType,
        userName: userDetails.name,
        userEmail: userDetails.email,
        userPhone: userDetails.phone,
        notes: userDetails.notes
      };

      return await createPaymentOrder(orderData);
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const openRazorpayCheckout = (orderData: { orderId: string; amount: number; currency: string }) => {
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

    if (!razorpayKey) {
      throw new PaymentError('Razorpay configuration is missing', 'CONFIG_ERROR');
    }

    const options: RazorpayOptions = {
      key: razorpayKey,
      amount: orderData.amount,
      currency: orderData.currency,
      order_id: orderData.orderId,
      name: 'Ethics For Youth',
      description: `Payment for ${itemDetails.name}`,
      image: '/logo.png',
      handler: function (response: RazorpayResponse) {
        console.log('Payment successful:', response);
        toast({
          title: 'Payment Successful',
          description: 'Your registration has been confirmed. You will receive a confirmation email shortly.',
        });
        onSuccess?.(response);
      },
      prefill: {
        name: userDetails.name,
        email: userDetails.email,
        contact: userDetails.phone
      },
      notes: userDetails.notes,
      theme: {
        color: '#3399cc'
      },
      modal: {
        ondismiss: function () {
          console.log('Payment cancelled by user');
          toast({
            title: 'Payment Cancelled',
            description: 'Your payment was cancelled. You can try again later.',
            variant: 'destructive',
          });
          onCancel?.();
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handlePayment = async () => {
    try {
      setIsLoading(true);

      // Load Razorpay script if not already loaded
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new PaymentError('Failed to load payment gateway', 'SCRIPT_LOAD_ERROR');
      }

      // Create order
      const orderData = await createOrder();

      // Open Razorpay checkout
      openRazorpayCheckout(orderData);
    } catch (error) {
      console.error('Payment error:', error);

      const errorMessage = error instanceof PaymentError
        ? error.message
        : 'An unexpected error occurred. Please try again.';

      toast({
        title: 'Payment Error',
        description: errorMessage,
        variant: 'destructive',
      });

      onFailure?.(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={disabled || isLoading}
      className={`payment-button ${className}`}
      size="lg"
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          Processing...
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default PaymentButton;