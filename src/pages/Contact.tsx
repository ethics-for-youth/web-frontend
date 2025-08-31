import { useState } from 'react';
import { Mail, MessageSquare, Phone, Send, MapPin, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateMessage } from '@/hooks/useMessages';
import { CreateMessageRequest } from '@/services';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    category: '',
    phone: '',
    isPublic: false
  });

  // Use the real messages API
  const createMessage = useCreateMessage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      return;
    }

    try {
      const messageData: CreateMessageRequest = {
        senderName: formData.name,
        senderEmail: formData.email,
        senderPhone: formData.phone || undefined,
        content: formData.message,
        messageType: (formData.category as any) || 'general',
        isPublic: formData.isPublic,
        priority: 'normal',
      };

      await createMessage.mutateAsync(messageData);

      // Reset form on success
      setFormData({
        name: '',
        email: '',
        message: '',
        category: '',
        phone: '',
        isPublic: false
      });
    } catch (error) {
      // Error handling is done in the hook
      console.error('Failed to send message:', error);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const categoryOptions = [
    { value: 'feedback', label: 'Feedback' },
    { value: 'complaint', label: 'Complaint' },
    { value: 'thank-you', label: 'Testimonial' },
    { value: 'suggestion', label: 'Suggestion' },
    { value: 'general', label: 'General Inquiry' }
  ];

  const contactMethods = [
    {
      icon: MessageSquare,
      title: 'WhatsApp',
      description: 'Quick response via WhatsApp',
      value: '+919214808891',
      action: 'https://wa.me/919214808891',
      actionText: 'Message on WhatsApp'
    },
    {
      icon: MessageSquare,
      title: 'Instagram',
      description: 'Follow us on Instagram',
      value: '@ethicsforyouth',
      action: 'https://instagram.com/ethicsforyouth',
      actionText: 'Follow on Instagram'
    },
    {
      icon: Mail,
      title: 'Email',
      description: 'Send us an email',
      value: 'ethicsforyouth@gmail.com',
      action: 'mailto:ethicsforyouth@gmail.com',
      actionText: 'Send Email'
    }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have questions about our programs, courses, or want to get involved? 
            We'd love to hear from you. Reach out to us through any of the methods below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-card bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-primary">Contact Information</CardTitle>
                <CardDescription>
                  Choose your preferred way to reach us
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactMethods.map((method, index) => {
                  const IconComponent = method.icon;
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <IconComponent className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{method.title}</h3>
                          <p className="text-sm text-muted-foreground">{method.description}</p>
                        </div>
                      </div>
                      <p className="text-muted-foreground ml-11">{method.value}</p>
                      <Button 
                        asChild 
                        variant="outline" 
                        size="sm" 
                        className="ml-11"
                      >
                        <a href={method.action} target="_blank" rel="noopener noreferrer">
                          {method.actionText}
                        </a>
                      </Button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="shadow-card bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-primary">Office Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Response Time</p>
                    <p className="text-sm text-muted-foreground">Within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Location</p>
                    <p className="text-sm text-muted-foreground">Community Center<br />Downtown Area</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-card bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">Send Us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
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
                      <Label htmlFor="category">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone (Optional)</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Your phone number"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      required
                      placeholder="Tell us about your inquiry, questions, or how we can help you..."
                      rows={6}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isPublic"
                      checked={formData.isPublic}
                      onCheckedChange={(checked) => handleInputChange('isPublic', checked as boolean)}
                    />
                    <Label htmlFor="isPublic" className="text-sm">
                      I agree that this message can be published as a testimonial (optional)
                    </Label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                    disabled={createMessage.isPending}
                  >
                    {createMessage.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By submitting this form, you agree to our privacy policy. 
                    We respect your privacy and will never share your information.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">How can I join your programs?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  You can register for events through our Events page, enroll in courses through 
                  our Courses page, or join as a volunteer through our Volunteer page. Each has 
                  a simple registration form.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">Are your programs free?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Most of our events are free. Courses have a nominal fee to cover materials 
                  and instruction costs. Financial assistance is available for those who need it.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">What age groups do you serve?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our programs are primarily designed for youth and young adults aged 13-35, 
                  though some events welcome participants of all ages.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">Do I need prior Islamic knowledge?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No prior knowledge is required! We welcome Muslims at all levels of learning 
                  and provide supportive environments for everyone to grow.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;