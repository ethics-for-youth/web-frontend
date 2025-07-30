import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateRegistration, useVolunteerApplication } from '@/hooks/useRegistrations';
import { NewCreateRegistrationRequest } from '@/services';
import { VolunteerJoinRequest } from '@/types/api';

interface RegistrationFormProps {
  type: 'Event' | 'Course' | 'Competition' | 'Volunteer';
  relatedId?: string;
  title: string;
  showPaymentConfirmation?: boolean;
}

const RegistrationForm = ({ type, relatedId, title, showPaymentConfirmation = false }: RegistrationFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsappNumber: '',
    gender: '',
    age: '',
    education: '',
    address: '',
    joinCommunity: false,
  });

  // Use appropriate mutation based on type
  const createRegistration = useCreateRegistration();
  const submitVolunteerApplication = useVolunteerApplication();

  const isSubmitting = type === 'Volunteer' 
    ? submitVolunteerApplication.isPending 
    : createRegistration.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.email || !formData.whatsappNumber || !formData.gender || !formData.age) {
      return;
    }

    try {
      if (type === 'Volunteer') {
        // Submit volunteer application
        const volunteerData: VolunteerJoinRequest = {
          name: formData.name,
          email: formData.email,
          phone: formData.whatsappNumber,
          skills: ['General Volunteer'], // Default skill - you might want to add a skills field to the form
          availability: formData.address || 'Flexible', // Using address field as availability for now
          // Note: These fields are optional according to the API spec
          experience: 'Filled via registration form',
          motivation: 'Applied through website',
          preferredRoles: ['General Support'],
        };

        await submitVolunteerApplication.mutateAsync(volunteerData);
      } else {
        // Submit event/course registration using new API structure
        const registrationData: NewCreateRegistrationRequest = {
          userId: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Generate a user ID
          itemId: relatedId || '',
          itemType: type.toLowerCase() as 'event' | 'course' | 'competition',
          userEmail: formData.email,
          userName: formData.name,
          userPhone: formData.whatsappNumber,
          notes: `Registration via ${type} form. Age: ${formData.age}, Gender: ${formData.gender}, Education: ${formData.education}, Address: ${formData.address}${formData.joinCommunity ? ', Wants to join community' : ''}`,
        };

        await createRegistration.mutateAsync(registrationData);
      }

      // Reset form on success
      setFormData({
        name: '',
        email: '',
        whatsappNumber: '',
        gender: '',
        age: '',
        education: '',
        address: '',
        joinCommunity: false,
      });
    } catch (error) {
      // Error handling is done in the mutation hooks
      console.error('Submission error:', error);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>{type} Registration</CardTitle>
        <CardDescription>
          {type === 'Event' && 'Register for this event to secure your spot.'}
          {type === 'Course' && 'Enroll in this course to begin your learning journey.'}
          {type === 'Volunteer' && 'Join our volunteer community and make a difference.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp Number *</Label>
              <Input
                id="whatsapp"
                value={formData.whatsappNumber}
                onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                required
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                required
                min="13"
                max="35"
                placeholder="Enter your age"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="education">Education Level *</Label>
              <Input
                id="education"
                value={formData.education}
                onChange={(e) => handleInputChange('education', e.target.value)}
                required
                placeholder="e.g., High School, Bachelor's, etc."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              required
              placeholder="Enter your full address"
              rows={3}
            />
          </div>

          {showPaymentConfirmation && (
            <div className="space-y-2">
              <Label htmlFor="payment">Payment Confirmation *</Label>
              <Input
                id="payment"
                type="file"
                accept="image/*,.pdf"
                required
                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary file:text-primary-foreground"
              />
              <p className="text-sm text-muted-foreground">
                Upload screenshot or receipt of payment confirmation
              </p>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="community"
              checked={formData.joinCommunity}
              onCheckedChange={(checked) => handleInputChange('joinCommunity', !!checked)}
            />
            <Label htmlFor="community" className="text-sm">
              I would like to join the Ethics For Youth community and receive updates
            </Label>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : `Register for ${type}`}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            By submitting this form, you agree to our terms and conditions and privacy policy.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegistrationForm;