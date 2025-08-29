import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import EventRegistrationPayment from '@/components/EventRegistrationPayment';
import CourseRegistrationPayment from '@/components/CourseRegistrationPayment';
import PaymentButton from '@/components/PaymentButton';
import { RazorpayResponse } from '@/types';

const PaymentDemo = () => {
  const [selectedDemo, setSelectedDemo] = useState<'event' | 'course' | 'custom'>('event');
  const [customAmount, setCustomAmount] = useState<number>(100);

  // Mock data for testing
  const mockUser = {
    id: 'user_demo_123',
    name: 'Ahmed Abdullah',
    email: 'ahmed.abdullah@example.com',
    phone: '+91 9876543210'
  };

  const mockEvent = {
    id: 'event_demo_456',
    title: 'Islamic History Workshop',
    description: 'Explore the rich history of Islamic civilization through interactive discussions and expert presentations.',
    date: '2024-03-15T10:00:00Z',
    location: 'Community Center, New Delhi',
    category: 'Workshop',
    status: 'active',
    registrationFee: 150,
    maxParticipants: 50,
    registrationDeadline: '2024-03-10T23:59:59Z',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z'
  };

  const mockCourse = {
    id: 'course_demo_789',
    title: 'Quranic Arabic Fundamentals',
    description: 'Learn the fundamentals of Quranic Arabic to better understand the Holy Quran. This comprehensive course covers basic grammar, vocabulary, and sentence structure.',
    duration: '8 weeks',
    mode: 'Online',
    enrollmentLink: 'https://example.com',
    isActive: true,
    registrationFee: 299,
    maxParticipants: 30,
    instructor: 'Sheikh Ahmad Al-Baghdadi',
    level: 'beginner',
    materials: 'Arabic dictionary, notebook, and Quran',
    startDate: '2024-03-20T09:00:00Z',
    endDate: '2024-05-15T10:30:00Z',
    schedule: 'Tuesdays and Thursdays, 9:00 AM - 10:30 AM',
    status: 'active'
  };

  const handleEventRegistrationSuccess = (response: RazorpayResponse) => {
    console.log('Event registration successful:', response);
  };

  const handleCourseRegistrationSuccess = (response: RazorpayResponse) => {
    console.log('Course registration successful:', response);
  };

  const handleCustomPaymentSuccess = (response: RazorpayResponse) => {
    console.log('Custom payment successful:', response);
    alert(`Payment of ₹${customAmount} completed successfully!\nPayment ID: ${response.razorpay_payment_id}`);
  };

  const handlePaymentFailure = (error: Error) => {
    console.error('Payment failed:', error);
    alert(`Payment failed: ${error.message}`);
  };

  const handlePaymentCancel = () => {
    console.log('Payment cancelled');
    alert('Payment was cancelled by user');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-4">
          Razorpay Payment Integration Demo
        </h1>
        <p className="text-muted-foreground">
          Test the payment integration with Razorpay. Use test mode for safe testing.
        </p>
      </div>

      {/* Demo Selection */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Select Demo Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <Button
              variant={selectedDemo === 'event' ? 'default' : 'outline'}
              onClick={() => setSelectedDemo('event')}
            >
              Event Registration
            </Button>
            <Button
              variant={selectedDemo === 'course' ? 'default' : 'outline'}
              onClick={() => setSelectedDemo('course')}
            >
              Course Enrollment
            </Button>
            <Button
              variant={selectedDemo === 'custom' ? 'default' : 'outline'}
              onClick={() => setSelectedDemo('custom')}
            >
              Custom Payment
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Information */}
      <Card className="mb-8 bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Test Mode Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-blue-700">
            <p className="font-semibold mb-2">Test Card Details:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p><span className="font-medium">Success:</span> 4111 1111 1111 1111</p>
              </div>
              <div>
                <p><span className="font-medium">Failure:</span> 4000 0000 0000 0002</p>
              </div>
              <div>
                <p><span className="font-medium">CVV:</span> Any 3 digits</p>
                <p><span className="font-medium">Expiry:</span> Any future date</p>
              </div>
            </div>
          </div>
          <div className="text-blue-600 text-sm bg-blue-100 p-2 rounded">
            <strong>Note:</strong> This is test mode. No actual money will be charged.
          </div>
        </CardContent>
      </Card>

      {/* Event Registration Demo */}
      {selectedDemo === 'event' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Event Registration Demo</h2>
          <EventRegistrationPayment
            event={mockEvent}
            onRegistrationSuccess={handleEventRegistrationSuccess}
          />
        </div>
      )}

      {/* Course Registration Demo */}
      {selectedDemo === 'course' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Course Enrollment Demo</h2>
          <CourseRegistrationPayment
            course={mockCourse}
            onRegistrationSuccess={handleCourseRegistrationSuccess}
          />
        </div>
      )}

      {/* Custom Payment Demo */}
      {selectedDemo === 'custom' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Custom Payment Demo</h2>
          <Card>
            <CardHeader>
              <CardTitle>Custom Amount Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount">Payment Amount (INR)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="1"
                  max="100000"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(Number(e.target.value))}
                  className="max-w-xs"
                />
              </div>

              <div className="space-y-4">
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Payment Details:</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p><span className="font-medium">Customer:</span> {mockUser.name}</p>
                    <p><span className="font-medium">Email:</span> {mockUser.email}</p>
                    <p><span className="font-medium">Amount:</span> ₹{customAmount}</p>
                  </div>
                </div>

                <PaymentButton
                  amount={customAmount}
                  currency="INR"
                  userDetails={mockUser}
                  eventDetails={{
                    id: 'custom_payment_demo',
                    name: 'Custom Payment Demo'
                  }}
                  onSuccess={handleCustomPaymentSuccess}
                  onFailure={handlePaymentFailure}
                  onCancel={handlePaymentCancel}
                  className="w-full max-w-sm"
                >
                  Pay ₹{customAmount}
                </PaymentButton>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Integration Information */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Integration Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Environment Configuration:</h4>
            <div className="bg-gray-50 p-3 rounded text-sm font-mono space-y-1">
              <p>VITE_RAZORPAY_KEY_ID: {import.meta.env.VITE_RAZORPAY_KEY_ID || 'Not configured'}</p>
              <p>VITE_API_BASE_URL: {import.meta.env.VITE_API_BASE_URL}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">API Endpoint:</h4>
            <div className="bg-gray-50 p-3 rounded text-sm font-mono">
              <p>POST {import.meta.env.VITE_API_BASE_URL}/payments/create-order</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Components Used:</h4>
            <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
              <li><code>PaymentButton</code> - Reusable payment button component</li>
              <li><code>EventRegistrationPayment</code> - Complete event registration with payment</li>
              <li><code>CourseRegistrationPayment</code> - Complete course enrollment with payment</li>
              <li><code>paymentsApi</code> - API service for payment operations</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentDemo;