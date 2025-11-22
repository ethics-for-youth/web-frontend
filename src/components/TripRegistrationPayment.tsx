import { useState } from 'react';
import { Calendar, MapPin, Users, Clock, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Trip, RazorpayResponse } from '@/types';

interface TripRegistrationPaymentProps {
    trip: Trip;
    onRegistrationSuccess?: (response: RazorpayResponse) => void;
}

const TripRegistrationPayment = ({ trip, onRegistrationSuccess }: TripRegistrationPaymentProps) => {
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        education: '',
        age: '',
        gender: '',
        emergencyContact: '',
        emergencyPhone: '',
        specialRequirements: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            toast({
                title: "Name Required",
                description: "Please enter your full name",
                variant: "destructive"
            });
            return false;
        }
        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
            toast({
                title: "Valid Email Required",
                description: "Please enter a valid email address",
                variant: "destructive"
            });
            return false;
        }
        if (!formData.phone.trim()) {
            toast({
                title: "Phone Number Required",
                description: "Please enter your phone number",
                variant: "destructive"
            });
            return false;
        }
        if (!formData.age || parseInt(formData.age) < 1) {
            toast({
                title: "Valid Age Required",
                description: "Please enter your age",
                variant: "destructive"
            });
            return false;
        }
        if (!formData.gender) {
            toast({
                title: "Gender Required",
                description: "Please select your gender",
                variant: "destructive"
            });
            return false;
        }
        if (!formData.emergencyContact.trim()) {
            toast({
                title: "Emergency Contact Required",
                description: "Please enter an emergency contact name",
                variant: "destructive"
            });
            return false;
        }
        if (!formData.emergencyPhone.trim()) {
            toast({
                title: "Emergency Phone Required",
                description: "Please enter an emergency contact phone number",
                variant: "destructive"
            });
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Create registration in backend
            const registrationResponse = await fetch('/api/registrations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'Trip',
                    relatedId: trip.id,
                    ...formData
                }),
            });

            if (!registrationResponse.ok) {
                throw new Error('Failed to create registration');
            }

            const registration = await registrationResponse.json();

            // If there's a registration fee, initiate payment
            if (trip.registrationFee && trip.registrationFee > 0) {
                // Create Razorpay order
                const orderResponse = await fetch('/api/razorpay/create-order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        amount: trip.registrationFee,
                        registrationId: registration.id,
                    }),
                });

                if (!orderResponse.ok) {
                    throw new Error('Failed to create payment order');
                }

                const orderData = await orderResponse.json();

                // Initialize Razorpay
                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                    amount: orderData.amount,
                    currency: 'INR',
                    name: 'Ethics For Youth',
                    description: `Registration for ${trip.title}`,
                    order_id: orderData.id,
                    handler: async (response: RazorpayResponse) => {
                        // Verify payment
                        const verifyResponse = await fetch('/api/razorpay/verify-payment', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                registrationId: registration.id,
                            }),
                        });

                        if (verifyResponse.ok) {
                            setRegistrationSuccess(true);
                            toast({
                                title: "Registration Successful!",
                                description: "Your payment has been confirmed. Check your email for details.",
                            });
                            onRegistrationSuccess?.(response);
                        } else {
                            throw new Error('Payment verification failed');
                        }
                    },
                    prefill: {
                        name: formData.name,
                        email: formData.email,
                        contact: formData.phone,
                    },
                    theme: {
                        color: '#3B82F6',
                    },
                };

                const razorpay = new (window as any).Razorpay(options);
                razorpay.open();
            } else {
                // Free trip - just show success
                setRegistrationSuccess(true);
                toast({
                    title: "Registration Successful!",
                    description: "You've been registered for the trip. Check your email for details.",
                });
            }
        } catch (error) {
            console.error('Registration error:', error);
            toast({
                title: "Registration Failed",
                description: "There was an error processing your registration. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (registrationSuccess) {
        return (
            <Card className="shadow-card sticky top-4">
                <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Registration Successful!</h3>
                    <p className="text-muted-foreground mb-6">
                        You've successfully registered for {trip.title}. Check your email for confirmation and trip details.
                    </p>
                    <Button asChild className="w-full">
                        <a href="/">Return to Home</a>
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="shadow-card sticky top-4">
            <CardHeader className="rounded-t-md bg-gradient-primary text-primary-foreground">
                <CardTitle>Register for Trip</CardTitle>
                <CardDescription className="text-primary-foreground/90">
                    Fill in your details to secure your seat
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Full Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input
                                id="name"
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="Enter your full name"
                                required
                            />
                        </div>
                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                placeholder="your.email@example.com"
                                required
                            />
                        </div>
                    </div>


<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Phone */}
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="+91-XXXXXXXXXX"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="education">Education Level *</Label>
                        <Input
                            id="education"
                            value={formData.education}
                            onChange={(e) => handleInputChange('education', e.target.value)}
                            placeholder="e.g., High School, Bachelor's, etc."
                            required
                        />
                    </div>
</div>
                    {/* Age & Gender */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="age">Age *</Label>
                            <Input
                                id="age"
                                type="number"
                                value={formData.age}
                                onChange={(e) => handleInputChange('age', e.target.value)}
                                placeholder="18"
                                min="1"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gender">Gender *</Label>
                            <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Emergency Contact */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="space-y-2">
                        <Label htmlFor="emergencyContact">Emergency Contact Name *</Label>
                        <Input
                            id="emergencyContact"
                            type="text"
                            value={formData.emergencyContact}
                            onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                            placeholder="Parent/Guardian name"
                            required
                        />
                    </div>

                    {/* Emergency Phone */}
                    <div className="space-y-2">
                        <Label htmlFor="emergencyPhone">Emergency Contact Phone *</Label>
                        <Input
                            id="emergencyPhone"
                            type="tel"
                            value={formData.emergencyPhone}
                            onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                            placeholder="+91-XXXXXXXXXX"
                            required
                        />
                    </div>
                    </div>

                    {/* Special Requirements */}
                    <div className="space-y-2">
                        <Label htmlFor="specialRequirements">Special Requirements (Optional)</Label>
                        <Textarea
                            id="specialRequirements"
                            value={formData.specialRequirements}
                            onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                            placeholder="Any dietary restrictions, medical conditions, or special needs..."
                            rows={3}
                        />
                    </div>

                    {/* Registration Fee Display */}
                    {trip.registrationFee && trip.registrationFee > 0 && (
                        <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg">
                            <p className="text-sm font-medium text-foreground mb-1">Registration Fee</p>
                            <p className="text-2xl font-bold text-primary">
                                ₹{trip.registrationFee.toLocaleString('en-IN')}
                            </p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full bg-gradient-primary hover:opacity-90"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                {trip.registrationFee && trip.registrationFee > 0
                                    ? 'Proceed to Payment'
                                    : 'Complete Registration'}
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                        )}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                        By registering, you agree to our terms and conditions
                    </p>
                </form>
            </CardContent>
        </Card>
    );
};

export default TripRegistrationPayment;