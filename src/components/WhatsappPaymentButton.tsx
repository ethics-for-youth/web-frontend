import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { PaymentUserDetails, PaymentItemDetails } from '@/types';
import { useCreatePendingRegistration } from '@/hooks/useRegistrations';
// import { FaWhatsapp } from 'react-icons/fa';

interface WhatsAppPaymentButtonProps {
  amount: number;
  currency?: string;
  userDetails: PaymentUserDetails;
  itemDetails: PaymentItemDetails;
  onSuccess?: (data: any) => void;
  onFailure?: (error: Error) => void;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

const WhatsAppPaymentButton: React.FC<WhatsAppPaymentButtonProps> = ({
  amount,
  currency = 'INR',
  userDetails,
  itemDetails,
  onSuccess,
  onFailure,
  className = '',
  children = 'Register via WhatsApp',
  disabled = false
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Use mutation hook
  const createPendingRegistration = useCreatePendingRegistration();

  const handleWhatsAppPayment = async () => {
    try {
      setIsLoading(true);

      const data = await createPendingRegistration.mutateAsync({
        amount,
        currency,
        userId: userDetails.id,
        userName: userDetails.name,
        userEmail: userDetails.email,
        userPhone: userDetails.phone,
        userGender: userDetails.gender,
        userAge: userDetails.age,
        userEducation: userDetails.education,
        userJoinCommunity: userDetails.joinCommunity,
        itemId: itemDetails.id,
        itemType: itemDetails.itemType,
        notes: {
          customer_id: userDetails.id,
          item_id: itemDetails.id,
          item_name: itemDetails.name,
          item_type: itemDetails.itemType,
          customer_name: userDetails.name,
          customer_email: userDetails.email,
          customer_phone: userDetails.phone,
          ...userDetails.notes
        }
      });

      toast({
        title: 'Registration Submitted',
        description: data.message || 'You will be contacted soon for the payment.',
      });

      onSuccess?.(data);
    } catch (error: any) {
      console.error('WhatsApp registration error:', error);

      toast({
        title: 'Registration Failed',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });

      onFailure?.(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleWhatsAppPayment}
      disabled={disabled || isLoading}
      className={`whatsapp-payment-button bg-green-500 hover:bg-green-600 text-white ${className}`}
      size="lg"
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          Processing...
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {/* <FaWhatsapp className="text-lg" /> */}
          {children}
        </div>
      )}
    </Button>
  );
};

export default WhatsAppPaymentButton;
