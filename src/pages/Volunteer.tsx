import { Heart, Users, BookOpen, Hand, Globe, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RegistrationForm from '@/components/RegistrationForm';
import { volunteerOpportunities, volunteerBenefits } from '@/data/mockData';
import volunteerImage from '@/assets/volunteer-illustration.jpg';

const Volunteer = () => {
  // Icon mapping for volunteer opportunities
  const iconMap = {
    BookOpen,
    Users,
    Heart,
    Hand,
    Globe,
    Star
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img 
              src={volunteerImage} 
              alt="Volunteer Community" 
              className="w-64 h-48 object-cover rounded-lg shadow-soft"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Join Our Volunteer Community
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Make a meaningful difference in the lives of young Muslims. Join our dedicated team 
            of volunteers and contribute to building a stronger, more connected community.
          </p>
        </div>

        {/* Volunteer Opportunities */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">
            How You Can Help
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {volunteerOpportunities.map((opportunity, index) => {
              const IconComponent = iconMap[opportunity.icon as keyof typeof iconMap];
              return (
                <Card key={index} className="shadow-card hover:shadow-lg transition-shadow bg-gradient-card">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground">
                      {opportunity.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Volunteer Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* Why Volunteer */}
            <Card className="shadow-card bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">Why Volunteer With Us?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {volunteerBenefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Volunteer Requirements */}
            <Card className="shadow-card bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">What We're Looking For</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Basic Requirements:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Commitment to Islamic values and ethics</li>
                      <li>• Age 16 or older (under 18 requires parental consent)</li>
                      <li>• Reliable and punctual</li>
                      <li>• Good communication skills</li>
                      <li>• Minimum 2-3 hours per month commitment</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Preferred Qualities:</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Previous volunteer or leadership experience</li>
                      <li>• Bilingual abilities (English, Hindi, Urdu, etc.)</li>
                      <li>• Technical skills (Social Media, design, etc.)</li>
                      <li>• Public speaking comfort</li>
                      <li>• Event planning experience</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Process */}
            <Card className="shadow-card bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">Volunteer Process</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Submit Application</h4>
                      <p className="text-muted-foreground">Fill out the volunteer registration form</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Introduction & Orientation</h4>
                      <p className="text-muted-foreground">Brief Introduction and orientation session</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Start Volunteering</h4>
                      <p className="text-muted-foreground">Begin your volunteer journey with us</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Volunteer Registration Form */}
          <div className="lg:col-span-1">
            <RegistrationForm
              type="Volunteer"
              title="Volunteer Program"
              showPaymentConfirmation={false}
            />
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center bg-primary text-primary-foreground rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="mb-6 text-primary-foreground/90 max-w-2xl mx-auto">
            Your contribution, no matter how small, can have a lasting impact on our community. 
            Join us in our mission to empower young Muslims with knowledge and values.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="text-sm text-primary-foreground/80">
              Questions? Contact us at{' '}
              <a href="mailto:volunteer@ethicsforyouth.org" className="underline hover:text-primary-foreground">
             ethicsforyouth@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Volunteer;