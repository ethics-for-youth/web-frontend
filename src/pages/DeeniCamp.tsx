import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, ArrowLeft, CheckCircle, Loader2, AlertCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import RegistrationForm from '@/components/RegistrationForm';
import TripRegistrationPayment from '@/components/TripRegistrationPayment';
import { formatDateForDisplay } from '@/utils/dateUtils';
import { RazorpayResponse, Trip } from '@/types';
import TripPoster from '@/assets/TripPoster.webp';

// DUMMY DATA FOR POC - Replace with API call later
const dummyTrip: Trip = {
  id: '1',
  title: 'DEENI CAMP 2023',
  description: 'A spiritual and deeni camp like no other! For the youth, by the youth. This transformative journey combines Islamic education with practical worship experiences, designed specifically for young Muslims seeking to strengthen their faith and build lasting connections with their peers.',
  startDate: '2024-10-01T12:00:00',
  endDate: '2024-10-02T14:00:00',
  location: 'Masjid Abu Bakr, Penza Tannery, Banthar, Uttar Pradesh',
  meetingPoint: 'Mashrique Masjid, Oriental Compound, Nai Chungi, Delhi',
  maxParticipants: 100,
  ageLimit: '16-30 years',
  registrationFee: 300, // Change to 0 to demo free trip
  status: 'active',
  imageUrl: TripPoster,
  organizer: 'Ethics For Youth',
  chiefMentor: 'Maulana Yahya Nomani',
  duration: '2 Days, 1 Night',
  activities: [
    'Salah Workshop - Learn proper prayer techniques and etiquettes',
    // 'Dawah Workshop - Effective ways to share Islamic teachings',
    'Lecture Sessions - Deep dive into Quranic wisdom',
    'Motivational Talk - Inspiring speeches from renowned scholars',
    'Tazkiya Night - Spiritual purification and soul cleansing session',
    'Q&A Sessions - Open forum with Islamic scholars',
    'Personal Counselling - One-on-one guidance sessions',
    'Delicious Food - Complimentary meals and refreshments',
    'Group Activities - Team building exercises',
    'Dhikr Sessions - Collective remembrance of Allah',
    'Many More Surprises - Additional activities planned!'
  ],
  transportInfo: 'EFY Bus will depart from Mashrique Masjid sharp at 12:00 PM on October 1st. Please arrive 15 minutes early for attendance. Return journey will start at 2:00 PM on October 2nd.',
  contact: {
    instagram: '@ethicsforyouth',
    whatsapp: '+91-8604615340',
    email: 'info@ethicsforyouth.org'
  },
  createdAt: '2024-09-15T10:00:00',
  updatedAt: '2024-09-20T15:30:00'
};

const TripDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  // FOR POC - Using dummy data
  const trip = dummyTrip;
  const isLoading = false;
  const error = null;
  
  // UNCOMMENT THIS WHEN READY TO USE REAL API:
  // const { data: trip, isLoading, error } = useTrip(id || '');

  const handleTripRegistrationSuccess = (response: RazorpayResponse) => {
    console.log('Trip registration successful:', response);
    // You can add additional success handling here like redirecting to dashboard
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-4 text-destructive" />
          <h1 className="text-2xl font-bold text-foreground mb-4">Failed to Load Trip</h1>
          <p className="text-muted-foreground mb-6">
            There was an error loading the trip details. Please try again.
          </p>
          <Button asChild>
            <Link to="/trips">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Trips
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold text-foreground mb-4">Trip Not Found</h1>
          <p className="text-muted-foreground mb-6">The trip you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/trips">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Trips
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button asChild variant="ghost">
            <Link to="/trips">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Trips
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trip Details */}
          <div className="lg:col-span-2">
            {/* Trip Poster */}
            <div className="flex justify-center mb-6">
              <Card className="shadow-card bg-gradient-card overflow-hidden max-w-md w-full">
                <img
                  src={trip.imageUrl || TripPoster}
                  alt={trip.title}
                  className="w-full h-auto object-contain"
                />
              </Card>
            </div>

            <Card className="shadow-card bg-gradient-card">
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                    {trip.title}
                  </h1>
                  <Badge variant={trip.status === 'active' ? "default" : "secondary"} className="ml-4">
                    {trip.status === 'active' ? 'Active' : trip.status === 'inactive' ? 'Inactive' : 'Completed'}
                  </Badge>
                </div>

                {/* Trip Meta Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Duration</p>
                      <p className="text-muted-foreground">{trip.duration || '2 Days'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Age Limit</p>
                      <p className="text-muted-foreground">{trip.ageLimit || '16+'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Organizer</p>
                      <p className="text-muted-foreground">{trip.organizer || 'Ethics For Youth'}</p>
                    </div>
                  </div>
                </div>

                {/* Trip Fee Information */}
                <div className="mb-8 p-6 bg-primary/5 border border-primary/10 rounded-lg">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Registration Fee</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-primary">
                        {trip.registrationFee && trip.registrationFee > 0 
                          ? `₹${trip.registrationFee.toLocaleString('en-IN')}` 
                          : 'Free'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {trip.registrationFee && trip.registrationFee > 0 
                          ? 'One-time registration fee' 
                          : 'No registration fee required'}
                      </p>
                    </div>
                    {trip.registrationFee && trip.registrationFee > 0 && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        Payment Required
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Trip Description */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-foreground mb-4">About This Trip</h2>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-muted-foreground leading-relaxed">
                      {trip.description}
                    </p>
                    {trip.chiefMentor && (
                      <p className="text-foreground font-medium mt-4">
                        Chief Mentor: {trip.chiefMentor}
                      </p>
                    )}
                  </div>
                </div>

                {/* Camp Activities */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Camp Activities</h2>
                  {trip.activities && trip.activities.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {trip.activities.map((activity, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                          <span className="text-muted-foreground">{activity}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Activity details coming soon.</p>
                  )}
                </div>

                {/* Trip Schedule & Location */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Schedule & Location</h2>
                  <div className="p-6 bg-muted/50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                      {trip.startDate && (
                        <div>
                          <p className="font-medium text-foreground mb-1">Start Date:</p>
                          <p>{formatDateForDisplay(trip.startDate)}</p>
                        </div>
                      )}
                      {trip.endDate && (
                        <div>
                          <p className="font-medium text-foreground mb-1">End Date:</p>
                          <p>{formatDateForDisplay(trip.endDate)}</p>
                        </div>
                      )}
                      {trip.location && (
                        <div>
                          <p className="font-medium text-foreground mb-1">Location:</p>
                          <p>{trip.location}</p>
                        </div>
                      )}
                      {trip.maxParticipants && (
                        <div>
                          <p className="font-medium text-foreground mb-1">Max Participants:</p>
                          <p>{trip.maxParticipants} seats</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Transportation Details */}
                {trip.meetingPoint && (
                  <div className="mb-8 p-6 bg-primary/5 border border-primary/10 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      Transportation Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p className="text-foreground">
                        <strong>Meeting Point:</strong>{' '}
                        <span className="text-muted-foreground">{trip.meetingPoint}</span>
                      </p>
                      {trip.transportInfo && (
                        <p className="text-muted-foreground">{trip.transportInfo}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Contact Information */}
                {trip.contact && (
                  <div className="p-6 bg-muted/50 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-3">Have Questions?</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      {trip.contact.instagram && (
                        <p>
                          Instagram:{' '}
                          <a 
                            href={`https://instagram.com/${trip.contact.instagram.replace('@', '')}`} 
                            className="text-primary hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {trip.contact.instagram}
                          </a>
                        </p>
                      )}
                      {trip.contact.whatsapp && (
                        <p>
                          WhatsApp:{' '}
                          <a 
                            href={`https://wa.me/${trip.contact.whatsapp.replace(/[^0-9]/g, '')}`} 
                            className="text-primary hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {trip.contact.whatsapp}
                          </a>
                        </p>
                      )}
                      {trip.contact.email && (
                        <p>
                          Email:{' '}
                          <a 
                            href={`mailto:${trip.contact.email}`} 
                            className="text-primary hover:underline"
                          >
                            {trip.contact.email}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Registration Form */}
          <div className="lg:col-span-1">
            {trip.status === 'active' ? (
              <>
                {/* Show payment component if trip has registration fee */}
                {trip.registrationFee && trip.registrationFee > 0 ? (
                  <TripRegistrationPayment
                    trip={{
                      ...trip,
                      registrationFee: trip.registrationFee
                    }}
                    onRegistrationSuccess={handleTripRegistrationSuccess}
                  />
                ) : (
                  /* Fallback to registration form for free trips */
                  <RegistrationForm
                    type="Trip"
                    relatedId={trip.id}
                    title={trip.title}
                    showPaymentConfirmation={false}
                  />
                )}
              </>
            ) : (
              <Card className="shadow-card">
                <CardContent className="p-6 text-center">
                  <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Trip Not Available</h3>
                  <p className="text-muted-foreground mb-4">
                    This trip is currently not accepting new registrations. 
                    Check back later or contact us for updates.
                  </p>
                  <div className="space-y-2">
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/trips">
                        View Active Trips
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" className="w-full">
                      <Link to="/contact">
                        Get Notified
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetail;