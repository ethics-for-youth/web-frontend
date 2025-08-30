import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import PaymentButton from '@/components/PaymentButton';
import { RazorpayResponse, Course } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface CourseRegistrationPaymentProps {
  course: Course & {
    registrationFee: number;
  };
  onRegistrationSuccess?: (paymentResponse: RazorpayResponse) => void;
}

const CourseRegistrationPayment: React.FC<CourseRegistrationPaymentProps> = ({
  course,
  onRegistrationSuccess
}) => {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    education: '',
    address: '',
    joinCommunity: false
  });
  const { toast } = useToast();

  const handlePaymentSuccess = (response: RazorpayResponse) => {
    setIsEnrolled(true);
    toast({
      title: 'Enrollment Successful!',
      description: `You have successfully enrolled in ${course.title}. Check your email for course access details.`,
    });
    onRegistrationSuccess?.(response);
  };

  const handlePaymentFailure = (error: Error) => {
    console.error('Payment failed:', error);
    toast({
      title: 'Enrollment Failed',
      description: 'There was an issue with your payment. Please try again or contact support.',
      variant: 'destructive',
    });
  };

  const handlePaymentCancel = () => {
    toast({
      title: 'Payment Cancelled',
      description: 'Your enrollment was cancelled. You can try again anytime.',
      variant: 'destructive',
    });
  };

  const spotsLeft = course.maxParticipants || null;

  const handleInputChange = (field: string, value: string | boolean) => {
    setUserDetails(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid =
    userDetails.name &&
    userDetails.email &&
    userDetails.phone &&
    userDetails.age &&
    userDetails.gender &&
    userDetails.education &&
    userDetails.address;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="space-y-4">
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-4">Enrollment Details:</h4>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Select
                  value={userDetails.gender}
                  onValueChange={(value) => handleInputChange('gender', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="education">Education Level *</Label>
                <Input
                  id="education"
                  value={userDetails.education}
                  onChange={(e) => handleInputChange('education', e.target.value)}
                  placeholder="e.g., High School, Bachelor's, etc."
                />
              </div>


              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={userDetails.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter your address"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="joinCommunity"
                checked={userDetails.joinCommunity}
                onCheckedChange={(checked) => handleInputChange('joinCommunity', checked)}
              />
              <Label htmlFor="joinCommunity" className='text-sm'>
                I would like to join the Ethics For Youth community and receive updates.
              </Label>
            </div>
          </div>
        </div>

        {spotsLeft && spotsLeft <= 5 && spotsLeft > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-amber-800 text-sm font-medium">
              ⚡ Only {spotsLeft} spots remaining! Enroll now to secure your place.
            </p>
          </div>
        )}

        {spotsLeft === 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-800 text-sm font-medium">
              🚫 This course is fully booked. Join our waitlist to be notified if spots open up.
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-6">
        <div className="w-full space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Course Fee:</span>
            <span className="text-2xl font-bold text-primary">
              ₹{course.registrationFee.toFixed(2)}
            </span>
          </div>

          {!isEnrolled && course.status === 'active' && (!spotsLeft || spotsLeft > 0) ? (
            <PaymentButton
              amount={course.registrationFee}
              currency="INR"
              userDetails={{
                id: `user_${Date.now()}`,
                name: userDetails.name,
                email: userDetails.email,
                phone: userDetails.phone,
                notes: {
                  details: `Registration via course form. Age: ${userDetails.age}, Gender: ${userDetails.gender}, Education: ${userDetails.education || 'Not provided'}, Address: ${userDetails.address || 'Not provided'}${userDetails.joinCommunity ? ', Wants to join community' : ''}`
                }
              }}
              itemDetails={{
                id: course.id,
                name: course.title,
                itemType: 'course'
              }}
              onSuccess={handlePaymentSuccess}
              onFailure={handlePaymentFailure}
              onCancel={handlePaymentCancel}
              className="w-full"
              disabled={!isFormValid}
            >
              Proceed to Checkout - ₹{course.registrationFee}
            </PaymentButton>
          ) : isEnrolled ? (
            <div className="text-center py-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-semibold">✅ Successfully Enrolled!</p>
                <p className="text-green-700 text-sm mt-1">
                  Check your email for course access details and materials.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-600 font-medium">
                  {course.status !== 'active'
                    ? 'Enrollment Currently Unavailable'
                    : 'Course Full'}
                </p>
                {course.status !== 'active' && (
                  <p className="text-gray-500 text-sm mt-1">
                    This course is not currently accepting new enrollments.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default CourseRegistrationPayment;