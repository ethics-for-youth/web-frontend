import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarDays, MapPin, Users, Clock } from 'lucide-react';
import PaymentButton from '@/components/PaymentButton';
import { RazorpayResponse } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface EventRegistrationPaymentProps {
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    registrationFee: number;
    maxParticipants: number;
  };
  onRegistrationSuccess?: (paymentResponse: RazorpayResponse) => void;
}

const EventRegistrationPayment: React.FC<EventRegistrationPaymentProps> = ({
  event,
  onRegistrationSuccess
}) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: ''
  });
  const { toast } = useToast();

  const handlePaymentSuccess = (response: RazorpayResponse) => {
    console.log('Payment successful for event registration:', response);
    setIsRegistered(true);
    
    toast({
      title: 'Registration Successful!',
      description: `You have successfully registered for ${event.title}. Check your email for confirmation details.`,
    });

    onRegistrationSuccess?.(response);
  };

  const handlePaymentFailure = (error: Error) => {
    console.error('Payment failed for event registration:', error);
    
    toast({
      title: 'Registration Failed',
      description: 'There was an issue with your payment. Please try again or contact support.',
      variant: 'destructive',
    });
  };

  const handlePaymentCancel = () => {
    console.log('Payment cancelled for event registration');
    
    toast({
      title: 'Payment Cancelled',
      description: 'Your registration was cancelled. You can try again anytime.',
      variant: 'destructive',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const spotsLeft = event.maxParticipants;

  const handleInputChange = (field: string, value: string) => {
    setUserDetails(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = userDetails.name && userDetails.email && userDetails.phone && userDetails.age && userDetails.gender;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-primary">
              {event.title}
            </CardTitle>
            <CardDescription className="text-base">
              {event.description}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="ml-4">
            ₹{event.registrationFee}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span>{formatDate(event.date)}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{spotsLeft} spots left</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Registration closes soon</span>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-semibold mb-4">Registration Details:</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={userDetails.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={userDetails.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={userDetails.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+91 9876543210"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  value={userDetails.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  placeholder="25"
                  min="13"
                  max="100"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select value={userDetails.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {spotsLeft <= 5 && spotsLeft > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-amber-800 text-sm font-medium">
              ⚡ Only {spotsLeft} spots remaining! Register now to secure your place.
            </p>
          </div>
        )}

        {spotsLeft === 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-800 text-sm font-medium">
              🚫 This event is fully booked. Join our waitlist to be notified if spots open up.
            </p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-6">
        <div className="w-full space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Registration Fee:</span>
            <span className="text-2xl font-bold text-primary">
              ₹{event.registrationFee.toFixed(2)}
            </span>
          </div>
          
          {!isRegistered && spotsLeft > 0 ? (
            <PaymentButton
              amount={event.registrationFee}
              currency="INR"
              userDetails={{
                id: `user_${Date.now()}`,
                name: userDetails.name,
                email: userDetails.email,
                phone: userDetails.phone
              }}
              eventDetails={{
                id: event.id,
                name: event.title
              }}
              onSuccess={handlePaymentSuccess}
              onFailure={handlePaymentFailure}
              onCancel={handlePaymentCancel}
              className="w-full"
              disabled={!isFormValid}
            >
              Register Now - ₹{event.registrationFee}
            </PaymentButton>
          ) : isRegistered ? (
            <div className="text-center py-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-semibold">
                  ✅ Successfully Registered!
                </p>
                <p className="text-green-700 text-sm mt-1">
                  Check your email for event details and updates.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-600 font-medium">
                  Registration Currently Unavailable
                </p>
              </div>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default EventRegistrationPayment;