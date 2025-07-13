import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Registration } from '@/types';

interface RegistrationFormProps {
  type: 'Event' | 'Course' | 'Volunteer';
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const registration: Partial<Registration> = {
        ...formData,
        age: parseInt(formData.age),
        gender: formData.gender as 'Male' | 'Female',
        type,
        ...(type === 'Event' && { relatedEventId: relatedId }),
        ...(type === 'Course' && { relatedCourseId: relatedId }),
        createdAt: new Date().toISOString(),
      };

      console.log('Registration submitted:', registration);
      
      toast({
        title: "Registration Successful!",
        description: `Thank you for registering for ${title}. We'll contact you soon with further details.`,
      });

      // Reset form
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
      toast({
        title: "Registration Failed",
        description: "There was an error submitting your registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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